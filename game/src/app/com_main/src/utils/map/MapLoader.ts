
/**
 * 地图加载器
 * @author leowang
 */
// @Component
class MapLoader {
	/**
	 * Map<mapid, MapSetting>
	 * 地图缓存
	 */
	public static maps: Dictionary = Dictionary.create();
	/**
	 * 格子中心坐标转像素坐标映射 Map<String, Map<String, int[]>>
	 */
	public static cellToPexelConverter: number[][] = [];
	/**
	 * 像素转格子坐标映射（只接受格子中心的像素） Map< String, Map<String, int[]>>
	 */
	public static pixelToCellConverter: number[][] = [];


	public getName() {
		return "地图加载器";
	}

	/**加载所有地图 */
	public static initializtion() {
        for (let mapid in C.TerrainConfig) {
			this.loader(parseInt(mapid))
        }
	}

	/**
	 * 从地图文件读取和转换地图数据
	 * @param file 地图文件
	 */
	public static loader(mapid: number) {
		let setting: MapSetting = this.getMapSetting(mapid);
		if (setting) return setting;

		// let filename = MapUtil.getMapFileName(mapid);
		// let json: Object = RES.getRes(filename);
		// debug("MapLoader:loader----------->>加载地图数据 mapid:", mapid, filename, json);

		setting = MapSetting.create(mapid);
		// setting.setMapName(filename)
		setting.setMapId(mapid);
		this.maps.add(mapid, setting);
		return setting;
	}

	/**
	 * 转换地图数据到格子
	 * @param data 地图数组
	 * @param height 高（y轴）
	 * @param width 宽（x轴）
	 * @return
	 */
	public static data2Cell(data: number[], height: number, width: number): number[][] {
		if (data == null) {
			return null;
		}
		let cellArr: number[][] = [];

		let length: number = 0;
		if (data != null && (length = data.length) > 0) {
			for (let i: number = 0; i < length; i++) {
				let x: number = Math.floor(i % (width));
				let y: number = Math.floor(i / (width));
				cellArr[y] = cellArr[y] || [];
				cellArr[y][x] = data[i];
			}
		}
		return cellArr;
	}

	// @Override
	// public int getOrder() {		
	// 	return InitOrder.MAP_LOADER;
	// }

	/**
	 * 获得地图设置对象
	 * @param name
	 * @return
	 */
	public static getMapSetting(mapid: number): MapSetting {
		let setting = this.maps.get(mapid);
		if (!setting) {
			debug("MapLoader:getMapSetting----------->>找不到地图数据:mapid", mapid);
		}
		return setting;
	}

	/**
	 * 初始化格子坐标与像素坐标缓存
	 * @param mapSetting
	 */
	public static initPixel(setting: MapSetting) {
		let mapid = setting.getMapId();
		let width = setting.getWidth();
		let height = setting.getHeight();
		let tileWidth = setting.getTilewidth();
		let tileHeight = setting.getTileheight();
		let halfTileWidth = setting.getHalfTileWidth();
		let halfTileHeight = setting.getHalfTileHeight();

		let cellToPixelsTemp: number[] = [];
		let pixelToCellsTemp: number[] = [];
		for (let i: number = 0; i < height; i++) {
			for (let j: number = 0; j < width; j++) {
				let y: number = Math.floor((i + 1) * halfTileHeight);
				let x: number = Math.floor(halfTileWidth + j * tileWidth + halfTileWidth * (i & 1));
				cellToPixelsTemp[Utils.buildCellkey(j, i)] = [x, y];
				pixelToCellsTemp[Utils.buildCellkey(x, y)] = [j, i];
			}
		}
		this.cellToPexelConverter[mapid] = cellToPixelsTemp;
		this.pixelToCellConverter[mapid] = pixelToCellsTemp;
	}

	/**
	 * 根据地图名及其格子坐标获取格子中点像素坐标
	 * @param mapName
	 * @param x
	 * @param y
	 * @return
	 */
	public static cellToPixel(x: number, y: number, mapid?: number): number[] {
		mapid = mapid || BattleModel.getMapId();
		if (!this.cellToPexelConverter[mapid]) {
			return null;
		}
		return this.cellToPexelConverter[mapid][Utils.buildCellkey(x, y)];
	}

	/**
	 * 根据像素坐标确定格子坐标（参数必须为格子中点）
	 * @param mapName
	 * @param x
	 * @param y
	 * @return
	 */
	public static pixelToCell(x: number, y: number, mapid?: number): number[] {
		mapid = mapid || BattleModel.getMapId();
		if (!this.pixelToCellConverter[mapid]) {
			return null;
		}
		if (x % MapConfig.halfTileWidth != 0 || y % MapConfig.halfTileHeight != 0) {
			return null;
		}
		return this.pixelToCellConverter[mapid][Utils.buildCellkey(x, y)];
	}
}
