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
/**一元礼包 */
var AcOneGiftBagVo = /** @class */ (function (_super_1) {
    __extends(AcOneGiftBagVo, _super_1);
    function AcOneGiftBagVo() {
        return _super_1.call(this) || this;
    }
    /**解析信息 */
    AcOneGiftBagVo.prototype.initOneGiftBag = function (data) {
        this.awardRecordSet = data.awardRecordSet;
        this.paySet = data.paySet;
        if (this.checkOneEnd()) {
            this.close();
            return;
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, null);
    };
    /**领取奖励 */
    AcOneGiftBagVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        this.awardRecordSet = data.awardRecord;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, null);
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        if (this.checkOneEnd()) {
            this.close();
            return;
        }
    };
    /**获得按钮状态 */
    AcOneGiftBagVo.prototype.getBtnState = function () {
        return this.paySet.length != this.awardRecordSet.length;
    };
    /**判断奖励是否领取完毕 */
    AcOneGiftBagVo.prototype.checkOneEnd = function () {
        if (this.rechargeIds.length > 0 && this.rechargeIds.length == this.awardRecordSet.length)
            return true;
        return false;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcOneGiftBagVo.prototype.isNeedServerCfg = function () {
        return false;
    };
    /**请求活动内容(子类重写)  */
    AcOneGiftBagVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_ONE_RMB_BUY_INFO(this.id);
    };
    return AcOneGiftBagVo;
}(ActivityVo));
