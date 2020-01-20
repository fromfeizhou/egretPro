/*
 * 技能位移类型
 */
var EnumSkillMoveType;
(function (EnumSkillMoveType) {
    EnumSkillMoveType[EnumSkillMoveType["CHAN_YIN"] = 1] = "CHAN_YIN";
    EnumSkillMoveType[EnumSkillMoveType["TU_CHI"] = 2] = "TU_CHI";
    EnumSkillMoveType[EnumSkillMoveType["SUN_YI"] = 3] = "SUN_YI";
})(EnumSkillMoveType || (EnumSkillMoveType = {}));
/*
 * 受击位移
    1:击退
    2:击飞
 */
var EnumHurtMoveType;
(function (EnumHurtMoveType) {
    EnumHurtMoveType[EnumHurtMoveType["JT_BACK"] = 1] = "JT_BACK";
    EnumHurtMoveType[EnumHurtMoveType["JF"] = 2] = "JF";
})(EnumHurtMoveType || (EnumHurtMoveType = {}));
var EnumFightVideoCmd;
(function (EnumFightVideoCmd) {
    EnumFightVideoCmd[EnumFightVideoCmd["DIALOG"] = 10] = "DIALOG";
    EnumFightVideoCmd[EnumFightVideoCmd["G_RUN"] = 11] = "G_RUN";
    EnumFightVideoCmd[EnumFightVideoCmd["END"] = 100] = "END";
})(EnumFightVideoCmd || (EnumFightVideoCmd = {}));
/**技能类型： */
var SkillType;
(function (SkillType) {
    /**1为普通攻击 */
    SkillType[SkillType["SKILL_NONE"] = 1] = "SKILL_NONE";
    /**2为主动技能 */
    SkillType[SkillType["SKILL_ACTIVE"] = 2] = "SKILL_ACTIVE";
    /**3为被动攻击 */
    SkillType[SkillType["SKILL_PASSIVE"] = 3] = "SKILL_PASSIVE";
    /**4召唤物普攻技能 */
    SkillType[SkillType["SKILL_ZHAOHUAN"] = 4] = "SKILL_ZHAOHUAN";
})(SkillType || (SkillType = {}));
/**
 * 技能显示类型
 * 1 普通全屏技能技能
 * 2 BUFF技能
 */
var SkillShowType;
(function (SkillShowType) {
    SkillShowType[SkillShowType["NORMOL_SKILL"] = 1] = "NORMOL_SKILL";
    SkillShowType[SkillShowType["BUFF_SKILL"] = 2] = "BUFF_SKILL";
    SkillShowType[SkillShowType["BAGUA_SKILL"] = 3] = "BAGUA_SKILL";
    SkillShowType[SkillShowType["LONGjUANFENG_SKILL"] = 4] = "LONGjUANFENG_SKILL";
    SkillShowType[SkillShowType["TUOZHUAICHUJUE_SKILL"] = 5] = "TUOZHUAICHUJUE_SKILL";
    SkillShowType[SkillShowType["YANYUEDAO_SKILL"] = 6] = "YANYUEDAO_SKILL";
    SkillShowType[SkillShowType["XUANFENGZHAN_SKILL"] = 7] = "XUANFENGZHAN_SKILL";
    SkillShowType[SkillShowType["LIEFENG_SKILL"] = 8] = "LIEFENG_SKILL";
    SkillShowType[SkillShowType["HJZD_SKILL"] = 9] = "HJZD_SKILL";
    SkillShowType[SkillShowType["ASSAULT"] = 10] = "ASSAULT";
    SkillShowType[SkillShowType["BINGYU"] = 11] = "BINGYU";
    SkillShowType[SkillShowType["JIANZEHN"] = 12] = "JIANZEHN";
    SkillShowType[SkillShowType["LEIDIAN"] = 13] = "LEIDIAN";
    SkillShowType[SkillShowType["POCHENG_SKILL"] = 14] = "POCHENG_SKILL";
    SkillShowType[SkillShowType["BINGYU_COLOR_SKILL"] = 15] = "BINGYU_COLOR_SKILL";
    SkillShowType[SkillShowType["MEIHUO_SKILL"] = 16] = "MEIHUO_SKILL";
    SkillShowType[SkillShowType["DUB_LEVEL_SKILL"] = 17] = "DUB_LEVEL_SKILL";
})(SkillShowType || (SkillShowType = {}));
/**
 * buff类型
 * 1.身体中点
 * 2.头顶
 * 3.脚底
 * */
var BuffType;
(function (BuffType) {
    BuffType[BuffType["BODY_CENTER_BUFF"] = 2] = "BODY_CENTER_BUFF";
    BuffType[BuffType["HEAD_BUFF"] = 5] = "HEAD_BUFF";
    BuffType[BuffType["FOOT_BUFF"] = 6] = "FOOT_BUFF";
})(BuffType || (BuffType = {}));
//[1暴击 ,2闪避 ,3 免疫, 4破防, 5暴击+破防]
var AttackResult;
(function (AttackResult) {
    /**暴击 */
    AttackResult[AttackResult["CRIT"] = 1] = "CRIT";
    /**闪避 */
    AttackResult[AttackResult["DODGE"] = 2] = "DODGE";
    /**免疫 */
    AttackResult[AttackResult["IMMUNE"] = 3] = "IMMUNE";
    /**破防 */
    AttackResult[AttackResult["DES_DEFENSE"] = 4] = "DES_DEFENSE";
    /**暴击加破防 */
    AttackResult[AttackResult["CRIT_ADD_DES_DEFENSE"] = 5] = "CRIT_ADD_DES_DEFENSE";
    /**反弹 */
    AttackResult[AttackResult["REBOUND"] = 6] = "REBOUND";
    /**吸收 */
    AttackResult[AttackResult["ABSORB"] = 7] = "ABSORB";
    /**克制 */
    AttackResult[AttackResult["RESTRAIN"] = 8] = "RESTRAIN";
})(AttackResult || (AttackResult = {}));
// 攻击状态图片
var AttackResultImage = [];
AttackResultImage[AttackResult.DODGE] = "battle_shanbi_png"; //闪避
AttackResultImage[AttackResult.IMMUNE] = "battle_wudi_png"; //免疫
AttackResultImage[AttackResult.ABSORB] = ""; //吸收
AttackResultImage[AttackResult.RESTRAIN] = "battle_kezhi_png"; //克制
/**
 * 攻城战地图配置
 */
var MAP_ELE_CONFIG = [];
MAP_ELE_CONFIG[6] = {
    // 城墙
    wallImg: "wall_map6_png",
    wall_W: 1286,
    wall_H: 1030,
    wall_x: 1285,
    wall_y: 688,
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
};
MAP_ELE_CONFIG[11] = {
    // 城墙
    wallImg: "wall_map11_png",
    wall_W: 1064,
    wall_H: 877,
    wall_x: 1170,
    wall_y: 630,
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
};
