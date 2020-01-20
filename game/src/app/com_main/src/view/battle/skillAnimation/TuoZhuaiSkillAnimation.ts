module com_main {
	export class TuoZhuaiSkillAnimation extends BaseSkillAnimation{

        // public effectFeng :MCDragonBones;
        // public position : egret.Point;
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
			// if(evt.frameLabel == "shake"){
			// 	EffectUtils.shakeScreen(this.mapView,2);
			// }else if(evt.frameLabel == "flyBlood"){
				
			// 	for(let i in this.avo.unitAttrChange){
			// 		let attrChange = this.avo.unitAttrChange[i];
			// 		this.battleSceneMgr.unitAttrChange(BattleUnitAttrChangeVo.create(attrChange));
			// 	}
			// }
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
				let targetObj:CSquare = targetObjList[i];
                let unitinfo = targetObj.getUnitInfo();
				let effectMC = new MCDragonBones();
				effectMC.initAsync(animation) ;

                // console.log("unitinfo.faction = ",unitinfo.faction);
                if(unitinfo.faction == FactionType.ATK){
                    effectMC.play("leftDown",1,true);
                }else{
                    effectMC.play("RightUp",1,true);
                }
				

				effectMC.x = targetObj.x;
				effectMC.y = targetObj.y;
				// this.addChild(effectMC);
				// BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
				BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
				this.effectList.push(effectMC)
			}
			this.effect = this.effectList[0];
			this.effect.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);

		}

		public onDestroy(){
			this.effect.destroy();
			for(let effect of this.effectList){
				effect.destroy();
			}
		}
	}
}