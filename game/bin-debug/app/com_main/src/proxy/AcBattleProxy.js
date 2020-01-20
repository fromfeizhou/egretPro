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
var AcBattleProxy = /** @class */ (function (_super_1) {
    __extends(AcBattleProxy, _super_1);
    function AcBattleProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    AcBattleProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_BARBARIAN_BREAKOUT_EVENT, this, 'C2S_BARBARIAN_BREAKOUT_EVENT', ProxyEnum.SEND],
            [ProtoDef.S2C_BARBARIAN_BREAKOUT_EVENT, this, 'S2C_BARBARIAN_BREAKOUT_EVENT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_XIANGYANG_INFO, this, 'C2S_XIANGYANG_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_XIANGYANG_INFO, this, 'S2C_XIANGYANG_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_XIANGYANG_RECEIVE, this, 'C2S_XIANGYANG_RECEIVE', ProxyEnum.SEND],
            [ProtoDef.S2C_XIANGYANG_RECEIVE, this, 'S2C_XIANGYANG_RECEIVE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_XIANGYANG_RECEIVE_NOTICE, this, 'S2C_XIANGYANG_RECEIVE_NOTICE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_XIANGYANG_EMPROR_COUNTRY_REWARD, this, 'C2S_XIANGYANG_EMPROR_COUNTRY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_XIANGYANG_EMPROR_COUNTRY_REWARD, this, 'S2C_XIANGYANG_EMPROR_COUNTRY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_EMPEROR_CHANE_NOTICE, this, 'S2C_EMPEROR_CHANE_NOTICE', ProxyEnum.RECEIVE],
        ];
    };
    AcBattleProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_BARBARIAN_BREAKOUT_EVENT: { //南蛮入侵事件
                var vo = ActivityModel.getActivityVo(AcViewType.BARBARIANATTACK);
                var data = body;
                if (vo)
                    vo.parseData(data.bEvent);
                break;
            }
            case ProtoDef.S2C_XIANGYANG_INFO: { //襄阳战
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                var data = body;
                if (vo) {
                    vo.parseData(data);
                    if (AcBattleProxy.isOpenXYInfoView) {
                        AcBattleProxy.isOpenXYInfoView = false;
                        Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE);
                        break;
                    }
                    if (AcBattleProxy.isOpenXYRankView) {
                        AcBattleProxy.isOpenXYRankView = false;
                        Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_RANK);
                        break;
                    }
                }
                break;
            }
            case ProtoDef.S2C_XIANGYANG_RECEIVE: { //襄阳战领奖
                var data = body;
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                if (vo && data.state == 0) {
                    vo.updateKillAward(data.receiveId, true);
                    com_main.EventMgr.dispatchEvent(ActivityEvent.PLAYER_BATTLE_REWARD_UPDATE, null);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.WOR_BAT_GET_FAL));
                }
                break;
            }
            case ProtoDef.S2C_XIANGYANG_RECEIVE_NOTICE: { //可领奖通知
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                var data = body;
                if (vo) {
                    vo.svReceiveId = data.receiveId;
                    com_main.EventMgr.dispatchEvent(ActivityEvent.PLAYER_BATTLE_REWARD_UPDATE, null);
                }
                break;
            }
            case ProtoDef.S2C_EMPEROR_CHANE_NOTICE: { //皇帝登基公告
                var data = body;
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                if (vo)
                    vo.emperorCoronation(data);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**南蛮入侵 */
    AcBattleProxy.C2S_BARBARIAN_BREAKOUT_EVENT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BARBARIAN_BREAKOUT_EVENT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**襄阳战 */
    AcBattleProxy.C2S_XIANGYANG_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW = function (type) {
        if (type === void 0) { type = 1; }
        // this.isOpenXYInfoView = true;
        type == 1 ? this.isOpenXYInfoView = true : this.isOpenXYRankView = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**襄阳战领奖 */
    AcBattleProxy.C2S_XIANGYANG_RECEIVE = function (receiveId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_RECEIVE);
        data.receiveId = receiveId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**皇帝国家的国家成员登录领取奖励 */
    AcBattleProxy.C2S_XIANGYANG_EMPROR_COUNTRY_REWARD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_EMPROR_COUNTRY_REWARD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    AcBattleProxy.isOpenXYInfoView = false;
    AcBattleProxy.isOpenXYRankView = false;
    return AcBattleProxy;
}(BaseProxy));
