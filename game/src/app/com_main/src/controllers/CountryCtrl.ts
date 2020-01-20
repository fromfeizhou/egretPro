module com_main {
	export class CountryCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.COUNTRY_MAIN_PANEL, CountryCtrl],
				[TASK_UI.COUNTRY_APPLY_LIST, CountryCtrl],
				[TASK_UI.COUNTRY_JOB_INFO, CountryCtrl],
				[TASK_UI.COUNTRY_CORONATION_PANEL, CountryCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			let param = notification.getBody();
			switch (name) {
				case TASK_UI.COUNTRY_MAIN_PANEL: {
					SceneManager.openView("com_main.CountryMainWnd", param, null, UpManager.STYLE_MAIN_FULL, false, true);
					break;
				}
				case TASK_UI.COUNTRY_APPLY_LIST: {
					SceneManager.openView("com_main.CountryApplyListWnd", param, null, UpManager.STYLE_FULL, false, false);
					break;
				}

				case TASK_UI.COUNTRY_JOB_INFO: {
					SceneManager.openView("com_main.CountryJobInfoWnd", param, null, UpManager.STYLE_FULL, false, false);
					break;
				}
				case TASK_UI.COUNTRY_CORONATION_PANEL: {
					SceneManager.openView("com_main.CountryCoronationPanel", param, null, UpManager.STYLE_UP, false, false);
					break;
				}
			}
		}
	}
}