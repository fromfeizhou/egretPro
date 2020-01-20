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
var PropVo = /** @class */ (function (_super_1) {
    __extends(PropVo, _super_1);
    function PropVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        _this.isNew = false;
        return _this;
    }
    PropVo.create = function (body) {
        var obj = ObjectPool.pop(PropVo, 'PropVo', body);
        return obj;
    };
    PropVo.prototype.onDestroy = function () {
        ObjectPool.push(this);
    };
    PropVo.prototype.init = function (body) {
        Utils.voParsePbData(this, body, PropVo.AttriKey, ['uuid']);
        this.config = C.ItemConfig[this.itemId];
        this.type = this.config.mainType;
        this.subType = this.config.subType;
        this.quality = this.config.quality;
    };
    /**更新数据 */
    PropVo.prototype.update = function (body) {
        Utils.voParsePbData(this, body, PropVo.AttriKey, ['uuid']);
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_ITEM_UPDATE, this.uuid);
    };
    /**是否碎片 */
    PropVo.prototype.isSoul = function () {
        return this.type == PropMainType.SOUL || this.type == PropMainType.SKILL_SOUL;
    };
    /**属性值 */
    PropVo.AttriKey = ['uuid', 'itemId', 'count', 'level', 'position'];
    return PropVo;
}(BaseClass));
