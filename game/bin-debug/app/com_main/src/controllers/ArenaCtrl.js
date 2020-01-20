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
    var ArenaCtrl = /** @class */ (function (_super_1) {
        __extends(ArenaCtrl, _super_1);
        function ArenaCtrl() {
            return _super_1.call(this) || this;
        }
        ArenaCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_ARENA_PANEL, ArenaCtrl],
                [TASK_UI.POP_ARENA_CLEAR_UP_PANEL, ArenaCtrl],
            ];
        };
        ArenaCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            switch (name) {
                case TASK_UI.POP_ARENA_PANEL:
                    // let view = SceneManager.getView("com_main.ArenaPop");
                    // //UpManager.popSmallView(view, 'font_lt_png');
                    // UpManager.popNew(view, "arena_font_png", null, true);  //fix
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.ArenaView.NAME);
                    if (!view) {
                        SceneManager.openView("com_main.ArenaView", null, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    }
                    break;
                case TASK_UI.POP_ARENA_CLEAR_UP_PANEL:
                    SceneManager.openView("com_main.ArenaSaodanResultView", notification.getBody(), null, com_main.UpManager.STYLE_UP, true, false);
                    break;
            }
        };
        return ArenaCtrl;
    }(AGame.Controller));
    com_main.ArenaCtrl = ArenaCtrl;
})(com_main || (com_main = {}));
