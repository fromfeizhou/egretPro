module com_main {
	export class BagInfoWidget extends CComponent {

		private m_pItemId;
		private m_pMaxLevel: number = 0;
		private m_pImgTechIcon: CImage;
		private m_pLbLevel: eui.Label;
		private m_imgSelect:CImage;
		private m_selct = false;
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/bag/bag_info_widget.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}
		
		public init(id: number) {
			this.m_pItemId = id;
			let cfg = PropModel.getCfg(id);
			if (cfg) {
				this.m_pMaxLevel = cfg.upperLimit;
			}

			this.updateLevel();
			this.touchChildren = false;
			
		}

		public updateLevel() {
			// 判断科技是否已经开放
			// if (TechnologyModel.isOpen(this.m_pTechId)) {
			// 	Utils.isGray(false, this.m_pImgTechIcon);
			// } else {
			// 	Utils.isGray(true, this.m_pImgTechIcon);
			// }

			// this.m_pLevel = TechnologyModel.getTechnologyLevel(this.m_pTechId);
			// this.m_pLbLevel.text = this.m_pLevel + "/" + this.m_pMaxLevel;
			
			 this.m_pLbLevel.text = PropModel.getPropNum(this.m_pItemId).toString();
		}
		
		public hideContent() {
			this.m_pLbLevel.visible = false;
		}

		public getItemId(): number {
			return this.m_pItemId;
		}
	
		
		public setSelectImg(bshow){
			this.m_imgSelect.visible = bshow;
		}
		
	}
}