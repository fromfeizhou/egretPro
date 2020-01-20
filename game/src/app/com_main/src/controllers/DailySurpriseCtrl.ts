/**
 * 每日惊喜商城
 */
module com_main {
	export class DailySurpriseCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_DAILY_SURPRISE, DailySurpriseCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.POP_DAILY_SURPRISE: {	//每日惊喜商城
					SceneManager.openView("com_main.DailySurpriseView", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					Loading.hide();
					break;
				}
				default:
					break;
			}
		}
	}
}