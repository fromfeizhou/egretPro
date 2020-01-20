var AGame;
(function (AGame) {
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
    var ServiceBuilder = /** @class */ (function () {
        function ServiceBuilder() {
            // private m_pBuilder: ProtoBuilder = new ProtoBuilder();
            this.m_pObserver = new AGame.HandlerObserver();
            this.m_pProtocolMap = {};
            this.m_pViewEvents = {};
        }
        ServiceBuilder.prototype.register = function (protocol, commandClassRef, reqClass, resClass) {
            if (resClass === void 0) { resClass = null; }
            if (resClass) {
                this.m_pProtocolMap[protocol] = [commandClassRef, reqClass, resClass];
            }
            else {
                this.m_pProtocolMap[protocol] = [commandClassRef, reqClass];
            }
        };
        ServiceBuilder.prototype.notifyModel = function (protocol, data) {
            if (this.m_pProtocolMap[protocol]) {
                var model = this.getProtoModel(protocol);
                if (model && model.execute) {
                    model.execute(new AGame.Notification(protocol, data));
                }
            }
            else {
                console.log("ServiceBuilder:notifyModel--->>协议号事件派发失败，没有Proxy监听!! protocol:", protocol);
            }
        };
        ServiceBuilder.prototype.registerProxy = function (proxyName, notify, target) {
            if (notify) {
                var events = this.m_pViewEvents[target.hashCode];
                if (events && events.indexOf(proxyName) > -1)
                    return;
                this.m_pObserver.registerObserver(proxyName, new AGame.Observer(notify, target));
                if (events)
                    events.push(proxyName);
                else
                    this.m_pViewEvents[target.hashCode] = [proxyName];
            }
        };
        ServiceBuilder.prototype.notifyProxy = function (notification) {
            this.m_pObserver.notifyObservers(notification);
        };
        ServiceBuilder.prototype.removeProxy = function (target) {
            var events = this.m_pViewEvents[target.hashCode];
            if (!events)
                return;
            for (var i = 0; i < events.length; i++) {
                this.m_pObserver.removeObserver(events[i], target);
            }
            delete this.m_pViewEvents[target.hashCode];
        };
        ServiceBuilder.prototype.getProtoModel = function (protocol) {
            return this.m_pProtocolMap[protocol][0];
        };
        ServiceBuilder.prototype.getProtoByReq = function (protocol) {
            var protos = this.m_pProtocolMap[protocol];
            return this.m_pProtocolMap[protocol][1];
        };
        ServiceBuilder.prototype.getProtoByResp = function (protocol) {
            var protos = this.m_pProtocolMap[protocol];
            if (!protos)
                return null;
            return protos.length == 2 ? protos[1] : protos[2];
        };
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
        ServiceBuilder.prototype.decode = function (protocol, buffer) {
            // let resp = this.getProtoByResp(protocol);
            // if (!resp) return null;
            // return this.m_pBuilder.decode(resp, buffer);
            var a = this.getProtoByResp(protocol);
            if (a == '' || a == null) {
                error('没有找到对应协议号：' + protocol);
                return;
            }
            var protocolObj = gameProto[a];
            var message = protocolObj.decode(buffer);
            debugPb(protocol, "\u6536\u5230\u534F\u8BAE\uFF1A" + protocol + "  " + ProtoDef[protocol], message);
            return message;
        };
        ServiceBuilder.prototype.decode_name = function (name, buffer) {
            // return this.m_pBuilder.decode(name, buffer);
        };
        Object.defineProperty(ServiceBuilder, "Instance", {
            get: function () {
                if (!ServiceBuilder._instance) {
                    ServiceBuilder._instance = new ServiceBuilder();
                }
                return ServiceBuilder._instance;
            },
            enumerable: true,
            configurable: true
        });
        ServiceBuilder.addProtoHandler = function (protocol, commandClassRef, reqClass, resClass) {
            if (resClass === void 0) { resClass = null; }
            ServiceBuilder.Instance.register(protocol, commandClassRef, reqClass, resClass);
        };
        ServiceBuilder.notifyProtoHandler = function (protocol, data) {
            ServiceBuilder.Instance.notifyModel(protocol - ServiceBuilder.REQ_RESP_DIFF, data);
        };
        ServiceBuilder.notifyView = function (notification) {
            ServiceBuilder.Instance.notifyProxy(notification);
        };
        ServiceBuilder.newClazz = function (protocol) {
            return { protocol: protocol }; //ServiceBuilder.Instance.newClazz(protocol);
        };
        ServiceBuilder.decode = function (protocol, buffer) {
            return ServiceBuilder.Instance.decode(protocol, buffer);
        };
        ServiceBuilder.decode_name = function (name, buffer) {
            return ServiceBuilder.Instance.decode_name(name, buffer);
        };
        // public static requestWithProtocol(protocol: number, notify: Function, target: any) {
        // 	this.sendMessage(ServiceBuilder.Instance.newClazz(protocol), notify, target);
        // }
        ServiceBuilder.sendMessage = function (sendData, notify, target, showLoad) {
            if (showLoad === void 0) { showLoad = false; }
            ServiceBuilder.Instance.registerProxy(sendData.protocol, notify, target);
            // let buffer = sendData.
            var clz = gameProto[ServiceBuilder.Instance.getProtoByReq(sendData.protocol)];
            // var errMsg = clz.verify(sendData);
            // if (errMsg)
            // 	throw Error(errMsg);
            // var message = clz.create(sendData);// or use .fromObject if conversion is necessary
            var buf = clz.encode(sendData).finish();
            debugPb(sendData.protocol, "\u53D1\u9001\u534F\u8BAE\uFF1A" + sendData.protocol + "  " + ProtoDef[sendData.protocol], sendData);
            AGame.CSocket.getInstance().sendProtocol(sendData.protocol, buf, showLoad);
        };
        ServiceBuilder.removeProxy = function (target) {
            ServiceBuilder.Instance.removeProxy(target);
        };
        ServiceBuilder.REQ_RESP_DIFF = 0;
        return ServiceBuilder;
    }());
    AGame.ServiceBuilder = ServiceBuilder;
})(AGame || (AGame = {}));
