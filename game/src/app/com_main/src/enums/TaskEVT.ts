class TASK_EVT {
    public static GLOBAL_TOUCH_END = 1;//全局点击事件
    /**
     * 100000
     * Menu层，如底部操作栏，顶部状态栏等
     * */
    public static MENU_BATTLE_WITHDRAW_FALSE = 101000;//撤退事件服务器返回false时


    /**
     * 200000
     * Map层，世界地图，战斗地图等
     * */

    public static PUSH_BUILD_QUEUE = 2100100;//添加建筑队列
    public static POP_BUILD_QUEUE = 2100101;//删除建筑队列


    /**补兵状态 */
    public static POP_SUPPLEMENT_STATUS = 3100003;

    /**快速补兵状态 */
    public static POP_QUICKLY_SUPPLEMENT_STATUS = 3100004;

    /** 士兵打架状态 */
    public static POP_SOLDIER_FIGHTING_STATUS = 3100005;

    /** 军功任务领赏状态改变 */
    public static POP_MILITARY_TASK_REWARD_CHANGE = 3100006;


    /** 移除角色结果处理 */
    public static POP_REMOVE_ROLE_RESULT = 3100008;

    /**暂停自动升级 */
    public static POP_JEWEL_STOP_AUTOBTN = 3100010;

    /**宝石升级返回 */
    public static POP_JEWEL_UP_RESP = 3100011;

    /**士兵打架刷新 */
    public static POP_SOLDIER_FIGHTING_UPDATE = 3100012;
    /**私聊名单 */
    public static PRIVATE_MEMBER_LIST = 3100013;
    /**私聊返回 */
    public static POP_CHAT_MSG_PUSH_PRIVATE = 3100014;

    ////////// 酒馆 //////////
    /** 酒馆点击切换座位 */
    public static POP_TAVERN_CHANGE_EVENT_TOUCH = 3100020;
    /** 酒馆完成事件 */
    public static POP_TAVERN_FINISHED_EVENT = 3100021;
    /** 酒馆事件进度更新 */
    public static POP_TAVERN_UPDATE_EVENT_PROGRESS = 3100022;
    /** 酒馆放弃事件 */
    public static POP_TAVERN_ABANDON_EVENT = 3100023;

    /**庆典灯笼移除 */
    public static POP_LANTERN_REMOVE = 3100100;
    /**暂停庆典 */
    public static POP_PAUSE_CELEBRATION = 3100101;

    /**对战开启进度 */
    public static POP_VERSUS_OPEN_PROGRESS = 3100200;

    ////////// 科技 //////////
    /**新科技开启 */
    public static POP_TECHNOLOGY_ACTIVE = 3100300;
    /**科技重置 */
    public static POP_TECHNOLOGY_RESET = 3100301;
    /**科技点数变化 */
    public static POP_TECHNOLOGY_POINTS_CHANGE = 3100302;
    /**科技激活变化 */
    public static POP_TECHNOLOGY_ACTIVATE_CHANGE = 3100303;
    //升级
    public static POP_TECHNOLOGY_UPDRADE_CHANGE = 3100304;

    ////////// 军功任务 //////////
    /**卜卦结果处理 */
    public static POP_BOGUA_RESULT = 3100350;
    /**卜卦数据更新 */
    public static POP_BOGUA_DATA_UPDATE = 3100351;
    /**任务更新 */
    public static POP_TASK_DATA_UPDATA = 3100352;
    /**任务刷新倒计时更新 */
    public static POP_TASK_REFRESH_TIME_UPDATE = 3100353;

    /** 军功任务提交完成 */
    public static POP_MILITARY_TASK_COMMIT_FINISH = 3100355;

    ////////// 兵法 //////////
    // /**新兵法开启 */
    // public static POP_WARCRAFT_OPEN_NEW = 3100400;

    /**龙图阁开始制造 */
    public static POP_GARRET_PRODUCE_BTN = 3100500;

    /**武将被抢 */
    public static POP_GENERAL_GRAB = 3100700;

    ////////// 活动 //////////
    /**活动自定义事件 */
    public static POP_THREE_VISITS_UP_STAR = 3100800;
    /**活动状态改变（单个） */
    public static POP_ACTIVITY_SINGLE_STATE_CHANGE = 3100802;

    /**首充状态改变 */
    public static POP_ACTIVITY_FIRST_PAY_STATE_CHANGE = 3100803
    ////////// 功能开启 //////////
    /**新功能开启 */
    public static POP_NEW_FUNCTION_OPEN = 3100901;
    public static POP_NEW_FUNCTION_CLOSE = 3100902;
    /**功能面板开启完毕 */
    public static POP_FUNCTION_PANEL_OPENED = 3100903;
    /**功能面板关闭 */
    public static POP_FUNCTION_PANEL_CLOSE = 3100904;

    ////////// 寺庙 //////////
    /**购买特效 */
    public static POP_TEMPLE_BUY = 3101000;
    /**使用道具更新数量 */
    public static POP_BAG_USE_UPDATE = 3101001;


    // //任务变动（主城显示用）
    // public static MISSION_CHANGE_INFO = 3101103;
    //主线任务可以领取
    // public static MISSSION_MAIN_LINE_FINISH = 3101104;
    //关卡可以进去
    public static PATROL_ARENA_PORT = 3101105;

    /**奖励领取面板 */
    public static ON_GET_REWARD_VIEW_HIDE = 3101300;//奖励获取面板



    /**
     * 400000
     * GUIDE指引层
     * */



    /**
     * 500000
     * TOP顶层层
     * */

    /**
     * 600000
     * OTHER
     * */
}

/**战场buff加成 */
class BattleBuff {
    /**军功加成 */
    public static MilitaryBuff = 1;
    /**经验加成 */
    public static ExpBuff = 2;
}

//一个模块的UI事件加10000
class EventEnum {
    public static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
    // public static CREATE_NOTICE = 'CREATE_NOTICE';   //创建角色
    // public static CONFIG_LOAD_COMPLETE = "CONFIG_LOAD_COMPLETE"; // 配置表加载完成


    public static CITY_BUILDS_UPDATE = "CITY_BUILDS_UPDATE"; //城池信息更新

    public static BATTLE_NOTICE = "BATTLE_NOTICE";//派发战场公告数据，此处由服务端更新
    public static BATTLE_NOTICE_CLIENT = "BATTLE_NOTICE_CLIENT";//派发战场公告数据，此处由客户端计算更新
    public static BATTLE_NOTICE_CHAT = "BATTLE_NOTICE_CHAT";//派发聊天公告数据
    public static BATTLE_FROZEN_SCENE = "BATTLE_FROZEN_SCENE"; //技能冻结
    public static BATTLE_START_SCENE = "BATTLE_START_SCENE"; //恢复冻结

    public static PROP_ITEM_CHANGE = "PROP_ITEM_CHANGE"; //道具数量更新

    public static FIEF_GRAB = "FIEF_GRAB"; //抢封地
    public static FIEF_NOTICE = "FIEF_NOTICE"; //封地提示
    public static FIEF_OPENVIEW = "FIEF_OPENVIEW"; //主界面封地按钮事件
    public static FIEF_WORLD_NOTICE = "FIEF_WORLD_NOTICE"; //世界封地提示
    public static FIEF_CONSTRU = "FIEF_CONSTRU"; //抢封地
    public static FIEF_BUILD_OPENVIEW = "FIEF_BUILD_OPENVIEW"; //城池封地按钮事件
    public static FIEF_OPENVIEW_PRE = "FIEF_OPENVIEW_PRE"; //城池封地按钮事件
    public static FIEF_LOGIN_GETRES = "FIEF_LOGIN_GETRES"; //刚登陆获取封地资源
    public static FIEF_CHECK_CONSTRUCTING = "FIEF_CHECK_CONSTRUCTING"; //查询是否在别处建设
    public static FIEF_CHANGE_TABVIEW = "FIEF_CHANGE_TABVIEW"; //

}

class MapNav {
    public static MAP_CITY_BATTLE_REWARD = "MAP_CITY_BATTLE_REWARD"; // 攻守战奖励面板
    // public static BULLET_FINISH = "BULLET_FINISH";

    public static MAP_BUILD_INFO = "MAP_BUILD_INFO";//世界地图建筑信息

    public static WORLD_COLLECT_RES_TIMER_FININSH = "WORLD_RES_TIMER_FININSH"//采集定时器完成的
}



/**战斗单位 */
class UnitNav {
    /**关键帧 */
    public static KEY_FRAME = "KEY_FRAME";
    /**动作完成 */
    public static ACTION_FINISH = "ACTION_FINISH";
    /**方阵移动 */
    public static SQUARE_MOVE = "SQUARE_MOVE";
    /**方阵添加 */
    public static SQUARE_ADD = "SQUARE_ADD";
    /**方阵移除 */
    public static SQUARE_REMOVE = "SQUARE_REMOVE";
    /**战场建筑血量改变 */
    public static ATTR_BBUILD_HP = "ATTR_BBUILD_HP";
    /**战场单位从战场离开 */
    public static UNIT_DISAPPEAR = "UNIT_DISAPPEAR";
}

/**技能 */
class SkillNav {
    /**发射技能 */
    public static FIGHT_SKILL = "FIGHT_SKILL";
}

/**战法 */
class SpellNav {
    public static SPELL_TOUCH = "SPELL_TOUCH";
}

/**场景事件 */
class SceneEvent {
    /**场景切换 */
    public static CHANGE_COMPLETE = "CHANGE_COMPLETE";
    /**隐藏总览 */
    public static HIDE_OVER_VIEW = "SCENE_HIDE_OVER_VIEW";
}


/**玩家事件 */
class PlayerEvent {
    /**属性改变 */
    public static ATTR_UPDATE = "ATTR_UPDATE";
}

/**角色事件 */
class RoleEvent {
    /**等级 */
    public static ROLE_LEVLE = "ROLE_LEVLE";
    /**经验 */
    public static ROLE_EXP = "ROLE_EXP";
    /**vip等级 */
    public static ROLE_VIP_LEVLE = "ROLE_VIP_LEVLE";
    /**vip经验 */
    public static ROLE_VIP_EXP = "ROLE_VIP_EXP";

    /**军功等级 */
    public static ROLE_MILITARY_LEVLE = "ROLE_MILITARY_LEVLE";
    /**军功经验 */
    public static ROLE_MILITARY_EXP = "ROLE_MILITARY_EXP";


    /**军功奖励经验 */
    public static ROLE_MILITARY_WEEK_EXP = "ROLE_MILITARY_SHOP_EXP"

    /**擂台等级 */
    public static ROLE_ARENA_LEVEL = "ROLE_ARENA_LEVEL";
    /**擂台经验 */
    public static ROLE_ARENA_EXP = "ROLE_ARENA_EXP";

    /**资源更新 */
    public static ROLE_RESOURCE = "ROLE_RESOURCE";

    /**税收变更 */
    public static ROLE_TAX = "ROLE_TAX"

    /**国家更变 */
    public static ROLE_COUNTRY = "ROLE_COUNTRY";

    /**官职更变 */
    public static ROLE_GOVERMENT = "ROLE_GOVERMENT";

    /**联盟更变 */
    public static ROLE_ALLIANCE = "ROLE_ALLIANCE";

    /**战斗力更变 */
    public static ROLE_FIGHT = "ROLE_FIGHT";

    /**名字更变 */
    public static ROLE_NAME = "ROLE_NAME";
    /**名字更变 */
    public static ROLE_HEADIMG = "ROLE_HEADIMG";
    /**兑换码兑换 */
    public static GIFT_DUIHUAN = "GIFT_DUIHUAN";
}

/**战斗界面事件 */
class BattleEvent {
    /**进入战斗 */
    public static BATTLE_ENTER = "BATTLE_ENTER";
    public static BATTLE_PLAY_SKILL = "BATTLE_PLAY_SKILL";
    public static BATTLE_UNIT_ATTR_CHANGE = "BATTLE_UNIT_ATTR_CHANGE";
    public static BATTLE_BLOOD_CHANGE = "BATTLE_BLOOD_CHANGE";
    public static BATTLE_CHANGE_PLAYER_STATUS = "BATTLE_CHANGE_PLAYER_STATUS";
    public static BATTLE_GENERAL_USE_SKILL = "BATTLE_GENERAL_USE_SKILL";
    public static BATTLE_CHANGE_QUEUE = "BATTLE_CHANGE_QUEUE";
    public static BATTLE_SIEGE_END = "BATTLE_SIEGE_END";  //攻城战事件
    public static BATTLE_SIEGE_SELF = "BATTLE_SIEGE_SELF"; //个人攻城所有事件更新
    public static BATTLE_START_RUN = "BATTLE_START_RUN"; //战斗开始跑
    public static BATTLE_CHANGE_MAP = "BATTLE_CHANGE_MAP"; //切换地图
    public static CITY_ITEM_COUNT_UPDATE = "CITY_ITEM_COUNT_UPDATE"; //攻城战队伍数量变更
    public static BATTLE_OVER = "BATTLE_OVER"; //战斗结束

    public static BATTLE_PLAY_GENGERAL_DIE = "BATTLE_PLAY_GENGERAL_DIE"; //显示死亡动画
    // public static BATTLE_PLAY_DEF_GENGERAL_DIE = "BATTLE_PLAY_DEF_GENGERAL_DIE"; //显示防守死亡动画
}

/**武将事件 */
class GeneralEvent {
    /**武将初始化 */
    public static GENERAL_INIT = "GENERAL_INIT";
    /**武将获得 */
    public static GENERAL_GET = "GENERAL_GET";
    /**武将升级 */
    public static GENERAL_LEVEL = "GENERAL_LEVEL";
    /**武将突破 */
    public static GENERAL_TUPODAN = "GENERAL_TUPODAN";
    /**武将经验 */
    public static GENERAL_EXP = "GENERAL_EXP";
    /**武将升星 */
    public static GENERAL_STAR = "GENERAL_STAR";
     /**武将属性变动 */
    public static GENERAL_ATTRI_CHANGE = "GENERAL_ATTRI_CHANGE";
    /**武将技能升级 */
    public static GENERAL_SKILL = "GENERAL_SKILL";
    /**武将穿戴装备 */
    public static GENERAL_EQUIP_IN = "GENERAL_EQUIP_IN";
    /**装备变动 */
    public static GENERAL_EQUIP_CHANGE = "GENERAL_EQUIP_CHANGE";
    /**装备强化 */
    public static GENERAL_EQ_STRENG = "GENERAL_EQ_STRENG";

    /**装备合成 */
    public static GENERAL_EQ_COMPOSE = "GENERAL_EQ_COMPOSE";

    /**宝物变动 */
    public static GENERAL_EQUIP_TREA = "GENERAL_EQUIP_TREA";

    /**武将获得界面关闭 */
    public static GENERAL_GET_WND_CLOSE = "GENERAL_GET_WND_CLOSE";
}
class FateEvent {
    /**缘分数据变动 */
    public static FATE_DATA_CHANGE = "FATE_DATA_CHANGE";
}
/**聚宝盆事件 */
class CornucopiaEvent {
    /**数据更新 */
    // public static CORN_UPDATE = "CORN_UPDATE";
    /**领取时间 */
    public static CORN_TIME_UPDATE = "CORN_TIME_UPDATE";
}

/**vip事件 */
class VipEvent {
    /**数据更新 */
    public static VIP_UPDATE = "VIP_UPDATE";
}

/**章节事件 */
class QuarterEvent {
    /**更新次数 */
    public static QUARTER_UPDATE_NUM = "QUARTER_UPDATE_NUM";
    /**章節信息更新 */
    public static QUARTER_INFO_UPDATE = 'QUARTER_INFO_UPDATE';
    /**信息扫荡最大上限次数更新 */
    public static QUARTER_INFO_NUM = 'QUARTER_INFO_NUM';
}
/**历史战役事件更新 */
class HistoryWarEvent {
    /**更新次数 */
    public static HISTORY_UPDATE_NUM = "HISTORY_UPDATE_NUM";
}
/**竞技场事件 */
class ArenaEvent {
    /**更新次数 */
    public static ARENA_UPDATE_NUM = "ARENA_UPDATE_NUM";
}

/**过关斩将事件 */
class PassWarEvent {
    /**更新次数 */
    public static PASS_WAR_UPDATE_FREE = "PASS_WAR_UPDATE_FREE";

}


/**材料副本 */
class MaterialEvent {
    /**数据更新 */
    public static MATERIAL_INFO_UPDATE = "MATERIAL_INFO_UPDATE";
}

/**科技事件 */
class TechnologyEvent {
    public static TECHNOLOGY_TIME_UP = "TECHNOLOGY_TIME_UP";
    public static TECHNOLOGY_INFO_UPDATE = "TECHNOLOGY_INFO_UPDATE";
    public static TECHNOLOGY_INFO_WND_SWICTH = "TECHNOLOGY_INFO_WND_SWICTH";
}

/**酒馆事件 */
class TavernEvent {
    /**免费次数 */
    public static TAVERN_UPDATE_FREE = "TAVERN_UPDATE_FREE";
}

/**挂机事件 */
class PatrolEvent {
    /**信息刷新 */
    public static PATROL_INFO_UPDATE = "PATROL_INFO_UPDATE";
    /**时间刷新 */
    public static PATROL_TICK_UPDATE = "PATROL_TICK_UPDATE";
    /**boss重置 */
    public static PATROL_BOSS_RESET = "PATROL_BOSS_RESET";
    /**领奖刷新 */
    public static PATROL_AWARD_UPDATE = "PATROL_AWARD_UPDATE";
    /**随机英雄跑到尽头 */
    public static PATROL_GENERAL_END = "PATROL_GENERAL_END";
    /**怪物死亡 */
    public static PATROL_KILL_MONSTER = "PATROL_KILL_MONSTER";
    /**飞行动画结束 */
    public static PATROL_FLY_END = "PATROL_FLY_END";
    /**boos 来袭特效 */
    public static PATRAL_BOSS_ATTACK_EFF = "PATRAL_BOSS_ATTACK_EFF"
}

/**boss事件 */
class BossEvent {
    /**boss信息刷新 */
    public static BOSS_INFO_UPDATE = "BOSS_INFO_UPDATE";
}

/**建造事件 */
class BuildEvent {
    /**建筑队列刷新 */
    public static BUILD_QUEUE_CHANGE = "BUILD_QUEUE_CHANGE";
    /**建筑升级 */
    public static BUILD_UP_LEVEL = "BUILD_UP_LEVEL";
    /**建筑激活 */
    public static BUILD_ACTIVATED = "BUILD_ACTIVATED";
    /**建筑快速升级 */
    public static BUILD_FAST_UP_LEVEL = "BUILD_FAST_UP_LEVEL";
    /**建筑信息刷新 */
    public static BUILD_REFRESH = "BUILD_REFRESH";
    /**建筑泡泡 */
    public static BUILD_PAOPAO_UPDATE = "BUILD_PAOPAO_UPDATE";


    /**检测建筑升级状态 */
    public static CHECK_BUILD_LV_STATE = "CHECK_BUILD_LV_STATE";

    /**兵营训练 */
    public static SOLDIER_TRAIN = "SOLDIER_TRAIN";
    /**兵种进阶 */
    public static SOLDIER_UPGRADE = "SOLDIER_UPGRADE";
}

class MailEvent {
    /**读取邮件 */
    public static READ_MAIL = "READ_MAIL";
    /**刷新邮件 */
    public static REFRESH_MAIL = "REFRESH_MAIL";
    /**领取附件 */
    public static GET_ATTACHMENT = "GET_ATTACHMENT";
}

class TaskWorldEvent {
    /**创建上阵英雄 */
    public static RANK_CREATE_ARMY = "RANK_CREATE_ARMY";
    /**创建当前位置的英雄 */
    public static RANK_CREATE_POINT_ARMY = "RANK_CREATE_POINT_ARMY";
    /**删除上阵英雄 */
    public static RANK_REMOVE_ARMY = "RANK_REMOVE_ARMY";
    /**删除当前位置的英雄 */
    public static RANK_REMOVE_POINT_ARMY = "RANK_REMOVE_POINT_ARMY";
    /**检查上阵碰撞 */
    public static RANK_CHECK_HIT = "RANK_CHECK_HIT";
    /**显示行军列队的操作 */
    public static QUEUE_SHOW_OPERATE = "QUEUE_SHOW_OPERATE";
    /**隐藏行军列队的操作 */
    public static QUEUE_HIDE_OPERATE = "QUEUE_HIDE_OPERATE";

    /**搜索tab切换 */
    public static SEARCH_TAB = "SEARCH_TAB";
    /**警报 */
    public static WARN_UPDATE = "WARN_UPDATE";

    /**客户端更新行军队伍 */
    public static CLIENT_MOVE_UPDATE = "CLIENT_MOVE_UPDATE";

    /**城池驻军数据 */
    public static WORLD_CITY_TROOP = "WORLD_CITY_TROOP"
    /**城池队伍变更 */
    public static WORLD_CITY_TEAM_UPDATE = "WORLD_CITY_TEAM_UPDATE";

    /**城池队伍状态变更 */
    public static WORLD_CITY_MOVE_LIST_UPDATE = "WORLD_CITY_MOVE_LIST_UPDATE";

    /**城池更新 */
    public static WORLD_CITY_UPDATE = "WORLD_CITY_UPDATE"



    /**城池移动 */
    public static WORLD_CITY_MOVE = "WORLD_CITY_MOVE"

    /**军功奖励变更 */
    public static EXPLOIT_AWARD_UPDATE = "EXPLOIT_AWARD_UPDATE";

    /**更新资源显示 */
    public static WORLD_CITY_RES_UPDATE = "WORLD_CITY_RES_UPDATE"

    /**保存补兵 */
    public static WORLD_SAVE_AUTO_TROOP = "WORLD_SAVE_AUTO_TROOP";

    /**拖动更新 */
    public static WORLD_TROOP_BTN_UPDATE = "WORLD_TROOP_BTN_UPDATE"

    /**出征面板点击空队伍 */
    public static WORLD_HERO_WND_EMPTY_CLICK = "WORLD_HERO_WND_EMPTY_CLICK"

    /**事件刷新 */
    public static WORLD_UPDATE_EVENT_UPDATE = "WORLD_UPDATE_EVENT_UPDATE"

    /**更新部队列表 */
    public static WORLD_UPDATE_LIST = "WORLD_UPDATE_LIST";

    /** 更新城池建造 */
    public static WORLD_BUILD_UPDATE = 'WORLD_BUILD_UPDATE';
    public static WORLD_BUILD_HERO_DEL = 'WORLD_BUILD_HERO_DEL';

    /** 更新荣誉奖励 */
    public static CROSS_RANK_RY = 'CROSS_RANK_RY';
}

class ActivityEvent {
    /**新活动开启*/
    public static ACTIVITY_NEW_OPEN = "ACTIVITY_NEW_OPEN";

    /**充值后单笔累计充值界面刷新 */
    public static ACTIVITY_RECHARGE_SUCC = 'ACTIVITY_RECHARGE_SUCC';
     /**勾玉购买勾玉超市物品成功刷新 */
    public static ACTIVITY_YU_BUY_SUCC = 'ACTIVITY_YU_BUY_SUCC';

    /**累计充值刷新 */
    public static ACTIVITY_ADD_CHARGE = 'ACTIVITY_ADD_CHARGE';
    /**单笔充值刷新 */
    public static ACTIVITY_SINGLE_CHARGE = 'ACTIVITY_SINGLE_CHARGE';
    /**消费豪礼 */
    public static ACTIVITY_CONSUME_GIFT = 'ACTIVITY_CONSUME_GIFT';
    /**7天登陆 */
    public static ACTIVITY_LOGIN_DAY = 'ACTIVITY_LOGIN_DAY';
    /**月卡周卡 */
    public static ACTIVITY_MOON_CARD = 'ACTIVITY_MOON_CARD';
    /**成长基金 */
    public static ACTIVITY_GROWTH_FUN = 'ACTIVITY_GROWTH_FUN';
    /**直购礼包活动 */
    public static ACTIVITY_PU_GIFT = 'ACTIVITY_PU_GIFT';

    /**一元购 */
    public static ACTIVITY_ONE_GIFT_BAG = 'ACTIVITY_ONE_GIFT_BAG';

    /**月签到 */
    public static ACTIVITY_SIGN_MONTH = 'ACTIVITY_SIGN_MONTH';

    /**南蛮入侵 */
    public static ACTIVITY_BREAK_OUT = 'ACTIVITY_BREAK_OUT';
    /**限时活动购买刷新 */
    public static ACTIVITY_GIFT_BAG_BUY = 'ACTIVITY_GIFT_BAG_BUY';
    /**限时活动领取刷新 */
    public static ACTIVITY_GIFT_BAG_LINGQU = 'ACTIVITY_GIFT_BAG_LINGQU';
    /**限时活动图标红点刷新 */
    public static ACTIVITY_GIFT_BAG_UPDATE = 'ACTIVITY_GIFT_BAG_UPDATE';
    /**幸运转盘刷新 */
    public static ACTIVITY_TURNTABLE_UPDATE = 'ACTIVITY_TURNTABLE_UPDATE';
    /**幸运转盘宝箱刷新 */
    public static ACTIVITY_TURNTABLE_BOX_UPDATE = 'ACTIVITY_TURNTABLE_BOX_UPDATE';

    /**新武将信息 */
    public static ACTIVITY_NEW_GENERAL_INFO = 'ACTIVITY_NEW_GENERAL_INFO';
    /** 新武将选择奖励 */
    public static ACTIVITY_NEW_GENERAL_CHOOSE_REWARD = 'ACTIVITY_NEW_GENERAL_CHOOSE_REWARD';
    /**新武将拜访 */
    public static ACTIVITY_NEW_GENERAL_VISIT_REWARD = 'ACTIVITY_NEW_GENERAL_VISIT_REWARD';
    /**新武将领取宝箱奖励 */
    public static ACTIVITY_NEW_GENERAL_BOX_REWARD = 'ACTIVITY_NEW_GENERAL_BOX_REWARD';
    /**新武将限购 */
    public static ACTIVITY_NEW_GEN_LIM = 'ACTIVITY_NEW_GEN_LIM';
    /**新武将拜访红点 */
    public static ACTIVITY_NEW_GEN_VIS_RED = 'ACTIVITY_NEW_GEN_VIS_RED';
    /**新7天聚宝盆红点 */
    public static AC_7DAY_COR = 'AC_7DAY_COR';
    /**新7天聚宝盆活动 */
    public static ACTIVITY_NEW_7DAY_COR = 'ACTIVITY_NEW_7DAY_COR';
    /**新7天聚宝盆抽奖 */
    public static ACTIVITY_NEW_7DAY_COR_REWARD = 'ACTIVITY_NEW_7DAY_COR_REWARD';
    /**襄阳战个人挑战奖更新 */
    public static PLAYER_BATTLE_REWARD_UPDATE = 'PLAYER_BATTLE_REWARD_UPDATE';
    /**获得商城信息 */
    public static ACTIVITY_PREFERENTAIL_STORE_INFO = 'PLAYER_BATTLE_REWARD_UPDATE';
    /**手动刷新 */
    public static ACTIVITY_PREFERENTAIL_REFRESH = 'ACTIVITY_PREFERENTAIL_REFRESH';
    /**商城购买物品 */
    public static ACTIVITY_PREFERENTAIL_STORE_BUY = 'ACTIVITY_PREFERENTAIL_STORE_BUY';

}

class OnLineEvent {
    public static ONLINE_UPDATE = 'ONLINE_UPDATE';
}
/**重生刷新信息 */
class RebirthEvent {
    public static REBIRTH_UPDATE = 'REBIRTH_UPDATE';
}

class TeamUIEvent {
    /**挑战按钮点击 */
    public static TEAM_BTN_FIGHT = "TEAM_BTN_FIGHT";
    /**更新上阵信息 */
    public static TEAM_UPDATE_GIRD_INFO = "TEAM_UPDATE_GIRD_INFO";
    public static TEAM_UPDATE_MAX_NUM = "TEAM_UPDATE_MAX_NUM";

}
/**招募事件 */
class ArmyEvent {
    /**训练完成事件 */
    public static ARMY_FINISH = "ARMY_FINISH"
}
class TkCampEvent {
    /**创建上阵英雄 */
    public static CAMP_CREATE_ARMY = "CAMP_CREATE_ARMY";
    /**创建当前位置的英雄 */
    public static CAMP_CREATE_POINT_ARMY = "CAMP_CREATE_POINT_ARMY";
    /**删除上阵英雄 */
    public static CAMP_REMOVE_ARMY = "CAMP_REMOVE_ARMY";
    /**删除当前位置的英雄 */
    public static CAMP_REMOVE_POINT_ARMY = "CAMP_REMOVE_POINT_ARMY";
    /**检查上阵碰撞 */
    public static CAMP_CHECK_HIT = "CAMP_CHECK_HIT";
    /**更新军营的练兵营的兵力显示 */
    public static CAMP_TROOPS_TYPE = "CAMP_TROOPS_TYPE";
    /**更新上阵英雄 */
    public static CAMP_HERO_LIST = "CAMP_HERO_LIST";
    /**更新临时上阵英雄 */
    public static CAMP_HERO_TEMP = "CAMP_HERO_TEMP";
    /**更新军营的是否更改状态 */
    public static CAMP_UPDATE_BTN = "CAMP_UPDATE_BTN";
    /**更新上阵信息 */
    public static CAMP_UPDATE_INFO = "CAMP_UPDATE_INFO";
}

class EquipEvent {
    /**装备回收+ */
    public static EQUIP_DECOMPOSE_ADD = 'EQUIP_DECOMPOSE_ADD';
    /**装备回收- */
    public static EQUIP_DECOMPOSE_DEL = 'EQUIP_DECOMPOSE_DEL';
    /**全选 */
    public static EQUIP_DECOMPOSE_ALL_TICK = 'EQUIP_DECOMPOSE_ALL_TICK';
    /**单选 */
    public static EQUIP_DECOMPOSE_ONE_TICK = 'EQUIP_DECOMPOSE_ONE_TICK';

}

/**背包事件 */
class BagEvent {
    /**背包格子选中 */
    public static BAG_SELECTED_CHANGE = 'BAG_SELECTED_CHANGE';
    /**背包增加 */
    public static BAG_ITEM_ADD = 'BAG_ITEM_ADD';
    /**背包删减 */
    public static BAG_ITEM_DEL = 'BAG_ITEM_DEL';
    /**背包删减 */
    public static BAG_ITEM_UPDATE = 'BAG_ITEM_UPDATE';
    /**背包新物品状态移除 */
    public static BAG_STATE_DEL = "BAG_STATE_DEL";

}

/**聊天事件 */
class ChatEvent {
    /**聊天消息更新 */
    public static MSG_UPDATE = 'MSG_UPDATE';
    /**聊天消息更新 */
    public static MSG_STATE_UPDATE = 'MSG_STATE_UPDATE';
    /**头像更新 */
    public static CHAT_HEAD_UPDATE = 'CHAT_HEAD_UPDATE';
    /**头像列表更新 */
    public static CHAT_HEAD_ADD = 'CHAT_HEAD_ADD';
    public static CHAT_HEAD_DEL = 'CHAT_HEAD_DEL';
    /**私聊消息清理 */
    public static CHAT_MSG_PRI_CLEAR = 'CHAT_MSG_PRI_CLEAR';

    /**黑名单增加 */
    public static CHAT_BLACK_LIST_ADD = 'CHAT_BLACK_LIST_ADD';
    /**黑名单减少 */
    public static CHAT_BLACK_LIST_DEL = 'CHAT_BLACK_LIST_DEL';
}

/**任务事件 */
class MissionEvent {
    /**任务数据改变 */
    public static MISSION_UPDATE_INFO = 'MISSION_UPDATE_INFO';
    /**添加任务 */
    public static MISSION_ADD_INFO = 'MISSION_ADD_INFO';
    /**删除 */
    public static MISSION_DELETE_INFO = 'MISSION_DELETE_INFO';
    /**活跃度 */
    public static MISSION_UPDATE_LIVENESS = 'MISSION_UPDATE_LIVENESS';
    /**国家任务 */
    public static MISSION_COUNTRY = 'MISSION_COUNTRY';
}

/**联盟事件 */
class LegionEvent {
    /**科技更新 */
    public static LEGION_TECH_UPDATE = 'LEGION_TECH_UPDATE';
    /**联盟信息变化 */
    public static LEGION_INFO_CHANGE = "LEGION_INFO_CHANGE";
}

/**宝物事件 */
class TreaEvent {
    /**宝物获得 */
    public static TREA_ADD = 'TREA_ADD';
    /**升级 */
    public static TREA_LEVEL_UPDATE = 'TREA_LEVEL_UPDATE';
    /**升星 */
    public static TREA_STAR_UPDATE = "TREA_STAR_UPDATE";
    /**宝石镶嵌 */
    public static TREA_STONE_UPDATE = "TREA_STONE_UPDATE";
}

/**常规事件 */
class NormalEvent {
    /**方法次数更新 */
    public static NORMAL_FUN_COUNT = 'NORMAL_FUN_COUNT';
    /**弹窗变化 */
    public static POP_PANEL_UPDATE = 'POP_PANEL_UPDATE';
     /**服务器跨天 */
    public static NORMAL_CROSS_DAY = 'NORMAL_CROSS_DAY';
}

/**功能开启时间 */
class FunctionEvent {
    /**新功能开启 */
    public static NEW_FUNC_OPEN = "NEW_FUNC_OPEN";
    /**新预览开启 */
    public static NEW_PRE_FUNC_OPEN = "NEW_PRE_FUNC_OPEN"
}

class GuideEvent {
    // public static GUIDE_SEND_NOVICE_BATTLE = "GUIDE_SEND_NOVICE_BATTLE"; //发起新手战斗


    /**是否可以执行引导 */
    public static GUIDE_ON_CHECK = "GUIDE_ON_CHECK";
    /*条件触发 */
    public static GUIDE_ON_CONDITION = "GUIDE_ON_CONDITION";
    /**完成点击 */
    public static GUIDE_TOUCH_FINISH = "GUIDE_TOUCH_FINISH";
    /**引导完成 */
    public static GUIDE_FINISH = "GUIDE_FINISH";

    /**指引开始战斗 （战前动画）*/
    public static GUIDE_START_BATTLE = "GUIDE_START_BATTLE";

    /**完成保存 */
    public static GUIDE_SAVE_FINISH = "GUIDE_SAVE_FINISH";

    /**跳过主城战斗剧情 */
    public static GUIDE_SKIP_PLOT = "GUIDE_SKIP_PLOT";

    /**剧情对话结束 */
    public static GUIDE_DIALOGUE_END = "GUIDE_DIALOGUE_END";


    //==========================================================执行时机（不可乱删 事件配表，引用索引不到）======================================    
    /**武将合成动画结束 */
    public static GUIDE_GENERAL_COMPOUND_ANI = "GUIDE_GENERAL_COMPOUND_ANI";

    /**胜利结算界面动画结束 */
    public static GUIDE_BATTLE_WIN_COMPOUND_ANI = "GUIDE_BATTLE_WIN_COMPOUND_ANI";

    //==========================================================检测判断类型===================================

    /**检测国家 */
    public static GUIDE_CHECK_COUNTRY = "GUIDE_CHECK_COUNTRY";
    /**检测场景 */
    public static GUIDE_CHECK_SCENE = "GUIDE_CHECK_SCENE"; //场景
    /**检测战斗状态 */
    public static GUIDE_CHECK_BATTLESTATE = "GUIDE_CHECK_BATTLESTATE"; //战斗状态
    /**检测关卡id */
    public static GUIDE_CHECK_LEVELID = "GUIDE_CHECK_LEVELID"; //战斗Id
    /**检测建筑升级面板id */
    public static GUIDE_CHECK_BUILDPANELID = "GUIDE_CHECK_BUILDPANELID";//建筑升级面板id
    /**检测主界面菜单栏是否打开 */
    public static GUIDE_CHECK_MENUSTATE = "GUIDE_CHECK_MENUSTATE";//菜单状态
}

/**国家模块事件 */
class CountryEvent {
    /**官职领奖 */
    public static COUNTRY_SALARY_UPDATE = "COUNTRY_SALARY_UPDATE";
    /**国家情报 */
    public static CITY_CHANGE = "CITY_CHANGE";
    /**官职任命 */
    public static COUNTRY_JOB_APPLY_UP = "COUNTRY_JOB_APPLY_UP";
    /**国家信息 */
    public static COUNTRY_INFO = "COUNTRY_INFO";
    /**官职领奖 */
    public static COUNTRY_SALARY = "COUNTRY_SALARY";
    /**弹劾 */
    public static COUNTRY_START_IMPEACH = "COUNTRY_START_IMPEACH";
    /**弹劾投票 */
    public static COUNTRY_VOTE_IMPEACH = "COUNTRY_VOTE_IMPEACH";
    /**城池任命 */
    public static COUNTRY_CITY_APPLY_UP = "COUNTRY_CITY_APPLY_UP";
    /**城池信息 */
    public static COUNTRY_CITY_INFO = "COUNTRY_CITY_INFO";
    /**税收状态 */
    public static COUNTRY_CITY_REVENUE_STATUS = "COUNTRY_CITY_REVENUE_STATUS";
    /**税收 */
    public static COUNTRY_CITY_REVENUE = "COUNTRY_CITY_REVENUE";
    
}

/**跨服战 */
class CrossWarEvent{
     /**跨服战状态切换 */
    public static CROSS_SERVER_STATUS = 'CROSS_SERVER_STATUS';
    /**城门血量更新 */
    public static CROSS_WALL_UPDATE = 'CROSS_WALL_UPDATE';
    public static CROSS_WALL_STATUS = 'CROSS_WALL_STATUS';

    /**显示城池信息 */
    public static CROSS_BUILD_INFO = 'CROSS_BUILD_INFO';
}