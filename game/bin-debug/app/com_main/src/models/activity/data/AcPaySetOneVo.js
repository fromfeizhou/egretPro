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
/**单笔充值 */
var AcPaySetOneVo = /** @class */ (function (_super_1) {
    __extends(AcPaySetOneVo, _super_1);
    function AcPaySetOneVo() {
        return _super_1.call(this) || this;
    }
    /**解析单笔充值数据 */
    AcPaySetOneVo.prototype.initRechargeOne = function (data) {
        this.paySetOne = data.paySet;
        this.awardRecordSetOne = data.awardRecordSet;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.id);
    };
    /**领取奖励 */
    AcPaySetOneVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        this.awardRecordSetOne = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SINGLE_CHARGE, this.id);
    };
    //获取对应配置表
    AcPaySetOneVo.prototype.getRechargeCfgBy = function () {
        return this.configs;
    };
    /**可领奖励 */
    AcPaySetOneVo.prototype.hasAward = function () {
        for (var key in this.configs) {
            var cfg = this.configs[key];
            if (cfg && this.paySetOne.indexOf(cfg.level) >= 0 && this.awardRecordSetOne.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    };
    /**判断单笔充值了是否领取 */
    AcPaySetOneVo.prototype.getRechargeOneState = function (level) {
        if (this.paySetOne && this.paySetOne.length > 0) {
            for (var i = 0; i < this.paySetOne.length; i++) {
                if (this.paySetOne[i] == level) {
                    return true;
                }
            }
        }
        return false;
    };
    /**单笔充值 根据活动id取活动单个item数据 */
    AcPaySetOneVo.prototype.getCfgById = function (id) {
        var cfg = this.getRechargeCfgBy();
        return cfg[id];
    };
    /** 单笔充值 根据充值金额获得item按钮红点*/
    AcPaySetOneVo.prototype.getRechargeOneBtnRed = function (payNum, id) {
        var state = 1; //进行中
        var cfg = this.getCfgById(id);
        if (this.awardRecordSetOne && this.awardRecordSetOne.length > 0) {
            for (var j = 0; j < this.awardRecordSetOne.length; j++) {
                var awardId = this.awardRecordSetOne[j];
                if (awardId != id) { //排除已领的id
                    state = this.getRechargeOneState(cfg.level) ? 0 : 1;
                }
                else {
                    state = 2;
                    break;
                }
            }
        }
        else {
            if (this.paySetOne && this.paySetOne.length > 0) {
                for (var i = 0; i < this.paySetOne.length; i++) {
                    if (this.paySetOne[i] == payNum) {
                        state = 0;
                    }
                }
            }
        }
        return state;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcPaySetOneVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcPaySetOneVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_INFO(this.id);
    };
    return AcPaySetOneVo;
}(ActivityVo));
