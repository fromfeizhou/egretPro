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
    var Point = /** @class */ (function (_super_1) {
        __extends(Point, _super_1);
        function Point(x, y) {
            var _this = _super_1.call(this) || this;
            _this.x = x;
            _this.y = y;
            return _this;
        }
        Point.create = function (pos) {
            return new Point(pos.x, pos.y);
        };
        Point.prototype.getX = function () {
            return this.x;
        };
        Point.prototype.setX = function (x) {
            this.x = x;
        };
        Point.prototype.getY = function () {
            return this.y;
        };
        Point.prototype.setY = function (y) {
            this.y = y;
        };
        return Point;
    }(egret.Point));
    com_main.Point = Point;
})(com_main || (com_main = {}));
