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
    /**材料副本 */
    var MaterialCtrl = /** @class */ (function (_super_1) {
        __extends(MaterialCtrl, _super_1);
        function MaterialCtrl() {
            return _super_1.call(this) || this;
        }
        MaterialCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.MATERIAL_INFO_PANEL, MaterialCtrl],
                [TASK_UI.MATERIAL_INFO__BUY_DLG, MaterialCtrl],
            ];
        };
        MaterialCtrl.prototype.execute = function (notification) {
            var name = notification.getName(), body = notification.getBody();
            debug("===========BossCtrl:execute==================", name, body);
            switch (name) {
                case TASK_UI.MATERIAL_INFO_PANEL: {
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.MaterialWnd.NAME);
                    if (!view)
                        SceneManager.openView("com_main.MaterialWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, true, false);
                    break;
                }
                case TASK_UI.MATERIAL_INFO__BUY_DLG: {
                    SceneManager.openView("com_main.MaterialBuyDlg", body, null, com_main.UpManager.STYLE_UP, true, false);
                    break;
                }
            }
        };
        return MaterialCtrl;
    }(AGame.Controller));
    com_main.MaterialCtrl = MaterialCtrl;
})(com_main || (com_main = {}));
