/**场景队列弹窗 */
class ScenePopQueWnd {
	private static m_tFuncOpens = [];	/**功能开放队列 */
	private static m_kingchangeList = [];//称王
	private static m_tActNotice: gameProto.IActivityNotiseConfig[] = [];
	/**升级界面 */
	private static m_bLevel = false;

	/**收益变动 */
	private static m_tPopAwardView: { old: IItemInfo[], new: IItemInfo[] };
	/**离线收益 */
	private static m_bOffLine = false;

	/**战力变动 */
	// private static m_bFight = false;
	/**gm推送礼包 */
	private static m_giftbag = false;

	private static m_emperorList = [];//称帝

	/**是否存在未处理弹窗 */
	public static hasQueWnd() {
		if (this.isQueScene()) {
			if (this.m_kingchangeList.length > 0) return true;
			if (this.m_tActNotice.length > 0) return true;
			if (this.m_bOffLine) return true;
			if (this.m_tPopAwardView) return true;
			if (this.m_bLevel) return true;
			if (this.m_giftbag) return true;
			if (this.m_tFuncOpens.length > 0) return true;
			// if (this.m_bFight) return true;
			if (this.m_emperorList.length > 0) return true;
		}
		return false;
	}

	/**是否弹窗场景 */
	public static isQueScene() {
		let sceneEnum: SceneEnums = SceneManager.getCurrScene();
		if (sceneEnum == SceneEnums.MAIN_CITY || sceneEnum == SceneEnums.WORLD_CITY || sceneEnum == SceneEnums.AUTO_BATTLE_MAP) {
			return true;
		}
		return false;
	}

	/**升级界面 */
	public static addLevelWnd() {
		this.m_bLevel = true;
	}
	/**gm推送礼包界面 */
	public static addGiftbagWnd() {
		this.m_giftbag = true;
	}

	/**离线收益界面 */
	public static addOffLineWnd() {
		if (RoleData.offlineStamp > 0) {
			let time = TimerUtils.getServerTime() - RoleData.offlineStamp;
			if (time > 300) this.m_bOffLine = true;
		}
	}

	/**收益变动界面 */
	public static addRewardWnd(param: { old: IItemInfo[], new: IItemInfo[] }) {
		this.m_tPopAwardView = param;
	}


	/**升级界面 */
	public static addFightWnd() {
		// this.m_bFight = true;
		if (GeneralModel.FIGHT_RECORD == 0) return;

		let nowFight = GeneralModel.getGeneralTotalFight();
		if (GeneralModel.FIGHT_RECORD == nowFight) {
			return
		} else if (nowFight > GeneralModel.FIGHT_RECORD) {
			//弹出战力变动界面
			Utils.open_view(TASK_UI.NOR_FIGHT_VIEW, nowFight);
		} else {
			GeneralModel.FIGHT_RECORD = nowFight;
		}
	}

	/**添加新功能预告队列 */
	public static addNewFuctionAnim(ftList: number[]) {
		if (ftList && ftList.length > 0) {
			let len = ftList.length;
			for (let i = 0; i < len; i++) {
				let ft = ftList[i];
				let cfg = FunctionModel.getFunctionCfgById(ft);
				if (cfg.isRemind == 1) {
					this.m_tFuncOpens.push(ft);
				} else {
					//直接添加
					com_main.EventMgr.dispatchEvent(FunctionEvent.NEW_FUNC_OPEN, { funcId: ft, show: true });
					FunctionModel.addNewFunc(ft);
				}
			}
		}
	}
	/**添加新的活动通告 */
	public static addNewActNotice(...actList: gameProto.IActivityNotiseConfig[]) {
		if (isNull(actList))
			return;
		let len: number = actList.length;
		if (len == 0)
			return;
		for (let i = 0; i < len; i++) {
			this.m_tActNotice.push(actList[i]);
		}
	}
	/**添加称王变化 */
	public static addKingNotice(...noticeList: gameProto.IKingChangeNotice[]) {
		if (isNull(noticeList))
			return;
		let len: number = noticeList.length;
		if (len == 0)
			return;
		for (let i = 0; i < len; i++) {
			this.m_kingchangeList.push(noticeList[i]);
		}
	}
	/**添加称帝公告 */
	public static addEmperorNotice(...noticeList: gameProto.IS2C_EMPEROR_CHANE_NOTICE[]) {
		if (isNull(noticeList)) return;
		let len: number = noticeList.length;
		if (len == 0) return;
		for (let i = 0; i < len; i++) {
			this.m_emperorList.push(noticeList[i]);
		}
	}
	/**
	 *检查弹窗队列
	 * @return 是否激活动画（新手检测需要判断）
	 */
	public static checkQueQue() {
		if (!this.isQueScene()) return;

		if (this.m_kingchangeList.length > 0) {
			let notice = this.m_kingchangeList.shift();
			Utils.open_view(TASK_UI.COUNTRY_CORONATION_PANEL, notice);
			return;
		}

		if (this.m_emperorList.length > 0) {
			let notice = this.m_emperorList.shift();
			Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION, notice);
			return;
		}

		if (this.m_tActNotice.length > 0) {
			let act = this.m_tActNotice.shift();
			Utils.open_view(TASK_UI.COM_ACT_NOTICE, act);
			return;
		}
		//离线奖励弹窗
		if (this.m_bOffLine) {
			Utils.open_view(TASK_UI.POS_PATROL_OFFLINE_REWARD_VIEW);
			this.m_bOffLine = false;
			return;
		}

		if (this.m_tPopAwardView) {
			Utils.open_view(TASK_UI.POS_PATROL_REWARD_CHANGE_VIEW, this.m_tPopAwardView);
			this.m_tPopAwardView = null;
			return;
		}
		if (this.m_bLevel) {
			// Utils.open_view(TASK_UI.PLAYER_LEVEL_UP_VIEW, { id: RoleData.level, type: LevelUpConditionType.ROLE_LEVEL });
			Utils.open_view(TASK_UI.POP_ROLE_LEVEL_PANEL);
			this.m_bLevel = false;
			return;
		}
		if (this.m_tFuncOpens.length > 0) {
			let ft = this.m_tFuncOpens.shift();
			FunctionModel.addNewFunc(ft);
			Utils.open_view(TASK_UI.POP_FUNCITON_NEW_VIEW, ft);
			return;
		}
		if (this.m_giftbag) {
			Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
			this.m_giftbag = false;
		}

		// if(this.m_bFight){
		// 	this.m_bFight = false;
		// 	let nowFight = GeneralModel.getGeneralTotalFight();
		// 	if(GeneralModel.FIGHT_RECORD == nowFight){
		// 		SceneManager.onSceneWndEnter();
		// 	}else{
		// 		//弹出战力变动界面
		// 		Utils.open_view(TASK_UI.NOR_FIGHT_VIEW, nowFight);
		// 	}
		// }
	}
}