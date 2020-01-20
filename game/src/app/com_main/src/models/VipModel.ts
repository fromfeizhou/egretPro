
class VipModel {
    public static MAX_VIP: number = 15; //vip等级上限

    private static vipPrivillDic: { [level: number]: { [key: number]: number } }; //vip特权配置 level-key-val
    private static vipPrivillList: { [level: number]: IKeyVal[] }; //vip特权配置数组
    private static viplvCfg: { [level: number]: VipConfig };     //vip配置表
    public static vipVo: VipVo;
    private static _firstCharge: boolean;//是否是首充
    public static currenReceiveLevel: number = 0;
    public static isReChargeBtnClick: boolean = false;//是否是充值返回操作


    /**模块初始化 */
    public static init() {
        this.MAX_VIP = Utils.objectLenght(C.VipConfig) - 1;
        this.parseCfgToDic();
        this.parseVipCfg()
    }
    /**清理 */
    public static clear() {
        this.vipPrivillDic = null;
    }

    /**获得玩家vip特权 */
    public static getPlayerPrivillByType(type: VipPrivillType) {
        // if (RoleData.vipLevel == 0) return 0;
        if (this.vipPrivillDic[RoleData.vipLevel] && this.vipPrivillDic[RoleData.vipLevel][type]) {
            return this.vipPrivillDic[RoleData.vipLevel][type];
        }
        return 0;
    }

    /**是否拥有特权 */
    public static hasPrivillege(type: VipPrivillType) {
        return this.getPlayerPrivillByType(type) > 0;
    }

    /**获得vip头像框 */
    public static getVipSrc(vip: number) {
        return (vip > 0) ? `vipBg${Math.ceil(vip / 3)}_png` : 'vipBg0_png';
    }
    /**获得vip文本 */
    public static getVipLabSrc(vip: number) {
        return (vip > 0) ? `vipLab${Math.floor(vip)}_png` : '';
    }

    /**是否达到元宝购买vip等级 */
    public static isHVipGoldBuy() {
        return RoleData.vipLevel >= this.getHVipGoldLv();
    }

    /**是否达到显示元宝购买vip等级 */
    public static isHVipGoldDis() {
        return RoleData.vipLevel >= ConstUtil.getValue(IConstEnum.HIGH_VIP_BUY_DIS);
    }

    /**rmb 转换高v元宝购买价格 */
    public static getHVipGoldBuyPrice(price: number) {
        return price * ConstUtil.getValue(IConstEnum.HIGH_VIP_BUY_PRICE);
    }

    /**高v购买限制等级 */
    public static getHVipGoldLv() {
        return ConstUtil.getValue(IConstEnum.HIGH_VIP_BUY_LV);
    }

    /**vip直购判断 */
    public static canHVipBuy(price: number) {
        if (VipModel.isHVipGoldBuy()) {
            if (PropModel.isItemEnough(PropEnum.GOLD, price, 1)) {
                return true;
            }
        } else {
            EffectUtils.showTips('Vip等级不足', 1, true);
        }
        return false
    }
    //=============================================================================================================================================
    //配置表 begin
    //============================================================================================================================================= 
    /**解析特权配置 */
    public static parseCfgToDic() {
        this.vipPrivillDic = {};
        this.vipPrivillList = {};
        for (let level = 0; level <= VipModel.MAX_VIP; level++) {
            this.vipPrivillDic[level] = {};
            this.vipPrivillList[level] = [];
        }

        let configArr = C.VipPrivillegesConfig;
        for (let key in C.VipPrivillegesConfig) {
            if (unNull(C.VipPrivillegesConfig[key])) {
                let cfg = C.VipPrivillegesConfig[key];
                for (let level = 0; level <= VipModel.MAX_VIP; level++) {
                    let value = cfg[`vip${level}`];
                    if (value > 0) {
                        value = cfg.valType == 0 ? value : value / 10000;
                        let data: IKeyVal = { key: Number(key), value: value };
                        this.vipPrivillDic[level][data.key] = value;
                        this.vipPrivillList[level].push(data);
                    }
                }
            }
        }
    }

    /**解析vip表 */
    private static parseVipCfg() {
        this.viplvCfg = {};
        for (let key in C.VipConfig) {
            let cfg = C.VipConfig[key];
            if (unNull(cfg)) {
                this.viplvCfg[cfg.level] = cfg;
            }
        }
    }

    /**获得vip配置表 */
    public static getVipCfgByLv(level: number) {
        return this.viplvCfg[level] || this.viplvCfg[0];
    }

    /**获得vip特权列表 */
    public static getVipPrivilByVip(vip: number) {
        return this.vipPrivillList[vip];
    }
    /**判断相对于前一个特权提升 */
    public static checkVipPrivileUp(curLevel: number, key: number): boolean {
        if (curLevel <= 0)
            return false;
        return this.vipPrivillDic[curLevel][key] > this.vipPrivillDic[curLevel - 1][key];
    }

    /**判断到哪一个特权会提升 */
    public static getVipPrivileUp(curLevel: number, key: number): number {
        for (let index = curLevel; index < this.MAX_VIP; index++) {
            if (this.vipPrivillDic[index + 1][key] > this.vipPrivillDic[index][key])
                return index + 1;
        }
        // return this.vipPrivillDic[curLevel][key] > this.vipPrivillDic[curLevel - 1][key];
        return 0;
    }
    /**更新vipVo数据 */
    public static updateVipVo(data: gameProto.IRechargeInfo) {
        if (!this.vipVo) {
            this.vipVo = new VipVo(data);
        } else {
            this.vipVo.update(data);
        }

        RoleData.vipLevel = this.vipVo.vipLevel;
        RoleData.vipIntegral = this.vipVo.vipExp;
        return this.vipVo;
    }
    /**每日奖励弹框显示 */
    public static receiveDailyReward(data: gameProto.IS2C_VIP_DAILY_REWARD) {
        if (data.errorCode == 0) {
            let cfg = VipModel.getVipCfgByLv(VipModel.vipVo.vipLevel);
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.dailyReward);
            }

        }
    }
    /**等级奖励弹框显示 */
    public static receiveLevelReward(data: gameProto.IS2C_VIP_LEVEL_REWARD) {
        if (data.errorCode == 0) {
            let cfg = VipModel.getVipCfgByLv(VipModel.currenReceiveLevel);
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.levelReward);
                VipModel.currenReceiveLevel = 0;
            }
        }
    }
    /**
     * 判断当前等级是否有等级奖励
     * 
     */
    public static isHasLevAwardByLev(vipLevel: number) {
        if (vipLevel < 0 || vipLevel > VipModel.MAX_VIP)
            return false;
        let rLevl: number = RoleData.vipLevel;
        if (rLevl < vipLevel)
            return false;
        //判断是否被领取
        if (VipModel.vipVo.receivedVipLevelReward.indexOf(vipLevel) != -1)
            return false;
        return true;
    }
    /**
     * vip红点检测
     */
    public static checkVipRedPoint(): boolean {
        if (VipModel.vipVo.vipDailyReward)
            return true;
        // let rLevl: number = RoleData.vipLevel;
        // for (let index = 0; index < rLevl; index++) {
        //     if (VipModel.vipVo.receivedVipLevelReward.indexOf(index) == -1)
        //         return true;
        // }
        return false;
    }
    /**充值奖励弹框提示 */
    //=============================================================================================================================================
    //配置表 end
    //============================================================================================================================================= 

}

