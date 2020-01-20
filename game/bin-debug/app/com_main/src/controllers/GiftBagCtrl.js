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
var com_main;
(function (com_main) {
    var GiftBagCtrl = /** @class */ (function (_super_1) {
        __extends(GiftBagCtrl, _super_1);
        function GiftBagCtrl() {
            return _super_1.call(this) || this;
        }
        GiftBagCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_ACTIVITY_ADD_GIFTBAG, GiftBagCtrl],
                [TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, GiftBagCtrl],
                [TASK_UI.POP_ACTIVITY_ADD_GIFTSHOP, GiftBagCtrl],
            ];
        };
        GiftBagCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            switch (name) {
                case TASK_UI.POP_ACTIVITY_ADD_GIFTBAG: {
                    if (platform.isHidePayFunc())
                        return;
                    SceneManager.openView("com_main.GiftBagWnd", notification.getBody(), null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP: {
                    if (platform.isHidePayFunc())
                        return;
                    SceneManager.openView("com_main.GiftBagTisPop", notification.getBody(), null, com_main.UpManager.STYLE_FULL);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_ADD_GIFTSHOP: {
                    SceneManager.openView("com_main.GiftShopWnd", notification.getBody(), null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }
            }
        };
        return GiftBagCtrl;
    }(AGame.Controller));
    com_main.GiftBagCtrl = GiftBagCtrl;
})(com_main || (com_main = {}));
