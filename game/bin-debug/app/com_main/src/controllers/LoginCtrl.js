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
    var LoginCtrl = /** @class */ (function (_super_1) {
        __extends(LoginCtrl, _super_1);
        function LoginCtrl() {
            return _super_1.call(this) || this;
        }
        LoginCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_LOGIN_SERVER_LIST, LoginCtrl],
                [TASK_UI.POP_LOGIN_CREATE_ROLE_VIEW, LoginCtrl],
                [TASK_UI.POP_LOGIN_SELECT_ROLE_VIEW, LoginCtrl],
                [TASK_UI.POP_LOGIN_NOTICE, LoginCtrl],
            ];
        };
        LoginCtrl.prototype.execute = function (notification) {
            debug("LoginCtrl:execute------>>", notification);
            var name = notification.getName();
            switch (name) {
                case TASK_UI.POP_LOGIN_SERVER_LIST: {
                    SceneManager.openView("com_main.LoginServerList", notification.getBody(), ModuleEnums.LOGIN_NOTICE, com_main.UpManager.STYLE_UP);
                    // let view = SceneManager.getView("com_main.LoginServerList", notification.getBody());
                    // UpManager.popSmallView(view);
                    break;
                }
                case TASK_UI.POP_LOGIN_NOTICE: {
                    SceneManager.openView("com_main.LoginNoticeWnd", notification.getBody(), ModuleEnums.LOGIN_NOTICE, com_main.UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_LOGIN_CREATE_ROLE_VIEW: {
                    var view = SceneManager.getView("com_main.LoginCreateRoleView", notification.getBody());
                    com_main.UpManager.popSmallView(view);
                    break;
                }
                case TASK_UI.POP_LOGIN_SELECT_ROLE_VIEW: {
                    var view = SceneManager.getView("com_main.LoginSelectRoleView", notification.getBody());
                    com_main.UpManager.popSmallView(view);
                    break;
                }
                default:
                    break;
            }
        };
        return LoginCtrl;
    }(AGame.Controller));
    com_main.LoginCtrl = LoginCtrl;
})(com_main || (com_main = {}));
