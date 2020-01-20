/**每日惊喜商城 */
var DailySurpriseModel = /** @class */ (function () {
    function DailySurpriseModel() {
    }
    DailySurpriseModel.init = function () {
        this.shopDataDic = {};
        this.addEvent();
    };
    /**数据清理 */
    DailySurpriseModel.clear = function () {
        this.shopDataDic = null;
        this.removeEvent();
    };
    /**每日商城数据解析 */
    DailySurpriseModel.parseDailySurprise = function (data) {
        var shopdata = data.shopdata;
        if (isNull(shopdata) || shopdata.length == 0) {
            //EffectUtils.showTips("每日惊喜商城商品正在准备中...");
            return;
        }
        //收到数据 功能开放
        FunctionModel.addNewFuncClient(FunctionType.DAILY_SURPRISE);
        if (data.update)
            this.init();
        for (var i = 0; i < shopdata.length; i++) {
            this.addShopData(shopdata[i]);
        }
    };
    /**==================================================================================================================================
     * 每日惊喜商城 begin
     * ==================================================================================================================================
     */
    /**添加商品数据 */
    DailySurpriseModel.addShopData = function (data) {
        var id = data.rechargeConfigs.id;
        this.shopDataDic[id] = data;
    };
    /**获取商品数据 */
    DailySurpriseModel.getShopData = function (id) {
        return this.shopDataDic[id];
    };
    /**==================================================================================================================================
     * 每日惊喜商城 end
     * ==================================================================================================================================
     */
    /**==================================================================================================================================
    * 事件监听 start
    * ==================================================================================================================================
    */
    DailySurpriseModel.addEvent = function () {
        com_main.EventMgr.addEvent(NormalEvent.NORMAL_CROSS_DAY, this.onCrossDay, this);
    };
    DailySurpriseModel.removeEvent = function () {
        com_main.EventMgr.removeStaticEvent(NormalEvent.NORMAL_CROSS_DAY, this.onCrossDay);
    };
    /**跨天 */
    DailySurpriseModel.onCrossDay = function () {
        DailySurpriseProxy.C2S_SURPRISE_MARKET();
    };
    return DailySurpriseModel;
}());
