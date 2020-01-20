module com_main {
	export class HistoryWarCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.HISTORYWAR_MAIN_PANEL, HistoryWarCtrl],
				[TASK_UI.HISTORYWAR_INFO_PANEL, HistoryWarCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			let param = notification.getBody();

			switch (name) {
				case TASK_UI.HISTORYWAR_MAIN_PANEL: {
					let view = SceneManager.getClass(LayerEnums.POPUP,HistoryBattles.NAME);
					if (!view) SceneManager.openView("com_main.HistoryBattles", param, null, UpManager.STYLE_MAIN_FULL, false, true);
					break;
				} case TASK_UI.HISTORYWAR_INFO_PANEL: {
					SceneManager.openView("com_main.HistoryBattlesInfo", param, null, UpManager.STYLE_UP, true, false);
					break;
				}
			}
		}
	}
}