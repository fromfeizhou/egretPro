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
/**消费豪礼 */
var AcConsumeVo = /** @class */ (function (_super_1) {
    __extends(AcConsumeVo, _super_1);
    function AcConsumeVo() {
        return _super_1.call(this) || this;
    }
    /**解析消费豪礼数据 */
    AcConsumeVo.prototype.initConsumption = function (data) {
        this.consumeSum = data.consumeSum;
        this.consumption = data.awardRecordSet;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_CONSUME_GIFT, this.id);
    };
    /**领取奖励 */
    AcConsumeVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        this.consumption = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_CONSUME_GIFT, this.id);
    };
    //获取对应配置表
    AcConsumeVo.prototype.getRechargeCfgBy = function () {
        return this.configs;
    };
    /** 消费豪礼 根据充值金额获得item按钮红点*/
    AcConsumeVo.prototype.getConsumptionBtnRed = function (costNum, id) {
        var state = 1; //进行中
        var consumeSum = this.consumeSum;
        if (this.consumption && this.consumption.length > 0) {
            for (var i in this.consumption) {
                if (this.consumption[i] != id) { //排除已领的id
                    if (consumeSum > 0 && consumeSum >= costNum) { //消费金额达到条件
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
            if (consumeSum > 0 && consumeSum >= costNum) {
                state = 0;
            }
        }
        return state;
    };
    /**可领奖励 */
    AcConsumeVo.prototype.hasAward = function () {
        for (var key in this.configs) {
            var cfg = this.configs[key];
            if (cfg && cfg.level <= this.consumeSum && this.consumption.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcConsumeVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcConsumeVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_CONSUME_GIFT_INFO(this.id);
    };
    return AcConsumeVo;
}(ActivityVo));
