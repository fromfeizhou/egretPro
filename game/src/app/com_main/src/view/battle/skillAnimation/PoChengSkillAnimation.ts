// TypeScript file


//普通技能动画
//包括 雷电
module com_main {
	export class PoChengSkillAnimation extends BaseSkillAnimation{
        public light: number = 0;
		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
            position.x = 1178; 
            position.y = 605; 

            this.mapView = mapView;
            this.battleSceneMgr = battleSceneMgr;

            this.createAnimation(avo,position);
            Tween.get(this).to({lightNum: 1},100)
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {
			super.frame_event(evt);
        }

        public createAnimation(avo: SkillAtkVo,position: egret.Point){
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			let animation = skilleffectData.animation;

			let effectMC = new MCDragonBones();
			effectMC.initAsync(animation);
			effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			effectMC.setCallback(this.recoveryColor,this);


			effectMC.x = position.x;
			effectMC.y = position.y;
			// this.addChild(effectMC);
			// BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
			BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
			this.effect = effectMC;

            this.effect.play(skilleffectData.actionName,1,true);
            

			// this.effect.scaleX = skilleffectData.scale;
			// this.effect.scaleY = skilleffectData.scale;
		}

        public recoveryColor(){
            Tween.removeTweens(this);
            Tween.get(this)
            .to({lightNum: 0},500)
        }

        
		public set lightNum(num: number){
            this.light = num;
			let g = -58 * num;
			let b = -47 * num;
            var colorMatrix = [
                1,0,0,0,0 ,
                0,1,0,0,g,
                0,0,1,0,b,
                0,0,0,1,0
            ];

            var fliter = new egret.ColorMatrixFilter(colorMatrix);
            // this.mapView.filters = [fliter];

            // if(num == 0){
            //     this.mapView.filters = [];
            // }

            this.battleSceneMgr.setColor(fliter);
        }

        public get lightNum(){
            return this.light;
        }
	}
}