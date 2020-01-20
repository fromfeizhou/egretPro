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
     * 襄阳战（帝位争夺）
     * 4.皇帝登基弹出公告UI Coronation
     */
    var EmperorBattleCoronationView = /** @class */ (function (_super_1) {
        __extends(EmperorBattleCoronationView, _super_1);
        function EmperorBattleCoronationView(notice) {
            var _this = _super_1.call(this) || this;
            _this.initApp("activity/emperorBattle/EmperorBattleCoronationSkin.exml");
            _this.m_notice = notice;
            return _this;
        }
        EmperorBattleCoronationView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.CORONA_VIEW]);
        };
        EmperorBattleCoronationView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            // let coutryStr: string = WorldModel.checkCountry(this.m_notice.countryId);
            var desctr = GCodeFromat(CLEnum.XIANGYANG_EMPEROR_TIPS, this.m_notice.playerName);
            this.m_pName.textFlow = Utils.htmlParser(desctr);
            this.m_pTitle.source = "lb_jmdw_png";
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        EmperorBattleCoronationView.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this, this, this.onClick);
        };
        /**跳转前往 */
        EmperorBattleCoronationView.prototype.onClick = function () {
            com_main.UpManager.history();
        };
        EmperorBattleCoronationView.NAME = 'EmperorBattleCoronationView';
        return EmperorBattleCoronationView;
    }(com_main.CView));
    com_main.EmperorBattleCoronationView = EmperorBattleCoronationView;
})(com_main || (com_main = {}));
