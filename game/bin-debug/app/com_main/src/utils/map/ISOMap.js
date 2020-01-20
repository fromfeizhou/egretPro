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
/**
 * 斜菱形格子地图
 */
var ISOMap = /** @class */ (function (_super_1) {
    __extends(ISOMap, _super_1);
    /**
     * 构造斜菱形地图
     *
     * @param mapSetting
     *            地图配置
     */
    function ISOMap() {
        return _super_1.call(this) || this;
    }
    ISOMap.getInstance = function () {
        ISOMap._instance = ISOMap._instance || new ISOMap();
        return ISOMap._instance;
    };
    ISOMap.prototype.init = function (mapSetting) {
        this.mapSetting = mapSetting;
        this.MAP_NAME = mapSetting.getMapName();
        this.TILE_WIDTH = mapSetting.getTilewidth();
        this.TILE_HEIGHT = mapSetting.getTileheight();
        this.HALF_TILE_HEIGHT = mapSetting.getHalfTileHeight();
        this.HALF_TILE_WIDTH = mapSetting.getHalfTileWidth();
        this.CELL_MAP_WIDTH = mapSetting.getWidth();
        this.CELL_MAP_HEIGHT = mapSetting.getHeight();
        this.PIXEL_OFFSET_X = this.CELL_MAP_HEIGHT * this.HALF_TILE_WIDTH;
        this.PIXEL_OFFSET_Y = 0;
        this.TILE_PIXEL_W = Math.floor(this.TILE_WIDTH / Math.min(this.TILE_WIDTH, this.TILE_HEIGHT));
        this.TILE_PIXEL_H = Math.floor(this.TILE_HEIGHT / Math.min(this.TILE_WIDTH, this.TILE_HEIGHT));
        this.HALF_TILE_PIXEL_W = this.TILE_PIXEL_W / 2;
        this.HALF_TILE_PIXEL_H = this.TILE_PIXEL_H / 2;
        this.OFFSET_X = mapSetting.getElemOffsetX();
        this.OFFSET_Y = mapSetting.getElemOffsetY();
    };
    // @Override
    ISOMap.prototype.isValidPixel = function (pixelX, pixelY) {
        var point = this.pixelToCell(pixelX, pixelY);
        return this.isValidCell(point[0], point[1]);
    };
    // @Override
    ISOMap.prototype.isValidCell = function (cellX, cellY) {
        if (cellX < 0 || cellX >= this.CELL_MAP_WIDTH) {
            return false;
        }
        if (cellY < 0 || cellY >= this.CELL_MAP_HEIGHT) {
            return false;
        }
        return true;
    };
    /**菱形格仔转矩形像素 */
    // @Override
    ISOMap.prototype.cellToPixel = function (cellX, cellY) {
        var point = [];
        point[0] = Math.floor(this.HALF_TILE_WIDTH * (cellX - cellY)) + this.PIXEL_OFFSET_X;
        point[1] = Math.floor(this.HALF_TILE_HEIGHT * (cellX + cellY)) + this.HALF_TILE_HEIGHT + this.PIXEL_OFFSET_Y;
        return point;
    };
    /**矩形像素转菱形格仔 */
    // @Override
    ISOMap.prototype.pixelToCell = function (pixelX, pixelY) {
        var point = [];
        var x = pixelX - this.PIXEL_OFFSET_X;
        var y = pixelY - this.PIXEL_OFFSET_Y;
        point[0] = Math.floor(x / this.TILE_WIDTH + y / this.TILE_HEIGHT);
        point[1] = Math.floor(-x / this.TILE_WIDTH + y / this.TILE_HEIGHT);
        return point;
    };
    /**
     * 格子坐标系下的像素转像素坐标
     *
     * @param tilePixelX
     *            格子坐标系像素x
     * @param tilePixelY
     *            格子坐标系像素y
     * @return 像素坐标
     *
     * 菱形像素转矩形的像素
     */
    ISOMap.prototype.tilePixelToPixel = function (tilePixelX, tilePixelY) {
        var point = [];
        point[0] = Math.floor(this.HALF_TILE_PIXEL_W * (tilePixelX - tilePixelY)) + this.PIXEL_OFFSET_X + this.OFFSET_X;
        point[1] = Math.floor(this.HALF_TILE_PIXEL_H * (tilePixelX + tilePixelY)) + this.PIXEL_OFFSET_Y + this.OFFSET_Y;
        return point;
    };
    /**
     * 左下角格子坐标系 转地图像素
     */
    ISOMap.prototype.leftDownCellToPixel = function (leftDownx, leftDownY) {
        var cellY = this.CELL_MAP_HEIGHT - leftDownx - 1;
        var cellX = this.CELL_MAP_WIDTH - leftDownY - 1;
        var point = [];
        point[0] = Math.floor(this.HALF_TILE_WIDTH * (cellX - cellY)) + this.PIXEL_OFFSET_X + this.OFFSET_X;
        point[1] = Math.floor(this.HALF_TILE_HEIGHT * (cellX + cellY)) + this.PIXEL_OFFSET_Y + this.OFFSET_Y;
        return point;
    };
    /**
     * 像素坐标转格子坐标系下的像素坐标
     *
     * @param pixelX
     *            像素坐标x
     * @param pixelY
     *            像素坐标y
     * @return 格子坐标系下的像素坐标
     *
     * 矩形像素转菱形像素
     */
    ISOMap.prototype.pixelToTilePixel = function (pixelX, pixelY) {
        pixelX = pixelX + 1151;
        pixelY = pixelY + 424;
        var point = [];
        var x = pixelX - this.PIXEL_OFFSET_X;
        var y = pixelY - this.PIXEL_OFFSET_Y;
        point[0] = Math.floor(x / this.TILE_PIXEL_W + y / this.TILE_PIXEL_H);
        point[1] = Math.floor(-x / this.TILE_PIXEL_W + y / this.TILE_PIXEL_H);
        return point;
    };
    /**
     * 格子坐标系下的像素坐标转格子坐标
     *
     * @param tilePixelX
     *            格子坐标系下的像素坐标x
     * @param tilePixelY
     *            格子坐标系下的像素坐标y
     * @return 格子坐标
     *
     * 菱形的像素转菱形的格仔
     */
    ISOMap.prototype.tilePixelToTile = function (tilePixelX, tilePixelY) {
        var point = [];
        point[0] = Math.floor(tilePixelX / this.HALF_TILE_WIDTH);
        point[1] = Math.floor(tilePixelY / this.HALF_TILE_WIDTH);
        return point;
    };
    /**
     * 格子坐标转格子坐标系下的像素坐标
     *
     * @param tileX
     *            格子坐标x
     * @param tileY
     *            格子坐标y
     * @return 格子坐标
     *
     * 菱形的格仔转菱形的像素
     */
    ISOMap.prototype.tileToTilePixel = function (tileX, tileY) {
        var point = [];
        var halfCell = this.HALF_TILE_WIDTH / 2;
        point[0] = tileX * this.HALF_TILE_WIDTH + halfCell;
        point[1] = tileY * this.HALF_TILE_WIDTH + halfCell;
        return point;
    };
    ISOMap.prototype.getMAP_NAME = function () {
        return this.MAP_NAME;
    };
    ISOMap.prototype.setMAP_NAME = function (mAP_NAME) {
        this.MAP_NAME = mAP_NAME;
    };
    ISOMap.prototype.getTILE_WIDTH = function () {
        return this.TILE_WIDTH;
    };
    ISOMap.prototype.setTILE_WIDTH = function (tILE_WIDTH) {
        this.TILE_WIDTH = tILE_WIDTH;
    };
    ISOMap.prototype.getTILE_HEIGHT = function () {
        return this.TILE_HEIGHT;
    };
    ISOMap.prototype.setTILE_HEIGHT = function (tILE_HEIGHT) {
        this.TILE_HEIGHT = tILE_HEIGHT;
    };
    ISOMap.prototype.getHALF_TILE_HEIGHT = function () {
        return this.HALF_TILE_HEIGHT;
    };
    ISOMap.prototype.setHALF_TILE_HEIGHT = function (hALF_TILE_HEIGHT) {
        this.HALF_TILE_HEIGHT = hALF_TILE_HEIGHT;
    };
    ISOMap.prototype.getHALF_TILE_WIDTH = function () {
        return this.HALF_TILE_WIDTH;
    };
    ISOMap.prototype.setHALF_TILE_WIDTH = function (hALF_TILE_WIDTH) {
        this.HALF_TILE_WIDTH = hALF_TILE_WIDTH;
    };
    ISOMap.prototype.getCELL_MAP_WIDTH = function () {
        return this.CELL_MAP_WIDTH;
    };
    ISOMap.prototype.setCELL_MAP_WIDTH = function (cELL_MAP_WIDTH) {
        this.CELL_MAP_WIDTH = cELL_MAP_WIDTH;
    };
    ISOMap.prototype.getCELL_MAP_HEIGHT = function () {
        return this.CELL_MAP_HEIGHT;
    };
    ISOMap.prototype.setCELL_MAP_HEIGHT = function (cELL_MAP_HEIGHT) {
        this.CELL_MAP_HEIGHT = cELL_MAP_HEIGHT;
    };
    ISOMap.prototype.getPIXEL_OFFSET_X = function () {
        return this.PIXEL_OFFSET_X;
    };
    ISOMap.prototype.setPIXEL_OFFSET_X = function (pIXEL_OFFSET_X) {
        this.PIXEL_OFFSET_X = pIXEL_OFFSET_X;
    };
    ISOMap.prototype.getPIXEL_OFFSET_Y = function () {
        return this.PIXEL_OFFSET_Y;
    };
    ISOMap.prototype.setPIXEL_OFFSET_Y = function (pIXEL_OFFSET_Y) {
        this.PIXEL_OFFSET_Y = pIXEL_OFFSET_Y;
    };
    ISOMap.prototype.getTILE_PIXEL_W = function () {
        return this.TILE_PIXEL_W;
    };
    ISOMap.prototype.setTILE_PIXEL_W = function (tILE_PIXEL_W) {
        this.TILE_PIXEL_W = tILE_PIXEL_W;
    };
    ISOMap.prototype.getTILE_PIXEL_H = function () {
        return this.TILE_PIXEL_H;
    };
    ISOMap.prototype.setTILE_PIXEL_H = function (tILE_PIXEL_H) {
        this.TILE_PIXEL_H = tILE_PIXEL_H;
    };
    ISOMap.prototype.getHALF_TILE_PIXEL_W = function () {
        return this.HALF_TILE_PIXEL_W;
    };
    ISOMap.prototype.setHALF_TILE_PIXEL_W = function (hALF_TILE_PIXEL_W) {
        this.HALF_TILE_PIXEL_W = hALF_TILE_PIXEL_W;
    };
    ISOMap.prototype.getHALF_TILE_PIXEL_H = function () {
        return this.HALF_TILE_PIXEL_H;
    };
    ISOMap.prototype.setHALF_TILE_PIXEL_H = function (hALF_TILE_PIXEL_H) {
        this.HALF_TILE_PIXEL_H = hALF_TILE_PIXEL_H;
    };
    ISOMap.prototype.getMapSetting = function () {
        return this.mapSetting;
    };
    return ISOMap;
}(BaseClass));
