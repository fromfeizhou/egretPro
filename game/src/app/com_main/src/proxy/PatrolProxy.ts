/**
 * 挂机数据模块
 */
class PatrolProxy extends BaseProxy {
    protected listenerProtoNotificationsNew(): any[] {
        return [
            [ProtoDef.C2S_GET_PATROL, this, 'C2S_GET_PATROL', ProxyEnum.SEND], //获得巡查信息
            [ProtoDef.S2C_GET_PATROL, this, 'S2C_GET_PATROL', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_PATROL_CHALLENGE, this, 'C2S_PATROL_CHALLENGE', ProxyEnum.SEND],      //巡查挑战
            [ProtoDef.C2S_PATROL_CHALLENGE_BOSS, this, 'C2S_PATROL_CHALLENGE_BOSS', ProxyEnum.SEND],    //巡查大boss挑战
            [ProtoDef.S2C_PATROL_CHALLENGE_BOSS, this, 'S2C_PATROL_CHALLENGE_BOSS', ProxyEnum.SEND],    //巡查大boss挑战

            // [ProtoDef.C2S_GET_PATROL_REWARD, this, 'C2S_GET_PATROL_REWARD', ProxyEnum.SEND],      //宝箱奖励查询
            // [ProtoDef.S2C_GET_PATROL_REWARD, this, 'S2C_GET_PATROL_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_RECEIVE_PATROL_REWARD, this, 'C2S_RECEIVE_PATROL_REWARD', ProxyEnum.SEND],      //领取宝箱奖励
            [ProtoDef.S2C_RECEIVE_PATROL_REWARD, this, 'S2C_RECEIVE_PATROL_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_PATROL_BUY_BOSS_COUNT, this, 'C2S_PATROL_BUY_BOSS_COUNT', ProxyEnum.SEND],      //boss挑战次数购买
            [ProtoDef.S2C_PATROL_BUY_BOSS_COUNT, this, 'S2C_PATROL_BUY_BOSS_COUNT', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_PATROL_WINE, this, 'C2S_PATROL_WINE', ProxyEnum.SEND],      //巡查喝酒
            [ProtoDef.S2C_PATROL_WINE, this, 'S2C_PATROL_WINE', ProxyEnum.RECEIVE],   //巡查喝酒返回 

            [ProtoDef.C2S_PATROL_GET_RANDOM_PLAYERS, this, 'C2S_PATROL_GET_RANDOM_PLAYERS', ProxyEnum.SEND],   //获取随机武将 
            [ProtoDef.S2C_PATROL_GET_RANDOM_PLAYERS, this, 'S2C_PATROL_GET_RANDOM_PLAYERS', ProxyEnum.RECEIVE],   //获取随机武将 

            [ProtoDef.C2S_PATROL_REWARD_GENERAL, this, 'C2S_PATROL_REWARD_GENERAL', ProxyEnum.SEND],      //巡查喝酒
            [ProtoDef.S2C_PATROL_REWARD_GENERAL, this, 'S2C_PATROL_REWARD_GENERAL', ProxyEnum.RECEIVE],   //巡查喝酒返回 
        ];
    }
    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_GET_PATROL: { //获得巡查信息
                PatrolModel.parseData(body.info);
                break;
            }

            case ProtoDef.S2C_RECEIVE_PATROL_REWARD: {   //领取宝箱奖励
                let data = body as gameProto.IS2C_RECEIVE_PATROL_REWARD;
                PatrolModel.parseRewardTime();
                Utils.open_view(TASK_UI.POS_PATROL_GET_AWARD_VIEW, data.message);
                break;
            }

            case ProtoDef.S2C_PATROL_BUY_BOSS_COUNT: {   //boss挑战次数购买
                PatrolModel.resetBossTime();
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_SUC), 1);
                break;
            }
            case ProtoDef.S2C_PATROL_WINE: {   //快速升级
                let data = body as gameProto.S2C_PATROL_WINE;
                if (data.result) {
                    PropModel.itemAwardTips(data.message)
                }
                break;
            }
            case ProtoDef.S2C_PATROL_GET_RANDOM_PLAYERS: {
                let data = body as gameProto.S2C_PATROL_GET_RANDOM_PLAYERS;
                PatrolModel.setRandomGeneralList(data.players);
                break;
            }

            case ProtoDef.S2C_PATROL_REWARD_GENERAL: {   //领取挂机武将奖励
                Loading.hide();
                let data = body as gameProto.S2C_PATROL_REWARD_GENERAL;
                if (data.patrolId > 0) {
                    PatrolModel.parseRewardGen(data);
                    Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEWII, { generalId: data.generalId });
                }
                break;
            }

            case ProtoDef.S2C_PATROL_CHALLENGE_BOSS: {
                let data = body as gameProto.IS2C_PATROL_CHALLENGE_BOSS; 
                PatrolModel.resetBossTime(data.bossTime);
                Loading.hide();
                break;
            }

            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    }

    /**获得巡查信息*/
    public static send_C2S_GET_PATROL() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_PATROL);
        AGame.ServiceBuilder.sendMessage(data);
    }

    // /**宝箱奖励查询 */
    // public static C2S_GET_PATROL_REWARD() {
    //     let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_PATROL_REWARD) as gameProto.IC2S_GET_PATROL_REWARD;
    //     AGame.ServiceBuilder.sendMessage(data);
    // }

    /**宝箱奖励领取 */
    public static C2S_RECEIVE_PATROL_REWARD() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECEIVE_PATROL_REWARD) as gameProto.IC2S_RECEIVE_PATROL_REWARD;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }


    /** 
     * 挑战boss
     * 
    */
    public static send_C2S_PATROL_CHALLENGE() {
        if(PatrolModel.info.isPass){
            EffectUtils.showTips('后续章节正在努力开发中，敬请期待!');
            return;
        }
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_CHALLENGE);
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }

    /**挑战挂机boss */
    public static C2S_PATROL_CHALLENGE_BOSS() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_CHALLENGE_BOSS);
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }

    /**boss挑战次数购买 */
    public static C2S_PATROL_BUY_BOSS_COUNT() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_BUY_BOSS_COUNT);
        AGame.ServiceBuilder.sendMessage(data);
    }


    /** 收益加速*/
    public static send_C2S_PATROL_WINE() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_WINE);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**领取挂机武将奖励 */
    public static C2S_PATROL_REWARD_GENERAL(id: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_REWARD_GENERAL) as gameProto.IC2S_PATROL_REWARD_GENERAL;
        data.patrolId = id;
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    }

    public static send_C2S_PATROL_GET_RANDOM_PLAYERS() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PATROL_GET_RANDOM_PLAYERS);
        AGame.ServiceBuilder.sendMessage(data);
    }

}