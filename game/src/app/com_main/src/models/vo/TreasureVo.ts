/**宝物信息 */
class TreasureVo extends BaseClass implements IFObject {
	/**属性值 */
	public static AttriKey: Array<string> = ["itemId", "mainAttribute", "allAttribute", "quality", "level", "generalId", "star", "holes", 'secondAttrId'];

	/**宝物唯一id */
	// public uuId: Long;
	/**对应的物品id */
	public itemId: number;
	/**宝物主属性 */
	public mainAttribute: string;
	/**宝物总属性 */
	public allAttribute: string;
	/**宝物品质 */
	public quality: number;
	/**宝物等级 */
	public level: number;
	/**装备武将id */
	public generalId: number;
	/**宝物星级 */
	public star: number;

	/**宝物宝石镶嵌 	*/
	public holes: gameProto.ITreasureHoleInfo[];
	/**宝物次属性 */
	public secondAttrId: number[];
	/**=================================================================================================================================
	 * 客户端数据结构
	 * =================================================================================================================================
	 */
	/**宝物战斗力 */
	public fight: number;
	/**最大等级 */
	public maxLevel: number;
	/**可装备武将类型 */
	public generalTypes: Array<number>;
	/**主属性结构 */
	public mainAttriList: { [key: number]: number };
	public mainAttris: IKeyVal[];
	/**总属性结构 */
	public allAttriList: { [key: number]: number };
	public allAttris: IKeyVal[];
	/**宝石套装 */
	public suitInfos: { type: number, exAttr: IKeyVal }[];

	/**当前宝物配置 */
	public treaCfg: TreasureConfig;

	/**孔位解锁计数 */
	public holeOpenNum: number;

	/**升级消耗 */
	public lvConsume: IItemInfo[];
	/**升星消耗 */
	public starConsume: IItemInfo[];


	public static create(body?: any) {
		var obj: TreasureVo = new TreasureVo(body);
		return obj;
	}

	public constructor(body?: any) {
		super();
		this.init(body);
	}
	/**初始化 */
	public init(body?: any) {
		this.parseData(body);
		this.updateHoleOpenNum();
		let treaCfg = C.TreasureConfig[this.itemId];
		if (treaCfg) {
			this.treaCfg = treaCfg;

			this.maxLevel = treaCfg.highLevel;
			this.generalTypes = JSON.parse(treaCfg.generalType);
			this.initSuitInfos();
		}

		this.parseLvCost();
		this.parseStarCost();

		this.initAttributeList();
		this.calculateFight();
	}
	/**销毁 */
	public onDestroy() {
	}

	/**数据更新 */
	public update(body?: any) {
		this.parseData(body);

		this.parseLvCost();
		this.parseStarCost();
		
		this.updateHoleOpenNum();
		this.initAttributeList();
		this.calculateFight();
	}

	private parseData(body?: any) {
		Utils.voParsePbData(this, body, TreasureVo.AttriKey, ['uuId']);
	}

	/**刷新孔位解锁数 */
	private updateHoleOpenNum() {
		let cfg = this.getStarCfg();
		if (cfg) this.holeOpenNum = cfg.unlockHole;
	}

	/**获得星级配置表 */
	public getStarCfg() {
		return TreasureModel.getStarCfg(this.star, this.quality);
	}

	/**序列化 属性列表*/
	public initAttributeList() {
		this.mainAttriList = StringUtils.keyValsToNumber(this.mainAttribute);
		this.mainAttris = StringUtils.keyValsToNumberArray(this.mainAttribute);
		Utils.sortAttriList(this.mainAttris);

		this.allAttriList = StringUtils.keyValsToNumber(this.allAttribute);
		this.allAttris = StringUtils.keyValsToNumberArray(this.allAttribute);

	}

	/**获得当前主属性列表 */
	public getMainAttriList(): { [key: number]: number } {
		return this.mainAttriList;
	}

	/**获得当前主属性数组 */
	public getMainAttris(): IKeyVal[] {
		return this.mainAttris;
	}

	/**获得总属性 */
	public getAllAttriList(): { [key: number]: number } {
		return this.allAttriList;
	}

	/**获得总属性数组 */
	public getAllAttris(): IKeyVal[] {
		return this.allAttris;
	}

	/**获得基础属性列表 */
	public getBaseAttris() {
		return StringUtils.keyValsToNumber(this.treaCfg.mainAttribute);
	}

	/**获得当前主属性 等级成长 */
	public getLevelGrowValues(): IKeyVal[] {
		return TreasureModel.getMainAttris(this.itemId, this.level + 1, this.star, this.quality);
	}

	/**获得当前主属性 星级成长 */
	public getStarGrowValues(): IKeyVal[] {
		return TreasureModel.getMainAttris(this.itemId, this.level, this.star + 1, this.quality);
	}

	/**获得孔位解锁星级 */
	public getStoneOpenStar(holeId: number) {
		return TreasureModel.getStoneOpenStar(this.quality, holeId);
	}

	/**是否达到等级上限 */
	public isMaxLevel() {
		return this.level >= this.maxLevel;
	}

	/**是否达到等级上限 */
	public isMaxStar() {
		return this.star >= TreasureModel.STAR_MAX;
	}

	/**是否可以装备 */
	public canEquipByType(type: SoliderGeneralType) {
		for (let i = 0; i < this.generalTypes.length; i++) {
			if (this.generalTypes[i] == type)
				return true;
		}
		return false;
	}

	/**计算战斗力 */
	private calculateFight() {
		this.fight = Utils.calculateNorFight(this.allAttriList);
	}

	/**根据属性名字获取属性值 */
	public getAllAttriValByName(type: AttriType): number {
		return Utils.getAttriValByType(this.allAttriList, type);
	}

	/**初始化宝石套装 */
	private initSuitInfos() {
		let suitStr = this.treaCfg.constitute.split(',');
		this.suitInfos = [];
		for (let i = 0; i < suitStr.length; i++) {
			let vals = suitStr[i].split('_');
			this.suitInfos.push({
				type: Number(vals[0]),
				exAttr: { key: Number(vals[1]), value: Number(vals[2]) }
			});
		}
	}


	/**获得宝物套装结构 */
	public getSuitInfos() {
		return this.suitInfos;
	}

	/**获取套装命中个数 */
	public getSuitLevel() {
		let level = 0;
		for (let data of this.suitInfos) {
			if (this.isInLayStone(data.type)) level++;
		}
		return level;
	}

	/**是否存在指定类型石头 */
	public isInLayStone(type: PropStoneType) {
		for (let i = 0; i < this.holes.length; i++) {
			let id = this.holes[i].gemstoneId;
			if (id > 0) {
				let stoneType = C.GemstoneConfig[this.holes[i].gemstoneId].type;
				if (stoneType == type) return true;
			}
		}
		return false;
	}

	/**获得专属武将id */
	public getDedicatedGenId() {
		return this.treaCfg.exclusiveId;
	}

	/**专用武将激活 */
	public isInDedicatedGeneral() {
		if (this.treaCfg.exclusiveId == 0) return false;
		return this.generalId == this.treaCfg.exclusiveId;
	}

	/**获得宝物专用属性加成 */
	public getDedicatedAddList() {
		return StringUtils.keyValsToNumberArray(this.treaCfg.exclusiveAdd);
	}

	/**解析等级消耗 */
	public parseLvCost() {
		let lvCfg = C.TreasureLevelConfig[this.level]
		if (lvCfg) {
			this.lvConsume = Utils.parseCommonItemJson(lvCfg.consume);
		} else {
			this.lvConsume = null;
		}
	}

	/**解析升星消耗 */
	public parseStarCost() {
		let starCfg = TreasureModel.getStarCfg(this.star, this.quality)
		if (starCfg) {
			let res:IItemInfo[] = [];
			res.push({itemId: this.treaCfg.fragment, count: starCfg.fragmenNum })
			this.starConsume = res.concat(Utils.parseCommonItemJson(starCfg.consume));
		} else {
			this.starConsume = null;
		}
	}

	/**获得红点 */
	public getRedState(type: RedEvtType) {
		if (type > 0) {
			switch (type) {
				case RedEvtType.TREA_STRENG:
					return this.canStreng();
				case RedEvtType.TREA_STAR:
					return this.canStar();
				case RedEvtType.TREA_INLAY:
					return this.canInlay();
			}
		} else {
			let res = this.canStreng();
			if (!res) res = this.canStar();
			if (!res) res = this.canInlay();
			return res;
		}
		return false;
	}
	/**可强化 */
	public canStreng() {
		if (this.isMaxLevel()) return false;
		let cfg = this.getStarCfg();
		if (!cfg || this.level >= cfg.levelLimit) return false;
		
		if (this.lvConsume && PropModel.isItemListEnough(this.lvConsume, 0)) {
			return true;
		}
		return false;
	}
	/**可升星 */
	public canStar() {
		if (this.isMaxStar()) return false;
		if (this.starConsume && PropModel.isItemListEnough(this.starConsume, 0)) {
			return true;
		}
		return false;

	}
	/**可镶嵌 */
	public canInlay() {
		let count = 0;
		for (let i = 0; i < this.holes.length; i++) {
			let id = this.holes[i].gemstoneId;
			if (id > 0) {
				count++;
			}
		}
		if (this.holeOpenNum > count) {
			let list = PropModel.getGemList(PropStoneType.ALL);
			if (list.length > 0) return true;
		}
		return false;
	}
}