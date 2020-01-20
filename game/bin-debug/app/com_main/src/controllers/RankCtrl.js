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
    var RankCtrl = /** @class */ (function (_super_1) {
        __extends(RankCtrl, _super_1);
        function RankCtrl() {
            return _super_1.call(this) || this;
        }
        RankCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.RANK_MAIN_PANEL, RankCtrl],
            ];
        };
        RankCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var param = notification.getBody();
            switch (name) {
                case TASK_UI.RANK_MAIN_PANEL: {
                    SceneManager.openView("com_main.RankMainView", param, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
            }
        };
        return RankCtrl;
    }(AGame.Controller));
    com_main.RankCtrl = RankCtrl;
})(com_main || (com_main = {}));
