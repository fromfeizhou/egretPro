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
    var ArmsCtrl = /** @class */ (function (_super_1) {
        __extends(ArmsCtrl, _super_1);
        function ArmsCtrl() {
            return _super_1.call(this) || this;
        }
        ArmsCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.ARMS_PANEL, ArmsCtrl],
            ];
        };
        ArmsCtrl.prototype.execute = function (notification) {
            debug("TavernCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.ARMS_PANEL: {
                    SceneManager.openView("com_main.ArmsWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return ArmsCtrl;
    }(AGame.Controller));
    com_main.ArmsCtrl = ArmsCtrl;
})(com_main || (com_main = {}));
