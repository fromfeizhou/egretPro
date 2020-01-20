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
var ResultProxy = /** @class */ (function (_super_1) {
    __extends(ResultProxy, _super_1);
    function ResultProxy() {
        return _super_1.call(this) || this;
    }
    ResultProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            // [ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER, this, 'S2C_WORLDMAP_EVENT_WAR_OVER', ProxyEnum.RECEIVE], //放回世界模块监听事件战斗完成
            [ProtoDef.ARENA_BATTLE_REWARD, this, 'ArenaBattleRewardResp', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CHALLENGE_BOSS, this, 'S2C_CHALLENGE_BOSS', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_MATERIAL_CHALLENGE, this, 'S2C_MATERIAL_CHALLENGE', ProxyEnum.RECEIVE],
            [ProtoDef.HQ_CHANLLNGES_REWARD, this, 'HQChanllngesRewardResp', ProxyEnum.RECEIVE],
            // [ProtoDef.PATROL_CHALLENGE_REWARD, this, 'PatrolChallengeRewardResp', ProxyEnum.RECEIVE],//巡查挑战完获得奖励
            [ProtoDef.APK_CHALLENGE_RESULT, this, 'ChallengeResultResp', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_PATROL_CHALLENGE_REWARD, this, 'S2C_PATROL_CHALLENGE_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_PATROL_CHALLENGE_BOSS_REWARD, this, 'S2C_PATROL_CHALLENGE_BOSS_REWARD', ProxyEnum.RECEIVE],
        ];
    };
    ResultProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_MATERIAL_CHALLENGE: {
                var body = notification.getBody();
                // com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
                MaterialModel.reSDCountData(body);
                if (body.sweep) {
                    Loading.hide();
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, body.valuesMessage);
                    return;
                }
            }
        }
        /**缓存结算 */
        Loading.hide();
        FightResponseUtil.addResultCache(notification);
    };
    return ResultProxy;
}(BaseProxy));
