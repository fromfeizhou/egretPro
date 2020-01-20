/**
 * 通用红点
 **/
class RPAcData extends RPBaseData {

    public constructor() {
        super();
    }

    /**初始化 */
    public init() {
        super.init();
    }

    /**清理 */
    public clear() {
        super.clear();
    }

    /**---------------------------------------------------------------------------------------------------------------
    * 红点ui刷新 begin
    * ---------------------------------------------------------------------------------------------------------------

    /**刷新红点 */
    public refreshView(info: RedPointView, evtType: RedEvtType) {
        super.refreshView(info, evtType);
        switch (evtType) {
            case RedEvtType.OPEN_SEVEN: { //开服7天活动红点
                let vo = ActivityModel.getActivityVo<AcTaskVo>(AcViewType.OPEN_SEVEN);
                if (vo) info.setRedState(evtType, vo.getDayRedState(info.param.dayAc, info.param.dayTaskId));
                break;
            }
            case RedEvtType.NOR_OPEN_SEVEN: { //循环7天活动红点
                let vo = ActivityModel.getActivityVo<AcTaskVo>(AcViewType.NOR_SEVEN);
                if (vo) info.setRedState(evtType, vo.getRedState(info.param.dayTaskId));
                break;
            }
            case RedEvtType.CARD_MONTH: { //周卡月卡
                let vo = ActivityModel.getActivityVo<PayCardVo>(AcViewType.CARD_MONTH_WEEK);
                info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_ADD: { //累计充值
                let vo = ActivityModel.getActivityVo<AcPaySumVo>(AcViewType.RECHARGE_ADD_UP);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_ADD_3: { //累计充值3
                let vo = ActivityModel.getActivityVo<AcPaySumVo>(AcViewType.RECHARGE_ADD_UP_3);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_ADD_4: { //新春累计充值
                let vo = ActivityModel.getActivityVo<AcPaySumVo>(AcViewType.RECHARGE_ADD_UP_5);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_SINGLE: { //单笔充值
                let vo = ActivityModel.getActivityVo<AcPaySetOneVo>(AcViewType.RECHARGE_SINGLE);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_SINGLE_2: { //单笔充值2
                let vo = ActivityModel.getActivityVo<AcPaySetOneVo>(AcViewType.RECHARGE_SINGLE_2);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.RECHARD_SINGLE_3: { //新春单笔充值
                let vo = ActivityModel.getActivityVo<AcPaySetOneVo>(AcViewType.RECHARGE_SINGLE_3);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.CONSUME_GIFT: { //消费豪礼
                let vo = ActivityModel.getActivityVo<AcConsumeVo>(AcViewType.CONSUME_GIFT);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.LOGIN_DAY: { //7天登录活动
                let vo = ActivityModel.getActivityVo<AcLoginDayVo>(AcViewType.SIGN_CONTIN_DAY);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.LOGIN_DAY_2: { //7天登录活动2
                let vo = ActivityModel.getActivityVo<AcLoginDayVo>(AcViewType.SIGN_CONTIN_DAY_2);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.LOGIN_DAY_3: { //新春7天登录活动
                let vo = ActivityModel.getActivityVo<AcLoginDayVo>(AcViewType.SIGN_CONTIN_DAY_3);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.GROWTH_FUN: {    //成长基金
                let vo = ActivityModel.getActivityVo<GrowthFundVo>(AcViewType.FUND_GROWTH);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.SIGN_MONTH_DAY: {    //月签到
                let vo = ActivityModel.getActivityVo<AcSignUpVo>(AcViewType.SIGN_MONTH_DAY);
                if (vo) info.setRedState(evtType, vo.hasAward());
                break;
            }
            case RedEvtType.THRONE: {//封王战
                let vo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.THRONE);
                if (vo) info.setRedState(evtType, vo.activited ? 1 : 0);
                break;
            }
            case RedEvtType.ONE_GIFT_BAG: {//一元购
                let vo = ActivityModel.getActivityVo<AcOneGiftBagVo>(AcViewType.ONE_GIFT_BAG);
                if (vo) info.setRedState(evtType, 1);
                break;
            }
            case RedEvtType.FIRST_RECHARGE: {    //首充
                let vo = ActivityModel.getActivityVo<AcPayFirstVo>(AcViewType.FIRST_RECHARGE);
                if (vo) info.setRedState(evtType, vo.getBtnState() ? 1 : 0);
                break;
            }
            case RedEvtType.XIANGYANG: {//襄阳战
                let vo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.XIANGYANG);
                if (vo) info.setRedState(evtType, vo.activited ? 1 : 0);
                break;
            }
            case RedEvtType.TURNTABLE: {//转盘
                let vo = ActivityModel.getActivityVo<AcTurnTableVo>(AcViewType.PRIZE);
                if (vo) info.setRedState(evtType, vo.hasAward() ? 1 : 0);
                break;
            }
            case RedEvtType.NEW_GEN_VIS: { //武将拜访
                let vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
                if (vo) info.setRedState(evtType, vo.newGenVisRedState() ? 1 : 0);
                break;
            }
            case RedEvtType.NEW_GEN_LIMIT_BUY: { //武将限购
                let vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
                if (vo) info.setRedState(evtType, vo.newGenLimRedS() ? 1 : 0);
                break;
            }
            case RedEvtType.TREASEURE_BOWL: { //聚宝盆红点
                let vo = ActivityModel.getActivityVo<AcCornucopiaVo>(AcViewType.TREASEURE_BOWL);
                if (vo) info.setRedState(evtType, vo.newCorRed() ? 1 : 0);
                break;
            }
            case RedEvtType.TREASEURE_BOWL_2: { //新春聚宝盆红点
                let vo = ActivityModel.getActivityVo<AcCornucopiaVo>(AcViewType.TREASEURE_BOWL_2);
                if (vo) info.setRedState(evtType, vo.newCorRed() ? 1 : 0);
                break;
            }
            case RedEvtType.PLAYER_BATTLE_REWARD: {   //襄阳战个人挑战奖更新
                let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
                if (vo) info.setRedState(evtType, vo.checkBattleRewardRedPoint() ? 1 : 0);
                break;
            }
        }
    }

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
    public initEvent() {
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

    }

    /**活动变动 */
    private onActivityChange(type: AcViewType) {
        if (type == AcViewType.THRONE) {
            RedPointModel.onRedPointEvtUpdate(RedEvtType.THRONE);
        }
    }

    /**首充 */
    public onfirstPayState() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.FIRST_RECHARGE);
    }

    /**月签到 */
    public onActivitySignMonth() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.SIGN_MONTH_DAY);
    }
    /**封王战 */
    public onActivityThrone() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.THRONE);
    }
    /**等级变化 */
    private onRoleLevel() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GROWTH_FUN);
    }
    /**成长基金 */
    private onActivityGrowthFun() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GROWTH_FUN);
    }
    /**一元购 */
    private onOneGiftBag() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.ONE_GIFT_BAG);
    }
    /**周卡月卡刷新 */
    private onActivityMoonCard() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CARD_MONTH);
    }

    /**7天登陆 */
    private onActivityLoginDay() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.LOGIN_DAY);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.LOGIN_DAY_2);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.LOGIN_DAY_3);
    }

    /**消费豪礼 */
    private onActivityConsumeGift() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CONSUME_GIFT);
    }

    /**单笔充值 */
    private onActivitySingleCharge() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_SINGLE);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_SINGLE_2);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_SINGLE_3);
    }

    /**累计充值 */
    private onActivityAddCharge() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_ADD);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_ADD_3);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_LIMIT_BUY);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.RECHARD_ADD_4);
    }
    /**幸运转盘 */
    private onActTurnTable() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TURNTABLE);
    }

    /**任务更新 */
    protected onMissionUpdate(data: IMissionEvt) {
        if (TaskType.Activity == data.type) {
            let vo = ActivityModel.getActivityVoById<AcTaskVo>(data.activityId);
            if (!vo) return;
            if (vo.viewType == AcViewType.OPEN_SEVEN) {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.OPEN_SEVEN);
            } else if (vo.viewType == AcViewType.NOR_SEVEN) {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.NOR_OPEN_SEVEN);
            }
            return;
        }
    }
    /**道具变动 */
    private onItemChange(itemId: number) {
        switch (itemId) {
            case PropEnum.TURNTABLE: {  //转盘道具
                this.onActTurnTable();
                break;
            }
            case PropEnum.XW: {  //信物
                RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_VIS);
                break;
            }

        }
    }

    /**新武将红点 */
    private newGenVis() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_VIS);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.NEW_GEN_LIMIT_BUY);
    }

    /**新7天聚宝盆红点 ,新春活动聚宝盆*/
    private newCor() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREASEURE_BOWL);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREASEURE_BOWL_2);
    }

    /**襄阳战个人挑战奖更新 */
    private playerRewardUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.PLAYER_BATTLE_REWARD);
    }

    /**---------------------------------------------------------------------------------------------------------------
    * 监听事件 end
    * ---------------------------------------------------------------------------------------------------------------
    */

    /**---------------------------------------------------------------------------------------------------------------
    * 注册延迟函数begin
    * ---------------------------------------------------------------------------------------------------------------
    */
    // protected registerEvent() {
    //     super.registerEvent();

    // }

    /**---------------------------------------------------------------------------------------------------------------
    * 注册延迟函数end
    * ---------------------------------------------------------------------------------------------------------------
    */
}