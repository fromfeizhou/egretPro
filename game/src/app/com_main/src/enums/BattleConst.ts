/*
 * 技能位移类型
 */
enum EnumSkillMoveType
{
    CHAN_YIN = 1,   //跑过残影
    TU_CHI = 2,     //赵云突刺
    SUN_YI = 3,     //瞬移
}

/*
 * 受击位移 
    1:击退
    2:击飞
 */
enum EnumHurtMoveType
{
    JT_BACK = 1,
    JF = 2,
}

enum EnumFightVideoCmd
{
    DIALOG = 10, //对话
    G_RUN = 11,  //武将走路
    END = 100,   //结束
}

/**技能类型： */
enum SkillType {
	/**1为普通攻击 */
	SKILL_NONE = 1,
	/**2为主动技能 */
	SKILL_ACTIVE = 2,
	/**3为被动攻击 */
	SKILL_PASSIVE = 3,
	/**4召唤物普攻技能 */
	SKILL_ZHAOHUAN = 4,
}

/**
 * 技能显示类型
 * 1 普通全屏技能技能
 * 2 BUFF技能
 */
enum SkillShowType {
	NORMOL_SKILL = 1,
	BUFF_SKILL = 2,
	BAGUA_SKILL = 3,
	LONGjUANFENG_SKILL = 4,
	TUOZHUAICHUJUE_SKILL = 5, //拖拽处决
	YANYUEDAO_SKILL = 6, //偃月刀
	XUANFENGZHAN_SKILL = 7,//旋风斩
	LIEFENG_SKILL = 8, //裂缝
	HJZD_SKILL = 9, //吼叫震动
	ASSAULT = 10, //冲击技能
	BINGYU = 11, //冰雨
	JIANZEHN = 12, //剑阵
	LEIDIAN = 13, //雷电单体
	POCHENG_SKILL = 14, //破城
	BINGYU_COLOR_SKILL = 15, //冰雨新手技能
	MEIHUO_SKILL = 16, //魅惑
	DUB_LEVEL_SKILL = 17, //双层技能
}

/**
 * buff类型 
 * 1.身体中点
 * 2.头顶
 * 3.脚底
 * */
enum BuffType {
	BODY_CENTER_BUFF = 2,
	HEAD_BUFF = 5,
	FOOT_BUFF = 6,
}


//[1暴击 ,2闪避 ,3 免疫, 4破防, 5暴击+破防]
enum AttackResult {
	/**暴击 */
	CRIT = 1,
	/**闪避 */
	DODGE = 2,
	/**免疫 */
	IMMUNE = 3,
	/**破防 */
	DES_DEFENSE = 4,
	/**暴击加破防 */
	CRIT_ADD_DES_DEFENSE = 5,
    /**反弹 */
    REBOUND = 6,
    /**吸收 */
    ABSORB = 7,
    /**克制 */
    RESTRAIN = 8,
}

// 攻击状态图片
var AttackResultImage = [];
AttackResultImage[AttackResult.DODGE] = "battle_shanbi_png";  //闪避
AttackResultImage[AttackResult.IMMUNE] = "battle_wudi_png";   //免疫
AttackResultImage[AttackResult.ABSORB] = ""; //吸收
AttackResultImage[AttackResult.RESTRAIN] = "battle_kezhi_png";//克制

/**
 * 攻城战地图配置
 */
var MAP_ELE_CONFIG = [];
MAP_ELE_CONFIG[6] = {
	// 城墙
	wallImg: "wall_map6_png",
	wall_W: 1286,
	wall_H: 1030,
	wall_x:1285, 
	wall_y:688,

	//箭塔
	towerImg: "jianta_map6_png",
	tower_W: 368,
	tower_H: 352,
	tower_PX: 105,
	tower_PY: -101,

	tower1_x: 784,
	tower1_y: 763,

	tower2_x: 1217,
	tower2_y: 955,

	//破损图片
	posun_img: 'posun_map6_png',
	posun_x: 460,
	posun_y: 210,

	//城门火
	wallFire_x: 1225,
	wallFire_y: 380,

	//箭塔火
	towerfire1_x: 790,
	towerfire1_y: 480,

	towerfire2_x: 1225,
	towerfire2_y: 665,

	//城墙爆战特效
	boom_x: 1200,
	boom_y: 600,

}

MAP_ELE_CONFIG[11] = {
	// 城墙
	wallImg: "wall_map11_png",
	wall_W: 1064,
	wall_H: 877,
	wall_x:1170, 
	wall_y:630,

	//箭塔
	towerImg: "jianta_map11_png",
	tower_W: 159,
	tower_H: 367,
	tower_PX: 105,
	tower_PY: -101,

	tower1_x: 640,
	tower1_y: 698,

	tower2_x: 1078,
	tower2_y: 907,

	//破损图片
	posun_img: 'posun_map11_png',
	posun_x: 585,
	posun_y: 245,

	//城门火
	wallFire_x: 1120,
	wallFire_y: 430,

	//箭塔火
	towerfire1_x: 750,
	towerfire1_y: 450,

	towerfire2_x: 1180,
	towerfire2_y: 650,
	
	//城墙爆战特效
	boom_x: 1100,
	boom_y: 550,
}