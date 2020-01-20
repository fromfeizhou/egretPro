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
 * 战斗指令虚拟机ctrl
 *
 */
var com_main;
(function (com_main) {
    var BattleCtrl = /** @class */ (function (_super_1) {
        __extends(BattleCtrl, _super_1);
        function BattleCtrl() {
            return _super_1.call(this) || this;
        }
        BattleCtrl.prototype.listenerRouterNotifications = function () {
            return [
                [TASK_UI.MENU_BATTLE_DESTORY_WALL, BattleCtrl]
            ];
        };
        BattleCtrl.prototype.execute = function (notification) {
            debug("BattleCtrl:execute------>>", notification);
            var name = notification.getName();
            var body = notification.getBody();
            switch (name) {
                case TASK_UI.MENU_BATTLE_DESTORY_WALL: {
                    SceneManager.openView("com_main.DestoryWallView", null, null, com_main.UpManager.STYLE_FULL, false, false, 0, false);
                }
                default:
                    break;
            }
        };
        return BattleCtrl;
    }(AGame.Controller));
    com_main.BattleCtrl = BattleCtrl;
})(com_main || (com_main = {}));
