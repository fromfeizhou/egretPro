class AcBattleProxy extends BaseProxy {
    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_BARBARIAN_BREAKOUT_EVENT, this, 'C2S_BARBARIAN_BREAKOUT_EVENT', ProxyEnum.SEND],//南蛮入侵（黄巾攻城）
            [ProtoDef.S2C_BARBARIAN_BREAKOUT_EVENT, this, 'S2C_BARBARIAN_BREAKOUT_EVENT', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_XIANGYANG_INFO, this, 'C2S_XIANGYANG_INFO', ProxyEnum.SEND],//襄阳战
            [ProtoDef.S2C_XIANGYANG_INFO, this, 'S2C_XIANGYANG_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_XIANGYANG_RECEIVE, this, 'C2S_XIANGYANG_RECEIVE', ProxyEnum.SEND],//襄阳战领奖
            [ProtoDef.S2C_XIANGYANG_RECEIVE, this, 'S2C_XIANGYANG_RECEIVE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_XIANGYANG_RECEIVE_NOTICE, this, 'S2C_XIANGYANG_RECEIVE_NOTICE', ProxyEnum.RECEIVE],//可领奖通知
            [ProtoDef.C2S_XIANGYANG_EMPROR_COUNTRY_REWARD, this, 'C2S_XIANGYANG_EMPROR_COUNTRY_REWARD', ProxyEnum.SEND],//皇帝国家的国家成员登录领取奖励
            [ProtoDef.S2C_XIANGYANG_EMPROR_COUNTRY_REWARD, this, 'S2C_XIANGYANG_EMPROR_COUNTRY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_EMPEROR_CHANE_NOTICE, this, 'S2C_EMPEROR_CHANE_NOTICE', ProxyEnum.RECEIVE],//皇帝登基公告
        ]
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_BARBARIAN_BREAKOUT_EVENT: {    //南蛮入侵事件
                let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
                let data = body as gameProto.IS2C_BARBARIAN_BREAKOUT_EVENT;
                if (vo) vo.parseData(data.bEvent);
                break;
            }
            case ProtoDef.S2C_XIANGYANG_INFO: {    //襄阳战
                let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
                let data = body as gameProto.IS2C_XIANGYANG_INFO;
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
            case ProtoDef.S2C_XIANGYANG_RECEIVE: {    //襄阳战领奖
                let data = body as gameProto.IS2C_XIANGYANG_RECEIVE;
                let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
                if (vo && data.state == 0) {
                    vo.updateKillAward(data.receiveId, true);
                    com_main.EventMgr.dispatchEvent(ActivityEvent.PLAYER_BATTLE_REWARD_UPDATE, null);
                } else {
                    EffectUtils.showTips(GCode(CLEnum.WOR_BAT_GET_FAL));
                }
                break;
            }
            case ProtoDef.S2C_XIANGYANG_RECEIVE_NOTICE: {    //可领奖通知
                let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
                let data = body as gameProto.IS2C_XIANGYANG_RECEIVE_NOTICE;
                if (vo) {
                    vo.svReceiveId = data.receiveId;
                    com_main.EventMgr.dispatchEvent(ActivityEvent.PLAYER_BATTLE_REWARD_UPDATE, null);
                }
                break;
            }
            case ProtoDef.S2C_EMPEROR_CHANE_NOTICE: {    //皇帝登基公告
                let data = body as gameProto.IS2C_EMPEROR_CHANE_NOTICE;
                let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
                if (vo) vo.emperorCoronation(data);
                break;
            }

            default:
                break;
        }

        AGame.ServiceBuilder.notifyView(notification);
    }

    /**南蛮入侵 */
    public static C2S_BARBARIAN_BREAKOUT_EVENT() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BARBARIAN_BREAKOUT_EVENT);
        AGame.ServiceBuilder.sendMessage(data);
    }


    /**襄阳战 */
    public static C2S_XIANGYANG_INFO() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }

    private static isOpenXYInfoView: boolean = false;
    private static isOpenXYRankView: boolean = false;
    public static C2S_XIANGYANG_INFO_OPEN_VIEW(type: number = 1) {
        // this.isOpenXYInfoView = true;
        type == 1 ? this.isOpenXYInfoView = true : this.isOpenXYRankView = true;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**襄阳战领奖 */
    public static C2S_XIANGYANG_RECEIVE(receiveId: number) {
        let data: gameProto.C2S_XIANGYANG_RECEIVE = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_RECEIVE);
        data.receiveId = receiveId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**皇帝国家的国家成员登录领取奖励 */
    public static C2S_XIANGYANG_EMPROR_COUNTRY_REWARD() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_XIANGYANG_EMPROR_COUNTRY_REWARD);
        AGame.ServiceBuilder.sendMessage(data);
    }

}