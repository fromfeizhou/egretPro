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
    var ActivityCtrl = /** @class */ (function (_super_1) {
        __extends(ActivityCtrl, _super_1);
        function ActivityCtrl() {
            return _super_1.call(this) || this;
        }
        ActivityCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_ACTIVITY_REPEAT, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_ONLINE_REWARD, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_SEVEN_DAY, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_ADD_RECHARGE, ActivityCtrl],
                [TASK_UI.POP_PAY_First_VIEW, ActivityCtrl],
                [TASK_UI.POP_KING_VIEW, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_BAR_ATK, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_ONE_GIFT_BAG, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_EMPEROR_DETAILS, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_EMPEROR_RANK, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_TURNTABLE, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_NEW_GENERAL, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_SELECT_REWARD, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_SEVENII, ActivityCtrl],
                [TASK_UI.POP_ACTIVITY_NEWYAER, ActivityCtrl],
            ];
        };
        ActivityCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_ACTIVITY_REPEAT: { //循环活动
                    SceneManager.openView("com_main.RepeatActivityWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_ONLINE_REWARD: { //在线时长奖励
                    SceneManager.openView("com_main.OnlineWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_SEVEN_DAY: { //七日
                    SceneManager.openView("com_main.SevenDayActivityPanel", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_ADD_RECHARGE: { //精彩活动
                    SceneManager.openView("com_main.RechargeMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }
                case TASK_UI.POP_PAY_First_VIEW: { //首充
                    SceneManager.openView("com_main.PayFirstView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_KING_VIEW: { //封王战
                    SceneManager.openView("com_main.KingBattleView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_BAR_ATK: { //n南蛮入侵
                    SceneManager.openView("com_main.BarAttackWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_ONE_GIFT_BAG: { //n一元礼包
                    SceneManager.openView("com_main.OneGiftBagView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE: { //襄阳战预告
                    SceneManager.openView("com_main.EmperorBattleAdvanceView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_EMPEROR_DETAILS: { //襄阳战战况
                    SceneManager.openView("com_main.EmperorBattleDetailsWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_EMPEROR_RANK: { //襄阳战杀敌排行榜
                    SceneManager.openView("com_main.KillRankWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION: { //襄阳战皇帝登基
                    SceneManager.openView("com_main.EmperorBattleCoronationView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_TURNTABLE: { //幸运转盘
                    SceneManager.openView("com_main.TurnTableWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_NEW_GENERAL: { //新武将拜访界面
                    SceneManager.openView("com_main.NewGeneralView", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_SELECT_REWARD: { //选取物品
                    SceneManager.openView("com_main.SelectRewardView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_SEVENII: { //新7天活动
                    SceneManager.openView("com_main.SevenIIWnd", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POP_ACTIVITY_NEWYAER: { //新春活动
                    SceneManager.openView("com_main.NewYearWnd", body, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
            }
        };
        return ActivityCtrl;
    }(AGame.Controller));
    com_main.ActivityCtrl = ActivityCtrl;
})(com_main || (com_main = {}));
