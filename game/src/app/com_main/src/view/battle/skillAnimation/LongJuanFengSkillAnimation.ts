module com_main {
	export class LongJuanFengSkillAnimation extends BaseSkillAnimation{

		public effectList:any[];		
		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			this.effectList = [];
			this.createAnimation(avo);
		}

		protected frame_event(evt:dragonBones.FrameEvent)
        {
			super.frame_event(evt);
			if(evt.frameLabel == "qifengEnd"){
                Utils.TimerManager.doTimer(800, 1, this.timerCallback, this);

				for(let effect of this.effectList){
					effect.play("xunhuan",-1,false);
				}
			}else if(evt.frameLabel == "end"){

			}
        }

		public timerCallback(){
			for(let effect of this.effectList){
				effect.play("end",1,true);
			}
		}
        public createAnimation(avo: SkillAtkVo){
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			let animation = skilleffectData.animation;
			let targetUnitIdList = avo.targetList;

			//根据y层级排序
			function sortFun(a,b){
				if(a.y > b.y){
					return 1;
				}else if(a.y < b.y){
					return -1;
				}else{
					return 0;
				}
			}

			let targetObjList = [];
			for(let i in targetUnitIdList){
				let targetObj = this.battleSceneMgr.getDynamicObj(targetUnitIdList[i].id);
				targetObjList.push(targetObj);
			}
			targetObjList.sort(sortFun);

			// console.log("targetObjList =",targetObjList);

			for(let i in targetObjList){
				let targetObj = targetObjList[i];
				if(targetObj){
					let effectMC = new MCDragonBones();
					effectMC.initAsync(animation) ;
					effectMC.play(animation,1,false);

					effectMC.x = targetObj.x;
					effectMC.y = targetObj.y;

					BattleSceneMgr.getInstance().addChildToSuspension(effectMC,targetObj.y);
					this.effectList.push(effectMC)
				}
			}
			this.effect = this.effectList[0];
			if(this.effect)
				this.effect.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);

		}

		public onDestroy(){
			Utils.TimerManager.remove(this.timerCallback, this);
			for(let effect of this.effectList){
				effect.destroy();
			}
		}
	}
}