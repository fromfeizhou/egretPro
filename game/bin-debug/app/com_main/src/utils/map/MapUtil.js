/**
 * Created by leowang on 2016/12/20
 */
var MapUtil = /** @class */ (function () {
    function MapUtil() {
    }
    /**初始化地图数据 */
    MapUtil.initMapData = function (mapid) {
        var setting = MapLoader.loader(mapid);
        ISOMap.getInstance().init(setting);
        // StaggeredMap.getIns().init(setting);
        MapConfig.k1 = setting.getK1();
        MapConfig.k2 = setting.getK2();
        MapConfig.numRows = setting.getWidth();
        MapConfig.numCols = setting.getHeight();
        MapConfig.tileWidth = setting.getTilewidth();
        MapConfig.tileHeight = setting.getTileheight();
        MapConfig.halfTileWidth = setting.getHalfTileWidth();
        MapConfig.halfTileHeight = setting.getHalfTileHeight();
        MapConfig.pathOffset = setting.getPathOffset();
        MapConfig.skillOffset = setting.getSkillOffset();
        // MapConfig.numBarriers = MapUtil.getObstacleCount(mapid);
    };
    // /**地图JSON名字 */
    // public static getMapFileName(mapid?: number) {
    // 	let data = MapData.getBattleMapConfig(mapid);
    // 	let filename = data ? data.tileMap : ""
    // 	filename = StringUtils.replaceSuffix(filename);
    // 	return filename;
    // }
    // /**地图背景图片名字 */
    // public static getMapImagePath(mapid: number) {
    // 	let setting = MapLoader.getMapSetting(mapid);
    // 	let layer = setting.getImageLayer(LayerName.MAPBG)
    // 	let path: string = layer.getImage();
    // 	path = path.slice(path.lastIndexOf("/") + 1, path.length);
    // 	path = StringUtils.replaceSuffix(path);
    // 	return path;
    // }
    // public static getElementSource(json: any) {
    // 	let path: string = json.properties.Source;
    // 	path = path.slice(path.lastIndexOf("/") + 1, path.length);
    // 	path = StringUtils.replaceSuffix(path);
    // 	return path;
    // }
    // /**获取不是空的格仔数 */
    // public static getObstacleCount(mapid: number): number {
    // 	let setting = MapLoader.getMapSetting(mapid);
    // 	let layer = setting.getTitleLayer(LayerName.TERRAIN);
    // 	let count: number = 0;
    // 	if (!layer) {
    // 		return count;
    // 	}
    // 	let datas: number[] = layer.getData();
    // 	for (let i = 0; i < datas.length; i++) {
    // 		if (datas[i] > TerrainType.COMMON) {
    // 			count++;
    // 		}
    // 	}
    // 	return count;
    // }
    /**格仔转像素 */
    MapUtil.cellToPixel = function (cell) {
        var pos = ISOMap.getInstance().cellToPixel(cell.getCellX(), cell.getCellY());
        if (!pos)
            return null;
        return new egret.Point(pos[0], pos[1]);
    };
    /**像素转格仔 */
    MapUtil.pixelToCell = function (x, y) {
        var pos = ISOMap.getInstance().pixelToCell(x, y);
        if (!pos)
            return null;
        return new Cell(pos[0], pos[1]);
    };
    return MapUtil;
}());
