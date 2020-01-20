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
/** 地图格仔单元 */
var Cell = /** @class */ (function (_super_1) {
    __extends(Cell, _super_1);
    function Cell(cellX, cellY, type) {
        if (type === void 0) { type = TerrainType.COMMON; }
        var _this = _super_1.call(this) || this;
        _this.cellX = cellX;
        _this.cellY = cellY;
        _this.terrainType = type;
        return _this;
    }
    Cell.prototype.isEmpty = function (unit) {
        if (this.owner != null && !this.owner.isAlive()) {
            this.owner = null;
        }
        return this.owner == null || this.owner == unit;
    };
    Cell.prototype.getOwner = function () {
        return this.owner;
    };
    Cell.prototype.setOwner = function (owner) {
        this.owner = owner;
    };
    Cell.prototype.getCellX = function () {
        return this.cellX;
    };
    Cell.prototype.getCellY = function () {
        return this.cellY;
    };
    Cell.prototype.setCellY = function (y) {
        this.cellY = y;
    };
    Cell.prototype.getTerrainType = function () {
        return this.terrainType;
    };
    /**
     * 判断是否可移动
     *
     * @param unit
     * @return
     */
    Cell.prototype.checkMove = function (unit) {
        if (this.terrainType == TerrainType.UNMOVEABLE /*|| (units != null && units.size() > 0 && !units.contains(unit))*/) {
            return false;
        }
        return true;
    };
    Cell.prototype.getCellPoint = function () {
        return new egret.Point(this.cellX, this.cellY);
    };
    Cell.prototype.cellToPixel = function () {
        return MapUtil.cellToPixel(this);
    };
    Cell.prototype.equals = function (cell) {
        if (this.getCellX() == cell.getCellX() && this.getCellY() == cell.getCellY()) {
            return true;
        }
        return false;
    };
    return Cell;
}(egret.HashObject));
