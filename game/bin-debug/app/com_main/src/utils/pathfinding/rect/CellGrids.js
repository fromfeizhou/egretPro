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
/**网格 */
var CellGrids = /** @class */ (function (_super_1) {
    __extends(CellGrids, _super_1);
    function CellGrids(csvdata) {
        var _this = _super_1.call(this) || this;
        _this.setCSVData(csvdata);
        return _this;
    }
    CellGrids.prototype.clear = function () {
        this._cells = [];
        this._cells = null;
        this.csvData = [];
        this.csvData = null;
    };
    CellGrids.prototype.setCSVData = function (csvdata) {
        if (!csvdata)
            return;
        this.csvData = csvdata;
        this.initCells();
    };
    CellGrids.prototype.initCells = function () {
        this._cells = [];
        for (var y = 0; y < this.csvData.length; y++) {
            for (var x = 0; x < this.csvData[y].length; x++) {
                this._cells[y] = this._cells[y] || [];
                this._cells[y][x] = new Cell(x, y, this.csvData[y][x]);
            }
        }
    };
    CellGrids.prototype.getCSCData = function () {
        return this.csvData;
    };
    CellGrids.prototype.getCellByPixel = function (x, y) {
        var cell = MapUtil.pixelToCell(x, y);
        var snode = this.getCell(cell.getCellY(), cell.getCellX());
        return snode;
    };
    /**同一个格仔 */
    CellGrids.prototype.equalsCell = function (pos1, pos2) {
        var snode = this.getCellByPixel(pos1.x, pos1.y);
        var enode = this.getCellByPixel(pos2.x, pos2.y);
        return snode.equals(enode);
    };
    CellGrids.prototype.getCell = function (y, x) {
        if (y > this._cells.length) {
            error("超出地图范围Y:", y);
            return null;
        }
        if (!this._cells[y] || x > this._cells[y].length) {
            error("超出地图范围X", x);
            return null;
        }
        return this._cells[y][x];
    };
    CellGrids.prototype.getCells = function () {
        return this._cells;
    };
    CellGrids.prototype.getY = function () {
        return this._cells.length;
    };
    CellGrids.prototype.getX = function () {
        return this._cells[0].length;
    };
    return CellGrids;
}(egret.HashObject));
