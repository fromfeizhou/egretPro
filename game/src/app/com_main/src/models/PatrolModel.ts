
/**
 * 挂机model
 * @class PatrolModel/**
 * 
 *
 * 
*/
class PatrolModel {
    public static randomGeneralList: gameProto.IPatrolRandomPlayer[];   //挂机行走角色
    public static randomGeneralIndex: number;

    public static info: gameProto.IPatrolInfo;   //挂机数据
    public static baseReward: IItemInfo[];   //挂机基础收益

    public static bInitTick: boolean;       //挂机定时器

    public static bInitHangView: boolean; //第一次进入主界面
    public static isAutoChallenge = false;  //自动挑战
    public static isInitFlyEnd: boolean = true;

    private static tickTimeDt: number;  //挂机间隔时间
    private static bossTimeRecord: number;      //boss时间记录

    private static lastTalkTime: number; //30秒内只弹对话框

    private static rewardGenInfo: { copyId: number, genId: number }[];    //武将奖励配置
    public static init() {
        this.bInitHangView = true;
        this.isAutoChallenge = false;
        this.isInitFlyEnd = true;
        this.randomGeneralIndex = 0;
        this.randomGeneralList = [];
        this.lastTalkTime = 0;
    }

    public static clear() {
        this.stopTick();
    }

    /**开启定时器 */
    public static startTick() {
        this.stopTick();
        Utils.TimerManager.doTimer(this.patrolTickTime * 1000, 0, this.onTickHandler, this);
    }

    /**关闭定时器 */
    public static stopTick() {
        Utils.TimerManager.remove(this.onTickHandler, this);
    }

    /**挂机定时器 */
    private static onTickHandler() {
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_TICK_UPDATE, null);
    }

    /**挂机时间片 */
    public static get patrolTickTime() {
        if (!this.tickTimeDt) {
            this.tickTimeDt = ConstUtil.getValue(IConstEnum.RECEIVE_TIME);
        }
        return this.tickTimeDt;
    }


    /**解析服务器数据 */
    public static parseData(info: gameProto.IPatrolInfo) {
        this.info = info;
        let reward = Utils.parseCommonItemServ(info.timeReward);
        if (this.baseReward) {
            if (this.baseReward[0].count != reward[0].count) {
                ScenePopQueWnd.addRewardWnd({ old: this.baseReward, new: reward });
            }
        }
        this.baseReward = reward;
        this.bossTimeRecord = TimerUtils.getServerTime();
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_INFO_UPDATE, null);
    }

    /**领取武将奖励 */
    public static parseRewardGen(data: gameProto.IS2C_PATROL_REWARD_GENERAL) {
        this.info.genInfo = data.info;
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_INFO_UPDATE, null);
    }
    /**领取挂机奖励 */
    public static parseRewardTime(){
        this.info.boxGetTime = TimerUtils.getServerTime();
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_INFO_UPDATE, null);
    }
    /**重置boss累计时间 */
    public static resetBossTime(bossTime:number = 0) {
        this.info.bossInfo.bossTime = bossTime;
        this.bossTimeRecord = TimerUtils.getServerTime();
        com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_BOSS_RESET, null);
    }

    /**获得boss数据 */
    public static getBossInfo() {
        return this.info.bossInfo;
    }

    /**能否挑战boss */
    public static canFightBoss(iswarn: boolean = false) {
        if (RoleData.level < this.info.levelLimit) {
            if (iswarn) EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.info.levelLimit), 1, true);
            return false;
        }

        return true;
    }


    /**
     * level
     * time 计算的时间  秒
     */
    public static calculateRewardSpeed(time: number = 3600, base?: IItemInfo[]): [number, number] {
        let silverSpeed = 0;
        let expSpeed = 0;
        base = base || PatrolModel.baseReward;
        for (let item of base) {
            let speed = item.count / this.patrolTickTime * time;
            if (item.itemId == PropEnum.SILVER) {
                silverSpeed = speed;
            } else {
                expSpeed = speed;
            }

        }
        let rate = 1 + VipModel.getPlayerPrivillByType(VipPrivillType.PATROL_REWARD_ADD_RATE);

        return [Math.floor(silverSpeed * rate), Math.floor(expSpeed * rate)];
    }

    /**=====================================================================================
     * 挂机武将形象 begin
     * =====================================================================================
     */

    /**
     * 随机武将列表
     */
    public static setRandomGeneralList(list) {
        this.randomGeneralList = list;
    }

    /**
     * 获取随机武将
     */
    public static getRandomGeneral() {
        if (this.randomGeneralList.length <= 0) {
            return null;
        }

        if (this.randomGeneralIndex >= this.randomGeneralList.length) {
            this.randomGeneralIndex = 0;
        }
        let g_info = this.randomGeneralList[this.randomGeneralIndex];
        this.randomGeneralIndex += 1;
        return g_info;
    }

    /**
     * 获取敌方攻击武将
     */
    public static getRandomEnemyList() {
        let list = this.info.npcMod.split(',');
        Utils.disorderArr(list);

        let retList = [];
        for (let i = 0; i < 3; i++) {
            retList.push(list[i]);
        }
        return retList;
    }


    /**=====================================================================================
     * 挂机武将形象 end
     * =====================================================================================
     */

    /**=====================================================================================
     * 配置表 begin
     * =====================================================================================
     */
    /**获得boss挑战时间 s */
    public static getBossTimeMax() {
        if(this.info.bossInfo && this.info.bossInfo.bossFirst){
            return ConstUtil.getValue(IConstEnum.PATROL_BOSS_CD_FIRST);
        }
        let data = NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS);
        let time = data.useCount + data.buyAmountCount;
        let nums = ConstUtil.getNumArray(IConstEnum.PATROL_BOSS_CD);
        if (time >= nums.length) return nums[nums.length - 1];
        return nums[time];
    }

    /**添加记录时间 */
    public static getBossTime() {
        let info = this.getBossInfo();
        if (info) {
            if(info.bossFirst) return  ConstUtil.getValue(IConstEnum.PATROL_BOSS_CD_FIRST);
            return info.bossTime + TimerUtils.getServerTime() - this.bossTimeRecord;
        }
        return 0;
    }


    /**能否领取武将 */
    public static isHasGenAward() {
        if (this.info.genInfo.rewardState == 1) return 1;
        return 0;
    }

    /**=====================================================================================
     * 配置表 end
     * =====================================================================================
     */


    /**挂机界面获取对话框内容 */
    public static getGeneralTalk(): string {
        let curTime = TimerUtils.getServerTime();
        if (curTime - PatrolModel.lastTalkTime > 30) {
            PatrolModel.lastTalkTime = curTime;
            let list: PatrolTalkConfig[] = [];

            for (let i in C.PatrolTalkConfig) {
                let config = C.PatrolTalkConfig[i];
                if (RoleData.level >= config.lowLevel && RoleData.level <= config.heightLevel) {
                    list.push(config);
                }
            }

            if (list.length) {
                return GLan(list[RandomUtils.getInstance().limitInteger(0, list.length - 1)].description);
            }
        }
        return null;
    }

}