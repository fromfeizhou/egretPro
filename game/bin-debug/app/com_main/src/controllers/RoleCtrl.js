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
    var RoleCtrl = /** @class */ (function (_super_1) {
        __extends(RoleCtrl, _super_1);
        function RoleCtrl() {
            return _super_1.call(this) || this;
        }
        RoleCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_ROLE_INFO_VIEW, RoleCtrl],
                [TASK_UI.POP_ROLE_CHANGE_NAME, RoleCtrl],
                [TASK_UI.POP_ROLE_REPLACE_IMG, RoleCtrl],
                [TASK_UI.POP_ROLE_LEVEL_PANEL, RoleCtrl],
                [TASK_UI.POP_ROLE_GIFT_DH, RoleCtrl],
            ];
        };
        RoleCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_ROLE_INFO_VIEW: {
                    SceneManager.openView("com_main.RoleInfoView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_LEVEL_PANEL: {
                    SceneManager.openView("com_main.RoleLevelPanel", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_CHANGE_NAME: {
                    SceneManager.openView("com_main.RoleChangeNameView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_REPLACE_IMG: {
                    SceneManager.openView("com_main.RoleReplaceImgView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_GIFT_DH: {
                    SceneManager.openView("com_main.RoleGiftExWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
            }
        };
        return RoleCtrl;
    }(AGame.Controller));
    com_main.RoleCtrl = RoleCtrl;
})(com_main || (com_main = {}));
