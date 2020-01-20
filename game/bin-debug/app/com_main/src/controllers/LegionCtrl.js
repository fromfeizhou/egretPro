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
 * 联盟ctrl
 */
var com_main;
(function (com_main) {
    var LegionCtrl = /** @class */ (function (_super_1) {
        __extends(LegionCtrl, _super_1);
        function LegionCtrl() {
            return _super_1.call(this) || this;
        }
        LegionCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.LEGION_LIST_WND, LegionCtrl],
                [TASK_UI.LEGION_CREATE_WND, LegionCtrl],
                [TASK_UI.LEGION_MAIN_WND, LegionCtrl],
                [TASK_UI.LEGION_INFO_PANEL, LegionCtrl],
                [TASK_UI.LEGION_RANK_PANEL, LegionCtrl],
                [TASK_UI.LEGION_INVITATE_PANEL, LegionCtrl],
                [TASK_UI.LEGION_RECORD_WND, LegionCtrl],
                [TASK_UI.LEGION_APPLY_WND, LegionCtrl],
                [TASK_UI.LEGION_SET_NOTICE_WND, LegionCtrl],
                [TASK_UI.LEGION_SET_WND, LegionCtrl],
                [TASK_UI.LEGION_APPOINT_WND, LegionCtrl],
                [TASK_UI.LEGION_TECH_WND, LegionCtrl],
            ];
        };
        LegionCtrl.prototype.execute = function (notification) {
            debug("TavernCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.LEGION_LIST_WND: {
                    //打开联盟列表面板
                    SceneManager.openView("com_main.LegionListWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.LEGION_CREATE_WND: {
                    //打开创建联盟面板
                    SceneManager.openView("com_main.LegionCreateWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.LEGION_MAIN_WND: {
                    //打开联盟主面板
                    SceneManager.openView("com_main.LegionMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.LEGION_SET_WND: {
                    //联盟设置面板
                    SceneManager.openView("com_main.LegionSetWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.LEGION_APPOINT_WND: {
                    //联盟任命
                    SceneManager.openView("com_main.LegionAppointWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.LEGION_SET_NOTICE_WND: {
                    //联盟公告修改
                    SceneManager.openView("com_main.LegionSetNoticeWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.LEGION_RECORD_WND: {
                    //联盟记录
                    SceneManager.openView("com_main.LegionRecordWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.LEGION_APPLY_WND: {
                    //联盟申请
                    SceneManager.openView("com_main.LegionApplyWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.LEGION_TECH_WND: {
                    //联盟科技
                    SceneManager.openView("com_main.LegionTechWnd", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.LEGION_INFO_PANEL: {
                    // SceneManager.openView("com_main.LegionOtherInfo", body, null, UpManager.STYLE_MAIN_FULL, true,false);
                    // Loading.hide();
                    break;
                }
                default:
                    break;
            }
        };
        return LegionCtrl;
    }(AGame.Controller));
    com_main.LegionCtrl = LegionCtrl;
})(com_main || (com_main = {}));
