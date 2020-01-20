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
var GiftBagProxy = /** @class */ (function (_super_1) {
    __extends(GiftBagProxy, _super_1);
    function GiftBagProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    GiftBagProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_TIME_LIMI_GIFT_BAG_INFO, this, 'C2S_TIME_LIMI_GIFT_BAG_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_TIME_LIMI_GIFT_BAG_INFO, this, 'S2C_TIME_LIMI_GIFT_BAG_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TIME_LIMI_GIFT_BAG_BUY, this, 'C2S_TIME_LIMI_GIFT_BAG_BUY', ProxyEnum.SEND],
            [ProtoDef.S2C_TIME_LIMI_GIFT_BAG_BUY, this, 'S2C_TIME_LIMI_GIFT_BAG_BUY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TIME_LIMI_GIFT_BAG_AWARD, this, 'C2S_TIME_LIMI_GIFT_BAG_AWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_TIME_LIMI_GIFT_BAG_AWARD, this, 'S2C_TIME_LIMI_GIFT_BAG_AWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_SINGLE_TIME_LIMI_GIFT_BAG_INFO, this, 'S2C_SINGLE_TIME_LIMI_GIFT_BAG_INFO', ProxyEnum.RECEIVE],
        ];
    };
    GiftBagProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_TIME_LIMI_GIFT_BAG_INFO: { // 获取
                GiftBagModel.parseData(body);
                break;
            }
            case ProtoDef.S2C_TIME_LIMI_GIFT_BAG_BUY: { //购买成功
                var data = body;
                GiftBagModel.setGiftState(data);
                break;
            }
            case ProtoDef.S2C_TIME_LIMI_GIFT_BAG_AWARD: { //领奖返回
                var data = body;
                if (data.resultCode == 0) {
                    EffectUtils.showTips('领取成功', 1, true);
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
                    GiftBagModel.setGiftAward(data.giftbagId);
                }
                break;
            }
            case ProtoDef.S2C_SINGLE_TIME_LIMI_GIFT_BAG_INFO: { //单独推送一个礼包
                var data = body;
                GiftBagModel.updateGift(data.gifgBag);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**玩家个人限时礼包信息 */
    GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_INFO = function (type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TIME_LIMI_GIFT_BAG_INFO);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**玩家个人限时礼包购买 */
    GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_BUY = function (shopId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TIME_LIMI_GIFT_BAG_BUY);
        data.shopId = shopId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**玩家个人限时礼包领取 */
    GiftBagProxy.send_C2S_TIME_LIMI_GIFT_BAG_AWARD = function (giftBagId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TIME_LIMI_GIFT_BAG_AWARD);
        data.giftBagId = giftBagId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    GiftBagProxy.isOpenView = false;
    return GiftBagProxy;
}(BaseProxy));
