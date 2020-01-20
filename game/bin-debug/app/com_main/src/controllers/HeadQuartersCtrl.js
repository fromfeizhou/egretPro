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
    var HeadQuartersCtrl = /** @class */ (function (_super_1) {
        __extends(HeadQuartersCtrl, _super_1);
        function HeadQuartersCtrl() {
            return _super_1.call(this) || this;
        }
        HeadQuartersCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.HEADQUARTER_MAIN_PANEL, HeadQuartersCtrl],
                [TASK_UI.HEADQUARTER_INFO_PANEL, HeadQuartersCtrl],
            ];
        };
        HeadQuartersCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var param = notification.getBody();
            switch (name) {
                case TASK_UI.HEADQUARTER_MAIN_PANEL: {
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.HeadQuarters.NAME);
                    if (!view)
                        SceneManager.openView("com_main.HeadQuarters", param, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.HEADQUARTER_INFO_PANEL: {
                    SceneManager.openView("com_main.HeadQuartersInfo", param, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
            }
        };
        return HeadQuartersCtrl;
    }(AGame.Controller));
    com_main.HeadQuartersCtrl = HeadQuartersCtrl;
})(com_main || (com_main = {}));
