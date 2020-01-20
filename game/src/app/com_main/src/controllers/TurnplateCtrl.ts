

/**
 * 任务ctrl
 */
module com_main {
    export class TurnplateCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                  [TASK_UI.POP_PAY_FORTUNE_VIEW, TurnplateCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            debug("ActivationCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();

            switch (name) {
                case TASK_UI.POP_PAY_FORTUNE_VIEW: {
                   // SceneManager.openView("com_main.MissionView",body,null,UpManager.STYLE_FULL,true,false);
                   SceneManager.openView("com_main.PayFortuneView",1,null,UpManager.STYLE_MAIN_FULL,true,false);
                    break;
                }
                default:
                    break;
            }
        }
    }
}