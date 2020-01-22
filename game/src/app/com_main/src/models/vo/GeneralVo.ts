class GeneralVo extends BaseClass implements IFObject {
	/**属性值 */
	public static AttriKey: Array<string> = ["generalId", "level", "quality", "treasureId",
		"curExp", "star", "fight", "attributeList", "soldierAttribute", 'skills', 'generalEquipment', 'upgradeLevel'];

	/**武将id */
	public generalId: number;

	/**武将当前等级 */
	public level: number = 0;
	/**武将品质 */
	public quality: number;

	/**宝物id */
	public treasureId: number;

	/**当前经验 */
	public curExp = 0;

	/**当前星数,当前星数为0 表示没这个英雄*/
	public star = 1;

	/**战斗力 */
	public fight: number;
	public attributeList: gameProto.IAttributeValue[];
	/**小兵属性 */
	public soldierAttribute: gameProto.IAttributeValue[];
	/**玩家武将技能列表 */
	public skills: gameProto.IGeneralSkillDto[] = [];
	/**装备 */
	public generalEquipment: gameProto.IGeneralEquipment;
	/**突破 */
	public upgradeLevel: number;
	public upgrageItem: IItemInfo;

	/**=================================================================================================================================
	 * 客户端自定义字段
	 * =================================================================================================================================
	 */
	/**配置表 */
	public config: GeneralConfig;
	/**宝物 */
	public treaVo: TreasureVo;
	private attriRecord: { [key: number]: number };
	private fightRecord: number;

	/**玩家武将碎片 */
	public fragment = 0;

	/**合成需要武将碎片 */
	public needFragment = 0;

	/**初始品级 */
	public qualityLevel = 0;

	/**是否拥有 */
	public isOwn: boolean = false;

	/**武将自身兵种类型 */
	public generalOccupation: number;

	/**武将属性队列 */
	public attriList: { [key: number]: number };

	/**兵种属性队列 */
	public soldAttriList: { [key: number]: number };

	/**武将装备孔信 */
	public equipSlot: { [key: number]: gameProto.IEquipmentSlot }

	/**技能升级碎片 */
	private skillNeedSoul: number[];

	/**城市建设状态 */
	public cityBuildState: CityBuildEnum = CityBuildEnum.FREE;

	public static create(id: number) {
		var obj: GeneralVo = new GeneralVo(id);
		return obj;
	}

	public constructor(id: number) {
		super();
		this.init(id);
	}

	public init(id: number) {
		this.generalId = id;
		this.config = C.GeneralConfig[id] || C.GeneralConfig[1001];
		//初始品级
		this.qualityLevel = this.config.qualityLevel;
		//武将类型
		this.generalOccupation = this.config.generalOccupation;

		this.attriList = StringUtils.keyValsToNumber(this.config.attribute);
		this.soldAttriList = [];
		this.equipSlot = {};
		this.initSkills();
	}

	public setQualityLevel(quality: number) {
		this.qualityLevel = quality;
	}

	public onDestroy() {
	}

	public update(body?: any) {
		/**协议回调是否升级 */
		let isUpLevel = false;
		let isUpStar = false;
		let isUpgrade = false;
		if (this.upgradeLevel >= 0 && this.upgradeLevel != body.upgradeLevel) isUpgrade = true;
		if (this.level > 0 && this.level < body.level) isUpLevel = true;
		if (this.star > 0 && this.star < body.star) isUpStar = true;
		Utils.voParsePbData(this, body, GeneralVo.AttriKey);

		this.skills.sort((a, b) => { return a.sequence - b.sequence });

		//装备信息转换
		this.updateEquipSlot(body['generalEquipment'].slots);

		//属性转换
		for (let i = 0; i < this.attributeList.length; i++) {
			let data = this.attributeList[i];
			this.attriList[data.key] = data.value;
		}
		//兵种属性转换
		for (let i = 0; i < this.soldierAttribute.length; i++) {
			let data = this.soldierAttribute[i];
			this.soldAttriList[data.key] = data.value;
		}
		this.updateTreaVo();
		this.parseTupodanCosume();
		if (isUpLevel) {
			AGame.R.notifyView(TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT, { clientUplvMsg: 1 });

			com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_LEVEL, this.generalId);
		}
		if (isUpStar) {
			com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_STAR, this.generalId);
		}
		if (isUpgrade) {
			com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_TUPODAN, this.generalId);
		}
		com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_ATTRI_CHANGE, this.generalId);
	}

	/**更新属性 */
	public updateAttri(data: gameProto.IGeneralAttribute) {
		this.fight = data.fight;
		for (let i = 0; i < data.allAttribute.length; i++) {
			let attVk = data.allAttribute[i];
			this.attriList[attVk.key] = attVk.value;
		}
		com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_ATTRI_CHANGE, this.generalId);
	}

	/**更新装备孔信息 */
	public updateEquipSlot(data: gameProto.IEquipmentSlot[]) {
		if (!data) return;
		for (let i = 0; i < data.length; i++) {
			this.equipSlot[data[i].id] = data[i];
		}
		com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_IN, this.generalId);
	}

	/**更新装备孔信息 */
	public updateEquipStreng(solt: gameProto.IEquipmentSlot) {
		let data = this.equipSlot[solt.id];
		data.strengthen = solt.strengthen;
		data.grade = solt.grade;
		data.wrought = solt.wrought;
	}


	public set own(_own: boolean) {
		if (this.isOwn == _own) return;
		this.isOwn = _own;
		com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_GET, this.generalId);
	}

	public get own() {
		return this.isOwn;
	}

	//////////////////////////////////////////////////////////////////////////////////

	/**兵种等级配置表 对应主城建筑等级的兵种 */
	public getGeneralArmyConfig(): GeneralSoldierLvConfig {
		let armyType = this.config.armyType;
		let armyCfg = MainMapModel.getSoldierLvCfg(armyType);
		return armyCfg;
	}

	/**获得带兵兵种 */
	public getGeneralArmyType() {
		return this.config.armyType;
	}

	/**强化配置表 */
	// public getGeneralStrengthenConfig(next) {
	// 	return GeneralModel.getGeneralStrengthenConfig(this.quality, this.level, next);
	// }

	/**君主加成表 */
	// public getPlayerLevelConfig() {
	// 	return C.PlayerLevelConfig[RoleData.level];
	// }


	//////////////////////////////////////////////////////////////////////////////////

	/**
	 * 获取武将声效
	 */
	public getGeneralSound() {
		return 0;
		// return this.config.sound;
	}


	/**
	 * 获取武将类型图标状态(小兵)
	 */
	public getGeneralArmyTypeIconState() {
		return GeneralModel.getGeneralArmyTypeIconState(this.generalId);
	}

	/**
	 * 获取武将兵种名称(小兵)
	 */
	public getGeneralArmyTypeName() {
		return GeneralModel.getGeneralArmyTypeName(this.generalId);
	}

	/**
	 * 获取武将兵种模型ID
	 */
	public getGeneralArmyModelId() {
		//zb

		let aconfig = GeneralModel.getGeneralArmyConfig(this.generalId);
		return aconfig.ourModelCode;
	}

	/**
	 * 获得武将类型
	 */
	public getGeneralOccupation() {
		return this.generalOccupation;
	}

	/**
	 * 获得武将类型
	 */
	public getGeneralOccupationIcon(imgType: number): string {
		return GeneralModel.getSoldierTypeIcon(this.generalOccupation, imgType);
	}

	//=============================================================================================================================================
	//技能 begin
	//============================================================================================================================================= 
	/**
	 * 获取拥有技能信息
	 * sequence	技能序号  标记它属于什么技能	[1-4]
	 * skillId	技能id ，该值为0或没有值，表示还未获得
	 * level	技能等级
	 */
	public getOwnerSkillInfoBySeque(sequence: number) {
		for (let skill of this.skills) {
			if (skill.sequence == sequence) {
				return skill;
			}
		}
		return null;
	}
	/**技能初始化 */
	public initSkills() {
		if (!this.skills || this.skills.length == 0) {
			this.skills = [];
			this.skillNeedSoul = [];

			let anger = StringUtils.keyValsToNumberArray(this.config.angerSkill)[0];
			this.skills.push({ sequence: 1, skillId: anger.key, level: 0 });
			let skillLvCfg = GeneralModel.getSkillLvCfg(anger.key, 1);
			if (skillLvCfg) {
				let consume = Utils.parseCommonItemJson(skillLvCfg.upConsume)[0];
				this.skillNeedSoul.push(consume.itemId);
			}
			let others = StringUtils.keyValsToNumberArray(this.config.passiveSkill);
			for (let i = 0; i < others.length; i++) {
				this.skills.push({ sequence: i + 2, skillId: others[i].key, level: 0 });
				let cfg = C.SkillConfig[others[i].key];
				if (!cfg || cfg.skillType == 3) continue;
				let skillLvCfg = GeneralModel.getSkillLvCfg(others[i].key, 1);
				if (skillLvCfg) {
					let consumes = Utils.parseCommonItemJson(skillLvCfg.upConsume);
					if (consumes.length > 0) this.skillNeedSoul.push(consumes[0].itemId);
				}
			}
		}
	}

	public getOwnerSkillInfoById(skillId: number) {
		for (let skill of this.skills) {
			if (skill.skillId == skillId) {
				return skill;
			}
		}
		return null;
	}

	/**
	 * 技能课升级
	 * 注：武将升级升星 影响技能等级上限 为减少运算量 红点事件刷新 不用再次计算
	 *  */
	public canUpSkillList(): { [key: number]: boolean } {
		let res = {};
		if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_SKILL)) return res;
		for (let data of this.skills) {
			res[data.skillId] = false;
			let cfg = C.SkillConfig[data.skillId];
			//过滤被动技能
			if (cfg.skillType == 3) continue;
			//等级上限判断
			if (!GeneralModel.isMaxSkill(data.skillId, data.level)) {
				let skillCfg = C.SkillLvConfigDic[data.skillId][data.level];
				let limitParam = skillCfg.upLimit.split('_');
				//武将等级 星级判断
				if (this.level >= Number(limitParam[0]) && this.star >= Number(limitParam[1])) {
					let costs = Utils.parseCommonItemJson(skillCfg.upConsume);
					if (PropModel.isItemListEnough(costs)) {
						res[data.skillId] = true;
					}
				}
			}
		}
		return res;
	}

	/**是否所需技能碎片 满级不需要*/
	public isNeedSkillSoul(itemId: number) {
		return this.skillNeedSoul.indexOf(itemId) >= 0;
	}

	//=============================================================================================================================================
	//技能 end
	//============================================================================================================================================= 


	/**
	 * 获取品质颜色
	 */
	public getColorOfQuality() {
		return Utils.getColorOfQuality(this.quality);
	}

	/**
	 * 获取显示星星数
	 */
	public getStarNum() {
		let starCfg = C.GeneralStarConfig[this.star];
		if (starCfg) {
			return starCfg.starlevel;
		} else {
			return 0;
		}
	}

	/**获得碎片数量 */
	public getSoulId(): number {
		return this.config.itemId;
	}

	/**获得碎片数量总数 */
	public getSoulNum(): number {
		return PropModel.getPropNum(this.getSoulId());
	}

	/**获得升星所需数量 */
	public getUpStarNeedNum(): number {
		let starCfg = C.GeneralStarConfig[this.star];
		if (starCfg) {
			return starCfg.soulNum;
		} else {
			return 0;
		}
	}

	/**可合成 */
	public canCollect(): boolean {
		if (!this.isOwn) {
			return this.getSoulNum() >= this.config.soul;
		}
		return false;
	}

	/**可升星 */
	public canUpStar(): boolean {
		if (this.isOwn) {
			if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_STAR)) return false;
			if (this.star >= GeneralModel.MAX_STAR) return false;
			let needNum = this.getUpStarNeedNum();
			if (needNum > 0 && this.getSoulNum() >= needNum) {
				return true;
			}
		}
		return false;
	}


	/**可升级 */
	public canUpLevel(totalExp: number) {
		if (!this.own) return false;
		if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_LEVELUP)) return false;
		if (this.level >= GeneralModel.getMaxLevel(this.upgradeLevel)) {
			return false;
		}
		if (this.curExp + totalExp >= this.GetMaxExp()) return true;
		return false;
	}

	/**可突破 */
	public canTupodan(itemNum: number) {
		if (!this.own) return false;
		if (this.GetGeneralIsTuPo() == 0) return false;
		if (this.upgrageItem && RoleData.level >= this.GetGeneralCfg().playerLevel) {
			return itemNum >= this.upgrageItem.count;
		}
		return false;
	}

	/**可激活缘分 */
	public canActiveFate(): boolean {
		if (!this.own) return false;
		return FateModel.checkCanActiveFate(this.generalId);
	}
	/**记录突破需求 */
	public parseTupodanCosume() {
		let cfg = this.GetGeneralCfg();
		if (cfg && cfg.isUpgrade == 1) {
			this.upgrageItem = Utils.parseCommonItemJson(cfg.consume)[0];
		} else {
			this.upgrageItem = null;
		}
	}

	/**客户端模拟升级 */
	public addExpInClient(expNum: number): boolean {
		//已满级
		if (this.level >= GeneralModel.getMaxLevel(this.upgradeLevel)) {
			return false;
		}
		let max = this.GetMaxExp();
		let totalExp = this.curExp + expNum;
		let oldLv = this.level;
		while (totalExp >= max) {
			//升级判断
			if (this.level + 1 <= GeneralModel.getMaxLevel(this.upgradeLevel)) {
				totalExp -= max;
				this.level++;
				max = this.GetMaxExp();
			} else {
				break;
			}
		}
		this.curExp = totalExp;
		com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EXP, this.generalId);
		if (this.level - oldLv > 0) {
			this.addLevelAttri(this.level - oldLv);
			this.parseTupodanCosume();
			AGame.R.notifyView(TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT, { clientUplvMsg: 1 });
			com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_LEVEL, this.generalId);
		}
		return true;
	}

	/**获得最大经验 */
	public GetMaxExp(): number {
		if (C.GeneralLevelConfig[this.level]) {
			return C.GeneralLevelConfig[this.level].exp;
		}
		return 100000;
	}
	/**获得当前武将等级配置 */
	public GetGeneralCfg(): GeneralLevelConfig {
		return C.GeneralLevelConfig[this.level];
	}
	/**获得当前武将突破配置 */
	public GetGeneralTuPoCfg(): GeneralLevelConfig {
		let tupoLevel = this.upgradeLevel;
		return C.GeneralLevelConfig[tupoLevel];
	}
	/**获得当前武将是否突破 */
	public GetGeneralIsTuPo(): number {
		let isTupo: number = 0;
		let cfg = this.GetGeneralCfg();
		if (cfg.isUpgrade == 1) {
			if (this.upgradeLevel != cfg.level) {
				isTupo = 1;
			}
		}
		return isTupo;
	}

	/**添加升级属性(客户端模拟升级) */
	public addLevelAttri(addLv: number) {
		let addAttri = this.getLevelGrowValues(addLv);
		this.attriList[AttriType.ATK] += addAttri[AttriType.ATK];
		this.attriList[AttriType.DEF] += addAttri[AttriType.DEF];
		this.attriList[AttriType.HP] += addAttri[AttriType.HP];
		this.attriList[AttriType.SOLDIER] += addAttri[AttriType.SOLDIER];
		this.fight = Utils.calculateFight(this.attriList, this.getGeneralArmyType());
	}

	/**获得战力加成系数 */
	private getFightAddValue(): number {
		//战斗力加成
		let _typeAdd = 1;
		switch (this.config.generalType) {
			case SoliderGeneralType.MENG_JIANG: {
				_typeAdd = 1.2;
				break;
			}
			case SoliderGeneralType.JUN_SHI: {
				_typeAdd = 1.1;
				break;
			}
		}
		return _typeAdd;
	}

	/**获得武将属性队列 */
	public getGenAttriList(): { [key: number]: number } {
		return this.attriList;
	}

	/**获得属性值 */
	public getGenAttriValByType(type: AttriType): number {
		return Utils.getAttriValByType(this.attriList, type);
	}
	/**获得等级提升战力 */
	public getLevelGrowValues(upLevel: number = 1): { [key: number]: number } {
		let starcfg = C.GeneralStarConfig[this.star];
		let gencfg = this.config as GeneralConfig;
		// let attriCfgList = StringUtils.keyValsToNumber(gencfg.attribute);
		let coeff = ConstUtil.getGenCoeffs();
		/**====================================================主属性(无成长)========================================================== */
		let _power = this.attriList[AttriType.POWER];
		let _intelligence = this.attriList[AttriType.INTELLIGENCE];
		let _leadership = this.attriList[AttriType.LEADERSHIP];
		/**====================================================主属性(无成长)========================================================== */
		let rate = StringUtils.keyValsToNumber(starcfg.attribute);
		let atkRate = rate[AttriType.ATK_COEFFICIENT] / 10000,
			defRate = rate[AttriType.DEF_COEFFICIENT] / 10000,
			hpRate = rate[AttriType.HP_COEFFICIENT] / 10000,
			aHpRate = rate[AttriType.SOLDIER_COEFFICIENT] / 10000;

		let _atk = upLevel * (_power * (coeff.Pow2Atk + atkRate) + _intelligence * (coeff.Intel2Atk + atkRate));	//攻击
		let _def = upLevel * (_power * (coeff.Pow2Def + defRate) + _leadership * (coeff.Lead2Def + defRate));	//防御力
		let _hp = upLevel * (_leadership * (coeff.Lead2Hp + hpRate) + _intelligence * (coeff.Intel2Hp + hpRate));	//血量
		let _armyHp = upLevel * (_leadership * (coeff.Lead2AHp + aHpRate) + _intelligence * (coeff.Intel2AHp + aHpRate));	//兵力

		let tmpAttriList = {};
		tmpAttriList[AttriType.ATK] = Math.round(_atk);
		tmpAttriList[AttriType.DEF] = Math.round(_def);
		tmpAttriList[AttriType.HP] = Math.round(_hp);
		tmpAttriList[AttriType.SOLDIER] = Math.round(_armyHp);

		return tmpAttriList;
	}
	/**获得等级提升战力显示 */
	public getLevelGrowViewValues(upLevel: number = 1): Array<string> {
		let attriList = this.getLevelGrowValues(upLevel);
		let _fight = Utils.calculateFight(attriList, this.getGeneralArmyType());
		let res = [];
		res.push(GCodeFromat(CLEnum.LEVEL_ADD, upLevel));
		res.push(Utils.getAttriFormat({ key: AttriType.ATK, value: attriList[AttriType.ATK] }));
		res.push(Utils.getAttriFormat({ key: AttriType.DEF, value: attriList[AttriType.DEF] }));
		res.push(Utils.getAttriFormat({ key: AttriType.HP, value: attriList[AttriType.HP] }));
		res.push(Utils.getAttriFormat({ key: AttriType.SOLDIER, value: attriList[AttriType.SOLDIER] }));
		//战斗力 额外显示
		res.push(_fight);
		return res;
	}

	//=============================================================================================================================================
	//宝物 begin
	//============================================================================================================================================= 
	/**拥有可装配宝物 */
	public hasTreaEq() {
		if (!this.own || this.treasureId > 0) return false;
		let list = TreasureModel.getTreasByGeneralType(this.getGeneralOccupation());
		for (let i = 0; i < list.length; i++) {
			if (list[i].generalId == 0) return true;
		}
		return false;
	}

	/**更新宝物数据 */
	private updateTreaVo() {
		if (this.treasureId && this.treasureId > 0) {
			this.treaVo = TreasureModel.getData(this.treasureId);
		} else {
			this.treaVo = null;

		}
	}

	/**获得武将宝物属性 */
	private getTreasureAddList() {
		if (this.treasureId) {
			return TreasureModel.getData(this.treasureId).getAllAttriList();
		} else {
			return Dictionary.create();
		}
	}
	/**获得宝物对应属性加成 */
	private getTreaAddValByType(type: AttriType): number {
		if (this.treaVo) {
			return this.treaVo.getAllAttriValByName(type);
		}
		return 0;
	}

	/**旧宝物数据缓存 (卡牌动画刷新 调用--发送协议签)*/
	public recordAttribute() {
		this.attriRecord = JSON.parse(JSON.stringify(this.attriList));
		this.fightRecord = this.fight;
	}

	/**获得宝物属性差异 */
	public getAttributeChangeValues(): Array<string> {
		let res = [];
		for (let i in this.attriList) {
			let [key, value] = [Number(i), this.attriList[i]];
			let changeVal = value - Utils.getAttriValByType(this.attriRecord, key);
			if (changeVal != 0) {
				let format = changeVal > 0 ? '%s<font color=#00ff00>%s</font>' : '%s<font color=#ff0000>%s</font>';
				if (key != AttriType.ATK_COEFFICIENT && key != AttriType.DEF_COEFFICIENT && key != AttriType.SOLDIER_COEFFICIENT && key != AttriType.HP_COEFFICIENT) {
					res.push(Utils.getAttriFormat({ key: key, value: changeVal }, true, format));
				}
			}
		}
		//战斗力 额外显示
		res.push(this.fight - this.fightRecord);
		return res;
	}
	//=============================================================================================================================================
	//宝物 end
	//============================================================================================================================================= 

	//=============================================================================================================================================
	//装备 begin
	//============================================================================================================================================= 

	/**获得对应孔位装备 */
	public getEquipByPos(pos: IEquipPos) {
		return this.equipSlot[pos];
	}

	/**获得对应孔位装备 */
	public isEquipEmptyPos(pos) {
		return this.equipSlot[pos].equipmentUuid == 0;
	}
	/**查找更高战力装备 */
	private hasEquipHight(equip: gameProto.IEquipmentSlot, list: EquipVo[]) {
		//当前孔有装备 比较战力
		let eqVo = EquipModel.getEquipVoByUId(equip.equipmentUuid);
		for (let i = 0; i < list.length; i++) {
			if (eqVo.fight < list[i].fight) {
				return true;
			}
		}
		return false;
	}

	/**可装备 */
	public canEquip(pos?: IEquipPos) {
		if (!this.own) return false;
		let posList = isNull(pos) ? EquipModel.POS_LIST : [pos];

		for (let i = 0; i < posList.length; i++) {
			let tmpPos = posList[i];
			let equip = this.equipSlot[tmpPos];
			let list = EquipModel.getGenCanEquips(equip.equipmentUuid, tmpPos);
			if (equip.equipmentUuid > 0) {
				//当前孔有装备 比较战力
				if (this.hasEquipHight(equip, list)) return true;
			} else {
				if (list.length > 0) return true;
			}
		}
		return false;
	}


	/**可升级 */
	public canEquipLv(pos?: IEquipPos) {
		if (!this.own) return false;
		let posList = isNull(pos) ? EquipModel.POS_LIST : [pos];

		for (let i = 0; i < posList.length; i++) {
			let tmpPos = posList[i];
			let equip = this.equipSlot[tmpPos];
			if (!this.isMaxByStrengByType(equip, IEqStrengEnum.Level)) {
				let cfg = EquipModel.getLevelCfg(tmpPos, equip.strengthen);
				let costs = Utils.parseCommonItemJson(cfg.consume);
				if (PropModel.isItemListEnough(costs)) return true;
			}
		}
		return false;
	}

	/**可升阶 */
	public canEquipGrade(pos?: IEquipPos) {
		if (!this.own) return false;
		let posList = isNull(pos) ? EquipModel.POS_LIST : [pos];

		for (let i = 0; i < posList.length; i++) {
			let tmpPos = posList[i];
			let equip = this.equipSlot[tmpPos];
			if (!this.isMaxByStrengByType(equip, IEqStrengEnum.Grade)) {
				let cfg = EquipModel.getGradeCfg(tmpPos, equip.grade);
				if (cfg && cfg.level < 100) {
					let costs = Utils.parseCommonItemJson(cfg.consume);
					if (PropModel.isItemListEnough(costs)) return true;
				}
			}
		}
		return false;
	}

	/**可精炼 */
	public canEquipWrought(pos?: IEquipPos) {
		if (!this.own) return false;
		let posList = isNull(pos) ? EquipModel.POS_LIST : [pos];

		for (let i = 0; i < posList.length; i++) {
			let tmpPos = posList[i];
			let equip = this.equipSlot[tmpPos];
			if (!this.isMaxByStrengByType(equip, IEqStrengEnum.Wrought)) {
				let cfg = EquipModel.getWroughtCfg(tmpPos, equip.wrought);
				let costs = Utils.parseCommonItemJson(cfg.consume);
				if (PropModel.isItemListEnough(costs)) return true;
			}

		}
		return false;
	}

	/**对应位置装备 对应类型是否达到上限 */
	public isMaxByStrengByType(equip: gameProto.IEquipmentSlot, type: IEqStrengEnum) {
		switch (type) {
			case 0:
				return equip.strengthen >= this.getMaxStrengByType(type);
			case 1:
				return equip.grade >= this.getMaxStrengByType(type);
			case 2:
				return equip.wrought >= this.getMaxStrengByType(type);
		}
		return false;
	}
	/**获得对应类型升级上限 */
	public getMaxStrengByType(type: IEqStrengEnum) {
		switch (type) {
			case 0:
				return this.level;
			case 1:
				return this.level;
			case 2:
				return this.level * 5;
		}
		return 0
	}


	//=============================================================================================================================================
	//装备 end
	//============================================================================================================================================= 

}