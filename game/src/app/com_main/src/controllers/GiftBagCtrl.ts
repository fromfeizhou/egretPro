
module com_main {
	export class GiftBagCtrl extends AGame.Controller {
		public constructor() {
			super();
		}
		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_ACTIVITY_ADD_GIFTBAG, GiftBagCtrl],
				[TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, GiftBagCtrl],
				[TASK_UI.POP_ACTIVITY_ADD_GIFTSHOP, GiftBagCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			switch (name) {
				case TASK_UI.POP_ACTIVITY_ADD_GIFTBAG: {
					if(platform.isHidePayFunc())return;
					SceneManager.openView("com_main.GiftBagWnd", notification.getBody(), null, UpManager.STYLE_MAIN_FULL, false, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP: {
					if(platform.isHidePayFunc())return;
					SceneManager.openView("com_main.GiftBagTisPop", notification.getBody(), null, UpManager.STYLE_FULL);
					break;
				}
				case TASK_UI.POP_ACTIVITY_ADD_GIFTSHOP: {
					SceneManager.openView("com_main.GiftShopWnd", notification.getBody(), null, UpManager.STYLE_MAIN_FULL, false, false);
					break;
				}

			}
		}
	}
}