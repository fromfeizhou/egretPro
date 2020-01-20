/**
 * Created by leowang on 2016/12/20
 */
/**一个方向的角度 */
var AngleDirection = 360 / 8;
var MapConfig = /** @class */ (function () {
    function MapConfig() {
    }
    /**列 */
    MapConfig.numRows = 0;
    /**行 */
    MapConfig.numCols = 0;
    /**格仔大小 */
    MapConfig.tileWidth = 50;
    MapConfig.tileHeight = 25;
    MapConfig.halfTileWidth = MapConfig.tileWidth / 2;
    MapConfig.halfTileHeight = MapConfig.tileHeight / 2;
    return MapConfig;
}());
