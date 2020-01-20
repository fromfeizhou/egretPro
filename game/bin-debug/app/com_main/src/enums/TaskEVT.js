var TASK_EVT = /** @class */ (function () {
    function TASK_EVT() {
    }
    TASK_EVT.GLOBAL_TOUCH_END = 1; //全局点击事件
    /**
     * 100000
     * Menu层，如底部操作栏，顶部状态栏等
     * */
    TASK_EVT.MENU_BATTLE_WITHDRAW_FALSE = 101000; //撤退事件服务器返回false时
    /**
     * 200000
     * Map层，世界地图，战斗地图等
     * */
    TASK_EVT.PUSH_BUILD_QUEUE = 2100100; //添加建筑队列
    TASK_EVT.POP_BUILD_QUEUE = 2100101; //删除建筑队列
    /**补兵状态 */
    TASK_EVT.POP_SUPPLEMENT_STATUS = 3100003;
    /**快速补兵状态 */
    TASK_EVT.POP_QUICKLY_SUPPLEMENT_STATUS = 3100004;
    /** 士兵打架状态 */
    TASK_EVT.POP_SOLDIER_FIGHTING_STATUS = 3100005;
    /** 军功任务领赏状态改变 */
    TASK_EVT.POP_MILITARY_TASK_REWARD_CHANGE = 3100006;
    /** 移除角色结果处理 */
    TASK_EVT.POP_REMOVE_ROLE_RESULT = 3100008;
    /**暂停自动升级 */
    TASK_EVT.POP_JEWEL_STOP_AUTOBTN = 3100010;
    /**宝石升级返回 */
    TASK_EVT.POP_JEWEL_UP_RESP = 3100011;
    /**士兵打架刷新 */
    TASK_EVT.POP_SOLDIER_FIGHTING_UPDATE = 3100012;
    /**私聊名单 */
    TASK_EVT.PRIVATE_MEMBER_LIST = 3100013;
    /**私聊返回 */
    TASK_EVT.POP_CHAT_MSG_PUSH_PRIVATE = 3100014;
    ////////// 酒馆 //////////
    /** 酒馆点击切换座位 */
    TASK_EVT.POP_TAVERN_CHANGE_EVENT_TOUCH = 3100020;
    /** 酒馆完成事件 */
    TASK_EVT.POP_TAVERN_FINISHED_EVENT = 3100021;
    /** 酒馆事件进度更新 */
    TASK_EVT.POP_TAVERN_UPDATE_EVENT_PROGRESS = 3100022;
    /** 酒馆放弃事件 */
    TASK_EVT.POP_TAVERN_ABANDON_EVENT = 3100023;
    /**庆典灯笼移除 */
    TASK_EVT.POP_LANTERN_REMOVE = 3100100;
    /**暂停庆典 */
    TASK_EVT.POP_PAUSE_CELEBRATION = 3100101;
    /**对战开启进度 */
    TASK_EVT.POP_VERSUS_OPEN_PROGRESS = 3100200;
    ////////// 科技 //////////
    /**新科技开启 */
    TASK_EVT.POP_TECHNOLOGY_ACTIVE = 3100300;
    /**科技重置 */
    TASK_EVT.POP_TECHNOLOGY_RESET = 3100301;
    /**科技点数变化 */
    TASK_EVT.POP_TECHNOLOGY_POINTS_CHANGE = 3100302;
    /**科技激活变化 */
    TASK_EVT.POP_TECHNOLOGY_ACTIVATE_CHANGE = 3100303;
    //升级
    TASK_EVT.POP_TECHNOLOGY_UPDRADE_CHANGE = 3100304;
    ////////// 军功任务 //////////
    /**卜卦结果处理 */
    TASK_EVT.POP_BOGUA_RESULT = 3100350;
    /**卜卦数据更新 */
    TASK_EVT.POP_BOGUA_DATA_UPDATE = 3100351;
    /**任务更新 */
    TASK_EVT.POP_TASK_DATA_UPDATA = 3100352;
    /**任务刷新倒计时更新 */
    TASK_EVT.POP_TASK_REFRESH_TIME_UPDATE = 3100353;
    /** 军功任务提交完成 */
    TASK_EVT.POP_MILITARY_TASK_COMMIT_FINISH = 3100355;
    ////////// 兵法 //////////
    // /**新兵法开启 */
    // public static POP_WARCRAFT_OPEN_NEW = 3100400;
    /**龙图阁开始制造 */
    TASK_EVT.POP_GARRET_PRODUCE_BTN = 3100500;
    /**武将被抢 */
    TASK_EVT.POP_GENERAL_GRAB = 3100700;
    ////////// 活动 //////////
    /**活动自定义事件 */
    TASK_EVT.POP_THREE_VISITS_UP_STAR = 3100800;
    /**活动状态改变（单个） */
    TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE = 3100802;
    /**首充状态改变 */
    TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE = 3100803;
    ////////// 功能开启 //////////
    /**新功能开启 */
    TASK_EVT.POP_NEW_FUNCTION_OPEN = 3100901;
    TASK_EVT.POP_NEW_FUNCTION_CLOSE = 3100902;
    /**功能面板开启完毕 */
    TASK_EVT.POP_FUNCTION_PANEL_OPENED = 3100903;
    /**功能面板关闭 */
    TASK_EVT.POP_FUNCTION_PANEL_CLOSE = 3100904;
    ////////// 寺庙 //////////
    /**购买特效 */
    TASK_EVT.POP_TEMPLE_BUY = 3101000;
    /**使用道具更新数量 */
    TASK_EVT.POP_BAG_USE_UPDATE = 3101001;
    // //任务变动（主城显示用）
    // public static MISSION_CHANGE_INFO = 3101103;
    //主线任务可以领取
    // public static MISSSION_MAIN_LINE_FINISH = 3101104;
    //关卡可以进去
    TASK_EVT.PATROL_ARENA_PORT = 3101105;
    /**奖励领取面板 */
    TASK_EVT.ON_GET_REWARD_VIEW_HIDE = 3101300; //奖励获取面板
    return TASK_EVT;
}());
/**战场buff加成 */
var BattleBuff = /** @class */ (function () {
    function BattleBuff() {
    }
    /**军功加成 */
    BattleBuff.MilitaryBuff = 1;
    /**经验加成 */
    BattleBuff.ExpBuff = 2;
    return BattleBuff;
}());
//一个模块的UI事件加10000
var EventEnum = /** @class */ (function () {
    function EventEnum() {
    }
    EventEnum.LOGIN_SUCCESS = 'LOGIN_SUCCESS';
    // public static CREATE_NOTICE = 'CREATE_NOTICE';   //创建角色
    // public static CONFIG_LOAD_COMPLETE = "CONFIG_LOAD_COMPLETE"; // 配置表加载完成
    EventEnum.CITY_BUILDS_UPDATE = "CITY_BUILDS_UPDATE"; //城池信息更新
    EventEnum.BATTLE_NOTICE = "BATTLE_NOTICE"; //派发战场公告数据，此处由服务端更新
    EventEnum.BATTLE_NOTICE_CLIENT = "BATTLE_NOTICE_CLIENT"; //派发战场公告数据，此处由客户端计算更新
    EventEnum.BATTLE_NOTICE_CHAT = "BATTLE_NOTICE_CHAT"; //派发聊天公告数据
    EventEnum.BATTLE_FROZEN_SCENE = "BATTLE_FROZEN_SCENE"; //技能冻结
    EventEnum.BATTLE_START_SCENE = "BATTLE_START_SCENE"; //恢复冻结
    EventEnum.PROP_ITEM_CHANGE = "PROP_ITEM_CHANGE"; //道具数量更新
    EventEnum.FIEF_GRAB = "FIEF_GRAB"; //抢封地
    EventEnum.FIEF_NOTICE = "FIEF_NOTICE"; //封地提示
    EventEnum.FIEF_OPENVIEW = "FIEF_OPENVIEW"; //主界面封地按钮事件
    EventEnum.FIEF_WORLD_NOTICE = "FIEF_WORLD_NOTICE"; //世界封地提示
    EventEnum.FIEF_CONSTRU = "FIEF_CONSTRU"; //抢封地
    EventEnum.FIEF_BUILD_OPENVIEW = "FIEF_BUILD_OPENVIEW"; //城池封地按钮事件
    EventEnum.FIEF_OPENVIEW_PRE = "FIEF_OPENVIEW_PRE"; //城池封地按钮事件
    EventEnum.FIEF_LOGIN_GETRES = "FIEF_LOGIN_GETRES"; //刚登陆获取封地资源
    EventEnum.FIEF_CHECK_CONSTRUCTING = "FIEF_CHECK_CONSTRUCTING"; //查询是否在别处建设
    EventEnum.FIEF_CHANGE_TABVIEW = "FIEF_CHANGE_TABVIEW"; //
    return EventEnum;
}());
var MapNav = /** @class */ (function () {
    function MapNav() {
    }
    MapNav.MAP_CITY_BATTLE_REWARD = "MAP_CITY_BATTLE_REWARD"; // 攻守战奖励面板
    // public static BULLET_FINISH = "BULLET_FINISH";
    MapNav.MAP_BUILD_INFO = "MAP_BUILD_INFO"; //世界地图建筑信息
    MapNav.WORLD_COLLECT_RES_TIMER_FININSH = "WORLD_RES_TIMER_FININSH"; //采集定时器完成的
    return MapNav;
}());
/**战斗单位 */
var UnitNav = /** @class */ (function () {
    function UnitNav() {
    }
    /**关键帧 */
    UnitNav.KEY_FRAME = "KEY_FRAME";
    /**动作完成 */
    UnitNav.ACTION_FINISH = "ACTION_FINISH";
    /**方阵移动 */
    UnitNav.SQUARE_MOVE = "SQUARE_MOVE";
    /**方阵添加 */
    UnitNav.SQUARE_ADD = "SQUARE_ADD";
    /**方阵移除 */
    UnitNav.SQUARE_REMOVE = "SQUARE_REMOVE";
    /**战场建筑血量改变 */
    UnitNav.ATTR_BBUILD_HP = "ATTR_BBUILD_HP";
    /**战场单位从战场离开 */
    UnitNav.UNIT_DISAPPEAR = "UNIT_DISAPPEAR";
    return UnitNav;
}());
/**技能 */
var SkillNav = /** @class */ (function () {
    function SkillNav() {
    }
    /**发射技能 */
    SkillNav.FIGHT_SKILL = "FIGHT_SKILL";
    return SkillNav;
}());
/**战法 */
var SpellNav = /** @class */ (function () {
    function SpellNav() {
    }
    SpellNav.SPELL_TOUCH = "SPELL_TOUCH";
    return SpellNav;
}());
/**场景事件 */
var SceneEvent = /** @class */ (function () {
    function SceneEvent() {
    }
    /**场景切换 */
    SceneEvent.CHANGE_COMPLETE = "CHANGE_COMPLETE";
    /**隐藏总览 */
    SceneEvent.HIDE_OVER_VIEW = "SCENE_HIDE_OVER_VIEW";
    return SceneEvent;
}());
/**玩家事件 */
var PlayerEvent = /** @class */ (function () {
    function PlayerEvent() {
    }
    /**属性改变 */
    PlayerEvent.ATTR_UPDATE = "ATTR_UPDATE";
    return PlayerEvent;
}());
/**角色事件 */
var RoleEvent = /** @class */ (function () {
    function RoleEvent() {
    }
    /**等级 */
    RoleEvent.ROLE_LEVLE = "ROLE_LEVLE";
    /**经验 */
    RoleEvent.ROLE_EXP = "ROLE_EXP";
    /**vip等级 */
    RoleEvent.ROLE_VIP_LEVLE = "ROLE_VIP_LEVLE";
    /**vip经验 */
    RoleEvent.ROLE_VIP_EXP = "ROLE_VIP_EXP";
    /**军功等级 */
    RoleEvent.ROLE_MILITARY_LEVLE = "ROLE_MILITARY_LEVLE";
    /**军功经验 */
    RoleEvent.ROLE_MILITARY_EXP = "ROLE_MILITARY_EXP";
    /**军功奖励经验 */
    RoleEvent.ROLE_MILITARY_WEEK_EXP = "ROLE_MILITARY_SHOP_EXP";
    /**擂台等级 */
    RoleEvent.ROLE_ARENA_LEVEL = "ROLE_ARENA_LEVEL";
    /**擂台经验 */
    RoleEvent.ROLE_ARENA_EXP = "ROLE_ARENA_EXP";
    /**资源更新 */
    RoleEvent.ROLE_RESOURCE = "ROLE_RESOURCE";
    /**税收变更 */
    RoleEvent.ROLE_TAX = "ROLE_TAX";
    /**国家更变 */
    RoleEvent.ROLE_COUNTRY = "ROLE_COUNTRY";
    /**官职更变 */
    RoleEvent.ROLE_GOVERMENT = "ROLE_GOVERMENT";
    /**联盟更变 */
    RoleEvent.ROLE_ALLIANCE = "ROLE_ALLIANCE";
    /**战斗力更变 */
    RoleEvent.ROLE_FIGHT = "ROLE_FIGHT";
    /**名字更变 */
    RoleEvent.ROLE_NAME = "ROLE_NAME";
    /**名字更变 */
    RoleEvent.ROLE_HEADIMG = "ROLE_HEADIMG";
    /**兑换码兑换 */
    RoleEvent.GIFT_DUIHUAN = "GIFT_DUIHUAN";
    return RoleEvent;
}());
/**战斗界面事件 */
var BattleEvent = /** @class */ (function () {
    function BattleEvent() {
    }
    /**进入战斗 */
    BattleEvent.BATTLE_ENTER = "BATTLE_ENTER";
    BattleEvent.BATTLE_PLAY_SKILL = "BATTLE_PLAY_SKILL";
    BattleEvent.BATTLE_UNIT_ATTR_CHANGE = "BATTLE_UNIT_ATTR_CHANGE";
    BattleEvent.BATTLE_BLOOD_CHANGE = "BATTLE_BLOOD_CHANGE";
    BattleEvent.BATTLE_CHANGE_PLAYER_STATUS = "BATTLE_CHANGE_PLAYER_STATUS";
    BattleEvent.BATTLE_GENERAL_USE_SKILL = "BATTLE_GENERAL_USE_SKILL";
    BattleEvent.BATTLE_CHANGE_QUEUE = "BATTLE_CHANGE_QUEUE";
    BattleEvent.BATTLE_SIEGE_END = "BATTLE_SIEGE_END"; //攻城战事件
    BattleEvent.BATTLE_SIEGE_SELF = "BATTLE_SIEGE_SELF"; //个人攻城所有事件更新
    BattleEvent.BATTLE_START_RUN = "BATTLE_START_RUN"; //战斗开始跑
    BattleEvent.BATTLE_CHANGE_MAP = "BATTLE_CHANGE_MAP"; //切换地图
    BattleEvent.CITY_ITEM_COUNT_UPDATE = "CITY_ITEM_COUNT_UPDATE"; //攻城战队伍数量变更
    BattleEvent.BATTLE_OVER = "BATTLE_OVER"; //战斗结束
    BattleEvent.BATTLE_PLAY_GENGERAL_DIE = "BATTLE_PLAY_GENGERAL_DIE"; //显示死亡动画
    return BattleEvent;
}());
/**武将事件 */
var GeneralEvent = /** @class */ (function () {
    function GeneralEvent() {
    }
    /**武将初始化 */
    GeneralEvent.GENERAL_INIT = "GENERAL_INIT";
    /**武将获得 */
    GeneralEvent.GENERAL_GET = "GENERAL_GET";
    /**武将升级 */
    GeneralEvent.GENERAL_LEVEL = "GENERAL_LEVEL";
    /**武将突破 */
    GeneralEvent.GENERAL_TUPODAN = "GENERAL_TUPODAN";
    /**武将经验 */
    GeneralEvent.GENERAL_EXP = "GENERAL_EXP";
    /**武将升星 */
    GeneralEvent.GENERAL_STAR = "GENERAL_STAR";
    /**武将属性变动 */
    GeneralEvent.GENERAL_ATTRI_CHANGE = "GENERAL_ATTRI_CHANGE";
    /**武将技能升级 */
    GeneralEvent.GENERAL_SKILL = "GENERAL_SKILL";
    /**武将穿戴装备 */
    GeneralEvent.GENERAL_EQUIP_IN = "GENERAL_EQUIP_IN";
    /**装备变动 */
    GeneralEvent.GENERAL_EQUIP_CHANGE = "GENERAL_EQUIP_CHANGE";
    /**装备强化 */
    GeneralEvent.GENERAL_EQ_STRENG = "GENERAL_EQ_STRENG";
    /**装备合成 */
    GeneralEvent.GENERAL_EQ_COMPOSE = "GENERAL_EQ_COMPOSE";
    /**宝物变动 */
    GeneralEvent.GENERAL_EQUIP_TREA = "GENERAL_EQUIP_TREA";
    /**武将获得界面关闭 */
    GeneralEvent.GENERAL_GET_WND_CLOSE = "GENERAL_GET_WND_CLOSE";
    return GeneralEvent;
}());
var FateEvent = /** @class */ (function () {
    function FateEvent() {
    }
    /**缘分数据变动 */
    FateEvent.FATE_DATA_CHANGE = "FATE_DATA_CHANGE";
    return FateEvent;
}());
/**聚宝盆事件 */
var CornucopiaEvent = /** @class */ (function () {
    function CornucopiaEvent() {
    }
    /**数据更新 */
    // public static CORN_UPDATE = "CORN_UPDATE";
    /**领取时间 */
    CornucopiaEvent.CORN_TIME_UPDATE = "CORN_TIME_UPDATE";
    return CornucopiaEvent;
}());
/**vip事件 */
var VipEvent = /** @class */ (function () {
    function VipEvent() {
    }
    /**数据更新 */
    VipEvent.VIP_UPDATE = "VIP_UPDATE";
    return VipEvent;
}());
/**章节事件 */
var QuarterEvent = /** @class */ (function () {
    function QuarterEvent() {
    }
    /**更新次数 */
    QuarterEvent.QUARTER_UPDATE_NUM = "QUARTER_UPDATE_NUM";
    /**章節信息更新 */
    QuarterEvent.QUARTER_INFO_UPDATE = 'QUARTER_INFO_UPDATE';
    /**信息扫荡最大上限次数更新 */
    QuarterEvent.QUARTER_INFO_NUM = 'QUARTER_INFO_NUM';
    return QuarterEvent;
}());
/**历史战役事件更新 */
var HistoryWarEvent = /** @class */ (function () {
    function HistoryWarEvent() {
    }
    /**更新次数 */
    HistoryWarEvent.HISTORY_UPDATE_NUM = "HISTORY_UPDATE_NUM";
    return HistoryWarEvent;
}());
/**竞技场事件 */
var ArenaEvent = /** @class */ (function () {
    function ArenaEvent() {
    }
    /**更新次数 */
    ArenaEvent.ARENA_UPDATE_NUM = "ARENA_UPDATE_NUM";
    return ArenaEvent;
}());
/**过关斩将事件 */
var PassWarEvent = /** @class */ (function () {
    function PassWarEvent() {
    }
    /**更新次数 */
    PassWarEvent.PASS_WAR_UPDATE_FREE = "PASS_WAR_UPDATE_FREE";
    return PassWarEvent;
}());
/**材料副本 */
var MaterialEvent = /** @class */ (function () {
    function MaterialEvent() {
    }
    /**数据更新 */
    MaterialEvent.MATERIAL_INFO_UPDATE = "MATERIAL_INFO_UPDATE";
    return MaterialEvent;
}());
/**科技事件 */
var TechnologyEvent = /** @class */ (function () {
    function TechnologyEvent() {
    }
    TechnologyEvent.TECHNOLOGY_TIME_UP = "TECHNOLOGY_TIME_UP";
    TechnologyEvent.TECHNOLOGY_INFO_UPDATE = "TECHNOLOGY_INFO_UPDATE";
    TechnologyEvent.TECHNOLOGY_INFO_WND_SWICTH = "TECHNOLOGY_INFO_WND_SWICTH";
    return TechnologyEvent;
}());
/**酒馆事件 */
var TavernEvent = /** @class */ (function () {
    function TavernEvent() {
    }
    /**免费次数 */
    TavernEvent.TAVERN_UPDATE_FREE = "TAVERN_UPDATE_FREE";
    return TavernEvent;
}());
/**挂机事件 */
var PatrolEvent = /** @class */ (function () {
    function PatrolEvent() {
    }
    /**信息刷新 */
    PatrolEvent.PATROL_INFO_UPDATE = "PATROL_INFO_UPDATE";
    /**时间刷新 */
    PatrolEvent.PATROL_TICK_UPDATE = "PATROL_TICK_UPDATE";
    /**boss重置 */
    PatrolEvent.PATROL_BOSS_RESET = "PATROL_BOSS_RESET";
    /**领奖刷新 */
    PatrolEvent.PATROL_AWARD_UPDATE = "PATROL_AWARD_UPDATE";
    /**随机英雄跑到尽头 */
    PatrolEvent.PATROL_GENERAL_END = "PATROL_GENERAL_END";
    /**怪物死亡 */
    PatrolEvent.PATROL_KILL_MONSTER = "PATROL_KILL_MONSTER";
    /**飞行动画结束 */
    PatrolEvent.PATROL_FLY_END = "PATROL_FLY_END";
    /**boos 来袭特效 */
    PatrolEvent.PATRAL_BOSS_ATTACK_EFF = "PATRAL_BOSS_ATTACK_EFF";
    return PatrolEvent;
}());
/**boss事件 */
var BossEvent = /** @class */ (function () {
    function BossEvent() {
    }
    /**boss信息刷新 */
    BossEvent.BOSS_INFO_UPDATE = "BOSS_INFO_UPDATE";
    return BossEvent;
}());
/**建造事件 */
var BuildEvent = /** @class */ (function () {
    function BuildEvent() {
    }
    /**建筑队列刷新 */
    BuildEvent.BUILD_QUEUE_CHANGE = "BUILD_QUEUE_CHANGE";
    /**建筑升级 */
    BuildEvent.BUILD_UP_LEVEL = "BUILD_UP_LEVEL";
    /**建筑激活 */
    BuildEvent.BUILD_ACTIVATED = "BUILD_ACTIVATED";
    /**建筑快速升级 */
    BuildEvent.BUILD_FAST_UP_LEVEL = "BUILD_FAST_UP_LEVEL";
    /**建筑信息刷新 */
    BuildEvent.BUILD_REFRESH = "BUILD_REFRESH";
    /**建筑泡泡 */
    BuildEvent.BUILD_PAOPAO_UPDATE = "BUILD_PAOPAO_UPDATE";
    /**检测建筑升级状态 */
    BuildEvent.CHECK_BUILD_LV_STATE = "CHECK_BUILD_LV_STATE";
    /**兵营训练 */
    BuildEvent.SOLDIER_TRAIN = "SOLDIER_TRAIN";
    /**兵种进阶 */
    BuildEvent.SOLDIER_UPGRADE = "SOLDIER_UPGRADE";
    return BuildEvent;
}());
var MailEvent = /** @class */ (function () {
    function MailEvent() {
    }
    /**读取邮件 */
    MailEvent.READ_MAIL = "READ_MAIL";
    /**刷新邮件 */
    MailEvent.REFRESH_MAIL = "REFRESH_MAIL";
    /**领取附件 */
    MailEvent.GET_ATTACHMENT = "GET_ATTACHMENT";
    return MailEvent;
}());
var TaskWorldEvent = /** @class */ (function () {
    function TaskWorldEvent() {
    }
    /**创建上阵英雄 */
    TaskWorldEvent.RANK_CREATE_ARMY = "RANK_CREATE_ARMY";
    /**创建当前位置的英雄 */
    TaskWorldEvent.RANK_CREATE_POINT_ARMY = "RANK_CREATE_POINT_ARMY";
    /**删除上阵英雄 */
    TaskWorldEvent.RANK_REMOVE_ARMY = "RANK_REMOVE_ARMY";
    /**删除当前位置的英雄 */
    TaskWorldEvent.RANK_REMOVE_POINT_ARMY = "RANK_REMOVE_POINT_ARMY";
    /**检查上阵碰撞 */
    TaskWorldEvent.RANK_CHECK_HIT = "RANK_CHECK_HIT";
    /**显示行军列队的操作 */
    TaskWorldEvent.QUEUE_SHOW_OPERATE = "QUEUE_SHOW_OPERATE";
    /**隐藏行军列队的操作 */
    TaskWorldEvent.QUEUE_HIDE_OPERATE = "QUEUE_HIDE_OPERATE";
    /**搜索tab切换 */
    TaskWorldEvent.SEARCH_TAB = "SEARCH_TAB";
    /**警报 */
    TaskWorldEvent.WARN_UPDATE = "WARN_UPDATE";
    /**客户端更新行军队伍 */
    TaskWorldEvent.CLIENT_MOVE_UPDATE = "CLIENT_MOVE_UPDATE";
    /**城池驻军数据 */
    TaskWorldEvent.WORLD_CITY_TROOP = "WORLD_CITY_TROOP";
    /**城池队伍变更 */
    TaskWorldEvent.WORLD_CITY_TEAM_UPDATE = "WORLD_CITY_TEAM_UPDATE";
    /**城池队伍状态变更 */
    TaskWorldEvent.WORLD_CITY_MOVE_LIST_UPDATE = "WORLD_CITY_MOVE_LIST_UPDATE";
    /**城池更新 */
    TaskWorldEvent.WORLD_CITY_UPDATE = "WORLD_CITY_UPDATE";
    /**城池移动 */
    TaskWorldEvent.WORLD_CITY_MOVE = "WORLD_CITY_MOVE";
    /**军功奖励变更 */
    TaskWorldEvent.EXPLOIT_AWARD_UPDATE = "EXPLOIT_AWARD_UPDATE";
    /**更新资源显示 */
    TaskWorldEvent.WORLD_CITY_RES_UPDATE = "WORLD_CITY_RES_UPDATE";
    /**保存补兵 */
    TaskWorldEvent.WORLD_SAVE_AUTO_TROOP = "WORLD_SAVE_AUTO_TROOP";
    /**拖动更新 */
    TaskWorldEvent.WORLD_TROOP_BTN_UPDATE = "WORLD_TROOP_BTN_UPDATE";
    /**出征面板点击空队伍 */
    TaskWorldEvent.WORLD_HERO_WND_EMPTY_CLICK = "WORLD_HERO_WND_EMPTY_CLICK";
    /**事件刷新 */
    TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE = "WORLD_UPDATE_EVENT_UPDATE";
    /**更新部队列表 */
    TaskWorldEvent.WORLD_UPDATE_LIST = "WORLD_UPDATE_LIST";
    /** 更新城池建造 */
    TaskWorldEvent.WORLD_BUILD_UPDATE = 'WORLD_BUILD_UPDATE';
    TaskWorldEvent.WORLD_BUILD_HERO_DEL = 'WORLD_BUILD_HERO_DEL';
    /** 更新荣誉奖励 */
    TaskWorldEvent.CROSS_RANK_RY = 'CROSS_RANK_RY';
    return TaskWorldEvent;
}());
var ActivityEvent = /** @class */ (function () {
    function ActivityEvent() {
    }
    /**新活动开启*/
    ActivityEvent.ACTIVITY_NEW_OPEN = "ACTIVITY_NEW_OPEN";
    /**充值后单笔累计充值界面刷新 */
    ActivityEvent.ACTIVITY_RECHARGE_SUCC = 'ACTIVITY_RECHARGE_SUCC';
    /**勾玉购买勾玉超市物品成功刷新 */
    ActivityEvent.ACTIVITY_YU_BUY_SUCC = 'ACTIVITY_YU_BUY_SUCC';
    /**累计充值刷新 */
    ActivityEvent.ACTIVITY_ADD_CHARGE = 'ACTIVITY_ADD_CHARGE';
    /**单笔充值刷新 */
    ActivityEvent.ACTIVITY_SINGLE_CHARGE = 'ACTIVITY_SINGLE_CHARGE';
    /**消费豪礼 */
    ActivityEvent.ACTIVITY_CONSUME_GIFT = 'ACTIVITY_CONSUME_GIFT';
    /**7天登陆 */
    ActivityEvent.ACTIVITY_LOGIN_DAY = 'ACTIVITY_LOGIN_DAY';
    /**月卡周卡 */
    ActivityEvent.ACTIVITY_MOON_CARD = 'ACTIVITY_MOON_CARD';
    /**成长基金 */
    ActivityEvent.ACTIVITY_GROWTH_FUN = 'ACTIVITY_GROWTH_FUN';
    /**直购礼包活动 */
    ActivityEvent.ACTIVITY_PU_GIFT = 'ACTIVITY_PU_GIFT';
    /**一元购 */
    ActivityEvent.ACTIVITY_ONE_GIFT_BAG = 'ACTIVITY_ONE_GIFT_BAG';
    /**月签到 */
    ActivityEvent.ACTIVITY_SIGN_MONTH = 'ACTIVITY_SIGN_MONTH';
    /**南蛮入侵 */
    ActivityEvent.ACTIVITY_BREAK_OUT = 'ACTIVITY_BREAK_OUT';
    /**限时活动购买刷新 */
    ActivityEvent.ACTIVITY_GIFT_BAG_BUY = 'ACTIVITY_GIFT_BAG_BUY';
    /**限时活动领取刷新 */
    ActivityEvent.ACTIVITY_GIFT_BAG_LINGQU = 'ACTIVITY_GIFT_BAG_LINGQU';
    /**限时活动图标红点刷新 */
    ActivityEvent.ACTIVITY_GIFT_BAG_UPDATE = 'ACTIVITY_GIFT_BAG_UPDATE';
    /**幸运转盘刷新 */
    ActivityEvent.ACTIVITY_TURNTABLE_UPDATE = 'ACTIVITY_TURNTABLE_UPDATE';
    /**幸运转盘宝箱刷新 */
    ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE = 'ACTIVITY_TURNTABLE_BOX_UPDATE';
    /**新武将信息 */
    ActivityEvent.ACTIVITY_NEW_GENERAL_INFO = 'ACTIVITY_NEW_GENERAL_INFO';
    /** 新武将选择奖励 */
    ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD = 'ACTIVITY_NEW_GENERAL_CHOOSE_REWARD';
    /**新武将拜访 */
    ActivityEvent.ACTIVITY_NEW_GENERAL_VISIT_REWARD = 'ACTIVITY_NEW_GENERAL_VISIT_REWARD';
    /**新武将领取宝箱奖励 */
    ActivityEvent.ACTIVITY_NEW_GENERAL_BOX_REWARD = 'ACTIVITY_NEW_GENERAL_BOX_REWARD';
    /**新武将限购 */
    ActivityEvent.ACTIVITY_NEW_GEN_LIM = 'ACTIVITY_NEW_GEN_LIM';
    /**新武将拜访红点 */
    ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED = 'ACTIVITY_NEW_GEN_VIS_RED';
    /**新7天聚宝盆红点 */
    ActivityEvent.AC_7DAY_COR = 'AC_7DAY_COR';
    /**新7天聚宝盆活动 */
    ActivityEvent.ACTIVITY_NEW_7DAY_COR = 'ACTIVITY_NEW_7DAY_COR';
    /**新7天聚宝盆抽奖 */
    ActivityEvent.ACTIVITY_NEW_7DAY_COR_REWARD = 'ACTIVITY_NEW_7DAY_COR_REWARD';
    /**襄阳战个人挑战奖更新 */
    ActivityEvent.PLAYER_BATTLE_REWARD_UPDATE = 'PLAYER_BATTLE_REWARD_UPDATE';
    /**获得商城信息 */
    ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_INFO = 'PLAYER_BATTLE_REWARD_UPDATE';
    /**手动刷新 */
    ActivityEvent.ACTIVITY_PREFERENTAIL_REFRESH = 'ACTIVITY_PREFERENTAIL_REFRESH';
    /**商城购买物品 */
    ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_BUY = 'ACTIVITY_PREFERENTAIL_STORE_BUY';
    return ActivityEvent;
}());
var OnLineEvent = /** @class */ (function () {
    function OnLineEvent() {
    }
    OnLineEvent.ONLINE_UPDATE = 'ONLINE_UPDATE';
    return OnLineEvent;
}());
/**重生刷新信息 */
var RebirthEvent = /** @class */ (function () {
    function RebirthEvent() {
    }
    RebirthEvent.REBIRTH_UPDATE = 'REBIRTH_UPDATE';
    return RebirthEvent;
}());
var TeamUIEvent = /** @class */ (function () {
    function TeamUIEvent() {
    }
    /**挑战按钮点击 */
    TeamUIEvent.TEAM_BTN_FIGHT = "TEAM_BTN_FIGHT";
    /**更新上阵信息 */
    TeamUIEvent.TEAM_UPDATE_GIRD_INFO = "TEAM_UPDATE_GIRD_INFO";
    TeamUIEvent.TEAM_UPDATE_MAX_NUM = "TEAM_UPDATE_MAX_NUM";
    return TeamUIEvent;
}());
/**招募事件 */
var ArmyEvent = /** @class */ (function () {
    function ArmyEvent() {
    }
    /**训练完成事件 */
    ArmyEvent.ARMY_FINISH = "ARMY_FINISH";
    return ArmyEvent;
}());
var TkCampEvent = /** @class */ (function () {
    function TkCampEvent() {
    }
    /**创建上阵英雄 */
    TkCampEvent.CAMP_CREATE_ARMY = "CAMP_CREATE_ARMY";
    /**创建当前位置的英雄 */
    TkCampEvent.CAMP_CREATE_POINT_ARMY = "CAMP_CREATE_POINT_ARMY";
    /**删除上阵英雄 */
    TkCampEvent.CAMP_REMOVE_ARMY = "CAMP_REMOVE_ARMY";
    /**删除当前位置的英雄 */
    TkCampEvent.CAMP_REMOVE_POINT_ARMY = "CAMP_REMOVE_POINT_ARMY";
    /**检查上阵碰撞 */
    TkCampEvent.CAMP_CHECK_HIT = "CAMP_CHECK_HIT";
    /**更新军营的练兵营的兵力显示 */
    TkCampEvent.CAMP_TROOPS_TYPE = "CAMP_TROOPS_TYPE";
    /**更新上阵英雄 */
    TkCampEvent.CAMP_HERO_LIST = "CAMP_HERO_LIST";
    /**更新临时上阵英雄 */
    TkCampEvent.CAMP_HERO_TEMP = "CAMP_HERO_TEMP";
    /**更新军营的是否更改状态 */
    TkCampEvent.CAMP_UPDATE_BTN = "CAMP_UPDATE_BTN";
    /**更新上阵信息 */
    TkCampEvent.CAMP_UPDATE_INFO = "CAMP_UPDATE_INFO";
    return TkCampEvent;
}());
var EquipEvent = /** @class */ (function () {
    function EquipEvent() {
    }
    /**装备回收+ */
    EquipEvent.EQUIP_DECOMPOSE_ADD = 'EQUIP_DECOMPOSE_ADD';
    /**装备回收- */
    EquipEvent.EQUIP_DECOMPOSE_DEL = 'EQUIP_DECOMPOSE_DEL';
    /**全选 */
    EquipEvent.EQUIP_DECOMPOSE_ALL_TICK = 'EQUIP_DECOMPOSE_ALL_TICK';
    /**单选 */
    EquipEvent.EQUIP_DECOMPOSE_ONE_TICK = 'EQUIP_DECOMPOSE_ONE_TICK';
    return EquipEvent;
}());
/**背包事件 */
var BagEvent = /** @class */ (function () {
    function BagEvent() {
    }
    /**背包格子选中 */
    BagEvent.BAG_SELECTED_CHANGE = 'BAG_SELECTED_CHANGE';
    /**背包增加 */
    BagEvent.BAG_ITEM_ADD = 'BAG_ITEM_ADD';
    /**背包删减 */
    BagEvent.BAG_ITEM_DEL = 'BAG_ITEM_DEL';
    /**背包删减 */
    BagEvent.BAG_ITEM_UPDATE = 'BAG_ITEM_UPDATE';
    /**背包新物品状态移除 */
    BagEvent.BAG_STATE_DEL = "BAG_STATE_DEL";
    return BagEvent;
}());
/**聊天事件 */
var ChatEvent = /** @class */ (function () {
    function ChatEvent() {
    }
    /**聊天消息更新 */
    ChatEvent.MSG_UPDATE = 'MSG_UPDATE';
    /**聊天消息更新 */
    ChatEvent.MSG_STATE_UPDATE = 'MSG_STATE_UPDATE';
    /**头像更新 */
    ChatEvent.CHAT_HEAD_UPDATE = 'CHAT_HEAD_UPDATE';
    /**头像列表更新 */
    ChatEvent.CHAT_HEAD_ADD = 'CHAT_HEAD_ADD';
    ChatEvent.CHAT_HEAD_DEL = 'CHAT_HEAD_DEL';
    /**私聊消息清理 */
    ChatEvent.CHAT_MSG_PRI_CLEAR = 'CHAT_MSG_PRI_CLEAR';
    /**黑名单增加 */
    ChatEvent.CHAT_BLACK_LIST_ADD = 'CHAT_BLACK_LIST_ADD';
    /**黑名单减少 */
    ChatEvent.CHAT_BLACK_LIST_DEL = 'CHAT_BLACK_LIST_DEL';
    return ChatEvent;
}());
/**任务事件 */
var MissionEvent = /** @class */ (function () {
    function MissionEvent() {
    }
    /**任务数据改变 */
    MissionEvent.MISSION_UPDATE_INFO = 'MISSION_UPDATE_INFO';
    /**添加任务 */
    MissionEvent.MISSION_ADD_INFO = 'MISSION_ADD_INFO';
    /**删除 */
    MissionEvent.MISSION_DELETE_INFO = 'MISSION_DELETE_INFO';
    /**活跃度 */
    MissionEvent.MISSION_UPDATE_LIVENESS = 'MISSION_UPDATE_LIVENESS';
    /**国家任务 */
    MissionEvent.MISSION_COUNTRY = 'MISSION_COUNTRY';
    return MissionEvent;
}());
/**联盟事件 */
var LegionEvent = /** @class */ (function () {
    function LegionEvent() {
    }
    /**科技更新 */
    LegionEvent.LEGION_TECH_UPDATE = 'LEGION_TECH_UPDATE';
    /**联盟信息变化 */
    LegionEvent.LEGION_INFO_CHANGE = "LEGION_INFO_CHANGE";
    return LegionEvent;
}());
/**宝物事件 */
var TreaEvent = /** @class */ (function () {
    function TreaEvent() {
    }
    /**宝物获得 */
    TreaEvent.TREA_ADD = 'TREA_ADD';
    /**升级 */
    TreaEvent.TREA_LEVEL_UPDATE = 'TREA_LEVEL_UPDATE';
    /**升星 */
    TreaEvent.TREA_STAR_UPDATE = "TREA_STAR_UPDATE";
    /**宝石镶嵌 */
    TreaEvent.TREA_STONE_UPDATE = "TREA_STONE_UPDATE";
    return TreaEvent;
}());
/**常规事件 */
var NormalEvent = /** @class */ (function () {
    function NormalEvent() {
    }
    /**方法次数更新 */
    NormalEvent.NORMAL_FUN_COUNT = 'NORMAL_FUN_COUNT';
    /**弹窗变化 */
    NormalEvent.POP_PANEL_UPDATE = 'POP_PANEL_UPDATE';
    /**服务器跨天 */
    NormalEvent.NORMAL_CROSS_DAY = 'NORMAL_CROSS_DAY';
    return NormalEvent;
}());
/**功能开启时间 */
var FunctionEvent = /** @class */ (function () {
    function FunctionEvent() {
    }
    /**新功能开启 */
    FunctionEvent.NEW_FUNC_OPEN = "NEW_FUNC_OPEN";
    /**新预览开启 */
    FunctionEvent.NEW_PRE_FUNC_OPEN = "NEW_PRE_FUNC_OPEN";
    return FunctionEvent;
}());
var GuideEvent = /** @class */ (function () {
    function GuideEvent() {
    }
    // public static GUIDE_SEND_NOVICE_BATTLE = "GUIDE_SEND_NOVICE_BATTLE"; //发起新手战斗
    /**是否可以执行引导 */
    GuideEvent.GUIDE_ON_CHECK = "GUIDE_ON_CHECK";
    /*条件触发 */
    GuideEvent.GUIDE_ON_CONDITION = "GUIDE_ON_CONDITION";
    /**完成点击 */
    GuideEvent.GUIDE_TOUCH_FINISH = "GUIDE_TOUCH_FINISH";
    /**引导完成 */
    GuideEvent.GUIDE_FINISH = "GUIDE_FINISH";
    /**指引开始战斗 （战前动画）*/
    GuideEvent.GUIDE_START_BATTLE = "GUIDE_START_BATTLE";
    /**完成保存 */
    GuideEvent.GUIDE_SAVE_FINISH = "GUIDE_SAVE_FINISH";
    /**跳过主城战斗剧情 */
    GuideEvent.GUIDE_SKIP_PLOT = "GUIDE_SKIP_PLOT";
    /**剧情对话结束 */
    GuideEvent.GUIDE_DIALOGUE_END = "GUIDE_DIALOGUE_END";
    //==========================================================执行时机（不可乱删 事件配表，引用索引不到）======================================    
    /**武将合成动画结束 */
    GuideEvent.GUIDE_GENERAL_COMPOUND_ANI = "GUIDE_GENERAL_COMPOUND_ANI";
    /**胜利结算界面动画结束 */
    GuideEvent.GUIDE_BATTLE_WIN_COMPOUND_ANI = "GUIDE_BATTLE_WIN_COMPOUND_ANI";
    //==========================================================检测判断类型===================================
    /**检测国家 */
    GuideEvent.GUIDE_CHECK_COUNTRY = "GUIDE_CHECK_COUNTRY";
    /**检测场景 */
    GuideEvent.GUIDE_CHECK_SCENE = "GUIDE_CHECK_SCENE"; //场景
    /**检测战斗状态 */
    GuideEvent.GUIDE_CHECK_BATTLESTATE = "GUIDE_CHECK_BATTLESTATE"; //战斗状态
    /**检测关卡id */
    GuideEvent.GUIDE_CHECK_LEVELID = "GUIDE_CHECK_LEVELID"; //战斗Id
    /**检测建筑升级面板id */
    GuideEvent.GUIDE_CHECK_BUILDPANELID = "GUIDE_CHECK_BUILDPANELID"; //建筑升级面板id
    /**检测主界面菜单栏是否打开 */
    GuideEvent.GUIDE_CHECK_MENUSTATE = "GUIDE_CHECK_MENUSTATE"; //菜单状态
    return GuideEvent;
}());
/**国家模块事件 */
var CountryEvent = /** @class */ (function () {
    function CountryEvent() {
    }
    /**官职领奖 */
    CountryEvent.COUNTRY_SALARY_UPDATE = "COUNTRY_SALARY_UPDATE";
    /**国家情报 */
    CountryEvent.CITY_CHANGE = "CITY_CHANGE";
    /**官职任命 */
    CountryEvent.COUNTRY_JOB_APPLY_UP = "COUNTRY_JOB_APPLY_UP";
    /**国家信息 */
    CountryEvent.COUNTRY_INFO = "COUNTRY_INFO";
    /**官职领奖 */
    CountryEvent.COUNTRY_SALARY = "COUNTRY_SALARY";
    /**弹劾 */
    CountryEvent.COUNTRY_START_IMPEACH = "COUNTRY_START_IMPEACH";
    /**弹劾投票 */
    CountryEvent.COUNTRY_VOTE_IMPEACH = "COUNTRY_VOTE_IMPEACH";
    /**城池任命 */
    CountryEvent.COUNTRY_CITY_APPLY_UP = "COUNTRY_CITY_APPLY_UP";
    /**城池信息 */
    CountryEvent.COUNTRY_CITY_INFO = "COUNTRY_CITY_INFO";
    /**税收状态 */
    CountryEvent.COUNTRY_CITY_REVENUE_STATUS = "COUNTRY_CITY_REVENUE_STATUS";
    /**税收 */
    CountryEvent.COUNTRY_CITY_REVENUE = "COUNTRY_CITY_REVENUE";
    return CountryEvent;
}());
/**跨服战 */
var CrossWarEvent = /** @class */ (function () {
    function CrossWarEvent() {
    }
    /**跨服战状态切换 */
    CrossWarEvent.CROSS_SERVER_STATUS = 'CROSS_SERVER_STATUS';
    /**城门血量更新 */
    CrossWarEvent.CROSS_WALL_UPDATE = 'CROSS_WALL_UPDATE';
    CrossWarEvent.CROSS_WALL_STATUS = 'CROSS_WALL_STATUS';
    /**显示城池信息 */
    CrossWarEvent.CROSS_BUILD_INFO = 'CROSS_BUILD_INFO';
    return CrossWarEvent;
}());
