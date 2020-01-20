// 剑阵
module com_main {
	export class JianzhenSkillAnimation extends BaseSkillAnimation{

		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo,battleSceneMgr,mapView,position,true);
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {
			super.frame_event(evt);
        }

        public createAnimation(avo: SkillAtkVo,position: egret.Point){
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			let animation = skilleffectData.animation;

			// let animation = "longjuanfen";

			let effectMC = new MCDragonBones();
			effectMC.initAsync(animation);
			effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);

            let unitinfo = BattleModel.getUnit(avo.attackData.id);
            if(unitinfo.faction == FactionType.ATK){
                effectMC.play("jianzhen_upRinht",1,this.isAutoRelease);
            }else{
                effectMC.play("jianzhen_leftDown",1,this.isAutoRelease);
            }
			// effectMC.play(skilleffectData.actionName,1,this.isAutoRelease);

			effectMC.x = position.x;
			effectMC.y = position.y;
			// this.addChild(effectMC);
			// BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
			BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
			this.effect = effectMC;

			// this.effect.scaleX = skilleffectData.scale;
			// this.effect.scaleY = skilleffectData.scale;
		}

	}
}