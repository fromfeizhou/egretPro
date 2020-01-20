// TypeScript file
module com_main {
    export class PromtTipsView extends UIElement {
        public static Name = "PromtTipsView";
        public static getInstance(check: boolean = false): PromtTipsView {
            if (check)
                return PromtTipsView._mInstance;
            if (PromtTipsView._mInstance == null) {
                PromtTipsView._mInstance = new PromtTipsView();
            }
            return PromtTipsView._mInstance;
        }
        private m_pPromptId: number;
        private m_pTipsText: CLabel;
        private m_pBtnSure: ComButton;
        private m_pBtnCancel: ComButton;
        private m_apopUp: APopUp;

        // private m_pPromptClose: eui.Image;

        private _mCallBackSure: Function = null;
        private _mCallBackCancel: Function = null;
        private _mThisObj: any = null;

        // private _mIsShowCancel:boolean = true;
        constructor() {
            super(AGame.R.app.popUpLevel, "resource/skins/app/common/PromptTipsWnd.exml", UIAlignStyle.MiddleCenter, UIShowStyle.Normal, true, true);
            // this.skinName = ResManager.x2ComponentsName("PromptTipsWnd");
            //this.initMask(true);
            this.touchChildren = true;
            this.name = PromtTipsView.Name;
            this.setMaskAlpha(0.8);
        }

        protected initialized() {
            this.m_apopUp.setTitleLabel(GCode(CLEnum.TIPS));
            this.m_apopUp.addCloseListener(this, function () { this.hide() });
            this.m_apopUp.historyShow = false;
            this.m_pBtnSure.setTitleLabel(GCode(CLEnum.SURE));
            this.m_pBtnCancel.setTitleLabel(GCode(CLEnum.CANCEL));
        }

        /**
         * 没有按钮的提示
         */
        public showOnlyWords(text: string) {
            this.showPrompt(text);
            this.m_pBtnSure.visible = false;
            this.m_pBtnCancel.visible = false;
        }
        /**
         * 没有取消按钮的提示
         * @param text
         * @param callBackSure
         * @param thisObj
         */
        public showTip(text: string, callBackSure: Function = null, thisObj: any = null) {
            this.showPrompt(text, callBackSure, thisObj, null, false);
        }
        public showPrompt(text: string, callBackSure: Function = null, thisObj: any = null,
            callBackCancel: Function = null, isShowBtnCancel: boolean = true, customLabel: any = null, pid: number = 0) {
            super.show();
            this.m_pPromptId = pid;
            this.m_pTipsText.text = text;
            this._mCallBackSure = callBackSure;
            this._mCallBackCancel = callBackCancel;
            this._mThisObj = thisObj;
            this.m_pBtnCancel.visible = true;
            // this.m_pPromptClose.visible = false;

        }

        private onBtnSure() {
            this.hide();
            if (this._mCallBackSure)
                this._mCallBackSure.apply(this._mThisObj);
        }
        private onBtnCancel() {
            this.hide();
            if (this._mCallBackCancel)
                this._mCallBackCancel.apply(this._mThisObj);
        }

        public clearPrompt() {
            if (this.m_pPromptId && this._mIsShow) {
                this.m_pPromptId = 0;
                this.hide();
            }
        }

        private onBtnClose() {
            this.hide();
        }
        protected onShow() {
            super.onShow();
            this.width = CONTENT_WIDTH;
            this.height = CONTENT_HEIGHT;
            this.m_pBtnSure.visible = true;
            this.m_pBtnCancel.visible = true;
            this.m_apopUp.visible = true;
        }
        protected onHide() {
            this._mCallBackSure = null;
            this._mCallBackCancel = null;
            this._mThisObj = null;
        }
        protected addEvent() {
            super.addEvent();
            EventManager.addTouchScaleListener(this.m_pBtnSure, this, this.onBtnSure);
            EventManager.addTouchScaleListener(this.m_pBtnCancel, this, this.onBtnCancel);
            // EventManager.addTouchScaleListener(this.m_pPromptClose, this, this.onBtnClose);
        }
        protected removeEvent() {
            super.removeEvent();
            EventManager.getInstance().removeEventListener(this.m_pBtnSure);
            EventManager.getInstance().removeEventListener(this.m_pBtnCancel);
            // EventManager.getInstance().removeEventListener(this.m_pPromptClose);

        }
    }
}
