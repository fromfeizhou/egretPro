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
var TeamProxy = /** @class */ (function (_super_1) {
    __extends(TeamProxy, _super_1);
    function TeamProxy() {
        return _super_1.call(this) || this;
    }
    TeamProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_TEAM_LIST, this, 'C2S_TEAM_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAM_LIST, this, 'S2C_TEAM_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAM_UP, this, 'C2S_TEAM_UP', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAM_UP, this, 'S2C_TEAM_UP', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAM_SUPPLEMENTARY_TROOPS, this, 'C2S_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS, this, 'S2C_TEAM_SUPPLEMENTARY_TROOPS', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_TEAM_COUNT, this, 'S2C_TEAM_COUNT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAM_COUNT, this, 'C2S_TEAM_COUNT', ProxyEnum.SEND],
            [ProtoDef.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS, this, 'C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS, this, 'S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAM_SET_AUTOFILL, this, 'C2S_TEAM_SET_AUTOFILL', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAM_SET_AUTOFILL, this, 'S2C_TEAM_SET_AUTOFILL', ProxyEnum.RECEIVE],
        ];
    };
    TeamProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_TEAM_LIST: {
                var data = body;
                if (TeamModel.oTherPlayerId == 0) {
                    TeamModel.parseTeamList(body);
                }
                else {
                    TeamModel.parseOtherPlayerItem(body);
                    NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(TeamModel.oTherPlayerId);
                    //查看其他玩家信息
                    TeamModel.oTherPlayerId = 0; //重置
                }
                break;
            }
            case ProtoDef.S2C_TEAM_UP: {
                var data = body;
                if (data.state == 0) {
                    EffectUtils.showTips(GCode(CLEnum.CAMP_SUC), 1);
                }
                break;
            }
            case ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS: {
                var data = body;
                if (data.state != 0) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL));
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_SUC), 1, true);
                }
                break;
            }
            case ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS: {
                var data = body;
                if (data.state != 0) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL));
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_SUC), 1, true);
                }
                break;
            }
            case ProtoDef.S2C_TEAM_COUNT: {
                TeamModel.setMaxTeamNum(body.maxCount);
                com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_MAX_NUM, null);
                break;
            }
            case ProtoDef.S2C_TEAM_SET_AUTOFILL: {
                var data = body;
                var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, data.order);
                teamVo.autoFill = data.flag;
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**队伍列表 */
    TeamProxy.C2S_TEAM_LIST = function (teamType, targetId) {
        if (targetId === void 0) { targetId = 0; }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_LIST);
        data.teamType = teamType;
        data.targetId = targetId;
        if (targetId != 0)
            TeamModel.oTherPlayerId = targetId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**队伍更新 */
    TeamProxy.C2S_TEAM_UP = function (teamType, order, generalId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_UP);
        data.teamType = teamType;
        data.order = order;
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**补充兵力 */
    TeamProxy.C2S_TEAM_SUPPLEMENTARY_TROOPS = function (order, soldierType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_SUPPLEMENTARY_TROOPS);
        data.order = order;
        data.soldierType = soldierType;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**金币补兵 */
    TeamProxy.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS = function (order) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS);
        data.order = order;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**自動补满*/
    TeamProxy.C2S_TEAM_SET_AUTOFILL = function (order, flag) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_SET_AUTOFILL);
        data.order = order;
        data.flag = flag;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**最大队伍 */
    TeamProxy.send_C2S_TEAM_COUNT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAM_COUNT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return TeamProxy;
}(BaseProxy));
