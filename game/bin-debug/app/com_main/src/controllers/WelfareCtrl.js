// module com_main {
// 	export class WelfareCtrl extends AGame.Controller {
// 		public constructor() {
// 			super();
// 		}
// 		public listenerRouterNotifications() {
// 			return [
// 				[TASK_UI.WELFARE_PANEL, WelfareCtrl],
// 			];
// 		}
// 		public execute(notification: AGame.INotification) {
// 			let name = notification.getName();
// 			switch (name) {
// 				case TASK_UI.WELFARE_PANEL: {
// 					SceneManager.openView("com_main.Welfare",notification.getBody(),null,UpManager.STYLE_MAIN_FULL,false,false);
// 					Loading.hide();
// 					break;
// 				}
// 			}
// 		}
// 	}
// }
