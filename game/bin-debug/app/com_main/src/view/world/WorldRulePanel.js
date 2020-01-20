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
     * 世界规则面板
     */
    var WorldRulePanel = /** @class */ (function (_super_1) {
        __extends(WorldRulePanel, _super_1);
        function WorldRulePanel(iid) {
            var _this = _super_1.call(this) || this;
            _this.name = WorldRulePanel.NAME;
            _this.initApp("world/world_rule_panel.exml");
            return _this;
        }
        WorldRulePanel.prototype.listenerProtoNotifications = function () {
            return [];
        };
        WorldRulePanel.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        WorldRulePanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_pBtnClose);
        };
        WorldRulePanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, function () {
                com_main.UpManager.history();
            });
        };
        WorldRulePanel.NAME = "WorldRulePanel";
        return WorldRulePanel;
    }(com_main.CView));
    com_main.WorldRulePanel = WorldRulePanel;
})(com_main || (com_main = {}));
