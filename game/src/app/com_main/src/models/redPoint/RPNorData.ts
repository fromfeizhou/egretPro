/**
 * 通用红点
 **/
class RPNorData extends RPBaseData {

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
    /**是否关联事件 */
    public isInEvt(type: RedEvtType) {
        return true;
    }

    /**刷新红点 */
    public refreshView(info: RedPointView, evtType: RedEvtType) {
        super.refreshView(info, evtType);

        switch (evtType) {
            case RedEvtType.TASK: { //任务
                let num = MissionModel.getFinishMissionByType(info.param.taskType);
                info.setRedState(evtType, num);
                break;
            }
            case RedEvtType.TASK_ACTIVITY: {  //活跃度
                let num = MissionModel.getActivityBoxNum();
                info.setRedState(evtType, num);
                break;
            }

            case RedEvtType.TASK_COUNTRY: {   //国家任务
                let isComplete = CountryModel.isCompleteCountryTask(info.param.countryWorld, info.param.countryState);
                // if(isComplete)
                // isComplete = (!info.param.countryTaskType || info.param.countryTaskType == 0) ? isComplete : !isComplete;
                info.setRedState(evtType, isComplete ? 1 : 0);
                break;
            }
            case RedEvtType.TAX_COUNTRY: {   //国家税税收
                info.setRedState(evtType, RoleData.hasCityRevenue ? 1 : 0);
                break;
            }

            case RedEvtType.JOB_COUNTRY: {   //国家官职奖励
                info.setRedState(evtType, CountryModel.canAward() ? 1 : 0);
                break;
            }

            case RedEvtType.CITY_CHANGE_COUNTRY: {   //城市变更红点
                info.setRedState(evtType, CountryModel.getCityChangeRed() ? 1 : 0);
                break;
            }

            case RedEvtType.BAG_NEW: {  //背包新物品
                info.setRedState(evtType, PropModel.getNewPorpNum());
                break;
            }

            case RedEvtType.BOSS_SINGLE: {   //单人boss
                let state = BossModel.GetSingeBtnState(info.param.bossId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.BOSS_RANK: { //排名boss
                let state = BossModel.GetRankBtnState(info.param.bossId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.BOSS_WORLD: {    //世界boss
                let state = BossModel.GetWorldBtnState(info.param.bossId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

            case RedEvtType.CHAT: {        //聊天
                info.setRedState(evtType, ChatModel.getRedState(info.param.playerId));
                break;
            }

            case RedEvtType.PATROL: {   //挂机
                let state = PatrolModel.canFightBoss() || PatrolModel.isHasGenAward();
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

            case RedEvtType.TANVERN: {  //酒馆招募
                let isComplete = NormalModel.getTavernRedNum(info.param.tavenType);
                info.setRedState(evtType, isComplete ? 1 : 0);
                break;
            }

            case RedEvtType.MATER_WAR: {   //材料副本
                let state = MaterialModel.getCopyBtnState(info.param.materialEnum);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }
            case RedEvtType.CROSS_SERVER: {
                let isRed = CrossModel.crossServerRedPoint();
                info.setRedState(evtType, isRed ? 1 : 0);
                break;
            }
            case RedEvtType.TECHNO: {    //科技升级
                let state = TechnoModel.canUpLevel(info.param.teachType, info.param.teachId);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

            case RedEvtType.ARMS_TRAIN: {    //部队训练红点
                let state = TeamModel.checkCanTrain(info.param.armsType);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

            case RedEvtType.ARMS_GRADE: {  //部队进阶红点
                let state = TeamModel.checkCanUpgrade(info.param.armsType);
                info.setRedState(evtType, state ? 1 : 0);
                break;
            }

            case RedEvtType.QUE_BUILD: { //建造红点
                let state = MainMapModel.isMaxQueue();
                info.setRedState(evtType, state ? 0 : 1);
                break;
            }

            case RedEvtType.PVP_ARENA: { //竞技场红点
                info.setRedState(evtType, PvpArenaModel.getFightLeftTimes());
                break;
            }

            case RedEvtType.PASS_WAR: {    //过关斩将
                info.setRedState(evtType, ArenaModel.getFightLeftTimes());
                break;
            }

            case RedEvtType.HEAD_QUATER: { //章节副本
                info.setRedState(evtType, HeadQuartersModel.getRedState());
                break;
            }
            case RedEvtType.HISTORY_WAR: { //历史战役
                info.setRedState(evtType, HistoryBattleModel.getRedState());
                break;
            }

            case RedEvtType.VIP: {  //vip红点
                let state: boolean = VipModel.checkVipRedPoint();
                info.setRedState(evtType, state ? 1 : 0)
                break;
            }

            case RedEvtType.CORN: {   //聚宝盘次数红点
                let isComplete = CornucopiaModel.getCornucopiaFreeRed();
                info.setRedState(evtType, isComplete ? 1 : 0);
                break;
            }
            case RedEvtType.CORN_AWARD: {  //聚宝盆奖励
                let isComplete = CornucopiaModel.getGoldRushTimeRed();
                info.setRedState(evtType, isComplete ? 1 : 0);
                break;
            }
            case RedEvtType.MAIL: {      //邮件
                info.setRedState(evtType, MailModel.getRedMailNum(info.param.mailType));
                break;
            }
            case RedEvtType.EXPLOIT: {      //军功
                info.setRedState(evtType, WorldModel.checkExploitRedPoint());
                break
            }
            case RedEvtType.WARN: {      //警报红点
                info.setRedState(evtType, WorldModel.checkWarnRedPoint());
                break
            }
            case RedEvtType.ONLINE: {      //在线奖励
                info.setRedState(evtType, OnLineModel.getAwardState() ? 1 : 0);
                break
            }

            case RedEvtType.TEAM_CAMP: { //布阵红点
                info.setRedState(evtType, TeamModel.hasPVEEmptyPos() ? 1 : 0);
                break
            }
            case RedEvtType.GIFT_BAG: { //限时活动
                info.setRedState(evtType, GiftBagModel.getAwardState() ? 1 : 0);
                break
            }

            case RedEvtType.TREA_STRENG:    //宝物升级
            case RedEvtType.TREA_STAR:      //宝物升星
            case RedEvtType.TREA_INLAY: {   //宝物镶嵌
                info.setRedState(evtType, TreasureModel.getRedState(info.param.treaId, evtType));
                break;
            }
            case RedEvtType.BATTLE_KING_WORSHIP: {   //战争之王红点
                info.setRedState(evtType, WorshipModel.getRedStateByType(WorshipType.KING));
                break;
            }
            case RedEvtType.FIGHT_RANK_WORSHIP: {   //战争之王红点
                info.setRedState(evtType, WorshipModel.getRedStateByType(WorshipType.FIGHT_RANK));
                break;
            }

            case RedEvtType.WORLD_CITY_BUILD: {   //城池建造
                info.setRedState(evtType, CityBuildModel.getRedState(info.param.cityId));
                break;
            }

            case RedEvtType.CROSS_RANK_RY: {   //跨服战荣誉奖励
                info.setRedState(evtType, CrossModel.checkHonorBoxRedPoint() ? 1 : 0);
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
        // this.addDataEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);
        this.addDataEvent(NormalEvent.NORMAL_FUN_COUNT, this.onFunCount, this);
        // this.addDataEvent(RoleEvent.ROLE_RESOURCE, this.onResource, this);
        this.addDataEvent(RoleEvent.ROLE_LEVLE, this.onRoleLevel, this);
        this.addDataEvent(RoleEvent.ROLE_VIP_LEVLE, this.onVipLevel, this);

        this.addDataEvent(RoleEvent.ROLE_MILITARY_WEEK_EXP, this.onExploitExp, this);

        this.addDataEvent(TaskWorldEvent.EXPLOIT_AWARD_UPDATE, this.onExploitExp, this);

        this.addDataEvent(CornucopiaEvent.CORN_TIME_UPDATE, this.onCornTimeUpdate, this);

        this.addDataEvent(BuildEvent.BUILD_UP_LEVEL, this.onBuildUpLevel, this);
        this.addDataEvent(BuildEvent.BUILD_ACTIVATED, this.onBuildUpLevel, this);
        this.addDataEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.onTechnoInfoUpdate, this);
        this.addDataEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.onTechnoInfoUpdate, this);

        this.addDataEvent(VipEvent.VIP_UPDATE, this.onVipUpdate, this);
        this.addDataEvent(RoleEvent.ROLE_TAX, this.onTaxUpdate, this);
        this.addDataEvent(ArenaEvent.ARENA_UPDATE_NUM, this.onArenaUpdate, this);
        this.addDataEvent(PassWarEvent.PASS_WAR_UPDATE_FREE, this.onPassWarUpdate, this);

        this.addDataEvent(CrossWarEvent.CROSS_SERVER_STATUS, this.onCrossServerUpdate, this);


        this.addDataEvent(BuildEvent.SOLDIER_UPGRADE, this.onSoldierGrade, this);
        this.addDataEvent(BuildEvent.SOLDIER_TRAIN, this.onSoldierTrain, this);
        this.addDataEvent(BuildEvent.BUILD_QUEUE_CHANGE, this.onBuildQueChange, this);

        this.addDataEvent(MaterialEvent.MATERIAL_INFO_UPDATE, this.onMaterialUpdate, this);
        this.addDataEvent(TavernEvent.TAVERN_UPDATE_FREE, this.onTavernUpdateFree, this);
        this.addDataEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfoUpdate, this);

        // this.addDataEvent(BossEvent.BOSS_INFO_UPDATE, this.onBossInfoUpdate, this);
        this.addDataEvent(BagEvent.BAG_ITEM_ADD, this.onBagItem, this);
        this.addDataEvent(BagEvent.BAG_STATE_DEL, this.onBagItem, this);

        // this.addDataEvent(MissionEvent.MISSION_COUNTRY, this.onMissionCountry, this);
        this.addDataEvent(MissionEvent.MISSION_UPDATE_LIVENESS, this.onMissionLiveness, this);
        this.addDataEvent(MissionEvent.MISSION_ADD_INFO, this.onMissionUpdate, this);
        this.addDataEvent(MissionEvent.MISSION_DELETE_INFO, this.onMissionUpdate, this);
        this.addDataEvent(MissionEvent.MISSION_UPDATE_INFO, this.onMissionUpdate, this);

        this.addDataEvent(TaskWorldEvent.WARN_UPDATE, this.onWarnUpdate, this);

        this.addDataEvent(MailEvent.REFRESH_MAIL, this.onMailUpdate, this);
        this.addDataEvent(MailEvent.READ_MAIL, this.onMailUpdate, this);

        this.addDataEvent(OnLineEvent.ONLINE_UPDATE, this.onlineUpdate, this);
        this.addDataEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onWorldUpdateList, this);
        this.addDataEvent(ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE, this.giftBagUpdate, this);


        this.addDataEvent(ChatEvent.CHAT_MSG_PRI_CLEAR, this.onChatMsgClear, this);
        this.addDataEvent(ChatEvent.MSG_UPDATE, this.onMsgUpdate, this);
        this.addDataEvent(ChatEvent.MSG_STATE_UPDATE, this.onMsgUpdate, this);

        this.addDataEvent(GeneralEvent.GENERAL_GET, this.onGeneralGet, this);

        this.addDataEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onTreaLevelUpdate, this);
        this.addDataEvent(TreaEvent.TREA_STAR_UPDATE, this.onTreaStarUpdate, this);
        this.addDataEvent(TreaEvent.TREA_STONE_UPDATE, this.onTreaStoneUpdate, this);
        this.addDataEvent(TreaEvent.TREA_ADD, this.onTreaAdd, this);

        this.addDataEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.onWorldBuildUpdate, this);
        this.addDataEvent(TaskWorldEvent.CROSS_RANK_RY, this.onCrossRankRYUpdate, this);

        this.addDataEvent(CountryEvent.COUNTRY_SALARY_UPDATE, this.onJobCountry, this);
        this.addDataEvent(CountryEvent.CITY_CHANGE, this.onCityChange, this);



    }

    /**
     * 资源变动 
     * 频繁变动资源(银两 木材等) 不处理 
     * 执行间隔60秒 实时性不足 红点容易错乱显示
    */
    // private onResource(itemId: number) {
    //     if (PropEnum.ZML == itemId) {
    //         RedPointModel.onRedPointEvtUpdate(RedEvtType.TANVERN);
    //     }
    //     // if (itemId == PropEnum.SILVER) {
    //     //     this.addNorEvtInCaches(RedEvtType.ARMS_GRADE);
    //     //     this.addNorEvtInCaches(RedEvtType.TECHNO);
    //     // }
    // }

    /**道具变动 */
    // private onItemChange(itemId: number) {
    //     let cfg = C.ItemConfig[itemId];
    //     if (!cfg) return;

    //     switch (cfg.mainType) {
    //         case PropMainType.ARMY_GRADE: {  //升阶材料
    //             this.addNorEvtInCaches(RedEvtType.ARMS_GRADE);
    //             break;
    //         }
    //         case PropMainType.TREA_SOUL: {
    //             this.addNorEvtInCaches(RedEvtType.TREA_STAR);
    //             break;
    //         }
    //         case PropMainType.STONE: {
    //             this.addNorEvtInCaches(RedEvtType.TREA_INLAY);
    //             break;
    //         }
    //     }
    // }

    /**等级变动 */
    private onRoleLevel() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TEAM_CAMP);
    }

    /**功能次数变动 */
    private onFunCount(id: IFunCountEnum) {
        switch (id) {
            case IFunCountEnum.COPY_FREE_COUNT:
            case IFunCountEnum.HQ_HARD_FREE_COUNT: {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.HEAD_QUATER);
                com_main.EventMgr.dispatchEvent(QuarterEvent.QUARTER_UPDATE_NUM, null);
                break;
            }
            case IFunCountEnum.HISTORY_WAR_COUNT: {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.HISTORY_WAR);
                // com_main.EventMgr.dispatchEvent(QuarterEvent.QUARTER_UPDATE_NUM, null);
                break;
            }
            case IFunCountEnum.TREASURE_WASHBOWL_COUNT: {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.CORN);
                break;
            }
            case IFunCountEnum.PERSONAL_BOSS: {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.BOSS_SINGLE);
                break;
            }
            case IFunCountEnum.RANK_BOSS: {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.BOSS_RANK);
                break;
            }
            case IFunCountEnum.WORLD_BOSS: {
                RedPointModel.onRedPointEvtUpdate(RedEvtType.BOSS_WORLD);
                break;
            }
        }
    }

    /**更新城池建造 */
    private onWorldBuildUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.WORLD_CITY_BUILD);
    }

    /**更新荣誉奖励 */
    private onCrossRankRYUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CROSS_RANK_RY);
    }

    /**宝物获得 */
    private onTreaAdd() {
        // RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_STAR);
        // RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_INLAY);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_STRENG);
    }

    /**宝物升级 */
    private onTreaLevelUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_STRENG);
    }

    /**宝物升星 */
    private onTreaStarUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_STAR);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_INLAY);
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_STRENG);
    }

    /**宝物镶嵌 */
    private onTreaStoneUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TREA_INLAY);
    }

    private onCrossServerUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CROSS_SERVER);
    }
    /**私聊对象消息清理*/
    private onChatMsgClear(playerId: number) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CHAT);
    }

    /**消息增加 */
    private onMsgUpdate(data: { channel: ChatType, vo: ChatVo, targetId?: number }) {
        if (!data || data.channel == ChatType.PRIVATE) {
            RedPointModel.onRedPointEvtUpdate(RedEvtType.CHAT);
        }
    }

    /**上阵变动 */
    private onWorldUpdateList(vo: TeamVo) {
        if (vo.teamType == TeamType.PVE)
            RedPointModel.onRedPointEvtUpdate(RedEvtType.TEAM_CAMP);
    }

    /**在线奖励刷新 */
    private onlineUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.ONLINE);
    }
    /**限时活动刷新 */
    private giftBagUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.GIFT_BAG);
    }

    /**武将获得 */
    private onGeneralGet(generalId) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TEAM_CAMP);
    }

    /**邮件 */
    private onMailUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.MAIL);
    }

    /**vip等级 */
    private onVipLevel(itemId: number) {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.VIP);
    }

    /**军功经验 */
    private onExploitExp() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.EXPLOIT);
    }


    /**任务更新 */
    private onMissionUpdate(data: IMissionEvt) {
        if (TaskType.Country == data.type || TaskType.CountryRepeat == data.type) {
            RedPointModel.onRedPointEvtUpdate(RedEvtType.TASK_COUNTRY);
            return;
        }

        RedPointModel.onRedPointEvtUpdate(RedEvtType.TASK);
    }

    /**警报红点 */
    private onWarnUpdate(data: any) {

        RedPointModel.onRedPointEvtUpdate(RedEvtType.WARN);
    }
    /**活跃度 */
    private onMissionLiveness() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TASK_ACTIVITY);
    }

    /**国家任务 */
    private onMissionCountry() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TASK_COUNTRY);
    }

    /**背包道具 */
    private onBagItem() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.BAG_NEW);
    }

    /**挂机 */
    private onPatrolInfoUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.PATROL);
    }

    /**酒馆招募免费次数 */
    private onTavernUpdateFree() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TANVERN);
    }

    /**材料副本 */
    private onMaterialUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.MATER_WAR);
    }

    /**建筑建造 */
    private onBuildQueChange() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.QUE_BUILD);
    }

    /**士兵训练 */
    private onSoldierTrain() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.ARMS_TRAIN);
    }
    /**士兵进阶 */
    private onSoldierGrade() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.ARMS_GRADE);
    }

    /**过关斩将更新 */
    public onPassWarUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.PASS_WAR);
    }

    /**竞技场次数更新 */
    public onArenaUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.PVP_ARENA);
    }

    /**vip更新 */
    public onVipUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.VIP);
    }
    /**税收更新 */
    public onTaxUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TAX_COUNTRY);
    }
    /**科技更新 */
    public onTechnoInfoUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.TECHNO);
    }

    /**建筑升级|解锁 */
    public onBuildUpLevel(buildId: MBuildId) {
        if (buildId == MBuildId.KJ) {
            RedPointModel.onRedPointEvtUpdate(RedEvtType.TECHNO);
        }
    }

    /**聚宝盆领奖刷新 */
    private onCornTimeUpdate() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CORN_AWARD);
    }

    /**国家官职奖励 */
    private onJobCountry() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.JOB_COUNTRY);
    }

    /**国家情报 */
    private onCityChange() {
        RedPointModel.onRedPointEvtUpdate(RedEvtType.CITY_CHANGE_COUNTRY);
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