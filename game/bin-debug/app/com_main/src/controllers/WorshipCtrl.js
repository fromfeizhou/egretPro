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
 * 膜拜
 */
var com_main;
(function (com_main) {
    var WorshipCtrl = /** @class */ (function (_super_1) {
        __extends(WorshipCtrl, _super_1);
        function WorshipCtrl() {
            return _super_1.call(this) || this;
        }
        WorshipCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.WORSHIP_PANEL, WorshipCtrl],
            ];
        };
        WorshipCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.WORSHIP_PANEL: {
                    CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO();
                    WorshipProxy.send_C2S_WORSHIP_INFO(WorshipType.KING);
                    SceneManager.openView("com_main.WorshipView", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                default:
                    break;
            }
        };
        return WorshipCtrl;
    }(AGame.Controller));
    com_main.WorshipCtrl = WorshipCtrl;
})(com_main || (com_main = {}));
