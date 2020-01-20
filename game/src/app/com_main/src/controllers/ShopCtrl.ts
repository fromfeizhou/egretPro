/**
 * 背包ctrl
 */
module com_main {
	export class ShopCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.SHOP_TREASURE_PANEL, ShopCtrl],
				// [TASK_UI.SHOP_CLOUD_PANEL, ShopCtrl],
				[TASK_UI.SHOP_BUY_DLG_PANEL, ShopCtrl],
				[TASK_UI.SHOP_FREE_PANEL,ShopCtrl],
				[TASK_UI.SHOP_FREE_SUC_PANEL,ShopCtrl],
				[TASK_UI.SHOP_FREE_RECORD_PANEL,ShopCtrl],
			];
		}

		public execute(notification: AGame.INotification) {
			var name = notification.getName();
			var body = notification.getBody();
			switch (name) {
				case TASK_UI.SHOP_TREASURE_PANEL: { //打开珍宝商人
					SceneManager.openView("com_main.ShopTreasure",body,null,UpManager.STYLE_MAIN_FULL,false,false);
					Loading.hide();
					break;
				}
				// case TASK_UI.SHOP_CLOUD_PANEL: { //打开云游商人
				// 	let view = SceneManager.getView("com_main.ShopCloud");
				// 	UpManager.popSmallView(view, "",false,0,true);
				// 	Loading.hide();
				// 	break;
				// }
				case TASK_UI.SHOP_BUY_DLG_PANEL: { //打开购买弹框
					let view = SceneManager.getView("com_main.ShopBuyDlg",body);
					UpManager.popSmallView(view, "",false,0.6,false);
					Loading.hide();
					break;
				}
				case TASK_UI.SHOP_FREE_PANEL:{	//免单商城
					SceneManager.openView("com_main.ShopFree",body,null,UpManager.STYLE_MAIN_FULL,false,false);
					Loading.hide();
				}
                case TASK_UI.SHOP_FREE_SUC_PANEL: {	//免单成功
                    SceneManager.openView("com_main.ShopFreeSuc", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
				case TASK_UI.SHOP_FREE_RECORD_PANEL: {	//免单记录
                    SceneManager.openView("com_main.ShopFreeRecord", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
				default:
					break;
			}
		}
	}
}