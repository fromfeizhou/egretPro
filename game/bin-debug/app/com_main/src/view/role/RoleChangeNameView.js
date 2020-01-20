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
     * 改名
     */
    var RoleChangeNameView = /** @class */ (function (_super_1) {
        __extends(RoleChangeNameView, _super_1);
        function RoleChangeNameView() {
            var _this = _super_1.call(this) || this;
            _this.name = RoleChangeNameView.NAME;
            _this.skinName = Utils.getAppSkin("role/role_change_name.exml");
            return _this;
        }
        RoleChangeNameView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        /**监听事件 */
        RoleChangeNameView.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_btnChange, this, this.onChangeName);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_NAME, this.onRoleName, this);
        };
        /**移除事件 */
        RoleChangeNameView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_NAME, this);
        };
        RoleChangeNameView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnChange.setTitleLabel(GCode(CLEnum.SURE));
            this.m_PopUp.setTitleLabel(GCode(CLEnum.LOGIN_CH_NAME));
            this.addEvent();
            this.initView();
        };
        RoleChangeNameView.prototype.initView = function () {
            var num = PropModel.getPropNum(PropEnum.NAME_CARD); //改名卡数量
            if (num <= 0) {
                var cfg = ConstUtil.getItems(IConstEnum.CHANGE_NAME)[0];
                this.costId = cfg.itemId;
                this.costNum = cfg.count;
            }
            else {
                this.costId = PropEnum.NAME_CARD;
                this.costNum = 1;
            }
            var itemCfg = C.ItemConfig[this.costId];
            this.m_imgIcon.source = PropModel.getPropIcon(this.costId);
            this.m_comResCost.setInfo(itemCfg.id, this.costNum);
        };
        RoleChangeNameView.prototype.onRoleName = function () {
            com_main.UpManager.history();
        };
        RoleChangeNameView.prototype.onChangeName = function () {
            if (this.m_labRoleName.text != "") {
                var labInput = this.getBLen(this.m_labRoleName.text).toString();
                var boo = Utils.isEmojiCharacter(this.m_labRoleName.text);
                if (labInput.length < 3 || labInput.length > 5 || boo) {
                    EffectUtils.showTips(GCode(CLEnum.LOGIN_LIMIT), 1, true);
                }
                else {
                    if (PropModel.isItemEnough(PropEnum.GOLD, this.costNum, 1)) {
                        LoginProxy.C2S_PLAYER_RESET_NICKNAME(this.m_labRoleName.text);
                    }
                }
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.LOGIN_NOT_NU), 1, true);
            }
        };
        RoleChangeNameView.prototype.getBLen = function (str) {
            if (str == null)
                return 0;
            if (typeof str != "string") {
                str += "";
            }
            var labtxt = Utils.filterStr(str); //过滤特殊字符
            return Utils.trim(labtxt);
        };
        RoleChangeNameView.NAME = 'RoleChangeNameView';
        return RoleChangeNameView;
    }(com_main.CView));
    com_main.RoleChangeNameView = RoleChangeNameView;
})(com_main || (com_main = {}));
