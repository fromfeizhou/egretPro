

/**攻击技能信息 */
class SkillAtkVo extends BaseClass implements IFObject {
	/** */
	public attackData: VoAttackData;//攻击者数据 攻击者元素ID(14位)+攻击者当前怒气(武将才有)（7位）+是否偏移坐标（1位）+X（8位）Z（7位）+方向（3位）
	/**当前使用技能id */
	public skillId: number;
	/**伤害默认段 (只有一段的会设为-1;  多段的从0开始) */
	public attIndex: number;
	/**攻击者瞬移到位置 */
	public attPos: number;
	/**伤害子段 */
	public attIndexChild: number;
	/**技能是否摇摆(-1不摇摆,0取消摇摆,1摇摆) */
	public isSwingSkill: number;
	/**是否瓢字 */
	public isFlyWord: boolean;
	/**目标列表 */
	public targetDataArr: VoTargetData[];
	/**召唤物列表 */
	public callCombatUnit: any[];
	/**作用特效位置数组 */
	public effPosArr: {x,y}[];
	/**buff */
	public add_buff_before: VoBuffOnSkill[];
	/**buff */
	public add_buff_after: VoBuffOnSkill[];
	/**场景buff */
	public add_scenebuff_before: VoBuffOnSceneEff[];
	/**场景buff */
	public add_scenebuff_after: VoBuffOnSceneEff[];
	/**冻结数据,用于处理暂停 */
	public frozenElement ;
	/**flowTime */
	public flowTime;

	public static create(body: gameProto.IRealTimeWar,flowTime: number) {
		let obj: SkillAtkVo = ObjectPool.pop(SkillAtkVo,"SkillAtkVo",body);
		obj.flowTime = flowTime;
		return obj;
	}

	public constructor(body: gameProto.IRealTimeWar) {
		super();
		this.init(body);
	}

	public init(attackInfo: gameProto.IRealTimeWar) {
		this.skillId = (attackInfo.skillData >> 10) & 0x1fffff;
        this.attIndex = (attackInfo.skillData >> 6) & 0xf;
        this.attIndexChild = (attackInfo.skillData >> 2) & 0xf;
        this.isSwingSkill = (attackInfo.skillData>>1) & 0x1;
        this.isFlyWord = (attackInfo.skillData & 0x1) > 0;

		this.targetDataArr = [];
		this.attackData = ObjectPool.pop( VoAttackData,"VoAttackData",attackInfo.attacker, attackInfo.attackerTroops);

		if(DEBUG){
			debugBatt("技能开始打印~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
			var str = "";
			if(this.isSwingSkill){
				str = "前摇";
			}else{
				str = "后摇";
			}
			
			
			var unit = BattleModel.getUnit(this.attackData.id);

			if(!unit) {
				return;
			}
			debugBatt( "攻击者id = "+this.attackData.id + "," + str , "名字:" , unit.getName() ,"当前血量 " + this.attackData.hp , "当前怒气  " + this.attackData.angry , str + "技能id  = "+this.skillId)
		}
		


		if (attackInfo.warTarget != null)
        {
			for(let target of attackInfo.warTarget){
				let targetdata: VoTargetData = ObjectPool.pop( VoTargetData,"VoTargetData",target);
                this.targetDataArr.push(targetdata);
				// battleDebug("targetId ,hp   attackHurt = ",targetdata.id,targetdata.hp,targetdata.attackHurt);
				if(DEBUG){
					let targetunit = BattleModel.getUnit(targetdata.id);

					if(targetunit) {
						debugBatt( "攻击者id = "+this.attackData.id + "," + str, " 受击:id = "+ targetdata.id + targetunit.getName() ,  str + "技能id  = "+this.skillId , "攻击伤害:" + targetdata.attackHurt,"目标血量："+targetdata.hp,"当前怒气  " + targetdata.angry);
					}else{
						debugBatt( "攻击者id = "+this.attackData.id + "," + str, " 受击:id = "+ targetdata.id  ,  str + "技能id  = "+this.skillId , "攻击伤害:" + targetdata.attackHurt,"目标血量："+targetdata.hp);
					}
				}
			}
        }
		/**召唤物列表 */
		this.callCombatUnit = attackInfo.callCombatUnit;

		let tempPos = attackInfo.centerPoint;

		this.effPosArr = [];
		for(let pos of tempPos)
		{
			let posx1 = (pos >> 16) & 0xff ;
			let posy1 = (pos >> 0) & 0x7f  ;
			let position = ISOMap.getInstance().leftDownCellToPixel(posx1/2,posy1/2);
			this.effPosArr.push({x: position[0], y: position[1]});
		}


		for(let buff of attackInfo.buff)
		{
			let bufdata:VoBuffOnSkill = ObjectPool.pop(VoBuffOnSkill,"VoBuffOnSkill", buff);
			if(bufdata.happenTime == 1)
			{
				if (!this.add_buff_after) {
					this.add_buff_after = [];
				}
				
				this.add_buff_after.push(bufdata);
			}
			else
			{
				if (!this.add_buff_before) {
					this.add_buff_before = [];
				}
				
				this.add_buff_before.push(bufdata);
			}

			BattleModel.addBuff({buffId:bufdata.bufId,elementId:bufdata.buId,buffSysId:bufdata.bufSysId});
		}
        

		
            for (let scenesBuff of attackInfo.scenesBuff)
            {
                let bufdata:VoBuffOnSceneEff = ObjectPool.pop(VoBuffOnSceneEff,"VoBuffOnSceneEff",scenesBuff);
                if (bufdata.happenTime == 1)
                {
                    if (!this.add_scenebuff_after) {
						this.add_scenebuff_after = [];
					}
                    this.add_scenebuff_after.push(bufdata);
                }
                else
                {
                    if (!this.add_scenebuff_before){
						this.add_scenebuff_before = [];
					} 
                    this.add_scenebuff_before.push(bufdata);
                }
            }
        
        this.frozenElement = attackInfo.frozenScenesElement;

		debugBatt("结束打印~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	}

	public get targetList(){
		return this.targetDataArr;
	}

	public getTargetId(){
		if(this.targetDataArr[0]){
			return this.targetDataArr[0].id;
		}
		debugBatt("没有攻击目标");
		return null;
	}

	public getOnePosition(){
		if(this.effPosArr.length > 1){
			console.log("多特效技能");
			console.log("this.effPosArr = ",this.effPosArr);
		}
		if(this.effPosArr.length){
			return this.effPosArr[0];
		}else{
			return ;
		}
	}

	public onDestroy() {	
		this.attackData.onDestroy();
		ObjectPool.push(this.attackData);

		for(let target of this.targetDataArr){
			target.onDestroy();
			ObjectPool.push(target)
		}
		this.targetDataArr = null;

		if(this.add_buff_after){
			for(let voBuff of this.add_buff_after) {
				voBuff.onDestroy();
				ObjectPool.push(voBuff);
			}
		}
		this.add_buff_after = null;

		if(this.add_buff_before){
			for(let voBuff of this.add_buff_before) {
				voBuff.onDestroy();
				ObjectPool.push(voBuff);
			}
		}
		this.add_buff_before = null;

		if(this.add_scenebuff_after) {
			for(let scenebuff of this.add_scenebuff_after) {
				scenebuff.onDestroy();
				ObjectPool.push(scenebuff);
			}
		}
		this.add_scenebuff_after = null;

		if(this.add_scenebuff_before) {
			for(let scenebuff of this.add_scenebuff_before) {
				scenebuff.onDestroy();
				ObjectPool.push(scenebuff);
			}
		}
		this.add_scenebuff_before = null;
	}

	public getSkillConfig() {
		return SkillData.getSkillConfig(this.skillId);
	}
}