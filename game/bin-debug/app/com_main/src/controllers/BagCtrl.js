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
 * 背包ctrl
 */
var com_main;
(function (com_main) {
    var BagCtrl = /** @class */ (function (_super_1) {
        __extends(BagCtrl, _super_1);
        function BagCtrl() {
            return _super_1.call(this) || this;
        }
        BagCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_BAG_LIST_VIEW, BagCtrl],
                [TASK_UI.POP_BAG_PANEL, BagCtrl],
            ];
        };
        BagCtrl.prototype.execute = function (notification) {
            debug("TavernCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_BAG_LIST_VIEW: {
                    var isOpen = com_main.UpManager.isCurrentOpenView(com_main.BagView.NAME);
                    if (isOpen) {
                        com_main.UpManager.close(false, false);
                        SceneManager.openView("com_main.BagView", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    }
                    else {
                        SceneManager.openView("com_main.BagView", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    }
                    Loading.hide();
                    break;
                }
                case TASK_UI.POP_BAG_PANEL: {
                    // let view = SceneManager.getView("com_main.BagPanel", body);
                    // UpManager.popSmallView(view, "");
                    // Loading.hide();
                    break;
                }
                default:
                    break;
            }
        };
        return BagCtrl;
    }(AGame.Controller));
    com_main.BagCtrl = BagCtrl;
})(com_main || (com_main = {}));
