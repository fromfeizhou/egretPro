enum UpAttriType {
	upStar = 1, //升星
	TuPo = 2, //突破

}
class GeneralModel {
	public static MAX_STAR = 25;	//最大星星
	public static FIGHT_RECORD: number = 0;	//战力记录
	public static ownGenerals: Dictionary = null;
	public static currGenInfo: gameProto.IHeroRank;//点击排行榜查看的武将信息

	/**其他玩家武将信息 */
	public static otherPlayerGenerals: Dictionary = null;
	public static currProp: IKeyVal[];
	public static currSkills: number[];
	public static init() {
		this.clear();
		if (!this.ownGenerals) {
			this.ownGenerals = Dictionary.create();
		}

		if (!this.otherPlayerGenerals) {
			this.otherPlayerGenerals = Dictionary.create();
		}
		this.initAllGeneralVo();
	}

	public static clear() {
		if (this.ownGenerals) {
			this.ownGenerals.onDestroy();
			this.ownGenerals = null;
			this.currGenInfo = null;
		}

		if (this.otherPlayerGenerals) {
			this.otherPlayerGenerals.onDestroy();
			this.otherPlayerGenerals = null;
		}
	}

	/** 
	 * 其他玩家的武将数据
	 */
	public static setOtherPlayerGenerals(list) {
		this.otherPlayerGenerals.onDestroy();
		let len = list.length;
		for (let i: number = 0; i < len; i++) {
			let info = list[i];
			let playerId = info.playerId;
			let generals = [];
			for (let j: number = 0; j < info.generalInfo.length; j++) {
				let generalInfo = info.generalInfo[j];
				generals.push(GeneralVo.create(generalInfo));
			}
			this.otherPlayerGenerals.add(playerId, generals);
		}
	}

	/**
	 * 其他玩家的武将数据
	 */
	public static getOtherPlayerGenerals() {
		return this.otherPlayerGenerals;
	}

	public static initAllGeneralVo() {
		let configs = this.getGeneralConfig();
		let list = ConstUtil.getNumArray(IConstEnum.GENERAL_LIST);
		for (let i = 0; i < list.length; i++) {
			let id = list[i];
			let cfg = configs[id];
			if (cfg != null && cfg != undefined) {
				let vo = GeneralVo.create(id);
				this.ownGenerals.add(vo.generalId, vo);
			}
		}
	}

	/**
	 * 设置已拥有的武将数据
	 */
	public static setOwnGenerals(list) {
		for (let i: number = 0; i < list.length; i++) {
			let info = list[i];
			let vo = this.getOwnGeneral(info.generalId);
			if (vo) {
				vo.update(info);
				vo.own = true;
			}
		}
		com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
		ScenePopQueWnd.addFightWnd();
	}

	/**
	 * 更新已拥有武将数据
	 */
	public static updateOwnGenerals(list) {
		for (let i: number = 0; i < list.length; i++) {
			let info = list[i];
			let vo = this.getOwnGeneral(info.generalId);
			vo.update(info);
		}
		com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
		ScenePopQueWnd.addFightWnd();
	}

	/**刷新武将属性 */
	public static updateGeneralAttri(data: gameProto.IS2C_SYS_GENERAL_ATTRIBUTES_NOTICE) {
		for (let i = 0; i < data.generalAttribute.length; i++) {
			let attriData = data.generalAttribute[i];
			let vo = GeneralModel.getOwnGeneral(attriData.generalId) as GeneralVo;
			if (vo) {
				vo.updateAttri(attriData)
			}
		}
		com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
		ScenePopQueWnd.addFightWnd();
	}


	/**获取武将战斗力 */
	public static getGeneralTotalFight() {
		let list = [];
		let len = this.ownGenerals.datum.length;
		for (let i: number = 0; i < len; i++) {
			let data = this.ownGenerals.datum[i];
			if (data.own == true) {
				list.push(data);
			}
		}
		if (list.length > 5) {
			list.sort((a, b) => {
				return (<GeneralVo>a).fight > (<GeneralVo>b).fight ? -1 : 1;
			});
		}
		let res = 0;
		for (let i = 0; i < 5; i++) {
			if (i >= list.length) break;
			res += (<GeneralVo>list[i]).fight
		}
		return res;
	}
	/**
	 * 获取（升星,突破)前属性数据
	 */
	public static getUpStarInfo(generalId: number, type: number) {
		let generalVo: GeneralVo;
		this.currProp = [];
		if (generalId) {
			generalVo = GeneralModel.getOwnGeneral(generalId);
			let attriList = generalVo.attriList;          //基础属性
			for (let j in attriList) {

				if (UpAttriType.upStar == type) {
					if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.CRITICAL) {
						this.currProp.push({ key: Number(j), value: Number(attriList[j]) });
					}
				} else {
					if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER) {
						this.currProp.push({ key: Number(j), value: Number(attriList[j]) });
					}
				}
			}
		}
	}
	/**升级前,升星前,记录当前激活的技能id */
	public static keepCurrSkillId(generalId: number) {
		this.currSkills = [];
		let generalVo: GeneralVo;
		if (generalId) {
			generalVo = GeneralModel.getOwnGeneral(generalId);
			for (let i = 0; i < generalVo.skills.length; i++) {
				let info = generalVo.skills[i];
				if (info.skillId > 0 && info.level > 0) this.currSkills.push(info.skillId);
			}
		}
	}

	/**升星升级后获取武将激活技能id列表 */
	public static getCurSkills(generalId: number) {
		let skillIdList = [];
		let generalVo: GeneralVo;
		if (generalId) {
			generalVo = GeneralModel.getOwnGeneral(generalId);
			for (let i = 0; i < generalVo.skills.length; i++) {
				let info = generalVo.skills[i];
				if (info.skillId > 0 && info.level > 0) skillIdList.push(info.skillId);
			}
		}
		return skillIdList;
	}
	/**动画化判断 */
	public static checkCanAtion(generalId: number) {
		let res = 0;
		let skillIds = this.getCurSkills(generalId);
		for (let i = 0; i < skillIds.length; i++) {
			if (this.currSkills && this.currSkills.indexOf(skillIds[i]) == -1) {
				res = skillIds[i]
				break;
			}
		}
		if (res > 0) Utils.open_view(TASK_UI.POP_GENERAL_UNLOCK_SKILL, { generalId: generalId, skillId: res });
	}
	/**获取5个最高战斗力武将列表 */
	public static getGeneralHightList(): GeneralVo[] {
		let list = [];
		let len = this.ownGenerals.datum.length;
		for (let i: number = 0; i < len; i++) {
			let data = this.ownGenerals.datum[i];
			if (data.own == true) {
				list.push(data);
			}
		}
		list.sort((a, b) => {
			return (<GeneralVo>a).fight > (<GeneralVo>b).fight ? -1 : 1;
		});
		len = list.length > 5 ? 5 : list.length;
		let res = [];
		for (let i = 0; i < len; i++) {
			res.push(list[i]);
		}
		return res;
	}

	/**获取战斗力最高的近战武将 */
	public static getGeneralHightNearAtk(): GeneralVo {
		let list = [];
		let len = this.ownGenerals.datum.length;
		for (let i: number = 0; i < len; i++) {
			let data = this.ownGenerals.datum[i];
			if (data.own == true && data.config.generalType != 3) {
				list.push(data);
			}
		}
		list.sort((a, b) => {
			return (<GeneralVo>a).fight > (<GeneralVo>b).fight ? -1 : 1;
		});

		return list[0];
	}

	/**
	 * 获取拥有的武将数据
	 */
	public static getOwnGeneral(id: number): GeneralVo {
		return this.ownGenerals.get(id);
	}

	/**获得拥有武将列表 */
	public static getOwnerGeneralList() {
		return this.ownGenerals;
	}

	/**获得默认武将id */
	public static getGeneralDefaut() {
		return this.getOwnGeneralWithSortFight()[0].generalId;
	}

	/**获得拥有武将列表id */
	public static getOwnGenIds() {
		let ids: number[] = [];
		this.ownGenerals.forEach((key: number, _data: GeneralVo) => {
			if (_data.own == true) {
				ids.push(_data.generalId);
			}
		}, this);
		return ids;
	}

	/**
	 * 获取拥有武将的数量
	 */
	public static getOwnGeneralNum(): number {
		let num: number = 0;
		this.ownGenerals.forEach((key: number, _data: any) => {
			if (_data.own == true) {
				num++;
			}
		}, this);
		return num;
	}


	/**
	 * 获取排序过的已拥有武将数据
	 */
	public static getOwnGeneralWithSort(armyType?: SoldierMainType): GeneralVo[] {
		let list: GeneralVo[] = [];
		let len = this.ownGenerals.datum.length;
		for (let i: number = 0; i < len; i++) {
			let data = this.ownGenerals.datum[i] as GeneralVo;
			if (data.own == true) {
				if (!armyType || data.config.generalOccupation == armyType)
					list.push(data);
			}
		}
		list.sort(GeneralModel.compareOfOnBattle);
		return list;
	}


	/**
	 * 获取排序过的已拥有武将数据
	 */
	public static getOwnGeneralWithSortFight(generalType?: number): GeneralVo[] {
		let list: GeneralVo[] = [];
		let len = this.ownGenerals.datum.length;
		for (let i: number = 0; i < len; i++) {
			let data = this.ownGenerals.datum[i] as GeneralVo;
			if (data.own == true) {
				if (!generalType || data.config.generalType == generalType)
					list.push(data);
			}
		}
		list.sort((a, b) => {
			return b.fight - a.fight;
		});
		return list;
	}

	/** 
	 * 获取排序过的已拥有武将数据
	 * （已上阵的武将排最后）用于重生功能
	 * */
	public static getOwnGeneralWithOnBattle(generalType?: number): GeneralVo[] {
		let list: GeneralVo[] = [];
		let len = this.ownGenerals.datum.length;
		for (let i: number = 0; i < len; i++) {
			let data = this.ownGenerals.datum[i] as GeneralVo;
			if (data.own == true) {
				if (!generalType || data.config.generalType == generalType)
					list.push(data);
			}
		}
		list.sort((a, b) => {
			let aboo = TeamModel.isOnBattle(a.generalId) ? 1 : 0;
			let bboo = TeamModel.isOnBattle(b.generalId) ? 1 : 0;;
			if (aboo == bboo) {
				return b.fight - a.fight;
			} else {
				return aboo - bboo;
			}
		});
		return list;
	}
	/**
	 * 单独设置一个武将数据
	 */
	public static updateOwnGeneral(info) {
		let vo = this.getOwnGeneral(info.generalId);
		vo.update(info);
		com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_FIGHT, null);
		ScenePopQueWnd.addFightWnd();
	}
	/**
	 * 获取武将列表
	 */
	public static getAllGeneralInfo() {
		let onBattleList = [];
		this.ownGenerals.forEach((key: number, _data: any) => {
			if (_data.seat == GeneralState.ON_BATTLE) {
				let _config = this.getGeneralConfig(_data.generalId);
				let info = { data: _data, config: _config };
				onBattleList.push(info);
			}
		});
		return onBattleList;
	}

	/**
	 * 获取武将的数据与配置
	 */
	public static getGeneral(id): { data: GeneralVo, config: GeneralConfig } {
		let _data = this.getOwnGeneral(id);
		let _config = this.getGeneralConfig(id);
		let info = { data: _data, config: _config };
		return info;
	}

	/**
	 * 获取拥有的武将配置
	 */
	public static getGeneralConfig(id?: number) {
		return GeneralData.getGeneralConfig(id);
	}
	/**
	 * 获取武将声音
	 */
	public static getGeneralSoundByGeneralID(id?: number) {
		return GeneralData.getGeneralConfig(id).sound;
	}

	/**
	 * 获取拥有与未拥有的武将配置
	 */
	public static getAllGeneralConfig(level?: number, armyType?: SoldierMainType) {
		let _own: GeneralConfig[] = [];
		let _none: GeneralConfig[] = [];

		let configs: GeneralConfig[] = this.getGeneralConfig();
		let list = ConstUtil.getNumArray(IConstEnum.GENERAL_LIST);
		for (let i = 0; i < list.length; i++) {
			let id = list[i];
			let config = configs[id];
			if (config != null && config != undefined) {
				let ownGeneral = this.getOwnGeneral(id);
				if (ownGeneral.own) {
					_own.push(config);
				} else {
					if (!armyType || armyType == config.generalOccupation) {
						_none.push(config);
					}
				}
			}

		}
		return { own: _own, none: _none };
	}


	/**
	 * 获取武将对应的兵种配置
	 */
	public static getGeneralArmyConfig(id) {
		let config = this.getGeneralConfig(id);
		let armyType = config.armyType;
		let armyCfg = MainMapModel.getSoldierLvCfg(armyType);
		return armyCfg;
	}

	/**
	 * 状态初始化
	 */
	public static initOwnGeneralState() {
		this.ownGenerals.forEach((key: number, _data: any) => {
			_data.seat = GeneralState.IDLE;
			_data.state = GeneralState.IDLE;
			this.updateOwnGeneral(_data);
		});
	}

	/**
	 * 获取武将类型图标状态
	 */
	public static getGeneralArmyTypeIconState(generalId) {
		let army = GeneralModel.getGeneralArmyConfig(generalId);
		let state = "state" + General_Pro_Code[army.mainType as number];
		return state;
	}

	/**
	 * 获取武将兵种名称
	 */
	public static getGeneralArmyTypeName(generalId) {
		let army = GeneralModel.getGeneralArmyConfig(generalId);
		// let armyMain = C.ArmyMainTypeConfig[army.mainType as number];
		return GLan(army.name);
	}

	/**
	 * 获取武将名称
	 */
	public static getGeneralName(generalId) {
		let config = GeneralModel.getGeneralConfig(generalId);
		if (config) {
			return GLan(config.name);
		}
		return generalId;

	}

	/**设置武将名字 */
	public static setLabGaneralName(generalId: number, target: eui.Label) {
		let config: GeneralConfig = GeneralModel.getGeneralConfig(generalId);
		if (config) {
			target.text = GLan(config.name);
			Utils.setLabColorByQuality(target, config.qualityLevel);
		}
	}



	/**
	 * 上阵优先排序
	 */
	public static compareOfOnBattle(a: any, b: any) {
		if (a.fight == b.fight) {
			if (a.level == b.level) {
				if (a.quality == b.quality) {
					if (a.star == b.star) {
						return (a.generalId - b.generalId) / Math.abs((a.generalId - b.generalId)); //升序
					} else {
						return (b.star - a.star) / Math.abs((b.star - a.star)); //星级降序
					}
				} else {
					return (b.quality - a.quality) / Math.abs((b.quality - a.quality));
				}
			} else {
				return (b.level - a.level) / Math.abs((b.level - a.level));
			}
		} else {
			return (b.fight - a.fight) / Math.abs((b.fight - a.fight));
		}
	}

	/**根据武将等级获取武将升级上限 */
	public static getMaxLevel(tuPoLevel: number) {
		let LevelList = [];
		for (let i in C.GeneralLevelConfig) {
			LevelList.push(C.GeneralLevelConfig[i]);
		}
		for (let k = 0; k < LevelList.length; k++) {
			let cfg = LevelList[k];
			if (tuPoLevel < cfg.level) {
				if (cfg.isUpgrade == 1) {
					return cfg.level;
				}
			}
		}
	}
	/**武将等级上限tips */
	public static getMaxLvTips() {
		let limitLv = ConstUtil.getValue(IConstEnum.MINIMUM_GENERAL_LEVEL_LIMIT);
		if (RoleData.level < limitLv) {
			return GCodeFromat(CLEnum.GEN_LV_LIMIT, limitLv, limitLv);
		} else {
			return GCodeFromat(CLEnum.GEN_LV_LIMIT1);
		}
	}

	//=============================================================================================================================================
	//                                                         武将装备红点 begin
	//============================================================================================================================================= 
	/**是否有武将可装配宝物 */
	public static canTreaEquip(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;
		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.hasTreaEq()) {
				return true;
			}
		}
		return false;
	}

	/**是否有武将可装备 */
	public static canEquip(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;
		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.canEquip()) {
				return true;
			}
		}
		return false;
	}

	/**是否有武将可强化装备 */
	public static canEquipLv(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;
		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.canEquipLv()) {
				return true;
			}
		}
		return false;
	}


	/**是否有武将可进阶装备 */
	public static canEquipGrade(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;
		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.canEquipGrade()) {
				return true;
			}
		}
		return false;
	}


	/**是否有武将可精炼装备 */
	public static canEquipWrought(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;
		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.canEquipWrought()) {
				return true;
			}
		}
		return false;
	}

	/**可合成 */
	public static canCollected() {
		let res = false;
		this.ownGenerals.forEach((key: number, data: GeneralVo) => {
			if (data.isOwn == false && data.canCollect()) {
				res = true;
				return 'break;'
			}
		}, this)
		return res;
	}


	/**可升级 */
	public static canUpLevel(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;


		let items = PropModel.getPropItemListByType(PropMainType.EXP_BOOK);
		let totalExp = 0;
		for (let i = 0; i < items.length; i++) {
			let id = items[i].itemId;
			let num = items[i].count;
			let cfg = C.ExpBookConfig[id];
			totalExp += cfg ? cfg.exp * num : 0;
		}
		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.canUpLevel(totalExp)) {
				return true;
			}

		}
		return false;
	}

	/**可突破 */
	public static canTupodan(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;

		let itemNum = PropModel.getPropNum(PropEnum.TUPODAN);

		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.canTupodan(itemNum)) {//突破后判断升级红点
				return true;
			}
		}
		return false;
	}
	/**可激活缘分 */
	public static canActiveFate(genId?: number) {
		let list = genId ? [genId] : RedPointModel.getRedGenIds();
		// if (genId && !RedPointModel.hasGeneralInfo(genId)) return false;
		if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_FATE)) return false;
		for (let id of list) {
			let vo = this.getOwnGeneral(id);
			if (vo && vo.canActiveFate()) {//升星之后判断激活缘分
				return true;
			}
		}
		return false;
	}
	/** 记录点击查看的武将信息*/
	public static getClickGenInfo(param: gameProto.IHeroRank): any {
		this.currGenInfo = param;
	}


	//=============================================================================================================================================
	//                                                         武将装备红点 end
	//============================================================================================================================================= 

	//=============================================================================================================================================
	//                                                         武将资源统一接口begin
	//============================================================================================================================================= 

	/**获得技能图标 */
	public static getSkillIcon(skillId: number) {
		let skillInfo = C.SkillConfig[skillId]
		let res = "";
		if (skillInfo) {
			res = Utils.GetResName(`icon_jn_${skillInfo.icon}_png`, "icon_jn_1_png");
		}
		return res;
	}
	/**
	 * 排序未获得武将
	 */
	public static compareNoGeneral(a: any, b: any) {
		return b.qualityLevel - a.qualityLevel;
	}


	/**头像背景 */
	public static getHeadItemBgByQuality(quality: number = 0) {
		return `general_bg${quality}_png`;
	}

	// /**(小)武将头像背景 */
	public static getComHeadItemBgByQuality(quality: number = 0) {
		return `small_general_head_bg_${quality}_png`;
	}

	/**武将类型图标 */
	public static getSoldierTypeIcon(generalOcc: number, imgType: number = 1): string {
		let imgTypeFix = "";
		if (imgType == 2) imgTypeFix = "2";

		switch (generalOcc) {
			case SoldierMainType.FOOTSOLDIER: {
				return `general_type_bubing${imgTypeFix}_png`;
			}
			case SoldierMainType.ARROWSOLDIER: {
				return `general_type_gongbing${imgTypeFix}_png`;
			}
			case SoldierMainType.PIKEMAN: {
				return `general_type_qiangbing2_png`;
			}
			default: {
				return `general_type_qibing${imgTypeFix}_png`;
			}
		}
	}
	/**士兵类型图标 */
	public static getIconBySoldierType(imgType: number = 101): string {


		switch (imgType) {
			case 101: {
				return "general_type_bubing_png";
			}
			case 102: {
				return "general_type_qibing_png";
			}
			case 103: {
				return "general_type_gongbing_png";
			}
			default: {
				return "general_type_qibing_png";
			}
		}
	}

	/**获取武将头像 */
	public static getSoldierLogo(idstr: string) {
		let img_url = `icon_wj_${idstr}_png`;
		// var texture = RES.getRes(img_url);
		// if (!texture)
		// 	texture = RES.getRes("icon_wj_0_png");
		return Utils.GetResName(img_url, "icon_wj_0_png");;
	}

	/**获取武将展示 */
	public static getSoldierBigLogo(idstr: string) {
		let img_url = `icon_wj_b_${idstr}_png`;
		return Utils.GetResName(img_url, "icon_wj_b_0_png");
	}

	/**获取武将展示 */
	public static getCircleLogo(idstr: string) {
		let img_url = `rgh${idstr}_png`;
		return Utils.GetResName(img_url, "rgh0_png");
	}


	/**存在动画资源 */
	public static hasSoliderLogoAnima(id: string) {
		let skeletonData = RES.hasRes("Gen_Anim_" + id + "_ske_dbbin");
		let pngData = RES.hasRes("Gen_Anim_" + id + "_tex_png");
		let textureData = RES.hasRes("Gen_Anim_" + id + "_tex_json");
		if (!pngData || !skeletonData || !textureData) {
			return false;
		}
		return true;
	}


	/**获取武将展示背景 */
	public static getSoldierQualityBigLogoBg(quaLevel: number) {
		let img_url = `general_card_bg${quaLevel}_jpg`;
		return Utils.GetResName(img_url, "general_card_bg1_jpg");
	}

	/**武将卡品质框 */
	public static getSoldierQualityBigLogo(quaLevel: number) {
		let img_url = `general_card_bgmk${quaLevel}_png`;
		return Utils.GetResName(img_url, "general_card_bgmk1_png");

	}

	/**武将等级背景图 */
	public static getSoldierQualityLogo(quaLevel: number) {
		let img_url = `tavern_wj_bg_${quaLevel}_png`;
		return Utils.GetResName(img_url, "tavern_wj_bg_1_png");

	}

	/**武将品质颜色 */
	public static getGeneralQualityColor(quaLevel: number) {
		return Utils.getColorOfQuality(quaLevel);
	}

	/**获取武将模型ID */
	public static getGeneralModelId(generalId: number) {
		//zb
		let army = GeneralModel.getGeneralArmyConfig(generalId);
		let model = C.ArmyModelConfig[army.ourModelCode];
		return Number(model.code);
	}

	/**获得武将国家资源 */
	public static getSoldierNationLogo(nationType: number) {
		let img_url = ""
		switch (nationType) {
			case SoldierNationType.SU: {
				img_url = "lb_sg_png";
				break;
			}
			case SoldierNationType.WEI: {
				img_url = "lb_wg_png";
				break;
			}
			case SoldierNationType.WU: {
				img_url = "lb_w_png";
				break;
			}
			case SoldierNationType.QUN: {
				img_url = "lb_wq_png";
				break;
			}
		}
		return Utils.GetResName(img_url, "lb_sg_png");
	}

	/**
	 * 获得星星资源 
	 */
	public static getStarRes(type: number) {
		let imgStar = `gen_star${type}_png`;
		return Utils.GetResName(imgStar, "gen_star1_png");
	}
	/**
	 * 获得星星背景资源 
	 */
	public static getStarBgRes(type: number) {
		let imgBg = `gen_starbg${type}_png`;
		return Utils.GetResName(imgBg, "gen_starbg1_png");
	}
	/**
	 * 获得星星配置表
	 */
	public static getStarCfg(star: number) {
		let starCfg = C.GeneralStarConfig[star];
		if (starCfg) {
			return starCfg;
		} else {
			return C.GeneralStarConfig[1];
		}
	}
	/**排序 */
	public static sortBystate(a: any, b: any) {
		let aAttri = GeneralModel.getAttriById(a.key);
		let bAttri = GeneralModel.getAttriById(b.key);
		if (aAttri < bAttri) {//按id顺序
			return -1;
		} else if (aAttri > bAttri) {
			return 1;
		} else {
			return 0;
		}
	}
	/**根据Id获取武将属性排序表对应数据id */
	public static getAttriById(id: number) {
		for (let key in C.GeneralShowConfig) {
			let attri = C.GeneralShowConfig[key];
			if (attri.AttriId == id) {
				return attri.id;
			}
		}
		return 0;
	}

	public static getWarPositionStr(pos) {
		return GCode(CLEnum['WAR_POSITION_' + pos])
	}

	public static getNationText(generalId: number): { text: string, color: number } {
		let config = C.GeneralConfig[generalId];
		if (config) {
			return this.getNationTextByCountryId(config.nationType);
		} else {
			return { text: GCode(CLEnum.STATE_SHU), color: 0x70f145 }
		}
	}

	public static getNationTextByCountryId(countryId: number): { text: string, color: number } {
		if (countryId == 1) {
			return { text: GCode(CLEnum.STATE_WEI), color: 0x44d0f3 }
		} else if (countryId == 2) {
			return { text: GCode(CLEnum.STATE_SHU), color: 0x70f145 }
		} else if (countryId == 3) {
			return { text: GCode(CLEnum.STATE_WU), color: 0xff2727 }
		} else if (countryId == 4) {
			return { text: GCode(CLEnum.STATE_QUN), color: 0xe9e9e6 }
		} else {
			return { text: GCode(CLEnum.STATE_QUN), color: 0xe9e9e6 }
		}
	}
	//=============================================================================================================================================
	//                                                         武将资源统一接口end
	//============================================================================================================================================= 

	/**获得升级限制 
	 * @return [武将等级，武将星级]
	*/
	public static getUpSkillLimit(skillId: number, level: number = 0): { level: number, star: number } {
		let skillCfg = C.SkillLvConfigDic[skillId][level];
		if (skillCfg) {
			let skills = skillCfg.upLimit.split('_');
			return { level: Number(skills[0]), star: Number(skills[1]) };
		}
		return { level: 999, star: 999 };
	}

	/**技能等级已满 */
	public static isMaxSkill(skillId: number, level: number) {
		let skillCfg = C.SkillLvConfigDic[skillId][level + 1];
		if (!skillCfg) return true;
		return false;
	}

	/**获得技能描述 */
	public static getSkillDesByLv(skillId: number, level: number = 0): string {
		if (C.SkillLvConfigDic[skillId] && C.SkillLvConfigDic[skillId][level]) {
			let cfg: SkillLvConfig = C.SkillLvConfigDic[skillId][level];
			return cfg.describe;
		}
		return "";
	}

	/**获得技能开放描述 */
	public static getSkillOpenDes(skillId: number, lineFeed?: boolean): string {
		let limit = this.getUpSkillLimit(skillId, 0);
		if (limit.level > 0 && limit.star > 0) {
			if (!lineFeed) return GCodeFromat(CLEnum.GEN_SKILL_OP_DES, limit.level, limit.star);
			return GCodeFromat(CLEnum.GEN_SKILL_OP_DES1, limit.level, limit.star);
		}
		if (limit.level > 0) return GCodeFromat(CLEnum.GEN_SKILL_OP_DES2, limit.level);
		return GCodeFromat(CLEnum.GEN_SKILL_OP_DES3, limit.star);
	}

	/**获得技能等级配置表 */
	public static getSkillLvCfg(skillId: number, level: number = 1): SkillLvConfig {
		if (C.SkillLvConfigDic[skillId] && C.SkillLvConfigDic[skillId][level]) {
			return C.SkillLvConfigDic[skillId][level];
		}
		return null;
	}
	/**根据技能获取对应武将配置表 */
	public static getSkillLvListbySkill(skillId: number) {
		let skillList = [];
		for (let key in C.SkillLvConfig) {
			if (C.SkillLvConfig[key].skillId == skillId) {
				skillList.push(C.SkillLvConfig[key]);
			}
		}
		return skillList;
	}
}