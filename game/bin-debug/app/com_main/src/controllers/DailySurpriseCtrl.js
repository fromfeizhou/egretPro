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
 * 每日惊喜商城
 */
var com_main;
(function (com_main) {
    var DailySurpriseCtrl = /** @class */ (function (_super_1) {
        __extends(DailySurpriseCtrl, _super_1);
        function DailySurpriseCtrl() {
            return _super_1.call(this) || this;
        }
        DailySurpriseCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_DAILY_SURPRISE, DailySurpriseCtrl],
            ];
        };
        DailySurpriseCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_DAILY_SURPRISE: { //每日惊喜商城
                    SceneManager.openView("com_main.DailySurpriseView", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                default:
                    break;
            }
        };
        return DailySurpriseCtrl;
    }(AGame.Controller));
    com_main.DailySurpriseCtrl = DailySurpriseCtrl;
})(com_main || (com_main = {}));
