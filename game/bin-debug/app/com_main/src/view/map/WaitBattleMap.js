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
    var WaitBattleMap = /** @class */ (function (_super_1) {
        __extends(WaitBattleMap, _super_1);
        function WaitBattleMap(parm) {
            var _this = _super_1.call(this) || this;
            _this.m_pSquareList = [];
            _this.generalList = [];
            _this.positionList = [
                [[449, 600], [385, 632]],
                [[641, 696], [577, 728]],
                [[321, 792], [257, 824]],
                [[129, 696], [65, 728]],
                [[513, 888], [449, 920]],
            ];
            _this.m_pTileConfig = MapData.getTileMapConfig(1);
            if (parm) {
                // this.generalList = parm.teamId;
                _this.generalList = [];
                var team = TeamModel.getTeamVoByTypeId(1 /* WORLD */, parm.teamId) || TeamModel.getTeamVoByTypeId(5 /* CROSS_SERVER */, parm.teamId);
                if (team) {
                    var list = team.teamGeneralData;
                    for (var i in list) {
                        var position = list[i].position;
                        _this.generalList[position] = list[i].generalId;
                    }
                }
                BattleModel.cityId = parm.cityId;
            }
            return _this;
        }
        WaitBattleMap.prototype.onEnter = function () {
            _super_1.prototype.onEnter.call(this);
            debug("BattleMap:onEnter--->>");
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
        };
        /**
         * 销毁方法
         */
        WaitBattleMap.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.CBulletMgr.getIns().onDestroy();
            com_main.CEffectMgr.getIns().onDestroy();
            com_main.CSquareMgr.getIns().onDestroy();
            // this.m_pSceneMgr.onDestroy();
            this.m_pSceneMgr = null;
            this.m_pMapSetting = null;
            this.cleanSquare();
        };
        WaitBattleMap.prototype.init = function () {
        };
        WaitBattleMap.prototype.setMapSetting = function (setting) {
            this.m_pMapSetting = setting;
            this.m_pTileConfig = MapData.getTileMapConfig(this.m_pMapSetting.getMapId());
        };
        WaitBattleMap.prototype.addMapBitmap = function () {
            _super_1.prototype.addMapBitmap.call(this);
            this.m_pSceneMgr = com_main.BattleSceneMgr.getInstance();
            this.m_pSceneMgr.init();
            this.m_pSceneMgr.setMapSetting(this.m_pMapSetting);
            this.m_pSceneMgr.setMapView(this);
            // this.mapMovePosition(new egret.Point(500, 800));
        };
        WaitBattleMap.prototype.cleanSquare = function () {
            for (var i = 0; i < this.m_pSquareList.length; i++) {
                Utils.removeFromParent(this.m_pSquareList[i]);
            }
            this.m_pSquareList = [];
        };
        // public changeStatus(status): void {
        // 	for (var i: number = 0; i < this.m_pSquareList.length; i++) {
        // 		this.m_pSquareList[i].changeStatus(status);
        // 	}
        // }
        // public test_index = 0;
        WaitBattleMap.prototype.createSquare = function (type, x, y) {
            // var square = CSquare.createId(type);
            // square.test = true;
            // square.changeStatus(status);
            // square.changeDirection(dir);
            // square.x = x;
            // square.y = y;
            // BattleSceneMgr.getInstance().addChildToWorld(square);
            // square.onAddToStage();
            // this.m_pSquareList.push(square);
            var square = new com_main.TeamManualSquare(type);
            square.x = x;
            square.y = y;
            com_main.BattleSceneMgr.getInstance().addChildToWorld(square);
            this.m_pSquareList.push(square);
        };
        WaitBattleMap.prototype.initSquare = function () {
            var positionList = this.positionList;
            for (var i in this.generalList) {
                var id = this.generalList[i];
                //英雄模型
                this.createSquare(id, positionList[Number(i) - 1][0][0] + 100, positionList[Number(i) - 1][0][1] + 200);
            }
            // com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER,0);
        };
        return WaitBattleMap;
    }(com_main.BaseMap));
    com_main.WaitBattleMap = WaitBattleMap;
})(com_main || (com_main = {}));
