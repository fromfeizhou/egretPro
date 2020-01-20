class StrategyPropVo extends egret.HashObject implements IFObject {

	/**ThreeCabinetConfig.id 龙图阁配置id */
    public id: number;
	//zb
	/**开始时间 */
	// private startTime: Long;
	/**结束时间 */
	// private endTime: Long;

	private startTime: number;
	private endTime: number;
    /**下标位置 */
    public index:number;

	public static create(body?: any) {
		let vo: StrategyPropVo = new StrategyPropVo(body);
		return vo;
	}

	public constructor(body?: any) {
		super();
		this.init(body);
	}

	public init(body?: any) {
		let keys: Array<string> = ["id", "startTime", "endTime","index"];
		for (let index in keys) {
			let key = keys[index];
			this[key] = body[key];
		}
	}

	public reset() {
		let keys: Array<string> = ["id", "startTime", "endTime"];
		for (let index in keys) {
			let key = keys[index];
			this[key] = null;
		}
	}

	public onDestroy() {
	}
}