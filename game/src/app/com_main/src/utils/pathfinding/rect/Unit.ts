class Unit extends egret.HashObject {
	private id: number;

	public static create(id: number) {
		let obj = new Unit();
		obj.setId(id);
		return obj;
	}

	public constructor() {
		super();
	}
	/**
	 * isAlive
	 */
	public isAlive() {
		return false;
	}

	public setId(v: number) {
		this.id = v;
	}

	public getId(): number {
		return this.id;
	}

	/**
	 * 获取状态
	 * @return
	 */
	public getAction(): UnitAction {
		return UnitAction.STAND;
	}
}