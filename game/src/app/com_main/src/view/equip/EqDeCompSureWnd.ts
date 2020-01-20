module com_main {
    /**确认弹窗 */
    export class EqDeCompSureWnd extends CView {

        public static NAME = "EqDeCompSureWnd";
        public m_APopUp: com_main.APopUp;
        public m_labTips: eui.Label;
        public m_pRewardItems: eui.Group;
        public m_btnConfirm: com_main.ComButton;

        private m_callbackConfirm: any;
        private m_thisArg: any;
        private m_sTips: string;
        private m_tItems:IItemInfo[];


        public constructor(tips: string,items:IItemInfo[], confirm: Function, thisArg: any) {
            super();
            this.name = EqDeCompSureWnd.NAME;
            this.m_callbackConfirm = confirm;
            this.m_thisArg = thisArg;
            this.m_sTips = tips;
            this.m_tItems = items;
             this.initApp("equip/EqDeCompSureWndSkin.exml");
        }

        public onDestroy() {
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_APopUp.setTitleLabel(GCode(CLEnum.RECOVER));
            this.m_btnConfirm.setTitleLabel(GCode(CLEnum.SURE));

            this.m_labTips.textFlow =Utils.htmlParser(this.m_sTips);
            for(let i = 0; i < this.m_tItems.length;i++){
                let info = this.m_tItems[i];
                let itemView = ComItemNew.create('count');
                itemView.setItemInfo(info.itemId,info.count);
                this.m_pRewardItems.addChild(itemView);
            }

            EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onConfirmClick);

        }

        private onConfirmClick() {
            if (this.m_callbackConfirm && this.m_thisArg) {
                this.m_callbackConfirm.call(this.m_thisArg);
            }
            UpManager.history();
        }

    }
}