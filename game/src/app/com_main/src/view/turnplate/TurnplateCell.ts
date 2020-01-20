module com_main {
	/**
	 * 道具
	 */
	export class TurnplateCell extends CComponent {
		
		private m_pItem:ComItemNew;
		private m_pSelectState:CImage;

		private m_pItemId:number;

		public constructor(id?:number) {
			super();
			if(id)
				this.m_pItemId = id;
			this.skinName = Utils.getAppSkin("turnplate/TurnplateCellSkin.exml");
		}

		public onDestroy(): void {
			super.onDestroy();
           
		}

        protected childrenCreated() {
			super.childrenCreated();
			if(this.m_pItemId)
				this.setCellId(this.m_pItemId);
        }

		public setCellId(id:number){
			this.m_pItemId = id;
			this.m_pItem.setItemInfo(id);
			this.m_pItem.visible = true;
			this.setSelectState(false);
		}

		public setSelectState(isSelect:boolean){
			this.m_pSelectState.visible = isSelect;
		}
	}
}