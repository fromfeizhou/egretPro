/**
 * 科技ctrl
 */
module com_main {

	export class ArmsCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.ARMS_PANEL, ArmsCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TavernCtrl:execute------>>", notification);
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.ARMS_PANEL: {
					SceneManager.openView("com_main.ArmsWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);

					break;
				}
				default:
					break;
			}
		}


	}

}