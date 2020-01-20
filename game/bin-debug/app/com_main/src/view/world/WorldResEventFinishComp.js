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
    var WorldResEventFinishComp = /** @class */ (function (_super_1) {
        __extends(WorldResEventFinishComp, _super_1);
        function WorldResEventFinishComp() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("world/WorldResEventFinishCompSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        WorldResEventFinishComp.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        /**更新资源显示 */
        WorldResEventFinishComp.prototype.updateResShow = function (resName, isNeedBg) {
            if (isNeedBg === void 0) { isNeedBg = true; }
            this.m_pResBg.visible = isNeedBg;
            this.m_pResName.source = resName;
        };
        return WorldResEventFinishComp;
    }(com_main.CComponent));
    com_main.WorldResEventFinishComp = WorldResEventFinishComp;
})(com_main || (com_main = {}));
