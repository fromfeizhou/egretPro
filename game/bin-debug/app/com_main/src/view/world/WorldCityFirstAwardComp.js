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
    var WorldCityFirstAwardComp = /** @class */ (function (_super_1) {
        __extends(WorldCityFirstAwardComp, _super_1);
        function WorldCityFirstAwardComp() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("world/WorldCityFirstWardCompSkin.exml");
            return _this;
        }
        WorldCityFirstAwardComp.create = function () {
            var obj = ObjectPool.pop(WorldCityFirstAwardComp, "WorldCityFirstAwardComp");
            return obj;
        };
        /**对象池回收 */
        WorldCityFirstAwardComp.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        WorldCityFirstAwardComp.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            ObjectPool.push(this);
            _super_1.prototype.onDestroy.call(this);
        };
        WorldCityFirstAwardComp.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        WorldCityFirstAwardComp.prototype.setHero = function (genId) {
            this.m_imgHead.mask = this.m_imgHeadMask;
            var genCfhg = C.GeneralConfig[genId];
            this.m_imgHead.source = GeneralModel.getSoldierLogo("" + genCfhg.role);
        };
        return WorldCityFirstAwardComp;
    }(com_main.CComponent));
    com_main.WorldCityFirstAwardComp = WorldCityFirstAwardComp;
})(com_main || (com_main = {}));
