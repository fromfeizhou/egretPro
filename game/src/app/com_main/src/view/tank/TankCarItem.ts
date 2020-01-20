// module com_main {
// 	/**战车选项 */
// 	export class TankCarItem extends eui.ItemRenderer {

// 		private m_imgTank: com_main.CImage;
// 		private m_imgSelect: com_main.CImage;
// 		private m_imgNew: com_main.CImage;
// 		private m_lbTips: eui.Label;

// 		public skinId: number;

// 		public constructor() {
// 			super();
// 		}

// 		protected childrenCreated(): void {
// 			super.childrenCreated();

// 		}

// 		public dataChanged() {
// 			super.dataChanged();
// 			this.m_imgSelect.visible = false;
// 			this.skinId = this.data.skinId;
// 			let skinVo = TankModel.getTankSkin(this.data.skinId);
// 			this.m_lbTips.visible = skinVo.isUse();
// 			this.m_imgNew.visible = !TankModel.isOwnSkin(this.skinId);
// 			this.m_imgSelect.visible = (this.skinId == TankModel.tempSelectSkinId);
// 			// if (this.data.select) this.m_imgSelect.visible = this.data.select;
// 		}


// 		$onRemoveFromStage(): void {
// 			super.$onRemoveFromStage();
// 		}

// 	}
// }