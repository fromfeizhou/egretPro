/**
 * 兵法ctrl
 */
module com_main {
    export class MailCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.POP_MAIL_LIST_VIEW, MailCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            var name = notification.getName();
            var body = notification.getBody();

            switch (name) {
                case TASK_UI.POP_MAIL_LIST_VIEW: {
                    SceneManager.openView("com_main.MailMainWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
                    Loading.hide();
                    break;
                }
                default:
                    break;
            }
        }
    }
}