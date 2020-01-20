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
 * 任务ctrl
 */
var com_main;
(function (com_main) {
    var MissionCtrl = /** @class */ (function (_super_1) {
        __extends(MissionCtrl, _super_1);
        function MissionCtrl() {
            return _super_1.call(this) || this;
        }
        MissionCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.TASK_ACTIVATION_PANEL, MissionCtrl],
            ];
        };
        MissionCtrl.prototype.execute = function (notification) {
            debug("ActivationCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.TASK_ACTIVATION_PANEL: {
                    SceneManager.openView("com_main.MissionWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return MissionCtrl;
    }(AGame.Controller));
    com_main.MissionCtrl = MissionCtrl;
})(com_main || (com_main = {}));
