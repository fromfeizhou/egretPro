var VipModel = /** @class */ (function () {
    function VipModel() {
    }
    /**模块初始化 */
    VipModel.init = function () {
        this.MAX_VIP = Utils.objectLenght(C.VipConfig) - 1;
        this.parseCfgToDic();
        this.parseVipCfg();
    };
    /**清理 */
    VipModel.clear = function () {
        this.vipPrivillDic = null;
    };
    /**获得玩家vip特权 */
    VipModel.getPlayerPrivillByType = function (type) {
        // if (RoleData.vipLevel == 0) return 0;
        if (this.vipPrivillDic[RoleData.vipLevel] && this.vipPrivillDic[RoleData.vipLevel][type]) {
            return this.vipPrivillDic[RoleData.vipLevel][type];
        }
        return 0;
    };
    /**是否拥有特权 */
    VipModel.hasPrivillege = function (type) {
        return this.getPlayerPrivillByType(type) > 0;
    };
    /**获得vip头像框 */
    VipModel.getVipSrc = function (vip) {
        return (vip > 0) ? "vipBg" + Math.ceil(vip / 3) + "_png" : 'vipBg0_png';
    };
    /**获得vip文本 */
    VipModel.getVipLabSrc = function (vip) {
        return (vip > 0) ? "vipLab" + Math.floor(vip) + "_png" : '';
    };
    /**是否达到元宝购买vip等级 */
    VipModel.isHVipGoldBuy = function () {
        return RoleData.vipLevel >= this.getHVipGoldLv();
    };
    /**是否达到显示元宝购买vip等级 */
    VipModel.isHVipGoldDis = function () {
        return RoleData.vipLevel >= ConstUtil.getValue(IConstEnum.HIGH_VIP_BUY_DIS);
    };
    /**rmb 转换高v元宝购买价格 */
    VipModel.getHVipGoldBuyPrice = function (price) {
        return price * ConstUtil.getValue(IConstEnum.HIGH_VIP_BUY_PRICE);
    };
    /**高v购买限制等级 */
    VipModel.getHVipGoldLv = function () {
        return ConstUtil.getValue(IConstEnum.HIGH_VIP_BUY_LV);
    };
    /**vip直购判断 */
    VipModel.canHVipBuy = function (price) {
        if (VipModel.isHVipGoldBuy()) {
            if (PropModel.isItemEnough(PropEnum.GOLD, price, 1)) {
                return true;
            }
        }
        else {
            EffectUtils.showTips('Vip等级不足', 1, true);
        }
        return false;
    };
    //=============================================================================================================================================
    //配置表 begin
    //============================================================================================================================================= 
    /**解析特权配置 */
    VipModel.parseCfgToDic = function () {
        this.vipPrivillDic = {};
        this.vipPrivillList = {};
        for (var level = 0; level <= VipModel.MAX_VIP; level++) {
            this.vipPrivillDic[level] = {};
            this.vipPrivillList[level] = [];
        }
        var configArr = C.VipPrivillegesConfig;
        for (var key in C.VipPrivillegesConfig) {
            if (unNull(C.VipPrivillegesConfig[key])) {
                var cfg = C.VipPrivillegesConfig[key];
                for (var level = 0; level <= VipModel.MAX_VIP; level++) {
                    var value = cfg["vip" + level];
                    if (value > 0) {
                        value = cfg.valType == 0 ? value : value / 10000;
                        var data = { key: Number(key), value: value };
                        this.vipPrivillDic[level][data.key] = value;
                        this.vipPrivillList[level].push(data);
                    }
                }
            }
        }
    };
    /**解析vip表 */
    VipModel.parseVipCfg = function () {
        this.viplvCfg = {};
        for (var key in C.VipConfig) {
            var cfg = C.VipConfig[key];
            if (unNull(cfg)) {
                this.viplvCfg[cfg.level] = cfg;
            }
        }
    };
    /**获得vip配置表 */
    VipModel.getVipCfgByLv = function (level) {
        return this.viplvCfg[level] || this.viplvCfg[0];
    };
    /**获得vip特权列表 */
    VipModel.getVipPrivilByVip = function (vip) {
        return this.vipPrivillList[vip];
    };
    /**判断相对于前一个特权提升 */
    VipModel.checkVipPrivileUp = function (curLevel, key) {
        if (curLevel <= 0)
            return false;
        return this.vipPrivillDic[curLevel][key] > this.vipPrivillDic[curLevel - 1][key];
    };
    /**判断到哪一个特权会提升 */
    VipModel.getVipPrivileUp = function (curLevel, key) {
        for (var index = curLevel; index < this.MAX_VIP; index++) {
            if (this.vipPrivillDic[index + 1][key] > this.vipPrivillDic[index][key])
                return index + 1;
        }
        // return this.vipPrivillDic[curLevel][key] > this.vipPrivillDic[curLevel - 1][key];
        return 0;
    };
    /**更新vipVo数据 */
    VipModel.updateVipVo = function (data) {
        if (!this.vipVo) {
            this.vipVo = new VipVo(data);
        }
        else {
            this.vipVo.update(data);
        }
        RoleData.vipLevel = this.vipVo.vipLevel;
        RoleData.vipIntegral = this.vipVo.vipExp;
        return this.vipVo;
    };
    /**每日奖励弹框显示 */
    VipModel.receiveDailyReward = function (data) {
        if (data.errorCode == 0) {
            var cfg = VipModel.getVipCfgByLv(VipModel.vipVo.vipLevel);
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.dailyReward);
            }
        }
    };
    /**等级奖励弹框显示 */
    VipModel.receiveLevelReward = function (data) {
        if (data.errorCode == 0) {
            var cfg = VipModel.getVipCfgByLv(VipModel.currenReceiveLevel);
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.levelReward);
                VipModel.currenReceiveLevel = 0;
            }
        }
    };
    /**
     * 判断当前等级是否有等级奖励
     *
     */
    VipModel.isHasLevAwardByLev = function (vipLevel) {
        if (vipLevel < 0 || vipLevel > VipModel.MAX_VIP)
            return false;
        var rLevl = RoleData.vipLevel;
        if (rLevl < vipLevel)
            return false;
        //判断是否被领取
        if (VipModel.vipVo.receivedVipLevelReward.indexOf(vipLevel) != -1)
            return false;
        return true;
    };
    /**
     * vip红点检测
     */
    VipModel.checkVipRedPoint = function () {
        if (VipModel.vipVo.vipDailyReward)
            return true;
        // let rLevl: number = RoleData.vipLevel;
        // for (let index = 0; index < rLevl; index++) {
        //     if (VipModel.vipVo.receivedVipLevelReward.indexOf(index) == -1)
        //         return true;
        // }
        return false;
    };
    VipModel.MAX_VIP = 15; //vip等级上限
    VipModel.currenReceiveLevel = 0;
    VipModel.isReChargeBtnClick = false; //是否是充值返回操作
    return VipModel;
}());
