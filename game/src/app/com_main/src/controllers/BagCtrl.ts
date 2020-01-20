/**
 * 背包ctrl
 */
module com_main {
	export class BagCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_BAG_LIST_VIEW, BagCtrl],
				[TASK_UI.POP_BAG_PANEL, BagCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TavernCtrl:execute------>>", notification);
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.POP_BAG_LIST_VIEW: {
					
					let isOpen = com_main.UpManager.isCurrentOpenView(com_main.BagView.NAME);
					if(isOpen){
						UpManager.close(false,false);
						SceneManager.openView("com_main.BagView",body,null,UpManager.STYLE_MAIN_FULL,true,false);
					}else 
					{
						SceneManager.openView("com_main.BagView",body,null,UpManager.STYLE_MAIN_FULL,true,false);
						
					}
					
					Loading.hide();
					break;
				}
				case TASK_UI.POP_BAG_PANEL: {
					// let view = SceneManager.getView("com_main.BagPanel", body);
					// UpManager.popSmallView(view, "");
					// Loading.hide();
					break;
				}
				default:
					break;
			}
		}
	}
}