// module com_main {
// 	export class TankBuyView extends CView {
// 		public static NAME = "TankBuyView";
// 		private m_btnBuy: com_main.ComButton;
// 		private m_btnUse: com_main.ComButton;
// 		private m_lbDesc: eui.Label;
// 		private m_lbPrice: eui.Label;
// 		private m_listTank: eui.List;
// 		private m_pvTank: com_main.TankPreviewItem;
// 		private m_scTank: eui.Scroller;
// 		private m_dpTank: eui.ArrayCollection = null;
// 		private m_selectSkinId: number = null;
// 		private m_selectIndex: number = null;
// 		public constructor() {
// 			super();
// 			this.name = TankBuyView.NAME;
// 			this.initApp("tank/tank_buy_view.exml");
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
// 					this.resetList();
// 					break;
// 				}
// 				case ProtoDef.TANK_STRENGTHEN: {
// 					break;
// 				}
// 				case ProtoDef.TANK_USE: {
// 					this.m_dpTank.refresh();
// 					this.updateBtn();
// 					EffectUtils.showTips("使用成功", 1, false);
// 					break;
// 				}
// 				case ProtoDef.TANK_BUY: {
// 					this.m_dpTank.refresh();
// 					this.updateBtn();
// 					EffectUtils.showTips("购买成功", 1, false);
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
// 			this.m_dpTank = new eui.ArrayCollection();
// 			this.m_listTank.dataProvider = this.m_dpTank;
// 			this.resetList();
// 			this.m_scTank.addEventListener(eui.UIEvent.CHANGE_END, this.onScrollEnd, this);
// 			this.m_listTank.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTankItemTap, this);
// 			EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnClick);
// 			EventManager.addTouchScaleListener(this.m_btnUse, this, this.onBtnClick);
// 		}
// 		private resetList() {
// 			this.m_dpTank.removeAll();
// 			let tankList = TankModel.getTankSkin();
// 			let index = 0;
// 			this.m_selectIndex = 0;
// 			tankList.forEach((key: number, _data: any) => {
// 				let own = TankModel.isOwnSkin(key);
// 				if (!this.m_selectIndex && own) {
// 					this.m_selectIndex = index;
// 					TankModel.tempSelectSkinId = key;
// 				}
// 				this.m_dpTank.addItem({ skinId: key });
// 				index++;
// 			});
// 			let defaultItem = this.m_dpTank.getItemAt(this.m_selectIndex);
// 			this.m_selectSkinId = defaultItem.skinId;
// 			this.update(defaultItem.skinId);
// 		}
// 		private update(skinId) {
// 			let skinVo = TankModel.getTankSkin(skinId);
// 			this.m_pvTank.updateViewBySkinVo(skinVo);
// 			this.m_lbDesc.text = skinVo.desc;
// 			this.m_lbPrice.text = skinVo.getPrice() + "";
// 			this.updateBtn();
// 		}
// 		private updateBtn() {
// 			if (this.m_selectSkinId != null && this.m_selectSkinId != undefined) {
// 				let own = TankModel.isOwnSkin(this.m_selectSkinId);
// 				this.m_btnBuy.visible = !own;
// 				this.m_btnUse.visible = own;
// 			}
// 		}
// 		private onBtnClick() {
// 			if (this.m_selectSkinId != null && this.m_selectSkinId != undefined) {
// 				if (TankModel.isOwnSkin(this.m_selectSkinId)) {
// 					TankProxy.send_TANK_USE(this.m_selectSkinId);
// 				} else {
// 					TankProxy.send_TANK_BUY(this.m_selectSkinId);
// 				}
// 			}
// 		}
// 		private onTankItemTap(e: eui.PropertyEvent) {
// 			// this.hideAllSelect();
// 			let skinId = this.m_listTank.selectedItem.skinId;
// 			this.m_selectSkinId = skinId;
// 			this.update(skinId);
// 			TankModel.tempSelectSkinId = skinId;
// 			this.m_dpTank.refresh();
// 		}
// 		private onScrollEnd() {
// 			// if ((this.m_scTank.viewport.scrollV + this.m_scTank.height) >= this.m_scTank.viewport.contentHeight) {
// 			// }
// 		}
// 	}
// }
