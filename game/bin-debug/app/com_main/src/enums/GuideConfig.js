/**
 * 指引类型
 */
var GuideType;
(function (GuideType) {
    // Talk    = 1,  //对话
    // PopView = 2,  //打开弹窗
    // Panel   = 3,  //指向弹窗
    // Tool    = 4,  //指向工具栏
    // Map     = 5,  //地图
    // PopTab  = 6,  //弹窗选项卡
    // Status  = 7,  //指向状态栏
    // PopClose = 8, //弹窗关闭按钮
    GuideType[GuideType["MainLine"] = 1] = "MainLine";
    GuideType[GuideType["BranchLine"] = 2] = "BranchLine";
    GuideType[GuideType["WeakGuide"] = 3] = "WeakGuide";
})(GuideType || (GuideType = {}));
;
/**
 * 箭头位置
 */
var GuideArrowPos;
(function (GuideArrowPos) {
    GuideArrowPos[GuideArrowPos["TOP"] = 1] = "TOP";
    GuideArrowPos[GuideArrowPos["BOTTOM"] = 2] = "BOTTOM";
    GuideArrowPos[GuideArrowPos["LEFT"] = 3] = "LEFT";
    GuideArrowPos[GuideArrowPos["RIGHT"] = 4] = "RIGHT";
})(GuideArrowPos || (GuideArrowPos = {}));
;
