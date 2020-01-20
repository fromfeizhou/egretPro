/**本地数据模块
 * localData.ts 拓展
 */
var LocalModel = /** @class */ (function () {
    function LocalModel() {
    }
    LocalModel.init = function () {
        this.noticeLockedState = Dictionary.create();
        this.dayNotices = [
            this.DAY_NOTICE_NORMAL,
            this.DAY_NOTICE_BUILD,
            // this.DAY_NOTICE_AUTO_BUILD,
            this.DAY_NOTICE_TRAIN,
            this.DAY_NOTICE_CITY_BUILD
        ];
        this.initDayNotice();
        this.initGeneralOffRed();
    };
    LocalModel.clear = function () {
        this.noticeLockedState.clear();
    };
    /**========================================================================================================
     * 通知状态 begin
     * ========================================================================================================
     */
    /**是否需要通知 */
    LocalModel.isNeedNotice = function (noticeType) {
        if (noticeType === void 0) { noticeType = LocalModel.DAY_NOTICE_NORMAL; }
        if (GuideModel.hasGuideTrigger())
            return false;
        if (this.noticeLockedState.has(noticeType)) {
            return false;
        }
        return true;
    };
    /**初始化日常通知状态 */
    LocalModel.initDayNotice = function () {
        var date = new Date();
        /**通知列表 */
        for (var i = 0; i < this.dayNotices.length; i++) {
            /** 当天通知关闭(普通)*/
            var noticeType = this.dayNotices[i];
            var norTime = LocalData.getData(noticeType);
            if (norTime != '') {
                var day = new Date(Number(norTime)).getDay();
                if (day == date.getDay()) {
                    this.noticeLockedState.add(noticeType, true);
                }
            }
        }
    };
    /**记录通知状态 */
    LocalModel.recordNotice = function (noticeType, isRecord) {
        if (noticeType === void 0) { noticeType = LocalModel.DAY_NOTICE_NORMAL; }
        if (isRecord === void 0) { isRecord = true; }
        if (isRecord) {
            var timeStr = new Date().getTime().toString();
            LocalData.setData(noticeType, timeStr);
            this.noticeLockedState.add(noticeType, true);
        }
        else {
            LocalData.removeData(noticeType);
            this.noticeLockedState.del(noticeType);
        }
    };
    /**========================================================================================================
     * 通知状态 end
     * ========================================================================================================
     */
    /**========================================================================================================
     * 武将红点记录 begin
     * ========================================================================================================
     */
    /**初始化武将红点记录 */
    LocalModel.initGeneralOffRed = function () {
        var res = LocalData.getData(LocalModel.GENERAL_OFF_RED, "[]");
        this.generalOffReds = JSON.parse(res);
    };
    /**添加武将红点记录 */
    LocalModel.addGeneralOffRed = function (generalId) {
        if (this.generalOffReds.indexOf(generalId) >= 0)
            return;
        this.generalOffReds.push(generalId);
        LocalData.setData(LocalModel.GENERAL_OFF_RED, JSON.stringify(this.generalOffReds));
    };
    /**移除武将红点 */
    LocalModel.removeGeneralOffRed = function (generalId) {
        var index = this.generalOffReds.indexOf(generalId);
        if (index >= 0) {
            this.generalOffReds.splice(index, 1);
        }
        if (this.generalOffReds.length > 0) {
            LocalData.setData(LocalModel.GENERAL_OFF_RED, JSON.stringify(this.generalOffReds));
        }
        else {
            LocalData.removeData(LocalModel.GENERAL_OFF_RED);
        }
    };
    /**是否过滤红点 */
    LocalModel.hasGeneralOffRed = function (generalId) {
        var index = this.generalOffReds.indexOf(generalId);
        return index >= 0;
    };
    /**========================================================================================================
     * 日常通知预定义begin 需要在init函数 的 dayNotices添加
     *========================================================================================================
     */
    /**当天通知-普通 */
    LocalModel.DAY_NOTICE_NORMAL = "day.notice.normal";
    /**当天通知-建筑升级 */
    LocalModel.DAY_NOTICE_BUILD = "day.notice.build";
    /**当天通知-建筑一键升级 */
    LocalModel.DAY_NOTICE_AUTO_BUILD = "day.notice.autoBuild"; //改成每次登陆都提醒
    /**当天通知-部队训练 */
    LocalModel.DAY_NOTICE_TRAIN = "day.notice.train";
    /**当天通知-城市建筑 */
    LocalModel.DAY_NOTICE_CITY_BUILD = "day.notice.cityBuild";
    /**========================================================================================================
   * 日常通知预定义end 需要在init函数 的 dayNotices添加
   *========================================================================================================
   */
    /**========================================================================================================
    *其他预定义 begin
    *========================================================================================================
    */
    /**武将红点记录 */
    LocalModel.GENERAL_OFF_RED = "general.off_red";
    return LocalModel;
}());
