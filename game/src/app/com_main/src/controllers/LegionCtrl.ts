/**
 * 联盟ctrl
 */
module com_main {
	export class LegionCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.LEGION_LIST_WND, LegionCtrl],
				[TASK_UI.LEGION_CREATE_WND, LegionCtrl],
				[TASK_UI.LEGION_MAIN_WND, LegionCtrl],
				[TASK_UI.LEGION_INFO_PANEL, LegionCtrl],
				[TASK_UI.LEGION_RANK_PANEL, LegionCtrl],
				[TASK_UI.LEGION_INVITATE_PANEL, LegionCtrl],
				[TASK_UI.LEGION_RECORD_WND, LegionCtrl],
				[TASK_UI.LEGION_APPLY_WND, LegionCtrl],
				[TASK_UI.LEGION_SET_NOTICE_WND, LegionCtrl],
				[TASK_UI.LEGION_SET_WND, LegionCtrl],
				[TASK_UI.LEGION_APPOINT_WND, LegionCtrl],
				[TASK_UI.LEGION_TECH_WND,LegionCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			debug("TavernCtrl:execute------>>", notification);
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.LEGION_LIST_WND: {
					//打开联盟列表面板
					SceneManager.openView("com_main.LegionListWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.LEGION_CREATE_WND: {
					//打开创建联盟面板
					SceneManager.openView("com_main.LegionCreateWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.LEGION_MAIN_WND: {
					//打开联盟主面板
					SceneManager.openView("com_main.LegionMainWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					Loading.hide();
					break;
				}
				case TASK_UI.LEGION_SET_WND: {
					//联盟设置面板
					SceneManager.openView("com_main.LegionSetWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.LEGION_APPOINT_WND: {
					//联盟任命
					SceneManager.openView("com_main.LegionAppointWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.LEGION_SET_NOTICE_WND: {
					//联盟公告修改
					SceneManager.openView("com_main.LegionSetNoticeWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.LEGION_RECORD_WND: {
					//联盟记录
					SceneManager.openView("com_main.LegionRecordWnd", body, null, UpManager.STYLE_UP, true, false);
					Loading.hide();
					break;
				}
				case TASK_UI.LEGION_APPLY_WND: {
					//联盟申请
					SceneManager.openView("com_main.LegionApplyWnd", body, null, UpManager.STYLE_UP, true, false);
					Loading.hide();
					break;
				}
				case TASK_UI.LEGION_TECH_WND: {
					//联盟科技
					SceneManager.openView("com_main.LegionTechWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}

				case TASK_UI.LEGION_INFO_PANEL: {
					// SceneManager.openView("com_main.LegionOtherInfo", body, null, UpManager.STYLE_MAIN_FULL, true,false);
					// Loading.hide();
					break;
				}
				default:
					break;
			}
		}
	}
}