module com_main {

	export class RankCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.RANK_MAIN_PANEL, RankCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			let param = notification.getBody();
			switch (name) {
				case TASK_UI.RANK_MAIN_PANEL: {
					SceneManager.openView("com_main.RankMainView",param,null,UpManager.STYLE_MAIN_FULL,false,true);
					break;
				}
			}
		}
	}
}