module com_main {
	export class PvpArenaShopCell extends CComponent {

		private shopId:number;

		private m_pLbName:CLabel;
		private m_pBtnBuy:ComCostButton;

        public onClickCell:(id:number)=>void;

		public constructor(id:number) {
			super();
			this.skinName = Utils.getAppSkin("pvp_arena/PvpArenaShopCellSkin.exml");
			this.shopId = id;
		}

		protected createChildren(): void {
			super.createChildren();
            EventManager.addTouchScaleListener(this.m_pBtnBuy,this,this.onBuy);
			this.updateView(this.shopId);
		}

		private onBuy(){

			if(this.onClickCell){
				this.onClickCell(this.shopId);
			}
		}

		public updateView(id:number){
			this.shopId = id;
			this.m_pLbName.text = id+"";
			this.visible = true;
		}

       
	}
}