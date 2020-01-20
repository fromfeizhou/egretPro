module com_main {
	/**确认弹窗 */
	export class ConfirmPop extends CView {

		public static NAME = "ConfirmPop";
		public static instance: ConfirmPop = null;

		private m_APopUp: APopUp;
		private m_groupTips: eui.Group;
		private m_btnConfirm: com_main.ComButton;
		private m_btnCancel: com_main.ComButton;
		private m_checkBox: eui.CheckBox;
		private m_noticeType: string;
		private m_richText: CCRichText = null;  //富文本
		private m_labTips: eui.Label;

		private m_sTips: string;
		private m_callbackConfirm: Function;
		private m_callbackCancel: Function;
		private m_thisArg: any;

		public static getInstance(): ConfirmPop {
			if (ConfirmPop.instance == null) {
				ConfirmPop.instance = new ConfirmPop();
			}
			return ConfirmPop.instance;
		}

		public constructor() {
			super();
			this.name = ConfirmPop.NAME;
			this.initCom("Pop/pop_confirm.exml");
		}

		public onDestroy() {
			//不执行父类 移除事件方法
		}

		$onRemoveFromStage(): void {
			if (this.m_richText) {
				Utils.removeFromParent(this.m_richText);
				this.m_richText = null;
			}
			this.resetData();
			super.$onRemoveFromStage(false);
		}

		public show(tips: string, state: string = 'style1', noticeType?: string, confirm?: Function, cancel?: Function, thisArg?: any) {
			this.m_callbackConfirm = confirm;
			this.m_callbackCancel = cancel;
			this.m_thisArg = thisArg;
			this.m_sTips = tips;
			this.m_noticeType = noticeType;
			if (state) {
				this.currentState = state;
				this.commitProperties();
			}
			this.m_APopUp.initEvent();
			//富文本初始化
			this.m_richText = new CCRichText(this.m_labTips);
			this.m_richText.imageScale = 1;
			this.m_groupTips.addChild(this.m_richText);
			this.m_richText.lineSpacing = 10;

			this.m_richText.textAlign = true;
			this.m_richText.text = this.m_sTips;

			com_main.UpManager.popSmallView(this, null, false, 0.8);
		}

		public resetData() {
			this.m_sTips = null;
			this.m_callbackCancel = null;
			this.m_callbackConfirm = null;
			this.m_thisArg = null;
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_APopUp.setTitleLabel('提 示');
			this.m_btnConfirm.setTitleLabel('确定');
			this.m_btnCancel.setTitleLabel('取消');
			this.m_btnCancel["sound_cancel"] = SoundData.getCancelSound();
			this.m_checkBox.selected = false;

			EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onConfirmClick);
			EventManager.addTouchScaleListener(this.m_btnCancel, this, this.onCancelClick);


		}
		
		private onConfirmClick() {
			let func = this.m_callbackConfirm;
			let obj = this.m_thisArg;
			if (this.m_checkBox.selected && this.m_noticeType) {
				LocalModel.recordNotice(this.m_noticeType, this.m_checkBox.selected)
			}

			UpManager.history.call(this);
			
			if (func && obj) {
				func.call(obj);
			}
		}

		private onCancelClick() {
			// if (this.m_callbackCancel && this.m_thisArg) {
			// 	this.m_callbackCancel.call(this.m_thisArg);
			// }
			UpManager.history.call(this);
		}

	}
}