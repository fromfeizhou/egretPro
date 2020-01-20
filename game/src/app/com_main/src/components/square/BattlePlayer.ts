module com_main {
	export class BattlePlayer extends egret.DisplayObjectContainer{
		public generalId:number ;

		/**
		 * 士兵层
		 */
		protected m_pHero: CSquare;
		protected m_pSoldier: CSquare;

        protected m_pHero1: CSquare;
		protected m_pSoldier1: CSquare;

        protected m_squareList:CSquare[];

        protected m_positionList = [[150,294],[224,241],[445,104],[361,141]];

        protected m_centerList = [[241,217],[251,210],[358,153],[319,174]];

        protected m_dirList = [CSquare_Direction.RIGHT_UP,CSquare_Direction.RIGHT_UP,CSquare_Direction.LEFT_DOWN,CSquare_Direction.LEFT_DOWN];

        protected m_skillEffect :MCDragonBones;

		public constructor(generalId?:number) {
			super();
            this.m_squareList = [];
			this.generalId = generalId;
			this.initSquare();
            
		}

        public onDestroy(): void {
            if(this.m_skillEffect){
                this.m_skillEffect.destroy();
            }
            
            for(let i = 0; i <= 3; i++){
                let square = this.m_squareList[i];
                egret.Tween.removeTweens(square);
                square.onDestroy();
            }
        }

		public initSquare(){
			this.width = 600;
			this.height = 400;
			this.anchorOffsetX = this.width/2;
			this.anchorOffsetY = this.height/2;

            let heroList = [1001,1002];
            let positionList = this.m_positionList;

			let gconfig = GeneralModel.getGeneralConfig(1009) as GeneralConfig;
            let gCid = gconfig.ourModelCode as number;
            let armCfg = C.GeneralSoldierLvConfig[gconfig.armyType]
			let cid = armCfg.ourModelCode as number;

			this.m_pSoldier = CSquare.createId(cid,true,true);
			this.m_pSoldier.x = 150;
			this.m_pSoldier.y = 294;
			this.m_pSoldier.test = true;
			this.m_pSoldier.changeDirection(CSquare_Direction.RIGHT_UP);
			this.m_pSoldier.changeStatus(CSquare_Status.STATUS_STAND);
			this.addChild(this.m_pSoldier);
            this.m_squareList.push(this.m_pSoldier);

			this.m_pHero = CSquare.createId(gCid,true,true);
			this.m_pHero.x = 224;
			this.m_pHero.y = 241;
			this.m_pHero.test = true;
			this.m_pHero.changeStatus(CSquare_Status.STATUS_STAND);
			this.m_pHero.changeDirection(CSquare_Direction.RIGHT_UP);
			this.addChild(this.m_pHero);
            this.m_squareList.push(this.m_pHero);

            //////////////////////////////////////////////

            //右上小兵
            gconfig = GeneralModel.getGeneralConfig(1005) as GeneralConfig;
            armCfg = C.GeneralSoldierLvConfig[gconfig.armyType];
            gCid = gconfig.ourModelCode as number;
			cid = armCfg.ourModelCode as number;

			this.m_pSoldier1 = CSquare.createId(cid,true,true);
			this.m_pSoldier1.x = 445;
			this.m_pSoldier1.y = 104;
			this.m_pSoldier1.test = true;
			this.m_pSoldier1.changeDirection(CSquare_Direction.LEFT_DOWN);
			this.m_pSoldier1.changeStatus(CSquare_Status.STATUS_STAND);
			this.addChild(this.m_pSoldier1);
            this.m_squareList.push(this.m_pSoldier1);


            this.m_pHero1 = CSquare.createId(gCid,true,true);
			this.m_pHero1.x = 361;
			this.m_pHero1.y = 141;
			this.m_pHero1.test = true;
			this.m_pHero1.changeStatus(CSquare_Status.STATUS_STAND);
			this.m_pHero1.changeDirection(CSquare_Direction.LEFT_DOWN);
			this.addChild(this.m_pHero1);
            this.m_squareList.push(this.m_pHero1);

			// this.m_pHero1.addSoldierToMap();


		}

		public moveCenter(){
            let centerList = this.m_centerList;
            let positionList = this.m_positionList;
            for(let i in this.m_squareList){
                let square = this.m_squareList[i];
                square.manual = true;
                square.x = positionList[i][0];
                square.y = positionList[i][1];
                square.visible = true;
                square.changeDirection(this.m_dirList[i]);
                square.changeStatus(CSquare_Status.STATUS_WALK);

                egret.Tween.removeTweens(square);
                let tw = egret.Tween.get(square);
                tw.to({x: centerList[i][0],y: centerList[i][1]},this.calculateTime(new egret.Point(square.x,square.y),new egret.Point(centerList[i][0],centerList[i][1])));
                tw.call(()=>{
                    square.changeStatus(CSquare_Status.STATUS_ATTACK);
                })

                // if(Number(i) == 0){
                //     tw.call(()=>{
                //         this.playSkillEffect();
                //     })
                // }
            }

        }

        public returnInit(){
            let positionList = this.m_positionList;
            //右上小兵返回 
            let sq1 = this.m_squareList[0];
            let sq2 = this.m_squareList[1];
            sq1.visible = false;
            sq2.visible = false;

            for(let i = 2; i <= 3; i++){
                let square = this.m_squareList[i];
                square.changeStatus(CSquare_Status.STATUS_WALK);
                square.changeDirection(CSquare_Direction.RIGHT_UP);
                
                egret.Tween.removeTweens(square);
                let tw = egret.Tween.get(square);
                tw.to({x: positionList[i][0],y: positionList[i][1]},2000);
                tw.call(()=>{
                    // square.changeDirection(CSquare_Direction.LEFT_DOWN);
                    // square.changeStatus(CSquare_Status.STATUS_STAND);
                    // square.manualChangeStand(CSquare_Direction.LEFT_DOWN);
                    
                })
            }
            if(this.m_skillEffect){
                this.m_skillEffect.stop();
                this.m_skillEffect.visible = false;
            }
            
        }

        private calculateTime(point1:egret.Point,point2:egret.Point){
            let dis = egret.Point.distance(point1, point2);
            return dis/30*1000;
        }

        private playSkillEffect(){
            let effectMC :MCDragonBones;
            let animation = "luojian";
            if(this.m_skillEffect){
                effectMC = this.m_skillEffect;
            }else{
                effectMC = new MCDragonBones();
                effectMC.initAsync(animation) ;
                this.m_skillEffect = effectMC;
            }
            effectMC.visible = true;

			effectMC.play(animation,0,false);

			effectMC.x = this.width / 2;
			effectMC.y = this.height / 2;
			this.addChild(effectMC);
			
        }
			

	}
}