class FateProxy extends BaseProxy {
    public constructor() {
        super();
    }

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_RELATION_EFFECT, this, 'C2S_RELATION_EFFECT', ProxyEnum.SEND],// 激活缘分
            [ProtoDef.S2C_RELATION_EFFECT, this, 'S2C_RELATION_EFFECT', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_RELATION_LIST, this, 'C2S_RELATION_LIST', ProxyEnum.SEND],//已激活列表
            [ProtoDef.S2C_RELATION_LIST, this, 'S2C_RELATION_LIST', ProxyEnum.RECEIVE],//已激活列表

        ]
    }

    public execute(notification: AGame.INotification) {
        let body = notification.getBody();
        let protocol: number = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_RELATION_EFFECT: {
                let data = body as gameProto.IS2C_RELATION_EFFECT;
                if (data.code == 0) {
                    FateModel.updateActiveList(data.id);
                    FateModel.updateCurFateTypeLevel(data.id);
                    com_main.EventMgr.dispatchEvent(FateEvent.FATE_DATA_CHANGE,data.id);
                }

                break;
            }
            case ProtoDef.S2C_RELATION_LIST: {
                let data = body as gameProto.IS2C_RELATION_LIST;
                FateModel.updateGneralFateActiveList(data);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    }


    public static C2S_RELATION_EFFECT(id: number) {
        let data: gameProto.IC2S_RELATION_EFFECT = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RELATION_EFFECT);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    }
    public static C2S_RELATION_LIST() {
        let data: gameProto.IC2S_RELATION_LIST = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RELATION_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    }

}