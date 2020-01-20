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
var PayProxy = /** @class */ (function (_super_1) {
    __extends(PayProxy, _super_1);
    function PayProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    PayProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_JADE_BUY, this, 'C2S_JADE_BUY', ProxyEnum.SEND],
            [ProtoDef.C2S_RECHARGE_CONFIGS, this, 'C2S_RECHARGE_CONFIGS', ProxyEnum.SEND],
            [ProtoDef.S2C_RECHARGE_CONFIGS, this, 'S2C_RECHARGE_CONFIGS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PLAY_ORDERNO, this, 'C2S_PLAY_ORDERNO', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAY_ORDERNO, this, 'S2C_PLAY_ORDERNO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_RECHARGE_INFO, this, 'C2S_RECHARGE_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_RECHARGE_INFO, this, 'S2C_RECHARGE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_RECHARGE, this, 'C2S_RECHARGE', ProxyEnum.SEND],
            [ProtoDef.S2C_RECHARGE, this, 'S2C_RECHARGE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GOLD_BUY, this, 'C2S_GOLD_BUY', ProxyEnum.SEND],
        ];
    };
    PayProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_RECHARGE_CONFIGS: {
                var data = body;
                if (data.activityId == 0) {
                    PayModel.parseRechargeCfg(data.rechargeConfig);
                }
                else {
                    var vo = ActivityModel.getActivityVoById(data.activityId);
                    if (vo)
                        vo.parseRechargeCfg(data.rechargeConfig);
                }
                break;
            }
            // case ProtoDef.S2C_JADE_CONFIGS: {
            // 	let data = body as gameProto.IS2C_JADE_CONFIGS;
            // 	let vo = ActivityModel.getActivityVoById<ActivityVo>(data.activityId);
            // 	if (vo) vo.parseRechargeCfg(data.jadeConfig);
            // 	break;
            // }
            case ProtoDef.S2C_PLAY_ORDERNO: {
                var data = body;
                platform.pay(data.orderNo, data.itemId, data.name, data.price);
                break;
            }
            case ProtoDef.S2C_RECHARGE_INFO: {
                var data = body;
                VipModel.updateVipVo(data.rechargeInfo);
                //更新充值记录
                PayModel.rechargeRecords = data.rechargeIds;
                break;
            }
            case ProtoDef.S2C_RECHARGE: {
                var data = body;
                EffectUtils.showTips(GCode(CLEnum.MAT_BUY_SUC), 1, true);
                if (data.reward && data.reward.length > 0)
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.reward);
                com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, data.id);
                Loading.hide();
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**获得充值配置表 */
    PayProxy.C2S_RECHARGE_CONFIGS = function (activityId, rechargeIds) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECHARGE_CONFIGS);
        data.activityId = activityId;
        data.rechargeIds = rechargeIds;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求玉石超市购买 */
    PayProxy.C2S_JADE_BUY = function (shopId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_JADE_BUY);
        data.shopId = shopId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取订单号 正式环境 */
    PayProxy.send_C2S_PLAY_ORDERNO = function (itemId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAY_ORDERNO);
        data.itemId = itemId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求元宝购买 */
    PayProxy.C2S_GOLD_BUY = function (shopId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GOLD_BUY);
        data.shopId = shopId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**充值信息*/
    PayProxy.C2S_RECHARGE_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECHARGE_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**Vip充值*/
    PayProxy.C2S_RECHARGE = function (id, cost) {
        // 如果正常流程 走充值接口
        var isNormal = PayModel.NORMAL_RECHARGE_CFG.indexOf(id) >= 0;
        if (isNormal || PlatConst.isRmbPay()) {
            if (PlatConst.isNormalPay()) {
                this.send_C2S_PLAY_ORDERNO(id);
            }
            else {
                var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECHARGE);
                data.id = id;
                AGame.ServiceBuilder.sendMessage(data);
            }
        }
        else {
            if (PropModel.isItemEnough(PropEnum.YU, cost, 1)) {
                this.C2S_JADE_BUY(id);
            }
        }
    };
    return PayProxy;
}(BaseProxy));
