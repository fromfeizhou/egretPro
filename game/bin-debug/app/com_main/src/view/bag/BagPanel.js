// module com_main {
// 	export class BagPanel extends CView {
// 		private m_pItemId: number = -1;
// 		private m_pItemMax: number = -1;
// 		private m_valueCount: number = 0;
// 		public static NAME = 'BagPanel';
// 		public static CLOSE_STATE = "close";
// 		public static OPEN_STATE = "open";
// 		public static MAX_STATE = "max";
// 		public static UNACTIVE_STATE = "unactive";
// 		private m_pWidget: BagInfoWidget;
// 		private m_pLbName: eui.Label;
// 		private m_pLbNextEffect: eui.Label;
// 		private m_pLbConditionDesc: eui.Label;
// 		private m_pLbCurEffect: eui.Label;
// 		private m_btnUse: eui.Group;
// 		private m_btnSub: eui.Image;
// 		private m_btnAdd: eui.Image;
// 		private m_pLbHelpDesc: eui.Label;
// 		private m_pLbNeedPoint: eui.Label;
// 		private m_pLevel: number = 0;
// 		private m_pValueLabel: eui.Label;
// 		private m_slider: eui.HSlider;
// 		private m_btnBack: eui.Image;
// 		private m_des: eui.Label;
// 		public constructor(id: number) {
// 			super();
// 			this.name = BagPanel.NAME;
// 			this.initApp("bag/bag_panel.exml");
// 			this.m_pItemId = id;
// 			this.m_pItemMax = PropModel.getPropNum(id);
// 		}
// 		protected childrenCreated(): void {
// 			super.childrenCreated();
// 			this.initPanel();
// 		}
// 		public onDestroy(): void {
// 			super.onDestroy();
// 			EventManager.removeEventListeners(this);
// 		}
// 		private initPanel() {
// 			this.m_pWidget.init(this.m_pItemId);
// 			this.m_pWidget.hideContent();
// 			EventManager.addTouchScaleListener(this.m_btnUse, this, this.onClickUse);
// 			EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
// 			EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
// 			EventManager.addTouchScaleListener(this.m_btnBack, this, this.onClickBack);
// 			this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
// 			this.updatePanel();
// 		}
// 		private onClickBack() {
// 			com_main.UpManager.history();
// 		}
// 		private updatePanel() {
// 			let cfg = PropModel.getCfg(this.m_pItemId);
// 			Utils.setTextByLanguageKey(cfg.name, this.m_pLbName, "未知科技名字");
// 			this.m_des.text = cfg.description;
// 			this.m_valueCount = this.m_pItemMax;
// 			this.m_slider.value = 10;
// 			this.m_pValueLabel.text = this.m_valueCount + "/" + this.m_pItemMax;
// 		}
// 		private onchangSlider(event: eui.UIEvent): void {
// 			let values = event.currentTarget.value;
// 			let curvalue = Math.floor(values / 10 * this.m_pItemMax)
// 			console.log("onchangyinyue=", values, (values / 10), curvalue);
// 			this.updateValue(curvalue);
// 		}
// 		private updateValue(value): void {
// 			this.m_valueCount = value;
// 			this.m_pValueLabel.text = value + "/" + this.m_pItemMax;
// 		}
// 		/**
// 		 * 使用道具
// 		 */
// 		private onClickUse() {
// 			//TechnologyProxy.send_TECHNOLOGY_UPGRADE(this.m_pTechId);
// 			if (this.m_valueCount <= 0) {
// 				EffectUtils.showTips("数量不能为0", 1, true);
// 				return;
// 			}
// 			PropProxy.send_BACKPACK_USE_ITEM(this.m_pItemId, this.m_valueCount);
// 		}
// 		/**
// 		 * --
// 		 */
// 		private onClickSub() {
// 			this.m_valueCount--;
// 			if (this.m_valueCount < 0) {
// 				this.m_valueCount = 0;
// 				return;
// 			}
// 			this.updateValue(this.m_valueCount);
// 			this.m_slider.value = this.m_valueCount / this.m_pItemMax * 10;
// 		}
// 		/**
// 		 * ++
// 		 */
// 		private onClickAdd() {
// 			this.m_valueCount++;
// 			if (this.m_valueCount > this.m_pItemMax) {
// 				this.m_valueCount = this.m_pItemMax;
// 				return;
// 			}
// 			this.updateValue(this.m_valueCount);
// 			this.m_slider.value = this.m_valueCount / this.m_pItemMax * 10;
// 		}
// 		private onClickAll() {
// 		}
// 	}
// }
