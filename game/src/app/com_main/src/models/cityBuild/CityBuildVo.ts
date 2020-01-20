/**
 * 城市建设数据
 * 键值对-cityId-generalId
 */
class CityBuildVo extends BaseClass implements IFObject {
	/**属性值 */
	public static AttriKey: Array<string> = [
		"generalId", "cityId", "startDate", "levelReward",
		"sumExp", "endDate", "madeLevel", "speedTime"
	];
	public generalId: number; //武将id        
	public cityId: number; //城池id
	public startDate: number; //开始建造时间        
	public levelReward: number[]; //等级奖励领取记录（城市等级1,2,3,3,4.....）
	public sumExp: number; //城池总经验
	public endDate: number; //结束建造时间
	public madeLevel: number; //开始建造时城池等级
	public speedTime: number; //加速时间

	// 自定义数据
	public cityBuildState: CityBuildEnum = CityBuildEnum.FREE;

	public static create() {
		var obj: CityBuildVo = new CityBuildVo();
		return obj;
	}

	public constructor() {
		super();
	}

	public init(body?: gameProto.IPlayerMadeInfo) {
		this.parseKeys(body);
		if (this.generalId > 0) CityBuildModel.updateGens(this.generalId, this.cityId);
		com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.cityId);
	}

	public onDestroy() {

	}

	/**更新数据 */
	public update(body?: gameProto.IPlayerMadeInfo) {
		let oldId = this.generalId;
		this.parseKeys(body);
		if (this.generalId != oldId && this.generalId == 0) {
			CityBuildModel.updateGens(oldId, this.cityId, true);
			this.resetData();
		}
		if (this.generalId > 0) CityBuildModel.updateGens(this.generalId, this.cityId);
		com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.cityId);
	}

	/**解析服务器协议 */
	private parseKeys(body: any) {
		Utils.voParsePbData(this, body, CityBuildVo.AttriKey);

		if (this.isDoneCityBuilding()) {
			this.cityBuildState = CityBuildEnum.DONE;
		} else if (this.isInCityBuilding()) {
			this.cityBuildState = CityBuildEnum.BUILDING;
		} else {
			this.cityBuildState = CityBuildEnum.FREE;
		}
	}

	/**是否在建造中 */
	public isInCityBuilding(): boolean {
		return this.startDate > 0;
	}

	/**是否建造完成 */
	public isDoneCityBuilding(): boolean {
		if (isNull(this.startDate) || this.startDate == 0) return false;
		let curtime = TimerUtils.getServerTime();
		let mEndDate = this.endDate - this.speedTime;   // 实际结束时间
		let time = curtime - mEndDate;
		return time > 0;
	}

	/**定时器更新 */
	public updateTime() {
		if (this.endDate > 0) {
			if (this.cityBuildState == CityBuildEnum.DONE) return;
			if (this.isDoneCityBuilding()) {
				this.cityBuildState = CityBuildEnum.DONE;
				// CityBuildProxy.C2S_CITY_MADE_INFO(this.cityId);
				com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_UPDATE, this.cityId);
			}
		}
	}

	private resetData() {
		this.generalId = 0;
		this.endDate = 0;
		this.startDate = 0;
		this.speedTime = 0;
	}

	/**是否真正建造中 */
	public isBuilding() {
		return this.cityBuildState == CityBuildEnum.BUILDING;
	}

	public canReward() {
		return this.cityBuildState == CityBuildEnum.DONE;
	}
}