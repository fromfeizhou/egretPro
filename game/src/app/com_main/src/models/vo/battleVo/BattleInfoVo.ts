/** 战场信息 */
class BattleInfoVo extends egret.HashObject implements IFObject {
	/**战场ID */
	public battleId: number;
	/**战斗类型  */
	public warType: number;
	/** 持续了多长时间秒*/
	public continueTime: number;
	/** 战斗开始后的持续时间*/
	public warContinueTime: number;
	/** 地形ID*/
	public terrainId: number;
	/**城池id 国战必须包含城池ID */
	public cityId :number;
	/** 回合数(中途进去需要处理)*/
	public roundNumber: number;
	/** pve 对应的配置表id  如章节id 关卡id*/
	public guideId: number;

	// public cpType:CheckPointType;
	public endTime: number; //结束时间戳
	/**攻击方傲气数据 */
	public atkArrogance: gameProto.ArroganceData;
	/**防守方傲气数据 */
	public defArrogance: gameProto.ArroganceData;

	public static create(body?: any) {
		let obj: BattleInfoVo = new BattleInfoVo(body);
		return obj;
	}

	public constructor(body?: any) {
		super();
		this.init(body);
	}

	public init(body?: any) {
		let keys: Array<string> =
			[
				"battleId","warType","continueTime","terrainId","cityId","roundNumber","guideId","warContinueTime","atkArrogance","defArrogance"
			];
		for (let ind in keys) {
			let key = keys[ind];
			if (key == "battleId") {
				//zb
				this[key] = body[key];
			} else {
				this[key] = body[key];
			}
		}
		this.endTime = TimerUtils.getServerTimeMill() + (120 - this.warContinueTime) * 1000;
		
	}

	public setTimeStart(){
		if(!this.warContinueTime){
			this.warContinueTime = 0.01;
			this.endTime = TimerUtils.getServerTimeMill() + (120 - this.warContinueTime) * 1000;
		}
	}

	public onDestroy() {
	}

}