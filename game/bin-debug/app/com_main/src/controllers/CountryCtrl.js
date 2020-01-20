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
    var CountryCtrl = /** @class */ (function (_super_1) {
        __extends(CountryCtrl, _super_1);
        function CountryCtrl() {
            return _super_1.call(this) || this;
        }
        CountryCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.COUNTRY_MAIN_PANEL, CountryCtrl],
                [TASK_UI.COUNTRY_APPLY_LIST, CountryCtrl],
                [TASK_UI.COUNTRY_JOB_INFO, CountryCtrl],
                [TASK_UI.COUNTRY_CORONATION_PANEL, CountryCtrl],
            ];
        };
        CountryCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var param = notification.getBody();
            switch (name) {
                case TASK_UI.COUNTRY_MAIN_PANEL: {
                    SceneManager.openView("com_main.CountryMainWnd", param, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.COUNTRY_APPLY_LIST: {
                    SceneManager.openView("com_main.CountryApplyListWnd", param, null, com_main.UpManager.STYLE_FULL, false, false);
                    break;
                }
                case TASK_UI.COUNTRY_JOB_INFO: {
                    SceneManager.openView("com_main.CountryJobInfoWnd", param, null, com_main.UpManager.STYLE_FULL, false, false);
                    break;
                }
                case TASK_UI.COUNTRY_CORONATION_PANEL: {
                    SceneManager.openView("com_main.CountryCoronationPanel", param, null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
            }
        };
        return CountryCtrl;
    }(AGame.Controller));
    com_main.CountryCtrl = CountryCtrl;
})(com_main || (com_main = {}));
