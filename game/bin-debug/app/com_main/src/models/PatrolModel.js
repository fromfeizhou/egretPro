/**
 * 挂机model
 * @class PatrolModel/**
 *
 *
 *
*/
var PatrolModel = /** @class */ (function () {
    function PatrolModel() {
    }
    PatrolModel.init = function () {
        this.bInitHangView = true;
        this.isAutoChallenge = false;
        this.isInitFlyEnd = true;
        this.randomGeneralIndex = 0;
        this.randomGeneralList = [];
        this.lastTalkTime = 0;
    };
    PatrolModel.clear = function () {
        this.stopTick();
    };
    /**开启定时器 */
    PatrolModel.startTick = function () {
        this.stopTick();
        Utils.TimerManager.doTimer(this.patrolTickTime * 1000, 0, this.onTickHandler, this);
    };
    /**关闭定时器 */
    PatrolModel.stopTick = function () {
        Utils.TimerManager.remove(this.onTickHandler, this);
    };
    /**挂机定时器 */
    PatrolModel.onTickHandler = function () {
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_TICK_UPDATE, null);
    };
    Object.defineProperty(PatrolModel, "patrolTickTime", {
        /**挂机时间片 */
        get: function () {
            if (!this.tickTimeDt) {
                this.tickTimeDt = ConstUtil.getValue(IConstEnum.RECEIVE_TIME);
            }
            return this.tickTimeDt;
        },
        enumerable: true,
        configurable: true
    });
    /**解析服务器数据 */
    PatrolModel.parseData = function (info) {
        this.info = info;
        var reward = Utils.parseCommonItemServ(info.timeReward);
        if (this.baseReward) {
            if (this.baseReward[0].count != reward[0].count) {
                ScenePopQueWnd.addRewardWnd({ old: this.baseReward, new: reward });
            }
        }
        this.baseReward = reward;
        this.bossTimeRecord = TimerUtils.getServerTime();
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_INFO_UPDATE, null);
    };
    /**领取武将奖励 */
    PatrolModel.parseRewardGen = function (data) {
        this.info.genInfo = data.info;
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_INFO_UPDATE, null);
    };
    /**领取挂机奖励 */
    PatrolModel.parseRewardTime = function () {
        this.info.boxGetTime = TimerUtils.getServerTime();
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_INFO_UPDATE, null);
    };
    /**重置boss累计时间 */
    PatrolModel.resetBossTime = function (bossTime) {
        if (bossTime === void 0) { bossTime = 0; }
        this.info.bossInfo.bossTime = bossTime;
        this.bossTimeRecord = TimerUtils.getServerTime();
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_BOSS_RESET, null);
    };
    /**获得boss数据 */
    PatrolModel.getBossInfo = function () {
        return this.info.bossInfo;
    };
    /**能否挑战boss */
    PatrolModel.canFightBoss = function (iswarn) {
        if (iswarn === void 0) { iswarn = false; }
        if (RoleData.level < this.info.levelLimit) {
            if (iswarn)
                EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.info.levelLimit), 1, true);
            return false;
        }
        return true;
    };
    /**
     * level
     * time 计算的时间  秒
     */
    PatrolModel.calculateRewardSpeed = function (time, base) {
        if (time === void 0) { time = 3600; }
        var silverSpeed = 0;
        var expSpeed = 0;
        base = base || PatrolModel.baseReward;
        for (var _i = 0, base_1 = base; _i < base_1.length; _i++) {
            var item = base_1[_i];
            var speed = item.count / this.patrolTickTime * time;
            if (item.itemId == PropEnum.SILVER) {
                silverSpeed = speed;
            }
            else {
                expSpeed = speed;
            }
        }
        var rate = 1 + VipModel.getPlayerPrivillByType(VipPrivillType.PATROL_REWARD_ADD_RATE);
        return [Math.floor(silverSpeed * rate), Math.floor(expSpeed * rate)];
    };
    /**=====================================================================================
     * 挂机武将形象 begin
     * =====================================================================================
     */
    /**
     * 随机武将列表
     */
    PatrolModel.setRandomGeneralList = function (list) {
        this.randomGeneralList = list;
    };
    /**
     * 获取随机武将
     */
    PatrolModel.getRandomGeneral = function () {
        if (this.randomGeneralList.length <= 0) {
            return null;
        }
        if (this.randomGeneralIndex >= this.randomGeneralList.length) {
            this.randomGeneralIndex = 0;
        }
        var g_info = this.randomGeneralList[this.randomGeneralIndex];
        this.randomGeneralIndex += 1;
        return g_info;
    };
    /**
     * 获取敌方攻击武将
     */
    PatrolModel.getRandomEnemyList = function () {
        var list = this.info.npcMod.split(',');
        Utils.disorderArr(list);
        var retList = [];
        for (var i = 0; i < 3; i++) {
            retList.push(list[i]);
        }
        return retList;
    };
    /**=====================================================================================
     * 挂机武将形象 end
     * =====================================================================================
     */
    /**=====================================================================================
     * 配置表 begin
     * =====================================================================================
     */
    /**获得boss挑战时间 s */
    PatrolModel.getBossTimeMax = function () {
        if (this.info.bossInfo && this.info.bossInfo.bossFirst) {
            return ConstUtil.getValue(IConstEnum.PATROL_BOSS_CD_FIRST);
        }
        var data = NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS);
        var time = data.useCount + data.buyAmountCount;
        var nums = ConstUtil.getNumArray(IConstEnum.PATROL_BOSS_CD);
        if (time >= nums.length)
            return nums[nums.length - 1];
        return nums[time];
    };
    /**添加记录时间 */
    PatrolModel.getBossTime = function () {
        var info = this.getBossInfo();
        if (info) {
            if (info.bossFirst)
                return ConstUtil.getValue(IConstEnum.PATROL_BOSS_CD_FIRST);
            return info.bossTime + TimerUtils.getServerTime() - this.bossTimeRecord;
        }
        return 0;
    };
    /**能否领取武将 */
    PatrolModel.isHasGenAward = function () {
        if (this.info.genInfo.rewardState == 1)
            return 1;
        return 0;
    };
    /**=====================================================================================
     * 配置表 end
     * =====================================================================================
     */
    /**挂机界面获取对话框内容 */
    PatrolModel.getGeneralTalk = function () {
        var curTime = TimerUtils.getServerTime();
        if (curTime - PatrolModel.lastTalkTime > 30) {
            PatrolModel.lastTalkTime = curTime;
            var list = [];
            for (var i in C.PatrolTalkConfig) {
                var config = C.PatrolTalkConfig[i];
                if (RoleData.level >= config.lowLevel && RoleData.level <= config.heightLevel) {
                    list.push(config);
                }
            }
            if (list.length) {
                return GLan(list[RandomUtils.getInstance().limitInteger(0, list.length - 1)].description);
            }
        }
        return null;
    };
    PatrolModel.isAutoChallenge = false; //自动挑战
    PatrolModel.isInitFlyEnd = true;
    return PatrolModel;
}());
