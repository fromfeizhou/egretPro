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
    var FunctionCtrl = /** @class */ (function (_super_1) {
        __extends(FunctionCtrl, _super_1);
        function FunctionCtrl() {
            return _super_1.call(this) || this;
        }
        FunctionCtrl.prototype.listenerRouterNotifications = function () {
            return [
                //[TASK_UI.POP_FUNCITON_NEW_OPEN_VIEW, FunctionCtrl],
                // [TASK_UI.POP_FUNCITON_NOTIC_VIEW, FunctionCtrl],
                // [TASK_UI.POP_FUNCITON_OPEN_VIEW, FunctionCtrl],
                [TASK_UI.POP_FUNCITON_PREVIEW_VIEW, FunctionCtrl],
                [TASK_UI.POP_FUNCITON_NEW_VIEW, FunctionCtrl],
            ];
        };
        FunctionCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            switch (name) {
                // case TASK_UI.POP_FUNCITON_NEW_OPEN_VIEW: {
                // 	let ft = notification.getBody();
                // 	let view = SceneManager.getView("com_main.FunctionOpenPanel", ft);
                // 	UpManager.popSmallView(view, null, true);
                // 	break;
                // }
                // case TASK_UI.POP_FUNCITON_NOTIC_VIEW: {
                // 	let ft = notification.getBody();
                // 	let view = SceneManager.getView("com_main.FunctionNoticPanel", ft);
                // 	UpManager.popSmallView(view, null, false);
                // 	break;
                // }
                // case TASK_UI.POP_FUNCITON_OPEN_VIEW: {
                // SceneManager.openView("com_main.FuncOpenView", notification.getBody(), null, UpManager.STYLE_UP, false, false);
                // break;
                // }
                case TASK_UI.POP_FUNCITON_PREVIEW_VIEW: {
                    SceneManager.openView("com_main.FunctionPreviewPanel", notification.getBody(), null, com_main.UpManager.STYLE_UP, false, false);
                    break;
                }
                case TASK_UI.POP_FUNCITON_NEW_VIEW: {
                    SceneManager.openView("com_main.FunctionOpenNewPanel", notification.getBody(), null, com_main.UpManager.STYLE_FULL, false, false);
                    break;
                }
            }
        };
        return FunctionCtrl;
    }(AGame.Controller));
    com_main.FunctionCtrl = FunctionCtrl;
})(com_main || (com_main = {}));
