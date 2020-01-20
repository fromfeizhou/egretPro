var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**成长基金 */
var GrowthFundVo = /** @class */ (function (_super_1) {
    __extends(GrowthFundVo, _super_1);
    function GrowthFundVo() {
        return _super_1.call(this) || this;
    }
    /**解析成长基金数据 */
    GrowthFundVo.prototype.initGrowFund = function (data) {
        this.buyGrowthFund = data.buyGrowthFund;
        // this.paySet = data.paySet;
        this.awardRecordSet = data.awardRecordSet; //活动领奖记录
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GROWTH_FUN, null);
    };
    /**领取奖励 */
    GrowthFundVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        this.awardRecordSet = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_GROWTH_FUN, null);
    };
    //获取对应配置表
    GrowthFundVo.prototype.getRechargeCfgBy = function () {
        return C.ActivityGrowthFundRewardConfig;
    };
    /** 成长基金 item按钮红点*/
    GrowthFundVo.prototype.getGrowFundBtnRed = function (costNum, id) {
        var state = 1; //进行中
        var awardRecordSet = this.awardRecordSet;
        // if (!this.buyGrowthFund) {
        //     return state;
        // }
        if (this.awardRecordSet && this.awardRecordSet.length > 0) {
            for (var i in this.awardRecordSet) {
                if (this.awardRecordSet[i] != id) { //排除已领的id
                    if (RoleData.level > 0 && RoleData.level >= costNum) { //君主等级达到条件
                        state = 0;
                    }
                }
                else { //已领取
                    state = 2;
                    break;
                }
            }
        }
        else {
            if (RoleData.level > 0 && RoleData.level >= costNum) {
                state = 0;
            }
        }
        return state;
    };
    /**有可领奖励 */
    GrowthFundVo.prototype.hasAward = function () {
        if (!this.buyGrowthFund) {
            return 0;
        }
        for (var key in C.ActivityGrowthFundRewardConfig) {
            var cfg = C.ActivityGrowthFundRewardConfig[key];
            if (cfg && RoleData.level >= cfg.playerLevel && this.awardRecordSet.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    };
    /**冲值表 */
    GrowthFundVo.prototype.getRechargeCfg = function () {
        return this.rechargeCfgs[0];
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**请求活动内容(子类重写)  */
    GrowthFundVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_GROWTH_FUND_INFO(this.id);
    };
    return GrowthFundVo;
}(ActivityVo));
