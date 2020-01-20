module com_main {
	export class MenuCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.MENU_MAIN_TOP_OTHER, MenuCtrl],
				[TASK_UI.MENU_MAIN_SCENE, MenuCtrl],
				[TASK_UI.MENU_MAIN_HANG, MenuCtrl],
				[TASK_UI.MENU_MAIN_WORLD, MenuCtrl],
				[TASK_UI.MENU_BATTLE_VIEW, MenuCtrl], //战斗界面
				[TASK_UI.MENU_MAIN_CROSS, MenuCtrl],
				[TASK_UI.MENU_MAIN_TOPBAR, MenuCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			let body = notification.getBody();
			switch (name) {
				
				case TASK_UI.MENU_MAIN_TOPBAR: {
					debug('MainTopBar');
					if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, MainTopBar.NAME)) {
						let menu6 = SceneManager.getView("com_main.MainTopBar");
						SceneManager.addChild(LayerEnums.MENU, menu6, 2);
					}
					break;
				}
				case TASK_UI.MENU_MAIN_TOP_OTHER: {
					if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, MainTopOther.NAME)) {
						let menu = SceneManager.getView("com_main.MainTopOther");
						SceneManager.addChild(LayerEnums.MENU, menu, 1);
					}
					break;
				}
				case TASK_UI.MENU_MAIN_SCENE: {
					if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, MainSceneBar.NAME)) {
						let menu = SceneManager.getView("com_main.MainSceneBar");
						SceneManager.addChild(LayerEnums.MENU, menu, 0);
					}
					break;
				}
				case TASK_UI.MENU_MAIN_HANG: {
					if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, MainHangBar.NAME)) {
						let menu = SceneManager.getView("com_main.MainHangBar");
						SceneManager.addChild(LayerEnums.MENU, menu, 0);
					}
					break;
				}
				case TASK_UI.MENU_MAIN_CROSS: {
					if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, MainCrossBar.NAME)) {
						let menu = SceneManager.getView("com_main.MainCrossBar");
						SceneManager.addChild(LayerEnums.MENU, menu, 0);
					}
					break;
				}
				case TASK_UI.MENU_MAIN_WORLD: {
					if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, MainWorldBar.NAME)) {
						let menu7 = SceneManager.getView("com_main.MainWorldBar");
						SceneManager.addChild(LayerEnums.MENU, menu7, 0);
					}
					break;
				}

				case TASK_UI.MENU_BATTLE_VIEW: {   //显示战斗界面
					if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, 'BattleView')) {
						// let menu4 = SceneManager.getView("com_main.BattleView", body);
						// SceneManager.addChild(LayerEnums.MENU, menu4);

						let menu4 = com_main.BattleView.getInstance();//SceneManager.getView("com_main.BattleView", body);
						menu4.setData(body);
						SceneManager.addChild(LayerEnums.MENU, menu4);
					}
					break;
				}
			}
		}
	}
}