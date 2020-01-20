// 剑阵
module com_main {
	export class DubLevelSkillAnimation extends BaseSkillAnimation{
        public effectList:any[];

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
            let aniName = skilleffectData.actionName.split('|');
            this.effectList = [];

            let obj:CSquare = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
            let [x,y] = obj.getMapXY();

            for(let i in aniName){
                let effectMC = new MCDragonBones();
                effectMC.initAsync(animation);
                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
                effectMC.play(aniName[i],1,this.isAutoRelease);
                effectMC.x = x;
                effectMC.y = y;
                this.effectList.push(effectMC);
                if(Number(i) == 0){
                    BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
                }else{
                    BattleSceneMgr.getInstance().addChildToEffect(effectMC);
                }
            }
            
		}

        public onDestroy(){
            if(this.effectList){
                for(let effect of this.effectList){
                    effect.destroy();
                }
            }
			
		}

	}
}