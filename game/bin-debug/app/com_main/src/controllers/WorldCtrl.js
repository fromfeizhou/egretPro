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
    var WorldCtrl = /** @class */ (function (_super_1) {
        __extends(WorldCtrl, _super_1);
        function WorldCtrl() {
            return _super_1.call(this) || this;
        }
        WorldCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_WORLD_HERO_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_VIEW_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_HERO_EVT_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_CITY_INFO_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_ACCELERATE_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_RULE_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_BATTLE_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_BATTLE_VIEW, WorldCtrl],
                [TASK_UI.POP_WORLD_THUM_VIEW, WorldCtrl],
                [TASK_UI.POP_WORLD_RANK_VIEW, WorldCtrl],
                [TASK_UI.POP_WORLD_VISIT_ATTACK, WorldCtrl],
                [TASK_UI.POP_WORLD_SIEGE_VIEW, WorldCtrl],
                [TASK_UI.POP_WORLD_SEARCH_VIEW, WorldCtrl],
                [TASK_UI.POP_WORLD_SIEGE_RESULT, WorldCtrl],
                [TASK_UI.POP_WORLD_SIEGE_KILL, WorldCtrl],
                [TASK_UI.POP_WORLD_FIRST_OCCUPY_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_MAIN_EXPLOIT_WND, WorldCtrl],
                [TASK_UI.POP_WORLD_LOCK_TASK_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_TROOP_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_NEW_OPEN_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_DIALOG_VIEW, WorldCtrl],
                [TASK_UI.POP_WORLD_CITY_TROOP_PANEL, WorldCtrl],
                [TASK_UI.POP_WORLD_CITY_BUILDING, WorldCtrl],
                [TASK_UI.POP_WORLD_CITY_BUILD_INFO, WorldCtrl],
                [TASK_UI.POP_WORLD_NOTICE_VIEW, WorldCtrl],
            ];
        };
        WorldCtrl.prototype.execute = function (notification) {
            var name = notification.getName(), body = notification.getBody();
            debug("===========WorldCtrl:execute==================", name, body);
            switch (name) {
                case TASK_UI.POP_WORLD_HERO_PANEL: {
                    SceneManager.openView("com_main.WorldHeroPanel", body, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_NOTICE_VIEW: {
                    SceneManager.openView("com_main.WorldNoticeWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_WORLD_HERO_EVT_PANEL: {
                    SceneManager.openView("com_main.WorldHeroEvtPanel", body, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_WORLD_VIEW_PANEL: {
                    SceneManager.openView("com_main.WorldVisitPanel", body.id, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_VISIT_ATTACK: {
                    SceneManager.openView("com_main.WorldVisitAttack", body.id, null, com_main.UpManager.STYLE_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_LOCK_TASK_PANEL: {
                    SceneManager.openView("com_main.WorldLockTaskPanel", body, null, com_main.UpManager.STYLE_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_CITY_INFO_PANEL: {
                    SceneManager.openView("com_main.WorldCityInfoPanel", body.conf, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_ACCELERATE_PANEL: {
                    SceneManager.openView("com_main.WorldAcceleratePanel", body, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_RULE_PANEL: {
                    SceneManager.openView("com_main.WorldRulePanel", null, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_BATTLE_VIEW: {
                    SceneManager.openView("com_main.WorldBattleView", null, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_BATTLE_PANEL: {
                    SceneManager.openView("com_main.WorldBattlePanel", body, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_THUM_VIEW: {
                    SceneManager.openView("com_main.WorldThumView", null, ModuleEnums.WORLD_MINI_MAP, com_main.UpManager.STYLE_FULL, false, false);
                    break;
                }
                case TASK_UI.POP_WORLD_RANK_VIEW: {
                    SceneManager.openView("com_main.WorldRankView", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_SIEGE_VIEW: {
                    SceneManager.openView("com_main.WorldSiegeView", body, null, com_main.UpManager.STYLE_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_SEARCH_VIEW: {
                    SceneManager.openView("com_main.WorldSearchView", body, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_CITY_TROOP_PANEL: {
                    SceneManager.openView("com_main.WorldCityTroopPanel", body, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_SIEGE_RESULT: {
                    SceneManager.openView("com_main.WorldSiegeResult", body, null, com_main.UpManager.STYLE_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_SIEGE_KILL: {
                    SceneManager.openView("com_main.WorldSiegeRankView", body, null, com_main.UpManager.STYLE_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_FIRST_OCCUPY_PANEL: {
                    SceneManager.openView("com_main.WorldFirstOccupyPanel", body, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_MAIN_EXPLOIT_WND: {
                    SceneManager.openView("com_main.ExploitMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_TROOP_PANEL: {
                    SceneManager.openView("com_main.WorldTroopPanel", body, null, com_main.UpManager.STYLE_UP);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_DIALOG_VIEW: {
                    //世界地图
                    SceneManager.openView("com_main.WorldDialogView", body, null, com_main.UpManager.STYLE_FULL, true, false, 0, false);
                    break;
                }
                case TASK_UI.POP_WORLD_NEW_OPEN_PANEL: {
                    SceneManager.openView("com_main.WorldCityNewOpenPanel", body, null, com_main.UpManager.STYLE_UP);
                    // Loading.hide();
                    break;
                }
                case TASK_UI.POP_WORLD_CITY_BUILDING: {
                    SceneManager.openView("com_main.CityBuildView", body, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_WORLD_CITY_BUILD_INFO: {
                    SceneManager.openView("com_main.BuildInfoView", body, null, com_main.UpManager.STYLE_UP);
                    break;
                }
            }
        };
        return WorldCtrl;
    }(AGame.Controller));
    com_main.WorldCtrl = WorldCtrl;
})(com_main || (com_main = {}));
