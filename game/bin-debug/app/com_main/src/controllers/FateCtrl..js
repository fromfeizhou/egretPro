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
 * 缘分ctrl
 */
var com_main;
(function (com_main) {
    var FateCtrl = /** @class */ (function (_super_1) {
        __extends(FateCtrl, _super_1);
        function FateCtrl() {
            return _super_1.call(this) || this;
        }
        FateCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.FATE_GENERAL_VIEW, FateCtrl],
                [TASK_UI.FATE_GENERAL_ACTIVE_VIEW, FateCtrl],
                [TASK_UI.FATE_TEAM_VIEW, FateCtrl],
            ];
        };
        FateCtrl.prototype.execute = function (notification) {
            debug("TavernCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.FATE_GENERAL_VIEW: {
                    SceneManager.openView("com_main.GeneralFateView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.FATE_GENERAL_ACTIVE_VIEW: {
                    SceneManager.openView("com_main.GeneralFateActiveView", body, null, com_main.UpManager.STYLE_FULL, true, false);
                    break;
                }
                case TASK_UI.FATE_TEAM_VIEW: {
                    SceneManager.openView("com_main.TeamFateView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return FateCtrl;
    }(AGame.Controller));
    com_main.FateCtrl = FateCtrl;
})(com_main || (com_main = {}));
