module com_main {
	export class FunctionPreviewPanel extends CView {
		public static NAME = 'FunctionPreviewPanel';
		public m_pScroller: eui.Scroller;
		public m_pList: eui.List;
		public m_pBtnClose: eui.Group;

		private m_tCollections: eui.ArrayCollection;
		public constructor() {
			super();
			this.initApp("function/FunctionPreviewPanelSkin.exml");
		}

		public onDestroy() {
			EventManager.removeEventListeners(this);
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_tCollections = new eui.ArrayCollection([]);
			this.m_pList.dataProvider = this.m_tCollections;
			this.m_pList.itemRenderer = FunctionPreviewCell;
			this.initEvent();
			this.refreshListView();
		}
		/**设置面板列表 */
		public refreshListView() {
			let list = FunctionModel.getPreFuncList();
			if (!list) return;
			let res: FunctionConfig[] = [];
			for (let i = 0; i < list.length; i++) {
				res.push(list[i]);
			}
			res.sort((a: FunctionConfig, b: FunctionConfig) => {
				let aOpen = FunctionModel.isFunctionOpen(a.id);
				let bOpen = FunctionModel.isFunctionOpen(b.id);
				if (aOpen != bOpen) {
					if (aOpen) return -1;
					return 1;
				}
				return a.sortPreview - b.sortPreview;
			})
			this.m_tCollections.replaceAll(res);

			let preFuncList = FunctionModel.getPreFuncList();
			let index = FunctionModel.getPreViewIndex();
			let cfg = preFuncList[index];

			let scorllLen = res.indexOf(cfg) * 124 >= 0 ? res.indexOf(cfg) * 124 : 0;

			egret.setTimeout(() => {
				this.m_pScroller.viewport.scrollV = scorllLen;
			}, this, 100);
		}
		private initScroller() {


		}
		/**=====================================================================================
	   * 事件监听 begin
	   * =====================================================================================
	   */

		private initEvent() {
			EventManager.addTouchTapListener(this.m_pBtnClose, this, this.onClick);
		}
		/**点击关闭 */
		private onClick() {
			UpManager.history();
		}
		private removeEvent() {

		}
	}
}