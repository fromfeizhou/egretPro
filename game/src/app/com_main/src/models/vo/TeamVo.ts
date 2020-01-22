interface ITeamGenData extends gameProto.TeamGeneralData {
	minSoldierMaxCount?: number,
	soldierType?: SoldierMainType,
	level?: number,
	fight?:number,
}

class TeamVo extends BaseClass implements IFObject {
	/**属性值 */
	public static AttriKey: Array<string> = ["id", "order", "teamType", "state", "teamGeneralData", "cityId", "autoFill"];

	public id: number;	//编组唯一ID
	public order: number;	//编组排序 0-9
	public teamType: TeamType;	//编组类型
	public state: TeamState;    //编组状态
	public teamGeneralData: ITeamGenData[];    //编组队伍列表
	public cityId: number;   //部队所在城市
	public autoFill: boolean;
	//部队兵力状况
	private headId: number; //部队头像

	public static create() {
		var obj: TeamVo = new TeamVo();
		return obj;
	}

	public constructor() {
		super();
	}

	public init(body?: gameProto.ITeamData) {

		this.parseKeys(body);
		com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this);
	}

	/**更新数据 */
	public update(body?: gameProto.ITeamData) {
		let oldId = this.cityId;
		this.parseKeys(body);
		this.cityId = body ? body.cityId : 0;
		if (oldId != this.cityId) {
			com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, oldId);
			com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TEAM_UPDATE, this.cityId);
		}

		com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this);
	}

	/**解析服务器协议 */
	private parseKeys(body: any) {
		Utils.voParsePbData(this, body, TeamVo.AttriKey);
		//部队兵力重置
		this.headId = 0;

		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			if (data.generalId > 0) {
				if (this.headId == 0) this.headId = data.generalId;
				let vo = GeneralModel.getOwnGeneral(data.generalId);
				data.soldierType = vo.getGeneralArmyType();
				data.level = vo.level;
				data.minSoldierMaxCount = vo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
				data.fight = vo.fight;
			}
		}
	}
	/**武将属性变动 */
	public updateGeneral(id: number) {
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			if (data.generalId == id) {
				let vo = GeneralModel.getOwnGeneral(data.generalId);
				data.minSoldierMaxCount = vo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
				data.fight = vo.fight;
			}
		}
	}

	/**获取拷贝布阵信息 */
	public cloneTeamGeneralData(): gameProto.TeamGeneralData[] {
		let list: gameProto.TeamGeneralData[] = [];
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			let tmpData: gameProto.TeamGeneralData = {
				generalId: data.generalId, position: data.position, generalLevel: data.generalLevel, generalStar: data.generalStar,
				minSoldierCount: JSON.parse(JSON.stringify(data.minSoldierCount)), minSoldierTotalCount: data.minSoldierTotalCount
			};
			list.push(tmpData);
		}
		for (let i = 0; i < 5; i++) {
			let isEmpty: boolean = true;;
			for (let k = 0; k < this.teamGeneralData.length; k++) {
				let data = this.teamGeneralData[k];
				if (data.position - 1 == i) {
					isEmpty = false;
					break;
				}
			}
			//空位置
			if (isEmpty) {
				let tmpData: gameProto.TeamGeneralData = {
					generalId: 0, position: i, generalLevel: 0, generalStar: 0,
					minSoldierCount: [], minSoldierTotalCount: 0
				};
				list.push(tmpData);
			}
		}

		list.sort((a, b) => {
			return a.position - b.position;
		});

		return list;
	}

	/**队伍存在武将 */
	public hasGeneralById(id: number) {
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			if (id == this.teamGeneralData[i].generalId) {
				return true;
			}
		}
		return false;
	}

	/**是否是空队伍 */
	public isEmptyTeam() {
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			if (this.teamGeneralData[i].generalId > 0) {
				return false;
			}
		}
		return true;
	}

	/**获得部队血量战力 */
	public getTeamUiInfo(): { headId: number, fight: number, hp: number, maxHp: number } {
		let cur = 0, max = 0,fight = 0;
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			if (this.teamGeneralData[i].generalId > 0) {
				cur += this.teamGeneralData[i].minSoldierTotalCount;
				max += this.teamGeneralData[i].minSoldierMaxCount;
				fight += this.teamGeneralData[i].fight;
			}
		}
		//容错 防止0
		max = Math.max(1, max);
		return { headId: this.headId, fight: fight, hp: cur, maxHp: max };
	}

	/**获得移动消耗 */
	public getMoveCost() {
		let cost = 0;
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
			if (genVo) {
				let cfg = genVo.getGeneralArmyConfig();
				cost += cfg.teamconsumption;
			}
		}
		return cost;
	}

	/**得到兵种当前兵，最大兵映射 */
	// public getSoliderTypeMap() {
	// 	let soliderNum = {};
	// 	soliderNum[SoldierMainType.FOOTSOLDIER] = [0, 0];
	// 	soliderNum[SoldierMainType.RIDESOLDIER] = [0, 0];
	// 	soliderNum[SoldierMainType.ARROWSOLDIER] = [0, 0];
	// 	soliderNum[SoldierMainType.PIKEMAN] = [0, 0];
	// 	//计算兵力总和
	// 	for (let i = 0; i < this.teamGeneralData.length; i++) {
	// 		let data = this.teamGeneralData[i];
	// 		if (data.generalId > 0) {
	// 			let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
	// 			let armyType = genVo.getGeneralArmyType();
	// 			soliderNum[armyType][0] += Math.min(data.minSoldierTotalCount, genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER));
	// 			soliderNum[armyType][1] += genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
	// 		}
	// 	}
	// 	return soliderNum
	// }
	/**兵库补兵根据等级换算 前面的值是需要的兵力*/
	// public getSoliderLevTypeMap() {
	// 	let soliderNum = {};
	// 	soliderNum[SoldierMainType.FOOTSOLDIER] = [0, 0];
	// 	soliderNum[SoldierMainType.RIDESOLDIER] = [0, 0];
	// 	soliderNum[SoldierMainType.ARROWSOLDIER] = [0, 0];
	// 	soliderNum[SoldierMainType.PIKEMAN] = [0, 0];
	// 	//计算兵力总和
	// 	for (let i = 0; i < this.teamGeneralData.length; i++) {
	// 		let data = this.teamGeneralData[i];
	// 		if (data.generalId > 0) {
	// 			let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
	// 			let armyType = genVo.getGeneralArmyType();
	// 			// soliderNum[armyType][0] += Math.min(data.minSoldierTotalCount, genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER));
	// 			let curSolider = Math.min(data.minSoldierTotalCount, genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER));
	// 			let maxSolider = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
	// 			let needSoliderOld = maxSolider - curSolider;
	// 			let rate = Math.ceil((needSoliderOld / maxSolider) * 100);
	// 			let armyupCfig = unNull(C.ArmyUpTeamConfig[genVo.level]) ? C.ArmyUpTeamConfig[genVo.level] : C.ArmyUpTeamConfig[1];
	// 			let needSoliderNew = armyupCfig.armyNum * rate;
	// 			soliderNum[armyType][0] += needSoliderNew;
	// 			soliderNum[armyType][1] += maxSolider;
	// 		}
	// 	}
	// 	return soliderNum
	// }
	/**判断兵力是否已满根据武将等级 */
	public isSoliderByTypeFull(type: SoldierMainType) {
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			if (data.generalId > 0 && data.soldierType == type) {
				//有一个没满就推出
				if (data.minSoldierMaxCount - data.minSoldierTotalCount > 0) return false;
			}
		}
		return true;
	}
	/**武将血量是否已满 */
	public isSoldierFull() {
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			if (data.generalId > 0) {
				//有一个没满就推出
				if (data.minSoldierMaxCount - data.minSoldierTotalCount > 0) return false;
			}
		}
		return true;
	}
	/**兵力需求 */
	// public needSoldierCost() {
	// 	let gold = 0;
	// 	let price: string = ConstUtil.getString(IConstEnum.TROOP_SUPPLYMENT_PRICE);
	// 	let priceArray = price.split(",");
	// 	//计算兵力总和
	// 	for (let i = 0; i < this.teamGeneralData.length; i++) {
	// 		let data = this.teamGeneralData[i];
	// 		if (data.generalId > 0) {
	// 			let genVo = GeneralModel.getOwnGeneral(data.generalId) as GeneralVo;
	// 			let armyType = genVo.getGeneralArmyType();
	// 			let subTroop: number = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER) - data.minSoldierTotalCount;
	// 			if (subTroop < 0) continue;
	// 			let level = MainMapModel.getSoliderBuildLvByType(armyType)//读取建筑等级
	// 			gold += Number(priceArray[level] ? priceArray[level].split("_")[1] : priceArray[priceArray.length - 1].split("_")[1]) * (subTroop / ConstUtil.getValue(IConstEnum.TRAIN_ARMY_UNIT));
	// 		}
	// 	}
	// 	return gold;
	// }

	/**武将带兵血量缺口 */
	public getFillHpCostGold() {
		let armyNumMap = this.getArmyNumMap();
		let cost = 0;
		let priceMap = ConstUtil.getKeyVal(IConstEnum.TROOP_SUPPLYMENT_PRICE);
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			if (data.generalId > 0) {
				let level = MainMapModel.getSoliderBuildLvByType(data.soldierType)//读取建筑等级
				let price = priceMap[level] || 0.031;//单价
				let lostRate = Math.ceil((data.minSoldierMaxCount - data.minSoldierTotalCount) / data.minSoldierMaxCount * 100);
				let cfg = C.ArmyUpTeamConfig[data.level] || C.ArmyUpTeamConfig[1];
				let needFillNum = cfg.armyNum * lostRate;
				if (armyNumMap[data.soldierType] > needFillNum) {
					armyNumMap[data.soldierType] -= needFillNum;
					continue;
				}
				needFillNum -= armyNumMap[data.soldierType];
				armyNumMap[data.soldierType] = 0;
				cost += needFillNum * price / ConstUtil.getValue(IConstEnum.TRAIN_ARMY_UNIT);
			}
		}
		return cost;
	}

	/**判断兵库是否能补满兵*/
	// public isSoliderStorageFull(): boolean {
	// 	let armyNumMap = this.getArmyNumMap();
	// 	for (let i = 0; i < this.teamGeneralData.length; i++) {
	// 		let data = this.teamGeneralData[i];
	// 		if (data.generalId > 0) {
	// 			let level = MainMapModel.getSoliderBuildLvByType(data.soldierType)//读取建筑等级
	// 			let lostRate = Math.ceil((data.minSoldierMaxCount - data.minSoldierTotalCount) / data.minSoldierMaxCount * 100);
	// 			let cfg = C.ArmyUpTeamConfig[data.level] || C.ArmyUpTeamConfig[1];
	// 			let needFillNum = cfg.armyNum * lostRate;;
	// 			armyNumMap[data.soldierType] -= needFillNum;
	// 			if (armyNumMap[data.soldierType] < 0) return false;
	// 		}
	// 	}
	// 	return true;
	// }
	/**兵营有剩余兵力 可补兵 */
	public isSoliderCanFill(): boolean {
		for (let i = 0; i < this.teamGeneralData.length; i++) {
			let data = this.teamGeneralData[i];
			if (data.generalId > 0) {
				if (data.minSoldierMaxCount - data.minSoldierTotalCount > 0 && TeamModel.getTroopsInfo(data.soldierType).num > 0) return true;
			}
		}
		return false;
	}

	/**获得兵营兵力 拷贝 */
	private getArmyNumMap() {
		let armyNumMap = {
			[SoldierMainType.FOOTSOLDIER]: TeamModel.getTroopsInfo(SoldierMainType.FOOTSOLDIER).num,
			[SoldierMainType.RIDESOLDIER]: TeamModel.getTroopsInfo(SoldierMainType.RIDESOLDIER).num,
			[SoldierMainType.ARROWSOLDIER]: TeamModel.getTroopsInfo(SoldierMainType.ARROWSOLDIER).num,
			[SoldierMainType.PIKEMAN]: TeamModel.getTroopsInfo(SoldierMainType.PIKEMAN).num,
		}
		return armyNumMap;
	}

	public onDestroy() {
	}
}