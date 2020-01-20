/** 地图格仔单元 */
class Cell extends egret.HashObject {
	private cellX: number;
	private cellY: number;
	private terrainType: TerrainType;

	private owner: Unit;

	public constructor(cellX: number, cellY: number, type: TerrainType = TerrainType.COMMON) {
		super();

		this.cellX = cellX;
		this.cellY = cellY;
		this.terrainType = type;
	}

	public isEmpty(unit: Unit): boolean {
		if (this.owner != null && !this.owner.isAlive()) {
			this.owner = null;
		}
		return this.owner == null || this.owner == unit;
	}

	public getOwner(): Unit {
		return this.owner;
	}

	public setOwner(owner: Unit) {
		this.owner = owner;
	}

	public getCellX(): number {
		return this.cellX;
	}

	public getCellY(): number {
		return this.cellY;
	}

	public setCellY(y: number) {
		this.cellY = y;
	}

	public getTerrainType(): TerrainType {
		return this.terrainType;
	}

	/**
	 * 判断是否可移动
	 * 
	 * @param unit
	 * @return
	 */
	public checkMove(unit?: any): boolean {
		if (this.terrainType == TerrainType.UNMOVEABLE /*|| (units != null && units.size() > 0 && !units.contains(unit))*/) {
			return false;
		}
		return true;
	}

	public getCellPoint(): egret.Point {
		return new egret.Point(this.cellX, this.cellY);
	}

	public cellToPixel(): egret.Point {
		return MapUtil.cellToPixel(this);
	}

	public equals(cell: Cell) {
		if (this.getCellX() == cell.getCellX() && this.getCellY() == cell.getCellY()) {
			return true;
		}
		return false
	}
}
