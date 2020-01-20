module com_main {
	export class LoadingCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				["LOADING_SHOW", LoadingCtrl],
				["LOADING_HIDE", LoadingCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			switch (name) {
				case "LOADING_SHOW":
					Loading.show();
					break;
				case "LOADING_HIDE":
					Loading.hide();
					break;
			}
		}
	}
}