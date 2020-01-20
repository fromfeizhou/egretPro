class TavernProxy extends BaseProxy {

	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.TAVERN_INFO, this, 'TavernInfoReq', 'TavernInfoResp'],				         //酒馆信息
			[ProtoDef.TAVERN_ATTRACT, this, 'TavernAttractReq', 'TavernAttractResp'],				// 招募1次   招募10次   
		];
	}
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_SCORE_EXCHANGE, this, 'C2S_SCORE_EXCHANGE', ProxyEnum.SEND],// 积分兑换红将
			[ProtoDef.S2C_SCORE_EXCHANGE, this, 'S2C_SCORE_EXCHANGE', ProxyEnum.RECEIVE],

		]
	}
	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.TAVERN_INFO: {
				let data = body as gameProto.ITavernInfoResp;
				NormalModel.free = data.freeAttract;
				com_main.EventMgr.dispatchEvent(TavernEvent.TAVERN_UPDATE_FREE, null);
				break;
			}
			case ProtoDef.S2C_SCORE_EXCHANGE: {   //保底积分兑换
				let data = body as gameProto.IS2C_SCORE_EXCHANGE;
				Utils.open_view(TASK_UI.TAVERN_INFO_PANEL, data);
				TavernProxy.send_TAVERN_INFO();
				break;
			}
			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**
	 * 获得招募信息
	 */
	public static send_TAVERN_INFO() {
		let data: gameProto.TavernInfoReq = AGame.ServiceBuilder.newClazz(ProtoDef.TAVERN_INFO);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 招募(0--1次  1---10次)
	 */
	public static send_TAVERN_ATTRACT(tavernType: number) {
		let data: gameProto.TavernAttractReq = AGame.ServiceBuilder.newClazz(ProtoDef.TAVERN_ATTRACT);
		data.tavernType = tavernType;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**积分兑换红将*/
	public static C2S_SCORE_EXCHANGE() {
		let data: gameProto.C2S_SCORE_EXCHANGE = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SCORE_EXCHANGE);
		AGame.ServiceBuilder.sendMessage(data);
	}
}