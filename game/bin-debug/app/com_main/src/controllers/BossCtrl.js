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
    var BossCtrl = /** @class */ (function (_super_1) {
        __extends(BossCtrl, _super_1);
        function BossCtrl() {
            return _super_1.call(this) || this;
        }
        BossCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.BOSS_INFO_PANEL, BossCtrl],
                // [TASK_UI.BOSS_BUY_QUICK_PANEL, BossCtrl],
                [TASK_UI.BOSS_BOX_RANKREWARD, BossCtrl],
                [TASK_UI.BOSS_HURT_RANK, BossCtrl],
            ];
        };
        BossCtrl.prototype.execute = function (notification) {
            var name = notification.getName(), body = notification.getBody();
            debug("===========BossCtrl:execute==================", name, body);
            switch (name) {
                case TASK_UI.BOSS_INFO_PANEL: {
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.BossMainWnd.NAME);
                    if (!view)
                        SceneManager.openView("com_main.BossMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                // case TASK_UI.BOSS_BUY_QUICK_PANEL: { //快速购买
                // 	SceneManager.openView("com_main.BossQuickBuyView", body, null, UpManager.STYLE_UP, true, false);
                // 	break;
                // }
                case TASK_UI.BOSS_BOX_RANKREWARD: { //排名奖励界面
                    SceneManager.openView("com_main.BossRankRewardWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.BOSS_HURT_RANK: { //伤害榜单界面
                    SceneManager.openView("com_main.BossHurtWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
            }
        };
        return BossCtrl;
    }(AGame.Controller));
    com_main.BossCtrl = BossCtrl;
})(com_main || (com_main = {}));
