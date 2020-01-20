module com_main {

	/** 章节左右移动时间 */
	const MoveStageTime: number = 100;
	export class HeadQuarters extends CView {

		public static NAME = 'HeadQuarters';

		public m_Group: eui.Group;
		public m_RewardBar: com_main.HeadQuartersReward;
		public m_Title: eui.Label;
		public m_BtnBack: com_main.CImage;
		public m_BtnPrev: com_main.CImage;
		public m_BtnNext: com_main.CImage;
		public m_tabBtn: eui.List;

		public m_BtnEasy: com_main.ComButton; //简单
		public m_BtnDiff: com_main.ComButton;  //困难

		private m_tDesList: [number, string][];
		private m_nLevel: IQuarLevel;	//难度枚举
		private m_nId: number;	//挑战副本id
		private m_nChapterId: number;	//章节id
		private m_tCollection: eui.ArrayCollection;


		private m_tChapterCfgs: ChapterConfig[];//当前章节数组
		/** 当前正在移动 */
		private m_isMoveing: boolean = false;

		private m_tParam: { copyId: number, copyType: number };//新增难度类型
		public constructor(param?: any) {
			super();
			this.name = HeadQuarters.NAME;
			this.m_tParam = param;
			this.initApp("headquarters/HeadQuartersSkin.exml");
		}

		public onDestroy(): void {
			if (this.m_RewardBar) {
				this.m_RewardBar.onDestroy();
				this.m_RewardBar = null;
			}
			com_main.EventMgr.removeEventByObject(QuarterEvent.QUARTER_UPDATE_NUM, this);//更新次數
			EventManager.removeEventListeners(this);
			super.onDestroy();

			SceneResGroupCfg.clearModelRes([ModuleEnums.QUARTERS_UI]);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_tCollection = new eui.ArrayCollection();
			this.m_tabBtn.dataProvider = this.m_tCollection;
			this.m_tabBtn.itemRenderer = TabBtnRender;
			this.m_tabBtn.addEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);
			com_main.EventMgr.addEvent(QuarterEvent.QUARTER_UPDATE_NUM, this.numUpdate, this);//更新次數
			//复用 显示对象关闭 使数据位置与ui位置一致 外部访问ui使用
			this.m_tabBtn.useVirtualLayout = false;
			// this.m_Group.anchorOffsetX = AGame.R.app.stageWidth;
			EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onBtn_Back);
			EventManager.addTouchScaleListener(this.m_BtnPrev, this, this.onBtn_Prev);
			EventManager.addTouchScaleListener(this.m_BtnNext, this, this.onBtn_Next);

			this.setCollection();
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

		/**初始化按钮 */
		public setCollection() {
			let heroArr = [];
			if (this.m_tParam) {
				HeadQuartersModel.LastLevel = this.m_tParam.copyType ? this.m_tParam.copyType : null;
			}
			for (let i = 0; i < 2; i++) {
				let sel: boolean;
				let name: string;
				if (i == 0) {
					name = GCode(CLEnum.NORMAL);
					sel = isNull(HeadQuartersModel.LastLevel) || HeadQuartersModel.LastLevel == IQuarLevel.NORMAL ? true : false;
				} else if (i == 1) {
					name = GCode(CLEnum.HARD);
					sel = HeadQuartersModel.LastLevel == IQuarLevel.HARD ? true : false;

				}
				let data: ITabBtnRD = { sel: sel, type: i, name: name };
				heroArr.push(data);
			}
			this.m_tCollection.replaceAll(heroArr);
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.HQ_GET_INFO,
				ProtoDef.HQ_CLEAN_UP,
				ProtoDef.HQ_CHALLENGES,
				ProtoDef.HQ_RECEIVE_BOX,
				ProtoDef.HQ_BUY_RESET_COUNT,
			];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.HQ_GET_INFO: {
					this.m_RewardBar.Refresh_BoxState();
					break;
				}
				case ProtoDef.HQ_CLEAN_UP: {
					this.m_RewardBar.Refresh_ChallengeCount();
					break;
				}
				case ProtoDef.HQ_CHALLENGES: {
					this.m_RewardBar.Refresh_ChallengeCount();
					break;
				}
				case ProtoDef.HQ_RECEIVE_BOX: {
					let VO = body as gameProto.HQReceiveBoxResp;
					Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
					this.m_RewardBar.initBoxItem();
					this.m_RewardBar.Refresh_BoxState();
					break;
				}
				case ProtoDef.HQ_BUY_RESET_COUNT: {
					this.m_RewardBar.Refresh_ChallengeCount();
					break;
				}
				case ProtoDef.HQ_CHAPTER_INFO: {         //切換章節返回
					this.m_RewardBar.Refresh_BoxState();
					break;
				}
			}
		}
		/**设置切卡回调 */
		public onTabBtnClick(e: egret.Event) {
			Sound.playTap();
			let selectedIndex = e.currentTarget.selectedIndex;
			for (let i = 0; i < this.m_tCollection.source.length; i++) {
				let info: ITabBtnRD = this.m_tCollection.getItemAt(i);
				info.sel = i == selectedIndex;
				this.m_tCollection.replaceItemAt(info, i);
			}
			this.m_nLevel = selectedIndex > 0 ? IQuarLevel.HARD : IQuarLevel.NORMAL;
			HeadQuartersModel.LastLevel = this.m_nLevel;
			this.initData();
			this.Refresh();
		}

		/**初始化默认状态 */
		public initData() {
			if (this.m_tParam) {
				if (this.m_tParam.copyId != 0) {
					this.m_nId = this.m_tParam.copyId;
					this.m_tParam = null;
				} else {//跳转表copyId为0，跳转到指定难度副本copyType为副本难度
					this.m_nId = HeadQuartersModel.getCheckpointId(HeadQuartersModel.LastLevel);
				}
			} else {
				this.m_nId = HeadQuartersModel.getCheckpointId(HeadQuartersModel.LastLevel);
			}
			let cfg = C.ChapterConfig[this.m_nId];
			this.m_nChapterId = cfg.chapterId;
			this.m_nLevel = C.ChapterConfig[this.m_nId].difficultyType;
		}

		/** 按钮 - 返回 */
		private onBtn_Back(): void {
			UpManager.history();
		}

		/** 按钮 - 上一个章节 */
		private onBtn_Prev(): void {
			if (!this.m_isMoveing) {
				this.m_nChapterId--;
				HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
				this.moveTo(false);
			}
		}

		/** 按钮 - 下一个章节 */
		private onBtn_Next(): void {
			if (!this.m_isMoveing) {
				this.m_nChapterId++;
				HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
				this.moveTo();
			}
		}
		/**更新次數 */
		private numUpdate(): void {
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
				let view = this.m_Group.getChildAt(0) as HeadQuartersChapter;
				view.x = view.width;
				view.setChapterInfo(this.m_nChapterId + 1, this.m_nId);
				this.m_Group.addChildAt(view, 2);
			} else {
				let view = this.m_Group.getChildAt(2) as HeadQuartersChapter;
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
				let view = this.m_Group.getChildAt(i) as HeadQuartersChapter;
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
				this.Refresh_Title(this.m_nLevel);
				this.setCurChpater();
				this.Refresh_BtnVisible();
				this.m_RewardBar.SetChapterId(this.m_nChapterId, this.m_nLevel);
				this.m_RewardBar.Refresh_BoxState();
			}
			this.refreshViewVisivle()
		}

		/** 刷新 - 当前章节标题 */
		private Refresh_Title(level: number): void {
			let nor = `<font color = #abb7d1>【${GCode(CLEnum.NORMAL)}】</font>` + GLan(C.ChapterIdConfig[this.m_nChapterId].chapterName);
			let hd = `<font color = #ff0000>【${GCode(CLEnum.HARD)}】</font>` + GLan(C.ChapterIdConfig[this.m_nChapterId].chapterName);
			let nameTitle = level == IQuarLevel.NORMAL && C.ChapterIdConfig[this.m_nChapterId] ? nor : hd;
			this.m_Title.textFlow = C.ChapterIdConfig[this.m_nChapterId] ? Utils.htmlParser(nameTitle) : [];//HeadQuartersModel.ChapterCfgGroup[this.m_nChapterId][0].title;
		}


		/**設置當前章節 */
		private setCurChpater() {
			for (let i = 0; i < this.m_Group.numChildren; i++) {
				let view = this.m_Group.getChildAt(i) as HeadQuartersChapter;
				if (i == 0) view.setChapterInfo(this.m_nChapterId - 1, this.m_nId);
				else if (i == 1) {
					view.setChapterInfo(this.m_nChapterId, this.m_nId);
				}
				else view.setChapterInfo(this.m_nChapterId + 1, this.m_nId);
			}
		}

		/** 刷新 - 上下章节按钮状态 */
		private Refresh_BtnVisible(): void {
			this.m_BtnPrev.visible = (HeadQuartersModel.getChapterCfgs(this.m_nChapterId - 1) && HeadQuartersModel.getChapterCfgs(this.m_nChapterId - 1).length > 0) ? true : false;
			this.m_BtnNext.visible = (HeadQuartersModel.getChapterCfgs(this.m_nChapterId + 1) && HeadQuartersModel.getChapterCfgs(this.m_nChapterId + 1).length > 0) ? true : false;
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.QUARTER_WND);
		}
	}

	interface ITabBtnRD {
		sel: boolean,
		type: number,
		name: string,
	}

	class TabBtnRender extends eui.ItemRenderer {
		public m_imgBg: eui.Image;
		public m_labTitle: com_main.CLabel;

		private m_tData: ITabBtnRD;

		public constructor() {
			super();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		protected dataChanged() {
			this.m_tData = this.data;
			if (this.m_tData.sel) {
				this.m_imgBg.source = this.m_tData.type == 0 ? 'btn_118_png' : 'btn_117_png';
			}
			else {
				this.m_imgBg.source = 'btn_106_png';
			}
			this.m_labTitle.text = this.m_tData.name;
		}

	}
}