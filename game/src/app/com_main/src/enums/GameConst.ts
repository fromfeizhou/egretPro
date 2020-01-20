
// -----------------------------------------------------------------------------------

/**八方向角度值 */
enum ActorDirAngle {
	Up = -90,
	Down = 90,
	Left = 180,
	LeftUp = -135,
	LeftDown = 135,
	Right = 0,
	RightUp = -45,
	RightDown = 45,
}
/** 动作状态 */
enum AnimalState {
	Idle = 0,
	Walk = 1,
	Run = 2,
}

/** 动作状态 */
enum UnitAction {
	STAND = 0,
	MOVE = 1,
	USE_SKILL = 2,
}

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
enum UnitType {
	/**武将 */
	GENERAL = 1,
	/**小兵 */
	SOLDIER,
	/**城墙 */
	BUILDING_WALL = 50,
	/**箭塔 */
	BUILDING_BARTIZAN = 51,
	/**栅栏 */
	PALING = 9,
	/**召唤物 */
	ZHAO_HUAN_WU = 10,
}

/**兵种大类 */
enum SoldierMainType {
	/**城墙 */
	NONE = 0,
	/**步兵 */
	FOOTSOLDIER = 1,
	/**骑兵 */
	RIDESOLDIER = 2,
	/**弓箭 */
	ARROWSOLDIER = 3,
	/**枪兵 */
	PIKEMAN = 4,
	/**投石车 */
	HITWALLSOLDIER = 20,
	/**弩车 */
	GLAIVE_TGROWER = 21,
	/**帐篷 */
	TENT = 22,
}

/**武将国家类型 */
enum SoldierNationType {
	/**魏国 */
	WEI = 1,
	/**蜀国 */
	SU = 2,
	/**吴国 */
	WU = 3,
	/**群雄 */
	QUN = 4,
}
/**默认登录角色形象 */
enum RoleImgId {
	/**男 */
	BOY = 1040,
	/**女 */
	GIRL = 1036,

}

/**武将类型 */
enum SoliderGeneralType {
	/**猛将 */
	MENG_JIANG = 1,
	/**豪杰 */
	HAO_JIE = 2,
	/**军师 */
	JUN_SHI = 3,
	/**枪将 */
	QIANG = 4,
}


/**攻守阵营 */
enum FactionType {
	/**1:进攻方 */
	ATK = 1,
	/**2:防守方 */
	DEF = 2,
}

/**敌我类型 */
enum BelongType {
	OWN,
	ENEMY
}

/**国家类型 */
enum CountryType {
	/**
	* 无
	*/
	NONE,
    /**
     * 魏
     */
	WEI,
    /**
     * 蜀
     */
	SHU,
    /**
     * 吴
     */
	WU,
	/**
	 * 群
	 */
	QUN,
    /**
     * 盗贼,叛军,邪恶势力
     */
	TERRORIST,
	/**
     * 黄巾军
     */
	HUANG,
}

// -----------------------------------------------------------------------------------

enum CompleteStatus {
	/**没有条件，未开始 */
	NONE,
	/**条件不满足，暂停 */
	NOTYET,
	/**条件已满足，开始 */
	CANDO,
	/**完成状态，停止 */
	COMPLETE,
}

/**移动类型 */
enum SpeedType {
	/**普通 */
	NONE,
	/**冲锋 */
	ACTIVE,
	/**被推 */
	PASSIVE,
}

/**战斗事件类型 */
enum FightEventType {
	/**1-战斗胜利 */
	FIGHT_WING = 1,
	/**2-召唤援军 */
	CALL_HELP = 2,
	/**3-援军使用战法 */
	FIGHT_HELP = 3,
	/**4-国家联盟 */
	CONTRY_SOLDER = 4,
	/**5-召唤超级援军 */
	CALL_SUPPER_HELP = 5,
}

/**战场状态 */
enum BattleStatus {
	/**不在场景 */
	LEAVE,
	/**战斗集结 */
	JOIN,
	/**战场结束 */
	END,
	/**进入战场但还没集结（补兵情况或进入战场不自动集结时） */
	UNJOIN,
}

/**战斗关卡类型 */
enum CheckPointType {
	/**布阵 */
	NONE = 0,
	/**世界城市战斗 */
	CITY_WAR = 1,
	/**关卡 */
	CHECKPOINT = 2,
	/**擂台 */
	ARENA = 3,
	/**巡查 */
	PATRO = 4,
	/**竞技场 */
	PK = 5,
	/**竞技场防守 */
	PK_DEF = 6,
	/**boss挑战 */
	BOSS = 7,
	/**打野 */
	FIGHT_WILD = 8,
	/**世界地图拜访 */
	CITY_VISIT = 9,
	/**新的世界城市战斗 */
	NEW_CITY_WAR = 10,
	/**关卡带墙 */
	// CHECKPOINT_WALL = 11,
	/**材料副本 */
	MATERIAL = 12,
	/**GM 战斗 */
	GM = 13,
	/**解锁战斗 */
	UNLOCK_WAR = 14,
	/**历史战役 */
	HISTORY_WAR = 15,
	/**跨服战 */
	CROSS_SERVER = 16
}

/**功能图标位置类型 */
enum FunctionPosType {
	FPT_NONE = 0,
	FPT_BOTTOM = 1,
	FPT_RIGHT = 2,
	FPT_RIGHT_II = 3,
	FPT_TOP = 4,

}

/**品质枚举 */
enum QuaEnum {
	/**绿色 */
	QUA_1 = 1,
	/**蓝色 */
	QUA_2 = 2,
	/**紫色 */
	QUA_3 = 3,
	/**橙色 */
	QUA_4 = 4,
	/**红色 */
	QUA_5 = 5,
}

enum LevelOpenType {
	QD = 1,//庆典
	YZ = 2,//远征
	KJ = 3,//科技
	BS = 4,//兵书
	GEM = 5,//宝石
	BW = 6,//b傲物
	ZC = 7,//战车
	SM = 8,//寺庙
	LT = 9,//擂台
	DZ = 10,//对战
}

/**
 * 灯笼类型
 * @author meiyc
 *
 */
enum LanternType {
	/** 普通灯笼 */
	COMMON_LANTERN = 1,
	/** 自燃孔明灯 */
	BURN_LANTERN = 2,
	/** 时间孔明灯 */
	TIME_LANTERN = 3,
	/** 七彩孔明灯 */
	COLOURS_LANTERN = 4,
	/** 炸弹 */
	BOMB = 5,
}


/**Lan标签类型枚举 */
enum LanParamType {
	Default = 0,//默认读取语言包
	Country = 1,//国家id
	Prop = 2,//道具id
	General = 3,//武将id
	CityBuild = 4,//世界地图建筑id
	Tactics = 5,//战法
}

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
const SceneModuleSplit: number = 1000;
/**新建地图在后面加 有配置表写死id */
enum SceneEnums {
	NONE_MAP = 0,
	MAIN_CITY = 1,//主城
	WORLD_CITY = 2,//世界地图
	BATTLE_MAP = 3,//战斗地图
	NOVICE_MAP = 4,//新手地图
	TEST_MAP = 5,//测试地图
	WAIT_BATTLE_MAP = 6,//攻城战排队地图
	AUTO_BATTLE_MAP = 7, //挂机界面
	WORLD_XIANGYANG_CITY = 8,//襄阳战地图
	CROSS_WALL_WAR_MAP = 9,	//跨服城门
	CROSS_WAR_MAP = 10,	//跨服内城战

	ALL = 100,

}
/**场景操作类型 */
enum SceneOperateEnums {
		WATCH_WORLD_BATTLE = 0,
}
/**模块枚举由1000开始 避免与场景枚举冲突（资源组加载预设使用） */
enum ModuleEnums {
	/**武将 */
	GENERAL = 1000,
	/**武将 获得 */
	GENERAL_GET = 1001,
	/**寺庙 */
	TEMPLE = 1002,
	/**封地 */
	FIEF = 1003,
	/**聊天 */
	CHAT = 1004,
	/**决战 */
	DECISIVE = 1005,
	/**vip */
	VIP = 1006,
	/**小秘书 */
	SECRETARY = 1007,
	/**宝石 */
	GEM = 1008,
	/**军功任务 */
	MILITARY_TASK = 1009,
	/**科技 */
	TECHNOLOGY = 1010,
	/**兵书 */
	WARART = 1011,
	/**战车 */
	TANK = 1012,
	// /**擂台 */
	// ARENA = 1013,
	/**酒馆 */
	TAVERN = 1014,
	/**排行榜 */
	RANK = 1015,
	/**君主 */
	ROLE = 1016,
	/**邮件 */
	MAIL = 1016,
	/**小地图 */
	WORLD_MINI_MAP = 1017,
	/**战斗0 */
	BATTLE,
	/**战斗地图动态 */
	BATTLE_MAP_DYNAMICS,
	/**挂机场景 */
	AKB,
	/**新手介绍cg */
	GUIDE_INDRO,
	/**登陆界面 */
	LOGIN,
	LOGIN_NOTICE,
	/**主城界面 */
	MAIN_CITY,
	/**世界地图 */
	WORLD_CITY,
	/**襄阳战地图 */
	WORLD_XIANGYANG_CITY,
	/**选择国家界面 */
	SELECT_COUNTRY,
	/**关机收益界面 */
	OFFLINE_UI,
	/**boss挑战 ui */
	BOSS_UI,
	/**材料副本 */
	ARENA_UI,
	/**征兵ui */
	ARMS_UI,
	/**聚宝盆ui */
	CORNUCOPIA_UI,
	/**国家界面 */
	COUNTRY_UI,
	/**关卡章节界面 */
	QUARTERS_UI,
	/**充值界面 */
	PAY_SHOP_VIEW_UI,
	/**免单商城 */
	FREE_SHOP_UI,
	/**帮派 */
	LEGION_UI,
	/**战斗初始资源 */
	BATTLE_MAP_INIT,
	/**第一次进入游戏资源 */
	FIRST_ENTER_GAME_RES,
	/**碎片资源 */
	FLAGMENT_RES,
	/**活动公告 */
	ACTIVITY_NOTICE,
	/**封王战 */
	KING_BATTLE,
	/**活动界面 */
	ACTIVITY_UI,
	/**7天活动 */
	SEV_DAY_UI,
	/**一元充值 */
	ONE_YUAN_UI,
	/**首充界面 */
	FRIST_PAY_UI,
	/**在线奖励 */
	ONLINE_UI,
	/**building 图标 */
	BUILDING_TIPS,
	/**宝物界面 */
	TREA_VIEW,
	/**福利界面 */
	WELFARE_VIEW,
	/**队伍界面 */
	CAMP_VIEW,
	/**装备界面 */
	EQUIP_VIEW,
	/**皇帝登基 */
	CORONA_VIEW,
	/**等级升级界面 */
	LEVELUP_VIEW,
	/**战斗结算 */
	RESULT_VIEW,
	/**缘分 */
	FATE_UI,
	/**膜拜 */
	WORSHIP_UI,
	/** 转盘*/
	TURNTABLE_UI,
	/**历史战役 */
	HISTORY_BATTLE,
	/**新武将活动 */
	NEW_GEN_UI,
	/**勾玉充值界面 */
	YU_SHOP_VIEW_UI,
	/**新7天活动界面 */
	SEVENII_UI,
	/**襄阳预告界面 */
	XIANGYANG_ADVANCE_VIEW,
	/**襄阳详情界面 */
	XIANGYANG_DETAILS_VIEW,
	/**城市建筑buff资源 */
	CITY_BUILD_BUFF,
	/**战争沙盘 */
	SAND_TABLE_VIEW,
	/**跨服战 */
	CROSS_SERVER_UI,
	/**VIP客服 */
	SERVICE_UI,

}

enum LayerEnums {
	MAP = 1,//地图层
	MENU = 2,//菜单层
	POPUP = 3,//弹窗层
	TOP = 4,//顶层
	GUIDE = 5,//指引层
	NET = 6,	//网络提示层
}

enum GameConfigType {
	LAN = 0,
	CONFIG = 1,
}

/**CD类型 */
enum CoolDownType {
	BuildingSpeed = 1,//建筑加速
}

/**字体空格大小类型 */
enum FontSpaceSize {
	MOBILE = 3.2,
	PC = 1.5,
}

enum PopTitleIconType {
	NONE = 0,
	UPGRADE = 1,//升级
	GENERAL_INFO = 2,//武将信息
	TAVERN = 3,//酒馆
	BF = 4,//兵法
	SM = 5,//寺庙
	LTG = 6,//龙图阁
	GEM = 7,//宝石
	KJ = 8,//科技
	ZC = 9,//战车
	RANK = 10,//排行榜
	FARMLAND = 11,//农田
	MARK = 12,//市场
	MILITARY_TASK = 13,//军功任务（聚宝盆）
	TREASRE_UP = 14,//邮件（宝物升级）
	TREASRE_COM = 15,//（宝物合成）
	BUBINGYING = 16,//（步兵营）
	QIBINGYING = 17,//（骑兵营）
	GONGBINGYING = 18,//（弓兵营）
	HEAD_QUARTERS = 28,// 行营
}

/**士兵模型 */
enum SoilderType {
	RedInfantry = 1005,  //红步兵
	blueInfantry = 1004,  //蓝步兵
	RedArchers = 1000,   //红弓箭手
	BlueArchers = 1001,   //蓝弓箭手
	RedCavalry = 1002,   //红骑兵
	BlueCavalry = 1003,   //蓝骑兵
	RedPIKEMAN = 1031,//红色枪兵1
	BluePIKEMAN = 1032,//蓝色枪兵1
}

/**
 * 雕像枚举
 */
enum StatueType {
	BattleKing = 1,   //战争之王
	MoralityKing = 2, //贤者之王
	FortuneKing = 3,  //财富之王
	BuilderKing = 4,  //建造之王
	PracticeKing = 5, //修炼之王

}

/**膜拜类型 1：皇帝 2:战力排行*/
enum WorshipType {
	KING = 1,       //襄阳战国王
	FIGHT_RANK = 2, //战力排行榜
}