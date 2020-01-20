var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**新7天聚宝盆活动 */
var AcCornucopiaVo = /** @class */ (function (_super_1) {
    __extends(AcCornucopiaVo, _super_1);
    function AcCornucopiaVo() {
        return _super_1.call(this) || this;
    }
    AcCornucopiaVo.prototype.initCorInfo = function (data) {
        this.parseInfo(data.treasureBowl);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR, null);
    };
    AcCornucopiaVo.prototype.parseInfo = function (info) {
        this.CorInfo = {
            totalCount: info.totalCount,
            totalCost: info.totalCost,
            curCount: info.curCount,
        };
        com_main.EventMgr.dispatchEvent(ActivityEvent.AC_7DAY_COR, null);
    };
    AcCornucopiaVo.prototype.rewardReturn = function (data) {
        this.parseInfo(data.treasureBowl);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR_REWARD, data.message);
    };
    AcCornucopiaVo.prototype.getInfo = function () {
        return this.CorInfo;
    };
    AcCornucopiaVo.prototype.getMinMax = function (index) {
        var cfg = this.getConfigsII();
        return [cfg[index].min, cfg[index].max];
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcCornucopiaVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcCornucopiaVo.prototype.requestActivityInfo = function () {
        ActivityProxy.send_C2S_ACTIVITY_TREASEURE_BOWL_INFO(this.id);
    };
    /** 获取ActivityNewGeneralReward配置表  */
    AcCornucopiaVo.prototype.getConfigs = function () {
        for (var i in this.configs) {
            return this.configs[i];
        }
    };
    AcCornucopiaVo.prototype.getConfigsII = function () {
        if (!this.m_sortList) {
            this.m_sortList = [];
            for (var i in this.configsII) {
                this.m_sortList.push(this.configsII[i]);
            }
            this.m_sortList.sort(function (a, b) {
                return a.id < b.id ? 0 : 1;
            });
        }
        return this.m_sortList;
    };
    /**=====================================================================================
     * 数据配置相关 end
     * =====================================================================================
     */
    //聚宝盆红点
    AcCornucopiaVo.prototype.newCorRed = function () {
        if (this.CorInfo) {
            if (this.CorInfo.totalCost == 0 || this.CorInfo.totalCount > 0)
                return true;
        }
        return false;
    };
    return AcCornucopiaVo;
}(ActivityVo));
