/** 战斗单位信息 */
class UnitInfoVo extends egret.HashObject implements IFObject {
	/** 唯一ID */
	public elementId: number;
	/** 配置表ID  */
	public sysId: number;
	/** 类型 1-主将,2-士兵 */
	public type: UnitType;
	/** 攻守方 1-攻(左边)  2-守（右边） */
	public faction: FactionType;
	/** 当前兵力 */
	public troops: number;
	/** 兵力上限 */
	public maxTroops: number;
	/** 当前怒气 */
	public anager: number;
	/** 坐标 */
	public m_position: egret.Point;
	/** 初始化buff列表 buffId(14位)+buffSysId(22位) */
	public initBuffList: number[];
	/** 移动速度（默认500） */
	public moveSpeed: number;
	/**坐标 */
	public xy:number;

	
	/** 地形伤害加成 */
	public terrainHurtAffix: number;
	/** 地形伤害减免 */
	public terrainHurtRemit: number;
	
	/** 武将模型ID */
	public generalModelId:number;
	/** 武将名字 */
	public generalName:string;
	/**兵种 */
	public soldierType:SoldierMainType;
	/**士兵等级 */
	public soldierLv: number;

	/** 关联武将配置表名字 */
	public generalId:number;

	/**
	 * 归属武将elementId
	 */
	public belongUId: number;

	/**移动目标点 */
	public targetPosition;
	
	/**兵种 */
	public belongType: BelongType;

	/**位置 */
	public heroPosition: number;

	public static create(body?: gameProto.ICombatUnit) {
		let obj: UnitInfoVo = new UnitInfoVo(body);
		return obj;
	}

	public constructor(body?: gameProto.ICombatUnit) {
		super();
		this.init(body);
	}

	public init(body?: gameProto.ICombatUnit) {
		this.m_position = null;
		if (body) {
			let keys: Array<string> = [
				"elementId","sysId","type","troops","maxTroops","anager",
				"initBuffList","moveSpeed","terrainHurtAffix","terrainHurtRemit",
				"generalName","xy","faction","soldierType","generalId","belongUId","soldierLv","heroPosition"
			];

			for (let ind in keys) {
				let key = keys[ind];
				this[key] = body[key];
			}
			
			this.belongType = BattleModel.getBelongTypeByFaction(this.faction);
			//小兵
			if(this.type == UnitType.SOLDIER){
				let armyConfig:GeneralSoldierLvConfig = C.GeneralSoldierLvConfigDic[this.soldierType][this.soldierLv];
				if(this.belongType == BelongType.OWN){
					this.generalModelId = armyConfig.ourModelCode;
				}else{
					this.generalModelId = armyConfig.enemyModelCode;
				}
			}

			// if(this.type == UnitType.BUILDING_WALL || this.type == UnitType.BUILDING_BARTIZAN || this.type == UnitType.ZHAO_HUAN_WU){
			// 	this.generalModelId = 1001;
			// }

			
			if(this.type == UnitType.GENERAL){
				let generalConfig:GeneralConfig = C.GeneralConfig[this.generalId];
				if(generalConfig){
					this.generalModelId = generalConfig.ourModelCode;
					this.sysId = this.generalId;
				}else{
					error("this.generalId ", this.generalId);
				}
			}

			this.setSpeed(this.moveSpeed);

			/**临时城墙 */
			if(this.type == UnitType.BUILDING_WALL){
				this.generalName = GCode(CLEnum.WAR_WALL);
				this.m_position = new egret.Point(1000,675);
			}

			/**临时箭塔 */
			if(this.type == UnitType.BUILDING_BARTIZAN){
				this.generalName =  GCode(CLEnum.WAR_BARTIZAN);
			}
			
		}

	}

	public onDestroy() {
	}

	public get position(){
		if(!this.m_position){
			let posx1 = (this.xy >> 16) & 0xff;
			let posy1 = (this.xy >> 0) & 0x7f;
			let position = ISOMap.getInstance().leftDownCellToPixel(posx1,posy1);

			/**临时城墙 箭塔 */
			if(this.type == UnitType.BUILDING_BARTIZAN){
				this.m_position = egret.Point.create(position[0],position[1] - 80); //new egret.Point(position[0],position[1] - 80);
			}else{
				this.m_position = egret.Point.create(position[0],position[1]);//new egret.Point(position[0],position[1]);
			}
		}
		return this.m_position;
	}

	public setCellXY(xy:number){
		this.xy = xy;
	}

	public get cellXY():[number,number]{
		let posx1 = (this.xy >> 16) & 0xff;
		let posy1 = (this.xy >> 0) & 0x7f;
		return [posx1,posy1];
	}

	public getCellXY():[number,number]{
		let posx1 = (this.xy >> 16) & 0xff;
		let posy1 = (this.xy >> 0) & 0x7f;
		return [posx1,posy1];
	}

	public set position(pos: egret.Point){
		if(this.m_position){
			this.m_position.x = pos.x;
			this.m_position.y = pos.y;
		}else{
			this.m_position = pos.clone()
		}
	}

	public setHp(val: number) {
		this.troops = val;
	}

	public getHp() {
		return this.troops;
	}

	public getMaxHp(){
		return this.maxTroops;
	}

	public getLoseHp() {
		// return this.m_pLoseHp;
		return 0;
	}

	public getPercentHP() {
		let perhp = this.getHp() / this.maxTroops;
		return perhp;
	}

	/** 设置当前点 */
	public setPosition(pos: egret.Point) {
		this.m_position = pos;
	}

	/** 设置目标点 */
	public setTargetPosition(pos: egret.Point) {
		// this.targetPosition = pos;
	}

	// /**设置逃跑速度 */
	// public setEscape(){
	// 	this.moveSpeed = this.moveSpeed*2;
	// }


	public getBattlePlayer() {
		// let playerInfo = BattleModel.getBattlePlayer(this.playerId2);
		// // if (isNull(playerInfo)) {
		// // 	let vplayer = BattleModel.getVirtualPlayer(this.playerId2);
		// // 	if (vplayer) playerInfo = vplayer.toBattlePlayerInfoVo();
		// // }
		// return playerInfo;

		return null;
	}

	// public getUnitConfig() {
	// 	if (!this.m_pConfig) this.m_pConfig = UnitData.getConfig(this.type, this.tmplId);
	// 	return this.m_pConfig;
	// }

	public setSpeed(speed: number){
		this.moveSpeed = speed;
	}

	public getMainType(): SoldierMainType {
		return this.soldierType;
	}

	public getName(){
		let name = ""

		if(this.faction == FactionType.ATK){
			name = name + GCode(CLEnum.WAR_ATTACK);
		}else{
			name = name + GCode(CLEnum.WAR_DEFENSE);
		}


		if(this.type == 1){
			name = name +  GCode(CLEnum.WAR_GEN);;
		}else if(this.type == 2){
			name = name +  GCode(CLEnum.WAR_SOLDIER);;
		}

		return name + this.generalName;
	}

	public getBelongUid(){
		if(this.belongUId){
			return this.belongUId;
		}
		return 0;
	}
}