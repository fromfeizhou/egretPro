/**
 * 指引类型
 */
enum GuideType{
    // Talk    = 1,  //对话
	// PopView = 2,  //打开弹窗
	// Panel   = 3,  //指向弹窗
	// Tool    = 4,  //指向工具栏
	// Map     = 5,  //地图
    // PopTab  = 6,  //弹窗选项卡
    // Status  = 7,  //指向状态栏
    // PopClose = 8, //弹窗关闭按钮
    MainLine = 1,//主线
    BranchLine = 2,//支线
    WeakGuide = 3,//弱指引（任务跳转触发,不需要后端记录，可反复触发）
};

/**
 * 箭头位置
 */
enum GuideArrowPos {
    TOP = 1,  //在上面
    BOTTOM = 2, //在下面
    LEFT = 3, //左边
    RIGHT = 4, //右边
};