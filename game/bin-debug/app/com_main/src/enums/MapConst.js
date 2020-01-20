/**地形类型 */
var TerrainType;
(function (TerrainType) {
    TerrainType[TerrainType["COMMON"] = 0] = "COMMON";
    TerrainType[TerrainType["UNMOVEABLE"] = 1] = "UNMOVEABLE";
    TerrainType[TerrainType["FOREST"] = 2] = "FOREST";
    TerrainType[TerrainType["WATER"] = 3] = "WATER";
    TerrainType[TerrainType["FOUR"] = 4] = "FOUR";
    TerrainType[TerrainType["FIVE"] = 7] = "FIVE";
})(TerrainType || (TerrainType = {}));
/**地图图层类型 */
var LayerType = /** @class */ (function () {
    function LayerType() {
    }
    /**元件层，元素 */
    LayerType.OBJECTGROUP = "objectgroup";
    /**背景层，大地图 */
    LayerType.IMAGELAYER = "imagelayer";
    /**地形层，障碍物 */
    LayerType.TILELAYER = "tilelayer";
    return LayerType;
}());
/**地图图层名字 */
var LayerName = /** @class */ (function () {
    function LayerName() {
    }
    /**背景层，大地图 */
    LayerName.MAPBG = "MapBG";
    /**地形层，障碍物 */
    LayerName.TERRAIN = "Terrain";
    /**元件层，元素 */
    LayerName.ELEMENTS = "Elements";
    return LayerName;
}());
/**元素对象类型 */
var ObjectType = /** @class */ (function () {
    function ObjectType() {
    }
    /**防御方 */
    ObjectType.DEFENDER = "defender";
    /**攻击方 */
    ObjectType.ATTACKER = "attacker";
    /**攻击方npc */
    ObjectType.ATTACKER_NPC = "attacker_npc";
    /**防守方npc */
    ObjectType.DEFENDER_NPC = "defender_npc";
    /**攻击方城墙建筑 */
    ObjectType.ATTACKER_WALL = "attacker_wall";
    /**防守方城墙建筑 */
    ObjectType.DEFENDER_WALL = "defender_wall";
    /**攻击阵营 */
    ObjectType.ATTACKER_CAMP = "attacker_camp";
    /**建筑特效 */
    ObjectType.BUILD_EFFECT = "build_effect";
    /**静态的图片 */
    ObjectType.ELEMENT_IMAGE = "element_image";
    /**静态的动画 */
    ObjectType.ELEMENT_MOVICE = "element_movice";
    return ObjectType;
}());
/**
 * 方向角
 * @author dyhool
 */
var Direction;
(function (Direction) {
    /**
     * 上
     */
    Direction[Direction["UP"] = 0] = "UP";
    /**
     * 下
     */
    Direction[Direction["DOWN"] = 1] = "DOWN";
    /**
     * 右
     */
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    /**
     * 左
     */
    Direction[Direction["LEFT"] = 3] = "LEFT";
})(Direction || (Direction = {}));
/**
 * 方向方法
 * @author dyhool
 */
var MethodDirection;
(function (MethodDirection) {
    /**
     * 左上
     */
    MethodDirection[MethodDirection["LEFT_UP"] = 0] = "LEFT_UP";
    /**
     * 左下
     */
    MethodDirection[MethodDirection["LEFT_DOWN"] = 1] = "LEFT_DOWN";
    /**
     * 右下
     */
    MethodDirection[MethodDirection["RIGHT_DOWN"] = 2] = "RIGHT_DOWN";
    /**
     * 右上
     */
    MethodDirection[MethodDirection["RIGHT_UP"] = 3] = "RIGHT_UP";
})(MethodDirection || (MethodDirection = {}));
/**
 * 地图方向操作
 * @author dyhool
 */
var COption = /** @class */ (function () {
    function COption() {
    }
    /**
     * 增加（方向上的递增）
     */
    COption.add = 1;
    /**
     * 减少（方向上的递减）
     */
    COption.reduce = -1;
    return COption;
}());
