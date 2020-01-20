
module com_main {
	/** 城墙 */
	export class BBuildTower extends UnitActor {
		private m_image:eui.Image;	

		private m_hpBgImg: eui.Image;
		private m_hpImg: eui.Image;

		public static create(unit: UnitInfoVo) {
			let obj: BBuildTower = new BBuildTower(unit);
			return obj;
		}

		public constructor(unit: UnitInfoVo) {
			super();
			this.init(unit);
		}


		public init(unit?: UnitInfoVo) {

			let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
			this.m_pWidth = config.tower_W ;
			this.m_pHeight = config.tower_H ;

			this.setUnitInfo(unit);
			super.init();
			this.createSkin();
		}

		public onDestroy() {
			super.onDestroy();
		}

		public setHp(v: number) {
			this.m_pUnitInfo.setHp(v);
		}

		public getMapXY():[number,number]{
			return [this.x,this.y];
		}

		public createSkin() {
			let config = MAP_ELE_CONFIG[BattleModel.getMapId()];

			this.m_image = new eui.Image(config.towerImg);
			// this.m_image
			this.addChild(this.m_image);

			this.m_image.x = config.tower_PX;
			this.m_image.y = config.tower_PY;

			this.m_hpBgImg = new eui.Image("proBg_016_png");
			this.m_hpBgImg.width = 68;
			this.m_hpBgImg.height = 7;
			this.m_hpBgImg.x = 150;
			this.m_hpBgImg.y = -55;
			this.m_hpBgImg.scale9Grid = new egret.Rectangle(4,3,2,3);
			this.addChild(this.m_hpBgImg);

			this.m_hpImg = new eui.Image("pro_022_png");
			this.m_hpImg.width = 63;
			this.m_hpImg.height = 5;
			this.m_hpImg.x = 150 + 1;
			this.m_hpImg.y = -55 + 1;
			this.addChild(this.m_hpImg);

			if(this.m_pUnitInfo){
				this.changeHp(this.m_pUnitInfo.getHp(),0);
			}
			
		}

		public changeHp(hp, attackHurt,isShowHP:boolean = false,isBuff = false) {
			if(this.m_pUnitInfo){
				let width = Math.min(1,hp/this.m_pUnitInfo.getMaxHp())  * 63;
				this.m_hpImg.width = width;
				this.m_pUnitInfo.setHp(hp);

				BattleSkillMgr.getInstance().dealTower(this.getUnitInfo().elementId,hp);
			}
		}
	}
}