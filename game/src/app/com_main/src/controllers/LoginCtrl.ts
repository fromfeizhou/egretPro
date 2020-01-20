module com_main {
	export class LoginCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_LOGIN_SERVER_LIST, LoginCtrl],
				[TASK_UI.POP_LOGIN_CREATE_ROLE_VIEW, LoginCtrl],
				[TASK_UI.POP_LOGIN_SELECT_ROLE_VIEW, LoginCtrl],
				[TASK_UI.POP_LOGIN_NOTICE,LoginCtrl],
				
			];
		}

		public execute(notification: AGame.INotification) {
			debug("LoginCtrl:execute------>>", notification);
			var name = notification.getName();
			switch (name) {
				case TASK_UI.POP_LOGIN_SERVER_LIST: {
					SceneManager.openView("com_main.LoginServerList", notification.getBody(),ModuleEnums.LOGIN_NOTICE,UpManager.STYLE_UP);
					// let view = SceneManager.getView("com_main.LoginServerList", notification.getBody());
					// UpManager.popSmallView(view);
					break;
				}
				case TASK_UI.POP_LOGIN_NOTICE:{
					SceneManager.openView("com_main.LoginNoticeWnd", notification.getBody(),ModuleEnums.LOGIN_NOTICE,UpManager.STYLE_UP);
					break;
				}
				case TASK_UI.POP_LOGIN_CREATE_ROLE_VIEW: {
					let view = SceneManager.getView("com_main.LoginCreateRoleView", notification.getBody());
					UpManager.popSmallView(view);
					break;
				}
				case TASK_UI.POP_LOGIN_SELECT_ROLE_VIEW: {
					let view = SceneManager.getView("com_main.LoginSelectRoleView", notification.getBody());
					UpManager.popSmallView(view);
					break;
				}
				
				default:
					break;
			}
		}
	}
}