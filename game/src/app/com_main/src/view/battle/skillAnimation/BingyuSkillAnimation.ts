// 冰雨技能

module com_main {
	export class BingyuSkillAnimation extends BaseSkillAnimation{
		public effectList:any[];
        public playCount: number;
        public targetObjList: any[];
        public animation;
        public flyBloodTime ;
		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			this.effectList = [];
			this.createAnimation(avo);
            this.playCount = 0;
            this.flyBloodTime = 0;
		}

        
		protected frame_event(evt:dragonBones.FrameEvent)
        {
            if(evt.frameLabel == "flyBlood" && this.flyBloodTime == 0){
				this.dealFlyBoold();
                this.flyBloodTime += 1;
                return ;
            }
			super.frame_event(evt);
        }

		public timerCallback(){
			let targetObj = this.targetObjList[this.playCount];
            if(targetObj){
                let effectMC = new MCDragonBones();
                effectMC.initAsync(this.animation) ;
                effectMC.play(this.animation,1,true);

                effectMC.x = targetObj.x;
                effectMC.y = targetObj.y;

                BattleSceneMgr.getInstance().addChildToSuspension(effectMC,targetObj.y);
                this.effectList.push(effectMC);

                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
            }
            this.playCount += 1;
		}
        public createAnimation(avo: SkillAtkVo){
			let config = avo.getSkillConfig();
			let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			this.animation = skilleffectData.animation;
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
			// targetObjList.sort(sortFun);
            this.targetObjList = targetObjList;

            Utils.TimerManager.doTimer(80, this.targetObjList.length - 1, this.timerCallback, this);
            this.timerCallback();
		}

		public onDestroy(){
			// this.effect.destroy();
			Utils.TimerManager.remove(this.timerCallback, this);
			for(let effect of this.effectList){
				effect.destroy();
			}
		}
	}
}