/**战斗属性改变 */
class BattleUnitAttrChangeVo extends egret.HashObject implements IFObject {
	/**玩家主键 */
	public unitId: number;
	/**血量 */
	public HP: number[];
	/**速度 */
	public speed: number;
	/**仅在血量变化时有效,造成单位血量变化的玩家ID(如果玩家不存在,则为-1) */
	//zb
	public changerPlayerId = 0;
	/**相关技能编号,如果该属性改变是由技能引起时有意义 */
    public skillId: number;

	public speedType: SpeedType;
	/**造成单位血量变化的兵种的大类 */
    public armyMainType: number;
	/**造成单位血量变化的武将的id */
    public generalId: number;
	/**攻击结果,暴击、闪避等 */
    public result: AttackResult;
	/**使用技能者 */
	public useSkillUnitId:number;

	public static create(body?: any) {
		let obj: BattleUnitAttrChangeVo = new BattleUnitAttrChangeVo(body);
		return obj;
	}

	public constructor(body?: any) {
		super();
		if (body) {
			this.init(body);
		} else {
			this.onDestroy();
		}
	}

	public init(body?: any) {
		let keys: Array<string> = ["unitId", "HP", "speed"
			, "changerPlayerId", "skillId", "speedType"
			, "armyMainType", "generalId", "result","useSkillUnitId"];
		for (let ind in keys) {
			let key = keys[ind];
			let val = body[key];
			this[key] = val;
			if (val != undefined) {
				if (key == "changerPlayerId") {
					//zb
					// this[key] = Long.fromValue(val);
					this[key] = val;
				}
			}
		}

		let name = BattleModel.getUnitNameUnitId(body.unitId);
		if(!name){
			return;
		}

		let useSkillname = BattleModel.getUnitNameUnitId(body.useSkillUnitId);

		let skillConfig = SkillData.getSkillConfig(this.skillId);
		let skillName = "未知";
		if(skillConfig){
			skillName = skillConfig.name;
		}

		let loseHp = BattleModel.getUnit(body.unitId).getHp() - this.HP[0];

		let resultType = "";

		if (this.result == AttackResult.CRIT) {
			resultType = "暴击";
		} else if (this.result == AttackResult.DODGE) {
			resultType = "闪避";
		} else if (this.result == AttackResult.IMMUNE) {
			resultType = "免疫";
		} else if (this.result == AttackResult.DES_DEFENSE) {
			resultType = "破防";
		} else if (this.result == AttackResult.CRIT_ADD_DES_DEFENSE) {
			resultType = "暴击加破防";
		}

		console.log(useSkillname + "使用技能 " + skillName + "  打了 " + name + " " + loseHp + "血" + "  剩下 "+this.HP[0] + "血" + "  " +resultType);
	}

	public onDestroy() {
		this.unitId = null;
		this.HP = null;
		this.speed = null;
		this.changerPlayerId = null;
		this.skillId = null;
		this.speedType = null;
		this.armyMainType = null;
		this.generalId = null;
	}

	public getHp(ind: number = 0) {
		if (this.HP) return this.HP[ind];
		return 0;
	}
}