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
    var TankExpBar = /** @class */ (function (_super_1) {
        __extends(TankExpBar, _super_1);
        function TankExpBar() {
            return _super_1.call(this) || this;
            // this.name = TankPreviewItem.NAME;
            // this.skinName = Utils.getComSkin("progress/tank_preview_item.exml");
        }
        TankExpBar.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TankExpBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        Object.defineProperty(TankExpBar.prototype, "max", {
            set: function (max) {
                this.m_pMax = max;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TankExpBar.prototype, "value", {
            get: function () {
                return this.m_pValue;
            },
            /**设置百分比 0~100 % */
            set: function (value) {
                value = value > 100 ? 100 : value;
                value = value < 0 ? 0 : value;
                this.m_pValue = value;
                //FIX ME
                var w = 350 * (value / 100);
                this.m_pPro.width = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TankExpBar.prototype, "level", {
            set: function (level) {
                this.m_lbLevel.text = level + "";
            },
            enumerable: true,
            configurable: true
        });
        TankExpBar.NAME = "TankExpBar";
        return TankExpBar;
    }(com_main.CComponent));
    com_main.TankExpBar = TankExpBar;
})(com_main || (com_main = {}));
