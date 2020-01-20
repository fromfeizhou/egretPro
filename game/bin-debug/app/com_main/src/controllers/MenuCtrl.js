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
    var MenuCtrl = /** @class */ (function (_super_1) {
        __extends(MenuCtrl, _super_1);
        function MenuCtrl() {
            return _super_1.call(this) || this;
        }
        MenuCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.MENU_MAIN_TOP_OTHER, MenuCtrl],
                [TASK_UI.MENU_MAIN_SCENE, MenuCtrl],
                [TASK_UI.MENU_MAIN_HANG, MenuCtrl],
                [TASK_UI.MENU_MAIN_WORLD, MenuCtrl],
                [TASK_UI.MENU_BATTLE_VIEW, MenuCtrl],
                [TASK_UI.MENU_MAIN_CROSS, MenuCtrl],
                [TASK_UI.MENU_MAIN_TOPBAR, MenuCtrl],
            ];
        };
        MenuCtrl.prototype.execute = function (notification) {
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.MENU_MAIN_TOPBAR: {
                    debug('MainTopBar');
                    if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, com_main.MainTopBar.NAME)) {
                        var menu6 = SceneManager.getView("com_main.MainTopBar");
                        SceneManager.addChild(LayerEnums.MENU, menu6, 2);
                    }
                    break;
                }
                case TASK_UI.MENU_MAIN_TOP_OTHER: {
                    if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, com_main.MainTopOther.NAME)) {
                        var menu = SceneManager.getView("com_main.MainTopOther");
                        SceneManager.addChild(LayerEnums.MENU, menu, 1);
                    }
                    break;
                }
                case TASK_UI.MENU_MAIN_SCENE: {
                    if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, com_main.MainSceneBar.NAME)) {
                        var menu = SceneManager.getView("com_main.MainSceneBar");
                        SceneManager.addChild(LayerEnums.MENU, menu, 0);
                    }
                    break;
                }
                case TASK_UI.MENU_MAIN_HANG: {
                    if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, com_main.MainHangBar.NAME)) {
                        var menu = SceneManager.getView("com_main.MainHangBar");
                        SceneManager.addChild(LayerEnums.MENU, menu, 0);
                    }
                    break;
                }
                case TASK_UI.MENU_MAIN_CROSS: {
                    if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, com_main.MainCrossBar.NAME)) {
                        var menu = SceneManager.getView("com_main.MainCrossBar");
                        SceneManager.addChild(LayerEnums.MENU, menu, 0);
                    }
                    break;
                }
                case TASK_UI.MENU_MAIN_WORLD: {
                    if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, com_main.MainWorldBar.NAME)) {
                        var menu7 = SceneManager.getView("com_main.MainWorldBar");
                        SceneManager.addChild(LayerEnums.MENU, menu7, 0);
                    }
                    break;
                }
                case TASK_UI.MENU_BATTLE_VIEW: { //显示战斗界面
                    if (!SceneManager.checkIsExistsForName(LayerEnums.MENU, 'BattleView')) {
                        // let menu4 = SceneManager.getView("com_main.BattleView", body);
                        // SceneManager.addChild(LayerEnums.MENU, menu4);
                        var menu4 = com_main.BattleView.getInstance(); //SceneManager.getView("com_main.BattleView", body);
                        menu4.setData(body);
                        SceneManager.addChild(LayerEnums.MENU, menu4);
                    }
                    break;
                }
            }
        };
        return MenuCtrl;
    }(AGame.Controller));
    com_main.MenuCtrl = MenuCtrl;
})(com_main || (com_main = {}));
