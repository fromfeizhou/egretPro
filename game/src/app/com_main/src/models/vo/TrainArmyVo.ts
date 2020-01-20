class TrainArmyVo extends egret.HashObject implements IFObject {
	/**
	 * 练兵进度信息
	 */
    public bId: number;
    public armyType:number;
	public startTime: number;
	public endTime: number;
	public num: number;

	public speedTime:number = 0;
	
	public static create(body?: any) {
		let vo: TrainArmyVo = new TrainArmyVo(body);
		return vo;
	}

	public constructor(body?: any) {
		super();
		this.init(body);
	}

	public init(body?: any) {
		let keys: Array<string> = ["bId","armyType", "startTime", "endTime", "num","speedTime"];
		for (let index in keys) {
			let key = keys[index];
			this[key] = body[key];
		}
	}



	public reset() {
		let keys: Array<string> = ["bId","armyType", "startTime", "endTime", "num","speedTime"];
		for (let index in keys) {
			let key = keys[index];
			this[key] = null;
		}
	}

	public onDestroy() {
	}
}