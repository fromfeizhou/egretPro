/**
 * 网络连接失败提示
 * AGame.R.app.netLevel
 */
module com_main {
    export class PromtDynamicTextWnd extends UIElement {
        public static getInstance(check: boolean = false): PromtDynamicTextWnd {
            if (check)
                return PromtDynamicTextWnd._mInstance;
            if (PromtDynamicTextWnd._mInstance == null) {
                PromtDynamicTextWnd._mInstance = new PromtDynamicTextWnd();
            }
            return PromtDynamicTextWnd._mInstance;
        }

        private m_pTipsText: com_main.CLabel;
        private m_pHeadText: string;
        private m_pTailText: string;
        private m_pLimitTime: number;
        public static mIsShow:boolean = false;
        constructor() {
            super(AGame.R.app.netLevel, "resource/skins/app/common/TextTipScroll.exml", UIAlignStyle.MiddleCenter, UIShowStyle.Normal, true, true);
            this.setMaskAlpha(0);
            this.touchChildren = true;
        }
        protected initialized() {
        }

        public showPromptWithTime(head: string, tail: string, limitTime: number) {
            super.show();

            this.m_pHeadText = head;
            this.m_pTailText = tail;
            this.m_pLimitTime = limitTime;

            this.m_pTipsText.text = head + limitTime.toString() + tail;

            Utils.TimerManager.remove(this.updateText, this);
            Utils.TimerManager.doTimer(1000, limitTime, this.updateText, this);
        }

        private updateText() {
            this.m_pLimitTime--;
            if (this.m_pLimitTime > 0) {
                this.m_pTipsText.text = this.m_pHeadText + this.m_pLimitTime.toString() + this.m_pTailText;
            } else {
                this.hide();
            }
        }

        protected onShow() {
            super.onShow();
            PromtDynamicTextWnd.mIsShow = true;
        }

        protected onHide() {
            PromtDynamicTextWnd.mIsShow = false;
            Utils.TimerManager.remove(this.updateText, this);
        }

        public get isShow(){
            return PromtDynamicTextWnd.mIsShow;
        }

        protected addEvent() {
            super.addEvent();
        }

        protected removeEvent() {
            super.removeEvent();
            Utils.TimerManager.remove(this.updateText, this);
        }

        protected onResize() {
            super.onReSize();
        }
    }
}