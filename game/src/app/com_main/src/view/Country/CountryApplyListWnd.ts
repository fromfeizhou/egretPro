module com_main {
	/**城池 封地任命 */
	export class CountryApplyListWnd extends CView {
		public static NAME = 'CountryApplyListWnd';

		public m_pRoot: eui.Group;
		public m_ItemList: eui.List;
		public m_MainTopNew: com_main.MainTopNew;

		private _dataArray: eui.ArrayCollection;
		private _viewParam: any;
		public constructor(param: any) {
			super();
			this.name = CountryApplyListWnd.NAME;
			this.skinName = Utils.getSkinName("app/Country/CountryApplyListWndSkin.exml");
			this._viewParam = param;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.currentState = this._viewParam.curState;
			this.m_MainTopNew.setTitleName(this._viewParam.titleName);

			Utils.toStageBestScaleHeigt(this.m_pRoot);
			this.InitDataArray();
		}

		private InitDataArray() {
			this._dataArray = new eui.ArrayCollection;
			this._viewParam.ApplyList.forEach(element => {
				// if(!CountryModel.IsKing(element.playerId) && !CountryModel.IsSelf(element.playerId)){
				this._dataArray.addItem({ playerInfo: element, btnName: this._viewParam.btnName, state: this.currentState });
				// }
			});

			this.m_ItemList.dataProvider = this._dataArray;
			this.m_ItemList.itemRenderer = CountryApplyItem;
		}
	}
}