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
/**
 * 跨服战
 */
var CrossProxy = /** @class */ (function (_super_1) {
    __extends(CrossProxy, _super_1);
    function CrossProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    CrossProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_UPDATE, this, 'C2S_CROSS_SERVER_WAR_TEAM_UPDATE', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_UPDATE, this, 'S2C_CROSS_SERVER_WAR_TEAM_UPDATE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_WAR_RIVAL_INFO, this, 'C2S_CROSS_SERVER_WAR_RIVAL_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_WAR_RIVAL_INFO, this, 'S2C_CROSS_SERVER_WAR_RIVAL_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_ARMY_GROUP, this, 'C2S_CROSS_SERVER_ARMY_GROUP', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_ARMY_GROUP, this, 'S2C_CROSS_SERVER_ARMY_GROUP', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_ARMY_HP, this, 'C2S_CROSS_SERVER_ARMY_HP', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_ARMY_HP, this, 'S2C_CROSS_SERVER_ARMY_HP', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS, this, 'C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS, this, 'S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO, this, 'S2C_CROSS_SERVER_WAR_TROOPS_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_WAR_ENTER, this, 'C2S_CROSS_SERVER_WAR_ENTER', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_WAR_ENTER, this, 'S2C_CROSS_SERVER_WAR_ENTER', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_WAR_SAND_INFO, this, 'C2S_CROSS_SERVER_WAR_SAND_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_WAR_SAND_INFO, this, 'S2C_CROSS_SERVER_WAR_SAND_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_BUY_BUFFER, this, 'C2S_CROSS_SERVER_BUY_BUFFER', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO, this, 'S2C_CROSS_SERVER_BUFFER_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CROSS_SERVER_GET_HONOR, this, 'S2C_CROSS_SERVER_GET_HONOR', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_GET_HONOR_BOX, this, 'C2S_CROSS_SERVER_GET_HONOR_BOX', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX, this, 'S2C_CROSS_SERVER_GET_HONOR_BOX', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_GET_DAY_REWARD, this, 'C2S_CROSS_SERVER_GET_DAY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD, this, 'S2C_CROSS_SERVER_GET_DAY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE, this, 'S2C_CROSS_SERVER_CITY_CHANGE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_TEAM_MOVE, this, 'C2S_CROSS_SERVER_TEAM_MOVE', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE, this, 'S2C_CROSS_SERVER_TEAM_MOVE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_INFO, this, 'C2S_CROSS_SERVER_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_INFO, this, 'S2C_CROSS_SERVER_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CROSS_SERVER_GATE_HP, this, 'S2C_CROSS_SERVER_GATE_HP', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_GATE_INFO, this, 'S2C_CROSS_SERVER_GATE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_ATTACK_GATE, this, 'C2S_CROSS_SERVER_ATTACK_GATE', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_CITY_STATUS, this, 'S2C_CROSS_SERVER_CITY_STATUS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CROSS_SERVER_BUY_TOWER, this, 'C2S_CROSS_SERVER_BUY_TOWER', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_SETTLEMENT_DATA, this, 'S2C_CROSS_SERVER_SETTLEMENT_DATA', ProxyEnum.SEND],
            [ProtoDef.S2C_CROSS_SERVER_BATTLE_SETTLEMENT, this, 'S2C_CROSS_SERVER_BATTLE_SETTLEMENT', ProxyEnum.SEND],
        ];
    };
    CrossProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_UPDATE: {
                var data = body;
                EffectUtils.showTips(GCode(CLEnum.CAMP_SUC), 1);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS: {
                var data = body;
                EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_SUC));
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO: {
                var data = body;
                CrossModel.curTroop = data.totalTroops;
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_SAND_INFO: {
                Loading.hide();
                var data = body;
                if (data && data.cityList)
                    CrossModel.parseSandTable(data.cityList);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_BUFFER_INFO: { //购买Buffer
                var data = body;
                // if (data) CrossModel.parseSandTable(data);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_GET_HONOR: { //推送玩家累计荣誉
                var data = body;
                if (data)
                    CrossModel.parseGetHonor(data);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX: { //领取荣誉宝箱
                var data = body;
                if (data)
                    CrossModel.parseGetHonorBox(data);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD: { //领取每日奖励
                var data = body;
                if (data)
                    CrossModel.parseGetDayReward(data);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_RIVAL_INFO: {
                Loading.hide();
                var data = body;
                CrossModel.parseCrossServerDetail(data);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_ARMY_GROUP: { //军团信息
                CrossModel.parseCrossLegionData(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_ARMY_HP: { //军团血量
                CrossModel.parseCrossLegionDataHp(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_GATE_HP: { //血量刷新
                CrossModel.parseGateHp(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_CITY_STATUS: { //城攻击状态
                var data = body;
                if (data.isGate) {
                    CrossModel.parseWallStatus(data);
                }
                else {
                    CrossModel.updateCityStatus(data);
                }
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_GATE_INFO: { //外城信息
                Loading.hide();
                CrossModel.parseGateInfo(body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_WAR_ENTER: { //获取内城信息
                Loading.hide();
                var data = body;
                for (var i = 1; i <= 2; i++) {
                    var info = new gameProto.WarAreaVo();
                    info.areaId = i + 5;
                    info.status = 0;
                    if (data.group == i) {
                        info.occupant = data.group;
                    }
                    else {
                        info.occupant = data.group == 1 ? 2 : 1;
                    }
                    data.areaList.push(info);
                }
                CrossModel.setSelfGroup(data.group);
                CrossModel.updateCityInfo(data.areaList);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_CITY_CHANGE: { //内城信息变化
                var data = body;
                CrossModel.updateCityInfo([data.areaData]);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_INFO: { //跨服信息
                var data = body;
                CrossModel.parseCrossServerInfo(data);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_TEAM_MOVE: { //派遣队伍
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_SETTLEMENT_DATA: { //结算界面
                Utils.open_view(TASK_UI.CROSS_RESULT_VIEW, body);
                break;
            }
            case ProtoDef.S2C_CROSS_SERVER_BATTLE_SETTLEMENT: { //国战结算界面
                var ret = WorldModel.updateCrossSiegeResult(body);
                notification.setBody(ret);
                // com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_SIEGE_END, { result: ret });
                var data = { result: ret };
                //等待界面也要弹出结算
                if (BattleModel.isCityWar() || SceneManager.getCurrScene() == SceneEnums.WAIT_BATTLE_MAP) {
                    if (data.result && WorldModel.getCityWarInfo() && WorldModel.getCityWarInfo().cityId == data.result.cityId) {
                        var result = data.result;
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
    };
    /**队伍更新 */
    CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_UPDATE = function (order, generalId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_UPDATE);
        data.order = order;
        data.generalId = generalId;
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**跨服战补充兵力 */
    CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS = function (order) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS);
        data.order = order;
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 退出或者进入跨服战
     * @param enter 1进入内城，2退出内城，3进入外城，4退出外城
     *  */
    CrossProxy.C2S_CROSS_SERVER_WAR_ENTER = function (enter) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_ENTER);
        data.enter = enter;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**获得沙盘信息 */
    CrossProxy.C2S_CROSS_SERVER_WAR_SAND_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_SAND_INFO);
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**购买Buffer */
    CrossProxy.C2S_CROSS_SERVER_BUY_BUFFER = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_BUY_BUFFER);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**领取荣誉宝箱 */
    CrossProxy.C2S_CROSS_SERVER_GET_HONOR_BOX = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_GET_HONOR_BOX);
        data.boxId = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**领取每日奖励 */
    CrossProxy.C2S_CROSS_SERVER_GET_DAY_REWARD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_GET_DAY_REWARD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获得对战信息 */
    CrossProxy.C2S_CROSS_SERVER_WAR_RIVAL_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_WAR_RIVAL_INFO);
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**获得军团信息 */
    CrossProxy.C2S_CROSS_SERVER_ARMY_GROUP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_ARMY_GROUP);
        // data.id = CrossModel.getCrossServerActId();
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获得军团信息2 */
    CrossProxy.C2S_CROSS_SERVER_ARMY_HP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_ARMY_HP);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获得跨服信息 */
    CrossProxy.C2S_CROSS_SERVER_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    // /**获取内城信息,每次进入内城UI，都需要请求一次，同步数据 */
    // public static send_C2S_CROSS_SERVER_CITY_INFO(){
    //     let data: gameProto.C2S_CROSS_SERVER_CITY_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_CITY_INFO);
    //     // data.id = CrossModel.getCrossServerActId();
    //     AGame.ServiceBuilder.sendMessage(data);
    // }
    //派遣队伍
    CrossProxy.send_C2S_CROSS_SERVER_TEAM_MOVE = function (teamType, teamId, eId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_TEAM_MOVE);
        // data.id = CrossModel.getCrossServerActId();
        data.teamType = teamType;
        data.teamId = teamId;
        data.toCityId = eId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**攻击城门 */
    CrossProxy.C2S_CROSS_SERVER_ATTACK_GATE = function (teamId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_ATTACK_GATE);
        data.teamId = teamId;
        data.teamType = 1;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**购买箭塔 */
    CrossProxy.send_C2S_CROSS_SERVER_BUY_TOWER = function (cId, index) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CROSS_SERVER_BUY_TOWER);
        data.areaId = cId;
        data.index = index;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return CrossProxy;
}(BaseProxy));
