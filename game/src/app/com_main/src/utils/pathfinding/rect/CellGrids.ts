/**网格 */
class CellGrids extends egret.HashObject {
	private _cells: Cell[][];
	private csvData: number[][];

	public constructor(csvdata: number[][]) {
		super();
		this.setCSVData(csvdata);
	}

	public clear() {
		this._cells = [];
		this._cells = null;
		this.csvData = [];
		this.csvData = null;
	}

	public setCSVData(csvdata: number[][]) {
		if (!csvdata) return;
		this.csvData = csvdata;
		this.initCells();
	}

	public initCells() {
		this._cells = [];
		for (let y: number = 0; y < this.csvData.length; y++) {
			for (let x: number = 0; x < this.csvData[y].length; x++) {
				this._cells[y] = this._cells[y] || []
				this._cells[y][x] = new Cell(x, y, this.csvData[y][x]);
			}
		}
	}

	public getCSCData() {
		return this.csvData;
	}

	public getCellByPixel(x: number, y: number) {
		let cell = MapUtil.pixelToCell(x, y);
		let snode: Cell = this.getCell(cell.getCellY(), cell.getCellX());
		return snode
	}
	
	/**同一个格仔 */
	public equalsCell(pos1: egret.Point, pos2: egret.Point) {
		let snode: Cell = this.getCellByPixel(pos1.x, pos1.y);
		let enode: Cell = this.getCellByPixel(pos2.x, pos2.y);
		return snode.equals(enode);
	}

	public getCell(y: number, x: number) {
		if (y > this._cells.length) {
			error("超出地图范围Y:", y);
			return null;
		}
		if (!this._cells[y] || x > this._cells[y].length) {
			error("超出地图范围X", x);
			return null;
		}
		return this._cells[y][x];
	}

	public getCells() {
		return this._cells;
	}

	public getY() {
		return this._cells.length
	}

	public getX() {
		return this._cells[0].length;
	}
}