/**世界地图事件 */
interface ItfEventObject {
    /**事件id */
    id?: number,
    /**武将ids */
    readonly gid: number[],
    /**出发点 */
    from: number,
    /**目的地 */
    to: number,
    /**通过的城池点 */
    through?: number[],
    /**类形(0:资源点,1:城市) */
    readonly type: number,
    /**状态 */
    status: number,
    /**结束时间 */
    dt?: number,
    /**移动类型前往1/返回2 */
    mt?: EumWorldEventMoveType,
    /**0:自己，1:盟友，2:敌人 */
    trpsType?: number,
    /**玩家名字 */
    playerName?: string,
    /**玩家国家 1-魏 2-蜀 3-吴 */
    countryId?: number,
    /**主武将id */
    mainGid?: number,
    /**部队ID */
    armyId?: number,
    /**兵力 */
    batt?: number,
}

/**英雄状态 */
interface ItfHeroStatus {
    /**英雄ID */
    id: number,
    /**状态 */
    status: EumWorldHeroStatus,
    /**城池位置 */
    pos: number,
    /**目标位置 */
    target?: number,
}

/**资源类型 */
interface ItfResType {
    /**资源事件id */
    readonly id: number,
    /**资源位置id */
    readonly pid: number
}

/**拜访事件 */
interface ItfVisitEvent {
    /**城池id */
    readonly id: number,
    /**事件类型 */
    readonly type: number,
    /**物品id */
    readonly itemid: number,
    /**物品数量 */
    readonly num: number,
    /**正在拜访的英雄 */
    gid?: number,
}

/**攻击事件 */
interface ItfAttackEvent {
    /**id */
    readonly id: number,
    /**位置 */
    readonly pos: number,
    /**结束时间 */
    readonly dt: number,
    /**武将 */
    readonly gid: number[],
    /**类型(0:资源点,1:城市) */
    readonly type: number,
    /**战场id */
    battleId?: number,
    /**资源配置 */
    conf?: ItfResType,
}
/**
 * 刷新事件
 */
interface IResEventRefresh {
    totalTime: number;//累计时间
    confTime: number;//配置的刷新时间
}
/**战场城池信息 */
interface ItfSiegeCity {
    /**城池id */
    readonly cityId: number,
    /**攻击方信息 */
    atkList?: number[],
    /**攻方剩余部队 */
    atkRemainQueue?: number,
    /**攻方死亡数量 */
    atkDead?: number,
    /**防守方信息 */
    defList?: number[],
    /**防守方剩余部队 */
    defRemainQueue?: number,
    /**防守方死亡数量 */
    defDead?: number,
}

/**战场列表信息 */
interface ItfSiegeEvent {
    /**id */
    readonly id: number,
    /**城池id */
    readonly cityId: number,
    /**国家id */
    readonly countryId: number,
    /**玩家id */
    readonly playerId: number,
    /**玩家名字 */
    readonly playerName: string,
    /**主武将 */
    readonly mainGid: number,
    /**部队数量 */
    readonly number: number,
    /**战场id */
    battleId?: number,
    /**前一个Sid */
    preSid?: number,
    /**战斗力 */
    fight?: number,
    /**0:攻击,1:防守 */
    type?: number,
    /**NPCid */
    cpId?: number,
    /**所有武将ID */
    gids?: number[],
    /**上一场的战斗id */
    perBattleId?: number,
}

/**攻城结果 */
interface ItfSiegeResult {
    /**是否跨服战 */
    readonly isCross: boolean,
    /**是否攻击方（跨服战用） */
    readonly isAttack:boolean;
    /**城池ID */
    readonly cityId: number,
    /**攻方国家ID */
    readonly atkCountry: number,
    /**防守国家ID */
    readonly defCountry: number,
    /**0:攻方胜,1:防守胜 */
    readonly result: number,
    /**攻方剩余部队 */
    atkRemainQueue?: number,
    /**攻方死亡数量 */
    atkDead?: number,
    /**防守方剩余部队 */
    defRemainQueue?: number,
    /**防守方死亡数量 */
    defDead?: number,
    /**玩家个人杀敌 */
    roleKillNum?: number,
    /**玩家个人损伤 */
    roleLostNum?: number,
    /**玩家个人战功 */
    roleFight?: number,
}
/**攻城个人基本信息 */
interface ItfSiegeBase {
    /**城池ID */
    cityId: number,
    /**玩家Id */
    roleId: number,
    /**主武将 */
    mainGid: number,
    /**战场id */
    battleId: number,
    /**队伍id */
    teamId: number,
    // /**所有武将 */
    // gids: number[],
    // /**排队位置 */
    // pos?: number,
    // /**上一场的战斗id */
    // perBattleId?: number,
}

/**警报内容 */
interface ItfWarnItem {
    /**城池ID */
    readonly cityId: number,
    /**配置表id */
    pid: EumWarnType,
    /**内容 */
    content: number[],
    /**结束时间 */
    dt: number,
    /**开始时间 */
    startdt: number,
}

class ItfSiegeKill {
    /**名字 */
    playerName: string;
    /**ID */
    id: number;
    /**杀敌数 */
    num: number;
    /**排名 */
    rank: number;
    /**国家 */
    countryId: number;
    /**类型 */
    type: EumSiegeKillType;
}

/**客户端移动事件 */
interface IClientMoveEt {
    /**队伍id */
    teamId: number;
    /**起始时间 */
    startTime: number;
    /**结束时间 */
    endTime: number;
    /**事件位置 */
    evtPosId: number;
    /**事件id */
    evtDataId: number; 
    /**是否是反向移动 */
    isBack: boolean;
}

//===============================ENUM====================================
/**英雄状态 */
const enum EumWorldHeroStatus {
    /**行军中 */
    WALK,
    /**闲置中 */
    NORMAL,
    /**其它事件中 */
    OCCUPIED,
}

const enum EumWorldEventMoveType {
    /**前往 */
    GO = 1,
    /**返回 */
    BACK = 2,
}

/**警报类型 */
const enum EumWarnType {
    /**我方集结 */
    ATTACK = 1,
    /**敌方集结 */
    ATTACK_ENEMY = 2,
    /**我方攻城中 */
    ATTACKING = 3,
    /**敌方攻城中 */
    ATTACKING_ENEMY = 4,
    /**其它攻城 */
    ATTACK_OTHER = 5,
}

const enum EumSiegeKillType {
    PLAYER,
    ALLY,
}

/**建筑状态 */
enum BuildEffectType {
    NONE = 0,//没状态
    NOT_TO_ATTACK = 1,//（敌国建筑）我国不可攻打
    CAN_ATTACK = 2,//（敌国建筑）除国家任务外我国可攻打
    BE_ATTACK = 3,//（我国建筑-显示摧毁图标）除国家任务外我方被攻击状态
    ORTHER_ATTACK = 4,//（敌国建筑）敌方开战状态（另外2国的战斗）
    ATTACK = 5,//（敌国建筑-显示攻击图标）国家任务攻击状态
    DEFEND = 6,//（我国建筑-显示防守图标）国家任务防守状态
    BuildING = 7,//重建状态：buildCD>当前时间
    Raid = 8,//偷袭状态
}

/**
 * 解锁枚举
 */
enum WorldLockTaskType {
    SOURCE = 1,//消耗资源
    FIGHT = 2,//战斗
}
/**
 * 解锁任务阶段
 */
enum WorldLockTaskStep {
    STATR = 1,//开始阶段
    FINISH = 2,//结束阶段
}
/**世界事件类型 */
enum WorldEventType {
    NONE = 0,
    RES_COLLECT = 1,//资源采集
    RES_GATHER = 2,//资源收集
    FIGHT = 3,//战斗
    VISIT = 4,  //城池拜访 (客户端占用)
    MOVE = 100,     //事件移动
}

/**世界事件枚举
 */
enum WorldEventResType {
    FOOD = 1,       //粮田
    IRON = 2,       //矿场
    SLIVER = 3,     //银矿
    WOOD = 4,       //林场
    WUGUAN = 5,     //武馆修炼
    YINSHI = 6,     //隐士学习
}

/**
 * 城池类型
 */
enum CityType {
    COMMON = 0,//普通
    KIING_BATTLE,//封王战城
    BIRTH,//出生城
    EMPEROR_BATTLE,//帝王战城
    XIANG_GATE,//襄阳战城门
    XIANG_HALL,//襄阳战大殿
    XIANG_BIRTH,//襄阳战出生城
}
enum CityLevel {
    CAPITAL = 1,//都城
    TOWN,//郡城
    COUNTY,//县城
}

/**城池武将建造状态 */
enum CityBuildEnum {
    DONE = 1,
    FREE = 2,
    BUILDING = 3
};
