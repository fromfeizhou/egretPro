var RechargeType;
(function (RechargeType) {
    /**普通充值 */
    RechargeType[RechargeType["RECHARGE"] = 0] = "RECHARGE";
    /**勾玉充值 */
    RechargeType[RechargeType["YU_RECHARGE"] = 1] = "YU_RECHARGE";
})(RechargeType || (RechargeType = {}));
/**充值 */
var PayModel = /** @class */ (function () {
    function PayModel() {
    }
    /**模块初始化 */
    PayModel.init = function () {
        this.rechargeRecords = [];
    };
    /**清理 */
    PayModel.clear = function () {
    };
    /**解析充值配置表 */
    PayModel.parseRechargeCfg = function (cfgs) {
        this.rechargeCfgs = {};
        for (var i = 0; i < cfgs.length; i++) {
            this.rechargeCfgs[cfgs[i].id] = cfgs[i];
        }
    };
    /**获得充值配置表 */
    PayModel.getRechargeCfg = function (id) {
        return this.rechargeCfgs[id];
    };
    PayModel.NORMAL_RECHARGE_CFG = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return PayModel;
}());
