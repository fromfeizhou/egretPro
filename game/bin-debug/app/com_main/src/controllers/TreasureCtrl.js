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
/**
 * 聚宝盆ctrl
 */
var com_main;
(function (com_main) {
    var TreasureCtrl = /** @class */ (function (_super_1) {
        __extends(TreasureCtrl, _super_1);
        function TreasureCtrl() {
            return _super_1.call(this) || this;
        }
        TreasureCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.TREASURE_MAIN, TreasureCtrl],
                [TASK_UI.TREASURE_INFO, TreasureCtrl],
                [TASK_UI.TREASURE_INLAY, TreasureCtrl],
            ];
        };
        TreasureCtrl.prototype.execute = function (notification) {
            debug("TavernCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.TREASURE_MAIN: { //打开宝物面板
                    SceneManager.openView("com_main.TreaMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.TREASURE_INFO: {
                    SceneManager.openView("com_main.TreaStrengWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }
                case TASK_UI.TREASURE_INLAY: {
                    SceneManager.openView("com_main.TreaInLayWnd", body, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                default:
                    break;
            }
        };
        return TreasureCtrl;
    }(AGame.Controller));
    com_main.TreasureCtrl = TreasureCtrl;
})(com_main || (com_main = {}));
