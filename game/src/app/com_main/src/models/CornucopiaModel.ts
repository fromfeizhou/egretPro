/** 聚宝盆 */
class CornucopiaModel {
    private static m_CornucopiaInfo: gameProto.IS2C_TREASURE_WASHBOWL_INFO = null;
    //设置聚宝盆数据
    public static setCornucopiaInfo(info: gameProto.IS2C_TREASURE_WASHBOWL_INFO) {
        this.m_CornucopiaInfo = info;
    }

    /**更新时间 */
    public static setCornucopiaTime(refreshTime: number) {
        this.m_CornucopiaInfo.refreshTime = refreshTime;
        com_main.EventMgr.dispatchEvent(CornucopiaEvent.CORN_TIME_UPDATE, null);
    }

    //获聚宝盆数据
    public static getCornucopiaInfo() {
        return this.m_CornucopiaInfo;
    }

    //获取配置金币数量
    public static getCornucopiaSliverbyCount(count: number) {
        let number = C.GenerateCoinConfig[count].money;
        let exCfg = this.getExCfg();
        let addRate = 1;
        if (exCfg) {
            addRate += exCfg.bonusMoney / 100;
        }
        number = Math.floor(number * addRate);
        return number;
    }

    /**获得元宝上限 */
    public static getGoldNum() {
        let exCfg = this.getExCfg();
        if (exCfg) {
            return exCfg.bonusGoldMax;
        }
        return 0;
    }

    /**获得刷新时间 */
    public static getGoldRushTime() {
        let refreshTime = 1000 * this.m_CornucopiaInfo.refreshTime + this.getCoolTime() - TimerUtils.getServerTimeMill();

        return refreshTime / 1000;
    }

    /**聚宝按钮红点 */
    public static getCornucopiaFreeRed() {
        if (!FunctionModel.isFunctionOpen(FunctionType.FREE_MONEY)) return false;

        let data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        let freeCost = ConstUtil.getValue(IConstEnum.CORNUCOPIA_FREE);
        if (freeCost - data.buyAmountCount > 0) {
            return true;
        }
        return false;
    }

    /**领取按钮红点 */
    public static getGoldRushTimeRed() {
        if (!FunctionModel.isFunctionOpen(FunctionType.FREE_MONEY)) return false;

        if (this.getGoldRushTime() <= 0) {
            return true;
        }
        return false;
    }

    /**获取冷却时间 */
    public static getCoolTime() {
        let exCfg = this.getExCfg();
        if (exCfg) {
            return exCfg.coldTime;
        }
        return 0;
    }
    /**根据等级获取下一级冷却时间 */
    public static getNextCoolTime(jbplv:number) {
        
        let exCfg = C.ExtraCoinLevelConfig[jbplv+1];
        if (exCfg) {
            return exCfg.coldTime;
        }
        return 0;
    }

    /**是否达到上限 */
    public static isMaxGetToday() {
        let data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        return data.reBuyAmountCount == 0;
    }

    /**剩余购买次数 */
    public static GetLeftBuyNum() {
        let data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        return data.reBuyAmountCount;
    }

    //获得消耗
    public static getCornucopiaCost() {
        let data = NormalModel.getFunCountById(IFunCountEnum.TREASURE_WASHBOWL_COUNT);
        let costCfg = C.GenerateCoinConfig[data.buyAmountCount + 1];
        if (costCfg) {
            return costCfg.gold;
        }
        return 0;
    }


    /**根据建筑等级 获取加成配置表 */
    public static getExCfg() {
        let jbplv = MainMapModel.getBuildLevelByType(BuildingType.FUDING);//聚宝盆等级
        if (jbplv == 0) jbplv = 1;

        return C.ExtraCoinLevelConfig[jbplv];
    }
}