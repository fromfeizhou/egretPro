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
    var FateProComp = /** @class */ (function (_super_1) {
        __extends(FateProComp, _super_1);
        function FateProComp(state) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("fate/comp/FateProCompSkin.exml");
            _this.init(state);
            return _this;
        }
        FateProComp.create = function (state) {
            var obj = ObjectPool.pop(FateProComp, "FateProComp", state);
            return obj;
        };
        /**对象池回收 */
        FateProComp.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        FateProComp.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            _super_1.prototype.onDestroy.call(this);
        };
        FateProComp.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        FateProComp.prototype.init = function (state) {
            if (state === void 0) { state = 'base'; }
            NodeUtils.reset(this);
            this.currentState = state;
            this.commitProperties();
        };
        return FateProComp;
    }(com_main.CComponent));
    com_main.FateProComp = FateProComp;
})(com_main || (com_main = {}));
