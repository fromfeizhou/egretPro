module com_main {
	export class ManualSquare extends egret.DisplayObjectContainer {
		public generalId: number;

		/**
		 * 士兵层
		 */
		protected m_pHero: CSoldiers;
		protected m_pSoldier: CSoldiers;
		protected m_pTips: eui.Group;

		public constructor(generalId?: number) {
			super();
			this.generalId = generalId;
			this.initSquare();
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
		}

		public initSquare() {
			this.width = 180;
			this.height = 160;
			this.anchorOffsetX = this.width / 2;
			this.anchorOffsetY = this.height / 2;

			let config: GeneralConfig = C.GeneralConfig[this.generalId];
			let gCid = config.ourModelCode as number;

			this.m_pHero = CSoldiers.createId(gCid);
			this.m_pHero.x = 136;
			this.m_pHero.y = 55 + 35;
			// this.m_pHero.test = true;
			this.m_pHero.changeStatus(CSquare_Status.STATUS_STAND);
			this.m_pHero.changeDirection(CSquare_Direction.RIGHT_UP)
			this.addChild(this.m_pHero);

			let gconfig = GeneralModel.getGeneralArmyConfig(this.generalId);
			let cid = gconfig.ourModelCode as number;

			this.m_pSoldier = CSoldiers.createId(cid);
			this.m_pSoldier.x = 82 - 10;
			this.m_pSoldier.y = 93 + 35 - 10;
			// this.m_pSoldier.visible = false;
			this.m_pSoldier.changeDirection(CSquare_Direction.RIGHT_UP);
			this.m_pSoldier.changeStatus(CSquare_Status.STATUS_STAND);
			this.addChild(this.m_pSoldier);


			this.m_pTips = new eui.Group();
			this.m_pTips.width = 125;
			this.m_pTips.height = 32;
			this.m_pTips.x = 125;
			this.m_pTips.y = 80;
			this.m_pTips.visible = false;
			this.addChild(this.m_pTips)

			// RES.getResAsync("border_1001_png", (k, v) => {
			let tipBg = new eui.Image();
			this.m_pTips.addChild(tipBg);
			tipBg.source = "border_1001_png";
			tipBg.width = 125;
			tipBg.height = 32;
			let m_pLbName = new eui.Label();
			m_pLbName.textFlow = Utils.htmlParser(GCode(CLEnum.WOR_SOR_FAL1));
			m_pLbName.size = 24;
			m_pLbName.horizontalCenter = 0;
			m_pLbName.y = 2
			this.m_pTips.addChild(m_pLbName);


			// let actionName = this.packageActionName(null, CSquare_Direction.RIGHT, CSquare_Status.STATUS_STAND);
			// this.createSoldiers(this.m_pSoldiersCode, this.m_pType, actionName );

		}
		public isShowSorlider(visible: boolean) {
			this.m_pSoldier.visible = visible;
		}
		public isShowTip(visible: boolean) {
			this.m_pTips.visible = visible;
		}
		public isShowHead(visible: boolean) {
			
		}
		protected onDestroy() {
			this.m_pHero.onDestroy();
			this.m_pSoldier.onDestroy();
		}

	}
}