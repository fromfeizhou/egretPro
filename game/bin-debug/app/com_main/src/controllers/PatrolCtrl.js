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
    var PatrolCtrl = /** @class */ (function (_super_1) {
        __extends(PatrolCtrl, _super_1);
        function PatrolCtrl() {
            return _super_1.call(this) || this;
        }
        PatrolCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POS_PATROL_OFFLINE_REWARD_VIEW, PatrolCtrl],
                [TASK_UI.POS_PATROL_SPEED_UP_REWARD_VIEW, PatrolCtrl],
                [TASK_UI.POS_PATROL_REWARD_CHANGE_VIEW, PatrolCtrl],
                [TASK_UI.POS_PATROL_AWARD_VIEW, PatrolCtrl],
                [TASK_UI.POS_PATROL_BOSS_VIEW, PatrolCtrl],
                [TASK_UI.POS_PATROL_GET_AWARD_VIEW, PatrolCtrl],
            ];
        };
        PatrolCtrl.prototype.execute = function (notification) {
            var name = notification.getName(), body = notification.getBody();
            debug("===========PatrolCtrl:execute==================", name, body);
            switch (name) {
                case TASK_UI.POS_PATROL_OFFLINE_REWARD_VIEW: {
                    if (platform.isHidePayFunc())
                        return;
                    SceneManager.openView("com_main.OfflineRewardView", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POS_PATROL_SPEED_UP_REWARD_VIEW: {
                    if (platform.isHidePayFunc())
                        return;
                    SceneManager.openView("com_main.SpeedUpRewardView", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POS_PATROL_REWARD_CHANGE_VIEW: {
                    SceneManager.openView("com_main.RewardChangeView", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POS_PATROL_AWARD_VIEW: {
                    SceneManager.openView("com_main.PatrolAwardView", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POS_PATROL_BOSS_VIEW: {
                    SceneManager.openView("com_main.HangBossWnd", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POS_PATROL_GET_AWARD_VIEW: {
                    SceneManager.openView("com_main.HangAwardView", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
            }
        };
        return PatrolCtrl;
    }(AGame.Controller));
    com_main.PatrolCtrl = PatrolCtrl;
})(com_main || (com_main = {}));
