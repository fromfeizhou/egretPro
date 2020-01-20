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
 * pvp竞技ctrl
 */
var com_main;
(function (com_main) {
    var PvpArenaCtrl = /** @class */ (function (_super_1) {
        __extends(PvpArenaCtrl, _super_1);
        function PvpArenaCtrl() {
            return _super_1.call(this) || this;
        }
        PvpArenaCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_PVPARENA_PANEL, PvpArenaCtrl],
                [TASK_UI.POP_PVPARENA_RANK_PANEL, PvpArenaCtrl],
                [TASK_UI.POP_PVPARENA_NOTICE_PANEL, PvpArenaCtrl],
                [TASK_UI.POP_PVPARENA_SHOP_PANEL, PvpArenaCtrl],
            ];
        };
        PvpArenaCtrl.prototype.execute = function (notification) {
            debug("ActivationCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_PVPARENA_PANEL: {
                    SceneManager.openView("com_main.PvpArenaView", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                case TASK_UI.POP_PVPARENA_RANK_PANEL: {
                    SceneManager.openView("com_main.PvpArenaRankView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_PVPARENA_NOTICE_PANEL: {
                    SceneManager.openView("com_main.PvpNoticeView", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
                case TASK_UI.POP_PVPARENA_SHOP_PANEL: {
                    SceneManager.openView("com_main.PvpArenaShopView", body, null, com_main.UpManager.STYLE_FULL, true, false);
                    break;
                }
            }
        };
        return PvpArenaCtrl;
    }(AGame.Controller));
    com_main.PvpArenaCtrl = PvpArenaCtrl;
})(com_main || (com_main = {}));
