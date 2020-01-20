module com_main {
    export class RoleGiftExWnd extends CComponent {
        public m_PopUp: com_main.APopUp;
        public m_labTitle: eui.Label;
        public m_btnExchange: com_main.ComButton;
        public InputLabel: eui.EditableText;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/role/RoleGiftExWndSkin.exml");

        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_btnExchange.setTitleLabel(GCode(CLEnum.ROLE_LJ_DH));
            this.m_labTitle.text = GCode(CLEnum.ROLE_SHURU_DH);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.ROLE_GIFT_DH));
            this.addEvent();
        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchTapListener(this.m_btnExchange, this, this.onClickConfirm);
            EventMgr.addEvent(RoleEvent.GIFT_DUIHUAN, this.onRefresh, this);
        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(RoleEvent.GIFT_DUIHUAN, this);
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            EventManager.removeEventListeners(this);
        }
        private onRefresh() {
            this.InputLabel.text='';
        }
        private onClickConfirm() {
            LoginProxy.C2S_GET_ACTIVITY_CDKEY_REWARD(this.InputLabel.text);
        }
    }

}