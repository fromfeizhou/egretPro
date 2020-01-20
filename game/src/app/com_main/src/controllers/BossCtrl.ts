module com_main {

	export class BossCtrl extends AGame.Controller {

		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.BOSS_INFO_PANEL, BossCtrl],
				// [TASK_UI.BOSS_BUY_QUICK_PANEL, BossCtrl],
				[TASK_UI.BOSS_BOX_RANKREWARD, BossCtrl],
				[TASK_UI.BOSS_HURT_RANK, BossCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName()
				, body = notification.getBody();
			debug("===========BossCtrl:execute==================", name, body);
			switch (name) {
				case TASK_UI.BOSS_INFO_PANEL: {
					let view = SceneManager.getClass(LayerEnums.POPUP, BossMainWnd.NAME);
					if (!view) SceneManager.openView("com_main.BossMainWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					break;
				}
				// case TASK_UI.BOSS_BUY_QUICK_PANEL: { //快速购买
				// 	SceneManager.openView("com_main.BossQuickBuyView", body, null, UpManager.STYLE_UP, true, false);
				// 	break;
				// }
				case TASK_UI.BOSS_BOX_RANKREWARD: { //排名奖励界面
					SceneManager.openView("com_main.BossRankRewardWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.BOSS_HURT_RANK: { //伤害榜单界面
					SceneManager.openView("com_main.BossHurtWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
			}
		}
	}

}