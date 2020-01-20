/**
 * 跨服战
 */
module com_main {
	export class CrossCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.MAP_CROSS_WAR, CrossCtrl],
				[TASK_UI.MAP_CROSS_WALL_WAR, CrossCtrl],
				[TASK_UI.CROSS_SERVER_TEAM_PANEL, CrossCtrl],
				[TASK_UI.CROSS_SERVER_DETAIL_VIEW, CrossCtrl],
				[TASK_UI.CROSS_SERVER_SAND_TABLE, CrossCtrl],   //战争沙盘
				[TASK_UI.CROSS_SERVER_CITY_TIPS, CrossCtrl],	//城市tips
				[TASK_UI.CROSS_SERVER_BUFF, CrossCtrl],			//跨服战buff
				[TASK_UI.CROSS_SERVER_RANK, CrossCtrl],			//跨服战排行榜
				[TASK_UI.CRSOS_SERVER_WAR_SITUTION, CrossCtrl],	//战况
				[TASK_UI.CROSS_HERO_PANEL, CrossCtrl],	//部队面板
				[TASK_UI.CRSOS_SERVER_LEGION_UI, CrossCtrl],   //军团
				[TASK_UI.CROSS_BARRACKS, CrossCtrl],	//跨服战总兵库
				[TASK_UI.CROSS_BUY_TOWER_PANEL, CrossCtrl],	//跨服战总兵库
				[TASK_UI.CROSS_RESULT_VIEW, CrossCtrl],	//跨服战结算界面
			];
		}

		public execute(notification: AGame.INotification) {
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.MAP_CROSS_WAR: {	//跨服内城战
					let map =  SceneManager.getView("com_main.CSBMap");
					SceneManager.addChild(LayerEnums.MAP, map);
					break;
				}
				case TASK_UI.MAP_CROSS_WALL_WAR: {	//跨服外城战
					let map = SceneManager.getView("com_main.CrossWallWarMap");
					SceneManager.addChild(LayerEnums.MAP, map);
					break;
				}
				case TASK_UI.CROSS_SERVER_TEAM_PANEL: {
					SceneManager.openView("com_main.CrossServerCampView", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.CROSS_SERVER_DETAIL_VIEW: {
					SceneManager.openView("com_main.CrossServerDetailWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.CROSS_SERVER_SAND_TABLE: {	//战争沙盘
					SceneManager.openView("com_main.SandTableWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					Loading.hide();
					break;
				}
				case TASK_UI.CROSS_SERVER_CITY_TIPS: {	//城市tips
					SceneManager.openView("com_main.SandTableCityTipsWnd", body, null, UpManager.STYLE_UP, true, false);
					Loading.hide();
					break;
				}
				case TASK_UI.CROSS_SERVER_BUFF: {	//跨服战buff
					SceneManager.openView("com_main.CrossBuffMainWnd", body, null, UpManager.STYLE_UP, true, false);
					Loading.hide();
					break;
				}
				case TASK_UI.CROSS_SERVER_RANK: {	//跨服战排行榜
					SceneManager.openView("com_main.CrossRankMainWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					Loading.hide();
					break;
				}
				case TASK_UI.CRSOS_SERVER_WAR_SITUTION: {	//战况
					SceneManager.openView("com_main.CrossServerWarSituView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.CROSS_HERO_PANEL:{	//跨服战队伍选择
					SceneManager.openView("com_main.CrossHeroPanel", body, null, UpManager.STYLE_UP);
					break;
				}
				case TASK_UI.CRSOS_SERVER_LEGION_UI: {	//军团
					SceneManager.openView("com_main.CrossLegionWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}

				case TASK_UI.CROSS_BARRACKS: {	//跨服战总兵库
					SceneManager.openView("com_main.CrossBarracksView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}

				case TASK_UI.CROSS_BUY_TOWER_PANEL:{ //建造箭塔
					SceneManager.openView("com_main.CrossBuyTowerView", body, null, UpManager.STYLE_UP, true, false);
				}

				case TASK_UI.CROSS_RESULT_VIEW:{ //活动结束结算界面
					SceneManager.openView("com_main.CrossResultSucView", body, null, UpManager.STYLE_FULL, true, false);
				}
				default:
					break;
			}
		}
	}
}