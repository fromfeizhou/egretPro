/**地形类型 */
enum TerrainType {
	COMMON = 0,
	UNMOVEABLE = 1,
	FOREST = 2,
	WATER = 3,
	FOUR = 4,
	FIVE = 7,
}

/**地图图层类型 */
class LayerType {
	/**元件层，元素 */
	public static OBJECTGROUP = "objectgroup";
	/**背景层，大地图 */
	public static IMAGELAYER = "imagelayer";
	/**地形层，障碍物 */
	public static TILELAYER = "tilelayer";
}

/**地图图层名字 */
class LayerName {
	/**背景层，大地图 */
	public static MAPBG = "MapBG";
	/**地形层，障碍物 */
	public static TERRAIN = "Terrain";
	/**元件层，元素 */
	public static ELEMENTS = "Elements";
}

/**元素对象类型 */
class ObjectType {
	/**防御方 */
	public static DEFENDER = "defender";
	/**攻击方 */
	public static ATTACKER = "attacker";
	/**攻击方npc */
	public static ATTACKER_NPC = "attacker_npc";
	/**防守方npc */
	public static DEFENDER_NPC = "defender_npc";
	/**攻击方城墙建筑 */
	public static ATTACKER_WALL = "attacker_wall";
	/**防守方城墙建筑 */
	public static DEFENDER_WALL = "defender_wall";
	/**攻击阵营 */
	public static ATTACKER_CAMP = "attacker_camp";
	/**建筑特效 */
	public static BUILD_EFFECT = "build_effect";
	/**静态的图片 */
	public static ELEMENT_IMAGE = "element_image";
	/**静态的动画 */
	public static ELEMENT_MOVICE = "element_movice";
}

/**
 * 方向角
 * @author dyhool
 */
enum Direction {
	/**
	 * 上
	 */
	UP,
	/**
	 * 下
	 */
	DOWN,
	/**
	 * 右
	 */
	RIGHT,
	/**
	 * 左
	 */
	LEFT,
}

/**
 * 方向方法
 * @author dyhool
 */
enum MethodDirection {
	/**
	 * 左上
	 */
	LEFT_UP,

	/**
	 * 左下
	 */
	LEFT_DOWN,

	/**
	 * 右下
	 */
	RIGHT_DOWN,

	/**
	 * 右上
	 */
	RIGHT_UP,
}

/**
 * 地图方向操作
 * @author dyhool
 */
class COption {
	/**
	 * 增加（方向上的递增）
	 */
	public static add = 1;
	/**
	 * 减少（方向上的递减）		
	 */
	public static reduce = -1;
}