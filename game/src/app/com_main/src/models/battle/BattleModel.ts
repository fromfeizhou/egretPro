/** 战场数据管理 */
class BattleModel {
	//===== 当前战斗信息
	/**当前战斗ID 玩家正在参与的战斗 */
	private static joinedBattleId: number;
	/** 当前玩家相关的所有战斗 BattleInfoVo */
	private static battleInfos: BattleInfoVo[];
	/**战场地图 */
	private static mapId: number;
	/**战场单位 UnitInfoVo */
	private static units: UnitInfoVo[];
	/**是否已经进入地图，还没进入地图，不用清缓存 */
	public static alreadyDestroy: boolean;
	/**进攻方 总的最大血量 */
	private static atkAllMaxBlood: number;
	/**防守方 的最大血量 */
	private static defAllMaxBlood: number;

	/**进攻方 总血量 */
	private static atkBlood: number;
	/**防守方 总血量 */
	private static defBlood: number;

	// private static isAutoUseSkill:boolean;
	/**放技能时是否暂停游戏 */
	private static isStopPlay: boolean;
	/**游戏是否暂停 */
	private static isBattleStop: boolean;
	/**战斗开始时间 */
	private static battleStartTime: number;
	/**是否观战 */
	private static isObserver: boolean;

	//城池id
	public static cityId: number = 0;

	//是否排队
	public static isQuene: boolean = false;

	//攻城战信息
	public static siegeInfo: ItfSiegeBase;

	//攻方英雄死亡列表
	public static m_generalDieList: number[][];
	public static m_isPlayGeneralDieList: boolean[];

	/**小兵死亡列表 */
	public static m_soldierDieList: number[];

	//战斗类型的自动状态
	public static warAutoList: any[] = [];
	/**
	 * 攻守方信息列表
	 */
	public static m_playerInfoList: { attOrDef: FactionType, name: string, country: number }[]

	//buff列表
	public static m_buffList: gameProto.IBuffData[];

	public static m_isGuideBattle: boolean;

	//战场所有兵种
	public static m_allSoldierType: number[];

	//是否进行战斗重连
	private static m_isReConnectBattle: boolean;

	//队伍站位兵种信息
	private static m_posInfo;

	//战场内所有模型id
	private static m_modelList: string[];

	public static init() {
		this.units = [];
		this.battleInfos = [];
		this.joinedBattleId = 0;
		this.mapId = 0;

		this.atkAllMaxBlood = 0;
		this.defAllMaxBlood = 0;

		this.atkBlood = -1;
		this.defBlood = -1;

		this.isStopPlay = false;
		this.isObserver = false;
		this.isQuene = false;
		this.siegeInfo = null;

		this.m_generalDieList = [];
		this.m_generalDieList[FactionType.ATK] = [];
		this.m_generalDieList[FactionType.DEF] = [];

		this.m_isPlayGeneralDieList = [];
		this.m_isPlayGeneralDieList[FactionType.ATK] = false;
		this.m_isPlayGeneralDieList[FactionType.DEF] = false;
		// this.warAutoList = [];

		this.m_playerInfoList = [];
		this.m_soldierDieList = [];
		this.m_buffList = [];

		this.m_isGuideBattle = false;
		this.m_allSoldierType = [];

		this.m_posInfo = [];
		this.m_posInfo[FactionType.ATK] = [];
		this.m_posInfo[FactionType.DEF] = [];

		this.m_modelList = [];
	}

	public static clear() {

		if (this.alreadyDestroy) {
			this.alreadyDestroy = false;
			return;
		}

		debug("BattleModel:clear-------->>");
		this.clearJoin();
		this.init();
	}

	/**清除当前玩家集结信息 */
	public static clearJoin() {
		BattleModel.setJoinedBattleId(0);
		this.isObserver = false;
		this.isQuene = false;
		this.siegeInfo = null;
	}

	/**设置当前玩家正在参与的战斗id */
	public static setJoinedBattleId(id: number) {
		debug("BattleModel:setJoinedBattleId--->>", id);
		this.joinedBattleId = id || 0;
		if (this.battleInfos[this.joinedBattleId]) {
			// com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_CHECK_LEVELID,this.battleInfos[this.joinedBattleId].checkPointId);
		}

	}
	//获取当前玩家正在参与的战斗id(表id)
	// public static getJoinedBattleCfgId(){
	// 	if(this.battleInfos[this.joinedBattleId]){
	// 		return this.battleInfos[this.joinedBattleId].checkPointId;
	// 	}else{
	// 		return -1;
	// 	}
	// }

	/**
	 * 获取当前玩家正在参与的战斗id
	 */
	public static getJoinedBattleId() {
		return this.joinedBattleId;
	}

	/**
	 * 获取当前玩家正在参与的战斗信息
	 */
	public static getJoinedBattleInfo() {
		if (!this.battleInfos || !this.joinedBattleId) {
			return null;
		}
		return this.battleInfos[this.joinedBattleId];
	}

	/**
	 * 获取所有战斗信息
	 */
	public static getBattleInfos() {
		return this.battleInfos;
	}

	/**
	 * 添加战斗信息
	 */
	public static addBattleInfo(info: BattleInfoVo) {
		this.battleInfos[info.battleId] = info;
		// this.setOwnFaction();
	}

	/**
	 * 移除战斗信息
	 */
	public static removeBattleInfo(battleid: number) {
		let info = this.getBattleInfo(battleid);
		if (info) info.onDestroy();
		this.battleInfos[battleid] = null;
		delete this.battleInfos[battleid];
	}

	/**
	 * 获取战斗信息
	 */
	public static getBattleInfo(battleid?: number): BattleInfoVo {
		if (isNull(battleid)) {
			battleid = this.getJoinedBattleId();
		}
		return this.battleInfos[battleid];
	}


	// public static getCheckPointID(battleid?: number): number {
	// 	let battleinfo: BattleInfoVo = this.getBattleInfo(battleid);
	// 	if (battleinfo) return battleinfo.checkPointId;
	// 	return 0;
	// }

	/**战斗是否已经开始了 做3秒钟兼容处理*/
	public static getIsAleardyCurBattle() {
		let battleInfo: BattleInfoVo = BattleModel.getJoinedBattleInfo();
		return battleInfo ? battleInfo.continueTime >= 3 : true;
	}

	/**获取战斗关卡类型 */
	public static getCheckPointType(battleid?: number): CheckPointType {
		let battleVo = this.getBattleInfo(battleid);
		if (battleVo) {
			return battleVo.warType;
		} else {
			return CheckPointType.CITY_WAR;
		}
	}

	/**当前战场是否攻城战 */
	public static isCityWar() {
		let boo = BattleModel.getCheckPointType() == CheckPointType.NEW_CITY_WAR || BattleModel.getCheckPointType() == CheckPointType.CROSS_SERVER;
		return boo;
	}

	/**战场地图 */
	public static getMapId() {
		return this.mapId;
	}

	/**战场地图 */
	public static setMapId(id: number) {
		this.mapId = id;
		debug('BattleModel:setMapId-------->>', id);
	}

	/**战场单位 UnitInfo  */
	public static getUnits() {
		return this.units;
	}

	// /**自动战斗  */
	// public static setAutoUseSkill(isAuto) {
	// 	this.isAutoUseSkill = isAuto;
	// }

	// /**自动战斗  */
	// public static getAutoUseSkill() {
	// 	return this.isAutoUseSkill;
	// }

	// /**是否观战  */
	// public static setIsObserve(isBserve) {
	// 	this.isObserver = isBserve;
	// }

	public static getIsObserve() {
		if (this.joinedBattleId == 0) {
			return false;
		} else if (this.getPlayerName(FactionType.ATK) != RoleData.nickName && this.getPlayerName(FactionType.DEF) != RoleData.nickName) {
			return true;
		} else {
			return false;
		}
	}

	//zb
	public static addUnit(unit: UnitInfoVo) {
		debugBatt('BattleModel:addUnit-------->>', unit.elementId, this.getTypeName(unit.type), "  武将名字=", unit.generalName, "  hp=", unit.getHp(), "hp上限:", unit.getMaxHp());
		this.units[unit.elementId] = unit;
		// if (unit.faction == FactionType.ATK) {
		// 	// this.atkAllBlood += unit.getHp();
		// 	this.atkAllMaxBlood += unit.getMaxHp();
		// } else if (unit.faction == FactionType.DEF) {
		// 	// this.defAllBlood += unit.getHp();
		// 	this.defAllMaxBlood += unit.getMaxHp();
		// }
	}

	/**获取 某种类型的 战场单位 UnitInfo  */
	public static getUnitListType(type: UnitType, faction?: FactionType) {
		let unitList: UnitInfoVo[] = [];
		for (let i in this.units) {
			let unit = this.units[i];
			if (unit.type == type) {
				if (unit.faction && unit.faction == faction) {
					unitList.push(unit);
				} else if (!faction) {
					unitList.push(unit);
				}

			}
		}
		return unitList;
	}

	public static removeUnit(unitid: number) {
		let vo = this.getUnit(unitid);
		if (vo) {

			// if (Utils.isGeneral(vo.type)) {
			// 	com_main.EventMgr.dispatchEvent(UnitNav.SQUARE_REMOVE, vo);
			// 	debug('BattleModel:removeUnit-------->> SQUARE_REMOVE uid:', unitid);
			// } else if (Utils.isBuild(vo.type)) {
			// 	debug('BattleModel:removeUnit-------->> 删除建筑数据', unitid);
			// } else {
			// 	debug('BattleModel:removeUnit-------->>', unitid);
			// }

			this.units[unitid] = null;
			delete this.units[unitid];

		}
	}

	/**id 可为空 */
	public static getUnit(id: number, type?: UnitType): UnitInfoVo {
		// if (!this.units) return null;
		if (type != undefined) {
			for (let key in this.units) {
				if (this.units.hasOwnProperty(key)) {
					let unitvo = this.units[key];
					if (unitvo.type == type) {
						if (id != undefined) {
							if (unitvo.elementId == id) return unitvo;
						} else {
							return unitvo;
						}
					}
				}
			}
		}
		return this.units[id];
	}

	/**根据战斗单位类型获取战斗单位 */
	public static getUnitsByType(type: UnitType) {
		let datas: UnitInfoVo[] = [];
		if (!this.units) return datas;
		for (let key in this.units) {
			if (this.units.hasOwnProperty(key)) {
				let unitvo = this.units[key];
				if (unitvo.type == type) {
					datas.push(unitvo);
				}
			}
		}
		return datas;
	}

	/**根据id,faction获取unit*/
	public static getUnitByFaction(id: number, faction: FactionType) {
		let unit: UnitInfoVo = this.getUnit(id);
		if (unit) return unit.faction == faction ? unit : null;
		return null;
	}

	/**根据faction获取unit*/
	public static getUnitsByFaction(faction: FactionType) {
		let units: UnitInfoVo[] = [];
		for (let key in this.units) {
			if (this.units.hasOwnProperty(key)) {
				let unitvo = this.units[key];
				if (unitvo.faction == faction) {
					units.push(unitvo);
				}
			}
		}
		return units;
	}

	/**攻城战矫正血量 */
	public static setLastHp(battleid: number, atkHp: number,defHp: number){
		if(battleid == this.getJoinedBattleId()){
			this.atkBlood = atkHp;
			this.defBlood = defHp;
		}
	}

	public static setAtkAllMaxBlood(maxHp: number) {
		this.atkAllMaxBlood = maxHp;
	}

	public static getAtkAllMaxBlood() {
		return this.atkAllMaxBlood;
	}

	public static getAtkAllBlood() {
		if(this.atkBlood > -1){
			return this.atkBlood;
		}

		let blood = 0;
		for (let i in this.units) {
			let unit = this.units[i];
			if (unit.faction == FactionType.ATK) {
				blood += unit.getHp();
			}
		}
		return blood;
	}

	public static setDefAllMaxBlood(maxHp: number) {
		this.defAllMaxBlood = maxHp;
	}

	public static getDefAllMaxBlood() {
		return this.defAllMaxBlood;
	}

	public static getDefAllBloodd() {
		if(this.defBlood > -1){
			return this.defBlood;
		}

		let blood = 0;
		for (let i in this.units) {
			let unit = this.units[i];
			if (unit.faction == FactionType.DEF) {
				blood += unit.getHp();
			}
		}
		return blood;
	}

	public static setIsStopPlay(bool: boolean) {
		this.isStopPlay = bool;
	}

	public static getIsStopPlay() {
		return this.isStopPlay;
	}

	// public static setBattleStartTime(time: number) {
	// 	this.battleStartTime = time;
	// }
	// public static getBattleStartTime() {
	// 	return this.battleStartTime;
	// }

	public static addGeneralDie(faction: FactionType, roleId) {
		this.m_generalDieList[faction].push(roleId);
		this.playGeneralDie(faction);
	}
	public static playGeneralDieComplete(faction: FactionType) {
		this.m_isPlayGeneralDieList[faction] = false;
		this.m_generalDieList[faction].splice(0, 1);
		this.playGeneralDie(faction);
	}
	public static playGeneralDie(faction: FactionType) {
		if (!this.m_isPlayGeneralDieList[faction] && this.m_generalDieList[faction].length > 0) {
			this.m_isPlayGeneralDieList[faction] = true;
			com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_PLAY_GENGERAL_DIE, { faction: faction, roleId: this.m_generalDieList[faction][0] });
		}
	}


	public static getUnitNameUnitId(unitId) {
		let unitInfoVo = BattleModel.getUnit(unitId);
		if (!unitInfoVo) {
			error("获取不到单位 unitInfoVo ~~~~~~~~~~~~~", unitId);
			return;
		}

		let name = "";
		if (unitInfoVo.type == UnitType.BUILDING_BARTIZAN) {
			name = GCode(CLEnum.WAR_BARTIZAN);
		}
		else if (unitInfoVo.type == UnitType.BUILDING_WALL) {
			name = GCode(CLEnum.WAR_WALL);
		} else {

		}

		return name;
	}

	public static getTypeName(type: UnitType): string {
		let name = "";
		if (type == UnitType.BUILDING_BARTIZAN) {
			name = GCode(CLEnum.WAR_BARTIZAN);
		} else if (type == UnitType.BUILDING_WALL) {
			name = GCode(CLEnum.WAR_WALL);
		} else if (type == UnitType.GENERAL) {
			name = GCode(CLEnum.WAR_GEN);
		} else if (type == UnitType.SOLDIER) {
			name = GCode(CLEnum.WAR_SOLDIER);
		} else if (type == UnitType.ZHAO_HUAN_WU) {
			name = GCode(CLEnum.WAR_ZHW);
		}

		return name;
	}

	/**初始化自动战斗 */
	public static setWarAutoList(body: gameProto.IS2C_WAR_AUTO_LIST) {
		let list = body.list;
		for (let state of list) {
			this.warAutoList[state.warType] = state.autoState;
		}

		for (let i in C.WarTypeConfig) {
			let config = C.WarTypeConfig[i];
			let id = config["id"];
			if (isNull(this.warAutoList[id])) {
				this.warAutoList[id] = config["initAuto"];
			}
		}
	}

	public static getAutoState() {
		let battleType = this.getCheckPointType(this.joinedBattleId);
		return this.warAutoList[battleType]
	}

	public static setAutoState(autoState: boolean) {
		let battleType = this.getCheckPointType(this.joinedBattleId);
		this.warAutoList[battleType] = autoState;
	}

	public static setPlayerName(info: { attOrDef: FactionType, name: string, country: number }) {
		this.m_playerInfoList[info.attOrDef] = info;
	}

	public static getPlayerName(faction: FactionType) {
		let name = '';
		this.m_playerInfoList[faction] ? name = this.m_playerInfoList[faction].name : name = '';
		return name;
	}

	public static getBelongTypeById(elementId: number): BelongType {
		let unit: UnitInfoVo = this.getUnit(elementId);
		if (!unit) {
			return BelongType.OWN;
		}
		return BattleModel.getBelongTypeByFaction(unit.faction);
	}

	public static getBelongTypeByFaction(faction: FactionType): BelongType {
		if (this.getCheckPointType() == CheckPointType.GM) {
			if (faction == FactionType.ATK) {
				return BelongType.OWN;
			} else {
				return BelongType.ENEMY;
			}
		}

		let playerInfo = this.m_playerInfoList[faction];
		if (!playerInfo) {
			return BelongType.OWN;
		}
		if (playerInfo.name == RoleData.nickName) {
			return BelongType.OWN;
		} else {
			if (BattleModel.getCheckPointType() == CheckPointType.NEW_CITY_WAR) {
				if (playerInfo.country == RoleData.countryId) {
					return BelongType.OWN;
				}
			}
			return BelongType.ENEMY;
		}
	}

	//逃跑士兵
	public static addSoldierDie(id: number) {
		this.m_soldierDieList.push(id);
	}

	public static isSoldierDie(id: number) {
		for (let dieId of this.m_soldierDieList) {
			if (id === dieId) {
				return true;
			}
		}
		return false;
	}

	public static addBuff(buffData: gameProto.IBuffData) {
		this.m_buffList[buffData.buffId] = buffData;
	}

	public static getBuff(id: number) {
		return this.m_buffList[id];
	}

	public static addSoldierType(type: SoldierMainType) {
		let isExist = false;
		for (let t of this.m_allSoldierType) {
			if (type == t) isExist = true;
		}
		if (!isExist) this.m_allSoldierType.push(type);
	}

	public static getSoldierType() {
		return this.m_allSoldierType;
	}

	/**获取战斗预加载资源列表 */
	public static getPreDownload(): string[] {
		let group: string[] = [];
		let modelList: number[] = [];
		for (let i in this.units) {
			let unit = this.units[i];
			if (unit.type == UnitType.GENERAL && unit.belongType == BelongType.OWN) {
				let generalConfig: GeneralConfig = C.GeneralConfig[unit.generalId];
				if (generalConfig) {
					let skillid = Number(generalConfig.angerSkill.split("_")[0]);;
					let skillRes = C.ShowSkillEffectConfig[C.SkillConfig[skillid].skillEffectId].animation;
					if (group.indexOf(skillRes) == -1) {
						group.push(skillRes);
					}
				}
			}

			if (unit.generalModelId && modelList.indexOf(unit.generalModelId) == -1) {
				modelList.push(unit.generalModelId);
			}
		}

		this.m_modelList = [];
		for (let modelId of modelList) {
			this.m_modelList.push('soldier_' + modelId + '_png');
			this.m_modelList.push('soldier_' + modelId + '_json');
		}
		let modelResGroup = RES.createGroup('modelId', this.m_modelList, true);
		group.push('modelId');

		return group;
	}


	//是否进行战斗重连
	public static set isReConnectBattle(bool: boolean) {
		this.m_isReConnectBattle = bool;
	}

	public static get isReConnectBattle() {
		return this.m_isReConnectBattle;
	}

	public static setPosInfo(fT: FactionType, pos: number, gt: number, gId: number) {
		this.m_posInfo[fT][pos] = [gt, gId];
	}

	// 获取克制关系
	public static getKZ(pos: number) {
		if (!this.m_posInfo[FactionType.ATK][pos]) return;
		if (!this.m_posInfo[FactionType.DEF][pos]) return;
		let tA = this.m_posInfo[FactionType.ATK][pos][0];
		let tD = this.m_posInfo[FactionType.DEF][pos][0];
		if (tA && tD) {
			if ((tA == SoldierMainType.FOOTSOLDIER && tD == SoldierMainType.PIKEMAN) ||
				(tA == SoldierMainType.PIKEMAN && tD == SoldierMainType.RIDESOLDIER) ||
				(tA == SoldierMainType.RIDESOLDIER && tD == SoldierMainType.FOOTSOLDIER)) {
				return 1;
			}

			if ((tA == SoldierMainType.FOOTSOLDIER && tD == SoldierMainType.RIDESOLDIER) ||
				(tA == SoldierMainType.PIKEMAN && tD == SoldierMainType.FOOTSOLDIER) ||
				(tA == SoldierMainType.RIDESOLDIER && tD == SoldierMainType.PIKEMAN)) {
				return 2;
			}
		}
	}

	// 获取克制关系
	public static getKZGen(pos: number): [number, number] {
		let type = this.getKZ(pos)
		if (type) {
			return [type, this.m_posInfo[FactionType.ATK][pos][1]];
		}
		return [0, 0];
	}

	public static getModelList() {
		return this.m_modelList;
	}

	//退出跳转
	public static exitBattle(type) {
		SceneManager.runSceneBefore();
		let battleType = type;
		if (battleType == CheckPointType.ARENA) {
			//擂台
			Utils.open_view(TASK_UI.POP_ARENA_PANEL);
		} else if (battleType == CheckPointType.PK) {
			Utils.open_view(TASK_UI.POP_PVPARENA_PANEL);
		}
		else if (battleType == CheckPointType.CHECKPOINT) {
			HeadQuartersProxy.send_HQ_GET_INFO_OPEN_VIEW();
		} else if (battleType == CheckPointType.HISTORY_WAR) {
			Utils.open_view(TASK_UI.HISTORYWAR_MAIN_PANEL);
		} else if (battleType == CheckPointType.BOSS) {
			//BOSS
			BossProxy.C2S_GET_BOSS_OPEN_VIEW();
		}
		else if (battleType == CheckPointType.MATERIAL) {
			//材料副本
			if (MaterialModel.isSweep) {
				MaterialProxy.C2S_MATERIAL_INFO();
			} else {
				MaterialProxy.C2S_MATERIAL_INFO_OPEN();
			}
		}
	}

	public static exitWatchBattle(cityId?: number) {
		//退出观战
		if (cityId) {
			WorldProxy.send_C2S_CITY_WAR_OUT(cityId);
		}
		BattleProxy.send_C2S_WAR_QUIT_BATTLE();
		
		SceneManager.runSceneBefore();

		// let conf: WorldMapConfig = C.WorldMapConfig[cityId];
		// if (BattleModel.isQuene) {
		// 	if (conf&&conf.mapId == SceneEnums.WORLD_XIANGYANG_CITY) {
		// 		WorldModel.gotoWorldScene(SceneEnums.WORLD_XIANGYANG_CITY);
		// 	} else {
		// 		WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY);
		// 	}
		// }
		// else {
		// 	let battleType: CheckPointType = BattleModel.getCheckPointType(BattleModel.getJoinedBattleId());
		// 	if (battleType == CheckPointType.NEW_CITY_WAR || battleType == CheckPointType.FIGHT_WILD || battleType == CheckPointType.CITY_VISIT || battleType == CheckPointType.UNLOCK_WAR) {
		// 		if (conf&&conf.mapId == SceneEnums.WORLD_XIANGYANG_CITY) {
		// 			WorldModel.gotoWorldScene(SceneEnums.WORLD_XIANGYANG_CITY);
		// 		} else {
		// 			WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY);
		// 		}
		// 	} else {
		// 		// SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
		// 		SceneManager.runSceneBefore()
		// 	}
		// 	BattleProxy.send_C2S_WAR_QUIT_BATTLE();
		// }
	}

	public static challengeNext(battleType: CheckPointType, curId?: number) {
		if (battleType == CheckPointType.ARENA) {
			ArenaProxy.send_ENTER_ARENA_BATTLE(1);
			com_main.UpManager.history();
		} else if (battleType == CheckPointType.CHECKPOINT) {
			let nextId = HeadQuartersModel.getNextId(curId);
			if (nextId && HeadQuartersModel.canChallenges(nextId)) {
				HeadQuartersProxy.send_HQ_CHALLENGES(nextId, 1);
				com_main.UpManager.history();
			} else {
				EffectUtils.showTips('无法挑战下一关', 1, true);
				return;
			}
		}
	}

}