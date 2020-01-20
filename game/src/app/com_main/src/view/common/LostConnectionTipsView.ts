/**
 * 网络连接失败提示
 * AGame.R.app.netLevel
 */
module com_main {
    export class LostConnectionTipsView extends UIElement {
        public static NAME = 'LostConnectionTipsView';
        public static getInstance(check: boolean = false): LostConnectionTipsView {
            if (check)
                return LostConnectionTipsView._mInstance;
            if (LostConnectionTipsView._mInstance == null) {
                LostConnectionTipsView._mInstance = new LostConnectionTipsView();
            }
            return LostConnectionTipsView._mInstance;
        }
        private m_pPromptId: number;
        private m_pTipsText: CLabel;
         private m_pBtnSure: ComButton;
        private m_pBtnCancel: ComButton;
        private m_apopUp:APopUp;
   
        private _mCallBackSure: Function = null;
        private _mCallBackCancel: Function = null;
        private _mThisObj: any = null;
        // private _mIsShowCancel:boolean = true;
        constructor() {
            super(AGame.R.app.netLevel, "resource/skins/app/common/PromptTipsWnd.exml", UIAlignStyle.MiddleCenter, UIShowStyle.Normal, true, true);
           // this.skinName = ResManager.x2ComponentsName("PromptTipsWnd");
            //this.initMask(true);
            this.touchChildren = true;
            this.name = LostConnectionTipsView.NAME;
            this.setMaskAlpha(0.8);
        }
        protected initialized() {
            this.m_apopUp.setTitleLabel("提 示");
            this.m_apopUp.addCloseListener(this,function(){this.hide()});
            this.m_apopUp.historyShow = false;
            this.m_pBtnSure.setTitleLabel("确定");
            this.m_pBtnCancel.setTitleLabel("取消");
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
            this.m_pBtnSure.visible = true;
            this.m_pBtnCancel.visible = true;
        }
        protected onHide() {
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
