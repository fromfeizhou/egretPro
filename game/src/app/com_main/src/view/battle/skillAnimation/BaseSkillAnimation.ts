module com_main {
	export class BaseSkillAnimation {
		public avo: SkillAtkVo;
		public battleSceneMgr:BattleSceneMgr;
		public mapView: BaseMap;

		public effect:MCDragonBones;
		public isAutoRelease:boolean;
		public isPlayBuff = false;
		public battleSkillMgr: BattleSkillMgr;
		public m_hurtStageNum: number = 1;

		public constructor(avo: SkillAtkVo,battleSceneMgr?:BattleSceneMgr,mapView?: BaseMap,position?: egret.Point,isAutoRelease?:boolean) {
			this.avo = avo;
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			this.isAutoRelease = isAutoRelease;
			this.isPlayBuff = false;
			if(avo && battleSceneMgr){
				this.createAnimation(avo,position);
			}

			this.battleSkillMgr = BattleSkillMgr.getInstance();
			
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			this.m_hurtStageNum = skilleffectData.hurtStageNum;
		}

		public createAnimation(avo: SkillAtkVo,position: egret.Point){
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			let animation = skilleffectData.animation;

			// let animation = "longjuanfen";

			let effectMC = new MCDragonBones();
			effectMC.initAsync(animation);
			effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			effectMC.play(skilleffectData.actionName,1,this.isAutoRelease);

			effectMC.x = position.x;
			effectMC.y = position.y;
			// this.addChild(effectMC);
			// BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
			BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
			this.effect = effectMC;

			// this.effect.scaleX = skilleffectData.scale;
			// this.effect.scaleY = skilleffectData.scale;
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {

			if(evt.frameLabel == "shake"){
				EffectUtils.shakeScreen(this.mapView,4);

			} else if(evt.frameLabel == "shake_once_times"){
				EffectUtils.shakeScreen(this.mapView,5);
				
			} else if(evt.frameLabel == "shake_little_once_times"){
				EffectUtils.shakeScreen(this.mapView,6);

			} else if(evt.frameLabel == "hit_back"){ //击退
				this.dealMoveData();
			}else if(evt.frameLabel == "flyBlood"){
				this.dealFlyBoold();
			}
			// else if(evt.frameLabel == "hit_fly"){ //击飞
			// 	this.dealHitFly();
			// }
			else if(evt.frameLabel == "change_layer_down"){
				if(this.effect){
					// BattleSceneMgr.getInstance().addChildToEffect(this.effect);
				}
			}
        }

		/**飘血 */
		public dealFlyBoold(){
			for(let target of this.avo.targetList){
				let targetObj:CSquare = BattleSceneMgr.getInstance().getDynamicObj(target.id);
				this.dealFlyBooldSingle(targetObj,target);
			}
			this.dealBuff();
		}

		public dealBuff(){
			//处理buff
			if(this.avo.add_buff_after && !this.isPlayBuff){
				this.isPlayBuff = true;
				for(let buff of this.avo.add_buff_after){
					this.battleSkillMgr.addBuffEffect(buff);
				}
			}
		}

		public dealFlyBooldSingle(targetObj:CSquare,target:VoTargetData){
			if(!targetObj || !target){
				console.log("skillEnd  找不到 显示对象");
				return ;;
			}
			targetObj.changeHp(target.hp, Math.floor(target.attackHurt/this.m_hurtStageNum),true,false,target.attackStatus,true);
			if(targetObj.getUnitInfo().type == UnitType.GENERAL && targetObj.getUnitInfo().faction == FactionType.ATK){
				com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, {id : target.id , hp : target.hp, rage:target.angry ,flowTime:this.avo.flowTime});					
			}else{
				com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, {id : target.id , hp : target.hp ,flowTime:this.avo.flowTime});
			}
			// this.battleSkillMgr.dealAttackStatus(target,targetObj);
		}

		/**击飞 */
		public dealMoveData(){
			for(let target of this.avo.targetList){
				let targetObj = target as VoTargetData;
				// debug("击飞id " + targetObj.id);
				if(targetObj.moveData){
					let obj :CSquare = this.battleSceneMgr.getDynamicObj(targetObj.id);
					if(obj){
						this.battleSkillMgr.dealMoveData(targetObj,obj);
					}
				}
			}
		}
		
		public onDestroy(){
			Tween.removeTweens(this);
			if(this.effect){
				this.effect.destroy();
				this.effect = null;
			}
		}
	}
}