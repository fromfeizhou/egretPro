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
    var WorldXiangYangComp = /** @class */ (function (_super_1) {
        __extends(WorldXiangYangComp, _super_1);
        function WorldXiangYangComp() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("world/WorldXiangYangCompSkin.exml");
            return _this;
        }
        WorldXiangYangComp.create = function () {
            var obj = ObjectPool.pop(WorldXiangYangComp, "WorldXiangYangComp");
            return obj;
        };
        /**对象池回收 */
        WorldXiangYangComp.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        WorldXiangYangComp.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            _super_1.prototype.onDestroy.call(this);
        };
        WorldXiangYangComp.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        return WorldXiangYangComp;
    }(com_main.CComponent));
    com_main.WorldXiangYangComp = WorldXiangYangComp;
})(com_main || (com_main = {}));
