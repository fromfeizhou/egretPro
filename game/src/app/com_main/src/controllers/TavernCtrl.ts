module com_main {
	export class TavernCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.TAVERN_MAIN_PANEL, TavernCtrl],
				[TASK_UI.TAVERN_INFO_PANEL, TavernCtrl],
				[TASK_UI.TAVERN_CHECK_PANEL, TavernCtrl],
				[TASK_UI.TAVERN_SAFETY_PANEL, TavernCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TavernCtrl:execute------>>", notification);
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.TAVERN_MAIN_PANEL: {
					SceneManager.openView("com_main.TavernView", body, null, UpManager.STYLE_MAIN_FULL, false, true);
					break;
				}
				case TASK_UI.TAVERN_INFO_PANEL: {
					SceneManager.openView("com_main.TavernAwardView", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					break;
				}
				case TASK_UI.TAVERN_CHECK_PANEL: {
					SceneManager.openView("com_main.TavernCheckView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.TAVERN_SAFETY_PANEL: {
					SceneManager.openView("com_main.TavernSafetyWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				default:
					break;
			}
		}
	}
}