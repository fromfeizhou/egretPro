/**通用模块 */
var NormalModel = /** @class */ (function () {
    function NormalModel() {
    }
    NormalModel.init = function () {
        this.generalWinList = {};
        this.generalWinIds = [];
        this.funCountDic = {};
        this.funcCostDic = {};
    };
    NormalModel.clear = function () {
        this.generalWinList = null;
    };
    /**塞入数据 */
    NormalModel.addGeneralWinInfo = function (data) {
        /**数据存在 覆盖 */
        if (this.generalWinList[data.npcId]) {
            this.generalWinList[data.npcId] = data.generalWinInfo;
            return;
        }
        this.generalWinIds.push(data.npcId);
        if (this.generalWinIds.length > NormalModel.GEN_WIN_MAX) {
            var tmpId = this.generalWinIds.shift();
            delete this.generalWinList[tmpId];
        }
        this.generalWinList[data.npcId] = data.generalWinInfo;
    };
    /**获取数据 */
    NormalModel.getGeneralWinInfo = function (npcId) {
        return this.generalWinList[npcId];
    };
    /** 快速商店商品配置*/
    NormalModel.setQuickBuyCfg = function (goodId) {
        var date;
        var m_itemConfig = PropModel.getCfg(goodId);
        if (m_itemConfig) {
            date = JSON.parse(m_itemConfig.sourcePrice);
        }
        return date;
    };
    /**酒馆图标红点 */
    NormalModel.getTavernIconRed = function () {
        var num = RoleData.recruit;
        if (num > 0 || NormalModel.free > 0) {
            return true;
        }
        return false;
    };
    /**酒馆红点判断 */
    NormalModel.getTavernRedNum = function (type) {
        //不传递类型 单次
        if (!type || type == 0) {
            return this.getTavernIconRed();
        }
        var isComplete = false;
        var num = RoleData.recruit;
        if (num >= 9) { //招募十次
            isComplete = true;
        }
        return isComplete;
    };
    /**=====================================================================================
    * 服务器控制 功能对应次数 begin
    * =====================================================================================
    */
    /**数据更新 */
    NormalModel.parseFunCount = function (list) {
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            data.reCount = data.maxCount - data.useCount;
            data.reBuyAmountCount = data.maxBuyAmountCount - data.buyAmountCount;
            this.funCountDic[data.id] = data;
            var cfg = C.ModuleUseCountConfig[data.id];
            this.funcCostDic[data.id] = cfg ? StringUtils.stringToNumberArray(cfg.goldConsume) : [];
            com_main.EventMgr.dispatchEvent(NormalEvent.NORMAL_FUN_COUNT, data.id);
        }
    };
    /**获得指定id 数据 */
    NormalModel.getFunCountById = function (id) {
        return this.funCountDic[id] ? this.funCountDic[id] : { id: id, useCount: 0, maxCount: 0, buyAmountCount: 0, maxBuyAmountCount: 0, reBuyAmountCount: 0, reCount: 0 };
    };
    /**获得购买价格 */
    NormalModel.getFunCostByData = function (data) {
        var needGoldArr = this.funcCostDic[data.id];
        if (needGoldArr.length == 0)
            return 0;
        var index = Math.min(data.buyAmountCount, needGoldArr.length - 1);
        return needGoldArr[index];
    };
    /**获得配置最大次数 */
    NormalModel.getFuncCfgCount = function (data) {
        var cfg = C.ModuleUseCountConfig[data.id];
        if (cfg)
            return cfg.useCount;
        return 0;
    };
    NormalModel.HANG_SCENE_TIME = 90; //挂机提示出现事件
    NormalModel.GEN_WIN_MAX = 20;
    NormalModel.free = 0; //酒馆免费次数
    return NormalModel;
}());
