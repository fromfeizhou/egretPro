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
    var CampCtrl = /** @class */ (function (_super_1) {
        __extends(CampCtrl, _super_1);
        function CampCtrl() {
            return _super_1.call(this) || this;
        }
        CampCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POS_CAMP_VIEW, CampCtrl],
                [TASK_UI.POS_PARTRO_VIEW, CampCtrl],
            ];
        };
        CampCtrl.prototype.execute = function (notification) {
            var name = notification.getName(), body = notification.getBody();
            debug("===========CampCtrl:execute==================", name, body);
            switch (name) {
                case TASK_UI.POS_CAMP_VIEW: {
                    SceneManager.openView("com_main.CampNorView", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    Loading.hide();
                    break;
                }
                case TASK_UI.POS_PARTRO_VIEW: {
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.CampPatroView.NAME);
                    if (!view) {
                        SceneManager.openView("com_main.CampPatroView", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    }
                    Loading.hide();
                    break;
                }
            }
        };
        return CampCtrl;
    }(AGame.Controller));
    com_main.CampCtrl = CampCtrl;
})(com_main || (com_main = {}));
