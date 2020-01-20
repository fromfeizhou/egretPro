enum TASK_UI {
    /**
     * 100000
     * Menu层，如底部操作栏，顶部状态栏等
     * */
    MENU_INIT = 100001,
    MENU_SHOW = 100002,
    MENU_BATTLE_TOOLSBAR_REFRES = 100004,//xxxx加注释
    MENU_BATTLE_VIEW = 100008,//战斗界面
    MENU_BATTLE_DESTORY_WALL = 100009,//战斗城墙攻破


    // MENU_BATTLE_TOPBAR = 110000,//战斗界面顶部操作栏
    MENU_MAIN_TOPBAR = 110001,//主界面顶部操作栏
    MENU_MAIN_TOP_OTHER = 110002,   //通用
    MENU_MAIN_SCENE = 110003,   //主城
    MENU_MAIN_HANG = 110004,    //挂机
    MENU_MAIN_WORLD = 110005,   //大地图
    MENU_MAIN_CROSS = 110006,   //跨服
    MENU_NOTICE = 120000,


    /**
     * 200000
     * Map层，世界地图，战斗地图等
     * */
    MAP_BATTLE = 200000,//战斗地图
    MAP_WORLD = 200001,//世界地图
    MAP_MAIN = 200002,//主城
    MAP_CROSS_WAR = 200003,// 跨服地图
    MAP_CROSS_WALL_WAR = 200004,//跨服城门战地图
    // MAP_BATTLE_LIST = 200003,//选战场列表（test）
    // MAP_CITY_HITWALL_INFO = 200008,//撞墙榜面板
    MAP_NOVICE = 200009,//新手地图
    WAIT_BATTLE_MAP = 200010,//等待地图
    AWAY_FROM_KEYBOARD = 200011, //挂机

    MAP_MAIN_MOVE = 200101,//主城 移动到建筑
    MAP_WORLD_MOVE = 200102,//世界地图移动



    /**
     * 300000
     * POP弹窗层
     * */
    POP_CHAT_MAIN = 300000,//聊天弹窗主界面
    POP_CHAT_MAIN_TIPS = 300001,//主界面tips显示

    POP_MILITARY_EXPLOIT_TASK = 300100,// 军功任务面板
    POP_MILITARY_EXPLOIT_RANK = 300101,// 军功排行榜
    POP_MILITARY_EXPLOIT_BOGUA = 300102,// 军功卜卦面板

    POP_GENERAL_OPEN_INFO_VIEW = 300200,//武将列表界面
    POP_GENERAL_OPEN_DETAIL_VIEW = 300202,//武将详情界面
    POP_GENERAL_OPEN_UP_SKILL_VIEW = 300204,//武将被抢界面
    POP_GENERAL_ATTRIBUTE_EFFECT = 300205,//武将详情界面战力动画
    POP_GENERAL_GET_VIEW = 300206,//武将获得
    POP_GENERAL_TREA_LIST = 300207,//武将装备宝物
    POP_GENERAL_GET_VIEWII = 300208,//武将获得(新手专用)
    POP_GENERAL_UPSTAR_VIEWII = 300209,//武将升星界面
    POP_GENERAL_TUPO_VIEW = 300210,//武将突破界面
    POP_GENERAL_UNLOCK_SKILL = 300211,//武将技能解锁界面
    POP_GENERAL_UPGRADE_VIEW = 300212,//突破弹框界面



    // POP_MAP_EVENT_CONFIRM = 300400,//世界事件确认框

    POP_ROLE_INFO_VIEW = 300500, // 角色详情面板
    POP_ROLE_CHANGE_NAME = 300501, // 君主改名
    POP_ROLE_REPLACE_IMG = 300502,// 更换形象
    POP_ROLE_LEVEL_PANEL = 300503,//君主等级提升
    POP_ROLE_GIFT_DH = 300504,//礼包兑换

    // POP_VERSUS_SEARCH_VIEW = 300600, //对战搜索
    // POP_VERSUS_CHOICE_VIEW = 300601, //对战选择
    // POP_VERSUS_ONBATTLE_VIEW = 300602, //对战上阵
    // POP_VERSUS_REFRESH_OPEN_VIEW = 300603, //对战开启进度

    POP_RESULT_BATTLE_VIEW = 300700, //对战结果
    POP_RESULT_ARENA_BATTLE_VIEW = 300703, //擂台结算
    POP_RESULT_RAMPART_BATTLE_VIEW = 300704, //关卡结算
    POP_RESULT_HISTORY_BATTLE_VIEW = 300705,

    /**登录 */
    POP_LOGIN_SERVER_LIST = 310000,
    POP_LOGIN_CREATE_ROLE_VIEW = 310001,    //创建角色界面
    POP_LOGIN_SELECT_ROLE_VIEW = 310002,    //选择角色界面
    POP_LOGIN_NOTICE = 310004,      //登录公告

    /**主城 */
    POP_BUILDING_INFO_VIEW = 310101,        //主城建筑信息界面
    // POP_MAP_BUILD_INFO = 310102,
    // POP_NOVICE_BUILD_INFO = 310103,
    POP_BUILDING_FUNCITON_MEUN_VIEW = 310104,        //主城功能菜单界面
    POP_BUILDING_MOVE_VIEW = 310105,        //建筑定位
    POP_COM_SPEED_UP_VIEW = 310106,//通用加速面板
    POP_BUILD_LEVEL_UP_VIEW = 310107,//主城升级成功面板


    POP_ARENA_PANEL = 311001,            //擂台面板
    POP_ARENA_CLEAR_UP_PANEL = 311002,            //擂台扫荡结算

    // POP_DECISIVE_BATTLE = 320000,//决战
    // POP_BIG_HARVEST = 320001,//大丰收
    // POP_VIP_BUY = 320002,//vip

    // POP_WORLD_MAP_THUM = 320003,//世界地图缩略图


    // /**庆典 */
    // POP_CELEBARATION_VIEW = 320101,
    // /**庆典结束奖励 */
    // POP_CELEBARATION_REWARD = 320102,
    // /**庆典分数加成 */
    // POP_CELEBARATION_SCORE = 320103,


    POP_TECHNOLOGY_VIEW = 322000,   // 科技列表面板
    POP_TECHNOLOGY_PANEL = 322001,   // 科技详情面板

    // POP_WARCRAFT_VIEW = 323000,   // 兵法面板
    // POP_WARCRAFT_PANEL = 323001,   // 兵法详情面板

    POP_MAIL_LIST_VIEW = 324000,   //邮件列表面板

    POP_BAG_LIST_VIEW = 324003,     //背包列表面板
    POP_BAG_PANEL = 324004,         //背包详情面板



    Cornucopai_PANEL = 324018,         //聚宝盆面板
    WELFARE_PANEL = 324021,         //福利面板
    TASK_ACTIVATION_PANEL = 324022,         //任务面板
    PromtDynamic_TEXT_PANEL = 324023,         //断线重连面板
    TRAIN_SOLDIER_PANEL = 324024,         //训练士兵界面
    LEGION_APPLY_WND = 324025,         //联盟申请面板
    LEGION_RECORD_WND = 324026,         //联盟记录面板
    SOLDIER_UPGRADE_PANEL = 324029,         //兵营进阶页面

    /**pvp */
    POP_PVPARENA_PANEL = 325001,         //pvp竞技场面板
    POP_PVPARENA_RANK_PANEL = 325002,         //pvp竞技场排行榜面板
    POP_PVPARENA_NOTICE_PANEL = 325003,         //pvp竞技场战报面板
    POP_PVPARENA_SHOP_PANEL = 325004,         //pvp竞技场商店面板
    SHOP_BUY_DLG_PANEL = 325005,         //商品购买弹框

    /** 珍宝商店面板 */
    SHOP_TREASURE_PANEL = 326001,         //珍宝商店面板
    // SHOP_CLOUD_PANEL = 326002,         //云游商店面板
    SHOP_FREE_PANEL = 326003,         //免单商城
    SHOP_FREE_SUC_PANEL = 326004,         //免单成功
    SHOP_FREE_RECORD_PANEL = 326005,         //免单记录


    /**装备 */
    POP_EQUIP_MAIN_WND = 327001, //装备主面板
    POP_EQUIP_SEL_WND = 327002, //装备面板
    POP_EQUIP_ADD_WND = 327003, //装备加成面板
    POP_EQUIP_WEAR_INFO_WND = 327004, //装备穿戴信息面板
    POP_EQUIP_RECYCLE = 327005, //装备回收筛选信息面板


    /**宝物 */
    TREASURE_MAIN = 328001,         //宝物面板
    TREASURE_INFO = 328002,         //宝物面板
    TREASURE_INLAY = 328003,         //宝物镶嵌面板

    /**联盟 */
    LEGION_LIST_WND = 329001,     //联盟列表面板
    LEGION_INFO_PANEL = 329002,         //联盟信息面板
    LEGION_MAIN_WND = 329003,         //联盟联盟面板
    LEGION_CREATE_WND = 329004,         //联盟创建dlg面板
    LEGION_RANK_PANEL = 329008,         //联盟排名面板
    LEGION_INVITATE_PANEL = 329010,         //联盟邀请面板
    LEGION_LIST_WND_UPDATE = 3290012,     //联盟列表面板更新
    LEGION_SET_WND = 3290013,     //联盟设置面板
    LEGION_SET_NOTICE_WND = 3290014,         //联盟 公告修改
    LEGION_APPOINT_WND = 3290015,         //联盟 任命界面
    LEGION_TECH_WND = 3290016,      //联盟科技升级界面

    // POP_BUILD_FIEF_PANEL = 330000,      //封地选择面板
    // POP_BUILD_FIEF_CONSTRU_PANEL = 330001,  //封地建设面板
    // POP_BUILD_FIEF_LIST = 330002,        //封地列表

    // POP_BUILD_GARRET_MAIN = 330003,      //龙腾阁主面板
    // POP_BUILD_GARRET_POPUP = 330004,     //龙腾阁面板弹窗

    POP_GUIDE_SELECT_COUNTRY = 340000,//选择国家界面
    // POP_GUIDE_PLOT1 = 340001,//新手开场图文动画1
    // POP_GUIDE_PLOT2 = 340002,//新手开场图文动画2


    POP_ACTIVITY_REPEAT = 360004,    // 循环活动

    POP_ACTIVITY_ONLINE_REWARD = 360005,    // 在线奖励
    POP_ACTIVITY_ADD_RECHARGE = 360006,    // 精彩活动
    POP_ACTIVITY_SEVEN_DAY = 360007,    // 7日活动
    POP_ACTIVITY_BAR_ATK = 360008,    // 南蛮入侵
    POP_ACTIVITY_EMPEROR_ADVANCE = 360010,    // 襄阳战预告
    POP_ACTIVITY_EMPEROR_DETAILS = 360011,    // 襄阳战战况
    POP_ACTIVITY_EMPEROR_CITY_INFO = 360012,  // 襄阳战信息
    POP_ACTIVITY_EMPEROR_CORONATION = 360013, // 襄阳战皇帝登基公告
    POP_ACTIVITY_EMPEROR_RANK = 360014,       // 襄阳战排行榜
    POP_ACTIVITY_TURNTABLE = 360015,      //转盘
    POP_ACTIVITY_SEVENII = 360016,           //新七天活动
    POP_ACTIVITY_NEWYAER = 360017,           //新春活动

    POP_ACTIVITY_ONE_GIFT_BAG = 360009,   //一元礼包
    POP_ACTIVITY_ADD_GIFTBAG = 390000,    // 限时活动
    POP_ACTIVITY_GIFTBAG_TIP_POP = 390001,    // 限时活动 解锁弹框
    POP_ACTIVITY_ADD_GIFTSHOP = 390002,    // 限时商城

    POP_ACTIVITY_NEW_GENERAL = 361000,   //新武将界面
    POP_ACTIVITY_SELECT_REWARD = 361001,   //选取奖励界面



    // POP_TEMPLE_MAIN_PANEL = 370000, //寺庙

    // POP_TANK_OPEN = 380000, //战车
    // POP_TANK_BUY_OPEN = 380001, //战车皮肤购买

    // /**小秘书 */
    // POP_SECRETARY_VIEW = 380100,

    /**功能预告 */
    // POP_FUNCITON_NOTIC_VIEW = 380201,
    /**新功能开启 */
    // POP_FUNCITON_OPEN_VIEW = 380203,

    /**功能预览界面 */
    POP_FUNCITON_PREVIEW_VIEW = 380205,
    /**新功能弹出界面 */
    POP_FUNCITON_NEW_VIEW = 380207,
    /**通用奖励面板*/
    GET_REWARD_VIEW = 380300,

    /**礼包奖励 */
    POP_GIFT_BAG_VIEW = 390000,


    /**付费类UI */
    POP_PAY_FORTUNE_VIEW = 391003, //幸运转盘
    POP_PAY_First_VIEW = 391004, //首充
    POP_PAY_SHOP_VIEW = 391005, //充值面板
    POP_KING_VIEW = 391006, //封王战
    POP_PAY_SHOP_YU_VIEW = 391007, //充值面板勾玉
    POP_DAILY_SURPRISE = 391008,    //每日惊喜商城

    /**世界地图 */
    POP_WORLD_HERO_PANEL = 392001,//部队选择面板
    POP_WORLD_VIEW_PANEL = 392002,//部队选择面板
    POP_WORLD_HERO_EVT_PANEL = 392003,//部队事件选择面板
    POP_WORLD_CITY_INFO_PANEL = 392004,//城池详细面板
    POP_WORLD_ACCELERATE_PANEL = 392005,//行军加速面板
    POP_WORLD_RULE_PANEL = 392006,//规则面板
    POP_WORLD_BATTLE_VIEW = 392007,//情报面板
    POP_WORLD_BATTLE_PANEL = 392008,//战斗面板
    POP_WORLD_THUM_VIEW = 392009,//小地图
    POP_WORLD_RANK_VIEW = 392010,//部队上阵界面
    POP_WORLD_VISIT_ATTACK = 392011,//拜访攻击
    POP_WORLD_SIEGE_VIEW = 392013, //攻城战信息面板
    POP_WORLD_SEARCH_VIEW = 392014, //搜索信息面板
    POP_WORLD_SIEGE_RESULT = 392015, //攻城战结果面板
    POP_WORLD_SIEGE_KILL = 392016, //攻城战排行面板
    POP_WORLD_FIRST_OCCUPY_PANEL = 392017, //首战奖励面板
    POP_WORLD_MAIN_EXPLOIT_WND = 392018, //功勋面板主界面
    POP_WORLD_LOCK_TASK_PANEL = 392019, //解锁面板详细界面
    POP_WORLD_TROOP_PANEL = 392020, //补兵操作面板
    POP_WORLD_NEW_OPEN_PANEL = 392021, //补兵操作面板
    POP_WORLD_DIALOG_VIEW = 392022,//世界对话框
    POP_WORLD_CITY_TROOP_PANEL = 392023,//城池驻军
    POP_WORLD_CITY_BUILDING = 392024,//城池建设
    POP_WORLD_CITY_BUILD_INFO = 392025,//城池建设情报
    POP_WORLD_NOTICE_VIEW=392026,//国战预告包装主界面

    /**活动军营上下阵 */
    POS_CAMP_VIEW = 393001, //通用布阵
    POS_PARTRO_VIEW = 393002, //巡营布阵

    /**挂机ui */
    POS_PATROL_OFFLINE_REWARD_VIEW = 394000, //离线收益
    POS_PATROL_SPEED_UP_REWARD_VIEW = 394001, //收益加速
    POS_PATROL_REWARD_CHANGE_VIEW = 394002,   //收益变化

    POS_PATROL_AWARD_VIEW = 394003,   //挂机奖励
    POS_PATROL_BOSS_VIEW = 394004,   //挂机boss

    POS_PATROL_GET_AWARD_VIEW = 394005,

    /**
     * 400000
     * GUIDE指引层
     * */
    //new ============================
    GUIDE_DES_VIEW = 400004,//描述界面（属于弹窗层）
    GUIDE_DIALOG_VIEW = 400005,//对话剧情界面（属于弹窗层）
    GUIDE_TOUCH_VIEW = 400006,//指引点击界面（属于弹窗层）
    GUIDE_DELAY_MASK_VIEW = 400007,//指引遮罩
    GUIDE_INTRODUCTION_VIEW = 400008,//剧情
    // GUIDE_GRADIENT_VIEW = 400009,//渐变遮罩
    // GUIDE_CITY_BATTLE_PLOT_VIEW = 400010,//主城战斗剧情
    GUIDE_TOUCH_TIPS = 400011,  //任务跳转提示特效

    /**
     * 490000-490099
     * 国家官职系统
     */
    COUNTRY_MAIN_PANEL = 490000,//主界面
    COUNTRY_APPLY_LIST = 490001,//城池分封
    COUNTRY_JOB_INFO = 490002,//任命界面
    COUNTRY_CORONATION_PANEL = 49003,//国王加冕
    /**
     * 490100-490199
     * 行营系统
     */
    HEADQUARTER_MAIN_PANEL = 490100,//主界面
    HEADQUARTER_INFO_PANEL = 490101,//战斗信息界面


    /**
     * 490200-490299
     * 酒馆系统
     */
    TAVERN_MAIN_PANEL = 490200,//酒馆主界面
    TAVERN_INFO_PANEL = 490201,//酒馆奖励
    TAVERN_BUY_TICK_DLG = 490202,  //快速购买招募令界面
    TAVERN_CHECK_PANEL = 490203,  //预览界面
    TAVERN_SAFETY_PANEL=490204,  //保底积分兑换界面

    /**
     * 490300-490399
     * 排行榜系统
     */
    RANK_MAIN_PANEL = 490300,   //排行榜面板
    /**
     * 490400-490499
     * boss系统
     */
    BOSS_INFO_PANEL = 490400,  //血战群雄主界面
    // BOSS_BOX_REWARD = 490401,  //奖励界面
    // BOSS_BUY_QUICK_PANEL = 490402,    //快速购买
    BOSS_BOX_RANKREWARD = 490403,    //排名奖励
    BOSS_HURT_RANK = 490404,    //伤害榜单

    /**
   * 490500-490599
   * 材料副本系统
   */
    MATERIAL_INFO_PANEL = 490500,  //材料副本主界面
    MATERIAL_INFO__BUY_DLG = 490501,  //材料副本购买次数界面
    /**
     * 缘分490600-490699
     */
    FATE_GENERAL_VIEW = 490600,//武将缘分列表页面
    FATE_GENERAL_ACTIVE_VIEW = 490601,//武将缘分激活页面
    FATE_TEAM_VIEW = 490602,//部队武将缘分列表页面

    /**重生490700-490799*/
    REBIRTH_WND = 490700,      //重生界面
    /**
     * 通用界面
     * 500000
     */
    NOR_SOURCE_VIEW_PANEL = 500001,    //道具来源
    NOR_BOX_INFO_PANEL = 500002,    //宝箱详细显示
    NOR_REWARD__PANEL = 500003,    //奖励通用界面
    PLAYER_INFO_PANEL = 500004,         //玩家信息
    PLAYER_SPEEDY_BUY_PANEL = 500005,         //物品便捷来源界面
    PLAYER_LEVEL_UP_VIEW = 500006,//玩家升级成功面板
    NOR_EQUIP_FULL_VIEW = 500007,//装备上限提示界面
    COM_HELP_DOC = 500008,       //通用帮助文档
    COM_ACT_NOTICE = 500009,//活动
    NOR_FIGHT_VIEW = 500010,    //战力变动提示
    LEGION_INFO_CHECK_VIEW = 500011,    //查看联盟信息
    GENERAL_INFO_CHECK_VIEW = 500012,    //查看武将信息
    COM_BUY_ITEM_WND = 500013,    //购买并使用道具
    TIP_CHECK_ITEM_INFO = 5000014,    //查看道具，装备，宝物信息通用界面
    SERVICE_VIP= 5000015,    //vip客服

    /**
     * vip界面
     */
    VIP_MAIN_PANEL = 510000,

    /**
     * 700000
     * OTHER
     * */

    /** 军备 */
    ARMS_PANEL = 520000,

    /** 膜拜界面 */
    WORSHIP_PANEL = 530000,

    /**
    * 540000-540000
    * 行营系统
    */
    HISTORYWAR_MAIN_PANEL = 540000,//主界面
    HISTORYWAR_INFO_PANEL = 540001,//战斗信息界面

    /**
     * 550000 跨服战系统
     */
    CROSS_SERVER_TEAM_PANEL = 550000,//跨服战布阵界面
    CROSS_SERVER_DETAIL_VIEW = 550001,//跨服战详情展示页面
    CROSS_SERVER_SAND_TABLE = 550002,//战争沙盘
    CRSOS_SERVER_WAR_SITUTION = 550003,//跨服战战况
    CROSS_SERVER_CITY_TIPS = 550004,//城市tips
    CROSS_SERVER_BUFF = 550005,//跨服战buff
    CROSS_SERVER_RANK = 550006,//跨服战排行榜    
    CRSOS_SERVER_LEGION_UI = 550007,//跨服战军团
    CROSS_BARRACKS = 550008,//跨服战总兵库
    CROSS_HERO_PANEL = 550009,  //部队面板
    CROSS_BUY_TOWER_PANEL = 550010,  //购买箭塔
    CROSS_RESULT_VIEW = 550011,  //跨服战结算
}

enum TestNav {
    TEST_ANIM = 1000000,
    TEST_CREATE_LANCER = 1000001,
    TEST_CREATE_CATAPULT = 1000002,
    TEST_CREATE_ARCHER = 1000003,
    TEST_CLEAN = 1000004,
    TEST_CHANGE_STATUS = 1000005,
    TEST_ANIM_SCALE = 1000006,
    TEST_CHANGE_DIR = 1000007,
    TEST_CREATE_KNIGHT = 1000008,
    TEST_CREATE_EFFECT = 1000009,
    TEST_CREATE_TYPE = 1000010,
    TEST_CREATE_HOPLITE = 1000011,
    TEST_CREATE_SQUARE = 1000012,

    TEST_START_SKILL = 1000013,

    TEST_IS_CREATER_SOLDIER = 2000001,
    TEST_WAR = 2000002,
    TEST_SETTING = 2000003,
    TEST_RGB = 2000004,
}

