module com_main {

	/** 章节左右移动时间 */
	const MoveStageTime: number = 100;
	export class HistoryBattles extends CView {

		public static NAME = 'HistoryBattles';

		public m_Group: eui.Group;
		public m_RewardBar: com_main.HistoryBattlesReward;
		public m_Title: eui.Label;
		public m_BtnBack: com_main.CImage;
		public m_BtnPrev: com_main.CImage;
		public m_BtnNext: com_main.CImage;
		public m_ImgNotch: eui.Image;



		private m_tDesList: [number, string][];
		private m_nId: number;	//挑战副本id
		private m_nChapterId: number;	//章节id
		private m_tCollection: eui.ArrayCollection;


		private m_tChapterCfgs: ChapterConfig[];//当前章节数组
		/** 当前正在移动 */
		private m_isMoveing: boolean = false;


		public constructor() {
			super();
			this.name = HistoryBattles.NAME;
			this.initApp("HistoryBattle/HistoryBattlesSkin.exml");
		}

		public onDestroy(): void {
			if (this.m_RewardBar) {
				this.m_RewardBar.onDestroy();
				this.m_RewardBar = null;
			}
			com_main.EventMgr.removeEventByObject(HistoryWarEvent.HISTORY_UPDATE_NUM, this);//更新次數
			EventMgr.removeEventByObject(NormalEvent.NORMAL_FUN_COUNT, this);
			EventManager.removeEventListeners(this);
			super.onDestroy();

			SceneResGroupCfg.clearModelRes([ModuleEnums.HISTORY_BATTLE]);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_tCollection = new eui.ArrayCollection();
			// this.m_Group.anchorOffsetX = AGame.R.app.stageWidth;
			EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onBtn_Back);
			EventManager.addTouchScaleListener(this.m_BtnPrev, this, this.onBtn_Prev);
			EventManager.addTouchScaleListener(this.m_BtnNext, this, this.onBtn_Next);
			com_main.EventMgr.addEvent(HistoryWarEvent.HISTORY_UPDATE_NUM, this.numUpdate, this);//更新次數
			EventMgr.addEvent(NormalEvent.NORMAL_FUN_COUNT, this.onFunCount, this);

			// this.setCollection();
			this.initData();
			this.Refresh();

			this.toFixChapter();
			Utils.toStageBestScale(this.m_RewardBar);
			this.onGuideCondition();
			HeadQuartersModel.resetFightRecord();
		}

		/**適配關卡 */
		private toFixChapter() {
			let width = egret.MainContext.instance.stage.stageWidth;
			if (width < CONTENT_WIDTH) {
				Utils.toStageBestScale(this.m_Group);
				return;
			}
			for (let i = 0; i < this.m_Group.numChildren; i++) {
				let view = this.m_Group.getChildAt(i);
				view.width = width;
				view.x = -width + (i * width);
			}
		}



		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_GET_HISTORY_WAR_INFO,
				ProtoDef.S2C_HISTORY_WAR_CLEAN_UP,
				ProtoDef.S2C_HISTORY_WAR_GET_BOX,
				// ProtoDef.S2C_SYS_FUNCOUNT,
			];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.S2C_GET_HISTORY_WAR_INFO: {
					this.m_RewardBar.Refresh_BoxState();
					break;
				}
				case ProtoDef.S2C_HISTORY_WAR_CLEAN_UP: {
					this.m_RewardBar.Refresh_ChallengeCount();
					break;
				}
				case ProtoDef.S2C_HISTORY_WAR_GET_BOX: {
					let VO = body as gameProto.S2C_HISTORY_WAR_GET_BOX;
					Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
					this.m_RewardBar.initBoxItem();
					this.m_RewardBar.Refresh_BoxState();
					break;
				}
				// case ProtoDef.S2C_SYS_FUNCOUNT: {
				// 	let VO = body as gameProto.S2C_SYS_FUNCOUNT;
				// 	this.m_RewardBar.Refresh_ChallengeCount();
				// 	break;
				// }
			}
		}


		/**初始化默认状态 */
		public initData() {
			this.m_nId = HistoryBattleModel.getDefCopyId();
			let cfg = C.HistoryWarConfig[this.m_nId];
			this.m_nChapterId = cfg.chapterId;
		}

		/** 按钮 - 返回 */
		private onBtn_Back(): void {
			UpManager.history();
		}

		/** 按钮 - 上一个章节 */
		private onBtn_Prev(): void {
			if (!this.m_isMoveing) {
				this.m_nChapterId--;
				// HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
				this.moveTo(false);
			}
		}

		/** 按钮 - 下一个章节 */
		private onBtn_Next(): void {
			if (!this.m_isMoveing) {
				this.m_nChapterId++;
				// HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
				this.moveTo();
			}
		}
		/**更新次數 */
		private numUpdate(): void {
			this.m_RewardBar.Refresh_ChallengeCount();
		}
		/**功能次数变动 */
		private onFunCount(id: IFunCountEnum) {
			if (id != IFunCountEnum.HISTORY_WAR_COUNT)
				return;
			this.m_RewardBar.Refresh_ChallengeCount();
		}
		/**移動 */
		private moveTo(actDir: boolean = true) {
			this.m_isMoveing = true;
			for (let i = 0; i < this.m_Group.numChildren; i++) {
				let target = this.m_Group.getChildAt(i);
				let tw = egret.Tween.get(target);
				let tx = target.x;
				if (actDir) tx -= target.width;
				else tx += target.width;
				tw.to({ x: tx }, MoveStageTime);
				if (i == 0) tw.call(this.onMoveStageFinish, this, [actDir])
			}
			this.refreshViewVisivle(true);
		}

		/** 回调 - 章节移动完成 */
		private onMoveStageFinish(actDir: boolean): void {
			if (actDir) {
				let view = this.m_Group.getChildAt(0) as HistoryBattleChapter;
				view.x = view.width;
				view.setChapterInfo(this.m_nChapterId + 1, this.m_nId);
				this.m_Group.addChildAt(view, 2);
			} else {
				let view = this.m_Group.getChildAt(2) as HistoryBattleChapter;
				view.x = -view.width;
				view.setChapterInfo(this.m_nChapterId - 1, this.m_nId);
				this.m_Group.addChildAt(view, 0);
			}
			this.Refresh();
			this.refreshViewVisivle();
			this.m_isMoveing = false;
		}

		private refreshViewVisivle(isShow: boolean = false) {
			for (let i = 0; i < this.m_Group.numChildren; i++) {
				let view = this.m_Group.getChildAt(i) as HistoryBattleChapter;
				if (i == 1) {
					view.visible = true;
				} else {
					view.visible = isShow;
				}
			}
		}

		/** 界面刷新 */
		private Refresh(): void {
			if (this.m_nChapterId > 0) {
				this.Refresh_Title();
				this.setCurChpater();
				this.Refresh_BtnVisible();
				this.m_RewardBar.SetChapterId(this.m_nChapterId);
				this.m_RewardBar.Refresh_BoxState();
			}
			this.refreshViewVisivle()
		}

		/** 刷新 - 当前章节标题 */
		private Refresh_Title(): void {
			let nameCfg = C.HistoryWarChapterNameConfig[this.m_nChapterId]
			this.m_Title.textFlow = nameCfg ? Utils.htmlParser(GLan(nameCfg.chapterName)) : [];
		}


		/**設置當前章節 */
		private setCurChpater() {
			for (let i = 0; i < this.m_Group.numChildren; i++) {
				let view = this.m_Group.getChildAt(i) as HistoryBattleChapter;
				if (i == 0) view.setChapterInfo(this.m_nChapterId - 1, this.m_nId);
				else if (i == 1) {
					view.setChapterInfo(this.m_nChapterId, this.m_nId);
				}
				else view.setChapterInfo(this.m_nChapterId + 1, this.m_nId);
			}
		}

		/** 刷新 - 上下章节按钮状态 */
		private Refresh_BtnVisible(): void {
			this.m_BtnPrev.visible = (HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId - 1) && HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId - 1).length > 0) ? true : false;
			this.m_BtnNext.visible = (HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId + 1) && HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId + 1).length > 0) ? true : false;
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.QUARTER_WND);
		}
	}


}