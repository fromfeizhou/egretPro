var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 背包ctrl
 */
var com_main;
(function (com_main) {
    var ShopCtrl = /** @class */ (function (_super_1) {
        __extends(ShopCtrl, _super_1);
        function ShopCtrl() {
            return _super_1.call(this) || this;
        }
        ShopCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.SHOP_TREASURE_PANEL, ShopCtrl],
                // [TASK_UI.SHOP_CLOUD_PANEL, ShopCtrl],
                [TASK_UI.SHOP_BUY_DLG_PANEL, ShopCtrl],
                [TASK_UI.SHOP_FREE_PANEL, ShopCtrl],
                [TASK_UI.SHOP_FREE_SUC_PANEL, ShopCtrl],
                [TASK_UI.SHOP_FREE_RECORD_PANEL, ShopCtrl],
            ];
        };
        ShopCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.SHOP_TREASURE_PANEL: { //打开珍宝商人
                    SceneManager.openView("com_main.ShopTreasure", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
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
                    var view = SceneManager.getView("com_main.ShopBuyDlg", body);
                    com_main.UpManager.popSmallView(view, "", false, 0.6, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.SHOP_FREE_PANEL: { //免单商城
                    SceneManager.openView("com_main.ShopFree", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                }
                case TASK_UI.SHOP_FREE_SUC_PANEL: { //免单成功
                    SceneManager.openView("com_main.ShopFreeSuc", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.SHOP_FREE_RECORD_PANEL: { //免单记录
                    SceneManager.openView("com_main.ShopFreeRecord", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return ShopCtrl;
    }(AGame.Controller));
    com_main.ShopCtrl = ShopCtrl;
})(com_main || (com_main = {}));
