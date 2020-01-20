/**道具id枚举 */
enum ProxyEnum {
	SEND = 0,
	RECEIVE = 1,
}
const ProtoDef = gameProto.MessageID

class LoseProxy {
	public static buff: { [key: number]: any };

	public static clearBuff(){
		this.buff = null;
	}

	/**添加协议 */
	public static addBuff(protocol: number, sendData: any) {
		if(protocol == ProtoDef.C2S_SYS_HEARTBEAT) return;
		if(!this.buff) this.buff = {};
		this.buff[protocol] = sendData;
	}

	/**s发送缓存协议 */
	public static sendBuff() {
		if (this.buff) {
			for (let key in this.buff) {
				AGame.CSocket.getInstance().sendProtocol(Number(key), this.buff[key]);
			}
			this.buff = null;
		}
	}
}
class BaseProxy extends egret.HashObject {
	public constructor() {
		super();
	}

	protected listenerProtoNotifications(): any[] {
		return [];
	}

	/**第二版协议监听 */
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [];
	}

	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let protocol: number = notification.getName() as number;
		// console.log("BaseProxy:execute--->>", protocol, body);
		switch (protocol) {
			case 0:
				break;
			default:
				break;
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	public register() {
		let interests: any[] = this.listenerProtoNotifications();
		let len: Number = interests.length;
		if (len > 0) {
			for (let i: number = 0; i < len; i++) {
				AGame.ServiceBuilder.addProtoHandler(interests[i][0], interests[i][1], interests[i][2], interests[i][3]);
			}
		}
		this.registerNew();
	}

	private registerNew() {
		let interests: any[] = this.listenerProtoNotificationsNew();
		let len: Number = interests.length;
		if (len > 0) {
			for (let i: number = 0; i < len; i++) {
				if (interests[i][3] == ProxyEnum.SEND) {
					AGame.ServiceBuilder.addProtoHandler(interests[i][0], interests[i][1], interests[i][2], '');
				} else {
					AGame.ServiceBuilder.addProtoHandler(interests[i][0], interests[i][1], '', interests[i][2]);
				}
			}
		}
	}
}