module com_main {
	export class LiefengSkillAnimation extends BaseSkillAnimation{

        // public effectFeng :MCDragonBones;
        // public position : egret.Point;
		public effectList:any[];		
        public isStart = false;
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
            if(evt.frameLabel == "startFrame" && !this.isStart){
                this.skillEffect();
            }
			// if(evt.frameLabel == "shake"){
			// 	EffectUtils.shakeScreen(this.mapView,2);
			// }else if(evt.frameLabel == "startFrame" && !this.isStart){
            //     this.skillEffect();
            // }else if(evt.frameLabel == "flyBlood"){
				
			// 	for(let i in this.avo.unitAttrChange){
			// 		let attrChange = this.avo.unitAttrChange[i];
			// 		this.battleSceneMgr.unitAttrChange(BattleUnitAttrChangeVo.create(attrChange));
			// 	}
			// }
        }

        public createAnimation(avo: SkillAtkVo){
			// let config = avo.getSkillConfig();
            // let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
			// let animation = skilleffectData.animation;
			// let targetUnitIdList = avo.targetUnitIdList;

            // let effectMC = new MCDragonBones();
            // this.effect = effectMC;
            // effectMC.initAsync(animation) ;

            // let Obj:CSquare = this.battleSceneMgr.getDynamicObj(avo.unitId);

            // effectMC.play(animation,2,true);

            // effectMC.x = Obj.x;
            // effectMC.y = Obj.y - 300;
            
            // // if(Obj.getUnitInfo().faction == FactionType.ATK){
            // //     effectMC.x = 856;
            // //     effectMC.y = 282;
            // // }else{
            // //     effectMC.x = 428;
            // //     effectMC.y = 346;
            // // }
            
            // BattleSceneMgr.getInstance().addChildToSuspension(effectMC);
            // effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);

		}

        public skillEffect(){
            // this.isStart = true;

            // let x = this.effect.x;
            // let y = this.effect.y;

            // for(let i in this.avo.targetUnitIdList){
            //     let targetObj:CSquare= this.battleSceneMgr.getDynamicObj(this.avo.targetUnitIdList[i]);
            //     if(targetObj && targetObj.flySoldierList){
            //         let soldierList = targetObj.flySoldierList();
            //         for(let soldier of soldierList){
            //             let ranx = x + Utils.random(-40,40);
            //             let rany = y + Utils.random(-40,40);
            //             let tmpScrPos:Point = new Point(soldier.x,soldier.y);
            //             let tmpCtrlPos:Point ; //new Point(x + 80,soldier.y+100 );
            //             if(soldier.x > ranx){       
            //                 tmpCtrlPos = new Point(x + 80,soldier.y-100 );
            //             }else{
            //                 tmpCtrlPos = new Point(x - 80,soldier.y-100 );
            //             }
            //             let tmpDstPos:Point = new Point(ranx,rany);
                        
            //             let itemObj = {item:soldier, lerp : 0}
            //             var funcChange = function():void{
            //                 let curPos:Point = Utils.BezierCurve(tmpScrPos,tmpDstPos,tmpCtrlPos,itemObj.lerp);
            //                 itemObj.item.x = curPos.getX();
            //                 itemObj.item.y = curPos.getY();
            //             }

            //             let moveTime:number = 700;
            //             egret.Tween.get(itemObj,{onChange:funcChange})               
            //             .to({lerp:1}, moveTime)

            //             soldier.scaleX = 1.5; 
            //             soldier.scaleY = 1.5; 
            //             egret.Tween.get(soldier)
            //             .to({scaleX:0.5,scaleY:0.5}, moveTime,egret.Ease.quintIn)
            //             .call(()=>{soldier.visible = false});
            //         }
            //     }
                
            // }
        }
	}
}