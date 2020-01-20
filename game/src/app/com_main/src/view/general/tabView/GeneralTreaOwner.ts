module com_main {
	export class GeneralTreaOwner extends CComponent {
		public m_generalHead: com_main.GeneralHeadRender;
		public m_labGenName: eui.Label;

		private m_bActivated: boolean;	//是否激活
		private m_nItemId:number;
		private m_treaVo: TreasureVo;

		public constructor(param?) {
			super();
			this.skinName = Utils.getAppSkin("general/tabView/GeneralTreaOwnerSkin.exml");
		}

		protected childrenCreated() {
			super.childrenCreated();
		}

		public onDestroy(): void {
			super.onDestroy();

		}
		/**设置宝物id */
		public setInfo(itemId:number) {
			if(this.m_nItemId == itemId) return;
			this.m_nItemId = itemId;
			this.m_treaVo = TreasureModel.getData(itemId);
			if (this.m_treaVo && this.m_treaVo.treaCfg.exclusiveId > 0) {
				this.visible = true;
				this.refreshGeneralView();
			}else{
				this.visible = false;
			}
		}

		/**刷新专属武将显示 */
		private refreshGeneralView() {
			let generalId = this.m_treaVo.getDedicatedGenId();
			this.m_generalHead.setGenId(generalId);
			GeneralModel.setLabGaneralName(generalId,this.m_labGenName);

			let isActivated = this.m_treaVo.isInDedicatedGeneral();
			Utils.isGray(!isActivated, this.m_generalHead);
		}
		
	}
}