module com_main {
	export class BaguaSkillAnimation extends BaseSkillAnimation{
		// public avo: SkillAtkVo;
		// public battleSceneMgr:BattleSceneMgr;
		// public mapView: BaseMap;

		// public effect:MCDragonBones;

		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			this.createAnimation(avo,position);
		}

		public createAnimation(avo: SkillAtkVo,position: egret.Point){
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			let animation = skilleffectData.animation;

			let effectMC = new MCDragonBones();
			effectMC.initAsync(animation) ;
			effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			effectMC.play(animation,1,false);

			effectMC.x = position.x;
			effectMC.y = position.y;
			// this.addChild(effectMC);
			BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
			// BattleSceneMgr.getInstance().addChildToEffect(effectMC);
			this.effect = effectMC;
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {
			super.frame_event(evt);
			if(evt.frameLabel == "start"){
				this.effect.play("repeat",-1,false);
				let skilldata = this.avo.getSkillConfig();
				// Utils.TimerManager.doTimer(skilldata.playTime, 1, this.timerCallback, this);
			}else if(evt.frameLabel == "repeat"){
				this.effect.play("end",1,true);
			}else if(evt.frameLabel == "end"){
			}
			// else if(evt.frameLabel == "shake"){
			// 	EffectUtils.shakeScreen(this.mapView,2);
			// }else if(evt.frameLabel == "flyBlood"){
			// 	// EffectUtils.shakeScreen(this.mapView,2);
				
			// 	for(let i in this.avo.unitAttrChange){
			// 		let attrChange = this.avo.unitAttrChange[i];
			// 		this.battleSceneMgr.unitAttrChange(BattleUnitAttrChangeVo.create(attrChange));
			// 	}
			// 	console.log("this.avo.unitAttrChange  = ",this.avo.unitAttrChange);
			// }
        }

		public timerCallback(){
			this.effect.play("end",1,true);
		}
	}
}