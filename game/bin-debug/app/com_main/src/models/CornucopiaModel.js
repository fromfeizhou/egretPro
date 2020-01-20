/** 聚宝盆 */
var CornucopiaModel = /** @class */ (function () {
    function CornucopiaModel() {
    }
    //设置聚宝盆数据
    CornucopiaModel.setCornucopiaInfo = function (info) {
        this.m_CornucopiaInfo = info;
    };
    /**更新时间 */
    CornucopiaModel.setCornucopiaTime = function (refreshTime) {
        this.m_CornucopiaInfo.refreshTime = refreshTime;
        com_main.EventMgr.dispatchEvent(CornucopiaEvent.CORN_TIME_UPDATE, null);
    };
    //获聚宝盆数据
    CornucopiaModel.getCornucopiaInfo = function () {
        return this.m_CornucopiaInfo;
    };
    //获取配置金币数量
    CornucopiaModel.getCornucopiaSliverbyCount = function (count) {
        var number = C.GenerateCoinConfig[count].money;
        var exCfg = this.getExCfg();
        var addRate = 1;
        if (exCfg) {
            addRate += exCfg.bonusMoney / 100;
        }
        number = Math.floor(number * addRate);
        return number;
    };
    /**获得元宝上限 */
    CornucopiaModel.getGoldNum = function () {
        var exCfg = this.getExCfg();
        if (exCfg) {
            return exCfg.bonusGoldMax;
        }
        return 0;
    };
    /**获得刷新时间 */
    CornucopiaModel.getGoldRushTime = function () {
        var refreshTime = 1000 * this.m_CornucopiaInfo.refreshTime + this.getCoolTime() - TimerUtils.getServerTimeMill();
        return refreshTime / 1000;
    };
    /**聚宝按钮红点 */
    CornucopiaModel.getCornucopiaFreeRed = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.FREE_MONEY))
            return false;
        var data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        var freeCost = ConstUtil.getValue(IConstEnum.CORNUCOPIA_FREE);
        if (freeCost - data.buyAmountCount > 0) {
            return true;
        }
        return false;
    };
    /**领取按钮红点 */
    CornucopiaModel.getGoldRushTimeRed = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.FREE_MONEY))
            return false;
        if (this.getGoldRushTime() <= 0) {
            return true;
        }
        return false;
    };
    /**获取冷却时间 */
    CornucopiaModel.getCoolTime = function () {
        var exCfg = this.getExCfg();
        if (exCfg) {
            return exCfg.coldTime;
        }
        return 0;
    };
    /**根据等级获取下一级冷却时间 */
    CornucopiaModel.getNextCoolTime = function (jbplv) {
        var exCfg = C.ExtraCoinLevelConfig[jbplv + 1];
        if (exCfg) {
            return exCfg.coldTime;
        }
        return 0;
    };
    /**是否达到上限 */
    CornucopiaModel.isMaxGetToday = function () {
        var data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        return data.reBuyAmountCount == 0;
    };
    /**剩余购买次数 */
    CornucopiaModel.GetLeftBuyNum = function () {
        var data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        return data.reBuyAmountCount;
    };
    //获得消耗
    CornucopiaModel.getCornucopiaCost = function () {
        var data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        var costCfg = C.GenerateCoinConfig[data.buyAmountCount + 1];
        if (costCfg) {
            return costCfg.gold;
        }
        return 0;
    };
    /**根据建筑等级 获取加成配置表 */
    CornucopiaModel.getExCfg = function () {
        var jbplv = MainMapModel.getBuildLevelByType(BuildingType.FUDING); //聚宝盆等级
        if (jbplv == 0)
            jbplv = 1;
        return C.ExtraCoinLevelConfig[jbplv];
    };
    CornucopiaModel.m_CornucopiaInfo = null;
    return CornucopiaModel;
}());
