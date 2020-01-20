var TurnplateModel = /** @class */ (function () {
    function TurnplateModel() {
    }
    TurnplateModel.init = function () {
        debug("MissionModel:init-------->>");
        this.m_curTurnplateItemIdList = [];
    };
    TurnplateModel.clear = function () {
        this.init();
    };
    /**获取当前转盘物品列表 */
    TurnplateModel.getCurTurnPlateItemList = function () {
        return this.m_curTurnplateItemIdList;
    };
    /**获取刷新时间戳 */
    TurnplateModel.getEndTime = function () {
        return this.m_turntableTime;
    };
    /**转盘数据 */
    TurnplateModel.initTurnTableInfo = function (data) {
        this.m_turntableTime = data.time;
        this.m_turntableFreeCount = data.count;
        this.m_turnplateGroupId = data.itemListId;
        this.setCurTurnplateItemList(this.m_turnplateGroupId);
    };
    //获取当前时间段转盘物品列表
    TurnplateModel.setCurTurnplateItemList = function (rewardListId) {
        this.m_curTurnplateItemIdList = [];
        var cfgList = C.TurnTableConfig;
        for (var key in cfgList) {
            if (cfgList.hasOwnProperty(key)) {
                var cfg = cfgList[key];
                if (cfg.team == rewardListId)
                    this.m_curTurnplateItemIdList.push(cfg.id);
            }
        }
        this.m_curTurnplateItemIdList.sort(function (a, b) {
            return a - b;
        });
    };
    //获取消耗配置
    TurnplateModel.getTurnCostType = function (type, count) {
        var cfgList = C.ConsumeConfig;
        for (var key in cfgList) {
            if (cfgList.hasOwnProperty(key)) {
                var cfg = cfgList[key];
                if (cfg.type == type && cfg.times == count)
                    return cfg;
            }
        }
        return null;
    };
    /**转盘免费次数 */
    TurnplateModel.m_turntableFreeCount = 0;
    return TurnplateModel;
}());
