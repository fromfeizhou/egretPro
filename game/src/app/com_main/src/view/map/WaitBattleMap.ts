module com_main {
	export class WaitBattleMap extends BaseMap {

		/**场景管理 */
		public m_pSceneMgr: BattleSceneMgr;

		private m_pSquareList = [];

		/**当前地图数据 */
		private m_pMapSetting: MapSetting;

		private cityId: number;
		private generalList = [];

		private positionList = [
			[[449, 600], [385, 632]],
			[[641, 696], [577, 728]],
			[[321, 792], [257, 824]],
			[[129, 696], [65, 728]],
			[[513, 888], [449, 920]],
		]


		public constructor(parm?) {
			super();

			this.m_pTileConfig = MapData.getTileMapConfig(1);
			if (parm) {
				// this.generalList = parm.teamId;
				this.generalList = [];
				let team = TeamModel.getTeamVoByTypeId(TeamType.WORLD, parm.teamId) || TeamModel.getTeamVoByTypeId(TeamType.CROSS_SERVER, parm.teamId);
				if (team) {
					let list = team.teamGeneralData;
					for (let i in list) {
						let position = list[i].position;
						this.generalList[position] = list[i].generalId;
					}
				}
				BattleModel.cityId = parm.cityId;
			}
		}


		public onEnter() {
			super.onEnter();
			debug("BattleMap:onEnter--->>")
			this.m_pSceneMgr.initView();

			// this.m_pSceneMgr.makeGrid();
			this.m_pSceneMgr.createUnits();
			// this.m_pSceneMgr.createElement();
			this.m_pSceneMgr.onEnter();

			this.initSquare();
			this.moveTo(600, 900, false);
			this.m_pIsCanMove = false;

			BattleModel.isQuene = true;
			SceneManager.sceneCreateComplete();
			com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER, 0);
		}

		/**
		 * 销毁方法
		 */
		public onDestroy() {
			super.onDestroy();

			CBulletMgr.getIns().onDestroy();
			CEffectMgr.getIns().onDestroy();
			CSquareMgr.getIns().onDestroy();

			// this.m_pSceneMgr.onDestroy();
			this.m_pSceneMgr = null;
			this.m_pMapSetting = null;

			this.cleanSquare();
		}

		public init() {

		}

		public setMapSetting(setting: MapSetting) {
			this.m_pMapSetting = setting;

			this.m_pTileConfig = MapData.getTileMapConfig(this.m_pMapSetting.getMapId());
		}

		public addMapBitmap(): void {
			super.addMapBitmap();

			this.m_pSceneMgr = BattleSceneMgr.getInstance();
			this.m_pSceneMgr.init();
			this.m_pSceneMgr.setMapSetting(this.m_pMapSetting);
			this.m_pSceneMgr.setMapView(this);

			// this.mapMovePosition(new egret.Point(500, 800));

		}

		public cleanSquare(): void {
			for (var i: number = 0; i < this.m_pSquareList.length; i++) {
				Utils.removeFromParent(this.m_pSquareList[i]);
			}
			this.m_pSquareList = [];
		}

		// public changeStatus(status): void {
		// 	for (var i: number = 0; i < this.m_pSquareList.length; i++) {
		// 		this.m_pSquareList[i].changeStatus(status);
		// 	}
		// }

		// public test_index = 0;
		public createSquare(type, x, y) {
			// var square = CSquare.createId(type);

			// square.test = true;
			// square.changeStatus(status);
			// square.changeDirection(dir);
			// square.x = x;
			// square.y = y;

			// BattleSceneMgr.getInstance().addChildToWorld(square);
			// square.onAddToStage();
			// this.m_pSquareList.push(square);

			let square = new TeamManualSquare(type);
			square.x = x;
			square.y = y;
			BattleSceneMgr.getInstance().addChildToWorld(square);

			this.m_pSquareList.push(square);

		}

		public initSquare() {
			let positionList = this.positionList;
			for (let i in this.generalList) {
				let id = this.generalList[i];
				//英雄模型
				this.createSquare(id, positionList[Number(i) - 1][0][0] + 100, positionList[Number(i) - 1][0][1] + 200);
			}
			// com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER,0);
		}


	}
}