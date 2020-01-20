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
var SimpleCell = /** @class */ (function (_super_1) {
    __extends(SimpleCell, _super_1);
    function SimpleCell(x, y, parentNode) {
        var _this = _super_1.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.parentNode = parentNode;
        return _this;
    }
    SimpleCell.prototype.compareTo = function (candidate) {
        return this.getF() - candidate.getF();
    };
    SimpleCell.prototype.getX = function () {
        return this.x;
    };
    SimpleCell.prototype.setX = function (x) {
        this.x = x;
    };
    SimpleCell.prototype.getY = function () {
        return this.y;
    };
    SimpleCell.prototype.setY = function (y) {
        this.y = y;
    };
    SimpleCell.prototype.getParentNode = function () {
        return this.parentNode;
    };
    SimpleCell.prototype.setParentNode = function (parentNode) {
        this.parentNode = parentNode;
    };
    SimpleCell.prototype.getG = function () {
        return this.g;
    };
    SimpleCell.prototype.setG = function (g) {
        this.g = g;
    };
    SimpleCell.prototype.getH = function () {
        return this.h;
    };
    SimpleCell.prototype.setH = function (h) {
        this.h = h;
    };
    SimpleCell.prototype.getF = function () {
        return this.f;
    };
    SimpleCell.prototype.setF = function (f) {
        this.f = f;
    };
    SimpleCell.prototype.toString = function () {
        return "(" + this.x + "," + this.y + "," + this.f + ")";
    };
    /**
     * 将战场格子转换成寻路格子
     * @param cell
     * @return
     */
    SimpleCell.changeTo = function (cell) {
        return new SimpleCell(cell.getCellX(), cell.getCellY(), null);
    };
    return SimpleCell;
}(egret.HashObject));
