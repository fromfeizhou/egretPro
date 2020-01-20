module com_main {


	/**
	 * 创建联盟
	 */
    export class LegionCreateWnd extends CView {
        public static NAME = 'LegionCreateWnd';
        public m_PopUp: com_main.APopUp;
        public m_labTitle: eui.EditableText;
        public m_labDec: eui.EditableText;
        public m_btnCreate: com_main.ComButton;
        public m_labVip: eui.Label;
        public m_labGold: eui.Label;


        public constructor() {
            super();
            this.name = LegionCreateWnd.NAME;
            this.initApp("legion/LegionCreateWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_btnCreate, this, this.onClickCreate);
            this.m_btnCreate.setTitleLabel(GCode(CLEnum.GUILD_CREATE));
            // let freeCost = ConstUtil.getValue(IConstEnum.CREATE_GUILD_GOLD);
            // this.m_btnCreate.setCostLabel(freeCost + '');
            this.m_labVip.text = platform.isHidePayFunc() ? '': "VIP" + ConstUtil.getValue(IConstEnum.CREATE_GUILD_VIP_LV);
            this.m_labGold.text = ConstUtil.getValue(IConstEnum.CREATE_GUILD_GOLD) + "";
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_CREATE));
        }

        private subString(text, maxChars) {
            var charsNum = text.length;
            text = text.substring(0, charsNum - 1);
            var textChars = StringUtils.getStringLength(text);
            if (textChars > maxChars) {
                return this.subString(text, maxChars);
            }
            return text;
        }
        //创建
        private onClickCreate() {
            if (this.m_labTitle.text != "") {
                if (this.m_labDec.text == "")
                    this.m_labDec.text = "";
                this.m_labTitle.validateNow();
                let labInput = this.getBLen(this.m_labTitle.text).toString();
                let boo = Utils.isEmojiCharacter(this.m_labTitle.text);
                if (labInput.length < 3 || labInput.length > 6 || boo) {
                    EffectUtils.showTips(GCode(CLEnum.GUILD_INPUT_FAL), 1, true);
                } else {
                    // 判断vip
                    if (!platform.isHidePayFunc() && RoleData.vipLevel < ConstUtil.getValue(IConstEnum.CREATE_GUILD_VIP_LV)) {
                        EffectUtils.showTips(GCodeFromat(CLEnum.GUILD_CREATE_VIP, ConstUtil.getValue(IConstEnum.CREATE_GUILD_VIP_LV)), 1, true);
                    } else {
                        // 判断元宝
                        if (PropModel.isItemEnough(PropEnum.GOLD, ConstUtil.getValue(IConstEnum.CREATE_GUILD_GOLD), 2)) {
                            LegionProxy.send_CREATE_GUILD(labInput, this.m_labDec.text);
                        }
                    }
                }
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.GUILD_INPUT_FAL1), 1, true);
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