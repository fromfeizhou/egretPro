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
        var BasicIsoTile = /** @class */ (function (_super_1) {
            __extends(BasicIsoTile, _super_1);
            function BasicIsoTile(size, color, height) {
                if (color === void 0) { color = 0xffffff; }
                if (height === void 0) { height = 0; }
                return _super_1.call(this, size, color, height) || this;
            }
            BasicIsoTile.prototype.draw = function () {
                this.graphics.clear();
                this.graphics.beginFill(this._color, .3);
                this.graphics.lineStyle(0, 0, .5);
                this.graphics.moveTo(-this.size, 0);
                this.graphics.lineTo(0, -this.size * .5);
                this.graphics.lineTo(this.size, 0);
                this.graphics.lineTo(0, this.size * .5);
                this.graphics.lineTo(-this.size, 0);
            };
            return BasicIsoTile;
        }(com.isometric.DrawnIsoTile));
        isometric.BasicIsoTile = BasicIsoTile;
    })(isometric = com.isometric || (com.isometric = {}));
})(com || (com = {}));
// flash.extendsClass("com.isometric.BasicIsoTile","com.isometric.DrawnIsoTile")
