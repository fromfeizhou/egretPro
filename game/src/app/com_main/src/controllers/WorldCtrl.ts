module com_main {

	export class WorldCtrl extends AGame.Controller {

		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_WORLD_HERO_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_VIEW_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_HERO_EVT_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_CITY_INFO_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_ACCELERATE_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_RULE_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_BATTLE_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_BATTLE_VIEW, WorldCtrl],
				[TASK_UI.POP_WORLD_THUM_VIEW, WorldCtrl],
				[TASK_UI.POP_WORLD_RANK_VIEW, WorldCtrl],
				[TASK_UI.POP_WORLD_VISIT_ATTACK, WorldCtrl],
				[TASK_UI.POP_WORLD_SIEGE_VIEW, WorldCtrl],
				[TASK_UI.POP_WORLD_SEARCH_VIEW, WorldCtrl],
				[TASK_UI.POP_WORLD_SIEGE_RESULT, WorldCtrl],
				[TASK_UI.POP_WORLD_SIEGE_KILL, WorldCtrl],
				[TASK_UI.POP_WORLD_FIRST_OCCUPY_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_MAIN_EXPLOIT_WND, WorldCtrl],
				[TASK_UI.POP_WORLD_LOCK_TASK_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_TROOP_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_NEW_OPEN_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_DIALOG_VIEW, WorldCtrl],
				[TASK_UI.POP_WORLD_CITY_TROOP_PANEL, WorldCtrl],
				[TASK_UI.POP_WORLD_CITY_BUILDING, WorldCtrl],
				[TASK_UI.POP_WORLD_CITY_BUILD_INFO, WorldCtrl],
				[TASK_UI.POP_WORLD_NOTICE_VIEW, WorldCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName()
				, body = notification.getBody();
			debug("===========WorldCtrl:execute==================", name, body);
			switch (name) {
				case TASK_UI.POP_WORLD_HERO_PANEL: {
					SceneManager.openView("com_main.WorldHeroPanel", body, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_NOTICE_VIEW: {
					SceneManager.openView("com_main.WorldNoticeWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					break;
				}
				case TASK_UI.POP_WORLD_HERO_EVT_PANEL: {
					SceneManager.openView("com_main.WorldHeroEvtPanel", body, null, UpManager.STYLE_UP);
					break;
				}
				case TASK_UI.POP_WORLD_VIEW_PANEL: {
					SceneManager.openView("com_main.WorldVisitPanel", body.id, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_VISIT_ATTACK: {
					SceneManager.openView("com_main.WorldVisitAttack", body.id, null, UpManager.STYLE_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_LOCK_TASK_PANEL: {
					SceneManager.openView("com_main.WorldLockTaskPanel", body, null, UpManager.STYLE_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_CITY_INFO_PANEL: {
					SceneManager.openView("com_main.WorldCityInfoPanel", body.conf, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_ACCELERATE_PANEL: {
					SceneManager.openView("com_main.WorldAcceleratePanel", body, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_RULE_PANEL: {
					SceneManager.openView("com_main.WorldRulePanel", null, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_BATTLE_VIEW: {
					SceneManager.openView("com_main.WorldBattleView", null, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_BATTLE_PANEL: {
					SceneManager.openView("com_main.WorldBattlePanel", body, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_THUM_VIEW: {
					SceneManager.openView("com_main.WorldThumView", null, ModuleEnums.WORLD_MINI_MAP, com_main.UpManager.STYLE_FULL, false, false);
					break;
				}
				case TASK_UI.POP_WORLD_RANK_VIEW: {
					SceneManager.openView("com_main.WorldRankView", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_SIEGE_VIEW: {
					SceneManager.openView("com_main.WorldSiegeView", body, null, UpManager.STYLE_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_SEARCH_VIEW: {
					SceneManager.openView("com_main.WorldSearchView", body, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_CITY_TROOP_PANEL: {
					SceneManager.openView("com_main.WorldCityTroopPanel", body, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_SIEGE_RESULT: {
					SceneManager.openView("com_main.WorldSiegeResult", body, null, UpManager.STYLE_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_SIEGE_KILL: {
					SceneManager.openView("com_main.WorldSiegeRankView", body, null, UpManager.STYLE_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_FIRST_OCCUPY_PANEL: {
					SceneManager.openView("com_main.WorldFirstOccupyPanel", body, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_MAIN_EXPLOIT_WND: {
					SceneManager.openView("com_main.ExploitMainWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_TROOP_PANEL: {
					SceneManager.openView("com_main.WorldTroopPanel", body, null, UpManager.STYLE_UP);
					Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_DIALOG_VIEW: {
					//世界地图
					SceneManager.openView("com_main.WorldDialogView", body, null, UpManager.STYLE_FULL, true, false, 0, false);
					break;
				}
				case TASK_UI.POP_WORLD_NEW_OPEN_PANEL: {
					SceneManager.openView("com_main.WorldCityNewOpenPanel", body, null, UpManager.STYLE_UP);
					// Loading.hide();
					break;
				}
				case TASK_UI.POP_WORLD_CITY_BUILDING: {
					SceneManager.openView("com_main.CityBuildView", body, null, UpManager.STYLE_UP);
					break;
				}
				case TASK_UI.POP_WORLD_CITY_BUILD_INFO: {
					SceneManager.openView("com_main.BuildInfoView", body, null, UpManager.STYLE_UP);
					break;
				}
			}
		}
	}

}