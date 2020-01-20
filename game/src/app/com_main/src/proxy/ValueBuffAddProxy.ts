class ValueBuffAddProxy extends BaseProxy {
    public constructor() {
        super();
    }

    protected listenerProtoNotifications(): any[] {
        return [
            [ProtoDef.VALUEBUFF_TYPE_ADD, this, 'ValueBuffAddReq', 'ValueBuffAddResp'],//资源加成
        ];
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.VALUEBUFF_TYPE_ADD: {
                if (body.sumAdd) {
                    RoleData.arenaExp = body.sumAdd;
                }
                break;
            }
            default:
                break;
        }

        AGame.ServiceBuilder.notifyView(notification);
    }

	/**
	 * 发送资源加成请求
	 */
    public static send_VALUEBUFF_TYPE_ADD(type) {
        debug("VersusProxy:send_VALUEBUFF_TYPE_ADD--->>");
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.VALUEBUFF_TYPE_ADD);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    }
}