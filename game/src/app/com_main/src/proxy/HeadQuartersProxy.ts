class HeadQuartersProxy extends BaseProxy {
	/**挂机副本界面 */
	private static OPEN_HEAD_QUARTER: boolean;

	public constructor() {
		super();
	}

	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.HQ_GET_INFO, this, 'GetHeadQuartersInfoReq', 'GetHeadQuartersInfoResp'], //请求获得行营信息
			[ProtoDef.HQ_CLEAN_UP, this, 'CleanUpHQReq', 'CleanUpHQResp'], //请求行营扫荡信息
			[ProtoDef.HQ_CHALLENGES, this, 'ChallengesHQReq', 'ChallengesHQResp'], //行营请求挑战信息
			[ProtoDef.HQ_RECEIVE_BOX, this, 'HQReceiveBoxReq', 'HQReceiveBoxResp'], //获得宝箱
			[ProtoDef.HQ_BUY_RESET_COUNT, this, 'HQBuyResetCountReq', 'HQBuyResetCountResp'], //行营購買挑戰次數信息
			[ProtoDef.HQ_UPDATE_CHAPTER, this, '', 'HQUpdateChapter'], //刷新行营挑战信息
			[ProtoDef.HQ_CHAPTER_INFO, this, 'GetHeadQuarterChapterInfoReq', 'GetHeadQuarterChapterInfoResp'], //関卡翻頁請求
		];
	}

	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let proto = notification.getName() as number;
		switch (proto) {
			case ProtoDef.HQ_GET_INFO: {
				HeadQuartersModel.parseInfo(body.info);
				if (HeadQuartersProxy.OPEN_HEAD_QUARTER) {
					HeadQuartersProxy.OPEN_HEAD_QUARTER = false;
					Utils.open_view(TASK_UI.HEADQUARTER_MAIN_PANEL);
				}
				// Utils.open_view(TASK_UI.HEADQUARTER_MAIN_PANEL);
				break;
			}
			case ProtoDef.HQ_CLEAN_UP: {
				let vo = body as gameProto.CleanUpHQResp;
				Utils.open_view(TASK_UI.GET_REWARD_VIEW, vo.valuesMessage);
				com_main.EventMgr.dispatchEvent(QuarterEvent.QUARTER_INFO_NUM, vo.bossCount);
				break;
			}
			case ProtoDef.HQ_CHALLENGES: {
				let VO = body as gameProto.ChallengesHQResp;
				// SceneManager.enterScene(SceneEnums.BATTLE_MAP, VO.battleId);
				break;
			}
			case ProtoDef.HQ_RECEIVE_BOX: {
				let data = body as gameProto.HQReceiveBoxResp;
				HeadQuartersModel.updateRaward(data.info);
				break;
			}

			case ProtoDef.HQ_BUY_RESET_COUNT: {
				EffectUtils.showTips(GCode(CLEnum.MAT_BUY_SUC), 1, true);
				break;
			}
			case ProtoDef.HQ_UPDATE_CHAPTER: {
				HeadQuartersModel.parseInfo(body.info);
				break;
			}
			case ProtoDef.HQ_CHAPTER_INFO: {   //関卡翻頁返回
				HeadQuartersModel.updateChapterInfo([body.chapterInfo]);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	/////////////////////////////////////////////////////////////////////

	/** 请求获得行营信息,viewChapterId:界面默认显示的章节*/
	public static send_HQ_GET_INFO(fightId: number = 0, chapterId: number = 0) {
		if (fightId > 0) {
			HeadQuartersModel.setFightRecord(fightId);
		}
		console.log("======Get")
		let data: gameProto.GetHeadQuartersInfoReq = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_GET_INFO);
		data.chapterId = chapterId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	public static send_HQ_GET_INFO_OPEN_VIEW(fightId: number = 0, chapterId: number = 0) {
		HeadQuartersProxy.OPEN_HEAD_QUARTER = true;
		this.send_HQ_GET_INFO(fightId, chapterId)
	}

	/** 请求获得行营信息,前一章界面默认显示的章节*/
	public static send_HQ_GET_LAST_INFO(fightId: number = 0, chapterId: number = 0) {
		let data: gameProto.GetHeadQuartersInfoReq = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_GET_INFO);
		data.chapterId = chapterId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/** 關卡翻頁请求*/
	public static HQ_CHAPTER_INFO(chapterId: number) {
		let data: gameProto.GetHeadQuartersInfoReq = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_CHAPTER_INFO);
		data.chapterId = chapterId;
		AGame.ServiceBuilder.sendMessage(data);
	}


	/** 请求行营扫荡信息 */
	public static send_HQ_CLEAN_UP(stageId: number) {
		let data: gameProto.CleanUpHQReq = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_CLEAN_UP);
		data.id = stageId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/** 请求行营挑战信息 */
	public static send_HQ_CHALLENGES(stageId: number, armyId: number) {
		// HeadQuartersModel.BattleCheckPointId = stageId;
		let data: gameProto.ChallengesHQReq = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_CHALLENGES);
		data.id = stageId;
		data.armyId = armyId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/** 请求获得宝箱(boxRewardId:包宝箱ID) */
	public static send_HQ_RECEIVE_BOX(boxRewardId: number) {
		let data: gameProto.HQReceiveBoxReq = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_RECEIVE_BOX);
		data.starRewardId = boxRewardId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/** 行营购买挑战次数 */
	public static send_HQ_BUY_RESET_COUNT(moduleId: number): void {
		let data: gameProto.HQBuyResetCountReq = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_BUY_RESET_COUNT);
		data.moduleId = moduleId;
		AGame.ServiceBuilder.sendMessage(data);
	}
}