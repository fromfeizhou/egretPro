/**
 * 历史战役
 */
class HistoryBattleProxy extends BaseProxy {

	public constructor() {
		super();
	}

	protected listenerProtoNotificationsNew(): any[] {
		return [
			[ProtoDef.C2S_GET_HISTORY_WAR_INFO, this, 'C2S_GET_HISTORY_WAR_INFO', ProxyEnum.SEND],// 获取章节信息
			[ProtoDef.S2C_GET_HISTORY_WAR_INFO, this, 'S2C_GET_HISTORY_WAR_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_HISTORY_WAR_CLEAN_UP, this, 'C2S_HISTORY_WAR_CLEAN_UP', ProxyEnum.SEND],// 扫荡
			[ProtoDef.S2C_HISTORY_WAR_CLEAN_UP, this, 'S2C_HISTORY_WAR_CLEAN_UP', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_HISTORY_WAR_FIGHT, this, 'C2S_HISTORY_WAR_FIGHT', ProxyEnum.SEND],// 请求战斗

			[ProtoDef.C2S_HISTORY_WAR_CLEAN_UP_COUNT, this, 'C2S_HISTORY_WAR_CLEAN_UP_COUNT', ProxyEnum.SEND],// 请求战斗



			[ProtoDef.C2S_HISTORY_WAR_GET_BOX, this, 'C2S_HISTORY_WAR_GET_BOX', ProxyEnum.SEND],// 领取宝箱
			[ProtoDef.S2C_HISTORY_WAR_GET_BOX, this, 'S2C_HISTORY_WAR_GET_BOX', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_HISTROY_WAR_BATTLE_INFO, this, 'S2C_HISTROY_WAR_BATTLE_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_HISTORY_WAR_RESET, this, 'S2C_HISTORY_WAR_RESET', ProxyEnum.RECEIVE],
		];
	}

	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let proto = notification.getName() as number;
		switch (proto) {
			case ProtoDef.S2C_GET_HISTORY_WAR_INFO: {
				let data = body as gameProto.IS2C_GET_HISTORY_WAR_INFO;
				HistoryBattleModel.parseInfo(data.chapterInfos)
				break;
			}
			case ProtoDef.S2C_HISTORY_WAR_CLEAN_UP: {
				let data = body as gameProto.IS2C_HISTORY_WAR_CLEAN_UP;
				Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.valuesMessage);
				HistoryBattleModel.updateHistoryLevel(data)
				com_main.EventMgr.dispatchEvent(HistoryWarEvent.HISTORY_UPDATE_NUM, data.fightNum);
				break;
			}

			case ProtoDef.S2C_HISTORY_WAR_GET_BOX: {
				let data = body as gameProto.IS2C_HISTORY_WAR_GET_BOX;
				HistoryBattleModel.updateRaward(data)
				break;
			}
			case ProtoDef.S2C_HISTROY_WAR_BATTLE_INFO: {
				let data = body as gameProto.IS2C_HISTROY_WAR_BATTLE_INFO;
				HistoryBattleModel.updateBattleRes(data);
				FightResponseUtil.addResultCache(notification);
				break;
			}
			case ProtoDef.S2C_HISTORY_WAR_RESET: {
				let data = body as gameProto.IS2C_HISTORY_WAR_RESET;
				HistoryBattleModel.resetHistoryFightNum();
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	/////////////////////////////////////////////////////////////////////
	/**章节信息*/
	public static C2S_GET_HISTORY_WAR_INFO() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_HISTORY_WAR_INFO) as gameProto.C2S_GET_HISTORY_WAR_INFO;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**扫荡 */
	public static C2S_HISTORY_WAR_CLEAN_UP(lev: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_CLEAN_UP) as gameProto.C2S_HISTORY_WAR_CLEAN_UP;
		data.levelId = lev;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**请求战斗 */
	public static C2S_HISTORY_WAR_FIGHT(lev: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_FIGHT) as gameProto.C2S_HISTORY_WAR_FIGHT;
		data.levelId = lev;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**请求领取宝箱 */
	public static C2S_HISTORY_WAR_GET_BOX(chapterId: number, starRewardId: number) {
		HistoryBattleModel.curBoxAwardChapterId = chapterId;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_GET_BOX) as gameProto.C2S_HISTORY_WAR_GET_BOX;
		data.starRewardId = starRewardId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**购买次数 */
	public static C2S_HISTORY_WAR_CLEAN_UP_COUNT() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_HISTORY_WAR_CLEAN_UP_COUNT) as gameProto.C2S_HISTORY_WAR_CLEAN_UP_COUNT;
		AGame.ServiceBuilder.sendMessage(data);
	}
}