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
    var WorldCityLockComp = /** @class */ (function (_super_1) {
        __extends(WorldCityLockComp, _super_1);
        function WorldCityLockComp() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("world/WorldCityLockCompSkin.exml");
            return _this;
        }
        WorldCityLockComp.create = function () {
            var obj = ObjectPool.pop(WorldCityLockComp, "WorldCityLockComp");
            return obj;
        };
        /**对象池回收 */
        WorldCityLockComp.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        WorldCityLockComp.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            _super_1.prototype.onDestroy.call(this);
        };
        WorldCityLockComp.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        return WorldCityLockComp;
    }(com_main.CComponent));
    com_main.WorldCityLockComp = WorldCityLockComp;
})(com_main || (com_main = {}));
