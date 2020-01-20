/**
 * Created by leowang on 2016/12/20
 */

/**一个方向的角度 */
var AngleDirection: number = 360 / 8

class MapConfig {
	/**列 */
	public static numRows: number = 0;
	/**行 */
	public static numCols: number = 0;
	/**格仔大小 */
	public static tileWidth: number = 50;
	public static tileHeight: number = 25;
	public static halfTileWidth: number = MapConfig.tileWidth / 2;
	public static halfTileHeight: number = MapConfig.tileHeight / 2;
	/**逻辑格子x，y奇偶相同的线斜率*/
	public static k1: number;
	/**逻辑格子x，y奇偶不同的线斜率*/
	public static k2: number;
	/**寻路偏移量(一个格仔大小) */
	public static pathOffset: number;
	/**技能播放偏移量(一个格仔大小) */
	public static skillOffset: number;
	/**障碍物数量 */
	// public static numBarriers: number = 0;
}