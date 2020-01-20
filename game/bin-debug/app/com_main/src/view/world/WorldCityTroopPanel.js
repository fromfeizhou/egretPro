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
     * 首占奖励面板
     */
    var WorldCityTroopPanel = /** @class */ (function (_super_1) {
        __extends(WorldCityTroopPanel, _super_1);
        function WorldCityTroopPanel(data) {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.WorldFirstOccupyPanel.NAME;
            _this.m_tDataArr = data;
            _this.initApp("world/WorldCityTroopPanelSkin.exml");
            return _this;
        }
        WorldCityTroopPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldCityTroopPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_tCollections;
            this.m_List.itemRenderer = com_main.WorldCityTroopCell;
            this.refreshViewData();
        };
        WorldCityTroopPanel.prototype.refreshViewData = function () {
            this.m_tCollections.replaceAll(this.m_tDataArr);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldCityTroopPanel.prototype.initEvent = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPanel, this);
        };
        /**点击界面的时候关闭 */
        WorldCityTroopPanel.prototype.onTouchPanel = function (pvt) {
            com_main.UpManager.history();
        };
        WorldCityTroopPanel.NAME = 'WorldCityTroopPanel';
        return WorldCityTroopPanel;
    }(com_main.CView));
    com_main.WorldCityTroopPanel = WorldCityTroopPanel;
    ;
})(com_main || (com_main = {}));
