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
/**首充活动 */
var AcPayFirstVo = /** @class */ (function (_super_1) {
    __extends(AcPayFirstVo, _super_1);
    function AcPayFirstVo() {
        return _super_1.call(this) || this;
    }
    /**解析首充数据 */
    AcPayFirstVo.prototype.initPayFirstInfo = function (data) {
        this.paySet = data.paySet;
        this.awardRecordSet = data.awardRecordSet;
        this.configId = data.configId;
        if (!this.getRechargeAwardCfgByType()) {
            ActivityModel.removeActivityInfo(this.id);
        }
        else {
            com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.viewType);
        }
    };
    /**领奖返回 */
    AcPayFirstVo.prototype.updateAward = function (data) {
        this.awardRecordSet = data.activityAward.awardRecord;
        this.configId = data.configId;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.activityAward.message);
        com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_FIRST_PAY_STATE_CHANGE, this.viewType);
        if (!this.getRechargeAwardCfgByType()) {
            ActivityModel.removeActivityInfo(this.id);
        }
    };
    /**
     * 获得首充奖励表id
     * 只返回符合条件的第一条
     */
    AcPayFirstVo.prototype.getRechargeAwardCfgByType = function () {
        var payFirstCfg = this.configs;
        for (var id in payFirstCfg) {
            var info = payFirstCfg[id];
            if (info != null && info != undefined) {
                if (info.id == this.configId) {
                    return info;
                }
            }
        }
        return null;
    };
    /**判断首充充值了是否领取 */
    AcPayFirstVo.prototype.getPayBtnState = function (cfg) {
        if (this.paySet && this.paySet.length > 0) {
            for (var i = 0; i < this.paySet.length; i++) {
                if (this.paySet[i] == cfg.level) {
                    return true;
                }
            }
        }
        return false;
    };
    /**获得首充按钮状态 */
    AcPayFirstVo.prototype.getBtnState = function () {
        var state;
        var cf = this.getRechargeAwardCfgByType();
        if (!cf)
            return false;
        if (this.awardRecordSet && this.awardRecordSet.length > 0) {
            for (var i = 0; i < this.awardRecordSet.length; i++) {
                if (cf.id != this.awardRecordSet[i]) {
                    state = this.getPayBtnState(cf);
                }
            }
        }
        else {
            state = this.getPayBtnState(cf);
        }
        return state;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcPayFirstVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcPayFirstVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_FIRTS_PAY_INFO(this.id);
    };
    return AcPayFirstVo;
}(ActivityVo));
