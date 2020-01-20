module com_main {
	export class ArenaSaodanResultView extends CView {

		public static NAME = 'ArenaSaodanResultView';

		public m_PopUpBoard: com_main.APopUp;
		public m_pScroll: com_main.CScroller;
		public group_rewardList: eui.Group;

		private data: gameProto.ICleanUpArenaInfo;
		private m_nIndex: number;


		public constructor(param?) {
			super();
			this.name = ArenaSaodanResultView.NAME;
			this.initApp("arena/arena_sandan_result.exml");
			this.data = param;
			this.m_PopUpBoard.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
		}

		public onDestroy() {
			Utils.TimerManager.remove(this.onTickHandler, this);
			super.onDestroy();
			//EventManager.removeEventListener(this.button_close);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			//EventManager.addTouchScaleListener(this.button_close, this, this.onclickButtonClose);
			this.m_PopUpBoard.setBottomBorder();
			this.m_nIndex = 0;
			Utils.TimerManager.doTimer(100, 0, this.onTickHandler, this);
		}

		private onTickHandler() {
			if (this.m_nIndex >= this.data.values.length) {
				Utils.TimerManager.remove(this.onTickHandler, this);
				return;
			}

			let content = new com_main.ArenaSandangItemRender();
			content.refresh(this.data.values[this.m_nIndex]);
			this.group_rewardList.addChild(content);
			// this.group_rewardList.validateNow();
			// egret.callLater(() => {
			// if (!this.group_rewardList) return;
			// let scrollV = this.group_rewardList.contentHeight - this.m_pScroll.height;
			// scrollV = Math.max(0, scrollV);
			this.m_pScroll.scrollTo(this.group_rewardList,this.m_nIndex,true,100);
			// this.group_rewardList.scrollV = scrollV
			// }, this);

			this.m_nIndex++;
		}



		public onclickButtonClose() {
			UpManager.history();
		}

		public refresh() {
			for (let ArenaInfo of this.data.values) {
				let content = new com_main.ArenaSandangItemRender();
				content.refresh(ArenaInfo);
				this.group_rewardList.addChild(content);
			}
		}
	}
}