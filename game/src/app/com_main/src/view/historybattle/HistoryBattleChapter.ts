module com_main {
	export class HistoryBattleChapter extends CComponent {

		public static NAME = 'HistoryBattleChapter';

		public m_BackGround: com_main.CImage;
		public m_bgMask: eui.Image;
		public m_pItemRoot: eui.Group;
		public Item0: com_main.HistoryBattlesItem;
		public Item1: com_main.HistoryBattlesItem;
		public Item2: com_main.HistoryBattlesItem;
		public Item3: com_main.HistoryBattlesItem;
		public Item4: com_main.HistoryBattlesItem;



		/** 关卡信息 */
		private _historyWarCfgs: HistoryWarConfig[];

		/** 关卡组件 */
		private _Items: HistoryBattlesItem[];

		private m_nChapterId: number;	//當前章節id
		private m_nCopyId: number;
		public constructor() {
			super();
			this.name = HistoryBattleChapter.NAME;

		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			this.removeEvent();
			super.onDestroy();
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			this.InitItem();
			this.mask = this.m_bgMask;
			this.initEvent();
		}

		/** 初始化关卡组件 */
		private InitItem(): void {
			this._Items = [];
			for (let i = 0; i < 5; i++) {
				let Item: HistoryBattlesItem = this["Item" + i];
				this._Items.push(Item);
			}
		}



		/**設置章節id */
		public setChapterInfo(val: number, copyId: number) {
			if (this.m_nChapterId == val) return;
			this.m_nChapterId = val;
			this.m_nCopyId = copyId;
			this.setChapterCfg();
		}
		public get chapterId(): number {
			return this.m_nChapterId;
		}

		/** 设置章节信息 */
		private setChapterCfg(): void {
			if (!this.m_nChapterId) return;
			this._historyWarCfgs = HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId)
			this.Refresh();
		}

		/** 刷新界面 */
		public Refresh(): void {
			if (this._historyWarCfgs) {
				this.Refresh_BackGround();
				this.Refresh_CheckPoints();
			}
		}


		/** 刷新 - 背景图 */
		private Refresh_BackGround(): void {
			this.m_BackGround.source = this._historyWarCfgs[0].resMapName + "_jpg";
		}

		/** 刷新 - 关卡 */
		private Refresh_CheckPoints(): void {
			let cfgCnt = this._historyWarCfgs.length;
			for (let i = 0; i < cfgCnt; i++) {
				this._Items[i].SetCheckPoint(this._historyWarCfgs[i]);
			}
		}

		private ShowChapterInfoView(item: HistoryBattlesItem): void {
			let tempCfg = C.HistoryWarConfig[item.CheckPointId];

			Utils.open_view(TASK_UI.HISTORYWAR_INFO_PANEL, item.CheckPointId);
		}



		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private initEvent() {
			for (let i = 0; i < this._Items.length; i++) {
				let Item: HistoryBattlesItem = this._Items[i];
				EventManager.addTouchTapListener(Item, this, () => this.OnClickItem(Item));
			}

		}

		private removeEvent() {
			for (let i = 0; i < 5; i++) {
				EventManager.removeEventListener(this._Items[i]);
			}
			EventManager.removeEventListeners(this);

		}

		/**章節信息刷新 */
		private onInfoUpdate(chapterId: number) {
			if (this.m_nChapterId == chapterId) {
				this.Refresh();
			}
		}
		/** 按钮事件 - 点击关卡 */
		private OnClickItem(item: HistoryBattlesItem): void {
			if (this.m_nCopyId < item.CheckPointId){
				EffectUtils.showTips(GCode(CLEnum.MAIN_HIS_TIPS),1,true)
				return;
			}
			this.ShowChapterInfoView(item)
		}

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
	}
}