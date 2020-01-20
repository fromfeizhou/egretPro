class NormalProxy extends BaseProxy {
    public constructor() {
        super();
    }

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_SYS_GENERAL_WIN_INFO, this, 'C2S_SYS_GENERAL_WIN_INFO', ProxyEnum.SEND],// 获得怪物武将列表
            [ProtoDef.S2C_SYS_GENERAL_WIN_INFO, this, 'S2C_SYS_GENERAL_WIN_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.S2C_SYS_FUNCOUNT, this, 'S2C_SYS_FUNCOUNT', ProxyEnum.RECEIVE],//模块次数
            [ProtoDef.C2S_SYS_FUNCOUNT, this, 'C2S_SYS_FUNCOUNT', ProxyEnum.SEND],//模块次数

            [ProtoDef.C2S_PLAYER_INTEGRATED_INFORMATION, this, 'C2S_PLAYER_INTEGRATED_INFORMATION', ProxyEnum.SEND],// 玩家综合信息
            [ProtoDef.S2C_PLAYER_INTEGRATED_INFORMATION, this, 'S2C_PLAYER_INTEGRATED_INFORMATION', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_RANK_GUILD, this, 'C2S_RANK_GUILD', ProxyEnum.SEND],// 查看排行榜联盟信息请求
            [ProtoDef.S2C_RANK_GUILD, this, 'S2C_RANK_GUILD', ProxyEnum.RECEIVE],
        ]
    }

    public execute(notification: AGame.INotification) {
        let body = notification.getBody();
        let protocol: number = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_SYS_GENERAL_WIN_INFO: {
                NormalModel.addGeneralWinInfo(body)
                break;
            }

            case ProtoDef.S2C_SYS_FUNCOUNT: {    //模块次数
                NormalModel.parseFunCount(body.funCount);
                break;
            }

            case ProtoDef.S2C_PLAYER_INTEGRATED_INFORMATION: {   //玩家综合信息
                Utils.open_view(TASK_UI.PLAYER_INFO_PANEL, body);
                break;
            }
            case ProtoDef.S2C_RANK_GUILD: {   //查看排行榜联盟信息
                Utils.open_view(TASK_UI.LEGION_INFO_CHECK_VIEW, body);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    }

    /**获得怪物武将列表 */
    public static C2S_SYS_GENERAL_WIN_INFO(npcId: number) {
        //读取本地缓存数据 模拟发送
        let genData = NormalModel.getGeneralWinInfo(npcId);
        if (genData) {
            let body: gameProto.IS2C_SYS_GENERAL_WIN_INFO = { npcId: npcId, generalWinInfo: genData };
            AGame.ServiceBuilder.notifyView(new AGame.Notification(ProtoDef.S2C_SYS_GENERAL_WIN_INFO, body));
            return;
        }

        let data: gameProto.C2S_SYS_GENERAL_WIN_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SYS_GENERAL_WIN_INFO);
        data.npcId = npcId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**玩家综合信息 */
    public static C2S_PLAYER_INTEGRATED_INFORMATION(playerId: number) {
        let data: gameProto.IC2S_PLAYER_INTEGRATED_INFORMATION = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_INTEGRATED_INFORMATION);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    public static send_C2S_SYS_FUNCOUNT() {
        let data: gameProto.IC2S_SYS_FUNCOUNT = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SYS_FUNCOUNT);
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**查看排行榜联盟信息请求 */
    public static C2S_RANK_GUILD(giildId: number) {
        let data: gameProto.IC2S_RANK_GUILD = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RANK_GUILD);
        data.giildId = giildId;
        AGame.ServiceBuilder.sendMessage(data);
    }

}