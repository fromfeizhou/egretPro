// 魅惑技能

module com_main {
	export class MeihuoSkillAnimation extends BaseSkillAnimation{

		private effList: CEffect[] = []; //飞行特效队列

		public isDealBuff: boolean;
		public constructor(avo: SkillAtkVo,battleSceneMgr:BattleSceneMgr,mapView: BaseMap,position: egret.Point) {
			super(avo);
			this.battleSceneMgr = battleSceneMgr;
			this.mapView = mapView;
			this.isDealBuff = false;

			this.createAnimation(avo);
		}

        public createAnimation(avo: SkillAtkVo){
			let Obj:CSquare = this.battleSceneMgr.getDynamicObj(avo.attackData.id);
			let [objX,objY] = Obj.getMapXY();
			let targetUnitIdList = avo.targetList;

			for(let i in targetUnitIdList){
				let targetObj = this.battleSceneMgr.getDynamicObj(targetUnitIdList[i].id);
				if(targetObj){

					let tx = targetObj.x;
					let ty = targetObj.y - 40;

					let ax = objX;
					let ay = objY - 50;

					let eff = CEffectFunc.addEffect(122);
					this.effList.push(eff);
					eff.x = ax;
					eff.y = ay;
					let radian: number = Utils.MathUtils.getRadian2(ax, ay, tx, ty);
					let angle: number = Utils.MathUtils.getAngle(radian);
					eff.rotation = angle;
					eff.play();

					let speed = 1200; //飞行速度
					let dis = MathUtils.getInstance().getDistance(ax, ay, tx, ty)
					let time = dis / speed * 1000;
					egret.Tween.get(eff).to({x:tx ,y:ty},time).call(()=>{
						if(targetObj && targetObj.getUnitInfo() && targetObj.addEffect){
							this.dealFlyBooldSingle(targetObj,targetUnitIdList[i]);
							targetObj.addEffect(121);
							if(!this.isDealBuff){
								this.isDealBuff = true;
								this.dealBuff();
							}
						}
						Utils.removeFromParent(eff);
					});

				}
			}

		}

		public onDestroy(){
			for(let i of this.effList){
				egret.Tween.removeTweens(i);
			}
			this.effList = null;
		}
	}
}