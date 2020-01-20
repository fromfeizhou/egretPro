module AGame {
	// class ProtoBuilder {
	// 	private m_pBuilder: any;

	// 	public constructor() {
	// 		// var proto: string = RES.getRes("game_proto");
	// 		// this.m_pBuilder = dcodeIO.ProtoBuf.loadProto(proto);
	// 	}

	// 	public getClazz(name: string) {
	// 		return this.m_pBuilder.build(name);
	// 	}

	// 	public newClazz(protocol: number, name: any) {
	// 		var clazz: any = this.getClazz(name);
	// 		var instance = new clazz();

	// 		instance.protocol = protocol;
	// 		return instance;
	// 	}

	// 	public decode(name: any, buffer: any) {
	// 		try {
	// 			var clazz = this.getClazz(name);
	// 			return clazz.decode(buffer);
	// 		} catch (e) {
	// 			console.log(e, name);
	// 		}
	// 	}
	// }

	export class ServiceBuilder {
		// private m_pBuilder: ProtoBuilder = new ProtoBuilder();
		private m_pObserver: HandlerObserver = new HandlerObserver();
		private m_pProtocolMap: any = {};
		private m_pViewEvents: any = {};

		public register(protocol: number, commandClassRef: any, reqClass: string, resClass: string = null) {
			if (resClass) {
				this.m_pProtocolMap[protocol] = [commandClassRef, reqClass, resClass];
			} else {
				this.m_pProtocolMap[protocol] = [commandClassRef, reqClass];
			}
		}

		public notifyModel(protocol: number, data: any) {
			if (this.m_pProtocolMap[protocol]) {
				var model = this.getProtoModel(protocol);
				if (model && model.execute) {
					model.execute(new Notification(protocol, data));
				}
			} else {
				console.log("ServiceBuilder:notifyModel--->>协议号事件派发失败，没有Proxy监听!! protocol:", protocol);
			}
		}

		public registerProxy(proxyName: any, notify: Function, target: any): void {
			if (notify) {
				var events: any[] = this.m_pViewEvents[target.hashCode];
				if (events && events.indexOf(proxyName) > -1) return;

				this.m_pObserver.registerObserver(proxyName, new Observer(notify, target));

				if (events)
					events.push(proxyName);
				else
					this.m_pViewEvents[target.hashCode] = [proxyName];
			}
		}

		public notifyProxy(notification: INotification) {
			this.m_pObserver.notifyObservers(notification);
		}

		public removeProxy(target: any): void {
			var events: any[] = this.m_pViewEvents[target.hashCode];
			if (!events) return;

			for (var i: number = 0; i < events.length; i++) {
				this.m_pObserver.removeObserver(events[i], target);
			}
			delete this.m_pViewEvents[target.hashCode];
		}

		private getProtoModel(protocol: number) {
			return this.m_pProtocolMap[protocol][0];
		}

		private getProtoByReq(protocol: number) {
			var protos: any[] = this.m_pProtocolMap[protocol];
			return this.m_pProtocolMap[protocol][1];
		}

		private getProtoByResp(protocol: number) {
			var protos: any[] = this.m_pProtocolMap[protocol];
			if (!protos) return null;
			return protos.length == 2 ? protos[1] : protos[2];
		}

		// public newClazz(protocol: number) {
		// 	// let req = this.getProtoByReq(protocol);
		// 	// if (!req) return null;
		// 	// return this.m_pBuilder.newClazz(protocol, req);

		// 	var temp = this.getProtoByReq(protocol);
		// 	if(!temp)
		// 	{
		// 		console.log("protocol is nill ="+protocol);
		// 		return;
		// 	}
		// 	var protocolObj = gameProto[temp];
		// 	if(!protocolObj){
		// 		console.log("protocolObj is nill ="+protocolObj);	
		// 		return;			
		// 	}

		// 	let obj = protocolObj.fromObject({});
		// 	obj["protocol"] = protocol;

		// 	return obj;
		// }

		public decode(protocol: number, buffer: any) {
			// let resp = this.getProtoByResp(protocol);
			// if (!resp) return null;
			// return this.m_pBuilder.decode(resp, buffer);

			let a = this.getProtoByResp(protocol);
			if(a == '' || a == null)
			{
				error('没有找到对应协议号：'+protocol);
				return ;
			}
			let protocolObj = gameProto[a];
			let message = protocolObj.decode(buffer);
			debugPb(protocol,`收到协议：${protocol}  ${ProtoDef[protocol]}` ,message );
			
			return message;
		}

		public decode_name(name: any, buffer: any) {
			// return this.m_pBuilder.decode(name, buffer);
		}


		private static REQ_RESP_DIFF = 0;
		private static _instance: ServiceBuilder;

		public static get Instance() {
			if (!ServiceBuilder._instance) {
				ServiceBuilder._instance = new ServiceBuilder();
			}
			return ServiceBuilder._instance;
		}

		public static addProtoHandler(protocol: number, commandClassRef: any, reqClass: string, resClass: string = null) {
			ServiceBuilder.Instance.register(protocol, commandClassRef, reqClass, resClass);
		}

		public static notifyProtoHandler(protocol: number, data?: any) {
			ServiceBuilder.Instance.notifyModel(protocol - ServiceBuilder.REQ_RESP_DIFF, data);
		}

		public static notifyView(notification: INotification) {
			ServiceBuilder.Instance.notifyProxy(notification);
		}

		public static newClazz(protocol: number):any {
			return {protocol:protocol}//ServiceBuilder.Instance.newClazz(protocol);
		}

		public static decode(protocol: number, buffer: any) {
			return ServiceBuilder.Instance.decode(protocol, buffer);
		}

		public static decode_name(name: any, buffer: any) {
			return ServiceBuilder.Instance.decode_name(name, buffer);
		}

		// public static requestWithProtocol(protocol: number, notify: Function, target: any) {
		// 	this.sendMessage(ServiceBuilder.Instance.newClazz(protocol), notify, target);
		// }

		public static sendMessage(sendData: any, notify?: Function, target?: any, showLoad: boolean = false) {
			ServiceBuilder.Instance.registerProxy(sendData.protocol, notify, target);
			// let buffer = sendData.
			var clz =  gameProto[ServiceBuilder.Instance.getProtoByReq(sendData.protocol)];

			// var errMsg = clz.verify(sendData);
			// if (errMsg)
			// 	throw Error(errMsg);
			// var message = clz.create(sendData);// or use .fromObject if conversion is necessary
			var buf = clz.encode(sendData).finish();
			debugPb(sendData.protocol,`发送协议：${sendData.protocol}  ${ProtoDef[sendData.protocol]}` ,sendData );
			CSocket.getInstance().sendProtocol(sendData.protocol, buf, showLoad);


		}

		public static removeProxy(target?: any) {
			ServiceBuilder.Instance.removeProxy(target);
		}
	}
}