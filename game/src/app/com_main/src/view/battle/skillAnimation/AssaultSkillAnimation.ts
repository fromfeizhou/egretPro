/**
 * 赵云突刺技能
 */
module com_main {
	export class AssaultSkillAnimation extends BaseSkillAnimation{

        public static tatolIndex = 3;
        public m_targetList :Array<Array<any>>;
        public m_attIndex = 0;
        public m_totalAttIndex = 4;
        public m_clientPlayIndex = -1;

        public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
            this.m_targetList = [];
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			this.createAnimation();
            this.setTargetList(this.avo);
		}


        public createAnimation(){
            if(this.avo.attackData.isOffSet > 0){
                let attackObj:CSquare = BattleSceneMgr.getInstance().getDynamicObj(this.avo.attackData.id);
                let position = ISOMap.getInstance().leftDownCellToPixel(this.avo.attackData.toPosX,this.avo.attackData.toPosY);

                let angle: number = Utils.MathUtils.getPosAngle({x:attackObj.x,y:attackObj.y}, {x:position[0],y:position[1]});
                if(attackObj){
                    // Tween.get(attackObj).wait(200).to({x:position[0], y:position[1]},300);
                    attackObj.setDirectionOnAngle(angle);
                }

                let config = this.avo.getSkillConfig();
                let skilleffectData = C.ShowSkillEffectConfig[config.skillEffectId];
                let animation = skilleffectData.animation;

                let effectMC = new MCDragonBones();
                effectMC.initAsync(animation);
                effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);

                let actionName = ""
                if(this.avo.attIndex == 0){
                    actionName = "chong_0";
                }else if (this.avo.attIndex < AssaultSkillAnimation.tatolIndex){
                    actionName = "chong_1";
                }else{
                    actionName = "chong_2";
                }
                effectMC.play(actionName ,1,true);
                // + CSquareFunc.getEffectDirectionByRotation(angle)

                effectMC.x = attackObj.x;
                effectMC.y = attackObj.y - 50;
                BattleSceneMgr.getInstance().addChildToSuspension(effectMC);

                this.effect = effectMC;
                // this.effect.scaleX = skilleffectData.scale;
                // this.effect.scaleY = skilleffectData.scale;

                //角度
                this.effect.rotation = angle;
                if((angle > 90 && angle <= 180) || (angle >= -180 && angle < -90) ){
                    this.effect.scaleY = -1;
                }
            }
        }

        protected frame_event(evt:dragonBones.FrameEvent){
            super.frame_event(evt);
            let attackObj:CSquare = BattleSceneMgr.getInstance().getDynamicObj(this.avo.attackData.id);
            let position = ISOMap.getInstance().leftDownCellToPixel(this.avo.attackData.toPosX,this.avo.attackData.toPosY);
            if(evt.frameLabel == "move"){
                if(attackObj){
                    Tween.get(attackObj).to({x:position[0], y:position[1]},200);
                    Tween.get(this.effect).to({x:position[0], y:position[1] - 50},200);
                }
            }

            for(let i = 0; i <= 3; i++){
                if(evt.frameLabel == "step_"+i){
                    this.dealSetp(i);
                    this.m_clientPlayIndex = i;
                }
            }

            if(evt.frameLabel == "end"){
                this.battleSceneMgr.removeEffect(this);
                this.onDestroy();
            }
        }

        public dealSetp(i){
            this.avo.targetDataArr = this.m_targetList[i] || [];
            debug("step_" + i,this.m_targetList[i]);
            this.dealFlyBoold();
            this.dealMoveData();

            let allNum = 0;
            let jifeiNum = 0;
            let jiTuiNum = 0;
            let siwangNum = 0;
            for(let target of this.avo.targetDataArr){
                allNum += 1;
                let targetObj = target as VoTargetData;
                if(targetObj.moveData && targetObj.moveData.moveType == EnumHurtMoveType.JF){
                    jifeiNum += 1;
                }else if(targetObj.moveData && targetObj.moveData.moveType == EnumHurtMoveType.JT_BACK){
                    jiTuiNum += 1;
                }
                if(targetObj.hp == 0){
                    siwangNum += 1;
                    // console.log("死亡" + targetObj.id);
                }
            }
            debug("打中 " + allNum, "击飞 "+ jifeiNum, "击退 "+ jiTuiNum, "死亡 "+siwangNum );
        }

        public setTargetList(avo: SkillAtkVo){
            if(this.avo.attIndex != avo.attIndex ){
                return ;
            }
            this.m_attIndex += 1;
            this.m_targetList[avo.attIndexChild] = avo.targetList;

            if(avo.attIndexChild <= this.m_clientPlayIndex){
                this.dealSetp(avo.attIndexChild);
            }
        }


    }
}