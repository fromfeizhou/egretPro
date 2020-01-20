/**
 * Created by leowang on 2016/12/20
 */
class MapSetting {

	/**
	 * 地图名
	 */
    private mapName: string;
    /**地图ID */
    private mapId: number;

	/**
	 * 地图宽（格子数）
	 */
    private width: number;

	/**
	 * 地图高（格子数）
	 */
    private height: number;

	/**
	 * layr层(<层类型，<层名，层>>)
     * ConcurrentHashMap<String, ConcurrentHashMap<String, Layer >>
	 */
    private layers: Layer[][] = [];

	/**
	 * 格子高（像素）
	 */
    private tileheight: number;
	/**
	 * 格子宽(像素)
	 */
    private tilewidth: number;

	/**
	 * 格子高的一半（像素）
	 */
    private halfTileHeight: number;

	/**
	 * 格子宽的一半（像素）
	 */
    private halfTileWidth: number;

	/**
	 * 逻辑网格坐标x，y奇偶相同的斜线斜率
	 */
    private k1: number;

	/**
	 * 逻辑网格坐标x，y奇偶不同的斜线斜率
	 */
    private k2: number;

    /**寻路偏移量(一个格仔大小) */
    private pathOffset: number;
    /**技能播放偏移量(一个格仔大小) */
    private skillOffset: number;

    /** 地图偏移量 x*/
	protected OFFSET_X :number;
	/** 地图偏移量 y*/
	protected OFFSET_Y :number;

    public static create(mapId: any) {
        let obj = new MapSetting(mapId);
        return obj;
    }

    public constructor(mapId: any) {
        this.setWidth(40);//(json["width"]);
        this.setHeight(84)//(json["height"]);
        this.setTilewidth(50)//(json["tilewidth"]);
        this.setTileheight(25)//(json["tileheight"]);

        let k: number = this.getTileheight() / this.getTilewidth();
        this.setK1(-k);
        this.setK2(k);

        let offset = Utils.MathUtils.getDiagonal(MapConfig.tileWidth, MapConfig.tileHeight)
        this.setPathOffset(offset);
        this.setSkillOffset(offset);

        let config = C.TerrainConfig[mapId];
        this.OFFSET_X = config.offX;
        this.OFFSET_Y = config.offY;

        // // 转换layer
        // let list = json["layers"];
        // // List < LinkedHashMap < String, Object >>
        // if (list != null && !(list.length == 0)) {
        //     for (let key in list) {
        //         let layer: Layer = Layer.create(list[key]);
        //         //存在地图数据时转换
        //         if (layer.getData() != null) {
        //             layer.setCells(MapLoader.data2Cell(layer.getData(), layer.getHeight(), layer.getWidth()));
        //         }
        //         let tlayers: Layer[][] = this.getLayers();
        //         let nlayers: Layer[] = tlayers[layer.getType()];
        //         if (!nlayers) {
        //             nlayers = [];
        //             tlayers[layer.getType()] = nlayers;
        //         }
        //         nlayers[layer.getName()] = layer;
        //         if(list[key]["name"] == "Elements"){
        //             this.OFFSET_X = list[key]["offsetx"];
        //             this.OFFSET_Y = list[key]["offsety"];

        //             // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        //             // console.log("this.OFFSET_X = ",this.OFFSET_X);
        //             // console.log("this.OFFSET_y = ",this.OFFSET_Y);
                    
        //         }
        //     }
        // }
    }

    public clear() {
        this.layers = [];
        this.layers = null;
    }

    public getElemOffsetX(){
        return this.OFFSET_X || 0;
    }
    public getElemOffsetY(){
        return this.OFFSET_Y || 0;
    }

    public getWidth(): number {
        return this.width;
    }
    public setWidth(width: number) {
        this.width = width;
    }
    public getHeight(): number {
        return this.height;
    }
    public setHeight(height: number) {
        this.height = height;
    }

    public getTileheight(): number {
        return this.tileheight;
    }
    public setTileheight(tileheight: number) {
        this.tileheight = tileheight;
        this.halfTileHeight = this.tileheight / 2;
    }
    public getTilewidth(): number {
        return this.tilewidth;
    }
    public setTilewidth(tilewidth: number) {
        this.tilewidth = tilewidth;
        this.halfTileWidth = this.tilewidth / 2;
    }
    public getLayers() {
        return this.layers;
    }
    public setLayers(layers: Layer[][]) {
        this.layers = layers;
    }
    public getHalfTileHeight() {
        return this.halfTileHeight;
    }
    public setHalfTileHeight(halfTileHeight: number) {
        this.halfTileHeight = halfTileHeight;
    }
    public getHalfTileWidth() {
        return this.halfTileWidth;
    }
    public setHalfTileWidth(halfTileWidth: number) {
        this.halfTileWidth = halfTileWidth;
    }
    public getK1(): number {
        return this.k1;
    }
    public setK1(k1: number) {
        this.k1 = k1;
    }
    public getK2(): number {
        return this.k2;
    }
    public setK2(k2: number) {
        this.k2 = k2;
    }
    public getPathOffset(): number {
        return this.pathOffset;
    }
    public setPathOffset(v: number) {
        this.pathOffset = v;
    }
    public getSkillOffset(): number {
        return this.skillOffset;
    }
    public setSkillOffset(v: number) {
        this.skillOffset = v;
    }
    public getMapName() {
        return this.mapName;
    }
    public setMapName(mapName: string) {
        this.mapName = mapName;
    }
    public getMapId() {
        return this.mapId;
    }
    public setMapId(mapid: number) {
        this.mapId = mapid;
    }

    /**
     * 获取图像层集合
     * @param mapName 地图名
     * @return
     */
    public listImageLayer(): Layer[] {
        return this.listLayer(LayerType.IMAGELAYER);
    }

    /**
     * 获取object层集合
     * @param mapName 地图名
     * @return
     */
    public listObjectGroup(): Layer[] {
        return this.listLayer(LayerType.OBJECTGROUP);
    }

    /**
     * 获取title层集合
     * @param mapName
     * @return
     */
    public listTileLayer(): Layer[] {
        return this.listLayer(LayerType.TILELAYER);
    }

    /**
     * 获得图像层
     * @param mapName 地图名
     * @param name 层名
     * @return
     */
    public getImageLayer(name: string): Layer {
        return this.getLayer(LayerType.IMAGELAYER, name);
    }

    /**
     * 获得对象层
     * @param mapName 地图名
     * @param name 层名
     * @return
     */
    public getObjectLayer(name: string): Layer {
        return this.getLayer(LayerType.OBJECTGROUP, name);
    }

    /**
     * 获得title层
     * @param mapName 地图名
     * @param name 层名
     * @return
     */
    public getTitleLayer(name: string): Layer {
        return this.getLayer(LayerType.TILELAYER, name);
    }


    /**
     * 获取对象层中的某类型的对象列表
     * @param type
     * @return
     */
    public listMapObject(layerName: string, type: string): MapObject[] {
        let layer: Layer = this.getObjectLayer(layerName);
        if (layer != null && layer.getTypeObject() != null) {
            return layer.getTypeObjects(type);
        }
        return null;
    }

    public getMapObject(layerName: string, type: string, objname: string): MapObject {
        let objects = this.listMapObject(layerName, type);
        let obj: MapObject;
        if (objects) {
            for (var index = 0; index < objects.length; index++) {
                var value = objects[index];
                if (value.getName() == objname) {
                    obj = value;
                    break;
                }
            }
        }
        return obj;
    }

    /**
     * 根据地图名，层类型，层名获取层
     * @param mapName 地图名
     * @param layerType 层类型
     * @param name 层名
     * @return
     */
    private getLayer(layerType: string, name: string): Layer {
        if (this.layers[layerType]) {
            return this.layers[layerType][name];
        }
        return null;
    }


	/**
	 * 根据地图名，层类型获取层集合
	 * @param mapName 地图名
	 * @param layerType 层类型
	 * @return
	 */
    private listLayer(layerType: string): Layer[] {
        if (this.layers[layerType]) {
            return this.layers[layerType];
        }
        return null;
    }
}
