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
var Unit = /** @class */ (function (_super_1) {
    __extends(Unit, _super_1);
    function Unit() {
        return _super_1.call(this) || this;
    }
    Unit.create = function (id) {
        var obj = new Unit();
        obj.setId(id);
        return obj;
    };
    /**
     * isAlive
     */
    Unit.prototype.isAlive = function () {
        return false;
    };
    Unit.prototype.setId = function (v) {
        this.id = v;
    };
    Unit.prototype.getId = function () {
        return this.id;
    };
    /**
     * 获取状态
     * @return
     */
    Unit.prototype.getAction = function () {
        return UnitAction.STAND;
    };
    return Unit;
}(egret.HashObject));
