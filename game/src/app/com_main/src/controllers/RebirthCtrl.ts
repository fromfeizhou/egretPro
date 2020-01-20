module com_main {
    export class RebirthCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.REBIRTH_WND, RebirthCtrl],
            ];
        }
        public execute(notification: AGame.INotification) {
            let name = notification.getName();
            let param = notification.getBody();
            switch (name) {
                case TASK_UI.REBIRTH_WND: {
                    SceneManager.openView("com_main.RebirthWnd", param, null, UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
            }
        }
    }
}