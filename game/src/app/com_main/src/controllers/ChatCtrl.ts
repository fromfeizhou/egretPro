module com_main {
	export class ChatCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_CHAT_MAIN, ChatCtrl],
				[TASK_UI.POP_CHAT_MAIN_TIPS, ChatCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.POP_CHAT_MAIN: {
					let view: ChatMainWnd = SceneManager.getClass(LayerEnums.POPUP, ChatMainWnd.NAME);
					if (view) {
						view.changeParam(body);
					} else {
						LoadingRes.loadGroups(ModuleEnums.CHAT, () => {
							SceneManager.openView("com_main.ChatMainWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
							Loading.hide();
						}, this, null);
					}

					break;
				}

				case TASK_UI.POP_CHAT_MAIN_TIPS: {
					let view: ChatMainWnd = SceneManager.getClass(LayerEnums.POPUP, ChatMainWnd.NAME);
					if (view) {
						view.changeTipsView(body)
					}
					break;
				}
			}
		}
	}
}