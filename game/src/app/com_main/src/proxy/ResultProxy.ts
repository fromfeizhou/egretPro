class ResultProxy extends BaseProxy {

    public constructor() {
        super();
    }

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            // [ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER, this, 'S2C_WORLDMAP_EVENT_WAR_OVER', ProxyEnum.RECEIVE], //放回世界模块监听事件战斗完成
            [ProtoDef.ARENA_BATTLE_REWARD, this, 'ArenaBattleRewardResp', ProxyEnum.RECEIVE], //擂台战斗奖励返回
            [ProtoDef.S2C_CHALLENGE_BOSS, this, 'S2C_CHALLENGE_BOSS', ProxyEnum.RECEIVE],//挑战怪物获胜信息
            [ProtoDef.S2C_MATERIAL_CHALLENGE, this, 'S2C_MATERIAL_CHALLENGE', ProxyEnum.RECEIVE],//挑战材料副本获胜信息
            [ProtoDef.HQ_CHANLLNGES_REWARD, this, 'HQChanllngesRewardResp', ProxyEnum.RECEIVE], //行营挑战胜利结算信息
            // [ProtoDef.PATROL_CHALLENGE_REWARD, this, 'PatrolChallengeRewardResp', ProxyEnum.RECEIVE],//巡查挑战完获得奖励
            [ProtoDef.APK_CHALLENGE_RESULT, this, 'ChallengeResultResp', ProxyEnum.RECEIVE],//挑战结束
            [ProtoDef.S2C_PATROL_CHALLENGE_REWARD, this, 'S2C_PATROL_CHALLENGE_REWARD', ProxyEnum.RECEIVE],   //领取巡查奖励返回 
            [ProtoDef.S2C_PATROL_CHALLENGE_BOSS_REWARD, this, 'S2C_PATROL_CHALLENGE_BOSS_REWARD', ProxyEnum.RECEIVE],////巡查boss奖励返回 
        ]
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_MATERIAL_CHALLENGE: {
                let body = notification.getBody();
                // com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
                MaterialModel.reSDCountData(body)
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
    }
}