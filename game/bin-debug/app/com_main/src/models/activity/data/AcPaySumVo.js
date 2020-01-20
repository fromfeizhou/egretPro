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
/**累计充值 */
var AcPaySumVo = /** @class */ (function (_super_1) {
    __extends(AcPaySumVo, _super_1);
    function AcPaySumVo() {
        return _super_1.call(this) || this;
    }
    /**解析累计充值数据 */
    AcPaySumVo.prototype.initAllrecharge = function (data) {
        this.paySum = data.paySum;
        this.totaleRecord = data.awardRecordSet;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.id);
    };
    /**领取奖励 */
    AcPaySumVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        this.totaleRecord = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ADD_CHARGE, this.id);
    };
    //获取对应配置表
    AcPaySumVo.prototype.getPaySum = function () {
        return this.paySum;
    };
    //获取对应配置表
    AcPaySumVo.prototype.getRechargeCfgBy = function () {
        return this.configs;
    };
    /** 累计充值 根据充值金额获得item按钮红点*/
    AcPaySumVo.prototype.getAllRechargeBtnRed = function (patsum, id) {
        var state = 1; //进行中
        if (this.totaleRecord && this.totaleRecord.length > 0) {
            for (var i in this.totaleRecord) {
                if (this.totaleRecord[i] != id) { //排除已领的id
                    if (this.paySum > 0 && this.paySum >= patsum) { //充值金额达到条件
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
            if (this.paySum > 0 && this.paySum >= patsum) {
                state = 0;
            }
        }
        return state;
    };
    /**可领奖励 */
    AcPaySumVo.prototype.hasAward = function () {
        for (var key in this.configs) {
            var cfg = this.configs[key];
            if (cfg && cfg.level <= this.paySum && this.totaleRecord.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    };
    /**=====================================================================================
     * 配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcPaySumVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcPaySumVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_INFO(this.id);
    };
    return AcPaySumVo;
}(ActivityVo));
