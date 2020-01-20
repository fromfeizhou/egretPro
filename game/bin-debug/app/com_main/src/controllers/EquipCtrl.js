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
    var EquipCtrl = /** @class */ (function (_super_1) {
        __extends(EquipCtrl, _super_1);
        function EquipCtrl() {
            return _super_1.call(this) || this;
        }
        EquipCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_EQUIP_MAIN_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_SEL_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_ADD_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_WEAR_INFO_WND, EquipCtrl],
                [TASK_UI.POP_EQUIP_RECYCLE, EquipCtrl],
            ];
        };
        EquipCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var param = notification.getBody();
            switch (name) {
                case TASK_UI.POP_EQUIP_MAIN_WND: {
                    SceneManager.openView("com_main.EquipMainWnd", param, null, com_main.UpManager.STYLE_MAIN_FULL, false, true);
                    break;
                }
                case TASK_UI.POP_EQUIP_SEL_WND: {
                    SceneManager.openView("com_main.EquipSelectedWnd", param, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_EQUIP_ADD_WND: {
                    SceneManager.openView("com_main.TipsEquipAddWnd", param, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_EQUIP_WEAR_INFO_WND: {
                    SceneManager.openView("com_main.EquipWearInfoWnd", param, null, com_main.UpManager.STYLE_UP);
                    break;
                }
                case TASK_UI.POP_EQUIP_RECYCLE: {
                    SceneManager.openView("com_main.EquipRecycle", param, null, com_main.UpManager.STYLE_UP);
                    break;
                }
            }
        };
        return EquipCtrl;
    }(AGame.Controller));
    com_main.EquipCtrl = EquipCtrl;
})(com_main || (com_main = {}));
