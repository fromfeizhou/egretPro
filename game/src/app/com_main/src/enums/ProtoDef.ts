// enum ProtoDef {
//     // 错误码推送
//     ERROR_CODE = 10,

//     // 公告推送
//     NOTICE_PUSH = 20,
    
//     // 物品变更推送
//     PUSH_VALUES_MESSAGE = 30,
    
//     // 推送活动信息
//     PUSH_ACTIVITY_INFO = 35,
    
//     // 推送功能开放信息
//     PUSH_FUNCTION_INFO = 40,

//     //player
//     PLAYER_GET_PLAYERS = 101,	// 获取角色信息
//     PLAYER_CREATE = 102,	// 创建角色
//     PLAYER_REMOVE = 103,	// 角色删除
//     PLAYER_LOGIN = 104,		// 角色登录
//     JOIN_COUNTRY = 105,		//加入国家
//     QUERY_MINIMUM_COUNTRY = 106,	//查询人数最少的国家
//     PLAYER_LOGIN_END = 107,     //玩家登录结束协议
//     PLAYER_HEARTBEAT = 110,	// 心跳
//     PLAYER_UPLEVEL = 120,	// 快速升级
//     PLAYER_RANDOM_NAME = 121,	//随机角色名
//     PUSH_LOGIN_GIFT = 131,		//推送登录礼包
//     RECEIVE_LOGIN_GIFT = 132,	//领取登录礼包
//     PUSH_FATIGUE_INFO = 141,	//推送疲劳信息
//     PUSH_REMOTE_LOGIN = 142,    //异地登陆
//     PLAYER_BATTLE_LIST = 151,   //玩家登录返回战斗信息给前端
    
    
//     //gift
// 	GIFT_EXCHANGE = 201,	//兑换礼包
// 	RECEIVE_AWARD = 202,	//领取奖励

//     //battle
//     BATTLE_LIST = 501,
//     BATTLE_ENTER = 502,
//     BATTLE_LEAVE = 503,
//     BATTLE_END = 504,
//     BATTLE_UNIT = 505,
//     BATTLE_UNIT_DIE = 506,
//     BATTLE_UNIT_MOVE = 507,
//     BATTLE_USE_SKILL = 508,
//     BATTLE_UNIT_STOP = 509,
//     BATTLE_SKILL_MISSILE = 510,
//     BATTLE_UNIT_ATTR_CHANGE = 511,
//     BATTLE_UNIT_ADD_BUFF = 512,
//     BATTLE_UNIT_REMOVE_BUFF = 513,
//     BATTLE_JOIN = 520,
//     BATTLE_WITHDRAW = 521,
//     BATTLE_DISPATCH_UNIT = 522,
//     BATTLE_LINEUP = 523,
//     BATTLE_USE_SPELL = 524,
//     BATTLE_SPELL_EFFECT = 525,
//     BATTLE_PLAYER_JOINED = 526,
//     BATTLE_PLAYER_WITHDREW = 527,
//     BATTLE_UNIT_DISAPPEAR = 528,
//     BATTLE_UNIT_FORCE_MOVE = 529,
//     BATTLE_PK = 530,
//     BATTLE_PK_STATUS = 531,
//     BATTLE_EVENT_UPDATE = 532,
//     BATTLE_PAUSE = 533,
//     BATTLE_PLAY = 534,
//     BATTLE_FLUSH = 535,
//     BATTLE_UNIT_ELASTIC_MOVE = 536,
//     BATTLE_UPDATE_LOGIC_EVENT = 537,
//     BATTLE_NOTICE = 538,
//     BATTLE_CHANGE_PLAYER_STATUS = 539,
//     //战场测试
//     BATTLE_TEST_CREATE_BATTLE = 571,
//     BATTLE_TEST_CREATE_UNIT = 572,
//    	BATTLE_TEST_MOVE = 573,
    

//     //citybattle
//     CITY_BATTLE_LOAD_WORLD_MAP = 601,
//     CITY_BATTLE_ENTER = 602,
//     CITY_BATTLE_HIT_WALL_Rank = 603,
//     CITY_BATTLE_UPDATE_CITY = 604,
//     CITY_BATTLE_BUY_BATTLE_BUFF = 605,
//     CITY_BATTLE_CITY_INFO = 606,
//     CITY_BATTLE_WORLD_AFFAIRS = 607,
//     CITY_BATTLE_VOTE_COUNTRY_TASK = 609,
//     CITY_BATTLE_MILLITARY_WIN = 610,
//     CITY_BATTLE_APPLY_FIEF = 611,  //抢封地
//     CITY_BATTLE_HIT_WALL_REWARD = 612, //城池撞城榜奖励请求
// 	CITY_BATTLE_PUSH_WIN_REWARD = 613,  //攻守战奖励推送
// 	CITY_BATTLE_GET_WIN_REWARD_INFO = 614, //查看攻守战奖励
// 	CITY_BATTLE_GAIN_WIN_REWARD = 615,  //领取攻守战奖励
// 	CITY_BATTLE_TRIGGER_WORLD_AFFAIR = 616,  //触发城池外事件
// 	CITY_BATTLE_GAIN_WORLD_AFFAIR_REWARD = 617, //获取城池外事件奖励
// 	CITY_BATTLE_EXP_MILITARY_FLAG = 618,   //军功经验旗信息 
// 	CITY_BATTLE_EXP_MILITARY_FLAG_END = 619, //经验军功旗结束计算
// 	CITY_BATTLE_GET_FIEFS = 620,   //查询封地的信息
// 	CITY_BATTLE_FIEF_CHANGE = 621,  // 失去封地
// 	CITY_BATTLE_APPLY_CONSTRUCTION = 622, // 玩家请求建设
// 	CITY_BATTLE_GAIN_CONSTRUCTION_REWARD = 623,  //获取玩家建设的奖励
// 	CITY_BATTLE_USE_RECRUITMENT_ORDER = 624, // 使用募兵令
// 	CITY_BATTLE_RANDOM_CONSTRUCTION = 625, // 随机有空位的建设
// 	CITY_BATTLE_TARGET_CITY = 626, //国君可选择攻击目标城池
// 	CITY_BATTLE_CHOOSE_CITY = 627, //国君选择攻击城池
// 	CITY_BATTLE_HELP_GAIN_CONSTRUCTION_REWARD = 628,  //  帮助获取玩家建设的奖励
// 	CITY_BATTLE_WARRIOR = 629, //猛将提示
// 	CITY_BATTLE_EXIT_WORLD_MAP = 630, //离开世界地图界面
// 	CITY_BATTLE_NOVICE_AFFAIR = 631, //新手请求城池外事件
// 	CITY_BATTLE_TRIGGER_NOVICE_AFFAIR = 632,  //新手触发城池外事件
// 	CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD = 633, //新手获取城池外事件奖励
	
//     //chat
//     CHAT_SEND = 701, //发送聊天
//     CHAT_PUSH = 702, //推送聊天
//     CHAT_SEARCH_PLAYER = 703, //查找玩家
//     CHAT_PRIVATE_CONTACT_LIST = 705,//私聊名单
//     ADD_CHAT_PRIVATE_CONTACT = 706,//加入私聊联系人列表

//     //tavern 酒馆
//     TAVERN_INFO = 801,
//     TAVERN_ATTRACT = 802,

//     //general
//     GENERAL_ALL = 902, //获取招募的武将列表
//     GENERAL_DETAIL = 903, //根据武将id，获取武将信息
//     GENERAL_USE_EXP_BOOK = 921, //武将使用经验书
//     GENERAL_UP_STAR = 922,      //武将升星
//     RECRUITED_GENERAL = 923,    // 招募武将
//     GENERAL_SKILL_LIST = 931,   // 获取武将技能列表
//     OPEN_SKILL = 932,           // 开启技能(技能获得 或者更新协议)
//     GENERAL_TREASURE_WEAR = 933,//武将宝物佩戴
    
    
//     // building
//     BUILDING_INFO = 1001,	// 获取建筑信息
//     BUILDING_ACTIVATED = 1002,	//激活建筑
//     BUILDING_UP_LEVEL = 1003,	//建筑升级
//     BUILDING_SPEED = 1004,		//建筑加速
//     BUILDING_CLEAN_COOLING = 1005,		//建筑清CD
//     BUILDING_LEVY = 1006,		//征收
//     MANUFACTURE_PROPS = 1007,	// 制造策略道具
//     GET_PROPS = 1008,		//领取道具
//     GET_BUILDING_ITEM = 1009,	//领取君主升级道具
//     PUSH_BUILDING_OPEN = 1021,	//推送建筑开放信息
//     PUSH_BUILDING_ITEM = 1022,	//推送君主升级道具

// 	// mailbox
// 	MAILBOX_LIST = 1101, //加载邮件列表
// 	MAILBOX_DELETE = 1102, //删除邮件
// 	MAILBOX_GET_ATTACHMENT = 1103, //领取附件
// 	MAILBOX_NEW = 1104, //新邮件通知
// 	MAILBOX_READ = 1105, //读取邮件
	
// 	//task
// 	TASK_MILITARY_VIEW = 1201,
// 	TASK_MILITARY_CHANGE = 1202,
// 	TASK_ABANDON = 1203,
// 	TASK_COMMIT = 1204,
// 	MILITARY_POWER_RANK = 1205,
// 	MILITARY_POWER_DIVINATION = 1206,
// 	TASK_MILITARY_SPEED = 1207,
// 	TASK_MILITARY_REFRESH = 1208,
	
// 	//backpack
//     BACKPACK_QUERY = 1301,
//     BACKPACK_USE_ITEM = 1302, //使用道具
//     BACKPACK_SAFE_USE = 1303, //使用安全道具
    
//     //novice
//     NOVICE_VIEW = 1401, //查询新手进度，
//     NOVICE_COMMIT = 1402,//新手指引提交
//     NOVICE_IGNORE = 1403,//新手指引跳过
//     NOVICE_BATTLE = 1404,//新手战斗
//     NOVICE_DATA = 1405,//新手数据

//     NOVICE_GUIDE_INFO = 1406,//新手指引信息
    
    
//     //valuebuff
//     VALUEBUFF_TYPE_ADD = 1501, //获取资源加成
    
//     // decisiveBattle
// 	DECISIVE_BATTLE = 1601,	//决战信息
// 	DECISIVE_BATTLE_INSPIRE	=	1602,	//鼓舞
// 	DECISIVE_BATTLE_BUILD = 1603,	//建设
// 	DECISIVE_BATTLE_APPLY = 1604,	//申请
// 	DECISIVE_BATTLE_EXAMINE = 1605,	//审核
// 	DECISIVE_BATTLE_APPROVE = 1606,	//批准
// 	DECISIVE_BATTLE_ACCEPT_PRIZE = 1607,	//领奖
// 	PUSH_DECISIVE_BATTLE = 1608,	//推送决战信息
// 	PUSH_RESOURCE_REWARD = 1609,	//推送资源奖励信息
	
// 	// celebration 
// 	GET_CELEBRATION = 1701,	//获取庆典信息
// 	CEREMONIES = 1702,		//举办庆典
// 	LIGHT_LANTERN = 1703,	//点灯笼
// 	RECEIVE_CELEBRATION_AWARD = 1704,	//领取奖励
// 	START_CELEBRATION = 1705,	//开始庆典

// 	// arena
//     ARENA_ID = 1801,  //擂台等级
//     ENTER_ARENA_BATTLE = 1802,  //进入擂台战斗
//     CLEAN_UP_ARENA_BATTLE = 1803, //擂台扫荡
//     ARENA_RESET = 1804,  //擂台重置
//     ARENA_REWARD_LIST = 1805,//擂台奖励列表
//     ARENA_GET_REWARD = 1806,//擂台领取奖励 
//     ARENA_BATTLE_REWARD = 1807,//擂台战斗奖励
    
// 	// gemstone
//     GEMSTONE_ALL_INFO = 1901, //宝石列表
//     GEMSTONE_UP = 1902, //宝石升级
//     GEMSTONE_STOP_UP = 1903, //取消宝石自动升级
    
//     // sellactivity
//     SELL_ACTIVITY_INFO = 2001, // 获取盛典档次记录信息
//     SELL_ACTIVITY_FREE = 2002, //免费获取盛典档次
//     SELL_ACTIVITY_BUY = 2003, //购买盛典档次
    
//     // tank
//     TANK_INFO = 2101, // 获取战车信息
//     TANK_STRENGTHEN = 2102, // 战车强化
//     TANK_USE = 2103, // 使用战车
//     TANK_BUY = 2104, // 购买战车
    
//     // boatArrow
//     BOAT_ARROW_INFO = 2201, // 获取草船借箭信息
//     BOAT_FREE = 2202, // 免费领取草船
//     BOAT_BUY = 2203, // 购买草船
//     BOAT_ARROW_GEMSTONE = 2204, // 箭矢兑换宝石
	
// 	// country
// 	COUNTRY_ALLIANCE = 2301, //国家结盟或解除联盟
// 	COUNTRY_OFFICIAL_CHANGE  = 2302, //国家玩家官职改变
	
// 	// expedition
// 	EXPEDITION_PLAYER_LIST = 2401, //对战筛选名单
// 	EXPEDITION_BATTLE = 2402, // 发起挑战
// 	EXPEDITION_BATTLE_RESULT = 2403, // 战斗结果
// 	EXPEDITION_PLAYER_REFRESH_LIST = 2404, //对战筛选名名单刷新
// 	EXPEDITION_SEARCH_BOOK = 2405,  //对战搜刮兵书
	
// 	//technology
// 	TECHNOLOGY_VIEW = 2501, //科技视图
// 	TECHNOLOGY_UPGRADE = 2502, //科技升级（激活）
// 	TECHNOLOGY_RESET = 2503,//科技重置
//     TECHNOLOGY_INFO =2504, //科技信息（升级）
//     TECHNOLOGY_UPGRADE_BY_GOLD = 2505,//立刻升级
    
	
// 	//warart
// 	WARART_VIEW = 2601,
// 	WARART_STRENGTHEN = 2602,
	
// 	//rank
// 	RANK_VIEW = 2701,
	
// 	//silverDial
// 	SILVER_DIAL_VIEW = 2801,
// 	SILVER_DIAL_DRAW = 2802,
	
// 	// buyreward
// 	BUY_REWARD_INFO = 2901, // 获取消费送礼活动信息
// 	BUY_REWARD_TAKE = 2902, // 领取奖励
	
// 	// secretary
// 	SECRETARY_INFO = 3001, // 获取小秘书信息
// 	OPEN_OR_STOP = 3002, // 开启或者暂停小秘书
// 	SECRETARY_RENEW = 3003, // 续费小秘书
// 	OBTAIN_REWARD = 3004, // 获取奖励
	
// 	// 三顾茅庐
// 	THREE_VISITS_ADD_FREE_COUNT = 3101,  //三顾茅庐可免费寻访
// 	THREE_VISITS_REFRESH = 3102, //三顾茅庐 寻访
// 	THREE_VISITS_GAIN_REWARD = 3103, // 三顾茅庐 获取奖励
// 	THREE_VISITS_UP_STAR = 3104, // 三顾茅庐 升星
// 	THREE_VISITS_AUTO_REWARD = 3105, // 三顾茅庐 自动获取奖励
// 	THREE_VISITS_GET_REWARD = 3106,  // 三顾茅庐 查询玩家上次是否有奖励
	
// 	//寺庙
// 	TEMPLE_VIEW = 3201, //寺庙界面
// 	TEMPLE_SACRIFICE = 3202, //祭祀
// 	TEMPLE_BOX_OPEN = 3203, //开宝箱
	
// 	//七擒孟获
// 	SEVEN_MENG_VIEW = 3301, //七擒孟获界面
// 	SEVEN_MENG_DRAW = 3302, //七擒孟获抽取
	
// 	//曹操起兵
// 	CAO_RISE_VIEW = 3401, //曹操起兵界面
// 	CAO_RISE_REWARD = 3402, //曹操起兵领奖


//     //任务
//     // GET_PLAYER_MISSION = 3501,//获取任务
//     // UPDEATE_MISSION = 3502,//更新某个任务
//     // MISSION_REWARD = 3503,//领取任务奖励
//     // ADD_MISSION = 3504, //新增任务
//     // MISSION_ACTIVE_INFO = 3505,//活跃度
//     // MISSION_ACTIVE_REWAED= 3506,//领取
//     C2S_TASK_LIST=3501,//获取任务列表
// 	S2C_TASK_LIST=3502,	//返回任务列表
// 	C2S_TASK_RECEIVE=3503,//接取任务请求
// 	S2C_TASK_RECEIVE=3504,//返回任务请求
// 	C2S_TASK_REWARD=3505,//领取奖励
// 	S2C_TASK_REWARD=3506,//返回奖励
// 	C2S_LIVENESS_INFO=3520,//活跃度奖励列表
// 	S2C_LIVENESS_INFO=3521,
// 	C2S_LIVENESS_RECEIVE=3522,//领取活跃度奖励
// 	S2C_LIVENESS_RECEIVE=3523,


//     // 联盟
// 	CREATE_GUILD = 3601, //创建联盟
// 	GET_GUILD_INFO= 3602, // 获取自己所在的联盟的信息
// 	GUILD_LIST = 3603, // 获取联盟列表
// 	APPLY_JOIN_GUILD = 3604, // 申请加入联盟
// 	OTHER_APPLY_JOIN_GUILD = 3605, // 别人申请加入联盟
// 	ACCEPT_APPLY_JOIN_GUILD = 3607, // 接受别人加入联盟
// 	JOIN_GUILD = 3608,  // 加入联盟
// 	KICK_OUT_GUILD = 3609, // 把别人踢出联盟
// 	KICK_OUT_FROM_GUILD = 3610, // 踢出联盟
// 	CHANGE_GUILD_LEADER = 3611, // 改变联盟团长
// 	CHANGE_NAME = 3612,  // 改变联盟名称
// 	CHANGE_DECLARATION = 3613, // 改变联盟宣言
// 	GET_GUILD_LIST_BY_NAME = 3614, // 通过搜索名称获取联盟列表
// 	ADD_DONATION = 3615,  // 捐献
// 	BE_APPOINT_POSITION = 3616,  // 捐献
// 	GUILD_SHOP_LIST = 3621, // 联盟商店列表
// 	GUILD_REPLENISH_GOODS = 3622, // 联盟商店补货
// 	GUILD_BUY_GOODS = 3623, // 联盟商店 购买商品
// 	UPDATE_GUILD_GOODS = 3624, // 联盟商店更新某个商品信息 
// 	REFRESH_GUILD_TREASURE = 3631, // 联盟更新宝藏信息
// 	GET_OTHERS_TREASURE_INFO = 3632, // 联盟获取其他人的需要帮助的宝藏列表
// 	HELP_OTHERS_TREASURE = 3633, // 联盟获取其他人的需要帮助的宝藏列表
// 	HELP_TREASURE = 3634, // 联盟帮助挖宝
// 	GET_TREASURE_REWARD = 3635, // 获取挖宝奖励
// 	GET_OTHERS_BUILDING_DATA = 3636, // 联盟获取其他人的需要帮助的建筑列表
// 	HELP_OTHERS_BUILDING_DATA = 3637, // 联盟帮助其他人的需要帮助的建筑
//     LEAVE_GUILD = 3638, // 退出联盟
// 	APPLY_GUILD_LEADER = 3639, // 申请联盟会长
// 	CHECK_APPLY_JOIN_GUILD = 3617, // 申请入会待审核
//     DISSOLVE_GUILD = 3618,//解散联盟
// 	//公告
// 	ANNOUNCE_INFO_LIST = 3701, //获取
// 	ANNOUNCE_DEL = 3702, 	//移除公告
// 	ANNOUNCE_HORSELAMP = 3703, 	//推送跑马灯公告
//     // SYSTEM_NOTICE_INFO_LIST = 5501,//获取公告信息
//     // SYSTEM_NOTICE_DEL = 5502,//移除公告信息
//     // SYSTEM_NOTICE_HORSELAMP = 5503,//推送跑马灯公告
	
// 	//商人
// 	Travel_Shop_List = 3801, //云游商人购物列表
// 	Fixed_Shop_List = 3802, //珍宝商人购物列表
// 	Buy_Merchant_Good = 3803, //购买商品
// 	Refresh_Merchant_List = 3804, //刷新云游商人商品列表

// 	GET_MERCHANT = 3805,//获得商城信息
// 	HAND_REFRESH_MERCHANT = 3806,//手动刷新
// 	MERCHANT_BUY_GOODS = 3807,//商城购买物品
//     //宝物
// 	TREASURE_ALL_INFO = 3901,//宝物列表
// 	TREASURE_UP_GRADE = 3902,//请求升级宝物
//     TREASURE_UPGRADE_STAR = 3903,   //宝物升星
//     TREASURE_ASSEMBLING_GEMSTONE = 3904,    //宝物装配宝石
//     GAIN_TREASURE = 3905,   //获得宝物
//     TREASURE_ASSEMBLING_GENERAL = 3906, //武将装配宝物
	
// 	TRAINING_CAMP_ID = 4001,//获取玩家练兵营关数
// 	ENTER_TRAINING_CAMP_BATTLE = 4002,//进入训练营战斗结果
// 	//聚宝盆
// 	Generate_Silver_Coin = 4101, //聚宝
// 	Extra_Gold = 4102, //额外元宝
// 	Jackpot_Info = 4103 ,//基本信息
//     //联盟科技
// 	GUILD_TECHNOLOGY_VIEW = 4201, //科技视图
// 	GUILD_TECHNOLOGY_UPGRADE = 4202, //科技升级
// 	GUILD_TECHNOLOGY_DONATION = 4203,//联盟捐献返回
// 	GUILD_TECHNOLOGY_LEVEL_UP = 4204, //联盟科技升级返回
//     //签到
// 	GET_SIGN_UP = 4301,//请求签到信息
// 	SIGN_UP = 4302,//签到
// 	SUPPLEMENT_SIGN_UP = 4303,//补签
// 	RECEIVE_SIGN_UP_EXTRA_REWARD = 4304,//请求获得额外奖励
	
// 	//充值
// 	RECHARGE_INFO = 4401,//充值信息
//     GET_BUY_ORDER = 4402 ,//获取订单
//     GOLD_BUY_GOODS = 4403,//元宝购买
//     DELIVERY_GOODS_BY_RMB = 4404,//RMB购买成功
//   //  FIRST_RECHARGE_REWARD = 4405,//
//     RECEIVE_DAY_CARD_REWARD = 4406, //周卡月卡奖励
// 	BUY_GROW_FUND = 4407,//购买成长基金
// 	RECEIVE_GROW_FUND_REWARD = 4408,//领取奖励
	
// 	//每日登陆
// 	DAILY_LOGIN_ACT = 4501,//每日登陆
// 	DAILY_LOGIN_ACT_REWARD = 4502,//每日登陆领奖
	
// 	//转盘抽奖
// 	TURN_TABLE_VIEW = 4601,//转盘状态
// 	SPIN_TURN_TABLE = 4602,//抽奖结果
// 	//活跃度
// 	ACTIVATION_STATUS = 4701,//活跃度状态
// 	ACTIVATION_REWARD = 4702,//领奖
//     GUILD_MATERIAL_DONATION_COUNT = 4205,//军团材料捐献次数刷新
//     //充值
//     // RECHARGE_INFO = 4700, //充值信息
//     // FIRST_RECHARGE_REWARD = 4701,//首充奖励
//     // ACCUMULATIVE_RECHARGE_REWARD = 4702,//累计充值奖励
//     // RECEIVE_DAYCARD_REWARD = 4703, //月卡信息
//     //练兵营
//     TRAINING_ARMY = 1023,	//练兵
//     TRAINING_CLEAN_COOLING = 1024,//练兵清CD
//     GET_TRAIN_ARMY = 1025,//收货士兵
//     GET_ARMY = 4001, //请求兵种数量
//     ARMY_UPGRADE_LEVEL = 4002,//兵种进阶

//     /** 行营系统 */
//     HQ_GET_INFO     = 4701, //请求获得行营信息
//     HQ_CLEAN_UP     = 4702, //请求行营扫荡信息
//     HQ_CHALLENGES   = 4703, //行营请求挑战信息
//     HQ_RECEIVE_BOX  = 4704, //请求获取宝箱
// 	HQ_CHANLLNGES_REWARD = 4705,//行营挑战胜利结算信息
//     HQ_BUY_RESET_COUNT = 4706,//行营购买挑战次数

//     //世界地图
//     WORLD_EVENT_LIST = 4801, //世界地图事件信息
//     WORLD_EVENT_MOVE = 4802, //事件前往
//     WORLD_EVENT_VISIT = 4803, //事件拜访
//     WORLD_HERO_LIST = 4804, //武将信息列表
//     WORLD_UPDATE_HEOR_STATUS = 4805, //更新武将信息
//     WORLD_RES_EVENT_LIST = 4806, //野外资源点信息
//     WORLD_UPDATE_RES_EVENT = 4807, //更新野外资源点信息
//     WORLD_GET_RES_EVENT_REWARD = 4808, //野外资源点奖励
//     WORLD_SPECIAL_EVENT_REWARD = 4809, //特殊事件奖励通知
//     WORLD_VISIT_LIST = 4810, //获取可以拜访的列表返回
//     WORLD_ACCELERATE_EVENT = 4811, //部队加速
//     WORLD_BACK_EVENT = 4812, //部队召回
//     WORLD_ATTACK_EVENT_LIST = 4813, //世界地图攻击事件列表
//     WORLD_UPDATE_ATTACK_EVENT = 4814, //更新攻击事件
//     WORLD_GET_BATTLE_ID = 4815,//获取battleid
//     WORLD_VISIT_BATTLE_ID = 4841, // 推送拜访比武战斗id
//     WORLD_SIEGE_LIST = 4851, // 攻城战所有信息
//     WORLD_SIEGE_UPDATE = 4852, // 更新攻城战信息
//     WORLD_SIEGE_RESULT = 4853, // 攻城战信息结果
//     WORLD_SIEGE_UPDATE_BATTLE = 4854, // 攻城战更新战斗id
//     WORLD_SIEGE_CITY_RESULT = 4855, //攻城战结果
//     WORLD_SIEGE_KILL_LIST = 4856, //攻城战排行


//     //军营
    
//     FORMUNIT_HERO_LIST = 4830, //部队信息请求
//     FORMUNIT_UPDATE = 4831, //上阵下阵请求
//     FORMUNIT_ONEKEY = 4832, //一键上阵请求
//     FORMUNIT_DISMISS = 4833, //部队解散
//     FORMUNIT_RECOVER = 4834, //部队补兵
//     FORMUNIT_SAVE = 4835, //保存部队阵型请求

//     C2S_TEAM_LIST=4860,     //队伍列表
// 	S2C_TEAM_LIST=4861,     //队伍列表
// 	C2S_TEAM_UP=4862,       //队伍变更
// 	S2C_TEAM_UP=4863,       //队伍变更
// 	C2S_TEAM_SUPPLEMENTARY_TROOPS=4864, //补充兵力
// 	S2C_TEAM_SUPPLEMENTARY_TROOPS=4865, //补充兵力
//     S2C_TEAM_COUNT = 4868,  //获取队伍最大数

//     //活动军营
//     CAMP_SAVE = 5101, //保存部队阵型请求
//     CAMP_HERO_LIST = 5102, //部队信息请求
//     CAMP_ONEKEY = 5103, //部队一键上阵

//     //pvp
//     APK_GET_MY_APK = 5201,//本人的竞技场信息
//     APK_GET_CHALLENGE_LIST = 5202,//竞技场列表
//     APK_CHALLENGE = 5203,//发起挑战
//     APK_BUY_COUNT = 5204,//购买次数
//     APK_RANK_LIST = 5205,//排行榜
//     APK_CHALLENGE_HIS = 5206,//战报
//     APK_FAST_CHALLENGE = 5207, //扫荡
//     APK_CHALLENGE_RESULT = 5208, //挑战结算
//     APK_CHALLENGE_CHECK = 5209, //刷新排名
    


    


//     /** 国家系统 */
//     COUNTRY_INFO            = 4901, //国家信息
//     COUNTRY_NOTICE          = 4902, //公告编辑
//     COUNTRY_APPLY_JOB       = 4903, //官职任命
//     COUNTRY_APPLY_CITY      = 4904, //城池任命
//     COUNTRY_APPLY_LIST      = 4905, //拉去任命列表
//     COUNTRY_TASK_FINISH     = 4906, //完成国家任务
//     COUNTRY_ABDICATE        = 4907, //禅让
//     COUNTRY_TASK_UPDATE     = 4908, //刷新任务

// 	APPOINT_POSITION = 3615,//任命联盟职位
// 	CHECK_PLAYER_DETAILS = 5001,//查看玩家详情
// 	INVITE_JOIN_GUILD = 5002,//邀请加入联盟:邀请人
// 	BE_INVITE_JOIN_GUILD = 5003,//邀请加入联盟:被邀请人
// 	SURE_INVITE_JOIN_GUILD = 5004,//确定被邀请加入联盟:邀请人
// 	BE_SURE_INVITE_JOIN_GUILD = 5005,//确定被邀请加入联盟:被邀请人
// 	JOIN_GUILD_STATUS = 5006,//入团设置
// 	GUILD_ICON_STATUS = 5007,//联盟标志设置
// 	GUILD_INFORMATION = 5008,//联盟消息
//     /** 挂机 */
// 	GET_PATROL = 5301,//获得巡查信息
// 	PATROL_CHALLENGE = 5302,//挑战巡查信息
// 	PATROL_RECEIVE_REWARD = 5303,//挑战巡查信息
//     PATROL_WINE = 5304,//巡查喝酒
// 	Patrol_Challenge_Reward = 5305,//巡查挑战完获得奖励
// 	GET_PATROL_RECORD = 5306,//获取巡查战报
//     //获得怪物信息
// 	GET_BOSS = 5401,
// 	//挑战怪物
// 	BOSS_CHALLENGES = 5402,
// 	//挑战怪物获胜信息
// 	BOSS_WIN_CHALLENGERS = 5403,
// }
// let protoDefMap = {};
// for (let key in ProtoDef) {
//     protoDefMap[ProtoDef[key]] = key;
// }