/**
 * 付费类ctrl
 */
module com_main {
    export class PayCtrl extends AGame.Controller {
        public constructor() {
            super();
        }

        public listenerRouterNotifications() {
            return [
                [TASK_UI.POP_PAY_FORTUNE_VIEW, PayCtrl],
                [TASK_UI.POP_PAY_SHOP_VIEW, PayCtrl],
                [TASK_UI.POP_PAY_SHOP_YU_VIEW, PayCtrl],
            ];
        }

        public execute(notification: AGame.INotification) {
            debug("PayCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();

            switch (name) {

                case TASK_UI.POP_PAY_FORTUNE_VIEW: {
                    SceneManager.openView("com_main.PayFortuneView", 1, null, UpManager.STYLE_FULL, false, false);
                    break;
                }

                //充值面板
                case TASK_UI.POP_PAY_SHOP_VIEW: {
                    if (platform.isHidePayFunc()) return;
                    SceneManager.openView("com_main.PayShopView", 0, null, UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }

                //勾玉充值面板
                case TASK_UI.POP_PAY_SHOP_YU_VIEW: {
                    if (platform.isHidePayFunc()) return;
                    if (PlatConst.isRmbPay()) return;
                    SceneManager.openView("com_main.PayYuShopView", 0, null, UpManager.STYLE_MAIN_FULL, false, false);
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
        }
    }
}