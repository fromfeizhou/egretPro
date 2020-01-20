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
    var ChatCtrl = /** @class */ (function (_super_1) {
        __extends(ChatCtrl, _super_1);
        function ChatCtrl() {
            return _super_1.call(this) || this;
        }
        ChatCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.POP_CHAT_MAIN, ChatCtrl],
                [TASK_UI.POP_CHAT_MAIN_TIPS, ChatCtrl],
            ];
        };
        ChatCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.POP_CHAT_MAIN: {
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.ChatMainWnd.NAME);
                    if (view) {
                        view.changeParam(body);
                    }
                    else {
                        LoadingRes.loadGroups(ModuleEnums.CHAT, function () {
                            SceneManager.openView("com_main.ChatMainWnd", body, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                            Loading.hide();
                        }, this, null);
                    }
                    break;
                }
                case TASK_UI.POP_CHAT_MAIN_TIPS: {
                    var view = SceneManager.getClass(LayerEnums.POPUP, com_main.ChatMainWnd.NAME);
                    if (view) {
                        view.changeTipsView(body);
                    }
                    break;
                }
            }
        };
        return ChatCtrl;
    }(AGame.Controller));
    com_main.ChatCtrl = ChatCtrl;
})(com_main || (com_main = {}));
