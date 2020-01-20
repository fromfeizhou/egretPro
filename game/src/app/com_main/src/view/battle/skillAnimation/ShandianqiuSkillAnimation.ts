// 雷电技能

module com_main {
	export class ShandianqiuSkillAnimation extends BaseSkillAnimation{
		public effectList:any[];
        public playCount: number;
        public targetObjList: CSquare[];
        public animation:string;
		public actionName: string;
        public flyBloodTime:number ;
		public shakeNum: number = 0;
		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			this.effectList = [];
            this.playCount = 0;
            this.flyBloodTime = 0;

			this.createAnimation(avo);
		}

        
		protected frame_event(evt:dragonBones.FrameEvent)
        {
			let isShake = (evt.frameLabel == "shake" || evt.frameLabel == "shake_once_times" || evt.frameLabel == "shake_little_once_times");
			// 震动规则 只震动一次
			if(this.shakeNum % 3 != 0 && isShake){
				this.shakeNum += 1;
				return;
			} else if(isShake){
				this.shakeNum += 1;
			}

            if(evt.frameLabel == "flyBlood"){
                let targetCsq = this.targetObjList[this.flyBloodTime];
				if(targetCsq && targetCsq.getUnitInfo()){
					this.dealFlyBooldSingle(targetCsq,this.getTargetVo(targetCsq.getUnitInfo().elementId));
				}
                
				if(this.flyBloodTime == 0){
					this.dealBuff();
				}
                this.flyBloodTime += 1;				
            }else{
                super.frame_event(evt);
            }
        }

        public getTargetVo(id:number):VoTargetData{
            for(let target of this.avo.targetList){
                if(target.id == id){
                    return target;
                }
            }
        }

		public timerCallback(){
			let targetObj = this.targetObjList[this.playCount];
            if(targetObj){
                let effectMC = new MCDragonBones();
                effectMC.initAsync(this.animation) ;
                effectMC.play(this.actionName,1,true);

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
			if(config.skillEffectId == 134){
				let Obj:CSquare = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
				let list = [6,7,8,1]; //右上方向
				if(list.indexOf(Obj.getDirection()) != -1){
					this.actionName = 'flxf_fx_1';
				}else{
					this.actionName = 'flxf_fx_2';
				}
			}else{
				this.actionName = skilleffectData.actionName;
			}
			
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
            this.targetObjList = targetObjList;

			if(config.skillEffectId == 134){
				Utils.TimerManager.doTimer(225, this.targetObjList.length - 1, this.timerCallback, this);
			}else{
				Utils.TimerManager.doTimer(30, this.targetObjList.length - 1, this.timerCallback, this);
			}
            
            this.timerCallback();
		}

		public onDestroy(){
			Tween.removeTweens(this);
			Utils.TimerManager.remove(this.timerCallback, this);
			for(let effect of this.effectList){
				effect.destroy();
			}
		}
	}
}