module com_main {
	export class MapCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.MAP_NOVICE, MapCtrl],
				[TASK_UI.MAP_BATTLE, MapCtrl],
				[TASK_UI.MAP_WORLD, MapCtrl],
				[TASK_UI.MAP_MAIN, MapCtrl],
				[TASK_UI.WAIT_BATTLE_MAP, MapCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("MapCtrl:execute------>>", notification);
			let name = notification.getName();
			let body = notification.getBody();

			switch (name) {
				case TASK_UI.MAP_NOVICE: {
					debug("进入新手地图");
					//let map = SceneManager.getView("com_main.NoviceMap");
					//let map = SceneManager.getView("com_main.GuideBaseMap");
					//SceneManager.addChild(LayerEnums.MAP, map);

					let tempMapId = 1101;
					MapUtil.initMapData(tempMapId);
					let map: BattleMap = SceneManager.getClass(LayerEnums.MAP, BattleMap.NAME);
					if (map) {
						error("onRunMap-->>战场已存在，上一次没销毁！！", map)
					} else {
						map = SceneManager.getView("com_main.BattleMap");
					}
					map.setMapSetting(MapLoader.getMapSetting(tempMapId));
					SceneManager.addChild(LayerEnums.MAP, map);
					break;
				}
				case TASK_UI.MAP_WORLD: {
					debug("进入世界地图");
					let map = SceneManager.getView("com_main.WorldView");
					SceneManager.addChild(LayerEnums.MAP, map);
					// SceneManager.openView("com_main.WorldView", null, SceneEnums.WORLD_CITY, UpManager.STYLE_FULL, true, true, null);
					break;
				}
				case TASK_UI.MAP_BATTLE: {
					debug("进入战场");
					MapUtil.initMapData(BattleModel.getMapId());
					let map: BattleMap = SceneManager.getClass(LayerEnums.MAP, BattleMap.NAME);
					if (map) {
						error("onRunMap-->>战场已存在，上一次没销毁！！", map)
					} else {
						map = SceneManager.getView("com_main.BattleMap");
					}
					map.setMapSetting(MapLoader.getMapSetting(BattleModel.getMapId()));
					SceneManager.addChild(LayerEnums.MAP, map);
					break;
				}
				case TASK_UI.WAIT_BATTLE_MAP: {
					debug("进入排队界面战场");
					MapUtil.initMapData(1);
					let setting = MapLoader.getMapSetting(1);
					let map: WaitBattleMap = SceneManager.getView("com_main.WaitBattleMap",body);
					map.setMapSetting(setting);
					SceneManager.addChild(LayerEnums.MAP, map);

					Loading.hide();
					break;
				}
				case TASK_UI.MAP_MAIN:
					debug("进入主地图");
					if (SceneManager.getCurrScene() == SceneEnums.MAIN_CITY) {
						let map = SceneManager.getView("com_main.MainMap",body);
						SceneManager.addChild(LayerEnums.MAP, map);
					}
					// SceneManager.sceneCreateComplete();
					break;
				default:
					break;
			}
		}
	}
}