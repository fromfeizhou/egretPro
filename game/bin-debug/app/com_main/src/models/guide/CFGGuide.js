/**
 * 配置表预定义[本文件由工具生成]
 */
/** 指引枚举 */
var IGUIDECD;
(function (IGUIDECD) {
    /** 场景切换|所有弹窗关闭 */
    IGUIDECD[IGUIDECD["SCENE"] = 1] = "SCENE";
    /** 武将列表界面 */
    IGUIDECD[IGUIDECD["GEN_LIST_WND"] = 2] = "GEN_LIST_WND";
    /** 已拥有武将创建完毕 */
    IGUIDECD[IGUIDECD["GEN_LIST_CR"] = 3] = "GEN_LIST_CR";
    /** 武将获得动画完毕 */
    IGUIDECD[IGUIDECD["GEN_GET_WND"] = 4] = "GEN_GET_WND";
    /** 武将信息界面 */
    IGUIDECD[IGUIDECD["GEN_INFO_WND"] = 5] = "GEN_INFO_WND";
    /** 武将强化切卡 */
    IGUIDECD[IGUIDECD["GEN_TAB_UP"] = 6] = "GEN_TAB_UP";
    /** 武将技能切卡 */
    IGUIDECD[IGUIDECD["GEN_TAB_SKILL"] = 7] = "GEN_TAB_SKILL";
    /** 武将宝物切卡 */
    IGUIDECD[IGUIDECD["GEN_TAB_TREA"] = 8] = "GEN_TAB_TREA";
    /** 武将技能升级界面 */
    IGUIDECD[IGUIDECD["GEN_SKILL_WND"] = 9] = "GEN_SKILL_WND";
    /** 酒馆主界面 */
    IGUIDECD[IGUIDECD["TAV_WND"] = 10] = "TAV_WND";
    /** 酒馆奖励界面 */
    IGUIDECD[IGUIDECD["TAV_AWARD_WND"] = 11] = "TAV_AWARD_WND";
    /** 动态按钮菜单 */
    IGUIDECD[IGUIDECD["MENU_OTHER"] = 12] = "MENU_OTHER";
    /** 挂机菜单 */
    IGUIDECD[IGUIDECD["MENU_HANG"] = 13] = "MENU_HANG";
    /** 世界地图菜单 */
    IGUIDECD[IGUIDECD["MENU_WORD"] = 14] = "MENU_WORD";
    /** 主城菜单 */
    IGUIDECD[IGUIDECD["MENU_CITY"] = 15] = "MENU_CITY";
    /** 战斗菜单 */
    IGUIDECD[IGUIDECD["MENU_BATTLE"] = 16] = "MENU_BATTLE";
    /** 布阵 */
    IGUIDECD[IGUIDECD["CAMP_WND"] = 17] = "CAMP_WND";
    /** 锻造主界面 */
    IGUIDECD[IGUIDECD["EQUIP_WND"] = 18] = "EQUIP_WND";
    /** 锻造装备切卡 */
    IGUIDECD[IGUIDECD["EQUIP_TAB_EQ"] = 19] = "EQUIP_TAB_EQ";
    /** 锻造强化切卡 */
    IGUIDECD[IGUIDECD["EQUIP_TAB_UP"] = 20] = "EQUIP_TAB_UP";
    /** 锻造进阶切卡 */
    IGUIDECD[IGUIDECD["EQUIP_TAB_GR"] = 21] = "EQUIP_TAB_GR";
    /** 锻造精练切卡 */
    IGUIDECD[IGUIDECD["EQUIP_TAB_WR"] = 22] = "EQUIP_TAB_WR";
    /** boss主界面 */
    IGUIDECD[IGUIDECD["BOSS_WND"] = 23] = "BOSS_WND";
    /** 个人boss切卡 */
    IGUIDECD[IGUIDECD["BOSS_TAB_PRI"] = 24] = "BOSS_TAB_PRI";
    /** 排行boss切卡 */
    IGUIDECD[IGUIDECD["BOSS_TAB_RANK"] = 25] = "BOSS_TAB_RANK";
    /** 世界boss切卡 */
    IGUIDECD[IGUIDECD["BOSS_TAB_WOR"] = 26] = "BOSS_TAB_WOR";
    /** 军备主界面 */
    IGUIDECD[IGUIDECD["ARMY_WND"] = 27] = "ARMY_WND";
    /** 军备步兵切卡 */
    IGUIDECD[IGUIDECD["ARMY_TAB_BB"] = 28] = "ARMY_TAB_BB";
    /** 军备骑兵切卡 */
    IGUIDECD[IGUIDECD["ARMY_TAB_QB"] = 29] = "ARMY_TAB_QB";
    /** 切换枪兵卡 */
    IGUIDECD[IGUIDECD["ARMY_TAB_QIANB"] = 30] = "ARMY_TAB_QIANB";
    /** 军备弓兵切卡 */
    IGUIDECD[IGUIDECD["ARMY_TAB_GB"] = 31] = "ARMY_TAB_GB";
    /** 练兵 */
    IGUIDECD[IGUIDECD["ARMY_TAB_TRAI"] = 32] = "ARMY_TAB_TRAI";
    /** 升阶 */
    IGUIDECD[IGUIDECD["ARMY_TAB_UP"] = 33] = "ARMY_TAB_UP";
    /** 升級界面 */
    IGUIDECD[IGUIDECD["BUILD_LEVEL_WND"] = 34] = "BUILD_LEVEL_WND";
    /** 加速界面 */
    IGUIDECD[IGUIDECD["SPEED_WND"] = 35] = "SPEED_WND";
    /** 物资征战主界面 */
    IGUIDECD[IGUIDECD["MATERIA_CAMP_WND"] = 36] = "MATERIA_CAMP_WND";
    /** 主城建筑 */
    IGUIDECD[IGUIDECD["MAIN_BUILD"] = 37] = "MAIN_BUILD";
    /** 竞技场 */
    IGUIDECD[IGUIDECD["PVP_WND"] = 38] = "PVP_WND";
    /** 名将副本主界面 */
    IGUIDECD[IGUIDECD["QUARTER_WND"] = 39] = "QUARTER_WND";
    /** 名将副本详细 */
    IGUIDECD[IGUIDECD["QUARTER_INFO_WND"] = 40] = "QUARTER_INFO_WND";
    /** 挂机战斗初始化 */
    IGUIDECD[IGUIDECD["WAR_HANG_INIT"] = 41] = "WAR_HANG_INIT";
    /** 战斗开始 */
    IGUIDECD[IGUIDECD["WAR_BEGIN"] = 42] = "WAR_BEGIN";
    /** 战斗结束 */
    IGUIDECD[IGUIDECD["WAR_END"] = 43] = "WAR_END";
    /** 名将副本 */
    IGUIDECD[IGUIDECD["WAR_GEN_INIT"] = 44] = "WAR_GEN_INIT";
    /** 世界地图布阵 */
    IGUIDECD[IGUIDECD["WORLD_CAMP_WND"] = 45] = "WORLD_CAMP_WND";
    /** 世界资源 */
    IGUIDECD[IGUIDECD["WORLD_RESOURCE"] = 46] = "WORLD_RESOURCE";
    /** 采集菜单 */
    IGUIDECD[IGUIDECD["MENU_COLLECT"] = 47] = "MENU_COLLECT";
    /** 事件队伍选择 */
    IGUIDECD[IGUIDECD["WORLD_EVT_SEL_WND"] = 48] = "WORLD_EVT_SEL_WND";
    /** 拜访界面 */
    IGUIDECD[IGUIDECD["WORLD_VISIT_WND"] = 49] = "WORLD_VISIT_WND";
    /** 出征队伍 拜访武将 选择界面 */
    IGUIDECD[IGUIDECD["WORLD_FIGHT_SEL_WND"] = 50] = "WORLD_FIGHT_SEL_WND";
    /** 新手战斗 */
    IGUIDECD[IGUIDECD["GUIDE_WAR_PROCESS"] = 51] = "GUIDE_WAR_PROCESS";
    /** 解锁面板 */
    IGUIDECD[IGUIDECD["WORLD_LOCKED_WND"] = 52] = "WORLD_LOCKED_WND";
    /** 聚宝盆主界面 */
    IGUIDECD[IGUIDECD["CORNUCOPIA_WND"] = 53] = "CORNUCOPIA_WND";
})(IGUIDECD || (IGUIDECD = {}));
