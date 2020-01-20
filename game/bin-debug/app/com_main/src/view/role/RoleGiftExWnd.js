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
    var RoleGiftExWnd = /** @class */ (function (_super_1) {
        __extends(RoleGiftExWnd, _super_1);
        function RoleGiftExWnd() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/role/RoleGiftExWndSkin.exml");
            return _this;
        }
        RoleGiftExWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnExchange.setTitleLabel(GCode(CLEnum.ROLE_LJ_DH));
            this.m_labTitle.text = GCode(CLEnum.ROLE_SHURU_DH);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.ROLE_GIFT_DH));
            this.addEvent();
        };
        /**监听事件 */
        RoleGiftExWnd.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_btnExchange, this, this.onClickConfirm);
            com_main.EventMgr.addEvent(RoleEvent.GIFT_DUIHUAN, this.onRefresh, this);
        };
        /**移除事件 */
        RoleGiftExWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(RoleEvent.GIFT_DUIHUAN, this);
        };
        RoleGiftExWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            com_main.EventManager.removeEventListeners(this);
        };
        RoleGiftExWnd.prototype.onRefresh = function () {
            this.InputLabel.text = '';
        };
        RoleGiftExWnd.prototype.onClickConfirm = function () {
            LoginProxy.C2S_GET_ACTIVITY_CDKEY_REWARD(this.InputLabel.text);
        };
        return RoleGiftExWnd;
    }(com_main.CComponent));
    com_main.RoleGiftExWnd = RoleGiftExWnd;
})(com_main || (com_main = {}));
