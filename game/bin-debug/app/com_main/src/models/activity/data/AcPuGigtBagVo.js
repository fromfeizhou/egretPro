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
/**直购礼包 */
var AcPuGigtBagVo = /** @class */ (function (_super_1) {
    __extends(AcPuGigtBagVo, _super_1);
    function AcPuGigtBagVo() {
        return _super_1.call(this) || this;
    }
    /**解析消费豪礼数据 */
    AcPuGigtBagVo.prototype.initPuGiftBagData = function (idCount) {
        //本地初始化所有礼包
        if (!this.idCount) {
            this.idCount = {};
            for (var i = 0; i < this.rechargeIds.length; i++) {
                this.idCount[this.rechargeIds[i]] = 0;
            }
        }
        for (var i = 0; i < idCount.length; i++) {
            this.idCount[idCount[i].key] = idCount[i].value;
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_PU_GIFT, null);
    };
    /**已购买次数 */
    AcPuGigtBagVo.prototype.getbuyCount = function (shopId) {
        if (isNull(this.idCount[shopId]))
            return 0;
        return this.idCount[shopId];
    };
    /**
     * 限制次数
     */
    AcPuGigtBagVo.prototype.getbuyLimitCout = function (shopId) {
        for (var i = 0; i < this.rechargeCfgs.length; i++) {
            var cfg = this.rechargeCfgs[i];
            if (cfg.shopId == shopId)
                return cfg.count;
        }
        return 0;
    };
    /** 直购礼包item按钮红点*/
    AcPuGigtBagVo.prototype.getPurchageGiftBagBtnRed = function (shopId) {
        var state = 1; //进行中
        var buyCout = this.getbuyCount(shopId);
        var limitCount = this.getbuyLimitCout(shopId);
        if (buyCout >= limitCount)
            state = 2;
        return state;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**请求活动内容(子类重写)  */
    AcPuGigtBagVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_ZHI_GOU_INFO(this.id);
    };
    return AcPuGigtBagVo;
}(ActivityVo));
