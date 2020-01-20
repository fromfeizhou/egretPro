/**
 * 斜菱形格子地图
 */
class ISOMap extends BaseClass {
	/** 地图配置信息 */
	protected mapSetting: MapSetting;
	/** 地图名称 */
	protected MAP_NAME: string;
	/** 格子宽 */
	protected TILE_WIDTH: number;
	/** 格子高 */
	protected TILE_HEIGHT: number;
	/** 格子宽的一半 */
	protected HALF_TILE_HEIGHT: number;
	/** 格子高的一半 */
	protected HALF_TILE_WIDTH: number;
	/** 地图宽（格子数） */
	protected CELL_MAP_WIDTH: number;
	/** 地图高（格子数） */
	protected CELL_MAP_HEIGHT: number;
	/** 像素坐标X轴偏移 */
	protected PIXEL_OFFSET_X: number;
	/** 像素坐标Y轴偏移 */
	protected PIXEL_OFFSET_Y: number;
	/** tile坐标系中的像素用W */
	protected TILE_PIXEL_W: number;
	/** tile坐标系中的像素用H */
	protected TILE_PIXEL_H: number;
	/** tile坐标系中的像素用W的一半 */
	protected HALF_TILE_PIXEL_W: number;
	/** tile坐标系中的像素用H的一半 */
	protected HALF_TILE_PIXEL_H: number;

	/** Elements地图偏移量 x*/
	protected OFFSET_X :number;
	/** Elements地图偏移量 y*/
	protected OFFSET_Y :number;

	public static _instance: ISOMap;
	public static getInstance(): ISOMap {
		ISOMap._instance = ISOMap._instance || new ISOMap();
		return ISOMap._instance;
	}

	/**
	 * 构造斜菱形地图
	 *
	 * @param mapSetting
	 *            地图配置
	 */
	public constructor() {
		super();
	}

	public init(mapSetting: MapSetting) {
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

	}

	// @Override
	public isValidPixel(pixelX: number, pixelY: number) {
		let point: number[] = this.pixelToCell(pixelX, pixelY);
		return this.isValidCell(point[0], point[1]);
	}

	// @Override
	public isValidCell(cellX: number, cellY: number) {
		if (cellX < 0 || cellX >= this.CELL_MAP_WIDTH) {
			return false;
		}
		if (cellY < 0 || cellY >= this.CELL_MAP_HEIGHT) {
			return false;
		}
		return true;
	}

	/**菱形格仔转矩形像素 */
	// @Override
	public cellToPixel(cellX: number, cellY: number) {
		let point: number[] = [];
		point[0] = Math.floor(this.HALF_TILE_WIDTH * (cellX - cellY)) + this.PIXEL_OFFSET_X;
		point[1] = Math.floor(this.HALF_TILE_HEIGHT * (cellX + cellY)) + this.HALF_TILE_HEIGHT + this.PIXEL_OFFSET_Y;
		return point;
	}

	/**矩形像素转菱形格仔 */
	// @Override
	public pixelToCell(pixelX: number, pixelY: number) {
		let point: number[] = [];
		let x = pixelX - this.PIXEL_OFFSET_X;
		let y = pixelY - this.PIXEL_OFFSET_Y;
		point[0] = Math.floor(x / this.TILE_WIDTH + y / this.TILE_HEIGHT);
		point[1] = Math.floor(-x / this.TILE_WIDTH + y / this.TILE_HEIGHT);
		return point;
	}

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
	public tilePixelToPixel(tilePixelX: number, tilePixelY: number) {
		let point: number[] = [];
		point[0] = Math.floor(this.HALF_TILE_PIXEL_W * (tilePixelX - tilePixelY)) + this.PIXEL_OFFSET_X + this.OFFSET_X;
		point[1] = Math.floor(this.HALF_TILE_PIXEL_H * (tilePixelX + tilePixelY)) + this.PIXEL_OFFSET_Y + this.OFFSET_Y;
		return point;
	}

	/**
	 * 左下角格子坐标系 转地图像素
	 */
	public leftDownCellToPixel(leftDownx: number, leftDownY: number) {
		let cellY = this.CELL_MAP_HEIGHT - leftDownx - 1;
		let cellX = this.CELL_MAP_WIDTH - leftDownY - 1;
		let point: number[] = [];
		point[0] = Math.floor(this.HALF_TILE_WIDTH  * (cellX - cellY)) + this.PIXEL_OFFSET_X + this.OFFSET_X ;
		point[1] = Math.floor(this.HALF_TILE_HEIGHT * (cellX + cellY)) + this.PIXEL_OFFSET_Y + this.OFFSET_Y;
		return point;
	}

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
	public pixelToTilePixel(pixelX: number, pixelY: number) {

		pixelX = pixelX + 1151;
		pixelY = pixelY + 424;
		let point: number[] = [];
		let x = pixelX - this.PIXEL_OFFSET_X;
		let y = pixelY - this.PIXEL_OFFSET_Y;
		point[0] = Math.floor(x / this.TILE_PIXEL_W + y / this.TILE_PIXEL_H);
		point[1] = Math.floor(-x / this.TILE_PIXEL_W + y / this.TILE_PIXEL_H);
		return point;
	}

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
	public tilePixelToTile(tilePixelX: number, tilePixelY: number) {
		let point: number[] = [];
		point[0] = Math.floor(tilePixelX / this.HALF_TILE_WIDTH);
		point[1] = Math.floor(tilePixelY / this.HALF_TILE_WIDTH);
		return point;
	}

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
	public tileToTilePixel(tileX: number, tileY: number) {
		let point: number[] = [];
		let halfCell = this.HALF_TILE_WIDTH / 2;
		point[0] = tileX * this.HALF_TILE_WIDTH + halfCell;
		point[1] = tileY * this.HALF_TILE_WIDTH + halfCell;
		return point;
	}

	public getMAP_NAME() {
		return this.MAP_NAME;
	}

	public setMAP_NAME(mAP_NAME: string) {
		this.MAP_NAME = mAP_NAME;
	}

	public getTILE_WIDTH() {
		return this.TILE_WIDTH;
	}

	public setTILE_WIDTH(tILE_WIDTH: number) {
		this.TILE_WIDTH = tILE_WIDTH;
	}

	public getTILE_HEIGHT() {
		return this.TILE_HEIGHT;
	}

	public setTILE_HEIGHT(tILE_HEIGHT: number) {
		this.TILE_HEIGHT = tILE_HEIGHT;
	}

	public getHALF_TILE_HEIGHT() {
		return this.HALF_TILE_HEIGHT;
	}

	public setHALF_TILE_HEIGHT(hALF_TILE_HEIGHT: number) {
		this.HALF_TILE_HEIGHT = hALF_TILE_HEIGHT;
	}

	public getHALF_TILE_WIDTH() {
		return this.HALF_TILE_WIDTH;
	}

	public setHALF_TILE_WIDTH(hALF_TILE_WIDTH: number) {
		this.HALF_TILE_WIDTH = hALF_TILE_WIDTH;
	}

	public getCELL_MAP_WIDTH() {
		return this.CELL_MAP_WIDTH;
	}

	public setCELL_MAP_WIDTH(cELL_MAP_WIDTH: number) {
		this.CELL_MAP_WIDTH = cELL_MAP_WIDTH;
	}

	public getCELL_MAP_HEIGHT() {
		return this.CELL_MAP_HEIGHT;
	}

	public setCELL_MAP_HEIGHT(cELL_MAP_HEIGHT: number) {
		this.CELL_MAP_HEIGHT = cELL_MAP_HEIGHT;
	}

	public getPIXEL_OFFSET_X() {
		return this.PIXEL_OFFSET_X;
	}

	public setPIXEL_OFFSET_X(pIXEL_OFFSET_X: number) {
		this.PIXEL_OFFSET_X = pIXEL_OFFSET_X;
	}

	public getPIXEL_OFFSET_Y() {
		return this.PIXEL_OFFSET_Y;
	}

	public setPIXEL_OFFSET_Y(pIXEL_OFFSET_Y: number) {
		this.PIXEL_OFFSET_Y = pIXEL_OFFSET_Y;
	}

	public getTILE_PIXEL_W() {
		return this.TILE_PIXEL_W;
	}

	public setTILE_PIXEL_W(tILE_PIXEL_W: number) {
		this.TILE_PIXEL_W = tILE_PIXEL_W;
	}

	public getTILE_PIXEL_H() {
		return this.TILE_PIXEL_H;
	}

	public setTILE_PIXEL_H(tILE_PIXEL_H: number) {
		this.TILE_PIXEL_H = tILE_PIXEL_H;
	}

	public getHALF_TILE_PIXEL_W() {
		return this.HALF_TILE_PIXEL_W;
	}

	public setHALF_TILE_PIXEL_W(hALF_TILE_PIXEL_W: number) {
		this.HALF_TILE_PIXEL_W = hALF_TILE_PIXEL_W;
	}

	public getHALF_TILE_PIXEL_H() {
		return this.HALF_TILE_PIXEL_H;
	}

	public setHALF_TILE_PIXEL_H(hALF_TILE_PIXEL_H: number) {
		this.HALF_TILE_PIXEL_H = hALF_TILE_PIXEL_H;
	}

	public getMapSetting() {
		return this.mapSetting;
	}
}
