/**
 * 每日惊喜商城
 */
class DailySurpriseProxy extends BaseProxy {
    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_SURPRISE_MARKET, this, 'C2S_SURPRISE_MARKET', ProxyEnum.SEND],// 每日惊喜商城
            [ProtoDef.S2C_SURPRISE_MARKET, this, 'S2C_SURPRISE_MARKET', ProxyEnum.RECEIVE],
        ]
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_SURPRISE_MARKET: {
                let data = body as gameProto.IS2C_SURPRISE_MARKET;
                if (data) DailySurpriseModel.parseDailySurprise(data);
                break;
            }

            default:
                break;
        }

        AGame.ServiceBuilder.notifyView(notification);
    }

    /**每日惊喜商城 */
    public static C2S_SURPRISE_MARKET() {
        let data: gameProto.C2S_SURPRISE_MARKET = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SURPRISE_MARKET);
        AGame.ServiceBuilder.sendMessage(data);
    }
}