module com_main {
	export class BattleGeneralHeadInfo extends eui.Component{

		public hpBg_image:eui.Image;
        public soldierNum_image:eui.Image;
        public HP_image:eui.Image;
        public m_lbName:eui.Label;
        public soliderNum:eui.Group;
        public generalType:eui.Image;

		private m_pUnitInfo: UnitInfoVo;
        private m_curSoldierNum: number;
        private m_targerNum: number;
        private m_isBlooding: boolean; //是否掉血中

		public constructor(unitInfo?: UnitInfoVo) {
			super();
            this.m_pUnitInfo = unitInfo;

            this.width = 136;
            this.height = 52;

            this.hpBg_image = new eui.Image("proBg_016_png");
            this.hpBg_image.width = 72;
            this.hpBg_image.height = 7;
            this.hpBg_image.x = 36;
            this.hpBg_image.y = 29;
            this.hpBg_image.scale9Grid = new egret.Rectangle(4,3,2,3);
            this.addChild(this.hpBg_image);

            this.HP_image = new eui.Image("pro_017_png");
            this.HP_image.x = 37;
            this.HP_image.y = 30;
            this.HP_image.width = 70;
            this.HP_image.height = 5;
            this.addChild(this.HP_image);

            this.m_lbName = new eui.Label();
            this.m_lbName.textColor = 0x00C6FF;
            this.m_lbName.size = 18;
            this.m_lbName.fontFamily = "Microsoft YaHei";
            this.m_lbName.text = "";
            this.m_lbName.x = 53;
            this.m_lbName.y = 7;
            this.m_lbName.stroke = 2;
            this.m_lbName.strokeColor = 0x000000;
            this.m_lbName.horizontalCenter = 3;

            this.addChild(this.m_lbName);

            let group = new eui.Group();
            group.x = 20;
            group.y = 25-3;
            group.width = 23;
            group.height = 23;
            this.addChild(group);

            let image = new eui.Image("border_016_png");
            image.x = 2.15;
            image.y = 2.8;
            image.scaleX = image.scaleY = 0.33;
            group.addChild(image);
            
            this.generalType = new eui.Image("general_type_bubing2_png");
            this.generalType.x = 0.4;
            this.generalType.y = -1.7;
            this.generalType.scaleX = this.generalType.scaleY = 0.5;
            group.addChild(this.generalType);


            if(!this.m_pUnitInfo){
				// this.showPlayerName();
				return ;
			}

			this.setPlayerName();
			this.initHP();
            this.initTypeIcon();

		}

		// public onDestroy() {
		// 	super.onDestroy();
		// 	this.removeFromParent();
		// 	this.m_pUnitInfo = null;
        //     // Utils.TimerManager.remove(this.removeOneSoldier,this)
		// }
		// protected childrenCreated(): void {
		// 	super.childrenCreated();

		// 	if(!this.m_pUnitInfo){
		// 		// this.showPlayerName();
		// 		return ;
		// 	}

		// 	this.setPlayerName();
		// 	this.initHP();
        //     this.staticUpdateSoldierHpBar();
        //     this.initTypeIcon();

        //     this.soliderNum.visible = false;
		// }

		// public setData(unitInfo: UnitInfoVo) {
		// 	this.m_pUnitInfo = unitInfo;
		// }

		public setPlayerName() {
			this.m_lbName.text = this.m_pUnitInfo.generalName;
			if(this.m_pUnitInfo.faction == FactionType.ATK){
				this.m_lbName.textColor = 0x00C6FF;
			}else if (this.m_pUnitInfo.faction == FactionType.DEF){
				this.m_lbName.textColor = 0xFF0000;
			}
		}

        public initTypeIcon(){
			//初始化头像信息				
			this.generalType.source = GeneralModel.getSoldierTypeIcon(this.m_pUnitInfo.soldierType,2);
        }

		public initHP(){
			if(this.m_pUnitInfo.faction == FactionType.ATK){
				this.HP_image.source = "pro_023_png";
			}else if (this.m_pUnitInfo.faction == FactionType.DEF){
				this.HP_image.source = "pro_022_png";
			}

            this.setHP(this.m_pUnitInfo.getHp());
		}

		public setHP(hp:number){
			if(this.HP_image){
				let width = Math.min(1,hp/this.m_pUnitInfo.getMaxHp())  * 70;
				this.HP_image.width = width;
			}
		}

        public updateSoldierHpBar(){
            // if(this.m_pUnitInfo.getHp() <= 0) return ;
            // let targerNum = this.getSoldierHp();
            // if(!this.m_isBlooding && this.m_curSoldierNum - targerNum > 0){
            //     this.m_isBlooding = true;
            //     this.m_targerNum = targerNum;
            //     Utils.TimerManager.remove(this.removeOneSoldier,this)
                
            //     let time = ConstUtil.getValue(IConstEnum.BATTLE_GENERAL_SOLDIER_SUB_TIEM);
            //     Utils.TimerManager.doTimer(time,0,this.removeOneSoldier,this);
            // }else{
            //     this.m_targerNum = targerNum;
            // }
        }

        public removeOneSoldier(){
            // if(this.m_curSoldierNum <= 0){
            //     Utils.TimerManager.remove(this.removeOneSoldier,this)
            //     return;
            // }
            // this.soliderNum.removeChildAt(0);
            // this.m_curSoldierNum -= 1;

            // if(this.m_targerNum == this.m_curSoldierNum){
            //     Utils.TimerManager.remove(this.removeOneSoldier,this)
            //     this.m_isBlooding = false;
            // }
        }

        // 静态刷新小兵血条
        public staticUpdateSoldierHpBar(){
            // let num = this.getSoldierHp();
            // this.soliderNum.removeChildren();
            // for(let i = 0; i < num; i++){
            //     let img = new eui.Image();
            //     img.source = "pro_021_png";
            //     this.soliderNum.addChild(img);
            // }
            // this.m_curSoldierNum = num;
        }

        public getSoldierHp(){
            // let units = BattleModel.getUnits();
            // let num = 0;
            // for(let i in units){
            //     let unit = units[i];
            //     if(unit.getBelongUid() == this.m_pUnitInfo.elementId && unit.getHp() > 0){
            //         num += 1;
            //     }
            // }
            // return num;
        }

        /**
         * 清空小兵血条
         */
        public clearSoldierHp(){
            // Utils.TimerManager.remove(this.removeOneSoldier,this);
            // this.soliderNum.removeChildren();
        }


	}
}