module com_main {
	export class RewardCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				//[MapNav.MAP_CITY_BATTLE_REWARD, RewardCtrl],
				//[TASK_UI.POP_GIFT_BAG_VIEW, RewardCtrl],
				[TASK_UI.GET_REWARD_VIEW,RewardCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			switch (name) {
				case MapNav.MAP_CITY_BATTLE_REWARD:
					let body = notification.getBody();
					let view = SceneManager.getView("com_main.BuildReward", body);
					UpManager.popSmallView(view, "font_dcjl_new_png");
					UpManager.mask(true, 0);
					break;
				case TASK_UI.POP_GIFT_BAG_VIEW: {
					// let body = notification.getBody();
					// let view = SceneManager.getView("com_main.GiftBag", body);
					// UpManager.popSmallView(view, "font_dcjl_new_png");
					// UpManager.mask(true, 0);
					break;
				}
				case TASK_UI.GET_REWARD_VIEW:{
					let body = notification.getBody();
					//  SceneManager.openView("com_main.GetRewardView",body,null,UpManager.STYLE_FULL,true,false);
					GetRewardView.getInstance().show(body);
				}
			}
		}
	}
}