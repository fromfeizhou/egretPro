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
/**
 * 跨服战
 */
var com_main;
(function (com_main) {
    var CrossCtrl = /** @class */ (function (_super_1) {
        __extends(CrossCtrl, _super_1);
        function CrossCtrl() {
            return _super_1.call(this) || this;
        }
        CrossCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.MAP_CROSS_WAR, CrossCtrl],
                [TASK_UI.MAP_CROSS_WALL_WAR, CrossCtrl],
                [TASK_UI.CROSS_SERVER_TEAM_PANEL, CrossCtrl],
                [TASK_UI.CROSS_SERVER_DETAIL_VIEW, CrossCtrl],
                [TASK_UI.CROSS_SERVER_SAND_TABLE, CrossCtrl],
                [TASK_UI.CROSS_SERVER_CITY_TIPS, CrossCtrl],
                [TASK_UI.CROSS_SERVER_BUFF, CrossCtrl],
                [TASK_UI.CROSS_SERVER_RANK, CrossCtrl],
                [TASK_UI.CRSOS_SERVER_WAR_SITUTION, CrossCtrl],
                [TASK_UI.CROSS_HERO_PANEL, CrossCtrl],
                [TASK_UI.CRSOS_SERVER_LEGION_UI, CrossCtrl],
                [TASK_UI.CROSS_BARRACKS, CrossCtrl],
                [TASK_UI.CROSS_BUY_TOWER_PANEL, CrossCtrl],
                [TASK_UI.CROSS_RESULT_VIEW, CrossCtrl],
            ];
        };
        CrossCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.MAP_CROSS_WAR: { //跨服内城战
                    var map = SceneManager.getView("com_main.CSBMap");
                    SceneManager.addChild(LayerEnums.MAP, map);
                    break;
                }
                case TASK_UI.MAP_CROSS_WALL_WAR: { //跨服外城战
                    var map = SceneManager.getView("com_main.CrossWallWarMap");
                    SceneManager.addChild(LayerEnums.MAP, map);
                    break;
                }
                case TASK_UI.CROSS_SERVER_TEAM_PANEL: {
                    SceneManager.openView("com_main.CrossServerCampView", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.CROSS_SERVER_DETAIL_VIEW: {
                    SceneManager.openView("com_main.CrossServerDetailWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.CROSS_SERVER_SAND_TABLE: { //战争沙盘
                    SceneManager.openView("com_main.SandTableWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.CROSS_SERVER_CITY_TIPS: { //城市tips
                    SceneManager.openView("com_main.SandTableCityTipsWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.CROSS_SERVER_BUFF: { //跨服战buff
                    SceneManager.openView("com_main.CrossBuffMainWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.CROSS_SERVER_RANK: { //跨服战排行榜
                    SceneManager.openView("com_main.CrossRankMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.CRSOS_SERVER_WAR_SITUTION: { //战况
                    SceneManager.openView("com_main.CrossServerWarSituView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.CROSS_HERO_PANEL: { //跨服战队伍选择
                    SceneManager.openView("com_main.CrossHeroPanel", body, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.CRSOS_SERVER_LEGION_UI: { //军团
                    SceneManager.openView("com_main.CrossLegionWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.CROSS_BARRACKS: { //跨服战总兵库
                    SceneManager.openView("com_main.CrossBarracksView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.CROSS_BUY_TOWER_PANEL: { //建造箭塔
                    SceneManager.openView("com_main.CrossBuyTowerView", body, null, com_main.UpManager.STYLE_UP, true, false);
                }
                case TASK_UI.CROSS_RESULT_VIEW: { //活动结束结算界面
                    SceneManager.openView("com_main.CrossResultSucView", body, null, com_main.UpManager.STYLE_FULL, true, false);
                }
                default:
                    break;
            }
        };
        return CrossCtrl;
    }(AGame.Controller));
    com_main.CrossCtrl = CrossCtrl;
})(com_main || (com_main = {}));
