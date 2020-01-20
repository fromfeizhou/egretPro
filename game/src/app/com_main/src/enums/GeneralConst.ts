

/**标题图片 */
const General_Title_Image = "font_wjsz_png";
/**标题图片 */
const General_Detail_Title_Image = "font_wj2_png";
/**已获得武将 */
const General_Title_Own_Image = "font_wdwj_png";
/**未获得武将 */
const General_Title_Non_Image = "font_whd_png";
/**标题背景 */
const General_Title_Own_Bg = "tavern_wj_fd-BJ_png";

/**长按响应时间 */
const General_LongClick_Response = 500;


/**
 * 类型图标
 */
const General_Type_Image: Array<string> = ["tavern_wj_B-0_png",
    "tavern_wj_B-4_png",
    "tavern_wj_B-2_png",
    "tavern_wj_B-1_png",
    "tavern_wj_B-3_png"];

/**
 * 职业图标
 */
const General_Pro_Image: Array<string> = ["tavern_wj_B-0_png",
    "fight_component_icon-BZ-1_png",
    "fight_component_icon-BZ-3_png",
    "fight_component_icon-BZ-2_png",
    "fight_component_icon-BZ-4_png"];

/**
 * 职业图标对应编号
 */
const General_Pro_Code: Array<number> = [0,
    1,
    3,
    2,
    4];

enum GeneralState {
    /**空闲 */
    IDLE = 0,
    /**上阵 */
    ON_BATTLE = 1,
    /**被捕 */
    ARRESTED = 2,
    /**补兵 */
    SUPPLY = 3,
    /**探索 */
    EXPLORE = 4,
    /**出租 */
    RENT = 5,
}
