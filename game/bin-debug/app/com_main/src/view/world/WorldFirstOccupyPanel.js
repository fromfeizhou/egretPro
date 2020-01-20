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
    var WorldFirstOccupyPanel = /** @class */ (function (_super_1) {
        __extends(WorldFirstOccupyPanel, _super_1);
        function WorldFirstOccupyPanel(cityId) {
            var _this = _super_1.call(this) || this;
            _this.m_cityId = cityId;
            _this.name = WorldFirstOccupyPanel.NAME;
            _this.initApp("world/WorldFirstOccupyPanelSkin.exml");
            return _this;
        }
        WorldFirstOccupyPanel.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        WorldFirstOccupyPanel.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        WorldFirstOccupyPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            if (this.m_genCard)
                egret.Tween.removeTweens(this.m_genCard);
        };
        WorldFirstOccupyPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            this.updateUI();
        };
        WorldFirstOccupyPanel.prototype.updateUI = function () {
            var worldCityMapCfg = C.WorldMapConfig[this.m_cityId];
            var genId = WorldModel.getGenIdByWorldCfg(worldCityMapCfg);
            var cfg = C.GeneralConfig[genId];
            if (!cfg)
                return;
            var name = GLan(cfg.name);
            this.m_name.text = name;
            this.m_name.textColor = GeneralModel.getGeneralQualityColor(cfg.qualityLevel);
            var gold = Number(worldCityMapCfg.firstreward.split("_")[1]);
            this.m_gold.source = "world_" + gold + "_png";
            this.createAni(genId);
        };
        WorldFirstOccupyPanel.prototype.createAni = function (genId) {
            this.m_genCard.setInfo(genId, true);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldFirstOccupyPanel.prototype.initEvent = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPanel, this);
        };
        WorldFirstOccupyPanel.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**点击界面的时候关闭 */
        WorldFirstOccupyPanel.prototype.onTouchPanel = function (pvt) {
            com_main.UpManager.history();
        };
        WorldFirstOccupyPanel.NAME = 'WorldFirstOccupyPanel';
        return WorldFirstOccupyPanel;
    }(com_main.CView));
    com_main.WorldFirstOccupyPanel = WorldFirstOccupyPanel;
})(com_main || (com_main = {}));
