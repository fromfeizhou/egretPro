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
var NormalProxy = /** @class */ (function (_super_1) {
    __extends(NormalProxy, _super_1);
    function NormalProxy() {
        return _super_1.call(this) || this;
    }
    NormalProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_SYS_GENERAL_WIN_INFO, this, 'C2S_SYS_GENERAL_WIN_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_SYS_GENERAL_WIN_INFO, this, 'S2C_SYS_GENERAL_WIN_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_SYS_FUNCOUNT, this, 'S2C_SYS_FUNCOUNT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_SYS_FUNCOUNT, this, 'C2S_SYS_FUNCOUNT', ProxyEnum.SEND],
            [ProtoDef.C2S_PLAYER_INTEGRATED_INFORMATION, this, 'C2S_PLAYER_INTEGRATED_INFORMATION', ProxyEnum.SEND],
            [ProtoDef.S2C_PLAYER_INTEGRATED_INFORMATION, this, 'S2C_PLAYER_INTEGRATED_INFORMATION', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_RANK_GUILD, this, 'C2S_RANK_GUILD', ProxyEnum.SEND],
            [ProtoDef.S2C_RANK_GUILD, this, 'S2C_RANK_GUILD', ProxyEnum.RECEIVE],
        ];
    };
    NormalProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_SYS_GENERAL_WIN_INFO: {
                NormalModel.addGeneralWinInfo(body);
                break;
            }
            case ProtoDef.S2C_SYS_FUNCOUNT: { //模块次数
                NormalModel.parseFunCount(body.funCount);
                break;
            }
            case ProtoDef.S2C_PLAYER_INTEGRATED_INFORMATION: { //玩家综合信息
                Utils.open_view(TASK_UI.PLAYER_INFO_PANEL, body);
                break;
            }
            case ProtoDef.S2C_RANK_GUILD: { //查看排行榜联盟信息
                Utils.open_view(TASK_UI.LEGION_INFO_CHECK_VIEW, body);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**获得怪物武将列表 */
    NormalProxy.C2S_SYS_GENERAL_WIN_INFO = function (npcId) {
        //读取本地缓存数据 模拟发送
        var genData = NormalModel.getGeneralWinInfo(npcId);
        if (genData) {
            var body = { npcId: npcId, generalWinInfo: genData };
            AGame.ServiceBuilder.notifyView(new AGame.Notification(ProtoDef.S2C_SYS_GENERAL_WIN_INFO, body));
            return;
        }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SYS_GENERAL_WIN_INFO);
        data.npcId = npcId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**玩家综合信息 */
    NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAYER_INTEGRATED_INFORMATION);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    NormalProxy.send_C2S_SYS_FUNCOUNT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_SYS_FUNCOUNT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**查看排行榜联盟信息请求 */
    NormalProxy.C2S_RANK_GUILD = function (giildId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RANK_GUILD);
        data.giildId = giildId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return NormalProxy;
}(BaseProxy));
