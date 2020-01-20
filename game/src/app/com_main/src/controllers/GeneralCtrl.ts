module com_main {
	export class GeneralCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_GENERAL_OPEN_INFO_VIEW, GeneralCtrl],
				[TASK_UI.POP_GENERAL_OPEN_DETAIL_VIEW, GeneralCtrl],
				[TASK_UI.POP_GENERAL_OPEN_UP_SKILL_VIEW, GeneralCtrl],
				[TASK_UI.POP_GENERAL_GET_VIEW, GeneralCtrl],
				[TASK_UI.POP_GENERAL_GET_VIEWII, GeneralCtrl],
				[TASK_UI.POP_GENERAL_TREA_LIST, GeneralCtrl],
				[TASK_UI.POP_GENERAL_UPSTAR_VIEWII, GeneralCtrl],
				[TASK_UI.POP_GENERAL_TUPO_VIEW, GeneralCtrl],
				[TASK_UI.POP_GENERAL_UNLOCK_SKILL, GeneralCtrl],
				[TASK_UI.POP_GENERAL_UPGRADE_VIEW, GeneralCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("GeneralCtrl:execute------>>", notification);
			var name = notification.getName();
			switch (name) {
				case TASK_UI.POP_GENERAL_OPEN_INFO_VIEW: {
					SceneManager.openView("com_main.GeneralListWnd", null, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
					break;
				}
				case TASK_UI.POP_GENERAL_OPEN_DETAIL_VIEW: {
					let param = notification.getBody();
					SceneManager.openView("com_main.GeneralInfoWnd", param, null, UpManager.STYLE_MAIN_FULL, false, true);
					break;
				}
				case TASK_UI.POP_GENERAL_OPEN_UP_SKILL_VIEW: {
					SceneManager.openView("com_main.GeneralUpSkillWnd", notification.getBody(), null, com_main.UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_GENERAL_GET_VIEW: {
					SceneManager.openView("com_main.GeneralGetInfoWnd", notification.getBody(), ModuleEnums.GENERAL_GET, com_main.UpManager.STYLE_FULL, true, false);
					break;
				}
				case TASK_UI.POP_GENERAL_GET_VIEWII: {
					SceneManager.openView("com_main.GeneralGetInfoWndII", notification.getBody(), null, com_main.UpManager.STYLE_FULL, true, false);
					break;
				}
				case TASK_UI.POP_GENERAL_TREA_LIST: {
					SceneManager.openView("com_main.GeneralTreaListWnd", notification.getBody(), null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_GENERAL_UPSTAR_VIEWII: {
					SceneManager.openView("com_main.GeneralUpStarView", notification.getBody(), null, UpManager.STYLE_FULL, true, false);
					break;
				}
				case TASK_UI.POP_GENERAL_TUPO_VIEW: {
					SceneManager.openView("com_main.GeneralTuPoView", notification.getBody(), null, UpManager.STYLE_FULL, true, false);
					break;
				}
				case TASK_UI.POP_GENERAL_UNLOCK_SKILL: {
					SceneManager.openView("com_main.GeneralUnLockSkill", notification.getBody(), null, UpManager.STYLE_FULL, true, false);
					break;
				}
				case TASK_UI.POP_GENERAL_UPGRADE_VIEW: {
					SceneManager.openView("com_main.GeneraUpgradeView", notification.getBody(), null, UpManager.STYLE_UP, true, false);
					break;
				}
				default:
					break;
			}
		}

	}
}