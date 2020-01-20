enum FateStatus {
	/** 未激活*/
	NOT_ACTIVE = 0,
	/** 已经激活*/
	FINISH_ACTIVE = 1,
	/** 能激活*/
	CAN_ACTIVE = 2,
}
enum FateTriggerType {
	/**武将 */
	GENERAL = 1,
	TEAM = 2,
}
class FateModel {
	private static generalFateVoList: { [generalId: number]: { [relationId: number]: FateVo } };	//武将和缘分映射当前这种类型进行的缘分
	private static generlFateCfgList: { [generalId: number]: { [relationId: number]: RelationConfig[] } }//武将和缘分映射当前这种类型配置;
	private static generlFateCfgGeneralList: { [generalId: number]: number[] } //武将和缘分映射关联的武将列表
	private static fateVoActiveList: number[]//已激活列表
	private static fateTypeCurLevelDic: { [relationId: number]: number }//当前这种缘分已经激活到的等级
	public static isFirstEnter: boolean = true;
	public static init() {
		this.initFateCfg();
	}

	/**数据清理 */
	public static clear() {
		this.generalFateVoList = null;
		this.generlFateCfgGeneralList = null;
		this.generlFateCfgList = null;
	}


	/**初始化缘分 */
	private static initFateCfg() {
		this.generalFateVoList = {};
		this.fateTypeCurLevelDic = {};
		this.generlFateCfgList = {};
		this.generlFateCfgGeneralList = {};
		for (let key in C.RelationConfig) {
			let data = C.RelationConfig[key];
			if (unNull(data) && unNull(data.generalId) && unNull(data.triggerType == FateTriggerType.GENERAL)) {
				if (isNull(this.generlFateCfgList[data.generalId])) {
					this.generlFateCfgList[data.generalId] = {};
					this.generalFateVoList[data.generalId] = {}
				}
				if (isNull(this.generlFateCfgList[data.generalId][data.relationId])) {
					this.generlFateCfgList[data.generalId][data.relationId] = [];
					this.generalFateVoList[data.generalId][data.relationId] = FateVo.create(data.id);;
				}
				this.generlFateCfgList[data.generalId][data.relationId].push(data);
				//关联武将map
				if (data.triggerParameter) {
					if (isNull(this.generlFateCfgGeneralList[data.generalId]))
						this.generlFateCfgGeneralList[data.generalId] = [];
					let triggerParameter: string[] = data.triggerParameter.split(",");
					for (let index = 0; index < triggerParameter.length; index++) {
						let triggerArr: string[] = triggerParameter[index].split("_");
						if (data.generalId == Number(triggerArr[0])) {
							continue;
						}
						if (this.generlFateCfgGeneralList[data.generalId].indexOf(Number(triggerArr[0])) == -1)
							this.generlFateCfgGeneralList[data.generalId].push(Number(triggerArr[0]))
						if (isNull(this.generlFateCfgGeneralList[Number(triggerArr[0])])) {
							this.generlFateCfgGeneralList[Number(triggerArr[0])] = [];
						}
						if (this.generlFateCfgGeneralList[Number(triggerArr[0])].indexOf(data.generalId) == -1)
							this.generlFateCfgGeneralList[Number(triggerArr[0])].push(data.generalId);
					}
				}

			}
		}
	}



	/**获得武将缘分列表显示数据 每一种类型取一条*/
	public static getGeneralFateViewDataByGenId(generlId: number): FateVo[] {
		let fateVoList: FateVo[] = [];
		for (let key in this.generalFateVoList[generlId]) {
			fateVoList.push(this.generalFateVoList[generlId][Number(key)])
		}
		return fateVoList;
	}
	/**检查这个武将是否已经配置了缘分 */
	public static checkGeneralFate(generalId: number): boolean {
		return unNull(this.generlFateCfgList[generalId])
	}
	/**检查武将是否有可激活的缘分 */
	public static checkCanActiveFate(generlId: number): boolean {
		if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_FATE)) return false;
		for (let key in this.generalFateVoList[generlId]) {
			let fateVo: FateVo = this.generalFateVoList[generlId][Number(key)];
			if (isNull(fateVo)) continue;
			if (fateVo.status == FateStatus.CAN_ACTIVE) return true;
		}
		return false;
	}
	/**更新武将缘分 */
	public static updateSingleGeneralFateStatus(generalId: number) {
		for (let key in this.generlFateCfgList[generalId]) {
			let fateVo: FateVo = this.generalFateVoList[generalId][Number(key)];
			if (isNull(fateVo)) {
				let fateTypeCfgList: RelationConfig[] = this.generlFateCfgList[generalId][Number(key)];
				fateTypeCfgList.sort(this.sortByLevel);
				let curId: number = fateTypeCfgList[0].id;
				if (unNull(this.fateTypeCurLevelDic[fateTypeCfgList[0].relationId])) {
					curId = fateTypeCfgList[this.fateTypeCurLevelDic[fateTypeCfgList[0].relationId]].id;
				}
				fateVo = FateVo.create(curId);
			}
			fateVo.updateStatus();//更新状态
			this.generalFateVoList[generalId][Number(key)] = fateVo;
		}
	}
	/**更新关联武将状态 */
	public static updateRelationGeneralStatus(generlId: number) {
		let generlIdList: number[] = this.generlFateCfgGeneralList[generlId];
		if (unNull(generlIdList) && unNull(generlIdList.length > 0)) {
			let len: number = generlIdList.length;
			for (let index = 0; index < len; index++) {
				this.updateSingleGeneralFateStatus(generlIdList[index]);
			}
		}
	}
	public static sortByLevel(p1: RelationConfig, p2: RelationConfig) {
		return p1.level - p2.level;
	}
	/**更新缘分状态 */
	public static updateGneralFateActiveList(data: gameProto.IS2C_RELATION_LIST) {
		this.fateVoActiveList = data.relationList;
		if (unNull(this.fateVoActiveList)) {
			for (let j = 0; j < this.fateVoActiveList.length; j++) {
				this.updateCurFateTypeLevel(this.fateVoActiveList[j])
			}
		}

	}
	/**激活 */
	public static updateActiveList(id: number) {
		if (this.fateVoActiveList.indexOf(id) == -1) {
			this.fateVoActiveList.push(id);
		}

	}
	/*更新当前武将缘分的最高等级*/
	public static updateCurFateTypeLevel(id: number) {
		let fateCfg: RelationConfig = C.RelationConfig[id];
		if (unNull(fateCfg) && unNull(fateCfg.relationId)) {
			this.fateTypeCurLevelDic[fateCfg.relationId] = fateCfg.level;
			//拿到当前这种类型的最大缘分
			let curVo: FateVo = this.generalFateVoList[fateCfg.generalId][fateCfg.relationId];
			let fateTypeCfgList: RelationConfig[] = this.generlFateCfgList[fateCfg.generalId][fateCfg.relationId];
			fateTypeCfgList.sort(this.sortByLevel)
			//取到当前等级的下一个
			let curFateId: number = fateCfg.level == fateTypeCfgList.length ? fateCfg.id : fateTypeCfgList[fateCfg.level].id;
			if (isNull(curVo)) {
				curVo = FateVo.create(curFateId);
			} else {
				curVo.parseData(curFateId);//替换掉id；
			}
			curVo.updateStatus();
			this.generalFateVoList[fateCfg.generalId][fateCfg.relationId] = curVo;
		}
	}
	/**武将更新 更新缘分状态 */
	public static updateGeneralFate(data: gameProto.IGeneralAllResp) {
		let len = data.generalInfo.length;
		if (len == 0) return;
		for (let index = 0; index < len; index++) {
			let genVo: GeneralVo = GeneralModel.getOwnGeneral(data.generalInfo[index].generalId);
			this.updateSingleGeneralFateStatus(data.generalInfo[index].generalId);
		}
	}

	/**当前已激活的最高等级 */
	public static getFateTypeCurLev(relationId: number) {
		return this.fateTypeCurLevelDic[relationId];
	}
	/**当前已激活的最高等级配置 */
	public static getCurFinshActiveFateCfg(id: number) {
		let fateCfg: RelationConfig = C.RelationConfig[id];
		let fateCfgList: RelationConfig[] = this.generlFateCfgList[fateCfg.generalId][fateCfg.relationId];
		//排序
		fateCfgList.sort(this.sortByLevel)
		let curActiveMaxLev = isNull(this.fateTypeCurLevelDic[fateCfg.relationId]) ? 0 : this.fateTypeCurLevelDic[fateCfg.relationId];
		for (let index = 0; index < fateCfgList.length; index++) {
			if (fateCfgList[index].level == curActiveMaxLev) return fateCfgList[index];
		}
		return fateCfgList[0];//还没有记录取第一个
	}
	public static getPrefateCfg(id: number): RelationConfig {
		let fateCfg: RelationConfig = C.RelationConfig[id];
		let fateCfgList: RelationConfig[] = this.generlFateCfgList[fateCfg.generalId][fateCfg.relationId];
		//排序
		fateCfgList.sort((p1: RelationConfig, p2: RelationConfig) => {
			return p2.level - p1.level;
		})
		for (let index = 0; index < fateCfgList.length; index++) {
			if (fateCfgList[index].level < fateCfg.level) return fateCfgList[index];
		}
		return fateCfgList[fateCfgList.length - 1];//取最小
	}
	/**得到当前缘分的下一个缘分星级 */
	public static getNextFateStar(id: number) {
		let fateCfg: RelationConfig = C.RelationConfig[id];
		let param: string = fateCfg.triggerParameter.split(",")[0].split("_")[1]
		return Number(param);
	}
}