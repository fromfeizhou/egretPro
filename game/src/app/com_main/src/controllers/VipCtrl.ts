

/**
 * 任务ctrl
 */
module com_main {
    export class VipCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.VIP_MAIN_PANEL, VipCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.VIP_MAIN_PANEL: {
                    if(platform.isHidePayFunc()) return;
                    SceneManager.openView("com_main.VipWnd",body,null,UpManager.STYLE_MAIN_FULL,true,false);
                    break;
                }
                default:
                    break;
            }
        }
    }
}