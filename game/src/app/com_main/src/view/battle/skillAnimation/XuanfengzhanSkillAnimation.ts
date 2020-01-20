module com_main {
	export class XuanfengzhanSkillAnimation extends BaseSkillAnimation{

        // public effectFeng :MCDragonBones;
        // public position : egret.Point;
		// public effectList:any[];		
		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			// this.effectList = [];
			this.createAnimation(avo);
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {
			super.frame_event(evt);
        }

        public createAnimation(avo: SkillAtkVo){
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			let animation = skilleffectData.animation;
			let targetUnitIdList = avo.targetList;

            let effectMC = new MCDragonBones();
            effectMC.initAsync(animation) ;
            let Obj:CSquare = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
            effectMC.play(animation,1,true);
            
            effectMC.x = Obj.x;
            effectMC.y = Obj.y;

            BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			this.effect = effectMC;

		}
	}
}