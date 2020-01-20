module com_main {
	export class ArenaCtrl extends AGame.Controller {
		public constructor() {
			super();
		}


		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_ARENA_PANEL, ArenaCtrl],
				[TASK_UI.POP_ARENA_CLEAR_UP_PANEL, ArenaCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			switch (name) {
				case TASK_UI.POP_ARENA_PANEL:
					// let view = SceneManager.getView("com_main.ArenaPop");
					// //UpManager.popSmallView(view, 'font_lt_png');
					// UpManager.popNew(view, "arena_font_png", null, true);  //fix
					let view = SceneManager.getClass(LayerEnums.POPUP,ArenaView.NAME);
					if(!view){
						SceneManager.openView("com_main.ArenaView",null,null,UpManager.STYLE_MAIN_FULL,false,true);
					}
					break;
				case TASK_UI.POP_ARENA_CLEAR_UP_PANEL:
					SceneManager.openView("com_main.ArenaSaodanResultView",notification.getBody(),null,UpManager.STYLE_UP,true,false);
					break;
			}
		}

	}
}