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
    var BuildCtrl = /** @class */ (function (_super_1) {
        __extends(BuildCtrl, _super_1);
        function BuildCtrl() {
            return _super_1.call(this) || this;
        }
        BuildCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_BUILDING_INFO_VIEW, BuildCtrl],
                [TASK_UI.POP_BUILD_LEVEL_UP_VIEW, BuildCtrl],
            ];
        };
        BuildCtrl.prototype.execute = function (notification) {
            debug("BuildCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_BUILDING_INFO_VIEW: {
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.BuildingInfoView.NAME);
                    if (view) {
                        view.changeBuildingInfo(notification.getBody());
                    }
                    else {
                        SceneManager.openView("com_main.BuildingInfoView", notification.getBody(), null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    }
                    break;
                }
                case TASK_UI.POP_BUILD_LEVEL_UP_VIEW: {
                    SceneManager.openView("com_main.BuildLevelUpView", notification.getBody(), null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return BuildCtrl;
    }(AGame.Controller));
    com_main.BuildCtrl = BuildCtrl;
})(com_main || (com_main = {}));
