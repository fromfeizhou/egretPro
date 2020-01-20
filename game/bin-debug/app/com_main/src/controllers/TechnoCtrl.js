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
 * 科技ctrl
 */
var com_main;
(function (com_main) {
    var TechnoCtrl = /** @class */ (function (_super_1) {
        __extends(TechnoCtrl, _super_1);
        function TechnoCtrl() {
            return _super_1.call(this) || this;
        }
        TechnoCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_TECHNOLOGY_VIEW, TechnoCtrl],
                [TASK_UI.POP_TECHNOLOGY_PANEL, TechnoCtrl],
            ];
        };
        TechnoCtrl.prototype.execute = function (notification) {
            debug("TavernCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_TECHNOLOGY_VIEW: {
                    SceneManager.openView("com_main.TechnoWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.POP_TECHNOLOGY_PANEL: {
                    SceneManager.openView("com_main.TechnoInfoWnd", body, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                default:
                    break;
            }
        };
        return TechnoCtrl;
    }(AGame.Controller));
    com_main.TechnoCtrl = TechnoCtrl;
})(com_main || (com_main = {}));
