var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     * 创建联盟
     */
    var LegionCreateWnd = /** @class */ (function (_super_1) {
        __extends(LegionCreateWnd, _super_1);
        function LegionCreateWnd() {
            var _this = _super_1.call(this) || this;
            _this.name = LegionCreateWnd.NAME;
            _this.initApp("legion/LegionCreateWndSkin.exml");
            return _this;
        }
        LegionCreateWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionCreateWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_btnCreate, this, this.onClickCreate);
            this.m_btnCreate.setTitleLabel(GCode(CLEnum.GUILD_CREATE));
            // let freeCost = ConstUtil.getValue(IConstEnum.CREATE_GUILD_GOLD);
            // this.m_btnCreate.setCostLabel(freeCost + '');
            this.m_labVip.text = platform.isHidePayFunc() ? '' : "VIP" + ConstUtil.getValue(IConstEnum.CREATE_GUILD_VIP_LV);
            this.m_labGold.text = ConstUtil.getValue(IConstEnum.CREATE_GUILD_GOLD) + "";
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_CREATE));
        };
        LegionCreateWnd.prototype.subString = function (text, maxChars) {
            var charsNum = text.length;
            text = text.substring(0, charsNum - 1);
            var textChars = StringUtils.getStringLength(text);
            if (textChars > maxChars) {
                return this.subString(text, maxChars);
            }
            return text;
        };
        //创建
        LegionCreateWnd.prototype.onClickCreate = function () {
            if (this.m_labTitle.text != "") {
                if (this.m_labDec.text == "")
                    this.m_labDec.text = "";
                this.m_labTitle.validateNow();
                var labInput = this.getBLen(this.m_labTitle.text).toString();
                var boo = Utils.isEmojiCharacter(this.m_labTitle.text);
                if (labInput.length < 3 || labInput.length > 6 || boo) {
                    EffectUtils.showTips(GCode(CLEnum.GUILD_INPUT_FAL), 1, true);
                }
                else {
                    // 判断vip
                    if (!platform.isHidePayFunc() && RoleData.vipLevel < ConstUtil.getValue(IConstEnum.CREATE_GUILD_VIP_LV)) {
                        EffectUtils.showTips(GCodeFromat(CLEnum.GUILD_CREATE_VIP, ConstUtil.getValue(IConstEnum.CREATE_GUILD_VIP_LV)), 1, true);
                    }
                    else {
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
        };
        LegionCreateWnd.prototype.getBLen = function (str) {
            if (str == null)
                return 0;
            if (typeof str != "string") {
                str += "";
            }
            var labtxt = Utils.filterStr(str); //过滤特殊字符
            return Utils.trim(labtxt);
        };
        LegionCreateWnd.NAME = 'LegionCreateWnd';
        return LegionCreateWnd;
    }(com_main.CView));
    com_main.LegionCreateWnd = LegionCreateWnd;
})(com_main || (com_main = {}));
