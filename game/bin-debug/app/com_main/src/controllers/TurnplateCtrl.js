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
    var TurnplateCtrl = /** @class */ (function (_super_1) {
        __extends(TurnplateCtrl, _super_1);
        function TurnplateCtrl() {
            return _super_1.call(this) || this;
        }
        TurnplateCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_PAY_FORTUNE_VIEW, TurnplateCtrl],
            ];
        };
        TurnplateCtrl.prototype.execute = function (notification) {
            debug("ActivationCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_PAY_FORTUNE_VIEW: {
                    // SceneManager.openView("com_main.MissionView",body,null,UpManager.STYLE_FULL,true,false);
                    SceneManager.openView("com_main.PayFortuneView", 1, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return TurnplateCtrl;
    }(AGame.Controller));
    com_main.TurnplateCtrl = TurnplateCtrl;
})(com_main || (com_main = {}));
