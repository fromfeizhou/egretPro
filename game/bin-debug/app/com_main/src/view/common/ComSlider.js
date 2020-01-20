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
    /**
     * 道具
     */
    var ComSlider = /** @class */ (function (_super_1) {
        __extends(ComSlider, _super_1);
        function ComSlider() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("common/ComSliderSkin.exml");
            return _this;
        }
        ComSlider.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ComSlider.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        ComSlider.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        return ComSlider;
    }(com_main.CComponent));
    com_main.ComSlider = ComSlider;
})(com_main || (com_main = {}));
