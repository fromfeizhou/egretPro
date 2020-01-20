/**
 * 跨服战
 */
class CrossProxy extends BaseProxy {
    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [

            [ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_UPDATE, this, 'C2S_CROSS_SERVER_WAR_TEAM_UPDATE', ProxyEnum.SEND],// 队伍变更
            [ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_UPDATE, this, 'S2C_CROSS_SERVER_WAR_TEAM_UPDATE', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_WAR_RIVAL_INFO, this, 'C2S_CROSS_SERVER_WAR_RIVAL_INFO', ProxyEnum.SEND],//对战信息
            [ProtoDef.S2C_CROSS_SERVER_WAR_RIVAL_INFO, this, 'S2C_CROSS_SERVER_WAR_RIVAL_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_ARMY_GROUP, this, 'C2S_CROSS_SERVER_ARMY_GROUP', ProxyEnum.SEND],//军团信息
            [ProtoDef.S2C_CROSS_SERVER_ARMY_GROUP, this, 'S2C_CROSS_SERVER_ARMY_GROUP', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_ARMY_HP, this, 'C2S_CROSS_SERVER_ARMY_HP', ProxyEnum.SEND],//军团血量
            [ProtoDef.S2C_CROSS_SERVER_ARMY_HP, this, 'S2C_CROSS_SERVER_ARMY_HP', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS, this, 'C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.SEND],// 补充兵力
            [ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS, this, 'S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.RECEIVE],

            [ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO, this, 'S2C_CROSS_SERVER_WAR_TROOPS_INFO', ProxyEnum.RECEIVE],//库存兵力

            [ProtoDef.C2S_CROSS_SERVER_WAR_ENTER, this, 'C2S_CROSS_SERVER_WAR_ENTER', ProxyEnum.SEND],//是否退出进入跨服战
            [ProtoDef.S2C_CROSS_SERVER_WAR_ENTER, this, 'S2C_CROSS_SERVER_WAR_ENTER', ProxyEnum.RECEIVE],//进入跨服战获取信息

            [ProtoDef.C2S_CROSS_SERVER_WAR_SAND_INFO, this, 'C2S_CROSS_SERVER_WAR_SAND_INFO', ProxyEnum.SEND],//获得沙盘信息
            [ProtoDef.S2C_CROSS_SERVER_WAR_SAND_INFO, this, 'S2C_CROSS_SERVER_WAR_SAND_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_BUY_BUFFER, this, 'C2S_CROSS_SERVER_BUY_BUFFER', ProxyEnum.SEND],//购买Buffer
            [ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO, this, 'S2C_CROSS_SERVER_BUFFER_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.S2C_CROSS_SERVER_GET_HONOR, this, 'S2C_CROSS_SERVER_GET_HONOR', ProxyEnum.RECEIVE],//推送玩家累计荣誉

            [ProtoDef.C2S_CROSS_SERVER_GET_HONOR_BOX, this, 'C2S_CROSS_SERVER_GET_HONOR_BOX', ProxyEnum.SEND],//领取荣誉宝箱
            [ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX, this, 'S2C_CROSS_SERVER_GET_HONOR_BOX', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_GET_DAY_REWARD, this, 'C2S_CROSS_SERVER_GET_DAY_REWARD', ProxyEnum.SEND],//领取每日奖励
            [ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD, this, 'S2C_CROSS_SERVER_GET_DAY_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE, this, 'S2C_CROSS_SERVER_CITY_CHANGE', ProxyEnum.RECEIVE], //内城信息变化

            [ProtoDef.C2S_CROSS_SERVER_TEAM_MOVE, this, 'C2S_CROSS_SERVER_TEAM_MOVE', ProxyEnum.SEND],//派遣队伍
            [ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE, this, 'S2C_CROSS_SERVER_TEAM_MOVE', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_INFO, this, 'C2S_CROSS_SERVER_INFO', ProxyEnum.SEND],//跨服信息
            [ProtoDef.S2C_CROSS_SERVER_INFO, this, 'S2C_CROSS_SERVER_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.S2C_CROSS_SERVER_GATE_HP, this, 'S2C_CROSS_SERVER_GATE_HP', ProxyEnum.SEND], //外城信息hp
            [ProtoDef.S2C_CROSS_SERVER_GATE_INFO, this, 'S2C_CROSS_SERVER_GATE_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_CROSS_SERVER_ATTACK_GATE, this, 'C2S_CROSS_SERVER_ATTACK_GATE', ProxyEnum.SEND], //攻击城门

            [ProtoDef.S2C_CROSS_SERVER_CITY_STATUS, this, 'S2C_CROSS_SERVER_CITY_STATUS', ProxyEnum.RECEIVE],//城攻击状态

            [ProtoDef.C2S_CROSS_SERVER_BUY_TOWER, this, 'C2S_CROSS_SERVER_BUY_TOWER', ProxyEnum.SEND],//购买箭塔

            [ProtoDef.S2C_CROSS_SERVER_SETTLEMENT_DATA, this, 'S2C_CROSS_SERVER_SETTLEMENT_DATA', ProxyEnum.SEND],//结算指令

            [ProtoDef.S2C_CROSS_SERVER_BATTLE_SETTLEMENT, this, 'S2C_CROSS_SERVER_BATTLE_SETTLEMENT', ProxyEnum.SEND],//结算指令
            
        ]
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {

            case ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_UPDATE: {
                let data = body as gameProto.S2C_CROSS_SERVER_WAR_TEAM_UPDATE;
                EffectUtils.showTips(GCode(CLEnum.CAMP_SUC), 1);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS: {
                let data = body as gameProto.IS2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS;
                EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_SUC))
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO: {
                let data = body as gameProto.IS2C_CROSS_SERVER_WAR_TROOPS_INFO;
                CrossModel.curTroop = data.totalTroops;
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_SAND_INFO: {
                Loading.hide();
                let data = body as gameProto.IS2C_CROSS_SERVER_WAR_SAND_INFO;
                if (data && data.cityList) CrossModel.parseSandTable(data.cityList);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO: {//购买Buffer
                let data = body as gameProto.IS2C_CROSS_SERVER_BUFFER_INFO;
                // if (data) CrossModel.parseSandTable(data);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_GET_HONOR: {//推送玩家累计荣誉
                let data = body as gameProto.IS2C_CROSS_SERVER_GET_HONOR;
                if (data) CrossModel.parseGetHonor(data);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX: {//领取荣誉宝箱
                let data = body as gameProto.IS2C_CROSS_SERVER_GET_HONOR_BOX;
                if (data) CrossModel.parseGetHonorBox(data);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD: {//领取每日奖励
                let data = body as gameProto.IS2C_CROSS_SERVER_GET_DAY_REWARD;
                if (data) CrossModel.parseGetDayReward(data);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_WAR_RIVAL_INFO: {
                Loading.hide();
                let data = body as gameProto.IS2C_CROSS_SERVER_WAR_RIVAL_INFO;
                CrossModel.parseCrossServerDetail(data);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_ARMY_GROUP: {    //军团信息
                CrossModel.parseCrossLegionData(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_ARMY_HP: {   //军团血量
                CrossModel.parseCrossLegionDataHp(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_GATE_HP: {    //血量刷新
                CrossModel.parseGateHp(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_CITY_STATUS: {    //城攻击状态
                let data = body as gameProto.IS2C_CROSS_SERVER_CITY_STATUS;
                if (data.isGate) {
                    CrossModel.parseWallStatus(data);
                } else {
                    CrossModel.updateCityStatus(data);
                }

                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_GATE_INFO: {  //外城信息
                Loading.hide();
                CrossModel.parseGateInfo(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_ENTER: { //获取内城信息
                Loading.hide();
                let data = body as gameProto.S2C_CROSS_SERVER_WAR_ENTER;
                for (let i = 1; i <= 2; i++) {
                    let info = new gameProto.WarAreaVo();
                    info.areaId = i + 5;
                    info.status = 0;
                    if (data.group == i) {
                        info.occupant = data.group;
                    } else {
                        info.occupant = data.group == 1 ? 2 : 1;
                    }
                    data.areaList.push(info);
                }
                CrossModel.setSelfGroup(data.group);
                CrossModel.updateCityInfo(data.areaList);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE: { //内城信息变化
                let data = body as gameProto.S2C_CROSS_SERVER_CITY_CHANGE;
                CrossModel.updateCityInfo([data.areaData])
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_INFO: { //跨服信息
                let data = body as gameProto.IS2C_CROSS_SERVER_INFO;
                CrossModel.parseCrossServerInfo(data);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE: { //派遣队伍
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_SETTLEMENT_DATA:{ //结算界面
                Utils.open_view(TASK_UI.CROSS_RESULT_VIEW, body);
                break;
            }

            case ProtoDef.S2C_CROSS_SERVER_BATTLE_SETTLEMENT:{ //国战结算界面
                let ret = WorldModel.updateCrossSiegeResult(body);
                notification.setBody(ret);
                // com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_SIEGE_END, { result: ret });

                let data = { result: ret }
                //等待界面也要弹出结算
                if (BattleModel.isCityWar() || SceneManager.getCurrScene() == SceneEnums.WAIT_BATTLE_MAP) {

                    if (data.result && WorldModel.getCityWarInfo() && WorldModel.getCityWarInfo().cityId == data.result.cityId) {
                        const result: ItfSiegeResult = data.result;
                        Utils.open_view(TASK_UI.POP_WORLD_SIEGE_RESULT, result);
                        return;
                    }
                }
                break;
            }

            default:
                break;
        }

        AGame.ServiceBuilder.notifyView(notification);
    }

    /**队伍更新 */
    public static C2S_CROSS_SERVER_WAR_TEAM_UPDATE(order: number, generalId: number[]) {
        let data: gameProto.C2S_CROSS_SERVER_WAR_TEAM_UPDATE = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_UPDATE);
        data.order = order;
        data.generalId = generalId;
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**跨服战补充兵力 */
    public static C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS(order: number) {
        let data: gameProto.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS);
        data.order = order;
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**
     * 退出或者进入跨服战
     * @param enter 1进入内城，2退出内城，3进入外城，4退出外城
     *  */
    public static C2S_CROSS_SERVER_WAR_ENTER(enter: number) {
        let data: gameProto.C2S_CROSS_SERVER_WAR_ENTER = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_ENTER);
        data.enter = enter;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }

    /**获得沙盘信息 */
    public static C2S_CROSS_SERVER_WAR_SAND_INFO() {
        let data: gameProto.C2S_CROSS_SERVER_WAR_SAND_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_SAND_INFO);
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }

    /**购买Buffer */
    public static C2S_CROSS_SERVER_BUY_BUFFER(id: number) {
        let data: gameProto.C2S_CROSS_SERVER_BUY_BUFFER = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_BUY_BUFFER);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }

    /**领取荣誉宝箱 */
    public static C2S_CROSS_SERVER_GET_HONOR_BOX(id: number) {
        let data: gameProto.C2S_CROSS_SERVER_GET_HONOR_BOX = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_GET_HONOR_BOX);
        data.boxId = id;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**领取每日奖励 */
    public static C2S_CROSS_SERVER_GET_DAY_REWARD() {
        let data: gameProto.C2S_CROSS_SERVER_GET_DAY_REWARD = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_GET_DAY_REWARD);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**获得对战信息 */
    public static C2S_CROSS_SERVER_WAR_RIVAL_INFO() {
        let data: gameProto.C2S_CROSS_SERVER_WAR_RIVAL_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_RIVAL_INFO);
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }
    /**获得军团信息 */
    public static C2S_CROSS_SERVER_ARMY_GROUP() {
        let data: gameProto.C2S_CROSS_SERVER_ARMY_GROUP = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_ARMY_GROUP);
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**获得军团信息2 */
    public static C2S_CROSS_SERVER_ARMY_HP() {
        let data: gameProto.IC2S_CROSS_SERVER_ARMY_HP = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_ARMY_HP);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**获得跨服信息 */
    public static C2S_CROSS_SERVER_INFO() {
        let data: gameProto.C2S_CROSS_SERVER_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }

    // /**获取内城信息,每次进入内城UI，都需要请求一次，同步数据 */
    // public static send_C2S_CROSS_SERVER_CITY_INFO(){
    //     let data: gameProto.C2S_CROSS_SERVER_CITY_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_CITY_INFO);
    //     // data.id = CrossModel.getCrossServerActId();
    //     AGame.ServiceBuilder.sendMessage(data);
    // }

    //派遣队伍
    public static send_C2S_CROSS_SERVER_TEAM_MOVE(teamType: number, teamId?: number, eId?: number) {
        let data: gameProto.C2S_CROSS_SERVER_TEAM_MOVE = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_TEAM_MOVE);
        // data.id = CrossModel.getCrossServerActId();
        data.teamType = teamType;
        data.teamId = teamId;
        data.toCityId = eId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**攻击城门 */
    public static C2S_CROSS_SERVER_ATTACK_GATE(teamId: number) {
        let data: gameProto.IC2S_CROSS_SERVER_ATTACK_GATE = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_ATTACK_GATE);
        data.teamId = teamId;
        data.teamType = 1;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**购买箭塔 */
    public static send_C2S_CROSS_SERVER_BUY_TOWER(cId: number, index: number) {
        let data: gameProto.IC2S_CROSS_SERVER_BUY_TOWER = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_BUY_TOWER);
        data.areaId = cId;
        data.index = index;
        AGame.ServiceBuilder.sendMessage(data);
    }
}