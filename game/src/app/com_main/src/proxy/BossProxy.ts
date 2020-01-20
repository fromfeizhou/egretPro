/**
 * boss挑战
 */
class BossProxy extends BaseProxy {
    private static isOpenView: boolean = false;
    protected listenerProtoNotificationsNew(): any[] {
        return [
            [ProtoDef.C2S_GET_BOSS, this, 'C2S_GET_BOSS', ProxyEnum.SEND], //发送获得怪物信息
            [ProtoDef.S2C_GET_BOSS, this, 'S2C_GET_BOSS', ProxyEnum.RECEIVE], //获得怪物信息返回
            [ProtoDef.C2S_CHALLENGE_BOSS, this, 'C2S_CHALLENGE_BOSS', ProxyEnum.SEND], //挑战boss请求
            // [ProtoDef.S2C_CHALLENGE_BOSS, this, 'S2C_CHALLENGE_BOSS', ProxyEnum.RECEIVE], //boss挑战结束返回
            [ProtoDef.C2S_CLEAR_BOSS, this, 'C2S_CLEAR_BOSS', ProxyEnum.SEND], //请求扫荡
            [ProtoDef.S2C_CLEAR_BOSS, this, 'S2C_CLEAR_BOSS', ProxyEnum.RECEIVE], //返回扫荡信息
            [ProtoDef.C2S_BUY_BOSS_CHALLENGE_COUNT, this, 'C2S_BUY_BOSS_CHALLENGE_COUNT', ProxyEnum.SEND], //请求购买boss挑战次数
            [ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT, this, 'S2C_BUY_BOSS_CHALLENGE_COUNT', ProxyEnum.RECEIVE], //返回购买boss挑战次数
            [ProtoDef.C2S_RECEIVE_BOSS_BOX, this, 'C2S_RECEIVE_BOSS_BOX', ProxyEnum.SEND], //请求领取宝箱
            [ProtoDef.S2C_RECEIVE_BOSS_BOX, this, 'S2C_RECEIVE_BOSS_BOX', ProxyEnum.RECEIVE], //领取宝箱返回
            [ProtoDef.S2C_BOSS_IS_DIED, this, 'S2C_BOSS_IS_DIED', ProxyEnum.RECEIVE], //推送boss死亡
        ];
    }
    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_GET_BOSS: {//获得怪物信息
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
            case ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT: {//返回购买boss挑战次数
                BossModel.setReviveTime(body);
                // BossModel.setBuyCountData(body);
                EffectUtils.showTips(GCode(CLEnum.BOSS_NUM_TIPS), 1, true);
                break;
            }
            case ProtoDef.S2C_RECEIVE_BOSS_BOX: {//领取宝箱返回
                BossModel.getBossHurtCfg(body);   //设置领取过的宝箱id
                let VO = body as gameProto.IS2C_RECEIVE_BOSS_BOX;
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
                break;
            }
            case ProtoDef.S2C_BOSS_IS_DIED: {//推送boss死亡
              BossModel.setDieBossData(body.bossId);
                break;
            }
            default:

                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    }

    /**发送获得怪物信息*/
    public static C2S_GET_BOSS_OPEN_VIEW() {
        this.isOpenView = true;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_BOSS);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**发送获得怪物信息*/
    public static C2S_GET_BOSS() {
        this.isOpenView = false;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_BOSS);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /** 挑战boss请求*/
    public static C2S_CHALLENGE_BOSS(bossId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHALLENGE_BOSS);
        data.bossId = bossId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**请求扫荡*/
    public static C2S_CLEAR_BOSS(bossId: number, type: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CLEAR_BOSS);
        data.bossId = bossId;
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**请求购买boss挑战次数*/
    public static C2S_BUY_BOSS_CHALLENGE_COUNT(type: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUY_BOSS_CHALLENGE_COUNT);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**请求领取宝箱*/
    public static C2S_RECEIVE_BOSS_BOX(boxid: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECEIVE_BOSS_BOX);
        data.boxId = boxid;
        AGame.ServiceBuilder.sendMessage(data);
    }

}