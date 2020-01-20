module Mini {
    /**确认弹窗 */
    export class ConfirmPop extends CMaskWnd {
        public static instance: ConfirmPop = null;

        private m_sTips: string;
        private m_callbackConfirm: Function;
        private m_thisArg: any;

        public onDestroy() {
            this.m_callbackConfirm = null;
            this.m_thisArg = null;
            this.m_sTips = null;
            super.onDestroy();
        }

        public constructor(tips: string, confirm?: Function, thisArg?: any) {
            super();
            this.m_callbackConfirm = confirm;
            this.m_thisArg = thisArg;
            this.m_sTips = tips;
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.setSize(560, 360);
            this.setTitle('提 示');

            let desc = new eui.Label(this.m_sTips);
            desc.size = 24;
            desc.width = 450;
            desc.textAlign = 'center';
            desc.textColor = 0x8a8a9e;
            desc.verticalCenter = -52;
            this.m_pRoot.addChild(desc);
        }

        private onConfirmClick() {
            let func = this.m_callbackConfirm;
            let obj = this.m_thisArg;
            this.onDestroy();
            if (func && obj) {
                func.call(obj);
            }
        }
    }
}