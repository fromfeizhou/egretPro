class TeamProxy extends BaseProxy {

    public constructor() {
        super();
    }

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_TEAM_LIST, this, 'C2S_TEAM_LIST', ProxyEnum.SEND],// 队伍列表
            [ProtoDef.S2C_TEAM_LIST, this, 'S2C_TEAM_LIST', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_TEAM_UP, this, 'C2S_TEAM_UP', ProxyEnum.SEND],// 队伍变更
            [ProtoDef.S2C_TEAM_UP, this, 'S2C_TEAM_UP', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_TEAM_SUPPLEMENTARY_TROOPS, this, 'C2S_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.SEND],// 补充兵力
            [ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS, this, 'S2C_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.RECEIVE],

            [ProtoDef.S2C_TEAM_COUNT, this, 'S2C_TEAM_COUNT', ProxyEnum.RECEIVE], //获取队伍最大数
            [ProtoDef.C2S_TEAM_COUNT, this, 'C2S_TEAM_COUNT', ProxyEnum.SEND], //获取队伍最大数

            [ProtoDef.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS, this, 'C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS, this, 'S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_TEAM_SET_AUTOFILL, this, 'C2S_TEAM_SET_AUTOFILL', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAM_SET_AUTOFILL, this, 'S2C_TEAM_SET_AUTOFILL', ProxyEnum.RECEIVE],
        ]
    }

    public execute(notification: AGame.INotification) {
        let body = notification.getBody();
        let protocol: number = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_TEAM_LIST: {
                let data = body as gameProto.IS2C_TEAM_LIST;
                if (TeamModel.oTherPlayerId == 0) {
                    TeamModel.parseTeamList(body);
                } else {
                    TeamModel.parseOtherPlayerItem(body);
                    NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(TeamModel.oTherPlayerId);
                    //查看其他玩家信息
                    TeamModel.oTherPlayerId = 0;//重置
                }
                break;
            }

            case ProtoDef.S2C_TEAM_UP: {
                let data = body as gameProto.S2C_TEAM_UP;
                if (data.state == 0) {
                    EffectUtils.showTips(GCode(CLEnum.CAMP_SUC), 1);
                }
                break;
            }

            case ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS: {
                let data = body as gameProto.IS2C_TEAM_SUPPLEMENTARY_TROOPS;
                if (data.state != 0) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL))
                } else {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_SUC), 1, true)
                }
                break;
            }
            case ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS: {
                let data = body as gameProto.IS2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS;
                if (data.state != 0) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL))
                } else {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_SUC), 1, true)
                }

                break;
            }
            case ProtoDef.S2C_TEAM_COUNT: {
                TeamModel.setMaxTeamNum(body.maxCount);
                com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_MAX_NUM, null);
                break;
            }
            case ProtoDef.S2C_TEAM_SET_AUTOFILL: {
                let data = body as gameProto.S2C_TEAM_SET_AUTOFILL;
                let teamVo: TeamVo = TeamModel.getTeamVoByType(TeamType.WORLD, data.order);
                teamVo.autoFill = data.flag;
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    }

    /**队伍列表 */
    public static C2S_TEAM_LIST(teamType: number, targetId: number = 0) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_LIST);
        data.teamType = teamType;
        data.targetId = targetId;
        if (targetId != 0) TeamModel.oTherPlayerId = targetId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**队伍更新 */
    public static C2S_TEAM_UP(teamType: number, order: number, generalId: number[]) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_UP);
        data.teamType = teamType;
        data.order = order;
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**补充兵力 */
    public static C2S_TEAM_SUPPLEMENTARY_TROOPS(order: number, soldierType: number) {
        let data: gameProto.C2S_TEAM_SUPPLEMENTARY_TROOPS = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_SUPPLEMENTARY_TROOPS);
        data.order = order;
        data.soldierType = soldierType;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**金币补兵 */
    public static C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS(order: number) {
        let data: gameProto.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS);
        data.order = order;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**自動补满*/
    public static C2S_TEAM_SET_AUTOFILL(order: number, flag: boolean) {
        let data: gameProto.C2S_TEAM_SET_AUTOFILL = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_SET_AUTOFILL);
        data.order = order;
        data.flag = flag;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**最大队伍 */
    public static send_C2S_TEAM_COUNT() {
        let data: gameProto.C2S_TEAM_COUNT = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_COUNT);
        AGame.ServiceBuilder.sendMessage(data);
    }
}