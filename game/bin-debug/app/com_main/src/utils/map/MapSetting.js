/**
 * Created by leowang on 2016/12/20
 */
var MapSetting = /** @class */ (function () {
    function MapSetting(mapId) {
        /**
         * layr层(<层类型，<层名，层>>)
         * ConcurrentHashMap<String, ConcurrentHashMap<String, Layer >>
         */
        this.layers = [];
        this.setWidth(40); //(json["width"]);
        this.setHeight(84); //(json["height"]);
        this.setTilewidth(50); //(json["tilewidth"]);
        this.setTileheight(25); //(json["tileheight"]);
        var k = this.getTileheight() / this.getTilewidth();
        this.setK1(-k);
        this.setK2(k);
        var offset = Utils.MathUtils.getDiagonal(MapConfig.tileWidth, MapConfig.tileHeight);
        this.setPathOffset(offset);
        this.setSkillOffset(offset);
        var config = C.TerrainConfig[mapId];
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
    MapSetting.create = function (mapId) {
        var obj = new MapSetting(mapId);
        return obj;
    };
    MapSetting.prototype.clear = function () {
        this.layers = [];
        this.layers = null;
    };
    MapSetting.prototype.getElemOffsetX = function () {
        return this.OFFSET_X || 0;
    };
    MapSetting.prototype.getElemOffsetY = function () {
        return this.OFFSET_Y || 0;
    };
    MapSetting.prototype.getWidth = function () {
        return this.width;
    };
    MapSetting.prototype.setWidth = function (width) {
        this.width = width;
    };
    MapSetting.prototype.getHeight = function () {
        return this.height;
    };
    MapSetting.prototype.setHeight = function (height) {
        this.height = height;
    };
    MapSetting.prototype.getTileheight = function () {
        return this.tileheight;
    };
    MapSetting.prototype.setTileheight = function (tileheight) {
        this.tileheight = tileheight;
        this.halfTileHeight = this.tileheight / 2;
    };
    MapSetting.prototype.getTilewidth = function () {
        return this.tilewidth;
    };
    MapSetting.prototype.setTilewidth = function (tilewidth) {
        this.tilewidth = tilewidth;
        this.halfTileWidth = this.tilewidth / 2;
    };
    MapSetting.prototype.getLayers = function () {
        return this.layers;
    };
    MapSetting.prototype.setLayers = function (layers) {
        this.layers = layers;
    };
    MapSetting.prototype.getHalfTileHeight = function () {
        return this.halfTileHeight;
    };
    MapSetting.prototype.setHalfTileHeight = function (halfTileHeight) {
        this.halfTileHeight = halfTileHeight;
    };
    MapSetting.prototype.getHalfTileWidth = function () {
        return this.halfTileWidth;
    };
    MapSetting.prototype.setHalfTileWidth = function (halfTileWidth) {
        this.halfTileWidth = halfTileWidth;
    };
    MapSetting.prototype.getK1 = function () {
        return this.k1;
    };
    MapSetting.prototype.setK1 = function (k1) {
        this.k1 = k1;
    };
    MapSetting.prototype.getK2 = function () {
        return this.k2;
    };
    MapSetting.prototype.setK2 = function (k2) {
        this.k2 = k2;
    };
    MapSetting.prototype.getPathOffset = function () {
        return this.pathOffset;
    };
    MapSetting.prototype.setPathOffset = function (v) {
        this.pathOffset = v;
    };
    MapSetting.prototype.getSkillOffset = function () {
        return this.skillOffset;
    };
    MapSetting.prototype.setSkillOffset = function (v) {
        this.skillOffset = v;
    };
    MapSetting.prototype.getMapName = function () {
        return this.mapName;
    };
    MapSetting.prototype.setMapName = function (mapName) {
        this.mapName = mapName;
    };
    MapSetting.prototype.getMapId = function () {
        return this.mapId;
    };
    MapSetting.prototype.setMapId = function (mapid) {
        this.mapId = mapid;
    };
    /**
     * 获取图像层集合
     * @param mapName 地图名
     * @return
     */
    MapSetting.prototype.listImageLayer = function () {
        return this.listLayer(LayerType.IMAGELAYER);
    };
    /**
     * 获取object层集合
     * @param mapName 地图名
     * @return
     */
    MapSetting.prototype.listObjectGroup = function () {
        return this.listLayer(LayerType.OBJECTGROUP);
    };
    /**
     * 获取title层集合
     * @param mapName
     * @return
     */
    MapSetting.prototype.listTileLayer = function () {
        return this.listLayer(LayerType.TILELAYER);
    };
    /**
     * 获得图像层
     * @param mapName 地图名
     * @param name 层名
     * @return
     */
    MapSetting.prototype.getImageLayer = function (name) {
        return this.getLayer(LayerType.IMAGELAYER, name);
    };
    /**
     * 获得对象层
     * @param mapName 地图名
     * @param name 层名
     * @return
     */
    MapSetting.prototype.getObjectLayer = function (name) {
        return this.getLayer(LayerType.OBJECTGROUP, name);
    };
    /**
     * 获得title层
     * @param mapName 地图名
     * @param name 层名
     * @return
     */
    MapSetting.prototype.getTitleLayer = function (name) {
        return this.getLayer(LayerType.TILELAYER, name);
    };
    /**
     * 获取对象层中的某类型的对象列表
     * @param type
     * @return
     */
    MapSetting.prototype.listMapObject = function (layerName, type) {
        var layer = this.getObjectLayer(layerName);
        if (layer != null && layer.getTypeObject() != null) {
            return layer.getTypeObjects(type);
        }
        return null;
    };
    MapSetting.prototype.getMapObject = function (layerName, type, objname) {
        var objects = this.listMapObject(layerName, type);
        var obj;
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
    };
    /**
     * 根据地图名，层类型，层名获取层
     * @param mapName 地图名
     * @param layerType 层类型
     * @param name 层名
     * @return
     */
    MapSetting.prototype.getLayer = function (layerType, name) {
        if (this.layers[layerType]) {
            return this.layers[layerType][name];
        }
        return null;
    };
    /**
     * 根据地图名，层类型获取层集合
     * @param mapName 地图名
     * @param layerType 层类型
     * @return
     */
    MapSetting.prototype.listLayer = function (layerType) {
        if (this.layers[layerType]) {
            return this.layers[layerType];
        }
        return null;
    };
    return MapSetting;
}());
