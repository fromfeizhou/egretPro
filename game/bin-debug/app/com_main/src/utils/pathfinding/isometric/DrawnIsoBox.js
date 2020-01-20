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
        var DrawnIsoBox = /** @class */ (function (_super_1) {
            __extends(DrawnIsoBox, _super_1);
            function DrawnIsoBox(size, color, height) {
                var _this = _super_1.call(this, size, color, height) || this;
                color = flash.checkUint(color);
                return _this;
            }
            DrawnIsoBox.prototype.draw = function () {
                this.graphics.clear();
                var red = flash.checkInt(this._color >> 16);
                var green = flash.checkInt(this._color >> 8 & 0xff);
                var blue = flash.checkInt(this._color & 0xff);
                var leftShadow = flash.checkUint((red * .5) << 16 | (green * .5) << 8 | (blue * .5));
                var rightShadow = flash.checkUint((red * .75) << 16 | (green * .75) << 8 | (blue * .75));
                var h = this._height * com.isometric.IsoObject.Y_CORRECT;
                this.graphics.beginFill(this._color);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(-this._size, -h);
                this.graphics.lineTo(0, -this._size * .5 - h);
                this.graphics.lineTo(this._size, -h);
                this.graphics.lineTo(0, this._size * .5 - h);
                this.graphics.lineTo(-this._size, -h);
                this.graphics.endFill();
                this.graphics.beginFill(leftShadow);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(-this._size, -h);
                this.graphics.lineTo(0, this._size * .5 - h);
                this.graphics.lineTo(0, this._size * .5);
                this.graphics.lineTo(-this._size, 0);
                this.graphics.lineTo(-this._size, -h);
                this.graphics.endFill();
                this.graphics.beginFill(rightShadow);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(this._size, -h);
                this.graphics.lineTo(0, this._size * .5 - h);
                this.graphics.lineTo(0, this._size * .5);
                this.graphics.lineTo(this._size, 0);
                this.graphics.lineTo(this._size, -h);
                this.graphics.endFill();
            };
            return DrawnIsoBox;
        }(com.isometric.DrawnIsoTile));
        isometric.DrawnIsoBox = DrawnIsoBox;
    })(isometric = com.isometric || (com.isometric = {}));
})(com || (com = {}));
// flash.extendsClass("com.isometric.DrawnIsoBox","com.isometric.DrawnIsoTile")
