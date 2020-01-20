/**
 * 战斗指令虚拟机ctrl
 * 
 */
module com_main {
	export class BattleCtrl extends AGame.Controller {
        public constructor() {
			super();
		}

        public listenerRouterNotifications() {
			return [
				[TASK_UI.MENU_BATTLE_DESTORY_WALL, BattleCtrl]
			];
		}

        public execute(notification: AGame.INotification) {
			debug("BattleCtrl:execute------>>", notification);
            let name = notification.getName();
			let body = notification.getBody();

			switch (name) {
				case TASK_UI.MENU_BATTLE_DESTORY_WALL: {
					SceneManager.openView("com_main.DestoryWallView",null,null,UpManager.STYLE_FULL,false,false,0,false);
				}
				default:
					break;
			}

        }


    }
}