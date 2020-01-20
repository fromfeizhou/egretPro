// module com_main {
// 	export class TankStrengthenView extends CView {
// 		public static NAME = "TankStrengthenView";
// 		private m_taItem1: com_main.TankAttributeItem;
// 		private m_taItem2: com_main.TankAttributeItem;
// 		private m_taItem3: com_main.TankAttributeItem;
// 		private m_taItem4: com_main.TankAttributeItem;
// 		private m_taItem5: com_main.TankAttributeItem;
// 		private m_taItem6: com_main.TankAttributeItem;
// 		private m_taItem7: com_main.TankAttributeItem;
// 		private m_taItem8: com_main.TankAttributeItem;
// 		private m_btnStrengthen: com_main.ComButton;
// 		private m_lbMaterial: eui.Label;
// 		private m_lbConsume: eui.Label;
// 		private m_pvTank: com_main.TankPreviewItem;
// 		private m_barExp: com_main.TankExpBar;
// 		private m_gAttribute: eui.Group;
// 		private m_itemId = 121;
// 		public constructor() {
// 			super();
// 			this.name = TankStrengthenView.NAME;
// 			this.initApp("tank/tank_strengthen_view.exml");
// 		}
// 		protected listenerProtoNotifications(): any[] {
// 			return [ProtoDef.TANK_INFO, ProtoDef.TANK_STRENGTHEN, ProtoDef.TANK_USE, ProtoDef.TANK_BUY];
// 		}
// 		protected executes(notification: AGame.INotification) {
// 			let body = notification.getBody();
// 			let protocol: number = Number(notification.getName());
// 			debug("View:execute -------->protocol, body:", protocol, body)
// 			switch (protocol) {
// 				case ProtoDef.TANK_INFO: {
// 					this.updateAttribute();
// 					break;
// 				}
// 				case ProtoDef.TANK_STRENGTHEN: {
// 					this.updateAttribute();
// 					this.updatePreView();
// 					this.updateExp();
// 					this.updateConsume();
// 					EffectUtils.showTips("强化成功", 1, false);
// 					break;
// 				}
// 				case ProtoDef.TANK_USE: {
// 					this.updatePreView();
// 					break;
// 				}
// 				case ProtoDef.TANK_BUY: {
// 					break;
// 				}
// 			}
// 		}
// 		public onDestroy(): void {
// 			super.onDestroy();
// 			EventManager.removeEventListeners(this);
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.updateAttribute();
// 			this.updatePreView();
// 			this.updateExp();
// 			this.updateConsume();
// 			EventManager.addTouchScaleListener(this.m_btnStrengthen, this, this.onBtnClick);
// 		}
// 		private updateConsume() {
// 			let vo = TankModel.getTankVo();
// 			let consume = vo.getConsume();
// 			// let name = Utils.getItemName(this.m_itemId);
// 			this.m_lbMaterial.text = consume.name;
// 			this.m_lbConsume.text = consume.num + "";
// 		}
// 		private updateExp() {
// 			let vo = TankModel.getTankVo();
// 			let exp = vo.getExp();
// 			this.m_barExp.level = vo.tankLevel;
// 			this.m_barExp.value = (exp.cur / exp.need) * 100;
// 		}
// 		private updatePreView() {
// 			let vo = TankModel.getTankVo();
// 			this.m_pvTank.setTankVo(vo);
// 		}
// 		private updateAttribute() {
// 			let vo = TankModel.getTankVo();
// 			let isMax = vo.isMaxLevel();
// 			this.m_gAttribute.visible = !isMax;
// 			let curAttri = vo.getCurrentAttribute();
// 			let nextAttri = vo.getNextAttribute();
// 			this.m_taItem1.value = curAttri.atk;
// 			this.m_taItem2.value = curAttri.def;
// 			this.m_taItem3.value = curAttri.hp;
// 			this.m_taItem4.value = curAttri.courage;
// 			this.m_taItem5.value = nextAttri.atk;
// 			this.m_taItem6.value = nextAttri.def;
// 			this.m_taItem7.value = nextAttri.hp;
// 			this.m_taItem8.value = nextAttri.courage;
// 		}
// 		private onBtnClick() {
// 			let vo = TankModel.getTankVo();
// 			let consume = vo.getConsume();
// 			TankProxy.send_TANK_STRENGTHEN(consume.type);
// 		}
// 	}
// }
