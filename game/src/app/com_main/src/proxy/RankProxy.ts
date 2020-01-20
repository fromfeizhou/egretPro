class RankProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**第二版协议监听 */
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_RANK_COMM, this, 'C2S_RANK_COMM', ProxyEnum.SEND],	//排行榜
			[ProtoDef.S2C_RANK_COMM, this, 'S2C_RANK_COMM', ProxyEnum.RECEIVE],
		];
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.S2C_RANK_COMM: {
				let data = body as gameProto.IS2C_RANK_COMM;
				RankModel.parseRankData(data.rankId, data.rankData, data.userRankData);
				Loading.hide();
				break;
			}
			
			default:
				break;
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	/////////////////////////////////////////////////////////////////////
	/**
	 * 排行榜查询
	 */
	public static C2S_RANK_COMM(rankType: RankType) {
		if (RankModel.hasCache(rankType)) return;
		let data: gameProto.IC2S_RANK_COMM = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RANK_COMM);
		data.rankId = rankType;
		data.page = 1;
		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}
	
}