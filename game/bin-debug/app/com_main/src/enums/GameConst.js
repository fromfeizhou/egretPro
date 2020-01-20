// -----------------------------------------------------------------------------------
/**八方向角度值 */
var ActorDirAngle;
(function (ActorDirAngle) {
    ActorDirAngle[ActorDirAngle["Up"] = -90] = "Up";
    ActorDirAngle[ActorDirAngle["Down"] = 90] = "Down";
    ActorDirAngle[ActorDirAngle["Left"] = 180] = "Left";
    ActorDirAngle[ActorDirAngle["LeftUp"] = -135] = "LeftUp";
    ActorDirAngle[ActorDirAngle["LeftDown"] = 135] = "LeftDown";
    ActorDirAngle[ActorDirAngle["Right"] = 0] = "Right";
    ActorDirAngle[ActorDirAngle["RightUp"] = -45] = "RightUp";
    ActorDirAngle[ActorDirAngle["RightDown"] = 45] = "RightDown";
})(ActorDirAngle || (ActorDirAngle = {}));
/** 动作状态 */
var AnimalState;
(function (AnimalState) {
    AnimalState[AnimalState["Idle"] = 0] = "Idle";
    AnimalState[AnimalState["Walk"] = 1] = "Walk";
    AnimalState[AnimalState["Run"] = 2] = "Run";
})(AnimalState || (AnimalState = {}));
/** 动作状态 */
var UnitAction;
(function (UnitAction) {
    UnitAction[UnitAction["STAND"] = 0] = "STAND";
    UnitAction[UnitAction["MOVE"] = 1] = "MOVE";
    UnitAction[UnitAction["USE_SKILL"] = 2] = "USE_SKILL";
})(UnitAction || (UnitAction = {}));
// -----------------------------------------------------------------------------------
/** 战场类型(0:单人战场,1:多人战场) */
// enum BattleType {
// 	SINGLE = 0,
// 	MANY = 1,
// }
// enum WarType {
// }
// 7城墙 8箭塔 9栅栏 10召唤物
/**单位类型 */
var UnitType;
(function (UnitType) {
    /**武将 */
    UnitType[UnitType["GENERAL"] = 1] = "GENERAL";
    /**小兵 */
    UnitType[UnitType["SOLDIER"] = 2] = "SOLDIER";
    /**城墙 */
    UnitType[UnitType["BUILDING_WALL"] = 50] = "BUILDING_WALL";
    /**箭塔 */
    UnitType[UnitType["BUILDING_BARTIZAN"] = 51] = "BUILDING_BARTIZAN";
    /**栅栏 */
    UnitType[UnitType["PALING"] = 9] = "PALING";
    /**召唤物 */
    UnitType[UnitType["ZHAO_HUAN_WU"] = 10] = "ZHAO_HUAN_WU";
})(UnitType || (UnitType = {}));
/**兵种大类 */
var SoldierMainType;
(function (SoldierMainType) {
    /**城墙 */
    SoldierMainType[SoldierMainType["NONE"] = 0] = "NONE";
    /**步兵 */
    SoldierMainType[SoldierMainType["FOOTSOLDIER"] = 1] = "FOOTSOLDIER";
    /**骑兵 */
    SoldierMainType[SoldierMainType["RIDESOLDIER"] = 2] = "RIDESOLDIER";
    /**弓箭 */
    SoldierMainType[SoldierMainType["ARROWSOLDIER"] = 3] = "ARROWSOLDIER";
    /**枪兵 */
    SoldierMainType[SoldierMainType["PIKEMAN"] = 4] = "PIKEMAN";
    /**投石车 */
    SoldierMainType[SoldierMainType["HITWALLSOLDIER"] = 20] = "HITWALLSOLDIER";
    /**弩车 */
    SoldierMainType[SoldierMainType["GLAIVE_TGROWER"] = 21] = "GLAIVE_TGROWER";
    /**帐篷 */
    SoldierMainType[SoldierMainType["TENT"] = 22] = "TENT";
})(SoldierMainType || (SoldierMainType = {}));
/**武将国家类型 */
var SoldierNationType;
(function (SoldierNationType) {
    /**魏国 */
    SoldierNationType[SoldierNationType["WEI"] = 1] = "WEI";
    /**蜀国 */
    SoldierNationType[SoldierNationType["SU"] = 2] = "SU";
    /**吴国 */
    SoldierNationType[SoldierNationType["WU"] = 3] = "WU";
    /**群雄 */
    SoldierNationType[SoldierNationType["QUN"] = 4] = "QUN";
})(SoldierNationType || (SoldierNationType = {}));
/**默认登录角色形象 */
var RoleImgId;
(function (RoleImgId) {
    /**男 */
    RoleImgId[RoleImgId["BOY"] = 1040] = "BOY";
    /**女 */
    RoleImgId[RoleImgId["GIRL"] = 1036] = "GIRL";
})(RoleImgId || (RoleImgId = {}));
/**武将类型 */
var SoliderGeneralType;
(function (SoliderGeneralType) {
    /**猛将 */
    SoliderGeneralType[SoliderGeneralType["MENG_JIANG"] = 1] = "MENG_JIANG";
    /**豪杰 */
    SoliderGeneralType[SoliderGeneralType["HAO_JIE"] = 2] = "HAO_JIE";
    /**军师 */
    SoliderGeneralType[SoliderGeneralType["JUN_SHI"] = 3] = "JUN_SHI";
    /**枪将 */
    SoliderGeneralType[SoliderGeneralType["QIANG"] = 4] = "QIANG";
})(SoliderGeneralType || (SoliderGeneralType = {}));
/**攻守阵营 */
var FactionType;
(function (FactionType) {
    /**1:进攻方 */
    FactionType[FactionType["ATK"] = 1] = "ATK";
    /**2:防守方 */
    FactionType[FactionType["DEF"] = 2] = "DEF";
})(FactionType || (FactionType = {}));
/**敌我类型 */
var BelongType;
(function (BelongType) {
    BelongType[BelongType["OWN"] = 0] = "OWN";
    BelongType[BelongType["ENEMY"] = 1] = "ENEMY";
})(BelongType || (BelongType = {}));
/**国家类型 */
var CountryType;
(function (CountryType) {
    /**
    * 无
    */
    CountryType[CountryType["NONE"] = 0] = "NONE";
    /**
     * 魏
     */
    CountryType[CountryType["WEI"] = 1] = "WEI";
    /**
     * 蜀
     */
    CountryType[CountryType["SHU"] = 2] = "SHU";
    /**
     * 吴
     */
    CountryType[CountryType["WU"] = 3] = "WU";
    /**
     * 群
     */
    CountryType[CountryType["QUN"] = 4] = "QUN";
    /**
     * 盗贼,叛军,邪恶势力
     */
    CountryType[CountryType["TERRORIST"] = 5] = "TERRORIST";
    /**
     * 黄巾军
     */
    CountryType[CountryType["HUANG"] = 6] = "HUANG";
})(CountryType || (CountryType = {}));
// -----------------------------------------------------------------------------------
var CompleteStatus;
(function (CompleteStatus) {
    /**没有条件，未开始 */
    CompleteStatus[CompleteStatus["NONE"] = 0] = "NONE";
    /**条件不满足，暂停 */
    CompleteStatus[CompleteStatus["NOTYET"] = 1] = "NOTYET";
    /**条件已满足，开始 */
    CompleteStatus[CompleteStatus["CANDO"] = 2] = "CANDO";
    /**完成状态，停止 */
    CompleteStatus[CompleteStatus["COMPLETE"] = 3] = "COMPLETE";
})(CompleteStatus || (CompleteStatus = {}));
/**移动类型 */
var SpeedType;
(function (SpeedType) {
    /**普通 */
    SpeedType[SpeedType["NONE"] = 0] = "NONE";
    /**冲锋 */
    SpeedType[SpeedType["ACTIVE"] = 1] = "ACTIVE";
    /**被推 */
    SpeedType[SpeedType["PASSIVE"] = 2] = "PASSIVE";
})(SpeedType || (SpeedType = {}));
/**战斗事件类型 */
var FightEventType;
(function (FightEventType) {
    /**1-战斗胜利 */
    FightEventType[FightEventType["FIGHT_WING"] = 1] = "FIGHT_WING";
    /**2-召唤援军 */
    FightEventType[FightEventType["CALL_HELP"] = 2] = "CALL_HELP";
    /**3-援军使用战法 */
    FightEventType[FightEventType["FIGHT_HELP"] = 3] = "FIGHT_HELP";
    /**4-国家联盟 */
    FightEventType[FightEventType["CONTRY_SOLDER"] = 4] = "CONTRY_SOLDER";
    /**5-召唤超级援军 */
    FightEventType[FightEventType["CALL_SUPPER_HELP"] = 5] = "CALL_SUPPER_HELP";
})(FightEventType || (FightEventType = {}));
/**战场状态 */
var BattleStatus;
(function (BattleStatus) {
    /**不在场景 */
    BattleStatus[BattleStatus["LEAVE"] = 0] = "LEAVE";
    /**战斗集结 */
    BattleStatus[BattleStatus["JOIN"] = 1] = "JOIN";
    /**战场结束 */
    BattleStatus[BattleStatus["END"] = 2] = "END";
    /**进入战场但还没集结（补兵情况或进入战场不自动集结时） */
    BattleStatus[BattleStatus["UNJOIN"] = 3] = "UNJOIN";
})(BattleStatus || (BattleStatus = {}));
/**战斗关卡类型 */
var CheckPointType;
(function (CheckPointType) {
    /**布阵 */
    CheckPointType[CheckPointType["NONE"] = 0] = "NONE";
    /**世界城市战斗 */
    CheckPointType[CheckPointType["CITY_WAR"] = 1] = "CITY_WAR";
    /**关卡 */
    CheckPointType[CheckPointType["CHECKPOINT"] = 2] = "CHECKPOINT";
    /**擂台 */
    CheckPointType[CheckPointType["ARENA"] = 3] = "ARENA";
    /**巡查 */
    CheckPointType[CheckPointType["PATRO"] = 4] = "PATRO";
    /**竞技场 */
    CheckPointType[CheckPointType["PK"] = 5] = "PK";
    /**竞技场防守 */
    CheckPointType[CheckPointType["PK_DEF"] = 6] = "PK_DEF";
    /**boss挑战 */
    CheckPointType[CheckPointType["BOSS"] = 7] = "BOSS";
    /**打野 */
    CheckPointType[CheckPointType["FIGHT_WILD"] = 8] = "FIGHT_WILD";
    /**世界地图拜访 */
    CheckPointType[CheckPointType["CITY_VISIT"] = 9] = "CITY_VISIT";
    /**新的世界城市战斗 */
    CheckPointType[CheckPointType["NEW_CITY_WAR"] = 10] = "NEW_CITY_WAR";
    /**关卡带墙 */
    // CHECKPOINT_WALL = 11,
    /**材料副本 */
    CheckPointType[CheckPointType["MATERIAL"] = 12] = "MATERIAL";
    /**GM 战斗 */
    CheckPointType[CheckPointType["GM"] = 13] = "GM";
    /**解锁战斗 */
    CheckPointType[CheckPointType["UNLOCK_WAR"] = 14] = "UNLOCK_WAR";
    /**历史战役 */
    CheckPointType[CheckPointType["HISTORY_WAR"] = 15] = "HISTORY_WAR";
    /**跨服战 */
    CheckPointType[CheckPointType["CROSS_SERVER"] = 16] = "CROSS_SERVER";
})(CheckPointType || (CheckPointType = {}));
/**功能图标位置类型 */
var FunctionPosType;
(function (FunctionPosType) {
    FunctionPosType[FunctionPosType["FPT_NONE"] = 0] = "FPT_NONE";
    FunctionPosType[FunctionPosType["FPT_BOTTOM"] = 1] = "FPT_BOTTOM";
    FunctionPosType[FunctionPosType["FPT_RIGHT"] = 2] = "FPT_RIGHT";
    FunctionPosType[FunctionPosType["FPT_RIGHT_II"] = 3] = "FPT_RIGHT_II";
    FunctionPosType[FunctionPosType["FPT_TOP"] = 4] = "FPT_TOP";
})(FunctionPosType || (FunctionPosType = {}));
/**品质枚举 */
var QuaEnum;
(function (QuaEnum) {
    /**绿色 */
    QuaEnum[QuaEnum["QUA_1"] = 1] = "QUA_1";
    /**蓝色 */
    QuaEnum[QuaEnum["QUA_2"] = 2] = "QUA_2";
    /**紫色 */
    QuaEnum[QuaEnum["QUA_3"] = 3] = "QUA_3";
    /**橙色 */
    QuaEnum[QuaEnum["QUA_4"] = 4] = "QUA_4";
    /**红色 */
    QuaEnum[QuaEnum["QUA_5"] = 5] = "QUA_5";
})(QuaEnum || (QuaEnum = {}));
var LevelOpenType;
(function (LevelOpenType) {
    LevelOpenType[LevelOpenType["QD"] = 1] = "QD";
    LevelOpenType[LevelOpenType["YZ"] = 2] = "YZ";
    LevelOpenType[LevelOpenType["KJ"] = 3] = "KJ";
    LevelOpenType[LevelOpenType["BS"] = 4] = "BS";
    LevelOpenType[LevelOpenType["GEM"] = 5] = "GEM";
    LevelOpenType[LevelOpenType["BW"] = 6] = "BW";
    LevelOpenType[LevelOpenType["ZC"] = 7] = "ZC";
    LevelOpenType[LevelOpenType["SM"] = 8] = "SM";
    LevelOpenType[LevelOpenType["LT"] = 9] = "LT";
    LevelOpenType[LevelOpenType["DZ"] = 10] = "DZ";
})(LevelOpenType || (LevelOpenType = {}));
/**
 * 灯笼类型
 * @author meiyc
 *
 */
var LanternType;
(function (LanternType) {
    /** 普通灯笼 */
    LanternType[LanternType["COMMON_LANTERN"] = 1] = "COMMON_LANTERN";
    /** 自燃孔明灯 */
    LanternType[LanternType["BURN_LANTERN"] = 2] = "BURN_LANTERN";
    /** 时间孔明灯 */
    LanternType[LanternType["TIME_LANTERN"] = 3] = "TIME_LANTERN";
    /** 七彩孔明灯 */
    LanternType[LanternType["COLOURS_LANTERN"] = 4] = "COLOURS_LANTERN";
    /** 炸弹 */
    LanternType[LanternType["BOMB"] = 5] = "BOMB";
})(LanternType || (LanternType = {}));
/**Lan标签类型枚举 */
var LanParamType;
(function (LanParamType) {
    LanParamType[LanParamType["Default"] = 0] = "Default";
    LanParamType[LanParamType["Country"] = 1] = "Country";
    LanParamType[LanParamType["Prop"] = 2] = "Prop";
    LanParamType[LanParamType["General"] = 3] = "General";
    LanParamType[LanParamType["CityBuild"] = 4] = "CityBuild";
    LanParamType[LanParamType["Tactics"] = 5] = "Tactics";
})(LanParamType || (LanParamType = {}));
// /**
//  * 庆典加成类型
//  * @author meiyc
//  */
// enum AdditionType {
// 	/** 等级加成 */
// 	LEVEL_ADDITION = 1,
// 	/** 建筑基础分 */
// 	BUILDING_SCORE = 2,
// 	/** 建筑基础分暴击 率*/
// 	BUILDING_CRIT_RATE = 3,
// 	/** 灯笼分数暴击 */
// 	LANTERN_SCORE_CRIT = 4,
// 	/** N次庆典后必定暴击 */
// 	CEREMONIES_TIMES_CRIT = 5,
// 	/** 解锁孔明灯 */
// 	UNLOCK_LANTERN = 6,
// 	/** 孔明灯分数加成 */
// 	LANTERN_SCORE_ADDITION = 7,
// }
/**场景模块枚举分割 */
var SceneModuleSplit = 1000;
/**新建地图在后面加 有配置表写死id */
var SceneEnums;
(function (SceneEnums) {
    SceneEnums[SceneEnums["NONE_MAP"] = 0] = "NONE_MAP";
    SceneEnums[SceneEnums["MAIN_CITY"] = 1] = "MAIN_CITY";
    SceneEnums[SceneEnums["WORLD_CITY"] = 2] = "WORLD_CITY";
    SceneEnums[SceneEnums["BATTLE_MAP"] = 3] = "BATTLE_MAP";
    SceneEnums[SceneEnums["NOVICE_MAP"] = 4] = "NOVICE_MAP";
    SceneEnums[SceneEnums["TEST_MAP"] = 5] = "TEST_MAP";
    SceneEnums[SceneEnums["WAIT_BATTLE_MAP"] = 6] = "WAIT_BATTLE_MAP";
    SceneEnums[SceneEnums["AUTO_BATTLE_MAP"] = 7] = "AUTO_BATTLE_MAP";
    SceneEnums[SceneEnums["WORLD_XIANGYANG_CITY"] = 8] = "WORLD_XIANGYANG_CITY";
    SceneEnums[SceneEnums["CROSS_WALL_WAR_MAP"] = 9] = "CROSS_WALL_WAR_MAP";
    SceneEnums[SceneEnums["CROSS_WAR_MAP"] = 10] = "CROSS_WAR_MAP";
    SceneEnums[SceneEnums["ALL"] = 100] = "ALL";
})(SceneEnums || (SceneEnums = {}));
/**场景操作类型 */
var SceneOperateEnums;
(function (SceneOperateEnums) {
    SceneOperateEnums[SceneOperateEnums["WATCH_WORLD_BATTLE"] = 0] = "WATCH_WORLD_BATTLE";
})(SceneOperateEnums || (SceneOperateEnums = {}));
/**模块枚举由1000开始 避免与场景枚举冲突（资源组加载预设使用） */
var ModuleEnums;
(function (ModuleEnums) {
    /**武将 */
    ModuleEnums[ModuleEnums["GENERAL"] = 1000] = "GENERAL";
    /**武将 获得 */
    ModuleEnums[ModuleEnums["GENERAL_GET"] = 1001] = "GENERAL_GET";
    /**寺庙 */
    ModuleEnums[ModuleEnums["TEMPLE"] = 1002] = "TEMPLE";
    /**封地 */
    ModuleEnums[ModuleEnums["FIEF"] = 1003] = "FIEF";
    /**聊天 */
    ModuleEnums[ModuleEnums["CHAT"] = 1004] = "CHAT";
    /**决战 */
    ModuleEnums[ModuleEnums["DECISIVE"] = 1005] = "DECISIVE";
    /**vip */
    ModuleEnums[ModuleEnums["VIP"] = 1006] = "VIP";
    /**小秘书 */
    ModuleEnums[ModuleEnums["SECRETARY"] = 1007] = "SECRETARY";
    /**宝石 */
    ModuleEnums[ModuleEnums["GEM"] = 1008] = "GEM";
    /**军功任务 */
    ModuleEnums[ModuleEnums["MILITARY_TASK"] = 1009] = "MILITARY_TASK";
    /**科技 */
    ModuleEnums[ModuleEnums["TECHNOLOGY"] = 1010] = "TECHNOLOGY";
    /**兵书 */
    ModuleEnums[ModuleEnums["WARART"] = 1011] = "WARART";
    /**战车 */
    ModuleEnums[ModuleEnums["TANK"] = 1012] = "TANK";
    // /**擂台 */
    // ARENA = 1013,
    /**酒馆 */
    ModuleEnums[ModuleEnums["TAVERN"] = 1014] = "TAVERN";
    /**排行榜 */
    ModuleEnums[ModuleEnums["RANK"] = 1015] = "RANK";
    /**君主 */
    ModuleEnums[ModuleEnums["ROLE"] = 1016] = "ROLE";
    /**邮件 */
    ModuleEnums[ModuleEnums["MAIL"] = 1016] = "MAIL";
    /**小地图 */
    ModuleEnums[ModuleEnums["WORLD_MINI_MAP"] = 1017] = "WORLD_MINI_MAP";
    /**战斗0 */
    ModuleEnums[ModuleEnums["BATTLE"] = 1018] = "BATTLE";
    /**战斗地图动态 */
    ModuleEnums[ModuleEnums["BATTLE_MAP_DYNAMICS"] = 1019] = "BATTLE_MAP_DYNAMICS";
    /**挂机场景 */
    ModuleEnums[ModuleEnums["AKB"] = 1020] = "AKB";
    /**新手介绍cg */
    ModuleEnums[ModuleEnums["GUIDE_INDRO"] = 1021] = "GUIDE_INDRO";
    /**登陆界面 */
    ModuleEnums[ModuleEnums["LOGIN"] = 1022] = "LOGIN";
    ModuleEnums[ModuleEnums["LOGIN_NOTICE"] = 1023] = "LOGIN_NOTICE";
    /**主城界面 */
    ModuleEnums[ModuleEnums["MAIN_CITY"] = 1024] = "MAIN_CITY";
    /**世界地图 */
    ModuleEnums[ModuleEnums["WORLD_CITY"] = 1025] = "WORLD_CITY";
    /**襄阳战地图 */
    ModuleEnums[ModuleEnums["WORLD_XIANGYANG_CITY"] = 1026] = "WORLD_XIANGYANG_CITY";
    /**选择国家界面 */
    ModuleEnums[ModuleEnums["SELECT_COUNTRY"] = 1027] = "SELECT_COUNTRY";
    /**关机收益界面 */
    ModuleEnums[ModuleEnums["OFFLINE_UI"] = 1028] = "OFFLINE_UI";
    /**boss挑战 ui */
    ModuleEnums[ModuleEnums["BOSS_UI"] = 1029] = "BOSS_UI";
    /**材料副本 */
    ModuleEnums[ModuleEnums["ARENA_UI"] = 1030] = "ARENA_UI";
    /**征兵ui */
    ModuleEnums[ModuleEnums["ARMS_UI"] = 1031] = "ARMS_UI";
    /**聚宝盆ui */
    ModuleEnums[ModuleEnums["CORNUCOPIA_UI"] = 1032] = "CORNUCOPIA_UI";
    /**国家界面 */
    ModuleEnums[ModuleEnums["COUNTRY_UI"] = 1033] = "COUNTRY_UI";
    /**关卡章节界面 */
    ModuleEnums[ModuleEnums["QUARTERS_UI"] = 1034] = "QUARTERS_UI";
    /**充值界面 */
    ModuleEnums[ModuleEnums["PAY_SHOP_VIEW_UI"] = 1035] = "PAY_SHOP_VIEW_UI";
    /**免单商城 */
    ModuleEnums[ModuleEnums["FREE_SHOP_UI"] = 1036] = "FREE_SHOP_UI";
    /**帮派 */
    ModuleEnums[ModuleEnums["LEGION_UI"] = 1037] = "LEGION_UI";
    /**战斗初始资源 */
    ModuleEnums[ModuleEnums["BATTLE_MAP_INIT"] = 1038] = "BATTLE_MAP_INIT";
    /**第一次进入游戏资源 */
    ModuleEnums[ModuleEnums["FIRST_ENTER_GAME_RES"] = 1039] = "FIRST_ENTER_GAME_RES";
    /**碎片资源 */
    ModuleEnums[ModuleEnums["FLAGMENT_RES"] = 1040] = "FLAGMENT_RES";
    /**活动公告 */
    ModuleEnums[ModuleEnums["ACTIVITY_NOTICE"] = 1041] = "ACTIVITY_NOTICE";
    /**封王战 */
    ModuleEnums[ModuleEnums["KING_BATTLE"] = 1042] = "KING_BATTLE";
    /**活动界面 */
    ModuleEnums[ModuleEnums["ACTIVITY_UI"] = 1043] = "ACTIVITY_UI";
    /**7天活动 */
    ModuleEnums[ModuleEnums["SEV_DAY_UI"] = 1044] = "SEV_DAY_UI";
    /**一元充值 */
    ModuleEnums[ModuleEnums["ONE_YUAN_UI"] = 1045] = "ONE_YUAN_UI";
    /**首充界面 */
    ModuleEnums[ModuleEnums["FRIST_PAY_UI"] = 1046] = "FRIST_PAY_UI";
    /**在线奖励 */
    ModuleEnums[ModuleEnums["ONLINE_UI"] = 1047] = "ONLINE_UI";
    /**building 图标 */
    ModuleEnums[ModuleEnums["BUILDING_TIPS"] = 1048] = "BUILDING_TIPS";
    /**宝物界面 */
    ModuleEnums[ModuleEnums["TREA_VIEW"] = 1049] = "TREA_VIEW";
    /**福利界面 */
    ModuleEnums[ModuleEnums["WELFARE_VIEW"] = 1050] = "WELFARE_VIEW";
    /**队伍界面 */
    ModuleEnums[ModuleEnums["CAMP_VIEW"] = 1051] = "CAMP_VIEW";
    /**装备界面 */
    ModuleEnums[ModuleEnums["EQUIP_VIEW"] = 1052] = "EQUIP_VIEW";
    /**皇帝登基 */
    ModuleEnums[ModuleEnums["CORONA_VIEW"] = 1053] = "CORONA_VIEW";
    /**等级升级界面 */
    ModuleEnums[ModuleEnums["LEVELUP_VIEW"] = 1054] = "LEVELUP_VIEW";
    /**战斗结算 */
    ModuleEnums[ModuleEnums["RESULT_VIEW"] = 1055] = "RESULT_VIEW";
    /**缘分 */
    ModuleEnums[ModuleEnums["FATE_UI"] = 1056] = "FATE_UI";
    /**膜拜 */
    ModuleEnums[ModuleEnums["WORSHIP_UI"] = 1057] = "WORSHIP_UI";
    /** 转盘*/
    ModuleEnums[ModuleEnums["TURNTABLE_UI"] = 1058] = "TURNTABLE_UI";
    /**历史战役 */
    ModuleEnums[ModuleEnums["HISTORY_BATTLE"] = 1059] = "HISTORY_BATTLE";
    /**新武将活动 */
    ModuleEnums[ModuleEnums["NEW_GEN_UI"] = 1060] = "NEW_GEN_UI";
    /**勾玉充值界面 */
    ModuleEnums[ModuleEnums["YU_SHOP_VIEW_UI"] = 1061] = "YU_SHOP_VIEW_UI";
    /**新7天活动界面 */
    ModuleEnums[ModuleEnums["SEVENII_UI"] = 1062] = "SEVENII_UI";
    /**襄阳预告界面 */
    ModuleEnums[ModuleEnums["XIANGYANG_ADVANCE_VIEW"] = 1063] = "XIANGYANG_ADVANCE_VIEW";
    /**襄阳详情界面 */
    ModuleEnums[ModuleEnums["XIANGYANG_DETAILS_VIEW"] = 1064] = "XIANGYANG_DETAILS_VIEW";
    /**城市建筑buff资源 */
    ModuleEnums[ModuleEnums["CITY_BUILD_BUFF"] = 1065] = "CITY_BUILD_BUFF";
    /**战争沙盘 */
    ModuleEnums[ModuleEnums["SAND_TABLE_VIEW"] = 1066] = "SAND_TABLE_VIEW";
    /**跨服战 */
    ModuleEnums[ModuleEnums["CROSS_SERVER_UI"] = 1067] = "CROSS_SERVER_UI";
    /**VIP客服 */
    ModuleEnums[ModuleEnums["SERVICE_UI"] = 1068] = "SERVICE_UI";
})(ModuleEnums || (ModuleEnums = {}));
var LayerEnums;
(function (LayerEnums) {
    LayerEnums[LayerEnums["MAP"] = 1] = "MAP";
    LayerEnums[LayerEnums["MENU"] = 2] = "MENU";
    LayerEnums[LayerEnums["POPUP"] = 3] = "POPUP";
    LayerEnums[LayerEnums["TOP"] = 4] = "TOP";
    LayerEnums[LayerEnums["GUIDE"] = 5] = "GUIDE";
    LayerEnums[LayerEnums["NET"] = 6] = "NET";
})(LayerEnums || (LayerEnums = {}));
var GameConfigType;
(function (GameConfigType) {
    GameConfigType[GameConfigType["LAN"] = 0] = "LAN";
    GameConfigType[GameConfigType["CONFIG"] = 1] = "CONFIG";
})(GameConfigType || (GameConfigType = {}));
/**CD类型 */
var CoolDownType;
(function (CoolDownType) {
    CoolDownType[CoolDownType["BuildingSpeed"] = 1] = "BuildingSpeed";
})(CoolDownType || (CoolDownType = {}));
/**字体空格大小类型 */
var FontSpaceSize;
(function (FontSpaceSize) {
    FontSpaceSize[FontSpaceSize["MOBILE"] = 3.2] = "MOBILE";
    FontSpaceSize[FontSpaceSize["PC"] = 1.5] = "PC";
})(FontSpaceSize || (FontSpaceSize = {}));
var PopTitleIconType;
(function (PopTitleIconType) {
    PopTitleIconType[PopTitleIconType["NONE"] = 0] = "NONE";
    PopTitleIconType[PopTitleIconType["UPGRADE"] = 1] = "UPGRADE";
    PopTitleIconType[PopTitleIconType["GENERAL_INFO"] = 2] = "GENERAL_INFO";
    PopTitleIconType[PopTitleIconType["TAVERN"] = 3] = "TAVERN";
    PopTitleIconType[PopTitleIconType["BF"] = 4] = "BF";
    PopTitleIconType[PopTitleIconType["SM"] = 5] = "SM";
    PopTitleIconType[PopTitleIconType["LTG"] = 6] = "LTG";
    PopTitleIconType[PopTitleIconType["GEM"] = 7] = "GEM";
    PopTitleIconType[PopTitleIconType["KJ"] = 8] = "KJ";
    PopTitleIconType[PopTitleIconType["ZC"] = 9] = "ZC";
    PopTitleIconType[PopTitleIconType["RANK"] = 10] = "RANK";
    PopTitleIconType[PopTitleIconType["FARMLAND"] = 11] = "FARMLAND";
    PopTitleIconType[PopTitleIconType["MARK"] = 12] = "MARK";
    PopTitleIconType[PopTitleIconType["MILITARY_TASK"] = 13] = "MILITARY_TASK";
    PopTitleIconType[PopTitleIconType["TREASRE_UP"] = 14] = "TREASRE_UP";
    PopTitleIconType[PopTitleIconType["TREASRE_COM"] = 15] = "TREASRE_COM";
    PopTitleIconType[PopTitleIconType["BUBINGYING"] = 16] = "BUBINGYING";
    PopTitleIconType[PopTitleIconType["QIBINGYING"] = 17] = "QIBINGYING";
    PopTitleIconType[PopTitleIconType["GONGBINGYING"] = 18] = "GONGBINGYING";
    PopTitleIconType[PopTitleIconType["HEAD_QUARTERS"] = 28] = "HEAD_QUARTERS";
})(PopTitleIconType || (PopTitleIconType = {}));
/**士兵模型 */
var SoilderType;
(function (SoilderType) {
    SoilderType[SoilderType["RedInfantry"] = 1005] = "RedInfantry";
    SoilderType[SoilderType["blueInfantry"] = 1004] = "blueInfantry";
    SoilderType[SoilderType["RedArchers"] = 1000] = "RedArchers";
    SoilderType[SoilderType["BlueArchers"] = 1001] = "BlueArchers";
    SoilderType[SoilderType["RedCavalry"] = 1002] = "RedCavalry";
    SoilderType[SoilderType["BlueCavalry"] = 1003] = "BlueCavalry";
    SoilderType[SoilderType["RedPIKEMAN"] = 1031] = "RedPIKEMAN";
    SoilderType[SoilderType["BluePIKEMAN"] = 1032] = "BluePIKEMAN";
})(SoilderType || (SoilderType = {}));
/**
 * 雕像枚举
 */
var StatueType;
(function (StatueType) {
    StatueType[StatueType["BattleKing"] = 1] = "BattleKing";
    StatueType[StatueType["MoralityKing"] = 2] = "MoralityKing";
    StatueType[StatueType["FortuneKing"] = 3] = "FortuneKing";
    StatueType[StatueType["BuilderKing"] = 4] = "BuilderKing";
    StatueType[StatueType["PracticeKing"] = 5] = "PracticeKing";
})(StatueType || (StatueType = {}));
/**膜拜类型 1：皇帝 2:战力排行*/
var WorshipType;
(function (WorshipType) {
    WorshipType[WorshipType["KING"] = 1] = "KING";
    WorshipType[WorshipType["FIGHT_RANK"] = 2] = "FIGHT_RANK";
})(WorshipType || (WorshipType = {}));
