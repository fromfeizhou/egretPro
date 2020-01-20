module com_main {
	export class TestCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TestNav.TEST_ANIM, TestCtrl],
				[TASK_UI.AWAY_FROM_KEYBOARD,TestCtrl],
				[TestNav.TEST_WAR, TestCtrl],
				[TestNav.TEST_SETTING, TestCtrl]
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TestCtrl:execute------>>", notification);
			var name = notification.getName();
			switch (name) {
				case TestNav.TEST_ANIM:
					MapUtil.initMapData(6);
					let setting = MapLoader.getMapSetting(6);
					let map: TestAnimMap = SceneManager.getView("com_main.TestAnimMap");
					map.setMapSetting(setting);
					SceneManager.addChild(LayerEnums.MAP, map);

					var testAnimUI = SceneManager.getView("com_main.TestAnimUI");
					SceneManager.addChild(LayerEnums.MENU, testAnimUI);
								// com_main.UpManager.close();

								// var battleView = SceneManager.getView("com_main.BattleView");
								// SceneManager.addChild(LayerEnums.MENU, battleView);

					// SceneManager.openView("com_main.TestWarview",null,null,UpManager.STYLE_MAIN_FULL,false,false);
								

					Loading.hide();
					break;

				case TASK_UI.AWAY_FROM_KEYBOARD:
					// SceneManager.openView("com_main.AwayKeyboardView",null,null,UpManager.STYLE_MAIN_FULL,false,false);
					// let map1 = SceneManager.getView("com_main.AwayKeyboardView");
					let map1 = com_main.AwayKeyboardView.getInstance();
					map1.initData();
					SceneManager.addChild(LayerEnums.MAP, map1);
					break;
				case TestNav.TEST_WAR:
					SceneManager.openView("com_main.TestWarview",null,null,UpManager.STYLE_MAIN_FULL,false,false);
					break;
				case TestNav.TEST_SETTING:
					SceneManager.openView("com_main.TestSettingView",null,null,UpManager.STYLE_UP);
					// SceneManager.openView("com_main.TestVideo",null,null,UpManager.STYLE_UP);
					break;
				default:
					break;
			}
		}
	}
}