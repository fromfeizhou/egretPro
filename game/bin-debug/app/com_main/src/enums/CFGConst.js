/**
 * 配置表预定义[本文件由工具生成]
 */
/** 属性常量 */
var AttriType;
(function (AttriType) {
    /** 攻击 */
    AttriType[AttriType["ATK"] = 1] = "ATK";
    /** 防御 */
    AttriType[AttriType["DEF"] = 2] = "DEF";
    /** 智力 */
    AttriType[AttriType["INTELLIGENCE"] = 3] = "INTELLIGENCE";
    /** 统帅 */
    AttriType[AttriType["LEADERSHIP"] = 4] = "LEADERSHIP";
    /** 武力 */
    AttriType[AttriType["POWER"] = 5] = "POWER";
    /** 暴击率 */
    AttriType[AttriType["CRITICAL"] = 6] = "CRITICAL";
    /** 暴击伤害 */
    AttriType[AttriType["CRIT"] = 7] = "CRIT";
    /** 闪避率 */
    AttriType[AttriType["DODGE"] = 8] = "DODGE";
    /** 怒气 */
    AttriType[AttriType["ANGER"] = 9] = "ANGER";
    /** 血量 */
    AttriType[AttriType["HP"] = 10] = "HP";
    /** 兵力 */
    AttriType[AttriType["SOLDIER"] = 11] = "SOLDIER";
    /** 伤害减免 */
    AttriType[AttriType["DAMAGE_RED"] = 12] = "DAMAGE_RED";
    /** 伤害加成 */
    AttriType[AttriType["DAMAGE_AFFIX"] = 13] = "DAMAGE_AFFIX";
    /** 武将最大带兵数量 */
    AttriType[AttriType["MAX_LEAD_SOLDIER"] = 14] = "MAX_LEAD_SOLDIER";
    /** 攻击加成 */
    AttriType[AttriType["ATK_AFFIX"] = 101] = "ATK_AFFIX";
    /** 防御加成 */
    AttriType[AttriType["DEF_AFFIX"] = 102] = "DEF_AFFIX";
    /** 血量加成 */
    AttriType[AttriType["HP_AFFIX"] = 110] = "HP_AFFIX";
    /** 兵力加成 */
    AttriType[AttriType["SOLDIER_AFFIX"] = 111] = "SOLDIER_AFFIX";
    /** 重置怒气 */
    AttriType[AttriType["ANGER_INITIAL"] = 1003] = "ANGER_INITIAL";
    /** 双击（在来一次攻击） */
    AttriType[AttriType["ONE_MORE_ATTACK"] = 1004] = "ONE_MORE_ATTACK";
    /** 击退格数 */
    AttriType[AttriType["FLY_AWAY_COUNT"] = 1005] = "FLY_AWAY_COUNT";
    /** 每秒恢复怒气 */
    AttriType[AttriType["EVERY_SECOND_ANGER"] = 1006] = "EVERY_SECOND_ANGER";
    /** 武将掉血回怒率 */
    AttriType[AttriType["GENERAL_HP_TO_ANGER"] = 1007] = "GENERAL_HP_TO_ANGER";
    /** 攻击系数 */
    AttriType[AttriType["ATK_COEFFICIENT"] = 1101] = "ATK_COEFFICIENT";
    /** 防御系数 */
    AttriType[AttriType["DEF_COEFFICIENT"] = 1102] = "DEF_COEFFICIENT";
    /** 兵力系数 */
    AttriType[AttriType["SOLDIER_COEFFICIENT"] = 1103] = "SOLDIER_COEFFICIENT";
    /** 血量系数 */
    AttriType[AttriType["HP_COEFFICIENT"] = 1104] = "HP_COEFFICIENT";
})(AttriType || (AttriType = {}));
/** 功能开放表 */
var FunctionType;
(function (FunctionType) {
    /** 建筑升级 */
    FunctionType[FunctionType["BUILDING_GRADE"] = 1] = "BUILDING_GRADE";
    /** 建筑加速 */
    FunctionType[FunctionType["BUILDING_GRADE_SPEED"] = 2] = "BUILDING_GRADE_SPEED";
    /** 主城 */
    FunctionType[FunctionType["MAIN_MAP"] = 3] = "MAIN_MAP";
    /** 世界 */
    FunctionType[FunctionType["WORLD_MAP"] = 4] = "WORLD_MAP";
    /** 商城 */
    FunctionType[FunctionType["SHOP"] = 101] = "SHOP";
    /** 公告 */
    FunctionType[FunctionType["ANNOUNCEMENT"] = 102] = "ANNOUNCEMENT";
    /** 重生 */
    FunctionType[FunctionType["REBIRTH"] = 103] = "REBIRTH";
    /** 缩略图 */
    FunctionType[FunctionType["MINIMAP"] = 301] = "MINIMAP";
    /** 邮件 */
    FunctionType[FunctionType["MAIL"] = 401] = "MAIL";
    /** 排行榜 */
    FunctionType[FunctionType["RANK"] = 501] = "RANK";
    /** 武将招募 */
    FunctionType[FunctionType["GENERAL_RECRUITMENT"] = 601] = "GENERAL_RECRUITMENT";
    /** 竞技场 */
    FunctionType[FunctionType["APK"] = 701] = "APK";
    /** 科研 */
    FunctionType[FunctionType["TECHNOLOGY"] = 801] = "TECHNOLOGY";
    /** 聚宝 */
    FunctionType[FunctionType["FREE_MONEY"] = 901] = "FREE_MONEY";
    /** 武将功能 */
    FunctionType[FunctionType["GENERAL"] = 1001] = "GENERAL";
    /** 武将等级 */
    FunctionType[FunctionType["GENERAL_LEVELUP"] = 1002] = "GENERAL_LEVELUP";
    /** 武将升星 */
    FunctionType[FunctionType["GENERAL_STAR"] = 1003] = "GENERAL_STAR";
    /** 武将技能 */
    FunctionType[FunctionType["GENERAL_SKILL"] = 1004] = "GENERAL_SKILL";
    /** 武将宝物 */
    FunctionType[FunctionType["GENERAL_TREASURE"] = 1005] = "GENERAL_TREASURE";
    /** 武将缘分 */
    FunctionType[FunctionType["GENERAL_FATE"] = 1006] = "GENERAL_FATE";
    /** 联盟 */
    FunctionType[FunctionType["GUILD"] = 1101] = "GUILD";
    /** 物品 */
    FunctionType[FunctionType["PACK"] = 1201] = "PACK";
    /** 任务 */
    FunctionType[FunctionType["MAIN_TASK"] = 1301] = "MAIN_TASK";
    /** 国家 */
    FunctionType[FunctionType["COUNTRY"] = 1401] = "COUNTRY";
    /** 宝物 */
    FunctionType[FunctionType["TREASURE"] = 1801] = "TREASURE";
    /** 宝石合成 */
    FunctionType[FunctionType["GEMSTONE_COMPOSE"] = 1802] = "GEMSTONE_COMPOSE";
    /** 宝物升级 */
    FunctionType[FunctionType["TREASURE_UPGRADE_LEVEL"] = 1803] = "TREASURE_UPGRADE_LEVEL";
    /** 宝物升星 */
    FunctionType[FunctionType["TREASURE_UPGRADE_STAR"] = 1804] = "TREASURE_UPGRADE_STAR";
    /** 宝物装配宝石 */
    FunctionType[FunctionType["TREASURE_ASSEMBLING_GEMSTONE"] = 1805] = "TREASURE_ASSEMBLING_GEMSTONE";
    /** 名将副本 */
    FunctionType[FunctionType["HEAD_QUARTERS"] = 2001] = "HEAD_QUARTERS";
    /** 名将副本（困难） */
    FunctionType[FunctionType["HEAD_QUARTERS_HARD"] = 2002] = "HEAD_QUARTERS_HARD";
    /** 警报 */
    FunctionType[FunctionType["ALERT"] = 2101] = "ALERT";
    /** 挂机 */
    FunctionType[FunctionType["PATROL"] = 2201] = "PATROL";
    /** 敌将入侵 */
    FunctionType[FunctionType["PATROL_BOSS"] = 2202] = "PATROL_BOSS";
    /** 挂机自动跳转 */
    FunctionType[FunctionType["PATROL_TURN"] = 2203] = "PATROL_TURN";
    /** boss */
    FunctionType[FunctionType["BOSS"] = 2401] = "BOSS";
    /** 世界BOSS */
    FunctionType[FunctionType["WORLD_BOSS"] = 2402] = "WORLD_BOSS";
    /** 排名BOSS */
    FunctionType[FunctionType["RANK_BOSS"] = 2403] = "RANK_BOSS";
    /** 锻造装备 */
    FunctionType[FunctionType["EQUIPMENT"] = 2501] = "EQUIPMENT";
    /** 锻造强化 */
    FunctionType[FunctionType["EQUIPMENT_STENG"] = 2502] = "EQUIPMENT_STENG";
    /** 锻造升阶 */
    FunctionType[FunctionType["EQUIPMENT_GRADE"] = 2503] = "EQUIPMENT_GRADE";
    /** 锻造精炼 */
    FunctionType[FunctionType["EQUIPMENT_WROUGH"] = 2504] = "EQUIPMENT_WROUGH";
    /** 部队 */
    FunctionType[FunctionType["ARMEY"] = 2601] = "ARMEY";
    /** 布阵 */
    FunctionType[FunctionType["CAMP"] = 2701] = "CAMP";
    /** 聊天 */
    FunctionType[FunctionType["CHAT"] = 2801] = "CHAT";
    /** 在线时长奖励 */
    FunctionType[FunctionType["ONLINE"] = 2901] = "ONLINE";
    /** 材料副本 */
    FunctionType[FunctionType["MATERIAL"] = 2902] = "MATERIAL";
    /** 过关斩将 */
    FunctionType[FunctionType["ARENA"] = 2903] = "ARENA";
    /** 历史战役 */
    FunctionType[FunctionType["HISTORY_WAR"] = 2904] = "HISTORY_WAR";
    /** 瑞兽 */
    FunctionType[FunctionType["WATER_MONSTER"] = 2906] = "WATER_MONSTER";
    /** 投石车 */
    FunctionType[FunctionType["HITWALLSOLDIER"] = 2907] = "HITWALLSOLDIER";
    /** 弩车 */
    FunctionType[FunctionType["BALLISTA"] = 2908] = "BALLISTA";
    /** 帐篷 */
    FunctionType[FunctionType["TENT"] = 2909] = "TENT";
    /** 船 */
    FunctionType[FunctionType["BOOT"] = 2910] = "BOOT";
    /** 限时活动 */
    FunctionType[FunctionType["GIFTBAG"] = 4001] = "GIFTBAG";
    /** 神秘商人 */
    FunctionType[FunctionType["GIFTSHOP"] = 4002] = "GIFTSHOP";
    /** 跨服联赛 */
    FunctionType[FunctionType["CROSS_SERVER"] = 3301] = "CROSS_SERVER";
    /** 国战预告 */
    FunctionType[FunctionType["WORLD_NOTICE"] = 4006] = "WORLD_NOTICE";
    /** 每日惊喜 */
    FunctionType[FunctionType["DAILY_SURPRISE"] = 4007] = "DAILY_SURPRISE";
})(FunctionType || (FunctionType = {}));
/** VipPrivilleges */
var VipPrivillType;
(function (VipPrivillType) {
    /** 最大离线收益时间%s小时 */
    VipPrivillType[VipPrivillType["MAX_OFFLINE_INCOME"] = 101] = "MAX_OFFLINE_INCOME";
    /** 建筑时间减少%s分钟 */
    VipPrivillType[VipPrivillType["BUILDING_TIME_REDUCTION"] = 102] = "BUILDING_TIME_REDUCTION";
    /** 科技时间减少%s分钟 */
    VipPrivillType[VipPrivillType["TECHNOLOGY_TIME_REDUCTION"] = 103] = "TECHNOLOGY_TIME_REDUCTION";
    /** 募兵时间减少%s分钟 */
    VipPrivillType[VipPrivillType["TRAINING_TIME_REDUCTION"] = 104] = "TRAINING_TIME_REDUCTION";
    /** 跳过战斗 */
    VipPrivillType[VipPrivillType["CAN_SKIP_BATTLE"] = 105] = "CAN_SKIP_BATTLE";
    /** 一键建造（主城建筑） */
    VipPrivillType[VipPrivillType["BUILDING_FAST"] = 106] = "BUILDING_FAST";
    /** 一键收获（收获资源建筑） */
    VipPrivillType[VipPrivillType["BUILDING_AWARD_FAST"] = 107] = "BUILDING_AWARD_FAST";
    /** 贵族每日首次十连抽额外奖励翻倍 */
    VipPrivillType[VipPrivillType["TAVERN_EXTRA"] = 108] = "TAVERN_EXTRA";
    /** 银两免费快捷购买%s次 */
    VipPrivillType[VipPrivillType["QUICKSHOP_FREE_SILVER_COUNT"] = 109] = "QUICKSHOP_FREE_SILVER_COUNT";
    /** 粮食免费快捷购买%s次 */
    VipPrivillType[VipPrivillType["QUICKSHOP_FREE_GRAIN_COUNT"] = 110] = "QUICKSHOP_FREE_GRAIN_COUNT";
    /** 木材免费快捷购买%s次 */
    VipPrivillType[VipPrivillType["QUICKSHOP_FREE_WOOD_COUNT"] = 111] = "QUICKSHOP_FREE_WOOD_COUNT";
    /** 铁矿免费快捷购买%s次 */
    VipPrivillType[VipPrivillType["QUICKSHOP_FREE_IRON_COUNT"] = 112] = "QUICKSHOP_FREE_IRON_COUNT";
    /** 银两免费快捷购买%s%加成 */
    VipPrivillType[VipPrivillType["QUICKSHOP_SILVER_DISCOUNT"] = 113] = "QUICKSHOP_SILVER_DISCOUNT";
    /** 粮食免费快捷购买%s%加成 */
    VipPrivillType[VipPrivillType["QUICKSHOP_GRAIN_DISCOUNT"] = 114] = "QUICKSHOP_GRAIN_DISCOUNT";
    /** 木材免费快捷购买%s%加成 */
    VipPrivillType[VipPrivillType["QUICKSHOP_WOOD_DISCOUNT"] = 115] = "QUICKSHOP_WOOD_DISCOUNT";
    /** 铁矿免费快捷购买%s%加成 */
    VipPrivillType[VipPrivillType["QUICKSHOP_IRON_DISCOUNT"] = 116] = "QUICKSHOP_IRON_DISCOUNT";
    /** 排名BOSS免费挑战次数%s */
    VipPrivillType[VipPrivillType["BOSS_CHALLENGE"] = 201] = "BOSS_CHALLENGE";
    /** 过关斩将免费挑战次数%s */
    VipPrivillType[VipPrivillType["ARENA_CHALLENGE"] = 202] = "ARENA_CHALLENGE";
    /** 珍宝商城免费刷新次数%s */
    VipPrivillType[VipPrivillType["TREASURE_SHOP_REFRESH"] = 203] = "TREASURE_SHOP_REFRESH";
    /** 技能商城免费刷新次数%s */
    VipPrivillType[VipPrivillType["SKILL_SHOP_REFRESH"] = 204] = "SKILL_SHOP_REFRESH";
    /** 挂机收益增加%s% */
    VipPrivillType[VipPrivillType["PATROL_REWARD_ADD_RATE"] = 205] = "PATROL_REWARD_ADD_RATE";
    /** 免费双倍挂机离线收益 */
    VipPrivillType[VipPrivillType["PATROL_FREE"] = 206] = "PATROL_FREE";
    /** 大地图收集、采集收益增加%s% */
    VipPrivillType[VipPrivillType["MAP_COLLECTION_PROFIT"] = 207] = "MAP_COLLECTION_PROFIT";
    /** 大地图剿匪收益增加%s% */
    VipPrivillType[VipPrivillType["MAP_FIGHT_PROFIT"] = 208] = "MAP_FIGHT_PROFIT";
    /** 大地图额外队伍数+%s */
    VipPrivillType[VipPrivillType["MAP_EXTRA_TEAM"] = 209] = "MAP_EXTRA_TEAM";
    /** 大地图剿匪可购买%s次数 */
    VipPrivillType[VipPrivillType["BUY_MONSTER"] = 210] = "BUY_MONSTER";
    /** 大地图收集可购买%s次数 */
    VipPrivillType[VipPrivillType["BUY_COLLECT"] = 211] = "BUY_COLLECT";
    /** 大地图采集可购买%s次数 */
    VipPrivillType[VipPrivillType["BUY_GATHER"] = 212] = "BUY_GATHER";
    /** 名将副本购买次数%s */
    VipPrivillType[VipPrivillType["BUY_HAEDQUARTER_CLEAN"] = 303] = "BUY_HAEDQUARTER_CLEAN";
    /** 聚宝盆购买次数%s */
    VipPrivillType[VipPrivillType["BUY_JACKPOT"] = 304] = "BUY_JACKPOT";
    /** 竞技场挑战购买次数%s */
    VipPrivillType[VipPrivillType["BUY_APK"] = 305] = "BUY_APK";
    /** 排名BOSS挑战购买次数%s */
    VipPrivillType[VipPrivillType["BUY_BOSS"] = 306] = "BUY_BOSS";
    /** 过关斩将重置购买次数%s */
    VipPrivillType[VipPrivillType["BUY_ARENA"] = 307] = "BUY_ARENA";
    /** 挂机额外加速次数%s */
    VipPrivillType[VipPrivillType["PATROL_WINE_COUNT"] = 308] = "PATROL_WINE_COUNT";
    /** 银两副本挑战购买次数%s */
    VipPrivillType[VipPrivillType["MATERIAL_SILVER_BUY"] = 309] = "MATERIAL_SILVER_BUY";
    /** 强化副本挑战购买次数%s */
    VipPrivillType[VipPrivillType["MATERIAL_STRENGTHEN_BUY"] = 310] = "MATERIAL_STRENGTHEN_BUY";
    /** 升阶副本挑战购买次数%s */
    VipPrivillType[VipPrivillType["MATERIAL_UPGRADE_BUY"] = 311] = "MATERIAL_UPGRADE_BUY";
    /** 精炼副本挑战购买次数%s */
    VipPrivillType[VipPrivillType["MATERIAL_WROUGHT_BUY"] = 312] = "MATERIAL_WROUGHT_BUY";
    /** 天命副本挑战购买次数%s */
    VipPrivillType[VipPrivillType["MATERIAL_FATE_BUY"] = 313] = "MATERIAL_FATE_BUY";
    /** 部队副本挑战购买次数%s */
    VipPrivillType[VipPrivillType["MATERIAL_SOLDIER_BUY"] = 314] = "MATERIAL_SOLDIER_BUY";
    /** 挂机BOSS挑战购买次数%s */
    VipPrivillType[VipPrivillType["PATROL_BOSS_BUY"] = 315] = "PATROL_BOSS_BUY";
    /** 历史战役购买次数%s */
    VipPrivillType[VipPrivillType["HISTORY_WAR_BUY"] = 316] = "HISTORY_WAR_BUY";
    /** 个人BOSS挑战购买次数%s */
    VipPrivillType[VipPrivillType["BUY_PERSONAL_BOSS"] = 317] = "BUY_PERSONAL_BOSS";
    /** 世界BOSS挑战购买次数%s */
    VipPrivillType[VipPrivillType["BUY_WORLD_BOSS"] = 318] = "BUY_WORLD_BOSS";
})(VipPrivillType || (VipPrivillType = {}));
/** 系统常量表 */
var IConstEnum;
(function (IConstEnum) {
    /** 在线统计时间间隔（分） */
    IConstEnum[IConstEnum["ONLINE_STATISTICS_INTERVAL"] = 1] = "ONLINE_STATISTICS_INTERVAL";
    /** 世界等级统计的时间间隔 */
    IConstEnum[IConstEnum["WORLD_LEVEL_INTERVAL_TIME"] = 2] = "WORLD_LEVEL_INTERVAL_TIME";
    /** 世界等级统计的玩家数量 */
    IConstEnum[IConstEnum["WORLD_LEVEL_PLAYER_NUM"] = 3] = "WORLD_LEVEL_PLAYER_NUM";
    /** 最大角色数量包含删除的 */
    IConstEnum[IConstEnum["DEFAULT_MAX_ROLES_NUM"] = 101] = "DEFAULT_MAX_ROLES_NUM";
    /** 最大有效角色数，不包含删除的  */
    IConstEnum[IConstEnum["EFFECTIVE_NUMBER_ROLES"] = 102] = "EFFECTIVE_NUMBER_ROLES";
    /** 角色数量小于等于该数时不可删除 */
    IConstEnum[IConstEnum["MINIMUM_ROLES_NUMBER"] = 103] = "MINIMUM_ROLES_NUMBER";
    /** 升级满仓粮食 */
    IConstEnum[IConstEnum["UPLEVEL_REWARD"] = 113] = "UPLEVEL_REWARD";
    /** 推荐阵营奖励 */
    IConstEnum[IConstEnum["RECOMMEND_COUNTRY"] = 114] = "RECOMMEND_COUNTRY";
    /** 游戏初始化武将列表，无论玩家是否可以获得，只要游戏里调用了这个武将就需要配置进去 */
    IConstEnum[IConstEnum["GENERAL_LIST"] = 201] = "GENERAL_LIST";
    /** 武将最大怒气 */
    IConstEnum[IConstEnum["GENERAL_ANGRY_MAX"] = 502] = "GENERAL_ANGRY_MAX";
    /** 每X秒恢复X点怒气，每累积损失X%兵力恢复X点怒气,普攻一下加X点怒气 */
    IConstEnum[IConstEnum["ANGER_RECOVERY_COEF"] = 504] = "ANGER_RECOVERY_COEF";
    /** 小兵属性计算公式[武将属性继承到兵身上的系数] */
    IConstEnum[IConstEnum["SOLDIER_ATTRIBUTE_FORMULA"] = 506] = "SOLDIER_ATTRIBUTE_FORMULA";
    /** 属性成长系数[
智力与血量成长系数，统帅与血量成长系数，
武力与攻击成长系数，智力与攻击成长系数，
武力与防御成长系数，统帅与防御成长系数，
智力与兵力成长系数，统帅与兵力成长系数，
] */
    IConstEnum[IConstEnum["ATTRIBUTE_GROWTH_COEFFICIENT"] = 507] = "ATTRIBUTE_GROWTH_COEFFICIENT";
    /** 战力公式计算 */
    IConstEnum[IConstEnum["FIGHTING_FORMULA"] = 508] = "FIGHTING_FORMULA";
    /** 战斗公式[
将将伤害系数,将兵伤害系数,
兵将伤害系数,兵兵伤害系数,
] */
    IConstEnum[IConstEnum["WAR_FORMULA"] = 509] = "WAR_FORMULA";
    /** 伤害保底系数 */
    IConstEnum[IConstEnum["DAMAGE_BOTTOM_PRESERVATION_COEFFICIENT"] = 510] = "DAMAGE_BOTTOM_PRESERVATION_COEFFICIENT";
    /** 每次伤害回复怒气值 */
    IConstEnum[IConstEnum["GENERAL_ANGRY_ADD_HURT"] = 528] = "GENERAL_ANGRY_ADD_HURT";
    /** 武将攻击产生的怒气 */
    IConstEnum[IConstEnum["GENERALS_ATK_ANGER"] = 531] = "GENERALS_ATK_ANGER";
    /** 小兵攻击产生的怒气 */
    IConstEnum[IConstEnum["SOLDIER_ATK_ANGER"] = 532] = "SOLDIER_ATK_ANGER";
    /** 挂机界面骑马武将列表 */
    IConstEnum[IConstEnum["HANG_GENERAL_LIST"] = 550] = "HANG_GENERAL_LIST";
    /** 自己没有武将时显示的武将 */
    IConstEnum[IConstEnum["HANG_NO_GENERAL_DEFINE"] = 551] = "HANG_NO_GENERAL_DEFINE";
    /** 挂机动画 自己武将序列帧 */
    IConstEnum[IConstEnum["HANG_ACTLIST"] = 552] = "HANG_ACTLIST";
    /** 挂机动画 敌方武将序列帧 */
    IConstEnum[IConstEnum["HANG_E_ACTLIST"] = 553] = "HANG_E_ACTLIST";
    /** 挂机动画 技能1 */
    IConstEnum[IConstEnum["HANG_SKILL_1_IMAGE_LIST"] = 554] = "HANG_SKILL_1_IMAGE_LIST";
    /** 挂机动画 技能2 */
    IConstEnum[IConstEnum["HANG_SKILL_2_IMAGE_LIST"] = 555] = "HANG_SKILL_2_IMAGE_LIST";
    /** 挂机动画 技能1施法动作 */
    IConstEnum[IConstEnum["HANG_SKILL_1_START"] = 556] = "HANG_SKILL_1_START";
    /** 挂机动画 技能2施法动作 */
    IConstEnum[IConstEnum["HANG_SKILL_2_START"] = 557] = "HANG_SKILL_2_START";
    /** 挂机动画 士兵1序列帧 */
    IConstEnum[IConstEnum["HANG_SOLDIER_1"] = 558] = "HANG_SOLDIER_1";
    /** 挂机动画 士兵2序列帧 */
    IConstEnum[IConstEnum["HANG_SOLDIER_2"] = 559] = "HANG_SOLDIER_2";
    /** 武将变大比例 */
    IConstEnum[IConstEnum["BATTLE_GENREAL_SCALE"] = 560] = "BATTLE_GENREAL_SCALE";
    /** 释放技能时变大倍数 */
    IConstEnum[IConstEnum["BATTLE_GENREAL_SKILL_START_SCALE"] = 561] = "BATTLE_GENREAL_SKILL_START_SCALE";
    /** 释放技能变大时间（单位:毫秒） */
    IConstEnum[IConstEnum["BATTLE_SKILL_START_TIME_1"] = 562] = "BATTLE_SKILL_START_TIME_1";
    /** 释放技能闪光时间（单位:毫秒） */
    IConstEnum[IConstEnum["BATTLE_SKILL_START_TIME_2"] = 563] = "BATTLE_SKILL_START_TIME_2";
    /** 释放技能时间（单位:毫秒） */
    IConstEnum[IConstEnum["BATTLE_SKILL_START_TIME_3"] = 564] = "BATTLE_SKILL_START_TIME_3";
    /** 缩小时间（单位:毫秒） */
    IConstEnum[IConstEnum["BATTLE_SKILL_START_TIME_4"] = 565] = "BATTLE_SKILL_START_TIME_4";
    /** 红将施法大招黑屏时间（单位:毫秒） */
    IConstEnum[IConstEnum["BATTLE_SKILL_BLACK_TIME"] = 566] = "BATTLE_SKILL_BLACK_TIME";
    /** 地图1 进入战场后初始焦点 */
    IConstEnum[IConstEnum["BATTLE_MAP_1_START_POINT"] = 571] = "BATTLE_MAP_1_START_POINT";
    /** 地图1镜头往前推 */
    IConstEnum[IConstEnum["BATTLE_MAP_1_MOVE_POINT"] = 572] = "BATTLE_MAP_1_MOVE_POINT";
    /** 地图推进时间 （单位 帧  1秒30帧） */
    IConstEnum[IConstEnum["BATTLE_MAP_1_MOVE_TIME"] = 573] = "BATTLE_MAP_1_MOVE_TIME";
    /** 地图聚焦移动时间 （单位 帧  1秒30帧） */
    IConstEnum[IConstEnum["BATTLE_AUTO_MOVE_FLAME"] = 574] = "BATTLE_AUTO_MOVE_FLAME";
    /** 焦点偏离多少个像素进行对焦 */
    IConstEnum[IConstEnum["BATTLE_AUTO_MOVE_DIC"] = 575] = "BATTLE_AUTO_MOVE_DIC";
    /** 多久检测一次聚焦（单位：毫秒） */
    IConstEnum[IConstEnum["BATTLE_RUN_FOCUS_TIME"] = 576] = "BATTLE_RUN_FOCUS_TIME";
    /** 攻墙战地图推进坐标 */
    IConstEnum[IConstEnum["BATTLE_MAP_2_MOVE_POINT"] = 577] = "BATTLE_MAP_2_MOVE_POINT";
    /** 地图推进时间 （单位 帧  1秒30帧） */
    IConstEnum[IConstEnum["BATTLE_MAP_2_MOVE_TIME"] = 578] = "BATTLE_MAP_2_MOVE_TIME";
    /** 城墙爆炸后推进坐标点 */
    IConstEnum[IConstEnum["BATTLE_MAP_2_DESTORE_MOVE_POINT"] = 579] = "BATTLE_MAP_2_DESTORE_MOVE_POINT";
    /** 小兵被攻击血条显示时间 */
    IConstEnum[IConstEnum["BATTLE_SOLDIER_HP_SHOW_TIME"] = 580] = "BATTLE_SOLDIER_HP_SHOW_TIME";
    /** 小兵血条小时渐变消失时间 */
    IConstEnum[IConstEnum["BATTLE_SOLDIER_HP_DISAPPLLE_TIME"] = 581] = "BATTLE_SOLDIER_HP_DISAPPLLE_TIME";
    /** 小兵血条掉血量移动时间 */
    IConstEnum[IConstEnum["BATTLE_SOLDIER_HP_MOVE_TIME"] = 582] = "BATTLE_SOLDIER_HP_MOVE_TIME";
    /** 武将黄条掉格时间（单位：毫秒） */
    IConstEnum[IConstEnum["BATTLE_GENERAL_SOLDIER_SUB_TIEM"] = 590] = "BATTLE_GENERAL_SOLDIER_SUB_TIEM";
    /** 第一场新手战斗 步骤1时间（单位：毫秒） */
    IConstEnum[IConstEnum["FIRST_GUIDE_STEP_1"] = 591] = "FIRST_GUIDE_STEP_1";
    /** 第一场新手战斗 步骤2时间（单位：毫秒） */
    IConstEnum[IConstEnum["FIRST_GUIDE_STEP_2"] = 592] = "FIRST_GUIDE_STEP_2";
    /** 第一场新手战斗 步骤3时间（单位：毫秒） */
    IConstEnum[IConstEnum["FIRST_GUIDE_STEP_3"] = 593] = "FIRST_GUIDE_STEP_3";
    /** 士兵死亡飞起距离(单位：像素) */
    IConstEnum[IConstEnum["BATTLE_SOLDIER_DIE_DIS"] = 594] = "BATTLE_SOLDIER_DIE_DIS";
    /** 士兵死亡滑行时间（单位：毫秒） */
    IConstEnum[IConstEnum["BATTLE_SOLDIER_DIE_SLIP_TIME"] = 595] = "BATTLE_SOLDIER_DIE_SLIP_TIME";
    /** 士兵死亡击飞滑行时间（单位：毫秒） */
    IConstEnum[IConstEnum["BATTLE_SOLDIER_DIE_FLY_TIME"] = 596] = "BATTLE_SOLDIER_DIE_FLY_TIME";
    /** 战斗完成后等待多久出现结算界面 */
    IConstEnum[IConstEnum["BATTLE_SETTLE_DELAY_TIME"] = 597] = "BATTLE_SETTLE_DELAY_TIME";
    /** 小兵掉血飘字大小 */
    IConstEnum[IConstEnum["BATTLE_SOLDIER_BLOOD_SCALE"] = 598] = "BATTLE_SOLDIER_BLOOD_SCALE";
    /** 小兵变大比例 */
    IConstEnum[IConstEnum["BATTLE_SOLIDER_SCALE"] = 599] = "BATTLE_SOLIDER_SCALE";
    /** 第一场新手战斗 步骤4时间（单位：毫秒） */
    IConstEnum[IConstEnum["FIRST_GUIDE_STEP_4"] = 600] = "FIRST_GUIDE_STEP_4";
    /** 游戏起始兵力 */
    IConstEnum[IConstEnum["INIT_TROOP"] = 623] = "INIT_TROOP";
    /** 招揽客人消耗 元宝数量 */
    IConstEnum[IConstEnum["TAVERN_RECRUIT_CONSUME"] = 802] = "TAVERN_RECRUIT_CONSUME";
    /** 首次10连抽指定掉落内容，编号为酒馆配置表的id编号 */
    IConstEnum[IConstEnum["FIRST_RECRUIT_TEN"] = 810] = "FIRST_RECRUIT_TEN";
    /** 首次10连抽指定额外奖励内容，编号为酒馆配置表的id编号 */
    IConstEnum[IConstEnum["FIRST_RECRUIT_TEN_EXTRA"] = 811] = "FIRST_RECRUIT_TEN_EXTRA";
    /** 酒馆十连抽额外将魂奖励(客户端显示用) */
    IConstEnum[IConstEnum["FIRST_RECRUIT_TEN_EXTRA_CONSUME"] = 812] = "FIRST_RECRUIT_TEN_EXTRA_CONSUME";
    /** 武将设置喊话默认值 */
    IConstEnum[IConstEnum["GENERAT_TALK"] = 906] = "GENERAT_TALK";
    /** 武将等级最高可高于主城的等级 */
    IConstEnum[IConstEnum["GENERAL_GREATER_THAN_HALL"] = 909] = "GENERAL_GREATER_THAN_HALL";
    /** 君主等级不足时武将等级上限 */
    IConstEnum[IConstEnum["MINIMUM_GENERAL_LEVEL_LIMIT"] = 910] = "MINIMUM_GENERAL_LEVEL_LIMIT";
    /** 初始建筑队列 */
    IConstEnum[IConstEnum["BUILD_QUEUE_NUM"] = 1003] = "BUILD_QUEUE_NUM";
    /** 庆典丰收的时间单位数 */
    IConstEnum[IConstEnum["BUMPER_TIME_UNIT_NUM"] = 1005] = "BUMPER_TIME_UNIT_NUM";
    /** 招募兵力倍数 */
    IConstEnum[IConstEnum["TRAIN_ARMY_UNIT"] = 1007] = "TRAIN_ARMY_UNIT";
    /** 邮件上限 */
    IConstEnum[IConstEnum["ID_MAX_MAIL"] = 1101] = "ID_MAX_MAIL";
    /** 邮件列表每页显示数量 */
    IConstEnum[IConstEnum["ID_MAIL_NUM_PER_PAGE"] = 1102] = "ID_MAIL_NUM_PER_PAGE";
    /** 默认邮件上限 */
    IConstEnum[IConstEnum["DEFAULT_MAX_MAIL"] = 1103] = "DEFAULT_MAX_MAIL";
    /** 物品溢出邮件title */
    IConstEnum[IConstEnum["VALUES_OVERFLOW_MAIL_TITLE"] = 1104] = "VALUES_OVERFLOW_MAIL_TITLE";
    /** 物品溢出邮件content */
    IConstEnum[IConstEnum["VALUES_OVERFLOW_MAIL_CONTENT"] = 1105] = "VALUES_OVERFLOW_MAIL_CONTENT";
    /** 扫荡过关斩将需要的vip等级 */
    IConstEnum[IConstEnum["CLEAN_UP_BATTLE_VIP_LEVEL"] = 1801] = "CLEAN_UP_BATTLE_VIP_LEVEL";
    /** 过关斩将免费重置次数 */
    IConstEnum[IConstEnum["FREE_RESET_COUNT"] = 1802] = "FREE_RESET_COUNT";
    /** 重置消耗元宝数量 */
    IConstEnum[IConstEnum["RESET_CONSUME"] = 1803] = "RESET_CONSUME";
    /** 判定大国崛起所需最大城池数量 */
    IConstEnum[IConstEnum["COUNTRY_RISE_CITIES_MAX_COUNT"] = 2301] = "COUNTRY_RISE_CITIES_MAX_COUNT";
    /** 判定国家衰落所需最小城池数量 */
    IConstEnum[IConstEnum["COUNTRY_DECLINE_CITIES_MIN_COUNT"] = 2303] = "COUNTRY_DECLINE_CITIES_MIN_COUNT";
    /** 大国崛起奖励邮件id */
    IConstEnum[IConstEnum["COUNTRY_RISE_MAIL_ID"] = 2304] = "COUNTRY_RISE_MAIL_ID";
    /** 弹劾国王需要的人数 */
    IConstEnum[IConstEnum["IMPEACH_NEED_NUM"] = 2305] = "IMPEACH_NEED_NUM";
    /** 国家城池变化信息列表保留最大信息 */
    IConstEnum[IConstEnum["CITY_CHANGE_INFO_LIST_MAX_NUM"] = 2306] = "CITY_CHANGE_INFO_LIST_MAX_NUM";
    /** 攻城奖励最多累积数目 */
    IConstEnum[IConstEnum["MAX_CITYBATTLE_REWARD"] = 3003] = "MAX_CITYBATTLE_REWARD";
    /** 联盟列表数量 */
    IConstEnum[IConstEnum["GUILD_LIST_COUNT"] = 3601] = "GUILD_LIST_COUNT";
    /** 联盟宝藏刷新间隔时间（单位:分钟) */
    IConstEnum[IConstEnum["GUILD_TREASURE_REFRESH_PERIOD"] = 3602] = "GUILD_TREASURE_REFRESH_PERIOD";
    /** 联盟会长不在线xx时间，可以花费xx元宝申请成为会长（单位：秒） */
    IConstEnum[IConstEnum["GUILD_LEADER_OFFLINE_TIME"] = 3605] = "GUILD_LEADER_OFFLINE_TIME";
    /** 申请成为联盟会长花费xx元宝数量 */
    IConstEnum[IConstEnum["APPLY_GUILD_LEADER_CONSUME"] = 3606] = "APPLY_GUILD_LEADER_CONSUME";
    /** 联盟创建需要金币 */
    IConstEnum[IConstEnum["CREATE_GUILD_GOLD"] = 3609] = "CREATE_GUILD_GOLD";
    /** 联盟创建需要VIP等级 */
    IConstEnum[IConstEnum["CREATE_GUILD_VIP_LV"] = 3610] = "CREATE_GUILD_VIP_LV";
    /** 联盟科技捐献金币暴击概率（万分比） */
    IConstEnum[IConstEnum["DONATE_GOLD_CRIT"] = 3612] = "DONATE_GOLD_CRIT";
    /** 联盟科技捐献材料次数上限 */
    IConstEnum[IConstEnum["DONATE_RESOURCE_COUNT_UPPER"] = 3613] = "DONATE_RESOURCE_COUNT_UPPER";
    /** 联盟科技捐献材料每天刷新时间 */
    IConstEnum[IConstEnum["DONATE_RESOURCE_REFRESH_TIME"] = 3614] = "DONATE_RESOURCE_REFRESH_TIME";
    /** 联盟科技捐献材料暴击概率（万分比） */
    IConstEnum[IConstEnum["DONATE_RESOURCE_CRIT"] = 3615] = "DONATE_RESOURCE_CRIT";
    /**  */
    IConstEnum[IConstEnum["GUILD_KICK_MAIL_ID"] = 3616] = "GUILD_KICK_MAIL_ID";
    /** 云游商人开始展示时间 */
    IConstEnum[IConstEnum["CLOUD_SHOP_STIME"] = 3807] = "CLOUD_SHOP_STIME";
    /** 云游商人结束展示时间 */
    IConstEnum[IConstEnum["CLOUD_SHOP_ETIME"] = 3808] = "CLOUD_SHOP_ETIME";
    /** 兵种进阶等级最多能超过兵营的等级 */
    IConstEnum[IConstEnum["MAX_LEVEL"] = 4001] = "MAX_LEVEL";
    /** 聚宝盆金币抽中大奖广播次数 */
    IConstEnum[IConstEnum["ANNOUNCE_TIMES"] = 4101] = "ANNOUNCE_TIMES";
    /** 额外金币抽奖跑马灯 */
    IConstEnum[IConstEnum["HORSE_LAMP_TEMPLATE"] = 4102] = "HORSE_LAMP_TEMPLATE";
    /** 聚宝盆每日免费次数 */
    IConstEnum[IConstEnum["CORNUCOPIA_FREE"] = 4103] = "CORNUCOPIA_FREE";
    /** 聚宝盆每日总产出次数 */
    IConstEnum[IConstEnum["JACKPOT_ALL_COUNT_LIMIT"] = 4104] = "JACKPOT_ALL_COUNT_LIMIT";
    /** 月签到补签价格 */
    IConstEnum[IConstEnum["SIGN_UP_PRICE"] = 4301] = "SIGN_UP_PRICE";
    /** 行营重置次数（旧功能暂时不使用） */
    IConstEnum[IConstEnum["HQ_RESET_COUNT"] = 4701] = "HQ_RESET_COUNT";
    /** 名将副本扫荡的总次数 */
    IConstEnum[IConstEnum["HQ_TOTAL_COUNT"] = 4702] = "HQ_TOTAL_COUNT";
    /** 名将副本每次购买后获得的次数 */
    IConstEnum[IConstEnum["HQ_BUY_AMOUNT"] = 4703] = "HQ_BUY_AMOUNT";
    /** 名将副本每个关卡的每天挑战次数 */
    IConstEnum[IConstEnum["HQ_SECTION_LIMIT"] = 4704] = "HQ_SECTION_LIMIT";
    /** 名将副本次数恢复的时间间隔（秒） */
    IConstEnum[IConstEnum["HQ_REGEN_CD"] = 4705] = "HQ_REGEN_CD";
    /** 部队加速25%,部队加速50% */
    IConstEnum[IConstEnum["TEAM_GOLD_COIN_ACCELERATION"] = 4806] = "TEAM_GOLD_COIN_ACCELERATION";
    /** 单个部队最多武将数量 */
    IConstEnum[IConstEnum["MAX_GENERALS_NUMBER"] = 4810] = "MAX_GENERALS_NUMBER";
    /** 拜访消耗拜帖的数量 */
    IConstEnum[IConstEnum["VISIT_BATTLE_CONSUME"] = 4814] = "VISIT_BATTLE_CONSUME";
    /** 士兵价格：兵营建筑等级_对应1万兵力价格（一次购买10000个的价格，少于10000个按10000个计算） */
    IConstEnum[IConstEnum["TROOP_SUPPLYMENT_PRICE"] = 4815] = "TROOP_SUPPLYMENT_PRICE";
    /** 采集消耗元宝参数 */
    IConstEnum[IConstEnum["COLLECTION_CONSUME_GOLD"] = 4816] = "COLLECTION_CONSUME_GOLD";
    /** 世界地图部队编制列表开放等级,到达对应等级+1 */
    IConstEnum[IConstEnum["PLAYER_LEVEL_WORLD_MAP_TEAM"] = 4817] = "PLAYER_LEVEL_WORLD_MAP_TEAM";
    /** 开服后世界地图王城不能被攻击的时间（时间单位：秒） */
    IConstEnum[IConstEnum["KING_CITY_PROTECT_TIME"] = 4818] = "KING_CITY_PROTECT_TIME";
    /** 比武大会每次挑战或者扫荡获得的奖励 */
    IConstEnum[IConstEnum["CONST_AWARD_COMMON"] = 5201] = "CONST_AWARD_COMMON";
    /** 比武大会挑战次数最大购买上限 */
    IConstEnum[IConstEnum["CONST_BUY_COUNT"] = 5202] = "CONST_BUY_COUNT";
    /** 比武大会每天重置的挑战次数 */
    IConstEnum[IConstEnum["CONST_CHALLENGE_NUM"] = 5204] = "CONST_CHALLENGE_NUM";
    /** 比武大会购买次数时的元宝消耗 */
    IConstEnum[IConstEnum["CONST_CHALLENGE_CONSUMES"] = 5205] = "CONST_CHALLENGE_CONSUMES";
    /** 巡查每次领取的时间间隔（单位时间：秒） */
    IConstEnum[IConstEnum["RECEIVE_TIME"] = 5301] = "RECEIVE_TIME";
    /** 巡查最多可以领取的累计时间（单位时间：小时）已经废弃 */
    IConstEnum[IConstEnum["MAX_RECEIVE_HOUR"] = 5302] = "MAX_RECEIVE_HOUR";
    /** 巡查中酒的持续时间（单位时间：小时） */
    IConstEnum[IConstEnum["WINE_TIME"] = 5303] = "WINE_TIME";
    /** 巡查中使用的道具id（酒） */
    IConstEnum[IConstEnum["WINE_ITEM"] = 5304] = "WINE_ITEM";
    /** 巡查喝酒消耗材料 */
    IConstEnum[IConstEnum["PATROL_WINE_CONSUME_PROP"] = 5305] = "PATROL_WINE_CONSUME_PROP";
    /** 巡查消耗元宝的次数对应的元宝 */
    IConstEnum[IConstEnum["PATROL_WINE_CONSUME_GOLD"] = 5306] = "PATROL_WINE_CONSUME_GOLD";
    /** 来袭武将间隔时间（单位时间：秒） */
    IConstEnum[IConstEnum["PATROL_BOSS_CD"] = 5307] = "PATROL_BOSS_CD";
    /** 第一次来袭武将间隔时间（单位时间：秒） */
    IConstEnum[IConstEnum["PATROL_BOSS_CD_FIRST"] = 5308] = "PATROL_BOSS_CD_FIRST";
    /** 宝箱被领取后显示为空宝箱的时长,宝箱挂机多久后显示为非常满的时长，宝箱已满文本显示时长（单位时间：秒） */
    IConstEnum[IConstEnum["PATROL_AWARD_STATE_TIME"] = 5309] = "PATROL_AWARD_STATE_TIME";
    /** 巡查加速时间（单位：小时） */
    IConstEnum[IConstEnum["PATROL_SPEED_HOUR"] = 5310] = "PATROL_SPEED_HOUR";
    /** 个人boss免费扫荡次数 */
    IConstEnum[IConstEnum["PERSONAL_BOSS_FREE_CLEAN"] = 5407] = "PERSONAL_BOSS_FREE_CLEAN";
    /** 个人boss扫荡最多购买次数 */
    IConstEnum[IConstEnum["PERSONAL_BOSS_BUY_COUNT"] = 5408] = "PERSONAL_BOSS_BUY_COUNT";
    /** 个人boss消耗令牌 */
    IConstEnum[IConstEnum["PERSONAL_BOSS_CONSUME_VOUCHER"] = 5409] = "PERSONAL_BOSS_CONSUME_VOUCHER";
    /** 个人boss消耗元宝 */
    IConstEnum[IConstEnum["PERSONAL_BOSS_CONSUME_GOLD"] = 5410] = "PERSONAL_BOSS_CONSUME_GOLD";
    /** 排名boss玩家恢复点数的时间(单位:毫秒,例如5分钟=5*60*1000=300000) */
    IConstEnum[IConstEnum["RANKING_BOSS_PLAYER_REVIVE_TIME"] = 5411] = "RANKING_BOSS_PLAYER_REVIVE_TIME";
    /** 排名boss,boss恢复血量时间(单位:毫秒,例如5分钟=5*60*1000=300000) */
    IConstEnum[IConstEnum["RANKING_BOSS_REVIVE_TIME"] = 5412] = "RANKING_BOSS_REVIVE_TIME";
    /** 排名boss购买次数上限 */
    IConstEnum[IConstEnum["RANKING_BOSS_BUY_COUNT"] = 5413] = "RANKING_BOSS_BUY_COUNT";
    /** 排名boss连续挑战次数上限 */
    IConstEnum[IConstEnum["RANKING_BOSS_CHALLENGE_COUNT"] = 5414] = "RANKING_BOSS_CHALLENGE_COUNT";
    /** 世界boss购买次数上限 */
    IConstEnum[IConstEnum["WORLD_BOSS_BUY_COUNT"] = 5415] = "WORLD_BOSS_BUY_COUNT";
    /** 世界boss每天挑战次数上限 */
    IConstEnum[IConstEnum["WORLD_BOSS_CHALLENGE_COUNT"] = 5416] = "WORLD_BOSS_CHALLENGE_COUNT";
    /** 排名boss购买次数消耗令牌 */
    IConstEnum[IConstEnum["RANKING_BOSS_BUY_COUNT_CONSUME_VOUCHER"] = 5417] = "RANKING_BOSS_BUY_COUNT_CONSUME_VOUCHER";
    /** 世界boss购买次数消耗令牌 */
    IConstEnum[IConstEnum["WORLD_BOSS_BUY_COUNT_CONSUME_VOUCHER"] = 5418] = "WORLD_BOSS_BUY_COUNT_CONSUME_VOUCHER";
    /** 排名boss消耗金币 */
    IConstEnum[IConstEnum["RANKING_BOSS_CONSUME_GOLD"] = 5419] = "RANKING_BOSS_CONSUME_GOLD";
    /** 世界boss消耗金币 */
    IConstEnum[IConstEnum["WORLD_BOSS_CONSUME_GOLD"] = 5420] = "WORLD_BOSS_CONSUME_GOLD";
    /** 世界boss目标伤害 */
    IConstEnum[IConstEnum["WORLD_WORLD_GOAL_HURT"] = 5421] = "WORLD_WORLD_GOAL_HURT";
    /** 装备升阶公式系数1 */
    IConstEnum[IConstEnum["EQUIPMENT_SLOT_UPGRADE_ATTR_PARAM1"] = 5601] = "EQUIPMENT_SLOT_UPGRADE_ATTR_PARAM1";
    /** 装备升阶公式系数2 */
    IConstEnum[IConstEnum["EQUIPMENT_SLOT_UPGRADE_ATTR_PARAM2"] = 5602] = "EQUIPMENT_SLOT_UPGRADE_ATTR_PARAM2";
    /** 城墙被动技能ID */
    IConstEnum[IConstEnum["WALL_PASSIVE_SKILL"] = 5603] = "WALL_PASSIVE_SKILL";
    /** 关卡副本定义3星和2星通关 */
    IConstEnum[IConstEnum["COPY_STAR"] = 5604] = "COPY_STAR";
    /** 墙破暂停时间(毫秒) */
    IConstEnum[IConstEnum["WALL_OVER_PAUSE_TIME"] = 5605] = "WALL_OVER_PAUSE_TIME";
    /** 宝物道具来源 */
    IConstEnum[IConstEnum["TREA_SOURCE_ID"] = 5606] = "TREA_SOURCE_ID";
    /**  */
    IConstEnum[IConstEnum["VISIT_REFRESH_PRICE"] = 5607] = "VISIT_REFRESH_PRICE";
    /** 名将副本 普通难度 最大副本id */
    IConstEnum[IConstEnum["COPY_NOR_END"] = 5608] = "COPY_NOR_END";
    /** 名将副本 困难难度 最大副本id */
    IConstEnum[IConstEnum["COPY_HD_END"] = 5609] = "COPY_HD_END";
    /** 聊天间隔（毫秒） */
    IConstEnum[IConstEnum["CHAT_INTERVAL"] = 5610] = "CHAT_INTERVAL";
    /** 历史副本初始副本id */
    IConstEnum[IConstEnum["COPY_HIS_START"] = 5611] = "COPY_HIS_START";
    /** 历史副本最大副本id */
    IConstEnum[IConstEnum["COPY_HIS_END"] = 5612] = "COPY_HIS_END";
    /** 玩家阵型格子解锁条件（等级） */
    IConstEnum[IConstEnum["UNLOCK_POSITION"] = 5801] = "UNLOCK_POSITION";
    /** 攻击顺序 [攻击这位置_目标位置1_目标位置2_目标位置N,_目标位置1]，1-5是部队位置，6是投石车，7是箭塔，8城墙 */
    IConstEnum[IConstEnum["ATK_ORDER"] = 5803] = "ATK_ORDER";
    /** 首占奖励第一名联盟每人奖励20元宝。 */
    IConstEnum[IConstEnum["WAR_CITY_TEAM_RANKING1_GUILD_REWARD"] = 5901] = "WAR_CITY_TEAM_RANKING1_GUILD_REWARD";
    /** 首占奖励军功第一名奖励10%元宝。（万分比） */
    IConstEnum[IConstEnum["WAR_CITY_TEAM_RANKING1_GOLD_REWARD"] = 5902] = "WAR_CITY_TEAM_RANKING1_GOLD_REWARD";
    /** 首占奖励军功第二至十名奖励8%元宝。（万分比） */
    IConstEnum[IConstEnum["WAR_CITY_TEAM_RANKING2_9_GOLD_REWARD"] = 5903] = "WAR_CITY_TEAM_RANKING2_9_GOLD_REWARD";
    /** 首占奖励军功第十一名以上奖励30元宝。 */
    IConstEnum[IConstEnum["WAR_CITY_TEAM_FIGHT_REWARD"] = 5904] = "WAR_CITY_TEAM_FIGHT_REWARD";
    /** 改名所需要的名称。 */
    IConstEnum[IConstEnum["CHANGE_NAME"] = 5911] = "CHANGE_NAME";
    /** 战斗武将数量差加速 */
    IConstEnum[IConstEnum["ACCELERATE_DIFFERENCE_NUMBER_GENERALS"] = 5912] = "ACCELERATE_DIFFERENCE_NUMBER_GENERALS";
    /** 战斗公式【防御减免】参数 防御减免=守方防御/(守方防御+18000+攻方武将等级*250)+0.25 */
    IConstEnum[IConstEnum["DEF_RED"] = 5913] = "DEF_RED";
    /** 战斗公式【等级差】参数 (0.25*1.07^(我方武将等级-敌方武将等级）+0.75) */
    IConstEnum[IConstEnum["LEVEL_DIFFERENCE"] = 5914] = "LEVEL_DIFFERENCE";
    /** 竞技场筛选规则所需要的参数，完全根据筛选公式按顺序填写，公式文档中的排名数字不算在内 */
    IConstEnum[IConstEnum["APK_CHANLLENGE_LIST_PARAM"] = 5915] = "APK_CHANLLENGE_LIST_PARAM";
    /** 封王战展示奖励 */
    IConstEnum[IConstEnum["AC_KING_BATTLE_AWARD"] = 6001] = "AC_KING_BATTLE_AWARD";
    /** 元宝消耗CD，X秒一元宝 */
    IConstEnum[IConstEnum["CD_GOLD"] = 6002] = "CD_GOLD";
    /** 君主等级X级才能攻击城市 */
    IConstEnum[IConstEnum["MONARCHY_LEVEL_ATTACK_CITY"] = 6003] = "MONARCHY_LEVEL_ATTACK_CITY";
    /** 名将副本3星条件：45秒内通关 */
    IConstEnum[IConstEnum["HEAD_QUARTERS_3_STAR"] = 6004] = "HEAD_QUARTERS_3_STAR";
    /** 名将副本2星条件：60秒内通关 */
    IConstEnum[IConstEnum["HEAD_QUARTERS_2_STAR"] = 6005] = "HEAD_QUARTERS_2_STAR";
    /** 战功计算-胜 */
    IConstEnum[IConstEnum["MILITARYMERITS_COMPUTE_SUCCESS"] = 6006] = "MILITARYMERITS_COMPUTE_SUCCESS";
    /** 战功计算-负 */
    IConstEnum[IConstEnum["MILITARYMERITS_COMPUTE_FAIL"] = 6007] = "MILITARYMERITS_COMPUTE_FAIL";
    /** 武将一键升级等级限制 */
    IConstEnum[IConstEnum["GENERAL_UPGRADE_LIMIT"] = 6008] = "GENERAL_UPGRADE_LIMIT";
    /** 武将达到X级后每次只能升一级 */
    IConstEnum[IConstEnum["GENERAL_UPGRADE_MAX_LIMIT"] = 6009] = "GENERAL_UPGRADE_MAX_LIMIT";
    /** 装备一键强化、升阶、精炼等级限制 */
    IConstEnum[IConstEnum["EQUIPMENT_SLOT_UPGRADE_LIMIT"] = 6010] = "EQUIPMENT_SLOT_UPGRADE_LIMIT";
    /** 装备达到X级后每次只能升一级 */
    IConstEnum[IConstEnum["EQUIPMENT_SLOT_UPGRADE_MAX_LIMIT"] = 6011] = "EQUIPMENT_SLOT_UPGRADE_MAX_LIMIT";
    /** 每X秒恢复城市一队人马，每X秒恢复城市军队X%点血量（血量是万分比） */
    IConstEnum[IConstEnum["CITY_RECOVERY_FORCE"] = 6012] = "CITY_RECOVERY_FORCE";
    /** 盟主被弹劾离线时间判定(小时) */
    IConstEnum[IConstEnum["GUILD_ACCUSE_LOGINOUT_TIME"] = 6013] = "GUILD_ACCUSE_LOGINOUT_TIME";
    /** 弹劾盟主扣费 */
    IConstEnum[IConstEnum["GUILD_ACCUSE_COSTS"] = 6014] = "GUILD_ACCUSE_COSTS";
    /** 联盟排行榜最高战力人数 */
    IConstEnum[IConstEnum["GUILD_RANK_FIGHT_PERSON"] = 6015] = "GUILD_RANK_FIGHT_PERSON";
    /** 转盘消耗 元宝数量 */
    IConstEnum[IConstEnum["PRIZE_RECRUIT_CONSUME"] = 6016] = "PRIZE_RECRUIT_CONSUME";
    /** 转盘消耗幸运转盘道具 */
    IConstEnum[IConstEnum["PRIZE_RECRUIT_RECRUIT_CONSUME"] = 6017] = "PRIZE_RECRUIT_RECRUIT_CONSUME";
    /** 襄阳战从准备到开战的时间（秒）废弃，直接后台控制 */
    IConstEnum[IConstEnum["XIANGYANG_FIGHT_TIME"] = 6030] = "XIANGYANG_FIGHT_TIME";
    /** 襄阳战等级限制 */
    IConstEnum[IConstEnum["XIANGYANG_LEVEL_LIMIT"] = 6031] = "XIANGYANG_LEVEL_LIMIT";
    /** 襄阳战怪物头像[[武将1id，星级，等级],[武将2id，星级，等级]] */
    IConstEnum[IConstEnum["XIANGYANG_MONSTER"] = 6032] = "XIANGYANG_MONSTER";
    /** 襄阳战最后发兵时间限制（秒） */
    IConstEnum[IConstEnum["XIANGYANG_STOP_TIME"] = 6033] = "XIANGYANG_STOP_TIME";
    /** 日战功上限 */
    IConstEnum[IConstEnum["MILITARYMERITS_DAY_LIMIT"] = 6034] = "MILITARYMERITS_DAY_LIMIT";
    /** 跨服战兵库上限，2个亿 */
    IConstEnum[IConstEnum["CROSS_SERVER_WAR_MAX_TROOPS"] = 6040] = "CROSS_SERVER_WAR_MAX_TROOPS";
    /** 多少秒恢复多少兵力，格式：秒数,兵力 */
    IConstEnum[IConstEnum["CROSS_SERVER_WAR_TROOPS_RECOVER"] = 6041] = "CROSS_SERVER_WAR_TROOPS_RECOVER";
    /** 皇帝队的队伍总数 */
    IConstEnum[IConstEnum["CROSS_SERVER_WAR_TROOPS_EMPEROR_TEAM_NUM"] = 6042] = "CROSS_SERVER_WAR_TROOPS_EMPEROR_TEAM_NUM";
    /** 君主队的队伍总数 */
    IConstEnum[IConstEnum["CROSS_SERVER_WAR_TROOPS_COUNTRY_TEAM_NUM"] = 6043] = "CROSS_SERVER_WAR_TROOPS_COUNTRY_TEAM_NUM";
    /** 匹配时间点，时间点必须在活动预览时间和开始时间之间 */
    IConstEnum[IConstEnum["CROSS_SERVER_WAR_MATCH_TIME"] = 6044] = "CROSS_SERVER_WAR_MATCH_TIME";
    /** 清空数据时间点，时间点必须在预览时间之前 */
    IConstEnum[IConstEnum["CROSS_SERVER_WAR_CLEAN_MATCH_TIME"] = 6045] = "CROSS_SERVER_WAR_CLEAN_MATCH_TIME";
    /** 酒馆红将重置保底 */
    IConstEnum[IConstEnum["TAVERN_MINIMUM"] = 6046] = "TAVERN_MINIMUM";
    /** 酒馆红将重置保底上限 */
    IConstEnum[IConstEnum["TAVERN_MAX_MINIMUM"] = 6047] = "TAVERN_MAX_MINIMUM";
    /** 酒馆兑换红将积分要求 */
    IConstEnum[IConstEnum["TAVERN_EXCHANGE_SCORE"] = 6048] = "TAVERN_EXCHANGE_SCORE";
    /** 酒馆每招募一次增加积分 */
    IConstEnum[IConstEnum["TAVERN_ADD_SCORE"] = 6049] = "TAVERN_ADD_SCORE";
    /** 傲气参数[攻击方系统，防守方系数],万分比 */
    IConstEnum[IConstEnum["ARROGANCE_PARAM"] = 6050] = "ARROGANCE_PARAM";
    /** VIP的显示购买按钮限定等级:暂定为VIP8 */
    IConstEnum[IConstEnum["HIGH_VIP_BUY_DIS"] = 6051] = "HIGH_VIP_BUY_DIS";
    /** VIP的购买限定等级:暂定为VIP10 */
    IConstEnum[IConstEnum["HIGH_VIP_BUY_LV"] = 6052] = "HIGH_VIP_BUY_LV";
    /** 人民币转换元宝价格的系数:暂定为20 */
    IConstEnum[IConstEnum["HIGH_VIP_BUY_PRICE"] = 6053] = "HIGH_VIP_BUY_PRICE";
})(IConstEnum || (IConstEnum = {}));
/** 模块使用次数表 */
var IFunCountEnum;
(function (IFunCountEnum) {
    /** 普通副本扫荡次数 */
    IFunCountEnum[IFunCountEnum["COPY_FREE_COUNT"] = 10001] = "COPY_FREE_COUNT";
    /** 聚宝盆次数 */
    IFunCountEnum[IFunCountEnum["TREASURE_WASHBOWL_COUNT"] = 10002] = "TREASURE_WASHBOWL_COUNT";
    /** 困难副本扫荡次数 */
    IFunCountEnum[IFunCountEnum["HQ_HARD_FREE_COUNT"] = 10003] = "HQ_HARD_FREE_COUNT";
    /** 挂机boss */
    IFunCountEnum[IFunCountEnum["PATROL_BOSS"] = 10004] = "PATROL_BOSS";
    /** 挂机经验购买 */
    IFunCountEnum[IFunCountEnum["PATROL_WINE"] = 10005] = "PATROL_WINE";
    /** 个人boss */
    IFunCountEnum[IFunCountEnum["PERSONAL_BOSS"] = 10006] = "PERSONAL_BOSS";
    /** 每日采集次数 */
    IFunCountEnum[IFunCountEnum["COLLECT_COUNT"] = 10007] = "COLLECT_COUNT";
    /** 每日剿匪次数 */
    IFunCountEnum[IFunCountEnum["WILD_MONSTER_COUNT"] = 10008] = "WILD_MONSTER_COUNT";
    /** 每日收集次数 */
    IFunCountEnum[IFunCountEnum["GATHER_COUNT"] = 10009] = "GATHER_COUNT";
    /** 竞技场每日挑战次数 */
    IFunCountEnum[IFunCountEnum["APK_CHALLENGE_COUNT"] = 10010] = "APK_CHALLENGE_COUNT";
    /** 历史战役扫荡次数 */
    IFunCountEnum[IFunCountEnum["HISTORY_WAR_COUNT"] = 10011] = "HISTORY_WAR_COUNT";
    /** 排名boss */
    IFunCountEnum[IFunCountEnum["RANK_BOSS"] = 10012] = "RANK_BOSS";
    /** 世界boss */
    IFunCountEnum[IFunCountEnum["WORLD_BOSS"] = 10013] = "WORLD_BOSS";
})(IFunCountEnum || (IFunCountEnum = {}));
/** NoticeConfig */
var INoticeEnum;
(function (INoticeEnum) {
    /** 武将卡获得 */
    INoticeEnum[INoticeEnum["GEN_CARD"] = 1] = "GEN_CARD";
    /**  */
    INoticeEnum[INoticeEnum["CITY_WAR_START"] = 2] = "CITY_WAR_START";
    /**  */
    INoticeEnum[INoticeEnum["CITY_WAR_OVER"] = 3] = "CITY_WAR_OVER";
    /**  */
    INoticeEnum[INoticeEnum["GEN_HIGH"] = 4] = "GEN_HIGH";
    /**  */
    INoticeEnum[INoticeEnum["GET_TREASURE"] = 7] = "GET_TREASURE";
    /**  */
    INoticeEnum[INoticeEnum["GEM_HIGH"] = 8] = "GEM_HIGH";
    /**  */
    INoticeEnum[INoticeEnum["BREAKOUT_PREVIEW"] = 15] = "BREAKOUT_PREVIEW";
    /**  */
    INoticeEnum[INoticeEnum["BREAKOUT_START"] = 16] = "BREAKOUT_START";
    /**  */
    INoticeEnum[INoticeEnum["VIP_LEVEL"] = 17] = "VIP_LEVEL";
    /**  */
    INoticeEnum[INoticeEnum["APK_TOP"] = 19] = "APK_TOP";
    /**  */
    INoticeEnum[INoticeEnum["FIRST_RECHARGE"] = 21] = "FIRST_RECHARGE";
    /**  */
    INoticeEnum[INoticeEnum["VIP_4"] = 23] = "VIP_4";
    /**  */
    INoticeEnum[INoticeEnum["VIP_8"] = 24] = "VIP_8";
    /**  */
    INoticeEnum[INoticeEnum["VIP_14"] = 25] = "VIP_14";
    /**  */
    INoticeEnum[INoticeEnum["VIP_15"] = 26] = "VIP_15";
    /**  */
    INoticeEnum[INoticeEnum["CITY_FULL_DEF"] = 27] = "CITY_FULL_DEF";
    /**  */
    INoticeEnum[INoticeEnum["ATTACK_CITY_FAIL"] = 28] = "ATTACK_CITY_FAIL";
    /**  */
    INoticeEnum[INoticeEnum["ATTACK_CITY_MVP"] = 29] = "ATTACK_CITY_MVP";
    /**  */
    INoticeEnum[INoticeEnum["BECOME_EMPROR"] = 30] = "BECOME_EMPROR";
    /**  */
    INoticeEnum[INoticeEnum["XIANG_YANG_NOTICE"] = 31] = "XIANG_YANG_NOTICE";
    /**  */
    INoticeEnum[INoticeEnum["XIANG_YANG_WAR"] = 32] = "XIANG_YANG_WAR";
    /**  */
    INoticeEnum[INoticeEnum["GET_POSITION"] = 34] = "GET_POSITION";
    /**  */
    INoticeEnum[INoticeEnum["YELLOW_ARMY_STORM"] = 35] = "YELLOW_ARMY_STORM";
    /**  */
    INoticeEnum[INoticeEnum["YELLOW_ARMY_NO_STORM"] = 36] = "YELLOW_ARMY_NO_STORM";
    /**  */
    INoticeEnum[INoticeEnum["GEN_TOP"] = 37] = "GEN_TOP";
    /** GM专用的系统公告 */
    INoticeEnum[INoticeEnum["SYSTEM_NOTICE"] = 38] = "SYSTEM_NOTICE";
})(INoticeEnum || (INoticeEnum = {}));
/** 活动ui枚举 */
var AcViewType;
(function (AcViewType) {
    /** 首充 */
    AcViewType[AcViewType["FIRST_RECHARGE"] = 101] = "FIRST_RECHARGE";
    /** 单笔充值 */
    AcViewType[AcViewType["RECHARGE_SINGLE"] = 201] = "RECHARGE_SINGLE";
    /** 连续充值 */
    AcViewType[AcViewType["RECHARGE_CONTIN"] = 301] = "RECHARGE_CONTIN";
    /** 累计充值 */
    AcViewType[AcViewType["RECHARGE_ADD_UP"] = 401] = "RECHARGE_ADD_UP";
    /** 充值兑换 */
    AcViewType[AcViewType["RECHARGE_EXCHANGE"] = 501] = "RECHARGE_EXCHANGE";
    /** 精彩礼包 */
    AcViewType[AcViewType["PURCHAGE_BAG"] = 601] = "PURCHAGE_BAG";
    /** 一元礼包 */
    AcViewType[AcViewType["ONE_GIFT_BAG"] = 5101] = "ONE_GIFT_BAG";
    /** 7日目标 */
    AcViewType[AcViewType["OPEN_SEVEN"] = 10101] = "OPEN_SEVEN";
    /** 7天循环活动 */
    AcViewType[AcViewType["NOR_SEVEN"] = 10201] = "NOR_SEVEN";
    /** 签到 */
    AcViewType[AcViewType["SIGN_MONTH_DAY"] = 10301] = "SIGN_MONTH_DAY";
    /** 七天登录 */
    AcViewType[AcViewType["SIGN_CONTIN_DAY_2"] = 40202] = "SIGN_CONTIN_DAY_2";
    /** 单笔充值 */
    AcViewType[AcViewType["RECHARGE_SINGLE_2"] = 202] = "RECHARGE_SINGLE_2";
    /** 累计充值 */
    AcViewType[AcViewType["RECHARGE_ADD_UP_3"] = 403] = "RECHARGE_ADD_UP_3";
    /** 特惠商店 */
    AcViewType[AcViewType["AC_SHOP"] = 701] = "AC_SHOP";
    /** 聚宝盆累充 */
    AcViewType[AcViewType["RECHARGE_ADD_UP_4"] = 404] = "RECHARGE_ADD_UP_4";
    /** 聚宝盆抽奖 */
    AcViewType[AcViewType["TREASEURE_BOWL"] = 30402] = "TREASEURE_BOWL";
    /** 武将拜访 */
    AcViewType[AcViewType["NEW_GEN_VIS"] = 30401] = "NEW_GEN_VIS";
    /** 周卡月卡 */
    AcViewType[AcViewType["CARD_MONTH_WEEK"] = 20101] = "CARD_MONTH_WEEK";
    /** 消费好礼 */
    AcViewType[AcViewType["CONSUME_GIFT"] = 30101] = "CONSUME_GIFT";
    /** 转盘 */
    AcViewType[AcViewType["TRUN_TABLE"] = 30201] = "TRUN_TABLE";
    /** 成长基金 */
    AcViewType[AcViewType["FUND_GROWTH"] = 30301] = "FUND_GROWTH";
    /** 七天登录 */
    AcViewType[AcViewType["SIGN_CONTIN_DAY"] = 40201] = "SIGN_CONTIN_DAY";
    /** 战力冲榜 */
    AcViewType[AcViewType["FIGHT_RANKING_AWARD"] = 50101] = "FIGHT_RANKING_AWARD";
    /** 等级冲榜 */
    AcViewType[AcViewType["LEVEL_RANKING_AWARD"] = 50201] = "LEVEL_RANKING_AWARD";
    /** 霸王的大陆 */
    AcViewType[AcViewType["COUNTRY_CITYS_RANKING"] = 50301] = "COUNTRY_CITYS_RANKING";
    /** 三国无双 */
    AcViewType[AcViewType["APK_RANKING"] = 50401] = "APK_RANKING";
    /** 最强联盟 */
    AcViewType[AcViewType["GUILD_FORCE_RANKING"] = 50501] = "GUILD_FORCE_RANKING";
    /** 封王战 */
    AcViewType[AcViewType["THRONE"] = 1000101] = "THRONE";
    /** 南蛮入侵 */
    AcViewType[AcViewType["BARBARIANATTACK"] = 1000201] = "BARBARIANATTACK";
    /** 跨服联赛 */
    AcViewType[AcViewType["CROSS_SERVICE"] = 1000301] = "CROSS_SERVICE";
    /** 古战场 */
    AcViewType[AcViewType["ANCIENTBATTLEFIELD"] = 1000401] = "ANCIENTBATTLEFIELD";
    /** 襄阳战 */
    AcViewType[AcViewType["XIANGYANG"] = 1000501] = "XIANGYANG";
    /** 幸运转盘 */
    AcViewType[AcViewType["PRIZE"] = 1000601] = "PRIZE";
    /** 新春七天登录 */
    AcViewType[AcViewType["SIGN_CONTIN_DAY_3"] = 40203] = "SIGN_CONTIN_DAY_3";
    /** 新春单笔充值 */
    AcViewType[AcViewType["RECHARGE_SINGLE_3"] = 203] = "RECHARGE_SINGLE_3";
    /** 新春累计充值 */
    AcViewType[AcViewType["RECHARGE_ADD_UP_5"] = 405] = "RECHARGE_ADD_UP_5";
    /** 新春特惠商店 */
    AcViewType[AcViewType["AC_SHOP_2"] = 702] = "AC_SHOP_2";
    /** 新春聚宝盆累充 */
    AcViewType[AcViewType["RECHARGE_ADD_UP_6"] = 406] = "RECHARGE_ADD_UP_6";
    /** 新春聚宝盆抽奖 */
    AcViewType[AcViewType["TREASEURE_BOWL_2"] = 30403] = "TREASEURE_BOWL_2";
})(AcViewType || (AcViewType = {}));
/** 排行榜 */
var RankType;
(function (RankType) {
    /** 用户等级排行 */
    RankType[RankType["LV_RANKS"] = 1] = "LV_RANKS";
    /** 玩家战力排行 */
    RankType[RankType["PLAYER"] = 2] = "PLAYER";
    /** 武将战力排行 */
    RankType[RankType["GENREAL"] = 3] = "GENREAL";
    /** 国内战功排行(魏) */
    RankType[RankType["WEI_BATTLE_ACHIEVEMENT_RANKS"] = 5] = "WEI_BATTLE_ACHIEVEMENT_RANKS";
    /** 联盟 */
    RankType[RankType["LEGION"] = 6] = "LEGION";
    /** 国家城池 */
    RankType[RankType["COUNTRY"] = 7] = "COUNTRY";
    /** 战功 */
    RankType[RankType["MILLTORY"] = 8] = "MILLTORY";
    /** 襄阳战个人战功排行榜 */
    RankType[RankType["XIANGYANG_PLAYER_RANKS"] = 9] = "XIANGYANG_PLAYER_RANKS";
    /** 竞技场排行 */
    RankType[RankType["ARENA_POWER"] = 10] = "ARENA_POWER";
    /** 单个武将排行榜 */
    RankType[RankType["ONEHERO"] = 11] = "ONEHERO";
    /** 跨服个人荣誉排行榜 */
    RankType[RankType["CROSS_SERVER_PLAYER_RANK"] = 12] = "CROSS_SERVER_PLAYER_RANK";
    /** 跨服联盟荣誉排行榜 */
    RankType[RankType["CROSS_SERVER_UNION_RANK"] = 13] = "CROSS_SERVER_UNION_RANK";
})(RankType || (RankType = {}));
/** 城池升级奖励类型 */
var CityRewardType;
(function (CityRewardType) {
    /** 参数为增加的万分比 */
    CityRewardType[CityRewardType["REVENUE"] = 1] = "REVENUE";
    /** 参数为增加的万分比 */
    CityRewardType[CityRewardType["GATHER"] = 2] = "GATHER";
    /** 参数为加成等级数，大于200时只会等于200级 */
    CityRewardType[CityRewardType["NPC_LEVEL"] = 3] = "NPC_LEVEL";
    /** 没有参数 */
    CityRewardType[CityRewardType["NPC_NUM"] = 4] = "NPC_NUM";
    /** 参数为减少的万分比 */
    CityRewardType[CityRewardType["NPC_REGAIN"] = 5] = "NPC_REGAIN";
    /** 参数为减少的万分比 */
    CityRewardType[CityRewardType["MOVE"] = 6] = "MOVE";
    /** 城市可以补充兵力 */
    CityRewardType[CityRewardType["REPAIR"] = 7] = "REPAIR";
    /** 没有参数 */
    CityRewardType[CityRewardType["NPC_HEAD"] = 8] = "NPC_HEAD";
    /** 没有参数 */
    CityRewardType[CityRewardType["VISIT"] = 9] = "VISIT";
    /** 没有参数 */
    CityRewardType[CityRewardType["FAMOUS"] = 10] = "FAMOUS";
})(CityRewardType || (CityRewardType = {}));
/** 跨服数据常量表 */
var CrossServerConstType;
(function (CrossServerConstType) {
    /** 跨服战兵库上限，200个亿 */
    CrossServerConstType[CrossServerConstType["MAX_TROOPS"] = 1] = "MAX_TROOPS";
    /** 多少秒恢复多少兵力，格式：秒数,兵力 */
    CrossServerConstType[CrossServerConstType["TROOPS_RECOVER"] = 2] = "TROOPS_RECOVER";
    /** 皇帝队的队伍总数 */
    CrossServerConstType[CrossServerConstType["TROOPS_EMPEROR_TEAM_NUM"] = 3] = "TROOPS_EMPEROR_TEAM_NUM";
    /** 君主队的队伍总数 */
    CrossServerConstType[CrossServerConstType["TROOPS_COUNTRY_TEAM_NUM"] = 4] = "TROOPS_COUNTRY_TEAM_NUM";
    /** 清空数据，进入准备期 */
    CrossServerConstType[CrossServerConstType["CLEAN_MATCH_TIME"] = 5] = "CLEAN_MATCH_TIME";
    /** 活动预览报名时间 */
    CrossServerConstType[CrossServerConstType["PRE_VIEW_TIME"] = 6] = "PRE_VIEW_TIME";
    /** 匹配时间点，时间点必须在活动预览时间和开始时间之间 */
    CrossServerConstType[CrossServerConstType["MATCH_TIME"] = 7] = "MATCH_TIME";
    /** 开战时间 */
    CrossServerConstType[CrossServerConstType["OPEN_TIEM"] = 8] = "OPEN_TIEM";
    /** 结束时间 */
    CrossServerConstType[CrossServerConstType["CLOSE_TIME"] = 9] = "CLOSE_TIME";
    /** 周几开放 */
    CrossServerConstType[CrossServerConstType["WEEKS"] = 10] = "WEEKS";
    /** 开服多少天可以参加跨服战 */
    CrossServerConstType[CrossServerConstType["OPEN_SERVER_DAY"] = 11] = "OPEN_SERVER_DAY";
    /** 跨服战队伍移动时间，单位：秒 */
    CrossServerConstType[CrossServerConstType["TEAM_MOVE_TIME"] = 12] = "TEAM_MOVE_TIME";
    /** 城门胜利一场加多少荣誉 */
    CrossServerConstType[CrossServerConstType["GATE_WIN_HONOR"] = 13] = "GATE_WIN_HONOR";
    /** 城门失败（30+对方损失兵力百分比*40） */
    CrossServerConstType[CrossServerConstType["GATE_FAIL_HONOR"] = 14] = "GATE_FAIL_HONOR";
    /** 内城胜利一场加多少荣誉 */
    CrossServerConstType[CrossServerConstType["CITY_WIN_HONOR"] = 15] = "CITY_WIN_HONOR";
    /** 内城失败（100+对方损失兵力百分比*100） */
    CrossServerConstType[CrossServerConstType["CITY_FAIL_HONOR"] = 16] = "CITY_FAIL_HONOR";
    /** 购买箭塔增加的荣誉值 */
    CrossServerConstType[CrossServerConstType["BUY_TOWER_HONOR"] = 17] = "BUY_TOWER_HONOR";
    /** 购买箭塔需要的荣誉值 */
    CrossServerConstType[CrossServerConstType["BUY_TOWER_PRICE"] = 18] = "BUY_TOWER_PRICE";
    /** 每场获得荣誉的最大值 */
    CrossServerConstType[CrossServerConstType["MAX_HONOR"] = 19] = "MAX_HONOR";
})(CrossServerConstType || (CrossServerConstType = {}));
