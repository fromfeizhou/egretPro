

class ActivityProxy extends BaseProxy {

    protected listenerProtoNotifications(): any[] {
        return [
            // [ProtoDef.PUSH_ACTIVITY_INFO, this, '', 'ActivityMessage'],//推送活动消息
            [ProtoDef.SELL_ACTIVITY_INFO, this, 'SellActivityInfoReq', 'SellActivityInfoResp'],//获取盛典记录信息
            [ProtoDef.SELL_ACTIVITY_FREE, this, 'SellActivityFreeReq', 'SellActivityFreeResp'],//免费获取盛典档次
            [ProtoDef.SELL_ACTIVITY_BUY, this, 'SellActivityBuyReq', 'SellActivityBuyResp'],//购买盛典档次
        ];
    }

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            // [ProtoDef.S2C_ACTIVITY_INFO, this, 'S2C_ACTIVITY_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_LIST, this, 'C2S_ACTIVITY_LIST', ProxyEnum.SEND],//开放活动推送
            [ProtoDef.S2C_ACTIVITY_LIST, this, 'S2C_ACTIVITY_LIST', ProxyEnum.RECEIVE],//开放活动推送

            [ProtoDef.C2S_ACTIVITY_COMM_CONFIG, this, 'C2S_ACTIVITY_COMM_CONFIG', ProxyEnum.SEND],// 活动配置
            [ProtoDef.S2C_ACTIVITY_COMM_CONFIG, this, 'S2C_ACTIVITY_COMM_CONFIG', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_GET_COLLECT_REWARD, this, 'C2S_GET_COLLECT_REWARD', ProxyEnum.SEND],// 等级奖励
            [ProtoDef.S2C_GET_COLLECT_REWARD, this, 'S2C_GET_COLLECT_REWARD', ProxyEnum.RECEIVE],


            [ProtoDef.S2C_ACTIVITY_COUNT_CONFIG, this, 'S2C_ACTIVITY_COUNT_CONFIG', ProxyEnum.RECEIVE],//活动奖励配置

            [ProtoDef.S2C_ACTIVITY_UPDATE, this, 'S2C_ACTIVITY_UPDATE', ProxyEnum.RECEIVE],//活动奖励配置

            [ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_INFO, this, 'C2S_ACTIVITY_GET_FIRTS_PAY_INFO', ProxyEnum.SEND],// 获取首充活动状态
            [ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_INFO, this, 'S2C_ACTIVITY_GET_FIRTS_PAY_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_REWARD, this, 'C2S_ACTIVITY_GET_FIRTS_PAY_REWARD', ProxyEnum.SEND],// 首充领奖
            [ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD, this, 'S2C_ACTIVITY_GET_FIRTS_PAY_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_INFO, this, 'C2S_ACTIVITY_GET_TOTAL_PAY_INFO', ProxyEnum.SEND],// 累计充值活动状态
            [ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_INFO, this, 'S2C_ACTIVITY_GET_TOTAL_PAY_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD, this, 'C2S_ACTIVITY_GET_TOTAL_PAY_REWARD', ProxyEnum.SEND],// 累计充值活动领取
            [ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD, this, 'S2C_ACTIVITY_GET_TOTAL_PAY_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_INFO, this, 'C2S_ACTIVITY_GET_SINGLE_PAY_INFO', ProxyEnum.SEND],// 单笔充值活动状态
            [ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_INFO, this, 'S2C_ACTIVITY_GET_SINGLE_PAY_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD, this, 'C2S_ACTIVITY_GET_SINGLE_PAY_REWARD', ProxyEnum.SEND],// 单笔充值活动领取
            [ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD, this, 'S2C_ACTIVITY_GET_SINGLE_PAY_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_INFO, this, 'C2S_ACTIVITY_GET_CONSUME_GIFT_INFO', ProxyEnum.SEND],// 消费好礼活动状态
            [ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_INFO, this, 'S2C_ACTIVITY_GET_CONSUME_GIFT_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD, this, 'C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD', ProxyEnum.SEND],// 消费活动领取
            [ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD, this, 'S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_INFO, this, 'C2S_ACTIVITY_GET_LOGIN_DAYS_INFO', ProxyEnum.SEND],// 每日登录活动状态
            [ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_INFO, this, 'S2C_ACTIVITY_GET_LOGIN_DAYS_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD, this, 'C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD', ProxyEnum.SEND],// 每日登录活动领取
            [ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD, this, 'S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ONLINE_INFO, this, 'C2S_ONLINE_INFO', ProxyEnum.SEND],// 获取在线奖励状态
            [ProtoDef.S2C_ONLINE_INFO, this, 'S2C_ONLINE_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ONLINE_REWARD, this, 'C2S_ONLINE_REWARD', ProxyEnum.SEND],// 领取在线奖励
            [ProtoDef.S2C_ONLINE_REWARD, this, 'S2C_ONLINE_REWARD', ProxyEnum.RECEIVE],


            [ProtoDef.C2S_ACTIVITY_BUY_GROWTH_FUND, this, 'C2S_ACTIVITY_BUY_GROWTH_FUND', ProxyEnum.SEND],// 购买成长基金
            [ProtoDef.S2C_ACTIVITY_BUY_GROWTH_FUND, this, 'S2C_ACTIVITY_BUY_GROWTH_FUND', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_INFO, this, 'C2S_ACTIVITY_GET_GROWTH_FUND_INFO', ProxyEnum.SEND],// 成长基金活动状态
            [ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_INFO, this, 'S2C_ACTIVITY_GET_GROWTH_FUND_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_REWARD, this, 'C2S_ACTIVITY_GET_GROWTH_FUND_REWARD', ProxyEnum.SEND],// 成长基金领取
            [ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD, this, 'S2C_ACTIVITY_GET_GROWTH_FUND_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_BUY_WEEK_MONTH_CARD, this, 'C2S_ACTIVITY_BUY_WEEK_MONTH_CARD', ProxyEnum.SEND],// 购买周卡月卡
            [ProtoDef.S2C_ACTIVITY_BUY_WEEK_MONTH_CARD, this, 'S2C_ACTIVITY_BUY_WEEK_MONTH_CARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO, this, 'C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO', ProxyEnum.SEND],// 周卡月卡信息
            [ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO, this, 'S2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD, this, 'C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD', ProxyEnum.SEND],// 周卡月卡领取
            [ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD, this, 'S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO, this, 'C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO', ProxyEnum.SEND],//一元购信息
            [ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_INFO, this, 'S2C_ACTIVITY_GET_ONE_RMB_BUY_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD, this, 'C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD', ProxyEnum.SEND],//一元购领奖
            [ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_REWARD, this, 'S2C_ACTIVITY_GET_ONE_RMB_BUY_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_ZHI_GOU_INFO, this, 'C2S_ACTIVITY_ZHI_GOU_INFO', ProxyEnum.SEND],// 直购礼包活动
            [ProtoDef.S2C_ACTIVITY_ZHI_GOU_INFO, this, 'S2C_ACTIVITY_ZHI_GOU_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_INFO, this, 'C2S_ACTIVITY_NEW_GENERAL_INFO', ProxyEnum.SEND],    //新武将活动信息
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_INFO, this, 'S2C_ACTIVITY_NEW_GENERAL_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this, 'C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD', ProxyEnum.SEND],    //新武将选择奖励
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this, 'S2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD, this, 'C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD', ProxyEnum.SEND],    //新武将拜访
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD, this, 'S2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD, this, 'C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD', ProxyEnum.SEND],    //新武将领取宝箱奖励
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_BOX_REWARD, this, 'S2C_ACTIVITY_NEW_GENERAL_BOX_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_BUY_GENERAL_BAG, this, 'C2S_ACTIVITY_BUY_GENERAL_BAG', ProxyEnum.SEND],    //购买新武将礼包
            [ProtoDef.S2C_ACTIVITY_BUY_GENERAL_BAG, this, 'S2C_ACTIVITY_BUY_GENERAL_BAG', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_AWARD_GENERAL_BAG, this, 'C2S_ACTIVITY_AWARD_GENERAL_BAG', ProxyEnum.SEND],    //领取新武将礼包 
            [ProtoDef.S2C_ACTIVITY_AWARD_GENERAL_BAG, this, 'S2C_ACTIVITY_AWARD_GENERAL_BAG', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_INFO, this, 'C2S_ACTIVITY_TREASEURE_BOWL_INFO', ProxyEnum.SEND],    //聚宝盆活动信息
            [ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_INFO, this, 'S2C_ACTIVITY_TREASEURE_BOWL_INFO', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_REWARD, this, 'C2S_ACTIVITY_TREASEURE_BOWL_REWARD', ProxyEnum.SEND],    //聚宝盆活动摇奖
            [ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_REWARD, this, 'S2C_ACTIVITY_TREASEURE_BOWL_REWARD', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_ACTIVITY_NOTICE_CONFIGS, this, 'C2S_ACTIVITY_NOTICE_CONFIGS', ProxyEnum.SEND],// 
            [ProtoDef.S2C_ACTIVITY_NOTICE_CONFIGS, this, 'S2C_ACTIVITY_NOTICE_CONFIGS', ProxyEnum.RECEIVE],
        ]
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_ACTIVITY_LIST: {//开放活动推送
                let data = body as gameProto.S2C_ACTIVITY_LIST;
                if(data.isReset){
                    ActivityModel.resetActivitInfos(data);
                }else{
                     ActivityModel.parseActivitInfos(data);
                    //登录消息结束标记
                    LoginProxy.sendEndLogin();
                }
               
                break;
            }
            case ProtoDef.S2C_ACTIVITY_COMM_CONFIG: {    //获得配置表
                let data = body as gameProto.IS2C_ACTIVITY_COMM_CONFIG;
                ActivityModel.parseConfig(data);
                break;
            }


            case ProtoDef.SELL_ACTIVITY_INFO: {//获取盛典记录信息
                if (!body.activityId) return;

                break;
            }
            case ProtoDef.SELL_ACTIVITY_FREE: {//免费获取盛典档次
                break;
            }
            case ProtoDef.SELL_ACTIVITY_BUY: {//购买盛典档次
                break;
            }
           
            case ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_INFO: {// 首充活动获取
                let data = body as gameProto.IS2C_ACTIVITY_GET_FIRTS_PAY_INFO;
                let vo = ActivityModel.getActivityVoById<AcPayFirstVo>(data.activityId);
                if (vo) return vo.initPayFirstInfo(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD: {// 领取奖励
                let data = body as gameProto.IS2C_ACTIVITY_GET_FIRTS_PAY_REWARD;
                let vo = ActivityModel.getActivityVoById<AcPayFirstVo>(data.activityId);
                if (vo) vo.updateAward(data);;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_INFO: {// 累计充值活动获取
                let data = body as gameProto.IS2C_ACTIVITY_GET_TOTAL_PAY_INFO;
                let vo = ActivityModel.getActivityVoById<AcPaySumVo>(data.activityId);
                if (vo) vo.initAllrecharge(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD: {// 累计充值领取
                let data = body as gameProto.IS2C_ACTIVITY_GET_TOTAL_PAY_REWARD;
                let vo = ActivityModel.getActivityVoById<AcPaySumVo>(data.activityAward.avtivityId);
                if (vo) vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_INFO: {// 单笔充值活动获取
                let data = body as gameProto.IS2C_ACTIVITY_GET_SINGLE_PAY_INFO;
                let vo = ActivityModel.getActivityVoById<AcPaySetOneVo>(data.activityId);
                if (vo) vo.initRechargeOne(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD: {// 单笔充值领取
                let data = body as gameProto.IS2C_ACTIVITY_GET_SINGLE_PAY_REWARD;
                let vo = ActivityModel.getActivityVoById<AcPaySetOneVo>(data.activityAward.avtivityId);
                if (vo) vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_INFO: {// 消费好礼活动获取
                let data = body as gameProto.IS2C_ACTIVITY_GET_CONSUME_GIFT_INFO;
                let vo = ActivityModel.getActivityVoById<AcConsumeVo>(data.activityId);
                if (vo) vo.initConsumption(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD: {// 消费好礼领取
                let data = body as gameProto.IS2C_ACTIVITY_GET_CONSUME_GIFT_REWARD;
                let vo = ActivityModel.getActivityVoById<AcConsumeVo>(data.activityAward.avtivityId);
                if (vo) vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_INFO: {// 每日登录活动获取
                let data = body as gameProto.IS2C_ACTIVITY_GET_LOGIN_DAYS_INFO;
                let vo = ActivityModel.getActivityVoById<AcLoginDayVo>(data.activityId);
                if (vo) vo.initLoginDay(body);;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD: {// 每日登录领取
                let data = body as gameProto.IS2C_ACTIVITY_GET_LOGIN_DAYS_REWARD;
                let vo = ActivityModel.getActivityVoById<AcLoginDayVo>(data.activityAward.avtivityId);
                if (vo) vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ONLINE_INFO: {// 获取在线奖励状态
                OnLineModel.parseData(body);
                break;
            }
            case ProtoDef.S2C_ONLINE_REWARD: {// 领取在线奖励
                OnLineModel.addAwardRecord(body);
                break;
            }
            
            case ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_INFO: {// 成长基金活动获取
                let data = body as gameProto.IS2C_ACTIVITY_GET_GROWTH_FUND_INFO;
                let vo = ActivityModel.getActivityVoById<GrowthFundVo>(data.activityId);
                if (vo) vo.initGrowFund(body);;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD: {// 成长基金活动领奖
                let data = body as gameProto.IS2C_ACTIVITY_GET_GROWTH_FUND_REWARD;
                let vo = ActivityModel.getActivityVoById<GrowthFundVo>(data.activityAward.avtivityId);
                if (vo) vo.finishAward(data.activityAward);
                break;
            }

            case ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_INFO: {// 一元购
                let data = body as gameProto.IS2C_ACTIVITY_GET_ONE_RMB_BUY_INFO;
                let vo = ActivityModel.getActivityVoById<AcOneGiftBagVo>(data.activityId);
                if (vo) vo.initOneGiftBag(body);;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_REWARD: {// 一元购
                let data = body as gameProto.IS2C_ACTIVITY_GET_ONE_RMB_BUY_REWARD;
                let vo = ActivityModel.getActivityVoById<AcOneGiftBagVo>(data.activityAward.avtivityId);
                if (vo) vo.finishAward(data.activityAward);
                break;
            }

            case ProtoDef.S2C_ACTIVITY_ZHI_GOU_INFO: {// 直购礼包信息
                let data = body as gameProto.IS2C_ACTIVITY_ZHI_GOU_INFO;
                let vo = ActivityModel.getActivityVoById<AcPuGigtBagVo>(data.activityId);
                if (vo) vo.initPuGiftBagData(data.idCount);
                break;
            }


            case ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO: {// 周卡月卡信息
                let data = body as gameProto.IS2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO;
                let vo = ActivityModel.getActivityVoById<PayCardVo>(data.activityId);
                if (vo) vo.initPayCard(body);
                break;
            }

            case ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD: {// 周卡月卡领奖
                let data = body as gameProto.IS2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD;
                let vo = ActivityModel.getActivityVoById<PayCardVo>(data.activityAward.avtivityId);
                if (vo) vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_BUY_WEEK_MONTH_CARD: {// 购买周卡月卡
                if (body.code == 0) {
                    EffectUtils.showTips(GCode(CLEnum.BAG_BUY_SUC), 1, true);
                }
                break;
            }
            case ProtoDef.S2C_ACTIVITY_NOTICE_CONFIGS: {// 活动公告
                let data = body as gameProto.IS2C_ACTIVITY_NOTICE_CONFIGS
                ActivityModel.parseActivtyNotice(data);
                break;
            }

            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_INFO: {// 新武将活动信息
                let data = body as gameProto.IS2C_ACTIVITY_NEW_GENERAL_INFO;
                let vo = ActivityModel.getActivityVoById<AcNewGenVisVo>(data.activityId);
                vo.initNewGenVis(data);
                break;
            }

            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD: {// 新武将活动信息
                let data = body as gameProto.IS2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD;
                let vo = ActivityModel.getActivityVoById<AcNewGenVisVo>(data.activityId);
                vo.parseVisInfo(data);
                break;
            }

            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD: {// 新武将选择奖励
                let data = body as gameProto.IS2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD;
                if(data.code == 0){
                    let vo = ActivityModel.getActivityVoById<AcNewGenVisVo>(data.activityId);
                    vo.parseChangeReward(data);
                }
                break;
            }

            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_BOX_REWARD: {// 新武将领取宝箱
                let data = body as gameProto.IS2C_ACTIVITY_NEW_GENERAL_BOX_REWARD;
                let vo = ActivityModel.getActivityVoById<AcNewGenVisVo>(data.activityId);
                vo.parseGetBox(data);
                break;
            }

            case ProtoDef.S2C_ACTIVITY_BUY_GENERAL_BAG:{  //购买新武将限购礼包
                let data = body as gameProto.IS2C_ACTIVITY_BUY_GENERAL_BAG;
                if(data.code == 0){
                    let vo = ActivityModel.getActivityVoById<AcNewGenVisVo>(data.activityId);
                    vo.setLimitStatu(data.generalBagStatu);
                }
                break;
            }

            case ProtoDef.S2C_ACTIVITY_AWARD_GENERAL_BAG:{  //领取新武将限购礼包
                let data = body as gameProto.IS2C_ACTIVITY_AWARD_GENERAL_BAG;
                if(data.code == 0){
                    let vo = ActivityModel.getActivityVoById<AcNewGenVisVo>(data.activityId);
                    vo.bugLimit(data);
                }
                break;
            }

            case ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_INFO: { //聚宝盆活动信息
                let data = body as gameProto.IS2C_ACTIVITY_TREASEURE_BOWL_INFO;
                let vo = ActivityModel.getActivityVoById<AcCornucopiaVo>(data.treasureBowl.activityId);
                vo.initCorInfo(data);
                break ;
            }
            case ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_REWARD: { //聚宝盆领取奖励
                let data = body as gameProto.IS2C_ACTIVITY_TREASEURE_BOWL_REWARD;
                let vo = ActivityModel.getActivityVoById<AcCornucopiaVo>(data.treasureBowl.activityId);
                vo.rewardReturn(data);
                break ;
            }
            default:
                break;
        }

        AGame.ServiceBuilder.notifyView(notification);
    }

    /**请求开启的活动列表 */
    public static C2S_ACTIVITY_LIST() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_LIST) as gameProto.C2S_ACTIVITY_LIST;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**请求活动配置 */
    public static C2S_ACTIVITY_COMM_CONFIG(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_COMM_CONFIG) as gameProto.C2S_ACTIVITY_COMM_CONFIG;
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }


    /**获取盛典记录信息 */
    public static send_SELL_ACTIVITY_INFO(activityId) {
        debug("BattleProxy:---send_SELL_ACTIVITY_INFO>>");
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.SELL_ACTIVITY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**免费获取盛典档次 */
    public static send_SELL_ACTIVITY_FREE(activityId, levelId) {
        debug("BattleProxy:---send_SELL_ACTIVITY_FREE>>");
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.SELL_ACTIVITY_FREE);
        data.activityId = activityId;
        data.levelId = levelId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**购买盛典档次 */
    public static send_SELL_ACTIVITY_BUY(activityId, levelId) {
        debug("BattleProxy:---send_SELL_ACTIVITY_BUY>>");
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.SELL_ACTIVITY_BUY);
        data.activityId = activityId;
        data.levelId = levelId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    
    /**首充活动状态 */
    public static C2S_ACTIVITY_GET_FIRTS_PAY_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**首充领取奖励 */
    public static C2S_ACTIVITY_GET_FIRTS_PAY_REWARD(activityId: number, stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**累计充值状态 */
    public static C2S_ACTIVITY_GET_TOTAL_PAY_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**累计充值领取 */
    public static C2S_ACTIVITY_GET_TOTAL_PAY_REWARD(activityId: number, stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**单笔充值状态 */
    public static C2S_ACTIVITY_GET_SINGLE_PAY_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**单笔充值领取 */
    public static C2S_ACTIVITY_GET_SINGLE_PAY_REWARD(activityId: number, stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**消费好礼状态 */
    public static C2S_ACTIVITY_GET_CONSUME_GIFT_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**消费好礼领取 */
    public static C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD(activityId: number, stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**每日登录状态 */
    public static C2S_ACTIVITY_GET_LOGIN_DAYS_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**每日登录领取 */
    public static C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD(activityId: number, stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**获取在线奖励状态 */
    public static C2S_ONLINE_INFO_OPEN_VIEW() {
        OnLineModel.viewState = true;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ONLINE_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**获取在线奖励状态 */
    public static C2S_ONLINE_INFO() {
        OnLineModel.viewState = false;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ONLINE_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**领取在线奖励 */
    public static C2S_ONLINE_REWARD(stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ONLINE_REWARD);
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    
    /**购买成长基金*/
    public static C2S_ACTIVITY_BUY_GROWTH_FUND(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_BUY_GROWTH_FUND);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**成长基金状态 */
    public static C2S_ACTIVITY_GET_GROWTH_FUND_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**成长基金领取 */
    public static C2S_ACTIVITY_GET_GROWTH_FUND_REWARD(activityId: number, stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**购买周卡月卡 */
    public static C2S_ACTIVITY_BUY_WEEK_MONTH_CARD(activityId: number, cardType: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_BUY_WEEK_MONTH_CARD);
        data.activityId = activityId;
        data.cardType = cardType;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**周卡月卡信息请求 */
    public static C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**周卡月卡领取奖励 */
    public static C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD(activityId: number, cardType: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD);
        data.activityId = activityId;
        data.cardType = cardType;
        AGame.ServiceBuilder.sendMessage(data);
    }


    /**一元购信息 */
    public static C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**一元购领奖 */
    public static C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD(activityId: number, stepId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**直购礼包信息 */
    public static C2S_ACTIVITY_ZHI_GOU_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_ZHI_GOU_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**活动公告 */
    public static C2S_ACTIVITY_NOTICE_CONFIGS() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NOTICE_CONFIGS);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**新武将活动信息 */
    public static send_C2S_ACTIVITY_NEW_GENERAL_INFO(activityId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_INFO) as gameProto.IC2S_ACTIVITY_NEW_GENERAL_INFO;
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**新武将选择奖励 */
    public static send_C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD(activityId: number, items: number[]) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD) as gameProto.IC2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD;
        data.activityId = activityId;
        data.items = items;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**新武将拜访 */
    public static send_C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD(activityId: number, type: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD) as gameProto.IC2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD;
        data.activityId = activityId;
        data.visitType = type;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**新武将领取宝箱奖励 */
    public static send_C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD(activityId: number, step: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD) as gameProto.IC2S_ACTIVITY_NEW_GENERAL_BOX_REWARD;
        data.activityId = activityId;
        data.step = step;
        AGame.ServiceBuilder.sendMessage(data);
    }
    //购买武将礼包
    public static send_C2S_ACTIVITY_BUY_GENERAL_BAG(activityId: number){
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_BUY_GENERAL_BAG) as gameProto.IC2S_ACTIVITY_BUY_GENERAL_BAG;
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    //领取武将礼包
    public static send_C2S_ACTIVITY_AWARD_GENERAL_BAG(activityId: number){
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_AWARD_GENERAL_BAG) as gameProto.IC2S_ACTIVITY_AWARD_GENERAL_BAG;
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    //新7天活动聚宝盆信息
    public static send_C2S_ACTIVITY_TREASEURE_BOWL_INFO(activityId: number){
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_INFO) as gameProto.IC2S_ACTIVITY_TREASEURE_BOWL_INFO;
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    //新7天活动聚宝盆领奖
    public static send_C2S_ACTIVITY_TREASEURE_BOWL_REWARD(activityId: number){
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_REWARD) as gameProto.IC2S_ACTIVITY_TREASEURE_BOWL_REWARD;
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    }

}