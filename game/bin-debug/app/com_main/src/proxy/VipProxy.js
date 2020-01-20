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
//任务
var VipProxy = /** @class */ (function (_super_1) {
    __extends(VipProxy, _super_1);
    function VipProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    VipProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_VIP_DAILY_REWARD, this, 'C2S_VIP_DAILY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_VIP_DAILY_REWARD, this, 'S2C_VIP_DAILY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_VIP_LEVEL_REWARD, this, 'C2S_VIP_LEVEL_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_VIP_LEVEL_REWARD, this, 'S2C_VIP_LEVEL_REWARD', ProxyEnum.RECEIVE],
        ];
    };
    VipProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_VIP_DAILY_REWARD: {
                var data = body;
                if (data.errorCode == 0) {
                    VipModel.updateVipVo(data.rechargeInfo);
                    VipModel.receiveDailyReward(data);
                }
                break;
            }
            case ProtoDef.S2C_VIP_LEVEL_REWARD: {
                var data = body;
                if (data.errorCode == 0) {
                    VipModel.updateVipVo(data.rechargeInfo);
                    VipModel.receiveLevelReward(data);
                }
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**充值成功请求 */
    VipProxy.rechargeSucc = function (data) {
        // let chargeCfg: RechargeConfig = C.RechargeConfig[data.id];
        // switch (chargeCfg.shopType) {
        // 	/**更新一元购 */
        // 	case RechargeType.ONE_GIFT_BAG: {
        // 		let vo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.ONE_GIFT_BAG);
        // 		if (vo) vo.requestActivityInfo();
        // 		return;
        // 	}
        // 	/**更新直购礼包 */
        // 	case RechargeType.PURCHAGE_BAG: {
        // 		let vo = ActivityModel.getActivityVo<AcPuGigtBagVo>(AcViewType.PURCHAGE_BAG);
        // 		if (vo && data.rechargeInfo) {
        // 			vo.initPuGiftBagData(data.rechargeInfo.rechargedIds)
        // 		}
        // 		Utils.open_view(TASK_UI.GET_REWARD_VIEW, chargeCfg.reward);
        // 		break;
        // 	}
        // }
        // //首充刷新
        // let vo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.FIRST_RECHARGE);
        // if (vo) vo.requestActivityInfo();
    };
    /**Vip每日奖励*/
    VipProxy.C2S_VIP_DAILY_REWARD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_VIP_DAILY_REWARD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * vip等级奖励
     *
     * */
    VipProxy.C2S_VIP_LEVEL_REWARD = function (level) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_VIP_LEVEL_REWARD);
        data.level = level;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return VipProxy;
}(BaseProxy));
