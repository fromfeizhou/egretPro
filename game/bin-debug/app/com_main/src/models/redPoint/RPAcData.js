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
 * 通用红点
 **/
var RPAcData = /** @class */ (function (_super_1) {
    __extends(RPAcData, _super_1);
    function RPAcData() {
        return _super_1.call(this) || this;
    }
    /**初始化 */
    RPAcData.prototype.init = function () {
        _super_1.prototype.init.call(this);
    };
    /**清理 */
    RPAcData.prototype.clear = function () {
        _super_1.prototype.clear.call(this);
    };
    /**---------------------------------------------------------------------------------------------------------------
    * 红点ui刷新 begin
    * ---------------------------------------------------------------------------------------------------------------

    /**刷新红点 */
    RPAcData.prototype.refreshView = function (info, evtType) {
        _super_1.prototype.refreshView.call(this, info, evtType);
        switch (evtType) {
            case RedEvtType.OPEN_SEVEN: { //开服7天活动红点
                var vo = ActivityModel.getActivityVo(AcViewType.OPEN_SEVEN);
                if (vo)
                    info.setRedState(evtType, vo.getDayRedState(info.param.dayAc, info.param.dayTaskId));
                break;
            }
            case RedEvtType.NOR_OPEN_SEVEN: { //循环7天活动红点
                var vo = ActivityModel.getActivityVo(AcViewType.NOR_SEVEN);
                if (vo)
                    info.setRedState(evtType, vo.getRedState(info.param.dayTaskId));
                break;
            }
            case RedEvtType.CARD_MONTH: { //周卡月卡
                var vo = ActivityModel.getActivityVo(AcViewType.CARD_MONTH_WEEK);
                info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_ADD: { //累计充值
                var vo = ActivityModel.getActivityVo(AcViewType.RECHARGE_ADD_UP);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_ADD_3: { //累计充值3
                var vo = ActivityModel.getActivityVo(AcViewType.RECHARGE_ADD_UP_3);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_ADD_4: { //新春累计充值
                var vo = ActivityModel.getActivityVo(AcViewType.RECHARGE_ADD_UP_5);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_SINGLE: { //单笔充值
                var vo = ActivityModel.getActivityVo(AcViewType.RECHARGE_SINGLE);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_SINGLE_2: { //单笔充值2
                var vo = ActivityModel.getActivityVo(AcViewType.RECHARGE_SINGLE_2);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_SINGLE_3: { //新春单笔充值
                var vo = ActivityModel.getActivityVo(AcViewType.RECHARGE_SINGLE_3);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.CONSUME_GIFT: { //消费豪礼
                var vo = ActivityModel.getActivityVo(AcViewType.CONSUME_GIFT);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.LOGIN_DAY: { //7天登录活动
                var vo = ActivityModel.getActivityVo(AcViewType.SIGN_CONTIN_DAY);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.LOGIN_DAY_2: { //7天登录活动2
                var vo = ActivityModel.getActivityVo(AcViewType.SIGN_CONTIN_DAY_2);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.LOGIN_DAY_3: { //新春7天登录活动
                var vo = ActivityModel.getActivityVo(AcViewType.SIGN_CONTIN_DAY_3);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.GROWTH_FUN: { //成长基金
                var vo = ActivityModel.getActivityVo(AcViewType.FUND_GROWTH);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.SIGN_MONTH_DAY: { //月签到
                var vo = ActivityModel.getActivityVo(AcViewType.SIGN_MONTH_DAY);
                if (vo)
                    info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.THRONE: { //封王战
                var vo = ActivityModel.getActivityVo(AcViewType.THRONE);
                if (vo)
                    info.setRedState(evtType, vo.activited ? 1 : 0);
                break;
            }
            case RedEvtType.ONE_GIFT_BAG: { //一元购
                var vo = ActivityModel.getActivityVo(AcViewType.ONE_GIFT_BAG);
                if (vo)
                    info.setRedState(evtType, 1);
                break;
            }
            case RedEvtType.FIRST_RECHARGE: { //首充
                var vo = ActivityModel.getActivityVo(AcViewType.FIRST_RECHARGE);
                if (vo)
                    info.setRedState(evtType, vo.getBtnState() ? 1 : 0);
                break;
            }
            case RedEvtType.XIANGYANG: { //襄阳战
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                if (vo)
                    info.setRedState(evtType, vo.activited ? 1 : 0);
                break;
            }
            case RedEvtType.TURNTABLE: { //转盘
                var vo = ActivityModel.getActivityVo(AcViewType.PRIZE);
                if (vo)
                    info.setRedState(evtType, vo.hasAward() ? 1 : 0);
                break;
            }
            case RedEvtType.NEW_GEN_VIS: { //武将拜访
                var vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
                if (vo)
                    info.setRedState(evtType, vo.newGenVisRedState() ? 1 : 0);
                break;
            }
            case RedEvtType.NEW_GEN_LIMIT_BUY: { //武将限购
                var vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
                if (vo)
                    info.setRedState(evtType, vo.newGenLimRedS() ? 1 : 0);
                break;
            }
            case RedEvtType.TREASEURE_BOWL: { //聚宝盆红点
                var vo = ActivityModel.getActivityVo(AcViewType.TREASEURE_BOWL);
                if (vo)
                    info.setRedState(evtType, vo.newCorRed() ? 1 : 0);
                break;
            }
            case RedEvtType.TREASEURE_BOWL_2: { //新春聚宝盆红点
                var vo = ActivityModel.getActivityVo(AcViewType.TREASEURE_BOWL_2);
                if (vo)
                    info.setRedState(evtType, vo.newCorRed() ? 1 : 0);
                break;
            }
            case RedEvtType.PLAYER_BATTLE_REWARD: { //襄阳战个人挑战奖更新
                var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                if (vo)
                    info.setRedState(evtType, vo.checkBattleRewardRedPoint() ? 1 : 0);
                break;
            }
        }
    };
    /**---------------------------------------------------------------------------------------------------------------
    * 红点ui刷新 end
    * ---------------------------------------------------------------------------------------------------------------

    /**---------------------------------------------------------------------------------------------------------------
    * 监听事件 begin
    * ---------------------------------------------------------------------------------------------------------------
    */
    /**
     * 监听事件
     * 注意频繁刷新事件或列表循环里的事件 绝对不用
     * 如列表数据更新 可监听列表循环外的事件
     *  */
    RPAcData.prototype.initEvent = function () {
        this.addDataEvent(MissionEvent.MISSION_UPDATE_INFO, this.onMissionUpdate, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.onActivityAddCharge, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.onActivitySingleCharge, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_CONSUME_GIFT, this.onActivityConsumeGift, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.onActivityLoginDay, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_MOON_CARD, this.onActivityMoonCard, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_GROWTH_FUN, this.onActivityGrowthFun, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, this.onOneGiftBag, this);
        this.addDataEvent(RoleEvent.ROLE_LEVLE, this.onRoleLevel, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_SIGN_MONTH, this.onActivitySignMonth, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE, this.onActTurnTable, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_TURNTABLE_UPDATE, this.onActTurnTable, this);
        this.addDataEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
        this.addDataEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.onActivityChange, this);
        this.addDataEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.onfirstPayState, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, this.newGenVis, this);
        this.addDataEvent(ActivityEvent.AC_7DAY_COR, this.newCor, this);
        this.addDataEvent(ActivityEvent.PLAYER_BATTLE_REWARD_UPDATE, this.playerRewardUpdate, this);
    };
    /**活动变动 */
    RPAcData.prototype.onActivityChange = function (type) {
        if (type == AcViewType.THRONE) {
            RedPointModel.onRedPointEvtUpdate(RedEvtType.THRONE);
        }
    };
    /**首充 */
    RPAcData.prototype.onfirstPayState = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.FIRST_RECHARGE);
    };
    /**月签到 */
    RPAcData.prototype.onActivitySignMonth = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.SIGN_MONTH_DAY);
    };
    /**封王战 */
    RPAcData.prototype.onActivityThrone = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.THRONE);
    };
    /**等级变化 */
    RPAcData.prototype.onRoleLevel = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GROWTH_FUN);
    };
    /**成长基金 */
    RPAcData.prototype.onActivityGrowthFun = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GROWTH_FUN);
    };
    /**一元购 */
    RPAcData.prototype.onOneGiftBag = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.ONE_GIFT_BAG);
    };
    /**周卡月卡刷新 */
    RPAcData.prototype.onActivityMoonCard = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CARD_MONTH);
    };
    /**7天登陆 */
    RPAcData.prototype.onActivityLoginDay = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.LOGIN_DAY);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.LOGIN_DAY_2);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.LOGIN_DAY_3);
    };
    /**消费豪礼 */
    RPAcData.prototype.onActivityConsumeGift = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CONSUME_GIFT);
    };
    /**单笔充值 */
    RPAcData.prototype.onActivitySingleCharge = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_SINGLE);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_SINGLE_2);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_SINGLE_3);
    };
    /**累计充值 */
    RPAcData.prototype.onActivityAddCharge = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_ADD);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_ADD_3);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_LIMIT_BUY);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_ADD_4);
    };
    /**幸运转盘 */
    RPAcData.prototype.onActTurnTable = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TURNTABLE);
    };
    /**任务更新 */
    RPAcData.prototype.onMissionUpdate = function (data) {
        if (TaskType.Activity == data.type) {
            var vo = ActivityModel.getActivityVoById(data.activityId);
            if (!vo)
                return;
            if (vo.viewType == AcViewType.OPEN_SEVEN) {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.OPEN_SEVEN);
            }
            else if (vo.viewType == AcViewType.NOR_SEVEN) {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.NOR_OPEN_SEVEN);
            }
            return;
        }
    };
    /**道具变动 */
    RPAcData.prototype.onItemChange = function (itemId) {
        switch (itemId) {
            case PropEnum.TURNTABLE: { //转盘道具
                this.onActTurnTable();
                break;
            }
            case PropEnum.XW: { //信物
                RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_VIS);
                break;
            }
        }
    };
    /**新武将红点 */
    RPAcData.prototype.newGenVis = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_VIS);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_LIMIT_BUY);
    };
    /**新7天聚宝盆红点 ,新春活动聚宝盆*/
    RPAcData.prototype.newCor = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREASEURE_BOWL);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREASEURE_BOWL_2);
    };
    /**襄阳战个人挑战奖更新 */
    RPAcData.prototype.playerRewardUpdate = function () {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.PLAYER_BATTLE_REWARD);
    };
    return RPAcData;
}(RPBaseData));
