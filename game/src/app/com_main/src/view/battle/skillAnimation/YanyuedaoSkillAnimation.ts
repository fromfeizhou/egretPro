module com_main {
	export class YanyuedaoSkillAnimation extends BaseSkillAnimation{
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
			// let animation = "yanYueDao";
			let targetUnitIdList = avo.targetList;

            
            let effectMC = new MCDragonBones();
            effectMC.initAsync(animation) ;

            let Obj:CSquare = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
            let actionName = "";
            let dir = Obj.getFourDirection();
            if(dir == CSquare_Direction.LEFT_UP ){
                actionName = "leftUp";
            }else if(dir == CSquare_Direction.LEFT_DOWN){
                actionName = "leftDown";
            }else if(dir == CSquare_Direction.RIGHT_DOWN){
                actionName = "rightDown";
            }else if(dir == CSquare_Direction.RIGHT_UP){
                actionName = "rightUp";
            }
            effectMC.play(actionName,1,true);
            
            let [x,y] = Obj.getMapXY();
            effectMC.x = x;
            effectMC.y = y;

            BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
            this.effect = effectMC;
		}
	}
}