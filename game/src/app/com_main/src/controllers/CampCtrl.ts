module com_main {

	export class CampCtrl extends AGame.Controller {

		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POS_CAMP_VIEW, CampCtrl],
				[TASK_UI.POS_PARTRO_VIEW, CampCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName()
				, body = notification.getBody();
			debug("===========CampCtrl:execute==================", name, body);
			switch (name) {
				case TASK_UI.POS_CAMP_VIEW: {
					SceneManager.openView("com_main.CampNorView", body,null,UpManager.STYLE_MAIN_FULL,false,false);
					Loading.hide();
					break;
				}
				case TASK_UI.POS_PARTRO_VIEW: {
					let view = SceneManager.getClass(LayerEnums.POPUP,CampPatroView.NAME);
					if(!view){
						SceneManager.openView("com_main.CampPatroView", body,null,UpManager.STYLE_MAIN_FULL,false,false);
					}
					Loading.hide();
					break;
				}

				
			}
		}
	}

}