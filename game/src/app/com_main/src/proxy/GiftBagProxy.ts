//任务
class GiftBagProxy extends BaseProxy {
    private static isOpenView: boolean = false;

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_TIME_LIMI_GIFT_BAG_INFO, this, 'C2S_TIME_LIMI_GIFT_BAG_INFO', ProxyEnum.SEND],// 请求返回玩家所有限时礼包列表
            [ProtoDef.S2C_TIME_LIMI_GIFT_BAG_INFO, this, 'S2C_TIME_LIMI_GIFT_BAG_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_TIME_LIMI_GIFT_BAG_BUY, this, 'C2S_TIME_LIMI_GIFT_BAG_BUY', ProxyEnum.SEND],// 玩家个人限时礼包购买
            [ProtoDef.S2C_TIME_LIMI_GIFT_BAG_BUY, this, 'S2C_TIME_LIMI_GIFT_BAG_BUY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TIME_LIMI_GIFT_BAG_AWARD, this, 'C2S_TIME_LIMI_GIFT_BAG_AWARD', ProxyEnum.SEND],// 玩家个人限时礼包领取
            [ProtoDef.S2C_TIME_LIMI_GIFT_BAG_AWARD, this, 'S2C_TIME_LIMI_GIFT_BAG_AWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_SINGLE_TIME_LIMI_GIFT_BAG_INFO, this, 'S2C_SINGLE_TIME_LIMI_GIFT_BAG_INFO', ProxyEnum.RECEIVE],//推送礼包 
        ]
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_TIME_LIMI_GIFT_BAG_INFO: {// 获取
                GiftBagModel.parseData(body);
                break;
            }
            case ProtoDef.S2C_TIME_LIMI_GIFT_BAG_BUY: {//购买成功
                let data = body as gameProto.S2C_TIME_LIMI_GIFT_BAG_BUY;
                 GiftBagModel.setGiftState(data);
                break;
            }
            case ProtoDef.S2C_TIME_LIMI_GIFT_BAG_AWARD: {//领奖返回
                let data = body as gameProto.IS2C_TIME_LIMI_GIFT_BAG_AWARD;
                if (data.resultCode == 0) {
                    EffectUtils.showTips('领取成功', 1, true);
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
                    GiftBagModel.setGiftAward(data.giftbagId);
                }
                break;
            }
            case ProtoDef.S2C_SINGLE_TIME_LIMI_GIFT_BAG_INFO: {//单独推送一个礼包
                let data = body as gameProto.IS2C_SINGLE_TIME_LIMI_GIFT_BAG_INFO;
                GiftBagModel.updateGift(data.gifgBag);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    }

    /**玩家个人限时礼包信息 */
    public static send_C2S_TIME_LIMI_GIFT_BAG_INFO(type: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TIME_LIMI_GIFT_BAG_INFO);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**玩家个人限时礼包购买 */
    public static send_C2S_TIME_LIMI_GIFT_BAG_BUY(shopId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TIME_LIMI_GIFT_BAG_BUY);
        data.shopId = shopId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**玩家个人限时礼包领取 */
    public static send_C2S_TIME_LIMI_GIFT_BAG_AWARD(giftBagId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TIME_LIMI_GIFT_BAG_AWARD);
        data.giftBagId = giftBagId;
        AGame.ServiceBuilder.sendMessage(data);
    }
}