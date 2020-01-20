/**
 * 聚宝盆ctrl
 */
module com_main {
	export class TreasureCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.TREASURE_MAIN, TreasureCtrl],
				[TASK_UI.TREASURE_INFO, TreasureCtrl],
				[TASK_UI.TREASURE_INLAY, TreasureCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TavernCtrl:execute------>>", notification);
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.TREASURE_MAIN: { //打开宝物面板
					SceneManager.openView("com_main.TreaMainWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.TREASURE_INFO: {
					SceneManager.openView("com_main.TreaStrengWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					break;
				}
				case TASK_UI.TREASURE_INLAY: {
					SceneManager.openView("com_main.TreaInLayWnd", body, null, UpManager.STYLE_UP);
					break;
				}
				default:
					break;
			}
		}
	}
}