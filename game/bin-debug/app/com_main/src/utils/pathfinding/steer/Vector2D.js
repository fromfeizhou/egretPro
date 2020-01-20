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
    var steer;
    (function (steer) {
        var Vector2D = /** @class */ (function (_super_1) {
            __extends(Vector2D, _super_1);
            function Vector2D(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var _this = _super_1.call(this) || this;
                _this._x = NaN;
                _this._y = NaN;
                _this._x = x;
                _this._y = y;
                return _this;
            }
            Vector2D.prototype.draw = function (graphics, color) {
                if (color === void 0) { color = 0; }
                graphics.lineStyle(0, color);
                graphics.moveTo(0, 0);
                graphics.lineTo(this._x, this._y);
            };
            Vector2D.prototype.clone = function () {
                return new com.steer.Vector2D(this.x, this.y);
            };
            Vector2D.prototype.zero = function () {
                this._x = 0;
                this._y = 0;
                return this;
            };
            Vector2D.prototype.isZero = function () {
                return this._x == 0 && this._y == 0;
            };
            Object.defineProperty(Vector2D.prototype, "length", {
                get: function () {
                    return Math.sqrt(this.lengthSQ);
                },
                set: function (value) {
                    var a = this.angle;
                    this._x = Math.cos(a) * value;
                    this._y = Math.sin(a) * value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2D.prototype, "lengthSQ", {
                get: function () {
                    return this._x * this._x + this._y * this._y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2D.prototype, "angle", {
                get: function () {
                    return Math.atan2(this._y, this._x);
                },
                set: function (value) {
                    var len = this.length;
                    this._x = Math.cos(value) * len;
                    this._y = Math.sin(value) * len;
                },
                enumerable: true,
                configurable: true
            });
            Vector2D.prototype.normalize = function () {
                if (this.length == 0) {
                    this._x = 1;
                    return this;
                }
                var len = this.length;
                this._x /= len;
                this._y /= len;
                return this;
            };
            Vector2D.prototype.truncate = function (max) {
                this.length = Math.min(max, this.length);
                return this;
            };
            Vector2D.prototype.reverse = function () {
                this._x = -this._x;
                this._y = -this._y;
                return this;
            };
            Vector2D.prototype.isNormalized = function () {
                return this.length == 1.0;
            };
            Vector2D.prototype.dotProd = function (v2) {
                return this._x * v2.x + this._y * v2.y;
            };
            Vector2D.prototype.crossProd = function (v2) {
                return this._x * v2.y - this._y * v2.x;
            };
            Vector2D.angleBetween = function (v1, v2) {
                if (!v1.isNormalized())
                    v1 = v1.clone().normalize();
                if (!v2.isNormalized())
                    v2 = v2.clone().normalize();
                return Math.acos(v1.dotProd(v2));
            };
            Vector2D.prototype.sign = function (v2) {
                return this.perp.dotProd(v2) < 0 ? -1 : 1;
            };
            Object.defineProperty(Vector2D.prototype, "perp", {
                get: function () {
                    return new com.steer.Vector2D(-this.y, this.x);
                },
                enumerable: true,
                configurable: true
            });
            Vector2D.prototype.dist = function (v2) {
                return Math.sqrt(this.distSQ(v2));
            };
            Vector2D.prototype.distSQ = function (v2) {
                var dx = v2.x - this.x;
                var dy = v2.y - this.y;
                return dx * dx + dy * dy;
            };
            Vector2D.prototype.add = function (v2) {
                return new com.steer.Vector2D(this._x + v2.x, this._y + v2.y);
            };
            Vector2D.prototype.subtract = function (v2) {
                return new com.steer.Vector2D(this._x - v2.x, this._y - v2.y);
            };
            Vector2D.prototype.multiply = function (value) {
                return new com.steer.Vector2D(this._x * value, this._y * value);
            };
            Vector2D.prototype.divide = function (value) {
                return new com.steer.Vector2D(this._x / value, this._y / value);
            };
            Vector2D.prototype.equals = function (v2) {
                return this._x == v2.x && this._y == v2.y;
            };
            Object.defineProperty(Vector2D.prototype, "x", {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    this._x = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2D.prototype, "y", {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    this._y = value;
                },
                enumerable: true,
                configurable: true
            });
            Vector2D.prototype.toString = function () {
                return "[Vector2D (x:" + this._x + ", y:" + this._y + ")]";
            };
            return Vector2D;
        }(egret.HashObject));
        steer.Vector2D = Vector2D;
    })(steer = com.steer || (com.steer = {}));
})(com || (com = {}));
