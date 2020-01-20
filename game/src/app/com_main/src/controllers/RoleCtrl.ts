module com_main {
    export class RoleCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.POP_ROLE_INFO_VIEW, RoleCtrl],
                [TASK_UI.POP_ROLE_CHANGE_NAME, RoleCtrl],
                [TASK_UI.POP_ROLE_REPLACE_IMG, RoleCtrl],
                [TASK_UI.POP_ROLE_LEVEL_PANEL, RoleCtrl],
                [TASK_UI.POP_ROLE_GIFT_DH, RoleCtrl],
                
            ];
        }

        public execute(notification: AGame.INotification) {
            let name = notification.getName();
            let body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_ROLE_INFO_VIEW: {
                    SceneManager.openView("com_main.RoleInfoView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_LEVEL_PANEL: {
                    SceneManager.openView("com_main.RoleLevelPanel", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_CHANGE_NAME: {
                    SceneManager.openView("com_main.RoleChangeNameView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_REPLACE_IMG: {
                    SceneManager.openView("com_main.RoleReplaceImgView", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ROLE_GIFT_DH: {
                    SceneManager.openView("com_main.RoleGiftExWnd", body, null, UpManager.STYLE_UP, true, false);
                    break;
                }
            }
        }
    }
}