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
 * boss挑战
 */
var BossProxy = /** @class */ (function (_super_1) {
    __extends(BossProxy, _super_1);
    function BossProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    BossProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_GET_BOSS, this, 'C2S_GET_BOSS', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_BOSS, this, 'S2C_GET_BOSS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CHALLENGE_BOSS, this, 'C2S_CHALLENGE_BOSS', ProxyEnum.SEND],
            // [ProtoDef.S2C_CHALLENGE_BOSS, this, 'S2C_CHALLENGE_BOSS', ProxyEnum.RECEIVE], //boss挑战结束返回
            [ProtoDef.C2S_CLEAR_BOSS, this, 'C2S_CLEAR_BOSS', ProxyEnum.SEND],
            [ProtoDef.S2C_CLEAR_BOSS, this, 'S2C_CLEAR_BOSS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_BUY_BOSS_CHALLENGE_COUNT, this, 'C2S_BUY_BOSS_CHALLENGE_COUNT', ProxyEnum.SEND],
            [ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT, this, 'S2C_BUY_BOSS_CHALLENGE_COUNT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_RECEIVE_BOSS_BOX, this, 'C2S_RECEIVE_BOSS_BOX', ProxyEnum.SEND],
            [ProtoDef.S2C_RECEIVE_BOSS_BOX, this, 'S2C_RECEIVE_BOSS_BOX', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_BOSS_IS_DIED, this, 'S2C_BOSS_IS_DIED', ProxyEnum.RECEIVE],
        ];
    };
    BossProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_GET_BOSS: { //获得怪物信息
                BossModel.parseBossData(body);
                if (BossProxy.isOpenView) {
                    BossProxy.isOpenView = false;
                    Utils.open_view(TASK_UI.BOSS_INFO_PANEL, { type: BossModel.challType });
                }
                break;
            }
            // case ProtoDef.S2C_CLEAR_BOSS: {//返回扫荡信息
            //     BossModel.setSweepData(body);
            //     let VO = body as gameProto.IS2C_CLEAR_BOSS;
            //     Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
            //     break;
            // }
            case ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT: { //返回购买boss挑战次数
                BossModel.setReviveTime(body);
                // BossModel.setBuyCountData(body);
                EffectUtils.showTips(GCode(CLEnum.BOSS_NUM_TIPS), 1, true);
                break;
            }
            case ProtoDef.S2C_RECEIVE_BOSS_BOX: { //领取宝箱返回
                BossModel.getBossHurtCfg(body); //设置领取过的宝箱id
                var VO = body;
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
                break;
            }
            case ProtoDef.S2C_BOSS_IS_DIED: { //推送boss死亡
                BossModel.setDieBossData(body.bossId);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**发送获得怪物信息*/
    BossProxy.C2S_GET_BOSS_OPEN_VIEW = function () {
        this.isOpenView = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_BOSS);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**发送获得怪物信息*/
    BossProxy.C2S_GET_BOSS = function () {
        this.isOpenView = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_BOSS);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 挑战boss请求*/
    BossProxy.C2S_CHALLENGE_BOSS = function (bossId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHALLENGE_BOSS);
        data.bossId = bossId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求扫荡*/
    BossProxy.C2S_CLEAR_BOSS = function (bossId, type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CLEAR_BOSS);
        data.bossId = bossId;
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求购买boss挑战次数*/
    BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT = function (type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUY_BOSS_CHALLENGE_COUNT);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求领取宝箱*/
    BossProxy.C2S_RECEIVE_BOSS_BOX = function (boxid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECEIVE_BOSS_BOX);
        data.boxId = boxid;
        AGame.ServiceBuilder.sendMessage(data);
    };
    BossProxy.isOpenView = false;
    return BossProxy;
}(BaseProxy));
