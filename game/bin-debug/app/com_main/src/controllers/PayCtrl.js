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
 * 付费类ctrl
 */
var com_main;
(function (com_main) {
    var PayCtrl = /** @class */ (function (_super_1) {
        __extends(PayCtrl, _super_1);
        function PayCtrl() {
            return _super_1.call(this) || this;
        }
        PayCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_PAY_FORTUNE_VIEW, PayCtrl],
                [TASK_UI.POP_PAY_SHOP_VIEW, PayCtrl],
                [TASK_UI.POP_PAY_SHOP_YU_VIEW, PayCtrl],
            ];
        };
        PayCtrl.prototype.execute = function (notification) {
            debug("PayCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_PAY_FORTUNE_VIEW: {
                    SceneManager.openView("com_main.PayFortuneView", 1, null, com_main.UpManager.STYLE_FULL, false, false);
                    break;
                }
                //充值面板
                case TASK_UI.POP_PAY_SHOP_VIEW: {
                    if (platform.isHidePayFunc())
                        return;
                    SceneManager.openView("com_main.PayShopView", 0, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }
                //勾玉充值面板
                case TASK_UI.POP_PAY_SHOP_YU_VIEW: {
                    if (platform.isHidePayFunc())
                        return;
                    if (PlatConst.isRmbPay())
                        return;
                    SceneManager.openView("com_main.PayYuShopView", 0, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }
                // //累计充值奖励
                // case TASK_UI.POP_PAY_SHOP_VIEW_AWARD: {
                //     SceneManager.openView("com_main.PayShopView", 1, null, UpManager.STYLE_FULL, false, false);
                //     break;
                // }
                // case TASK_UI.POP_MAIL_BUG_REPORT_VIEW: {
                //     // let view = SceneManager.getView("com_main.WarcraftPanel", body);
                //     // UpManager.popSmallView(view);
                //     break;
                // }
                default:
                    break;
            }
        };
        return PayCtrl;
    }(AGame.Controller));
    com_main.PayCtrl = PayCtrl;
})(com_main || (com_main = {}));
