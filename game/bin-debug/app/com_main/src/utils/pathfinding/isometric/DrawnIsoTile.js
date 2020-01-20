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
var com;
(function (com) {
    var isometric;
    (function (isometric) {
        var DrawnIsoTile = /** @class */ (function (_super_1) {
            __extends(DrawnIsoTile, _super_1);
            function DrawnIsoTile(size, color, height) {
                if (height === void 0) { height = 0; }
                var _this = _super_1.call(this, size) || this;
                _this._height = NaN;
                _this._color = 0;
                _this._color = flash.checkUint(color);
                _this._height = height;
                _this.draw();
                return _this;
            }
            DrawnIsoTile.prototype.draw = function () {
                this.graphics.clear();
                this.graphics.beginFill(this._color);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(-this.size, 0);
                this.graphics.lineTo(0, -this.size * .5);
                this.graphics.lineTo(this.size, 0);
                this.graphics.lineTo(0, this.size * .5);
                this.graphics.lineTo(-this.size, 0);
            };
            Object.defineProperty(DrawnIsoTile.prototype, "height", {
                get: function () {
                    return this._height;
                },
                set: function (value) {
                    this._height = value;
                    this.draw();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DrawnIsoTile.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    value = flash.checkUint(value);
                    this._color = flash.checkUint(value);
                    this.draw();
                },
                enumerable: true,
                configurable: true
            });
            return DrawnIsoTile;
        }(com.isometric.IsoObject));
        isometric.DrawnIsoTile = DrawnIsoTile;
    })(isometric = com.isometric || (com.isometric = {}));
})(com || (com = {}));
// flash.extendsClass("com.isometric.DrawnIsoTile","com.isometric.IsoObject")
