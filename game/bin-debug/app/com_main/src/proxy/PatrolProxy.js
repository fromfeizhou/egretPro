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
 * 挂机数据模块
 */
var PatrolProxy = /** @class */ (function (_super_1) {
    __extends(PatrolProxy, _super_1);
    function PatrolProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    PatrolProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_GET_PATROL, this, 'C2S_GET_PATROL', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_PATROL, this, 'S2C_GET_PATROL', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PATROL_CHALLENGE, this, 'C2S_PATROL_CHALLENGE', ProxyEnum.SEND],
            [ProtoDef.C2S_PATROL_CHALLENGE_BOSS, this, 'C2S_PATROL_CHALLENGE_BOSS', ProxyEnum.SEND],
            [ProtoDef.S2C_PATROL_CHALLENGE_BOSS, this, 'S2C_PATROL_CHALLENGE_BOSS', ProxyEnum.SEND],
            // [ProtoDef.C2S_GET_PATROL_REWARD, this, 'C2S_GET_PATROL_REWARD', ProxyEnum.SEND],      //宝箱奖励查询
            // [ProtoDef.S2C_GET_PATROL_REWARD, this, 'S2C_GET_PATROL_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_RECEIVE_PATROL_REWARD, this, 'C2S_RECEIVE_PATROL_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_RECEIVE_PATROL_REWARD, this, 'S2C_RECEIVE_PATROL_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PATROL_BUY_BOSS_COUNT, this, 'C2S_PATROL_BUY_BOSS_COUNT', ProxyEnum.SEND],
            [ProtoDef.S2C_PATROL_BUY_BOSS_COUNT, this, 'S2C_PATROL_BUY_BOSS_COUNT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PATROL_WINE, this, 'C2S_PATROL_WINE', ProxyEnum.SEND],
            [ProtoDef.S2C_PATROL_WINE, this, 'S2C_PATROL_WINE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PATROL_GET_RANDOM_PLAYERS, this, 'C2S_PATROL_GET_RANDOM_PLAYERS', ProxyEnum.SEND],
            [ProtoDef.S2C_PATROL_GET_RANDOM_PLAYERS, this, 'S2C_PATROL_GET_RANDOM_PLAYERS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_PATROL_REWARD_GENERAL, this, 'C2S_PATROL_REWARD_GENERAL', ProxyEnum.SEND],
            [ProtoDef.S2C_PATROL_REWARD_GENERAL, this, 'S2C_PATROL_REWARD_GENERAL', ProxyEnum.RECEIVE],
        ];
    };
    PatrolProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_GET_PATROL: { //获得巡查信息
                PatrolModel.parseData(body.info);
                break;
            }
            case ProtoDef.S2C_RECEIVE_PATROL_REWARD: { //领取宝箱奖励
                var data = body;
                PatrolModel.parseRewardTime();
                Utils.open_view(TASK_UI.POS_PATROL_GET_AWARD_VIEW, data.message);
                break;
            }
            case ProtoDef.S2C_PATROL_BUY_BOSS_COUNT: { //boss挑战次数购买
                PatrolModel.resetBossTime();
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_SUC), 1);
                break;
            }
            case ProtoDef.S2C_PATROL_WINE: { //快速升级
                var data = body;
                if (data.result) {
                    PropModel.itemAwardTips(data.message);
                }
                break;
            }
            case ProtoDef.S2C_PATROL_GET_RANDOM_PLAYERS: {
                var data = body;
                PatrolModel.setRandomGeneralList(data.players);
                break;
            }
            case ProtoDef.S2C_PATROL_REWARD_GENERAL: { //领取挂机武将奖励
                Loading.hide();
                var data = body;
                if (data.patrolId > 0) {
                    PatrolModel.parseRewardGen(data);
                    Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEWII, { generalId: data.generalId });
                }
                break;
            }
            case ProtoDef.S2C_PATROL_CHALLENGE_BOSS: {
                var data = body;
                PatrolModel.resetBossTime(data.bossTime);
                Loading.hide();
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**获得巡查信息*/
    PatrolProxy.send_C2S_GET_PATROL = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_PATROL);
        AGame.ServiceBuilder.sendMessage(data);
    };
    // /**宝箱奖励查询 */
    // public static C2S_GET_PATROL_REWARD() {
    //     let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_PATROL_REWARD) as gameProto.IC2S_GET_PATROL_REWARD;
    //     AGame.ServiceBuilder.sendMessage(data);
    // }
    /**宝箱奖励领取 */
    PatrolProxy.C2S_RECEIVE_PATROL_REWARD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECEIVE_PATROL_REWARD);
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**
     * 挑战boss
     *
    */
    PatrolProxy.send_C2S_PATROL_CHALLENGE = function () {
        if (PatrolModel.info.isPass) {
            EffectUtils.showTips('后续章节正在努力开发中，敬请期待!');
            return;
        }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_CHALLENGE);
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**挑战挂机boss */
    PatrolProxy.C2S_PATROL_CHALLENGE_BOSS = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_CHALLENGE_BOSS);
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    /**boss挑战次数购买 */
    PatrolProxy.C2S_PATROL_BUY_BOSS_COUNT = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_BUY_BOSS_COUNT);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 收益加速*/
    PatrolProxy.send_C2S_PATROL_WINE = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_WINE);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**领取挂机武将奖励 */
    PatrolProxy.C2S_PATROL_REWARD_GENERAL = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_REWARD_GENERAL);
        data.patrolId = id;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    PatrolProxy.send_C2S_PATROL_GET_RANDOM_PLAYERS = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_GET_RANDOM_PLAYERS);
        AGame.ServiceBuilder.sendMessage(data);
    };
    return PatrolProxy;
}(BaseProxy));
