
module com_main {
	export class FunctionCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				//[TASK_UI.POP_FUNCITON_NEW_OPEN_VIEW, FunctionCtrl],
				// [TASK_UI.POP_FUNCITON_NOTIC_VIEW, FunctionCtrl],
				// [TASK_UI.POP_FUNCITON_OPEN_VIEW, FunctionCtrl],
				[TASK_UI.POP_FUNCITON_PREVIEW_VIEW, FunctionCtrl],
				[TASK_UI.POP_FUNCITON_NEW_VIEW, FunctionCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			switch (name) {
				// case TASK_UI.POP_FUNCITON_NEW_OPEN_VIEW: {
				// 	let ft = notification.getBody();
				// 	let view = SceneManager.getView("com_main.FunctionOpenPanel", ft);
				// 	UpManager.popSmallView(view, null, true);
				// 	break;
				// }
				// case TASK_UI.POP_FUNCITON_NOTIC_VIEW: {
				// 	let ft = notification.getBody();
				// 	let view = SceneManager.getView("com_main.FunctionNoticPanel", ft);
				// 	UpManager.popSmallView(view, null, false);
				// 	break;
				// }

				// case TASK_UI.POP_FUNCITON_OPEN_VIEW: {
					// SceneManager.openView("com_main.FuncOpenView", notification.getBody(), null, UpManager.STYLE_UP, false, false);
					// break;
				// }
				case TASK_UI.POP_FUNCITON_PREVIEW_VIEW: {
					SceneManager.openView("com_main.FunctionPreviewPanel", notification.getBody(), null, UpManager.STYLE_UP, false, false);
					break;
				}
				case TASK_UI.POP_FUNCITON_NEW_VIEW: {
					SceneManager.openView("com_main.FunctionOpenNewPanel", notification.getBody(), null, UpManager.STYLE_FULL, false, false);
					break;
				}
			}
		}
	}
}