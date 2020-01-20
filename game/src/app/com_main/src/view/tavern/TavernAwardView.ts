module com_main {
	export class TavernAwardView extends CView {

		public static NAME = 'TavernAwardView';

		private m_BackGround: CImage;
		private m_Notice: CLabel;
		private m_ItemRoot: eui.Group;
		private _items: TavernItemRender[];
		private _tavernType: number;
		private _result: gameProto.TavernAttractResult[]; // 招募结果
		private m_pBtnComfirm: ComButton;

		private _effectFinish: boolean = false;
		private m_cacheInfo: IItemInfo;

		public constructor(param?) {
			super();
			this.name = TavernAwardView.NAME;
			this.initApp("tavern/tavern_award.exml");
			this._result = param.result;
			this._tavernType = param.tavernType;

		}


		public onDestroy(): void {
			super.onDestroy();
			this.removeEvent();

		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.currentState = this._tavernType == 1 ? 'ten' : 'base';
			this.m_pBtnComfirm.setTitleLabel(GCode(CLEnum.SURE));
			this.refresh();
			this.onGuideCondition();
			this.addEvent();
		}
		/**监听事件 */
		private addEvent() {
			EventManager.addTouchTapListener(this.m_BackGround, this, this.onTouchBackGround);
			EventManager.addTouchScaleListener(this.m_pBtnComfirm, this, this.onTouchBackGround);
			EventMgr.addEvent(GeneralEvent.GENERAL_GET_WND_CLOSE, this.closeWndHandler, this);
		}
		/**移除事件 */
		private removeEvent() {
			EventMgr.removeEventByObject(GeneralEvent.GENERAL_GET_WND_CLOSE, this);
		}
		public onTouchBackGround(): void {
			if (!this._effectFinish) return;
			this._effectFinish = false;
		
			UpManager.history();
		}

		public refresh() {
			this._effectFinish = false;
			this.onItemTick();
		}
		/**界面关闭回调 */
		private closeWndHandler() {
			this.createItem();
		}

		private onItemTick(): TavernItemRender {
			if (this._result.length == 0) {
				this._effectFinish = true;
				return;
			}
			let data = this._result.shift();

			this.m_cacheInfo = { itemId: data.code, count: data.value };
			let cfg = C.GeneralConfig[data.code];
			if (data.type == 8) {

				if (cfg.qualityLevel <= 2) {
					Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEWII, { curState: "base", generalId: data.code });
				} else {
					Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEW, { curState: "base", generalId: data.code });
				}
				this.m_cacheInfo.itemId = C.GeneralConfig[data.code].itemViewId;
				this.m_cacheInfo.count = 0;
				return;
			} else if (data.type == 10) {
				if (cfg.qualityLevel <= 2) {
					Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEWII, { curState: "tavern", generalId: data.code, value: data.value });
				} else {
					Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEW, { curState: "tavern", generalId: data.code, value: data.value });
				}
				this.m_cacheInfo.itemId = C.GeneralConfig[data.code].itemId;
				return;
			}
			this.createItem();
			// Sound.playID(231)
			this._tavernType == 1 ? Sound.playID(232) : Sound.playID(231);
		}

		private createItem() {
			if(!this.m_cacheInfo || !this.m_ItemRoot) return;
			let item: TavernItemRender = new TavernItemRender(this.m_cacheInfo);
			this.m_cacheInfo = null;
			this.m_ItemRoot.addChild(item);
			NodeUtils.setScale(item, 2.5);
			item.alpha = 0.5;
			var tw = egret.Tween.get(item);
			tw.wait(50);
			// tw.to({ scaleX: 0.5, scaleY: 0.5 });
			tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200, egret.Ease.backOut);
			tw.call(() => {
				this.onItemTick();
			}, this);

		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.TAV_AWARD_WND);
		}
	}
}