

/**
 * 膜拜
 */
module com_main {
    export class WorshipCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.WORSHIP_PANEL, WorshipCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.WORSHIP_PANEL: {
                    CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO();
                    WorshipProxy.send_C2S_WORSHIP_INFO(WorshipType.KING);
                    SceneManager.openView("com_main.WorshipView",body,null,UpManager.STYLE_MAIN_FULL,true,false);
                    break;
                }
                default:
                    break;
            }
        }
    }
}