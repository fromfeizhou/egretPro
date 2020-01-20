/**
 * 科技ctrl
 */
module com_main {
	export class TechnoCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_TECHNOLOGY_VIEW, TechnoCtrl],
				[TASK_UI.POP_TECHNOLOGY_PANEL, TechnoCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TavernCtrl:execute------>>", notification);
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.POP_TECHNOLOGY_VIEW: {
					SceneManager.openView("com_main.TechnoWnd", body, null, UpManager.STYLE_MAIN_FULL, false, true);
					break;
				}
				case TASK_UI.POP_TECHNOLOGY_PANEL: {
					 SceneManager.openView("com_main.TechnoInfoWnd", body, null, UpManager.STYLE_UP);
					break;
				}
				
				default:
					break;
			}
		}
	}
}