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
    var RewardCtrl = /** @class */ (function (_super_1) {
        __extends(RewardCtrl, _super_1);
        function RewardCtrl() {
            return _super_1.call(this) || this;
        }
        RewardCtrl.prototype.listenerRouterNotifications = function () {
            return [
                //[MapNav.MAP_CITY_BATTLE_REWARD, RewardCtrl],
                //[TASK_UI.POP_GIFT_BAG_VIEW, RewardCtrl],
                [TASK_UI.GET_REWARD_VIEW, RewardCtrl],
            ];
        };
        RewardCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            switch (name) {
                case MapNav.MAP_CITY_BATTLE_REWARD:
                    var body = notification.getBody();
                    var view = SceneManager.getView("com_main.BuildReward", body);
                    com_main.UpManager.popSmallView(view, "font_dcjl_new_png");
                    com_main.UpManager.mask(true, 0);
                    break;
                case TASK_UI.POP_GIFT_BAG_VIEW: {
                    // let body = notification.getBody();
                    // let view = SceneManager.getView("com_main.GiftBag", body);
                    // UpManager.popSmallView(view, "font_dcjl_new_png");
                    // UpManager.mask(true, 0);
                    break;
                }
                case TASK_UI.GET_REWARD_VIEW: {
                    var body_1 = notification.getBody();
                    //  SceneManager.openView("com_main.GetRewardView",body,null,UpManager.STYLE_FULL,true,false);
                    com_main.GetRewardView.getInstance().show(body_1);
                }
            }
        };
        return RewardCtrl;
    }(AGame.Controller));
    com_main.RewardCtrl = RewardCtrl;
})(com_main || (com_main = {}));
