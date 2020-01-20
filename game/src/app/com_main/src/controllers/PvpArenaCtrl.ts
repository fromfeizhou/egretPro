

/**
 * pvp竞技ctrl
 */
module com_main {
    export class PvpArenaCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.POP_PVPARENA_PANEL, PvpArenaCtrl],
                [TASK_UI.POP_PVPARENA_RANK_PANEL, PvpArenaCtrl],
                [TASK_UI.POP_PVPARENA_NOTICE_PANEL, PvpArenaCtrl],
                [TASK_UI.POP_PVPARENA_SHOP_PANEL, PvpArenaCtrl],
                
                
            ];
        }

        public execute(notification: AGame.INotification) {
            debug("ActivationCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();

             switch (name) {
                case TASK_UI.POP_PVPARENA_PANEL:{
                    SceneManager.openView("com_main.PvpArenaView",body,null,UpManager.STYLE_MAIN_FULL,true,false);
                    break;
                }
                case TASK_UI.POP_PVPARENA_RANK_PANEL:{
                    SceneManager.openView("com_main.PvpArenaRankView",body,null,UpManager.STYLE_UP,true,false);
                    break;
                }
                case TASK_UI.POP_PVPARENA_NOTICE_PANEL:{
                    SceneManager.openView("com_main.PvpNoticeView",body,null,UpManager.STYLE_UP,true,false);
                    break;
                }
                 case TASK_UI.POP_PVPARENA_SHOP_PANEL:{
                    SceneManager.openView("com_main.PvpArenaShopView",body,null,UpManager.STYLE_FULL,true,false);
                    break;
                }
             }
        }
    }
}