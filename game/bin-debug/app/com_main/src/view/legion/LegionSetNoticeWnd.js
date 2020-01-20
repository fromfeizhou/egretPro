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
    /**联盟公告修改 */
    var LegionSetNoticeWnd = /** @class */ (function (_super_1) {
        __extends(LegionSetNoticeWnd, _super_1);
        function LegionSetNoticeWnd(mata) {
            var _this = _super_1.call(this) || this;
            _this.m_data = null;
            // this.skinName = Utils.getSkinName("app/legion/LegionSetNoticeWndSkin.exml");
            _this.name = LegionSetNoticeWnd.NAME;
            _this.initApp("legion/LegionSetNoticeWndSkin.exml");
            _this.m_data = mata;
            return _this;
        }
        LegionSetNoticeWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.CHECK_APPLY_JOIN_GUILD,
            ];
        };
        LegionSetNoticeWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.CHECK_APPLY_JOIN_GUILD:
                    {
                    }
                    break;
            }
        };
        LegionSetNoticeWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionSetNoticeWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GUILD_NOTICE));
            this.m_BtnConfirm.setTitleLabel(GCode(CLEnum.SURE));
            com_main.EventManager.addTouchScaleListener(this.m_BtnConfirm, this, this.onClickChange);
        };
        LegionSetNoticeWnd.prototype.getBLen = function (str) {
            if (str == null)
                return 0;
            if (typeof str != "string") {
                str += "";
            }
            var labtxt = Utils.filterStr(str); //过滤特殊字符
            return Utils.trim(labtxt);
        };
        LegionSetNoticeWnd.prototype.onClickChange = function () {
            if (this.InputLabel1.text != "") {
                this.InputLabel1.validateNow();
                var labInput = this.getBLen(this.InputLabel1.text).toString();
                var boo = Utils.isEmojiCharacter(this.InputLabel1.text);
                if (labInput.length > 100 || boo) {
                    EffectUtils.showTips(GCode(CLEnum.GUI_NOTICE_LIMIT), 1, true);
                }
                else
                    LegionProxy.send_CHANGE_DECLARATION(this.InputLabel1.text);
                com_main.UpManager.history();
            }
        };
        LegionSetNoticeWnd.NAME = 'LegionSetNoticeWnd';
        return LegionSetNoticeWnd;
    }(com_main.CView));
    com_main.LegionSetNoticeWnd = LegionSetNoticeWnd;
})(com_main || (com_main = {}));
