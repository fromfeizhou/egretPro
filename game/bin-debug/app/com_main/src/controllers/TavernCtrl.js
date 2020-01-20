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
    var TavernCtrl = /** @class */ (function (_super_1) {
        __extends(TavernCtrl, _super_1);
        function TavernCtrl() {
            return _super_1.call(this) || this;
        }
        TavernCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.TAVERN_MAIN_PANEL, TavernCtrl],
                [TASK_UI.TAVERN_INFO_PANEL, TavernCtrl],
                [TASK_UI.TAVERN_CHECK_PANEL, TavernCtrl],
                [TASK_UI.TAVERN_SAFETY_PANEL, TavernCtrl],
            ];
        };
        TavernCtrl.prototype.execute = function (notification) {
            debug("TavernCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.TAVERN_MAIN_PANEL: {
                    SceneManager.openView("com_main.TavernView", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.TAVERN_INFO_PANEL: {
                    SceneManager.openView("com_main.TavernAwardView", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                case TASK_UI.TAVERN_CHECK_PANEL: {
                    SceneManager.openView("com_main.TavernCheckView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.TAVERN_SAFETY_PANEL: {
                    SceneManager.openView("com_main.TavernSafetyWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return TavernCtrl;
    }(AGame.Controller));
    com_main.TavernCtrl = TavernCtrl;
})(com_main || (com_main = {}));
