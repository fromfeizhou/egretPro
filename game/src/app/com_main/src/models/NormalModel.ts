/**通用模块 */
class NormalModel {
    public static HANG_SCENE_TIME = 90; //挂机提示出现事件

    private static GEN_WIN_MAX: number = 20;
    private static generalWinList: { [key: number]: gameProto.IGeneralWinInfo[] };	//武将显示数据列表
    private static generalWinIds: number[];          //武将显示数据id列表
    public static free: number = 0; //酒馆免费次数

    public static funCountDic: { [key: number]: gameProto.IFunCount };    //服务器控制功能次数
    public static funcCostDic: { [key: number]: number[] };  //消耗价格

    public static init() {
        this.generalWinList = {};
        this.generalWinIds = [];
        this.funCountDic = {};
        this.funcCostDic = {};
    }

    public static clear() {
        this.generalWinList = null;
    }

    /**塞入数据 */
    public static addGeneralWinInfo(data: gameProto.IS2C_SYS_GENERAL_WIN_INFO) {
        /**数据存在 覆盖 */
        if (this.generalWinList[data.npcId]) {
            this.generalWinList[data.npcId] = data.generalWinInfo;
            return;
        }

        this.generalWinIds.push(data.npcId);
        if (this.generalWinIds.length > NormalModel.GEN_WIN_MAX) {
            let tmpId = this.generalWinIds.shift();
            delete this.generalWinList[tmpId];
        }
        this.generalWinList[data.npcId] = data.generalWinInfo;
    }

    /**获取数据 */
    public static getGeneralWinInfo(npcId: number) {
        return this.generalWinList[npcId];
    }
    /** 快速商店商品配置*/
    public static setQuickBuyCfg(goodId: number) {
        let date: IItemInfo[];
        let m_itemConfig = PropModel.getCfg(goodId);
        if (m_itemConfig) {
            date = JSON.parse(m_itemConfig.sourcePrice);
        }
        return date;

    }
    /**酒馆图标红点 */
    public static getTavernIconRed() {
        let num = RoleData.recruit;
        if (num > 0 || NormalModel.free > 0) {
            return true;
        }
        return false;
    }
    /**酒馆红点判断 */
    public static getTavernRedNum(type: number) {
        //不传递类型 单次
        if (!type || type == 0) {
            return this.getTavernIconRed();
        }
        let isComplete = false;
        let num = RoleData.recruit;

        if (num >= 9) { //招募十次
            isComplete = true;
        }
        return isComplete;
    }

    /**=====================================================================================
    * 服务器控制 功能对应次数 begin
    * =====================================================================================
    */
    /**数据更新 */
    public static parseFunCount(list: gameProto.IFunCount[]) {
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            data.reCount = data.maxCount - data.useCount;
            data.reBuyAmountCount = data.maxBuyAmountCount - data.buyAmountCount;
            this.funCountDic[data.id] = data;
            let cfg = C.ModuleUseCountConfig[data.id];
            this.funcCostDic[data.id] = cfg ? StringUtils.stringToNumberArray(cfg.goldConsume) : [];
            com_main.EventMgr.dispatchEvent(NormalEvent.NORMAL_FUN_COUNT, data.id);
        }
    }

    /**获得指定id 数据 */
    public static getFunCountById(id: IFunCountEnum): gameProto.IFunCount {
        return this.funCountDic[id] ? this.funCountDic[id] : { id: id, useCount: 0, maxCount: 0, buyAmountCount: 0, maxBuyAmountCount: 0, reBuyAmountCount: 0, reCount: 0 };
    }

    /**获得购买价格 */
    public static getFunCostByData(data: gameProto.IFunCount) {
        let needGoldArr: number[] = this.funcCostDic[data.id];
        if (needGoldArr.length == 0) return 0;
        let index = Math.min(data.buyAmountCount, needGoldArr.length - 1);
        return needGoldArr[index];
    }

    /**获得配置最大次数 */
    public static getFuncCfgCount(data:gameProto.IFunCount){
        let cfg = C.ModuleUseCountConfig[data.id];
        if(cfg) return cfg.useCount;
        return 0;
    }

    /**=====================================================================================
    * 服务器控制 功能对应次数 end
    * =====================================================================================
    */
}