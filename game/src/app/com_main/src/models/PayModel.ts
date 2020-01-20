enum RechargeType {
    /**普通充值 */
    RECHARGE = 0,
    /**勾玉充值 */
    YU_RECHARGE = 1,
}

/**充值 */
class PayModel {
    public static NORMAL_RECHARGE_CFG: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    public static rechargeCfgs: { [key: number]: gameProto.IRechargeConfig };
    public static rechargeRecords: number[];  //通用充值记录

    /**模块初始化 */
    public static init() {
        this.rechargeRecords = [];
    }
    /**清理 */
    public static clear() {
    }


    /**解析充值配置表 */
    public static parseRechargeCfg(cfgs: gameProto.IRechargeConfig[]) {
        this.rechargeCfgs = {};
        for (let i = 0; i < cfgs.length; i++) {
            this.rechargeCfgs[cfgs[i].id] = cfgs[i];
        }
    }

    /**获得充值配置表 */
    public static getRechargeCfg(id: number) {
        return this.rechargeCfgs[id];
    }

}

