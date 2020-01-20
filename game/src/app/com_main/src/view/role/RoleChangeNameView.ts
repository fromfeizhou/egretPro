module com_main {
	/**
	 * 改名
	 */
    export class RoleChangeNameView extends CView {
        public static NAME = 'RoleChangeNameView';

        public m_PopUp: com_main.APopUp;
        public m_labRoleName: eui.EditableText;
        public m_btnChange: com_main.ComButton;
        public m_labCost: eui.Label;
        public m_imgIcon: eui.Image;
        public m_comResCost: com_main.ComResCost;
        private costId: number;    //消耗的物品id
        private costNum: number;    //消耗的物品数量

        public constructor() {
            super();
            this.name = RoleChangeNameView.NAME;
            this.skinName = Utils.getAppSkin("role/role_change_name.exml");
        }
        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchTapListener(this.m_btnChange, this, this.onChangeName);
            EventMgr.addEvent(RoleEvent.ROLE_NAME, this.onRoleName, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(RoleEvent.ROLE_NAME, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_btnChange.setTitleLabel(GCode(CLEnum.SURE));
            this.m_PopUp.setTitleLabel(GCode(CLEnum.LOGIN_CH_NAME));

            this.addEvent();
            this.initView();

        }
        private initView() {
            let num = PropModel.getPropNum(PropEnum.NAME_CARD);//改名卡数量

            if (num <= 0) {
                let cfg = ConstUtil.getItems(IConstEnum.CHANGE_NAME)[0];
                this.costId = cfg.itemId;
                this.costNum = cfg.count;
            } else {
                this.costId = PropEnum.NAME_CARD;
                this.costNum = 1;
            }
            let itemCfg = C.ItemConfig[this.costId];
            this.m_imgIcon.source = PropModel.getPropIcon(this.costId);
            this.m_comResCost.setInfo(itemCfg.id, this.costNum);

        }

        private onRoleName() {
            UpManager.history();
        }

        private onChangeName() {

            if (this.m_labRoleName.text != "") {

                let labInput = this.getBLen(this.m_labRoleName.text).toString();
                let boo = Utils.isEmojiCharacter(this.m_labRoleName.text);
                if (labInput.length < 3 || labInput.length > 5 || boo) {
                    EffectUtils.showTips(GCode(CLEnum.LOGIN_LIMIT), 1, true);
                } else {
                    if (PropModel.isItemEnough(PropEnum.GOLD, this.costNum,1)) {
                        LoginProxy.C2S_PLAYER_RESET_NICKNAME(this.m_labRoleName.text);
                    }
                }
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.LOGIN_NOT_NU), 1, true);
            }

        }
        private getBLen(str) {
            if (str == null) return 0;
            if (typeof str != "string") {
                str += "";
            }
            let labtxt = Utils.filterStr(str);//过滤特殊字符
            return Utils.trim(labtxt);
        }
    }
}