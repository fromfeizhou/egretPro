var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    var BaseSceneMgr = /** @class */ (function (_super_1) {
        __extends(BaseSceneMgr, _super_1);
        function BaseSceneMgr() {
            return _super_1.call(this) || this;
        }
        BaseSceneMgr.prototype.init = function () {
            this.m_pStaticObjs = [];
            this.m_pDynamicObjs = [];
            this.m_pBuildEffects = [];
            this.m_bIsDestroy = false;
        };
        BaseSceneMgr.prototype.onDestroy = function () {
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
        };
        BaseSceneMgr.prototype.onEnter = function () {
            debug("BaseSceneMgr:onEnter--->>");
        };
        BaseSceneMgr.prototype.onExit = function () {
            debug("BaseSceneMgr:onExit--->>");
        };
        BaseSceneMgr.prototype.setMapSetting = function (setting) {
            this.m_pMapSetting = setting;
        };
        BaseSceneMgr.prototype.getMapSetting = function () {
            return this.m_pMapSetting;
        };
        BaseSceneMgr.prototype.setMapView = function (view) {
            this.m_pMapView = view;
        };
        BaseSceneMgr.prototype.initView = function () {
            this.m_pWorld = com.view.SteerWorld.create();
            Utils.addChild(this.getMapContent(), this.m_pWorld);
            var temp = this.m_pMapSetting.getWidth() + this.m_pMapSetting.getHeight();
            var rectwidth = temp * this.m_pMapSetting.getHalfTileWidth();
            var rectheight = temp * this.m_pMapSetting.getHalfTileHeight();
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
        };
        /**获取地图 */
        BaseSceneMgr.prototype.getMapContent = function () {
            return this.m_pMapView.getMapContent();
        };
        BaseSceneMgr.prototype.getMapView = function () {
            return this.m_pMapView;
        };
        /**获取游戏地板 */
        BaseSceneMgr.prototype.getWorld = function () {
            return this.m_pWorld;
        };
        BaseSceneMgr.prototype.addChildToBlood = function (child, index) {
            if (this.m_bIsDestroy)
                return;
            try {
                this.m_pWorld.addChildToBlood(child, index);
            }
            catch (e) {
                error(e);
            }
        };
        /**添加到悬浮层 */
        BaseSceneMgr.prototype.addChildToSuspension = function (child, index) {
            if (this.m_bIsDestroy)
                return;
            try {
                this.m_pWorld.addChildToSuspension(child, index);
            }
            catch (e) {
                error(e);
            }
        };
        BaseSceneMgr.prototype.removeAllChildToSuspension = function () {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.removeAllChildToSuspension();
        };
        /**添加到人物行走层 */
        BaseSceneMgr.prototype.addChildToWorld = function (child, index) {
            if (this.m_bIsDestroy)
                return;
            if (this.m_pWorld) {
                this.m_pWorld.addChildToWorld(child, index);
            }
        };
        BaseSceneMgr.prototype.removeAllChildToWorld = function () {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.removeAllChildToWorld();
        };
        /**添加到特效层 */
        BaseSceneMgr.prototype.addChildToEffect = function (child, index) {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.addChildToEffect(child, index);
        };
        BaseSceneMgr.prototype.removeAllChildToEffect = function () {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.removeAllChildToEffect();
        };
        /**添加到建筑层 */
        BaseSceneMgr.prototype.addChildToBuild = function (child, index) {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.addChildToBuild(child, index);
        };
        BaseSceneMgr.prototype.removeAllChildToBuild = function () {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.removeAllChildToBuild();
        };
        BaseSceneMgr.prototype.addChildToReference = function (child, index) {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.addChildToReference(child, index);
        };
        BaseSceneMgr.prototype.removeAllChildToReference = function () {
            if (this.m_bIsDestroy)
                return;
            this.m_pWorld.removeAllChildToReference();
        };
        /**
         * 获取静态对象
         */
        BaseSceneMgr.prototype.getStaticObj = function (id) {
            return this.m_pStaticObjs[id];
        };
        /**
         * 添加静态对象
         */
        BaseSceneMgr.prototype.addStaticObj = function (id, obj) {
            this.m_pStaticObjs[id] = obj;
        };
        BaseSceneMgr.prototype.removeStaticObj = function (id) {
            var obj = this.getStaticObj(id);
            if (obj) {
                if (obj.onDestroy) {
                    obj.onDestroy();
                }
                else {
                    Utils.removeFromParent(obj);
                }
                this.m_pStaticObjs[id] = null;
                delete this.m_pStaticObjs[id];
                debugBatt("BaseSceneMgr:removeStaticObj--->", id);
            }
            else {
                error("BaseSceneMgr:removeStaticObj---> 没找到要删除的对象 uid:", id);
            }
        };
        BaseSceneMgr.prototype.removeAllStaticObjs = function () {
            for (var key in this.m_pStaticObjs) {
                if (this.m_pStaticObjs.hasOwnProperty(key)) {
                    this.removeStaticObj(key);
                }
            }
            this.m_pStaticObjs.length = 0;
        };
        /**
         * 获取所有动态对象
         */
        BaseSceneMgr.prototype.getDynamicObjs = function () {
            return this.m_pDynamicObjs;
        };
        /**
         * 获取动态对象
         */
        BaseSceneMgr.prototype.getDynamicObj = function (id, classname) {
            try {
                if (this.m_pDynamicObjs) {
                    var obj = this.m_pDynamicObjs[id];
                    if (classname && !(obj instanceof classname)) {
                        return null;
                    }
                    return obj;
                }
            }
            catch (e) {
                error("getDynamicObj--->>场景还没初始化", e, this.m_pDynamicObjs);
            }
            return null;
        };
        /**
         * 添加动态对象
         */
        BaseSceneMgr.prototype.addDynamicObj = function (id, obj) {
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
        };
        /**移除动态对象 */
        BaseSceneMgr.prototype.removeDynamicObj = function (id) {
            var obj = this.getDynamicObj(id);
            if (obj) {
                if (obj.onDestroy) {
                    obj.onDestroy();
                }
                else {
                    Utils.removeFromParent(obj);
                }
                this.m_pDynamicObjs[id] = null;
                delete this.m_pDynamicObjs[id];
                debugBatt("BaseSceneMgr:removeDynamicObj--->", id);
            }
            else {
                error("BaseSceneMgr:removeDynamicObj---> 没找到要删除的对象 uid:", id);
            }
        };
        BaseSceneMgr.prototype.removeAllDynamicObjs = function () {
            for (var key in this.m_pDynamicObjs) {
                if (this.m_pDynamicObjs.hasOwnProperty(key)) {
                    this.removeDynamicObj(key);
                }
            }
            this.m_pDynamicObjs.length = 0;
        };
        // /**创建格仔数据 */
        // public makeGrid() {
        // 	let layer = this.m_pMapSetting.getTitleLayer(LayerName.TERRAIN);
        // 	let csvdata: number[][] = layer.getCells();
        // 	this.m_pGrids = new CellGrids(csvdata);
        // 	this.m_pGrids_offSet = new egret.Point(layer["offsetx"],layer["offsety"]);
        // }
        /**创建格仔显示对象 */
        BaseSceneMgr.prototype.drawGrid = function () {
            this.removeAllChildToReference();
            for (var y = flash.checkInt(0); y < this.m_pGrids.getY(); y++) {
                for (var x = flash.checkInt(0); x < this.m_pGrids.getX(); x++) {
                    var node = this.m_pGrids.getCell(y, x);
                    var pos = node.cellToPixel();
                    var color = this.getColor(node);
                    if (node.getTerrainType() == TerrainType.FIVE) {
                        console.log("x,y = ", pos.x + this.m_pGrids_offSet.x, pos.y + this.m_pGrids_offSet.y);
                    }
                    var tiled = new egret.Sprite();
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
                    var cx = 84 - y;
                    var cy = 40 - x;
                    var lblTitle = new eui.Label();
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
        };
        BaseSceneMgr.prototype.getColor = function (node) {
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
        };
        BaseSceneMgr.prototype.setColor = function (filter) {
            this.m_pWorld.setColor(filter);
            this.m_pMapView.m_pTileMap.filters = [filter];
        };
        return BaseSceneMgr;
    }(BaseClass));
    com_main.BaseSceneMgr = BaseSceneMgr;
})(com_main || (com_main = {}));
