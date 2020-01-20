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
    var LegionSetWnd = /** @class */ (function (_super_1) {
        __extends(LegionSetWnd, _super_1);
        function LegionSetWnd() {
            var _this = _super_1.call(this) || this;
            _this.m_checkTag = 0;
            _this.skinName = Utils.getSkinName("app/legion/LegionSetWndSkin.exml");
            return _this;
        }
        LegionSetWnd.prototype.listenerProtoNotifications = function () {
            return [
            //    ProtoDef.ACCEPT_APPLY_JOIN_GUILD
            ];
        };
        LegionSetWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_GUILD_INFO:
                    {
                    }
                    break;
            }
        };
        LegionSetWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initScroller();
            this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.SURE));
            // this.m_PopUp.setBottomBorder();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_JION_SET));
            com_main.EventManager.addEventListener(this.check_join, egret.TouchEvent.TOUCH_TAP, this, this.CheckJoin);
            com_main.EventManager.addEventListener(this.check_examine, egret.TouchEvent.TOUCH_TAP, this, this.CheckExamine);
            com_main.EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickConfirm);
            var _a = LegionModel.getbuildLevelAndFree(), lv = _a[0], state = _a[1];
            this.InputLabel.text = lv + "";
            this.m_checkbox0.selected = state == 0 ? true : false;
            this.m_checkbox1.selected = state == 0 ? false : true;
        };
        LegionSetWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionSetWnd.prototype.initScroller = function () {
        };
        LegionSetWnd.prototype.CheckJoin = function () {
            this.m_checkbox0.selected = true;
            this.m_checkbox1.selected = false;
            this.m_checkTag = 0;
        };
        LegionSetWnd.prototype.CheckExamine = function () {
            this.m_checkbox0.selected = false;
            this.m_checkbox1.selected = true;
            this.m_checkTag = 1;
        };
        LegionSetWnd.prototype.onClickConfirm = function () {
            if (Utils.checkNumber(this.InputLabel.text) == false) {
                return EffectUtils.showTips(GCode(CLEnum.GUILD_JION_LIMIT), 1, true);
                ;
            }
            if (Number(this.InputLabel.text) > 40) {
                return EffectUtils.showTips("不能超过大殿最高等级", 1, true);
                ;
            }
            LegionProxy.send_JOIN_GUILD_STATUS(Number(this.InputLabel.text), this.m_checkTag);
            LegionModel.setbuildLevelAndFree(Number(this.InputLabel.text), this.m_checkTag);
            com_main.UpManager.history();
        };
        return LegionSetWnd;
    }(com_main.CComponent));
    com_main.LegionSetWnd = LegionSetWnd;
})(com_main || (com_main = {}));
