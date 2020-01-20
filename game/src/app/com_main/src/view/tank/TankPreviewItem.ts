// module com_main {
// 	/**战车预览 */
// 	export class TankPreviewItem extends CComponent {

// 		public static NAME = "TankPreviewItem";

// 		private m_imgTank: com_main.CImage;
// 		private m_lbName: eui.Label;
// 		private m_lbDate: eui.Label;

// 		private m_btnSwitch: com_main.CImage;

// 		private m_lbAtk: eui.Label;
// 		private m_lbDef: eui.Label;
// 		private m_lbHp: eui.Label;



// 		private m_tankVo: TankVo;

// 		public constructor() {
// 			super();
// 			this.name = TankPreviewItem.NAME;
// 			this.skinName = Utils.getAppSkin("tank/tank_preview_item.exml");
// 		}

// 		public onDestroy(): void {
// 			super.onDestroy();
// 			this.m_tankVo = null;
// 			EventManager.removeEventListeners(this);
// 		}

// 		protected childrenCreated(): void {
// 			super.childrenCreated();

// 			if (this.m_btnSwitch)
// 				EventManager.addTouchScaleListener(this.m_btnSwitch, this, this.onBtnClick);
// 		}

// 		public setTankVo(vo: TankVo) {
// 			this.m_tankVo = vo;
// 			this.updateView(vo);
// 		}

// 		public updateView(vo: TankVo) {
// 			let skinVo = vo.getTankSkinVo();
// 			if (skinVo) {
// 				this.m_lbName.text = skinVo.name;
// 				this.m_lbDate.text = skinVo.date;
// 				this.updateAttribute(skinVo);
// 			}
// 		}

// 		public updateViewBySkinVo(skinVo: TankSkinVo) {
// 			if (skinVo) {
// 				this.m_lbName.text = skinVo.name;
// 				this.m_lbDate.text = skinVo.date;
// 				this.updateAttribute(skinVo);
// 			}
// 		}

// 		public updateAttribute(skinVo: TankSkinVo) {
// 			let attri = skinVo.getInitArribute();
// 			if (this.m_lbAtk) {
// 				this.m_lbAtk.text = attri.atk + "";
// 			}
// 			if (this.m_lbDef) {
// 				this.m_lbDef.text = attri.def + "";
// 			}
// 			if (this.m_lbHp) {
// 				this.m_lbHp.text = attri.hp + "";
// 			}
// 		}

// 		private onBtnClick() {
// 			AGame.R.notifyView(TASK_UI.POP_TANK_BUY_OPEN);
// 		}

// 	}
// }