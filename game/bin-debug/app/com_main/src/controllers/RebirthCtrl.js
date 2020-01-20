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
    var RebirthCtrl = /** @class */ (function (_super_1) {
        __extends(RebirthCtrl, _super_1);
        function RebirthCtrl() {
            return _super_1.call(this) || this;
        }
        RebirthCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.REBIRTH_WND, RebirthCtrl],
            ];
        };
        RebirthCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var param = notification.getBody();
            switch (name) {
                case TASK_UI.REBIRTH_WND: {
                    SceneManager.openView("com_main.RebirthWnd", param, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
            }
        };
        return RebirthCtrl;
    }(AGame.Controller));
    com_main.RebirthCtrl = RebirthCtrl;
})(com_main || (com_main = {}));
