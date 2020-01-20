module com_main {

	/**材料副本 */
	export class MaterialCtrl extends AGame.Controller {
		public constructor() {
			super();
		}
		public listenerRouterNotifications() {
			return [
				[TASK_UI.MATERIAL_INFO_PANEL, MaterialCtrl],
				[TASK_UI.MATERIAL_INFO__BUY_DLG, MaterialCtrl],

			];
		}
		public execute(notification: AGame.INotification) {
			let name = notification.getName()
				, body = notification.getBody();
			debug("===========BossCtrl:execute==================", name, body);
			switch (name) {
				case TASK_UI.MATERIAL_INFO_PANEL: {
					let view = SceneManager.getClass(LayerEnums.POPUP, MaterialWnd.NAME);
					if (!view) SceneManager.openView("com_main.MaterialWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					break;
				}
				case TASK_UI.MATERIAL_INFO__BUY_DLG: {
					SceneManager.openView("com_main.MaterialBuyDlg", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
			}
		}
	}

}