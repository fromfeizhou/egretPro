module com_main {
	export class HeadQuartersCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.HEADQUARTER_MAIN_PANEL, HeadQuartersCtrl],
				[TASK_UI.HEADQUARTER_INFO_PANEL, HeadQuartersCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			let param = notification.getBody();

			switch (name) {
				case TASK_UI.HEADQUARTER_MAIN_PANEL: {
					let view = SceneManager.getClass(LayerEnums.POPUP, HeadQuarters.NAME);
					if (!view) SceneManager.openView("com_main.HeadQuarters", param, null, UpManager.STYLE_MAIN_FULL, false, true);
					break;
				} case TASK_UI.HEADQUARTER_INFO_PANEL: {
					SceneManager.openView("com_main.HeadQuartersInfo", param, null, UpManager.STYLE_UP, true, false);
					break;
				}
			}
		}
	}
}