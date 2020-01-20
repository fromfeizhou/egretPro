/**
 * 地图加载器
 * @author leowang
 */
// @Component
var MapLoader = /** @class */ (function () {
    function MapLoader() {
    }
    MapLoader.prototype.getName = function () {
        return "地图加载器";
    };
    /**加载所有地图 */
    MapLoader.initializtion = function () {
        for (var mapid in C.TerrainConfig) {
            this.loader(parseInt(mapid));
        }
    };
    /**
     * 从地图文件读取和转换地图数据
     * @param file 地图文件
     */
    MapLoader.loader = function (mapid) {
        var setting = this.getMapSetting(mapid);
        if (setting)
            return setting;
        // let filename = MapUtil.getMapFileName(mapid);
        // let json: Object = RES.getRes(filename);
        // debug("MapLoader:loader----------->>加载地图数据 mapid:", mapid, filename, json);
        setting = MapSetting.create(mapid);
        // setting.setMapName(filename)
        setting.setMapId(mapid);
        this.maps.add(mapid, setting);
        return setting;
    };
    /**
     * 转换地图数据到格子
     * @param data 地图数组
     * @param height 高（y轴）
     * @param width 宽（x轴）
     * @return
     */
    MapLoader.data2Cell = function (data, height, width) {
        if (data == null) {
            return null;
        }
        var cellArr = [];
        var length = 0;
        if (data != null && (length = data.length) > 0) {
            for (var i = 0; i < length; i++) {
                var x = Math.floor(i % (width));
                var y = Math.floor(i / (width));
                cellArr[y] = cellArr[y] || [];
                cellArr[y][x] = data[i];
            }
        }
        return cellArr;
    };
    // @Override
    // public int getOrder() {		
    // 	return InitOrder.MAP_LOADER;
    // }
    /**
     * 获得地图设置对象
     * @param name
     * @return
     */
    MapLoader.getMapSetting = function (mapid) {
        var setting = this.maps.get(mapid);
        if (!setting) {
            debug("MapLoader:getMapSetting----------->>找不到地图数据:mapid", mapid);
        }
        return setting;
    };
    /**
     * 初始化格子坐标与像素坐标缓存
     * @param mapSetting
     */
    MapLoader.initPixel = function (setting) {
        var mapid = setting.getMapId();
        var width = setting.getWidth();
        var height = setting.getHeight();
        var tileWidth = setting.getTilewidth();
        var tileHeight = setting.getTileheight();
        var halfTileWidth = setting.getHalfTileWidth();
        var halfTileHeight = setting.getHalfTileHeight();
        var cellToPixelsTemp = [];
        var pixelToCellsTemp = [];
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var y = Math.floor((i + 1) * halfTileHeight);
                var x = Math.floor(halfTileWidth + j * tileWidth + halfTileWidth * (i & 1));
                cellToPixelsTemp[Utils.buildCellkey(j, i)] = [x, y];
                pixelToCellsTemp[Utils.buildCellkey(x, y)] = [j, i];
            }
        }
        this.cellToPexelConverter[mapid] = cellToPixelsTemp;
        this.pixelToCellConverter[mapid] = pixelToCellsTemp;
    };
    /**
     * 根据地图名及其格子坐标获取格子中点像素坐标
     * @param mapName
     * @param x
     * @param y
     * @return
     */
    MapLoader.cellToPixel = function (x, y, mapid) {
        mapid = mapid || BattleModel.getMapId();
        if (!this.cellToPexelConverter[mapid]) {
            return null;
        }
        return this.cellToPexelConverter[mapid][Utils.buildCellkey(x, y)];
    };
    /**
     * 根据像素坐标确定格子坐标（参数必须为格子中点）
     * @param mapName
     * @param x
     * @param y
     * @return
     */
    MapLoader.pixelToCell = function (x, y, mapid) {
        mapid = mapid || BattleModel.getMapId();
        if (!this.pixelToCellConverter[mapid]) {
            return null;
        }
        if (x % MapConfig.halfTileWidth != 0 || y % MapConfig.halfTileHeight != 0) {
            return null;
        }
        return this.pixelToCellConverter[mapid][Utils.buildCellkey(x, y)];
    };
    /**
     * Map<mapid, MapSetting>
     * 地图缓存
     */
    MapLoader.maps = Dictionary.create();
    /**
     * 格子中心坐标转像素坐标映射 Map<String, Map<String, int[]>>
     */
    MapLoader.cellToPexelConverter = [];
    /**
     * 像素转格子坐标映射（只接受格子中心的像素） Map< String, Map<String, int[]>>
     */
    MapLoader.pixelToCellConverter = [];
    return MapLoader;
}());
