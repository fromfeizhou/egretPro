
/**红点数据刷新类型 */
enum RedEvtType {
    /**武将收集 */
    GEN_COLLECT = 1001,
    /**武将升星 */
    GEN_STAR = 1002,
    /**武将技能升级 */
    GEN_SKILL = 1003,
    /** 武将可装备*/
    GEN_EQUIP = 1004,
    /** 武将装备升级*/
    GEN_EQ_LV = 1005,
    /** 武将装备升阶*/
    GEN_EQ_GRADE = 1006,
    /** 武将装备精炼*/
    GEN_EQ_WROUGHT = 1007,
    /**武将升级 */
    GEN_LEVEL = 1008,
    /**武将突破 */
    GEN_TUPODAN = 1009,
    /**武将宝物装配 */
    GEN_TREA_EQ = 1010,
    /**武将缘分 */
    GEN_FATE = 1011,

    /**活跃度宝箱 */
    TASK_ACTIVITY = 2001,
    /**任务 */
    TASK = 2002,

    /**背包 */
    BAG_NEW = 3001,

    /**国家任务 */
    TASK_COUNTRY = 4001,
    /**国家税收 */
    TAX_COUNTRY = 4002,
    /**国家官职 俸禄红点*/
    JOB_COUNTRY = 4003,
    /**城池更换红点 */
    CITY_CHANGE_COUNTRY = 4004,

    /**聊天 */
    CHAT = 5001,

    /**宝物装备 */
    TREA_EQUIP = 6001,
    /**宝物升级 */
    TREA_STRENG = 6002,
    /**宝物升星 */
    TREA_STAR = 6003,
    /**宝物镶嵌 */
    TREA_INLAY = 6004,

    /**血战群雄个人boss挑战 */
    BOSS_SINGLE = 8001,
    /**血战群雄排名boss挑战 */
    BOSS_RANK = 8002,
    /**血战群雄世界boss挑战 */
    BOSS_WORLD = 8003,

    /**装备合成 */
    EQUIP_COMPOSE = 9001,

    /**材料副本 */
    MATER_WAR = 10001,

    /**科技升级 */
    TECHNO = 11001,
    /**酒馆招募*/
    TANVERN = 12001,

    /**建造红点 */

    QUE_BUILD = 13001,
    /**竞技场红点 */
    PVP_ARENA = 13002,
    /**过关斩将 */
    PASS_WAR = 13003,
    /**章节副本 */
    HEAD_QUATER = 13004,
    /**历史战役红点 */
    HISTORY_WAR = 13005,
    /**警报红点 */
    WARN = 14001,

    /**挂机红点 */
    PATROL = 15001,

    /**部队训练红点 */
    ARMS_TRAIN = 16001,
    /**部队进阶红点 */
    ARMS_GRADE = 16002,

    /**聚宝盆免费次数 */
    CORN = 17001,
    /**聚宝盆领元宝 */
    CORN_AWARD = 17002,

    /**vip红点 */
    VIP = 18001,
    /**邮件 */
    MAIL = 19001,

    /**军功红点 */
    EXPLOIT = 20001,

    /**在线红点 */
    ONLINE = 30001,

    /**开服7天活动红点 */
    OPEN_SEVEN = 31001,
    /**循环7天活动红点 */
    NOR_OPEN_SEVEN = 31002,
    /**周卡月卡 */
    CARD_MONTH = 31003,
    /**累计充值 */
    RECHARD_ADD = 31004,
    /**单笔充值 */
    RECHARD_SINGLE = 31005,
    /**消费豪礼 */
    CONSUME_GIFT = 31006,
    /**7天登录活动 */
    LOGIN_DAY = 31007,
    /**成长基金 */
    GROWTH_FUN = 31008,
    /**月签到 */
    SIGN_MONTH_DAY = 31009,
    /**封王战 */
    THRONE = 31010,
    /**首充 */
    FIRST_RECHARGE = 31011,
    /**一元购 */
    ONE_GIFT_BAG = 31012,
    /**限时活动 */
    GIFT_BAG = 31013,
    /**襄阳战 */
    XIANGYANG = 31014,
    /**转盘红点 */
    TURNTABLE = 31015,
    /**跨服战 */
    CROSS_SERVER = 31016,
    /**布阵红点 */
    TEAM_CAMP = 32001,
    /**战争之王红点 */
    BATTLE_KING_WORSHIP = 33001,
    /**战力排行红点 */
    FIGHT_RANK_WORSHIP = 33002,
    /**单笔充值2 */
    RECHARD_SINGLE_2 = 33003,
    /**累计充值3 */
    RECHARD_ADD_3 = 33004,
    /**新武将拜访 */
    NEW_GEN_VIS = 33005,
    /**新武将限购 */
    NEW_GEN_LIMIT_BUY = 33006,
    /**新7天登录 */
    LOGIN_DAY_2 = 33007,
    /**新7天聚宝盆 */
    TREASEURE_BOWL = 33008,
    /**城池建设完成 */
    WORLD_CITY_BUILD = 33009,
    /**个人挑战奖 */
    PLAYER_BATTLE_REWARD = 33010,
    /**荣誉累计奖励 */
    CROSS_RANK_RY = 33011,

    /**新春活动：新7天登录 */
    LOGIN_DAY_3 = 33012,
    /**新春活动：单笔充值2 */
    RECHARD_SINGLE_3 = 33013,
    /**新春活动：累计充值4 */
    RECHARD_ADD_4 = 33014,
    /**新春活动：聚宝盆 */
    TREASEURE_BOWL_2 = 33015,
}

interface IRedOffset {
    x: number,
    y: number,
    scale?: number,
}


/**红点ui额外参数 */
interface IRedViewParam {
    /**武将id */
    generalId?: number;
    /**技能id */
    skillId?: number;

    /**任务类型 */
    taskType?: TaskType;

    /**boss红点id */
    bossId?: number;

    /**聊天类型 */
    chatType?: ChatType;
    /**国家任务 0 读取可领 1读取不可领*/
    countryState?: number;
    /*是否关联世界*/
    countryWorld?: boolean;

    /**酒馆招募类型 */
    tavenType?: number;

    /**材料副本枚举 */
    materialEnum?: MaterialEnum;

    /**科技类型 */
    teachType?: TechnoType;
    /**科技id */
    teachId?: number;
    /**部队类型 */
    armsType?: SoldierMainType

    /**邮件类型 */
    mailType?: MailType;

    /**开服7天活动 7天活动 */
    dayAc?: number;
    dayTaskId?: number;

    /**玩家id */
    playerId?: number;

    /**宝物id */
    treaId?: number;

    /**城池id */
    cityId?: number;
}
/**红点活动ui额外参数 */
interface IRedActParam {
    /*精彩活动 */
    splendid?: number;
}

/**红点系统
 * 说明：武将红点 关联数据多 为减少逻辑判断次数 创建数据结构 记录保存对应的红点状态
 */
class RedPointModel {
    private static CACHE_NORMAL_TYPE = -1;    //与红点类型区分 作为通用延迟调用类型

    public static infoList: { [key: number]: RedPointView };  //红点列表
    public static infoTypeToList: { [key: number]: RedPointView[] }; //红点列表 按事件存储

    private static generalData: RPGenData;
    private static normalData: RPNorData;
    private static activityData: RPAcData;
    private static laterCalls: RedEvtType[];
    public static init() {
        this.infoList = {};
        this.infoTypeToList = {};
        this.generalData = new RPGenData();
        this.normalData = new RPNorData();
        this.activityData = new RPAcData();

        // Utils.TimerManager.doTimer(60000, 0, this.doEvtTypeCachesCall, this)
    }


    public static clear() {
        this.laterCalls = null;
        Utils.TimerManager.remove(this.laterCallAction, this);
        // Utils.TimerManager.remove(this.doEvtTypeCachesCall, this)
        this.infoList = null;
        this.infoTypeToList = null;
        if (this.generalData) {
            this.generalData.clear();
            this.generalData = null;
        }
        if (this.normalData) {
            this.normalData.clear();
            this.normalData = null;
        }
        if (this.activityData) {
            this.activityData.clear();
            this.activityData = null;
        }
    }

    /**延迟执行刷新 */
    // private static doEvtTypeCachesCall() {
    //     if (this.generalData) this.generalData.doEvtTypeCachesCall();
    //     if (this.normalData) this.normalData.doEvtTypeCachesCall();
    //     if (this.activityData) this.activityData.doEvtTypeCachesCall();
    // }

    /**创建红点监听(销毁对象必须移除监听)
     * @param thisObj 监听节点(事件移除 绑定对象)
     * @param container 红点容器
     * @param offset 红点偏移
     * @param type 数据刷新类型
     * @param evtType 红点类型数组
     * @param viewType 红点显示类型（箭头 - 箭头 + 数字 -  圆点等）
     * @param param 附加参数
     */
    public static AddInfoListener(container: egret.DisplayObjectContainer, offset: IRedOffset, evtType: RedEvtType[], viewType: number = 1, param: IRedViewParam = {}, isAutoRemove: boolean = true) {
        if (isNull(container)) return;
        let key = container.hashCode;
        if (isNull(this.infoList[key])) {
            let info = new RedPointView(container, offset, evtType, viewType, param);
            this.infoList[key] = info;

            for (let i = 0; i < evtType.length; i++) {
                let type = evtType[i];
                this.addRedInfoInList(type, info);
                this.updateRedPoint(info, type);
            }
            if (isAutoRemove && !container['$redPointClear']) {
                //移除函数 挂钩新内容
                container['$redPointClear'] = true;
                let removeFunc = container.$onRemoveFromStage.bind(container);
                container.$onRemoveFromStage = function () {
                    if (!container) return;
                    RedPointModel.RemoveInfoListenerByCode(container.hashCode);
                    removeFunc();
                }
            }

        } else {
            let info = this.infoList[key];
            /**过滤新旧事件 */
            if (JSON.stringify(info.evtType) != JSON.stringify(evtType)) {
                for (let i = 0; i < info.evtType.length; i++) {
                    let type = info.evtType[i];
                    if (evtType.indexOf(type) == -1) {
                        this.removeRedInfoInList(key, type);
                    }
                }

                for (let i = 0; i < evtType.length; i++) {
                    let type = evtType[i];
                    if (info.evtType.indexOf(type) == -1) {
                        this.addRedInfoInList(type, info);
                    }
                }
            }
            info.resetData(evtType, param);
            for (let i = 0; i < evtType.length; i++) {
                let type = evtType[i];
                this.updateRedPoint(info, type);
            }
        }
    }

    /**
     * 节点移除会自动调用(默认创建方式自动移除 不需要手动移除)
     * 根据code 移除红点监听 【code码 为AddInfoListener传入的节点的code吗】
     * */
    public static RemoveInfoListenerByCode(code: number) {
        if (this.infoList && this.infoList[code]) {
            let info = this.infoList[code];
            for (let i = 0; i < info.evtType.length; i++) {
                this.removeRedInfoInList(code, info.evtType[i]);
            }
            info.destroy();
            delete this.infoList[code];
        }
    }

    /**在列表中移除对象 */
    private static removeRedInfoInList(code: number, evtType: RedEvtType) {
        let list = this.infoTypeToList[evtType];
        if (!list) return;

        for (let k = list.length - 1; k >= 0; k--) {
            if (list[k] && list[k].code == code) {
                list.splice(k, 1);
                break;
            }
        }
    }
    /**在列表中添加对象 */
    private static addRedInfoInList(evtType: RedEvtType, info: RedPointView) {
        if (isNull(this.infoTypeToList[evtType])) this.infoTypeToList[evtType] = [];
        this.infoTypeToList[evtType].push(info);
    }


    /**
     * 注意：RPBase等 继承者 调用
     * */
    public static onRedPointEvtUpdate(evtType: RedEvtType) {
        if (!this.laterCalls) {
            this.laterCalls = [];
            this.laterCalls.push(evtType);
            Utils.TimerManager.doTimer(500, 1, this.laterCallAction, this)
            return;
        }
        if (this.laterCalls.indexOf(evtType) >= 0) return;

        this.laterCalls.push(evtType);
    }

    /**延迟刷新红点ui */
    private static laterCallAction() {
        for (let i = 0; i < this.laterCalls.length; i++) {
            let evtType = this.laterCalls[i];
            let list = this.infoTypeToList[evtType];
            if (!list || list.length == 0) {
                continue;
            }
            for (let i = 0; i < list.length; i++) {
                let info = list[i];
                this.updateRedPoint(info, evtType);
            }
        }
        this.laterCalls = null;
    }

    /**刷新红点 */
    private static updateRedPoint(info: RedPointView, evtType: RedEvtType) {
        if (this.generalData.isInEvt(evtType)) {
            this.generalData.refreshView(info, evtType);
            return;
        }

        this.activityData.refreshView(info, evtType);
        this.normalData.refreshView(info, evtType);
    }


    /**================================================================================================================
    * 武将红点隐藏/开启 begin
    * ================================================================================================================
    */

    /**拥有 */
    public static hasGeneralInfo(id: number) {
        return this.generalData.hasGeneralInfo(id);
    }

    /**隐藏提示 */
    public static removeGeneralInfo(id: number) {
        this.generalData.removeGeneralInfo(id);
    }

    /**添加提示 */
    public static addGeneralInfo(id: number) {
        this.generalData.addGeneralInfo(id);
    }

    /**获得武将红点列表 */
    public static getGenStateList() {
        return this.generalData.getGenStateList();
    }

    /**获得需要记录的武将红点列表id */
    public static getRedGenIds() {
        let list = this.getGenStateList();
        let res: number[] = [];
        for (let id in list) {
            res.push(Number(id));
        }
        return res;
    }

    /**================================================================================================================
     * 武将红点隐藏/开启 end
     * ================================================================================================================
     */




}