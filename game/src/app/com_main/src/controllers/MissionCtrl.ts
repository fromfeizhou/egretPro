

/**
 * 任务ctrl
 */
module com_main {
    export class MissionCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.TASK_ACTIVATION_PANEL, MissionCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            debug("ActivationCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();

            switch (name) {
                case TASK_UI.TASK_ACTIVATION_PANEL: {
                    SceneManager.openView("com_main.MissionWnd",body,null,UpManager.STYLE_MAIN_FULL,true,false);
                    break;
                }
                default:
                    break;
            }
        }
    }
}