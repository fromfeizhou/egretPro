module com_main {
	export class BaseSceneMgr extends BaseClass implements IFObject, IFScene {
		/**静态对象 */
		protected m_pStaticObjs: any[];
		/**动态对象 */
		protected m_pDynamicObjs: any[];
		/**建筑特效 */
		protected m_pBuildEffects: any[];
		/**地图网格 */
		protected m_pGrids: CellGrids;
		/**当前地图数据 */
		protected m_pMapSetting: MapSetting;
		/**地图 */
		protected m_pMapView: BaseMap;
		/**地板 */
		protected m_pWorld: com.view.SteerWorld;

		/**地图网格 偏移*/
		protected m_pGrids_offSet: egret.Point;

		protected m_bIsDestroy: boolean;
		public constructor() {
			super();
		}

		public init(): void {
			this.m_pStaticObjs = [];
			this.m_pDynamicObjs = [];
			this.m_pBuildEffects = [];
			this.m_bIsDestroy = false;
		}

		public onDestroy(): void {
			// SkillModel.clear();
			BattleModel.clear();

			this.removeAllStaticObjs();
			this.m_pStaticObjs = null;
			this.removeAllDynamicObjs();
			this.m_pDynamicObjs = null;
			this.m_pBuildEffects = null;
			// this.m_pGrids.clear();
			// this.m_pGrids = null;
			this.m_pWorld.onDestroy();
			this.m_pWorld = null;
			this.m_pMapView = null;
			this.m_pMapSetting = null;

			this.m_bIsDestroy = true;
		}

        public onEnter() {
			debug("BaseSceneMgr:onEnter--->>")
		}

        public onExit() {
            debug("BaseSceneMgr:onExit--->>")
        }

		public setMapSetting(setting: MapSetting) {
			this.m_pMapSetting = setting;
		}

		public getMapSetting() {
			return this.m_pMapSetting;
		}

		public setMapView(view: BaseMap) {
			this.m_pMapView = view;
		}

		public initView() {
			this.m_pWorld = com.view.SteerWorld.create();
			Utils.addChild(this.getMapContent(), this.m_pWorld);

			let temp = this.m_pMapSetting.getWidth() + this.m_pMapSetting.getHeight();
			let rectwidth = temp * this.m_pMapSetting.getHalfTileWidth();
			let rectheight = temp * this.m_pMapSetting.getHalfTileHeight();
			this.m_pWorld.width = rectwidth;
			this.m_pWorld.height = rectheight;
			// this.m_pWorld.drawRect();

			// 不能设置，因为地图大过菱形区域
			// let scaleX = this.m_pMapView.m_pBg.width / rectwidth;
			// let scaleY = this.m_pMapView.m_pBg.height / rectheight;
			// this.m_pWorld.setGridScale(scaleX, scaleY)
			// debug("BaseSceneMgr:initView--->>scaleX, scaleY", scaleX, scaleY)

			// let mapobj = this.m_pMapSetting.getMapObject(LayerName.ELEMENTS, ObjectType.ATTACKER, "attacker_2")
			// if (mapobj) {
			// 	let pos = mapobj.tilePixelToPixel();
			// 	this.m_pMapView.moveTo(pos.x, pos.y);
			// }
		}

		/**获取地图 */
		public getMapContent() {
			return this.m_pMapView.getMapContent();
		}

		public getMapView() {
			return this.m_pMapView;
		}

		/**获取游戏地板 */
		public getWorld() {
			return this.m_pWorld;
		}

		public addChildToBlood(child: egret.DisplayObject, index?: number){
			if(this.m_bIsDestroy) return;

			try {
				this.m_pWorld.addChildToBlood(child, index);
			} catch (e) {
				error(e);
			}
		}

		/**添加到悬浮层 */
		public addChildToSuspension(child: egret.DisplayObject, index?: number) {
			if(this.m_bIsDestroy) return;
			try {
				this.m_pWorld.addChildToSuspension(child, index);
			} catch (e) {
				error(e);
			}
		}

		public removeAllChildToSuspension() {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.removeAllChildToSuspension();
		}

		/**添加到人物行走层 */
		public addChildToWorld(child: egret.DisplayObject, index?: number) {
			if(this.m_bIsDestroy) return;
			if(this.m_pWorld){
				this.m_pWorld.addChildToWorld(child, index);
			}
		}

		public removeAllChildToWorld() {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.removeAllChildToWorld();
		}

		/**添加到特效层 */
		public addChildToEffect(child: egret.DisplayObject, index?: number) {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.addChildToEffect(child, index);
		}

		public removeAllChildToEffect() {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.removeAllChildToEffect();
		}

		/**添加到建筑层 */
		public addChildToBuild(child: egret.DisplayObject, index?: number) {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.addChildToBuild(child, index);
		}

		public removeAllChildToBuild() {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.removeAllChildToBuild();
		}

		public addChildToReference(child: egret.DisplayObject, index?: number) {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.addChildToReference(child, index);
		}

		public removeAllChildToReference() {
			if(this.m_bIsDestroy) return;
			this.m_pWorld.removeAllChildToReference();
		}

		/**
		 * 获取静态对象
		 */
		public getStaticObj(id: number | string) {
			return this.m_pStaticObjs[id];
		}

		/**
		 * 添加静态对象
		 */
		public addStaticObj(id: number | string, obj: egret.DisplayObject) {
			this.m_pStaticObjs[id] = obj;
		}

		public removeStaticObj(id: number | string) {
			let obj = this.getStaticObj(id);
			if (obj) {
				if (obj.onDestroy) {
					obj.onDestroy();
				} else {
					Utils.removeFromParent(obj);
				}
				this.m_pStaticObjs[id] = null;
				delete this.m_pStaticObjs[id];
				debugBatt("BaseSceneMgr:removeStaticObj--->", id)
			} else {
				error("BaseSceneMgr:removeStaticObj---> 没找到要删除的对象 uid:", id)
			}
		}

		public removeAllStaticObjs() {
			for (let key in this.m_pStaticObjs) {
				if (this.m_pStaticObjs.hasOwnProperty(key)) {
					this.removeStaticObj(key);
				}
			}
			this.m_pStaticObjs.length = 0;
		}

		/**
		 * 获取所有动态对象
		 */
		public getDynamicObjs() {
			return this.m_pDynamicObjs
		}

		/**
		 * 获取动态对象
		 */
		public getDynamicObj(id: number | string, classname?: any) {
			try {
				if (this.m_pDynamicObjs) {
					let obj = this.m_pDynamicObjs[id];
					if (classname && !(obj instanceof classname)) {
						return null
					}
					return obj;
				}
			} catch (e) {
				error("getDynamicObj--->>场景还没初始化", e, this.m_pDynamicObjs);
			}
			return null
		}

		/**
		 * 添加动态对象
		 */
		public addDynamicObj(id: number | string, obj: egret.DisplayObject) {
			if (this.getDynamicObj(id)) {
				error("addDynamicObj--->>添加了同样的显示对象", id, obj);
				this.removeDynamicObj(id);
			}
			this.m_pDynamicObjs[id] = obj;

			// if (obj instanceof CSquare
			// 	|| obj instanceof BBuild
			// 	|| obj instanceof BBuildPart) {
			// 	let unitinfo = obj.getUnitInfo();
			// 	let desc = format("uid:{1}, x:{2}, y:{3}", unitinfo.elementId, unitinfo.position.x, unitinfo.position.y);
			// 	if (obj instanceof CSquare) {
			// 		debugBatt("BaseSceneMgr:addUnitObj--------->>", "添加方阵");
			// 	} else {
			// 		debugBatt("BaseSceneMgr:addUnitObj--------->>", "添加主城");
			// 	}
			// 	debugBatt("BaseSceneMgr:addUnitObj--------->>", desc);
			// 	debugBatt("BaseSceneMgr:addUnitObj--------->>type", unitinfo.type);
			// } 
			// else if (obj instanceof PlayerFlag) {
			// 	let playerinfo = obj.getPlayerInfo();
			// 	//zb
			// 	// let desc = format("uid:{1}, x:{2}, y:{3}", playerinfo.id.toNumber(), playerinfo.bornPoint.x, playerinfo.bornPoint.y);
			// 	let desc = format("uid:{1}, x:{2}, y:{3}", playerinfo.id, playerinfo.bornPoint.x, playerinfo.bornPoint.y);
			// 	debug("BaseSceneMgr:addPlayerFlag--------->>", "添加玩家");
			// 	debug("BaseSceneMgr:addPlayerFlag--------->>", desc);
			// 	let cell = MapUtil.pixelToCell(playerinfo.bornPoint.x, playerinfo.bornPoint.y)
			// 	debug("BaseSceneMgr:addPlayerFlag--------->>cell", cell[0], cell[1]);
			// }
		}

		/**移除动态对象 */
		public removeDynamicObj(id: number | string) {
			let obj = this.getDynamicObj(id);
			if (obj) {
				if (obj.onDestroy) {
					obj.onDestroy();
				} else {
					Utils.removeFromParent(obj);
				}
				this.m_pDynamicObjs[id] = null;
				delete this.m_pDynamicObjs[id];
				debugBatt("BaseSceneMgr:removeDynamicObj--->", id)
			} else {
				error("BaseSceneMgr:removeDynamicObj---> 没找到要删除的对象 uid:", id)
			}
		}

		public removeAllDynamicObjs() {
			for (let key in this.m_pDynamicObjs) {
				if (this.m_pDynamicObjs.hasOwnProperty(key)) {
					this.removeDynamicObj(key);
				}
			}
			this.m_pDynamicObjs.length = 0;
		}

		// /**创建格仔数据 */
		// public makeGrid() {
		// 	let layer = this.m_pMapSetting.getTitleLayer(LayerName.TERRAIN);
		// 	let csvdata: number[][] = layer.getCells();
		// 	this.m_pGrids = new CellGrids(csvdata);
		// 	this.m_pGrids_offSet = new egret.Point(layer["offsetx"],layer["offsety"]);
		// }

		/**创建格仔显示对象 */
		public drawGrid() {
			this.removeAllChildToReference();
			for (let y: number = flash.checkInt(0); y < this.m_pGrids.getY(); y++) {
				for (let x: number = flash.checkInt(0); x < this.m_pGrids.getX(); x++) {
					let node: Cell = this.m_pGrids.getCell(y, x);
					let pos: egret.Point = node.cellToPixel();
					let color: number = this.getColor(node);

					if(node.getTerrainType() == TerrainType.FIVE){
						console.log("x,y = ",pos.x + this.m_pGrids_offSet.x,pos.y + this.m_pGrids_offSet.y);
					}
					let tiled: egret.Sprite = new egret.Sprite();
					tiled.width = MapConfig.tileWidth;
					tiled.height = MapConfig.tileHeight;
					AnchorUtil.setAnchor(tiled, 0.5);
					tiled.x = pos.x + this.m_pGrids_offSet.x;
					tiled.y = pos.y + this.m_pGrids_offSet.y;
					tiled.touchEnabled = false;
					tiled.alpha = 0.5;
					tiled.name = "tiled";
					Utils.DisplayUtils.drawDiamond(tiled, color, 0x000000);
					this.addChildToWorld(tiled);
					//网格数字

					let cx  = 84 - y;
					let cy  = 40- x;

					let lblTitle = new eui.Label();
					lblTitle.size = 12;
					lblTitle.touchEnabled = false;
					lblTitle.textColor = 0x000000;
					AnchorUtil.setAnchor(lblTitle, 0.5);
					lblTitle.x = pos.x + this.m_pGrids_offSet.x;
					lblTitle.y = pos.y + this.m_pGrids_offSet.y;
					lblTitle.text = format("{1},{2}", cx, cy);
					this.addChildToWorld(lblTitle);
				}
			}
		}

		private getColor(node: Cell): number {
			if (node.getTerrainType() == TerrainType.COMMON)
				return 0xcccccc;
			else if (node.getTerrainType() == TerrainType.UNMOVEABLE)
				return 0xff9900;
			else if (node.getTerrainType() == TerrainType.FOREST)
				return 0x330099;
			else if (node.getTerrainType() == TerrainType.WATER)
				return 0xcc00cc;
			else if (node.getTerrainType() == TerrainType.FOUR)
				return 0xcc0000;
			else if (node.getTerrainType() == TerrainType.FIVE)
				return 0x222222;
			return 0xffffff;
		}

		public setColor(filter: egret.ColorMatrixFilter){
			this.m_pWorld.setColor(filter);
			this.m_pMapView.m_pTileMap.filters = [filter];
		}
		
	}
}