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
var VipVo = /** @class */ (function (_super_1) {
    __extends(VipVo, _super_1);
    function VipVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    /**=================================================================================================================================
     * 客户端自定义字段
     * =================================================================================================================================
     */
    VipVo.create = function (body) {
        var obj = new VipVo(body);
        return obj;
    };
    VipVo.prototype.init = function (body) {
        if (!body)
            return;
        this.parseKeys(body);
    };
    /**更新数据 */
    VipVo.prototype.update = function (body) {
        this.parseKeys(body);
        com_main.EventMgr.dispatchEvent(VipEvent.VIP_UPDATE, null);
    };
    /**解析服务器协议 */
    VipVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, VipVo.AttriKey);
    };
    VipVo.prototype.onDestroy = function () {
    };
    /**属性值 */
    VipVo.AttriKey = ["rechargeGold", "rechargeMoney", "vipExp", "vipLevel", "vipDailyReward", "receivedVipLevelReward"];
    return VipVo;
}(BaseClass));
