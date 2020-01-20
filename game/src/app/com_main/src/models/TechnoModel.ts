/**常规效果类型 */
enum NorEffType {
	/**粮食 */
	FOOT = 1001,
	/**伐木 */
	WOOD = 1018,
	/** 铁矿 */
	IRON = 1019,

	/**训练士兵 */
	SOLDIER = 2001,

	/**步兵 */
	SOLDIER_BB = 3001,
	/**弓兵 */
	SOLDIER_GB = 3002,
	/**骑兵 */
	SOLDIER_QB = 3003,

	/**猛将 */
	GENERAL_MJ = 4001,
	/**豪杰 */
	GENERAL_HJ = 4002,
	/**军师 */
	GENERAL_JS = 4003,
}
/** 生成加成 */
enum NEProduceEnum {
	/**产量加成 */
	ADDITION = 1,
	/**容量加成 */
	VOLUME = 2,
	/**生成加速（配置单位时间减少） */
	TIME = 3,
}

/**练兵加成 */
enum NESoldierEnum {
	/**减少训练时间 */
	TIME = 1,
	/**减少训练价格 */
	PRICE = 2,
	/**单次练兵最大数量 */
	VOLUME = 3,
}


enum TechnoType {
	SOLDIER_BB = 1,	//步兵
	SOLDIER_GB = 2,	//弓兵
	SOLDIER_QIB = 3,	//骑兵
	SOLDIER_QB = 6,	//枪兵
	PRODUCE = 4,	//生产
	ASSIST = 5,		//辅助
}

class TechnoModel {
	private static technoList: { [key: number]: TechnoVo };	//科技节点
	private static _timeData: gameProto.ITechnologyUpgradeState;

	private static set timeData(data: gameProto.ITechnologyUpgradeState) {
		this._timeData = data;
	}

	private static get timeData() {
		return this._timeData;
	}

	public static init() {
		this.initTechnoList();
	}

	/**数据清理 */
	public static clear() {
		this.removeTimer();
		this.technoList = null;
		this.timeData = null;
	}

	/**解析服务器数据 */
	public static parseTechnoList(data: gameProto.ITechnology[]) {
		for (let i = 0; i < data.length; i++) {
			let vo = this.getTechVoById(data[i].id);
			if (vo) vo.update(data[i]);
		}
	}

	/**更新数据 */
	public static updateTechnoInfo(data: gameProto.ITechnology) {
		let vo = this.getTechVoById(data.id);
		if (vo) vo.update(data);
	}

	/**获得科技节点 */
	public static getTechVoById(id: number) {
		let vo = this.technoList[id];
		if (vo) vo.init();
		return this.technoList[id];
	}

	/**获得科技数据列表 */
	public static getTechVosByType(type: TechnoType) {
		let res: TechnoVo[] = [];
		for (let id in this.technoList) {
			let vo = this.technoList[id];
			if (vo.type == type) res.push(vo);
		}
		return res;
	}

	//=============================================================================================================================================
	//倒计时 begin
	//============================================================================================================================================= 
	/**解析升级倒计时 */
	public static parseTimeData(timeData: gameProto.ITechnologyUpgradeState) {
		let isClear = false;
		if (!timeData || (timeData.end - timeData.speed - timeData.start) <= 0) isClear = true;
		if (isClear) {
			this.removeTimer();
		} else {
			this.timeData = timeData;
			this.startTimer();
		}
	}

	/**升级中 */
	public static isInLevelCd() {
		if (this.timeData) return true;
		return false;
	}

	/**升级中 */
	public static isInUpLv(id: number) {
		if (this.timeData && this.timeData.id == id) return true;
		return false;
	}

	/**获得等级倒计时 */
	public static getTimeData() {
		return this.timeData;
	}

	public static startTimer() {
		Utils.TimerManager.remove(this.timeCallback, this);
		Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
		com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.timeData.id);
	}

	public static removeTimer() {
		if (this.timeData && this.timeData.id > 0) {
			let id = this.timeData.id;
			TechnologyProxy.C2S_TECHNOLOGY_INFO(this.timeData.id);
			this.timeData = null;
			com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, id);
		}
		Utils.TimerManager.remove(this.timeCallback, this);
	}

	/**升级倒计时 */
	public static timeCallback() {
		let time = TimerUtils.getServerTime();
		if (time >= (this.timeData.end+5- this.timeData.speed)) {
			this.removeTimer();
		}
	}

	//=============================================================================================================================================
	//倒计时 end
	//============================================================================================================================================= 


	//=============================================================================================================================================
	//配置表
	//============================================================================================================================================= 
	/**科技图标 */
	public static getIcon(id: number) {
		let cfg = C.TechnologyConfig[id]
		let name = `${cfg.icon}_png`
		return Utils.GetResName(name, 'icon_node_png');
	}

	/**初始化科技节点 */
	private static initTechnoList() {
		this.technoList = {};

		for (let key in C.TechnologyConfig) {
			let data = C.TechnologyConfig[key];
			if (unNull(data)) {
				let vo = TechnoVo.create({ id: Number(key), level: 0 });
				this.technoList[vo.id] = vo;
			}
		}
	}

	/**获得科技等级配置表 */
	public static getTechnoLvCfg(id: number, level: number): TechnologyLevelConfig {
		if (C.TechnologyLevelConfigDic[id]) {
			return C.TechnologyLevelConfigDic[id][level];
		}

	}

	/**获得科技等级效果描述 */
	public static getTechnoEffDesc(effStr: string) {
		let attris = StringUtils.keyValsToNumberArray(effStr);
		if (attris.length > 0) {
			let data = attris[0];
			let cfg = C.TechnologyEffectConfig[data.key];
			if (cfg.valType == 1) {
				let rate = data.value / 100;
				`${GLan(cfg.effectDesc)}：${rate}%`;
			} else {
				return `：${data.value}`;
			}
		}
		return '';
	}


	/**红点判断 */
	public static canUpLevel(type?: TechnoType, id: number = 0): boolean {
		// return false;
		if (this.isInLevelCd()) return false;
		if (isNull(type)) {
			// 全部遍历
			for (let id in this.technoList) {
				let vo = this.technoList[id];
				if (vo.canUpLevel()) return true;
			}
		} else {
			if (id == 0) {
				//单类型遍历
				let list = this.getTechVosByType(type);
				for (let i in list) {
					let vo = list[i];
					if (vo.canUpLevel() && !(this.isInUpLv(vo.id))) return true;
				}
			}
			else {
				let vo = this.getTechVoById(id);
				if (vo) return vo.canUpLevel();

			}
		}
		return false;
	}
	//=============================================================================================================================================
	//配置表
	//============================================================================================================================================= 

	//=============================================================================================================================================
	//常规效果类型 begin
	//============================================================================================================================================= 
	/**
	 * @param baseVal 基础值
	 * @param mainType 科技主类型
	 * @param subType 科技子类型
	 */
	public static getTechnoNorEffVal(baseVal:number,mainType: NorEffType, subType: NEProduceEnum | NESoldierEnum | AttriType) {
		let value = baseVal;
		for (let id in this.technoList) {
			let vo = this.technoList[id];
			if (vo.level > 0 && vo.addMainType == mainType && vo.addSubType == subType) {
				value = vo.addValType == 0 ?  (value  + vo.addValue) : Math.floor(value + value * vo.addValue);
			}
		}
		return value;
	}
	//=============================================================================================================================================
	//常规效果类型 end
	//============================================================================================================================================= 


}