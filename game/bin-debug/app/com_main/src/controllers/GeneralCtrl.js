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
    var GeneralCtrl = /** @class */ (function (_super_1) {
        __extends(GeneralCtrl, _super_1);
        function GeneralCtrl() {
            return _super_1.call(this) || this;
        }
        GeneralCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_GENERAL_OPEN_INFO_VIEW, GeneralCtrl],
                [TASK_UI.POP_GENERAL_OPEN_DETAIL_VIEW, GeneralCtrl],
                [TASK_UI.POP_GENERAL_OPEN_UP_SKILL_VIEW, GeneralCtrl],
                [TASK_UI.POP_GENERAL_GET_VIEW, GeneralCtrl],
                [TASK_UI.POP_GENERAL_GET_VIEWII, GeneralCtrl],
                [TASK_UI.POP_GENERAL_TREA_LIST, GeneralCtrl],
                [TASK_UI.POP_GENERAL_UPSTAR_VIEWII, GeneralCtrl],
                [TASK_UI.POP_GENERAL_TUPO_VIEW, GeneralCtrl],
                [TASK_UI.POP_GENERAL_UNLOCK_SKILL, GeneralCtrl],
                [TASK_UI.POP_GENERAL_UPGRADE_VIEW, GeneralCtrl],
            ];
        };
        GeneralCtrl.prototype.execute = function (notification) {
            debug("GeneralCtrl:execute------>>", notification);
            var name = notification.getName();
            switch (name) {
                case TASK_UI.POP_GENERAL_OPEN_INFO_VIEW: {
                    SceneManager.openView("com_main.GeneralListWnd", null, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.POP_GENERAL_OPEN_DETAIL_VIEW: {
                    var param = notification.getBody();
                    SceneManager.openView("com_main.GeneralInfoWnd", param, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.POP_GENERAL_OPEN_UP_SKILL_VIEW: {
                    SceneManager.openView("com_main.GeneralUpSkillWnd", notification.getBody(), null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_GENERAL_GET_VIEW: {
                    SceneManager.openView("com_main.GeneralGetInfoWnd", notification.getBody(), ModuleEnums.GENERAL_GET, com_main.UpManager.STYLE_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_GENERAL_GET_VIEWII: {
                    SceneManager.openView("com_main.GeneralGetInfoWndII", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_GENERAL_TREA_LIST: {
                    SceneManager.openView("com_main.GeneralTreaListWnd", notification.getBody(), null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_GENERAL_UPSTAR_VIEWII: {
                    SceneManager.openView("com_main.GeneralUpStarView", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_GENERAL_TUPO_VIEW: {
                    SceneManager.openView("com_main.GeneralTuPoView", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_GENERAL_UNLOCK_SKILL: {
                    SceneManager.openView("com_main.GeneralUnLockSkill", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_GENERAL_UPGRADE_VIEW: {
                    SceneManager.openView("com_main.GeneraUpgradeView", notification.getBody(), null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return GeneralCtrl;
    }(AGame.Controller));
    com_main.GeneralCtrl = GeneralCtrl;
})(com_main || (com_main = {}));
