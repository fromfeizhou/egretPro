module com_main {

	export class PatrolCtrl extends AGame.Controller {

		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POS_PATROL_OFFLINE_REWARD_VIEW, PatrolCtrl],
				[TASK_UI.POS_PATROL_SPEED_UP_REWARD_VIEW, PatrolCtrl],
				[TASK_UI.POS_PATROL_REWARD_CHANGE_VIEW, PatrolCtrl],
				[TASK_UI.POS_PATROL_AWARD_VIEW, PatrolCtrl],
				[TASK_UI.POS_PATROL_BOSS_VIEW, PatrolCtrl],
				[TASK_UI.POS_PATROL_GET_AWARD_VIEW, PatrolCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName()
				, body = notification.getBody();
			debug("===========PatrolCtrl:execute==================", name, body);
			switch (name) {
				case TASK_UI.POS_PATROL_OFFLINE_REWARD_VIEW: {
					if (platform.isHidePayFunc()) return;
					SceneManager.openView("com_main.OfflineRewardView", body, null, UpManager.STYLE_UP, false, false);
					break;
				}

				case TASK_UI.POS_PATROL_SPEED_UP_REWARD_VIEW: {
					if(platform.isHidePayFunc()) return;
					SceneManager.openView("com_main.SpeedUpRewardView", body, null, UpManager.STYLE_UP, false, false);
					break;
				}

				case TASK_UI.POS_PATROL_REWARD_CHANGE_VIEW: {
					SceneManager.openView("com_main.RewardChangeView", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
				case TASK_UI.POS_PATROL_AWARD_VIEW: {
					SceneManager.openView("com_main.PatrolAwardView", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
				case TASK_UI.POS_PATROL_BOSS_VIEW: {
					SceneManager.openView("com_main.HangBossWnd", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
				case TASK_UI.POS_PATROL_GET_AWARD_VIEW: {
					SceneManager.openView("com_main.HangAwardView", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
			}
		}
	}

}