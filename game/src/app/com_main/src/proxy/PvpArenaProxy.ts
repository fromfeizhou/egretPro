
//pvp竞技
class PvpArenaProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.APK_GET_MY_APK, this, 'GetMyApkReq', 'GetMyApkResp'],//本人的竞技场信息
			[ProtoDef.APK_GET_CHALLENGE_LIST, this, 'GetChallengeListReq', 'GetChallengeListResp'],//挑战者数据
			[ProtoDef.APK_CHALLENGE, this, 'ChallengeReq', 'ChallengeResp'],//发起挑战
			[ProtoDef.APK_BUY_COUNT, this, 'GetBuyCountReq', 'GetBuyCountResp'],//购买次数
			[ProtoDef.APK_GET_RANK_LIST, this, 'GetRankListReq', 'GetRankListResp'],//排行榜
			[ProtoDef.APK_GET_CHALLENGE_HIS, this, 'GetChallengeHisReq', 'GetChallengeHisResp'],//战报
			[ProtoDef.APK_CHALLENGE_FAST, this, 'ChallengeFastReq', 'ChallengeFastResp'],//扫荡
			[ProtoDef.APK_CHALLENGE_CHECK, this, 'ChallengeCheckReq', 'ChallengeCheckResp'],//扫荡
			
		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.APK_GET_MY_APK:{
				PvpArenaModel.initPvpArenaInfo(body);
				break;
			}
			case ProtoDef.APK_GET_CHALLENGE_LIST:{

				break;
			}
			case ProtoDef.APK_CHALLENGE:{
				let battleId = body.battleId;
				if(battleId > 0){
					com_main.UpManager.history();
					// SceneManager.enterScene(SceneEnums.BATTLE_MAP, battleId, false);
				}					
				break;
			}
			
			case ProtoDef.APK_BUY_COUNT:{
				PvpArenaModel.setBuyNum(body);
				break;
			}
			case ProtoDef.APK_GET_CHALLENGE_HIS:{
				
				break;
			}
			case ProtoDef.APK_CHALLENGE_FAST:{
				PvpArenaModel.OnFastChallenge(body);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}
	
	/**请求竞技场数据 */
	public static send_APK_GET_MY_APK() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_MY_APK);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**获取可挑战队列 */
	public static send_APK_GET_CHALLENGE_LIST() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_CHALLENGE_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**购买次数 */
	public static send_APK_BUY_COUNT() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_BUY_COUNT);
		data.num = 1;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**挑战 */
	public static send_APK_CHALLENGE(rank:number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_CHALLENGE);
		data.rank = rank;
		//data.armyId = armyId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**排行榜数据 */
	public static send_APK_RANK_LIST(count:number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_RANK_LIST);
		data.count = count;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**战报数据 */
	public static send_APK_CHALLENGE_HIS(count:number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_GET_CHALLENGE_HIS);
		data.count = count;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**扫荡 */
	public static send_APK_FAST_CHALLENGE(rank:number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_CHALLENGE_FAST);
		data.rank = rank;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**挑战检查 */
	public static send_APK_REFRESH_RANK(id:number,rank:number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APK_CHALLENGE_CHECK);
		data.playerId = id;
		data.rank = rank;
		AGame.ServiceBuilder.sendMessage(data);
	}
}