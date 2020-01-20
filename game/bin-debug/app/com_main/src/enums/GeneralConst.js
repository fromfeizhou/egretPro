/**标题图片 */
var General_Title_Image = "font_wjsz_png";
/**标题图片 */
var General_Detail_Title_Image = "font_wj2_png";
/**已获得武将 */
var General_Title_Own_Image = "font_wdwj_png";
/**未获得武将 */
var General_Title_Non_Image = "font_whd_png";
/**标题背景 */
var General_Title_Own_Bg = "tavern_wj_fd-BJ_png";
/**长按响应时间 */
var General_LongClick_Response = 500;
/**
 * 类型图标
 */
var General_Type_Image = ["tavern_wj_B-0_png",
    "tavern_wj_B-4_png",
    "tavern_wj_B-2_png",
    "tavern_wj_B-1_png",
    "tavern_wj_B-3_png"];
/**
 * 职业图标
 */
var General_Pro_Image = ["tavern_wj_B-0_png",
    "fight_component_icon-BZ-1_png",
    "fight_component_icon-BZ-3_png",
    "fight_component_icon-BZ-2_png",
    "fight_component_icon-BZ-4_png"];
/**
 * 职业图标对应编号
 */
var General_Pro_Code = [0,
    1,
    3,
    2,
    4];
var GeneralState;
(function (GeneralState) {
    /**空闲 */
    GeneralState[GeneralState["IDLE"] = 0] = "IDLE";
    /**上阵 */
    GeneralState[GeneralState["ON_BATTLE"] = 1] = "ON_BATTLE";
    /**被捕 */
    GeneralState[GeneralState["ARRESTED"] = 2] = "ARRESTED";
    /**补兵 */
    GeneralState[GeneralState["SUPPLY"] = 3] = "SUPPLY";
    /**探索 */
    GeneralState[GeneralState["EXPLORE"] = 4] = "EXPLORE";
    /**出租 */
    GeneralState[GeneralState["RENT"] = 5] = "RENT";
})(GeneralState || (GeneralState = {}));
