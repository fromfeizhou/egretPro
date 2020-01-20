/**
 * 缘分ctrl
 */
module com_main {

	export class FateCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.FATE_GENERAL_VIEW, FateCtrl],
				[TASK_UI.FATE_GENERAL_ACTIVE_VIEW, FateCtrl],
				[TASK_UI.FATE_TEAM_VIEW, FateCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TavernCtrl:execute------>>", notification);
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.FATE_GENERAL_VIEW: {
					SceneManager.openView("com_main.GeneralFateView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.FATE_GENERAL_ACTIVE_VIEW: {
					SceneManager.openView("com_main.GeneralFateActiveView", body, null, UpManager.STYLE_FULL, true, false);
					break;
				}
				case TASK_UI.FATE_TEAM_VIEW: {
					SceneManager.openView("com_main.TeamFateView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				default:
					break;
			}
		}


	}

}