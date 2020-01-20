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
    var MapCtrl = /** @class */ (function (_super_1) {
        __extends(MapCtrl, _super_1);
        function MapCtrl() {
            return _super_1.call(this) || this;
        }
        MapCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.MAP_NOVICE, MapCtrl],
                [TASK_UI.MAP_BATTLE, MapCtrl],
                [TASK_UI.MAP_WORLD, MapCtrl],
                [TASK_UI.MAP_MAIN, MapCtrl],
                [TASK_UI.WAIT_BATTLE_MAP, MapCtrl],
            ];
        };
        MapCtrl.prototype.execute = function (notification) {
            debug("MapCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.MAP_NOVICE: {
                    debug("进入新手地图");
                    //let map = SceneManager.getView("com_main.NoviceMap");
                    //let map = SceneManager.getView("com_main.GuideBaseMap");
                    //SceneManager.addChild(LayerEnums.MAP, map);
                    var tempMapId = 1101;
                    MapUtil.initMapData(tempMapId);
                    var map = SceneManager.getClass(LayerEnums.MAP, com_main.BattleMap.NAME);
                    if (map) {
                        error("onRunMap-->>战场已存在，上一次没销毁！！", map);
                    }
                    else {
                        map = SceneManager.getView("com_main.BattleMap");
                    }
                    map.setMapSetting(MapLoader.getMapSetting(tempMapId));
                    SceneManager.addChild(LayerEnums.MAP, map);
                    break;
                }
                case TASK_UI.MAP_WORLD: {
                    debug("进入世界地图");
                    var map = SceneManager.getView("com_main.WorldView");
                    SceneManager.addChild(LayerEnums.MAP, map);
                    // SceneManager.openView("com_main.WorldView", null, SceneEnums.WORLD_CITY, UpManager.STYLE_FULL, true, true, null);
                    break;
                }
                case TASK_UI.MAP_BATTLE: {
                    debug("进入战场");
                    MapUtil.initMapData(BattleModel.getMapId());
                    var map = SceneManager.getClass(LayerEnums.MAP, com_main.BattleMap.NAME);
                    if (map) {
                        error("onRunMap-->>战场已存在，上一次没销毁！！", map);
                    }
                    else {
                        map = SceneManager.getView("com_main.BattleMap");
                    }
                    map.setMapSetting(MapLoader.getMapSetting(BattleModel.getMapId()));
                    SceneManager.addChild(LayerEnums.MAP, map);
                    break;
                }
                case TASK_UI.WAIT_BATTLE_MAP: {
                    debug("进入排队界面战场");
                    MapUtil.initMapData(1);
                    var setting = MapLoader.getMapSetting(1);
                    var map = SceneManager.getView("com_main.WaitBattleMap", body);
                    map.setMapSetting(setting);
                    SceneManager.addChild(LayerEnums.MAP, map);
                    Loading.hide();
                    break;
                }
                case TASK_UI.MAP_MAIN:
                    debug("进入主地图");
                    if (SceneManager.getCurrScene() == SceneEnums.MAIN_CITY) {
                        var map = SceneManager.getView("com_main.MainMap", body);
                        SceneManager.addChild(LayerEnums.MAP, map);
                    }
                    // SceneManager.sceneCreateComplete();
                    break;
                default:
                    break;
            }
        };
        return MapCtrl;
    }(AGame.Controller));
    com_main.MapCtrl = MapCtrl;
})(com_main || (com_main = {}));
