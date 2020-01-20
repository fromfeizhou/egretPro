
module com_main {
	/** 城墙 */
	export class BBuild extends UnitActor {

		private m_image:eui.Image;
		private m_hpBgImg: eui.Image;
		private m_hpImg: eui.Image;	

		public static create(unit: UnitInfoVo) {
			let obj: BBuild = ObjectPool.pop(com_main.BBuild,"com_main.BBuild", unit);
			return obj;
		}

		public constructor(unit: UnitInfoVo) {
			super();
			this.init(unit);
		}


		public init(unit?: UnitInfoVo) {
			let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
			this.m_pWidth = config.wall_W;
			this.m_pHeight = config.wall_H;

			super.init();
			this.setUnitInfo(unit);

			if (unit) {
				this.createSkin();
			}
		}

		public onDestroy() {
			super.onDestroy();
		}

		public getMapXY():[number,number]{
			return [this.x,this.y];
		}

		public setHp(v: number) {
			this.m_pUnitInfo.setHp(v);
		}

		public createSkin() {
			let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
			this.m_image = new eui.Image(config.wallImg);
			this.addChild(this.m_image);

			this.m_hpBgImg = new eui.Image("proBg_016_png");
			this.m_hpBgImg.width = 106;
			this.m_hpBgImg.height = 14;
			this.m_hpBgImg.x = 455;
			this.m_hpBgImg.y = 300;
			this.m_hpBgImg.scale9Grid = new egret.Rectangle(4,3,2,3);
			this.addChild(this.m_hpBgImg);

			this.m_hpImg = new eui.Image("pro_022_png");
			this.m_hpImg.width = 102;
			this.m_hpImg.height = 10;
			this.m_hpImg.x = 455+2;
			this.m_hpImg.y = 300+2;
			this.addChild(this.m_hpImg);

			if(this.m_pUnitInfo){
				this.changeHp(this.m_pUnitInfo.getHp(),0);
			}
			
		}

		public changeHp(hp, attackHurt,isShowHP:boolean = false,isBuff = false) {
			if(this.m_pUnitInfo){
				let width = Math.min(1,hp/this.m_pUnitInfo.getMaxHp())  * 102;
				this.m_hpImg.width = width;
				this.m_pUnitInfo.setHp(hp);

				BattleSkillMgr.getInstance().dealWall(this.getUnitInfo().elementId,hp);
			}
		}
	}
}