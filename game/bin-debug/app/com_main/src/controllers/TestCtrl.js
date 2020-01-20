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
    var TestCtrl = /** @class */ (function (_super_1) {
        __extends(TestCtrl, _super_1);
        function TestCtrl() {
            return _super_1.call(this) || this;
        }
        TestCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TestNav.TEST_ANIM, TestCtrl],
                [TASK_UI.AWAY_FROM_KEYBOARD, TestCtrl],
                [TestNav.TEST_WAR, TestCtrl],
                [TestNav.TEST_SETTING, TestCtrl]
            ];
        };
        TestCtrl.prototype.execute = function (notification) {
            debug("TestCtrl:execute------>>", notification);
            var name = notification.getName();
            switch (name) {
                case TestNav.TEST_ANIM:
                    MapUtil.initMapData(6);
                    var setting = MapLoader.getMapSetting(6);
                    var map = SceneManager.getView("com_main.TestAnimMap");
                    map.setMapSetting(setting);
                    SceneManager.addChild(LayerEnums.MAP, map);
                    var testAnimUI = SceneManager.getView("com_main.TestAnimUI");
                    SceneManager.addChild(LayerEnums.MENU, testAnimUI);
                    // com_main.UpManager.close();
                    // var battleView = SceneManager.getView("com_main.BattleView");
                    // SceneManager.addChild(LayerEnums.MENU, battleView);
                    // SceneManager.openView("com_main.TestWarview",null,null,UpManager.STYLE_MAIN_FULL,false,false);
                    Loading.hide();
                    break;
                case TASK_UI.AWAY_FROM_KEYBOARD:
                    // SceneManager.openView("com_main.AwayKeyboardView",null,null,UpManager.STYLE_MAIN_FULL,false,false);
                    // let map1 = SceneManager.getView("com_main.AwayKeyboardView");
                    var map1 = com_main.AwayKeyboardView.getInstance();
                    map1.initData();
                    SceneManager.addChild(LayerEnums.MAP, map1);
                    break;
                case TestNav.TEST_WAR:
                    SceneManager.openView("com_main.TestWarview", null, null, com_main.UpManager.STYLE_MAIN_FULL, false, false);
                    break;
                case TestNav.TEST_SETTING:
                    SceneManager.openView("com_main.TestSettingView", null, null, com_main.UpManager.STYLE_UP);
                    // SceneManager.openView("com_main.TestVideo",null,null,UpManager.STYLE_UP);
                    break;
                default:
                    break;
            }
        };
        return TestCtrl;
    }(AGame.Controller));
    com_main.TestCtrl = TestCtrl;
})(com_main || (com_main = {}));
