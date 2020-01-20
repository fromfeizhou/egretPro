// module com_main {
// 	/**
// 	 * 道具
// 	 */
// 	export class ComItem extends CComponent {

// 		private m_imgItem: com_main.CImage;
// 		private m_lbNum: eui.Label;

// 		private m_touchType: number = 1;

// 		private m_callback: Function;
// 		private m_thisArg: any;

// 		public constructor() {
// 			super();
// 			this.skinName = Utils.getAppSkin("common/com_item.exml");
// 		}

// 		public onDestroy(): void {
// 			super.onDestroy();
// 			this.m_callback = null;
// 			this.m_thisArg = null;
// 		}

// 		protected childrenCreated() {
// 			super.childrenCreated();
// 		}

// 		public setTapCallback(callback, thisArg) {
// 			this.m_callback = callback;
// 			this.m_thisArg = thisArg;
// 		}

// 		public set item(id) {
// 			if (id <= 6) {
// 				let image = PropModel.getPropIcon(id);
// 				this.m_imgItem.source = image;
// 			} else {
// 				// let item = C.ItemConfig[id];
// 				let image = PropModel.getPropIcon(id);
// 				this.m_imgItem.source = image;//item.image;
// 			}
// 		}

// 		public set num(v) {
// 			this.m_lbNum.text = v;
// 		}


// 		public set touchType(v) {
// 			this.m_touchType = v;
// 			if (this.m_touchType == 1) {
// 				this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTap, this);
// 			} else {
// 				this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTap, this);
// 			}
// 		}


// 		private onItemTap() {
// 			if (this.m_touchType == 2) {

// 			} else if (this.m_touchType == 3) {
// 				if (this.m_callback && this.m_thisArg)
// 					this.m_callback.call(this.m_thisArg);
// 			}
// 		}

// 	}
// }