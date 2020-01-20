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
 * 兵法ctrl
 */
var com_main;
(function (com_main) {
    var MailCtrl = /** @class */ (function (_super_1) {
        __extends(MailCtrl, _super_1);
        function MailCtrl() {
            return _super_1.call(this) || this;
        }
        MailCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_MAIL_LIST_VIEW, MailCtrl],
            ];
        };
        MailCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_MAIL_LIST_VIEW: {
                    SceneManager.openView("com_main.MailMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    Loading.hide();
                    break;
                }
                default:
                    break;
            }
        };
        return MailCtrl;
    }(AGame.Controller));
    com_main.MailCtrl = MailCtrl;
})(com_main || (com_main = {}));
