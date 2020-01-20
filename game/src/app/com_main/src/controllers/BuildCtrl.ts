module com_main {
	export class BuildCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_BUILDING_INFO_VIEW, BuildCtrl],
				[TASK_UI.POP_BUILD_LEVEL_UP_VIEW, BuildCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("BuildCtrl:execute------>>", notification);
			let name = notification.getName();
			let body = notification.getBody();
			switch (name) {
				case TASK_UI.POP_BUILDING_INFO_VIEW: {
					let view  = SceneManager.getClass(LayerEnums.POPUP, BuildingInfoView.NAME) as BuildingInfoView;
					if(view){
						view.changeBuildingInfo(notification.getBody());
					}else{
						SceneManager.openView("com_main.BuildingInfoView",notification.getBody(),null,UpManager.STYLE_MAIN_FULL,false,true);							
					}
					break;
				}
				case TASK_UI.POP_BUILD_LEVEL_UP_VIEW: {
					 SceneManager.openView("com_main.BuildLevelUpView",notification.getBody(),null,UpManager.STYLE_UP,true,false);							
					break;
				}
			
				default:
					break;
			}
		}
	}
}