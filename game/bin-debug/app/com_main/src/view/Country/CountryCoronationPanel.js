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
    var CountryCoronationPanel = /** @class */ (function (_super_1) {
        __extends(CountryCoronationPanel, _super_1);
        function CountryCoronationPanel(notice) {
            var _this = _super_1.call(this) || this;
            _this.initApp("Country/CountryCoronationPanelSkin.exml");
            _this.m_notice = notice;
            return _this;
        }
        CountryCoronationPanel.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.CORONA_VIEW]);
        };
        CountryCoronationPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            // let kingInfo: gameProto.CountryPlayerInfo = CountryModel.King_PlayerInfo;
            var coutryStr = WorldModel.checkCountry(this.m_notice.countryId);
            var desctr = GCodeFromat(CLEnum.STATE_KING_TIPS, this.m_notice.playerName, coutryStr);
            this.m_pName.textFlow = Utils.htmlParser(desctr);
            this.m_pTitle.source = "lb_jmww" + this.m_notice.countryId + "_png";
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        CountryCoronationPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this, this, this.onClick);
        };
        /**跳转前往 */
        CountryCoronationPanel.prototype.onClick = function () {
            com_main.UpManager.history();
        };
        CountryCoronationPanel.NAME = 'CountryCoronationPanel';
        return CountryCoronationPanel;
    }(com_main.CView));
    com_main.CountryCoronationPanel = CountryCoronationPanel;
})(com_main || (com_main = {}));
