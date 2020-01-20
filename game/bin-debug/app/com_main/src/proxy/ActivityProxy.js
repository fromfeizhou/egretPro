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
var ActivityProxy = /** @class */ (function (_super_1) {
    __extends(ActivityProxy, _super_1);
    function ActivityProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    ActivityProxy.prototype.listenerProtoNotifications = function () {
        return [
            // [ProtoDef.PUSH_ACTIVITY_INFO, this, '', 'ActivityMessage'],//推送活动消息
            [ProtoDef.SELL_ACTIVITY_INFO, this, 'SellActivityInfoReq', 'SellActivityInfoResp'],
            [ProtoDef.SELL_ACTIVITY_FREE, this, 'SellActivityFreeReq', 'SellActivityFreeResp'],
            [ProtoDef.SELL_ACTIVITY_BUY, this, 'SellActivityBuyReq', 'SellActivityBuyResp'],
        ];
    };
    ActivityProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            // [ProtoDef.S2C_ACTIVITY_INFO, this, 'S2C_ACTIVITY_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_LIST, this, 'C2S_ACTIVITY_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_LIST, this, 'S2C_ACTIVITY_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_COMM_CONFIG, this, 'C2S_ACTIVITY_COMM_CONFIG', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_COMM_CONFIG, this, 'S2C_ACTIVITY_COMM_CONFIG', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GET_COLLECT_REWARD, this, 'C2S_GET_COLLECT_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_COLLECT_REWARD, this, 'S2C_GET_COLLECT_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_ACTIVITY_COUNT_CONFIG, this, 'S2C_ACTIVITY_COUNT_CONFIG', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_ACTIVITY_UPDATE, this, 'S2C_ACTIVITY_UPDATE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_INFO, this, 'C2S_ACTIVITY_GET_FIRTS_PAY_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_INFO, this, 'S2C_ACTIVITY_GET_FIRTS_PAY_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_REWARD, this, 'C2S_ACTIVITY_GET_FIRTS_PAY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD, this, 'S2C_ACTIVITY_GET_FIRTS_PAY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_INFO, this, 'C2S_ACTIVITY_GET_TOTAL_PAY_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_INFO, this, 'S2C_ACTIVITY_GET_TOTAL_PAY_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD, this, 'C2S_ACTIVITY_GET_TOTAL_PAY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD, this, 'S2C_ACTIVITY_GET_TOTAL_PAY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_INFO, this, 'C2S_ACTIVITY_GET_SINGLE_PAY_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_INFO, this, 'S2C_ACTIVITY_GET_SINGLE_PAY_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD, this, 'C2S_ACTIVITY_GET_SINGLE_PAY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD, this, 'S2C_ACTIVITY_GET_SINGLE_PAY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_INFO, this, 'C2S_ACTIVITY_GET_CONSUME_GIFT_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_INFO, this, 'S2C_ACTIVITY_GET_CONSUME_GIFT_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD, this, 'C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD, this, 'S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_INFO, this, 'C2S_ACTIVITY_GET_LOGIN_DAYS_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_INFO, this, 'S2C_ACTIVITY_GET_LOGIN_DAYS_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD, this, 'C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD, this, 'S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ONLINE_INFO, this, 'C2S_ONLINE_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ONLINE_INFO, this, 'S2C_ONLINE_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ONLINE_REWARD, this, 'C2S_ONLINE_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ONLINE_REWARD, this, 'S2C_ONLINE_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_BUY_GROWTH_FUND, this, 'C2S_ACTIVITY_BUY_GROWTH_FUND', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_BUY_GROWTH_FUND, this, 'S2C_ACTIVITY_BUY_GROWTH_FUND', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_INFO, this, 'C2S_ACTIVITY_GET_GROWTH_FUND_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_INFO, this, 'S2C_ACTIVITY_GET_GROWTH_FUND_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_REWARD, this, 'C2S_ACTIVITY_GET_GROWTH_FUND_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD, this, 'S2C_ACTIVITY_GET_GROWTH_FUND_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_BUY_WEEK_MONTH_CARD, this, 'C2S_ACTIVITY_BUY_WEEK_MONTH_CARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_BUY_WEEK_MONTH_CARD, this, 'S2C_ACTIVITY_BUY_WEEK_MONTH_CARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO, this, 'C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO, this, 'S2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD, this, 'C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD, this, 'S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO, this, 'C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_INFO, this, 'S2C_ACTIVITY_GET_ONE_RMB_BUY_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD, this, 'C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_REWARD, this, 'S2C_ACTIVITY_GET_ONE_RMB_BUY_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_ZHI_GOU_INFO, this, 'C2S_ACTIVITY_ZHI_GOU_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_ZHI_GOU_INFO, this, 'S2C_ACTIVITY_ZHI_GOU_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_INFO, this, 'C2S_ACTIVITY_NEW_GENERAL_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_INFO, this, 'S2C_ACTIVITY_NEW_GENERAL_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this, 'C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this, 'S2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD, this, 'C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD, this, 'S2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD, this, 'C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_NEW_GENERAL_BOX_REWARD, this, 'S2C_ACTIVITY_NEW_GENERAL_BOX_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_BUY_GENERAL_BAG, this, 'C2S_ACTIVITY_BUY_GENERAL_BAG', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_BUY_GENERAL_BAG, this, 'S2C_ACTIVITY_BUY_GENERAL_BAG', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_AWARD_GENERAL_BAG, this, 'C2S_ACTIVITY_AWARD_GENERAL_BAG', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_AWARD_GENERAL_BAG, this, 'S2C_ACTIVITY_AWARD_GENERAL_BAG', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_INFO, this, 'C2S_ACTIVITY_TREASEURE_BOWL_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_INFO, this, 'S2C_ACTIVITY_TREASEURE_BOWL_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_REWARD, this, 'C2S_ACTIVITY_TREASEURE_BOWL_REWARD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_REWARD, this, 'S2C_ACTIVITY_TREASEURE_BOWL_REWARD', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_ACTIVITY_NOTICE_CONFIGS, this, 'C2S_ACTIVITY_NOTICE_CONFIGS', ProxyEnum.SEND],
            [ProtoDef.S2C_ACTIVITY_NOTICE_CONFIGS, this, 'S2C_ACTIVITY_NOTICE_CONFIGS', ProxyEnum.RECEIVE],
        ];
    };
    ActivityProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_ACTIVITY_LIST: { //开放活动推送
                var data = body;
                if (data.isReset) {
                    ActivityModel.resetActivitInfos(data);
                }
                else {
                    ActivityModel.parseActivitInfos(data);
                    //登录消息结束标记
                    LoginProxy.sendEndLogin();
                }
                break;
            }
            case ProtoDef.S2C_ACTIVITY_COMM_CONFIG: { //获得配置表
                var data = body;
                ActivityModel.parseConfig(data);
                break;
            }
            case ProtoDef.SELL_ACTIVITY_INFO: { //获取盛典记录信息
                if (!body.activityId)
                    return;
                break;
            }
            case ProtoDef.SELL_ACTIVITY_FREE: { //免费获取盛典档次
                break;
            }
            case ProtoDef.SELL_ACTIVITY_BUY: { //购买盛典档次
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_INFO: { // 首充活动获取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    return vo.initPayFirstInfo(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_FIRTS_PAY_REWARD: { // 领取奖励
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.updateAward(data);
                ;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_INFO: { // 累计充值活动获取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initAllrecharge(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD: { // 累计充值领取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_INFO: { // 单笔充值活动获取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initRechargeOne(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD: { // 单笔充值领取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_INFO: { // 消费好礼活动获取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initConsumption(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD: { // 消费好礼领取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_INFO: { // 每日登录活动获取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initLoginDay(body);
                ;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD: { // 每日登录领取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ONLINE_INFO: { // 获取在线奖励状态
                OnLineModel.parseData(body);
                break;
            }
            case ProtoDef.S2C_ONLINE_REWARD: { // 领取在线奖励
                OnLineModel.addAwardRecord(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_INFO: { // 成长基金活动获取
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initGrowFund(body);
                ;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD: { // 成长基金活动领奖
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_INFO: { // 一元购
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initOneGiftBag(body);
                ;
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_ONE_RMB_BUY_REWARD: { // 一元购
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_ZHI_GOU_INFO: { // 直购礼包信息
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initPuGiftBagData(data.idCount);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_INFO: { // 周卡月卡信息
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                if (vo)
                    vo.initPayCard(body);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD: { // 周卡月卡领奖
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityAward.avtivityId);
                if (vo)
                    vo.finishAward(data.activityAward);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_BUY_WEEK_MONTH_CARD: { // 购买周卡月卡
                if (body.code == 0) {
                    EffectUtils.showTips(GCode(CLEnum.BAG_BUY_SUC), 1, true);
                }
                break;
            }
            case ProtoDef.S2C_ACTIVITY_NOTICE_CONFIGS: { // 活动公告
                var data = body;
                ActivityModel.parseActivtyNotice(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_INFO: { // 新武将活动信息
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                vo.initNewGenVis(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_VISIT_REWARD: { // 新武将活动信息
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                vo.parseVisInfo(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD: { // 新武将选择奖励
                var data = body;
                if (data.code == 0) {
                    var vo = ActivityModel.getActivityVoById(data.activityId);
                    vo.parseChangeReward(data);
                }
                break;
            }
            case ProtoDef.S2C_ACTIVITY_NEW_GENERAL_BOX_REWARD: { // 新武将领取宝箱
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.activityId);
                vo.parseGetBox(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_BUY_GENERAL_BAG: { //购买新武将限购礼包
                var data = body;
                if (data.code == 0) {
                    var vo = ActivityModel.getActivityVoById(data.activityId);
                    vo.setLimitStatu(data.generalBagStatu);
                }
                break;
            }
            case ProtoDef.S2C_ACTIVITY_AWARD_GENERAL_BAG: { //领取新武将限购礼包
                var data = body;
                if (data.code == 0) {
                    var vo = ActivityModel.getActivityVoById(data.activityId);
                    vo.bugLimit(data);
                }
                break;
            }
            case ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_INFO: { //聚宝盆活动信息
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.treasureBowl.activityId);
                vo.initCorInfo(data);
                break;
            }
            case ProtoDef.S2C_ACTIVITY_TREASEURE_BOWL_REWARD: { //聚宝盆领取奖励
                var data = body;
                var vo = ActivityModel.getActivityVoById(data.treasureBowl.activityId);
                vo.rewardReturn(data);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求开启的活动列表 */
    ActivityProxy.C2S_ACTIVITY_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求活动配置 */
    ActivityProxy.C2S_ACTIVITY_COMM_CONFIG = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_COMM_CONFIG);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取盛典记录信息 */
    ActivityProxy.send_SELL_ACTIVITY_INFO = function (activityId) {
        debug("BattleProxy:---send_SELL_ACTIVITY_INFO>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.SELL_ACTIVITY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**免费获取盛典档次 */
    ActivityProxy.send_SELL_ACTIVITY_FREE = function (activityId, levelId) {
        debug("BattleProxy:---send_SELL_ACTIVITY_FREE>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.SELL_ACTIVITY_FREE);
        data.activityId = activityId;
        data.levelId = levelId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**购买盛典档次 */
    ActivityProxy.send_SELL_ACTIVITY_BUY = function (activityId, levelId) {
        debug("BattleProxy:---send_SELL_ACTIVITY_BUY>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.SELL_ACTIVITY_BUY);
        data.activityId = activityId;
        data.levelId = levelId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**首充活动状态 */
    ActivityProxy.C2S_ACTIVITY_GET_FIRTS_PAY_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**首充领取奖励 */
    ActivityProxy.C2S_ACTIVITY_GET_FIRTS_PAY_REWARD = function (activityId, stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_FIRTS_PAY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**累计充值状态 */
    ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**累计充值领取 */
    ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD = function (activityId, stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**单笔充值状态 */
    ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**单笔充值领取 */
    ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD = function (activityId, stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**消费好礼状态 */
    ActivityProxy.C2S_ACTIVITY_GET_CONSUME_GIFT_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**消费好礼领取 */
    ActivityProxy.C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD = function (activityId, stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**每日登录状态 */
    ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**每日登录领取 */
    ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD = function (activityId, stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取在线奖励状态 */
    ActivityProxy.C2S_ONLINE_INFO_OPEN_VIEW = function () {
        OnLineModel.viewState = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ONLINE_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取在线奖励状态 */
    ActivityProxy.C2S_ONLINE_INFO = function () {
        OnLineModel.viewState = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ONLINE_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**领取在线奖励 */
    ActivityProxy.C2S_ONLINE_REWARD = function (stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ONLINE_REWARD);
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**购买成长基金*/
    ActivityProxy.C2S_ACTIVITY_BUY_GROWTH_FUND = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_BUY_GROWTH_FUND);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**成长基金状态 */
    ActivityProxy.C2S_ACTIVITY_GET_GROWTH_FUND_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**成长基金领取 */
    ActivityProxy.C2S_ACTIVITY_GET_GROWTH_FUND_REWARD = function (activityId, stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_GROWTH_FUND_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**购买周卡月卡 */
    ActivityProxy.C2S_ACTIVITY_BUY_WEEK_MONTH_CARD = function (activityId, cardType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_BUY_WEEK_MONTH_CARD);
        data.activityId = activityId;
        data.cardType = cardType;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**周卡月卡信息请求 */
    ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**周卡月卡领取奖励 */
    ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD = function (activityId, cardType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD);
        data.activityId = activityId;
        data.cardType = cardType;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**一元购信息 */
    ActivityProxy.C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**一元购领奖 */
    ActivityProxy.C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD = function (activityId, stepId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD);
        data.activityId = activityId;
        data.stepId = stepId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**直购礼包信息 */
    ActivityProxy.C2S_ACTIVITY_ZHI_GOU_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_ZHI_GOU_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**活动公告 */
    ActivityProxy.C2S_ACTIVITY_NOTICE_CONFIGS = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NOTICE_CONFIGS);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**新武将活动信息 */
    ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**新武将选择奖励 */
    ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD = function (activityId, items) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD);
        data.activityId = activityId;
        data.items = items;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**新武将拜访 */
    ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD = function (activityId, type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD);
        data.activityId = activityId;
        data.visitType = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**新武将领取宝箱奖励 */
    ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD = function (activityId, step) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD);
        data.activityId = activityId;
        data.step = step;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //购买武将礼包
    ActivityProxy.send_C2S_ACTIVITY_BUY_GENERAL_BAG = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_BUY_GENERAL_BAG);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //领取武将礼包
    ActivityProxy.send_C2S_ACTIVITY_AWARD_GENERAL_BAG = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_AWARD_GENERAL_BAG);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //新7天活动聚宝盆信息
    ActivityProxy.send_C2S_ACTIVITY_TREASEURE_BOWL_INFO = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_INFO);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //新7天活动聚宝盆领奖
    ActivityProxy.send_C2S_ACTIVITY_TREASEURE_BOWL_REWARD = function (activityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_TREASEURE_BOWL_REWARD);
        data.activityId = activityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return ActivityProxy;
}(BaseProxy));
