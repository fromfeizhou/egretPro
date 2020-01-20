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
        var IsoObject = /** @class */ (function (_super_1) {
            __extends(IsoObject, _super_1);
            function IsoObject(size) {
                var _this = _super_1.call(this) || this;
                _this._size = NaN;
                _this._walkable = false;
                _this._vx = 0;
                _this._vy = 0;
                _this._vz = 0;
                _this._size = size;
                _this._position = new com.isometric.Point3D();
                _this.updateScreenPosition();
                return _this;
            }
            IsoObject.prototype.updateScreenPosition = function () {
                var screenPos = com.isometric.IsoUtils.isoToScreen(this._position);
                egret.superSetter(com.isometric.IsoObject, this, "x", screenPos.x);
                egret.superSetter(com.isometric.IsoObject, this, "y", screenPos.y);
            };
            IsoObject.prototype.toString = function () {
                return "[IsoObject (x:" + this._position.x + ", y:" + this._position.y + ", z:" + this._position.z + ")]";
            };
            Object.defineProperty(IsoObject.prototype, "x", {
                get: function () {
                    return this._position.x;
                },
                set: function (value) {
                    this._position.x = value;
                    this.updateScreenPosition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "stageX", {
                get: function () {
                    return egret.superGetter(com.isometric.IsoObject, this, "x");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "y", {
                get: function () {
                    return this._position.y;
                },
                set: function (value) {
                    this._position.y = value;
                    this.updateScreenPosition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "stageY", {
                get: function () {
                    return egret.superGetter(com.isometric.IsoObject, this, "y");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "z", {
                get: function () {
                    return this._position.z;
                },
                set: function (value) {
                    this._position.z = value;
                    this.updateScreenPosition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "position", {
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                    this.updateScreenPosition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "depth", {
                get: function () {
                    return (this._position.x + this._position.z) * .866 - this._position.y * .707;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "walkable", {
                get: function () {
                    return this._walkable;
                },
                set: function (value) {
                    this._walkable = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "size", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "rect", {
                get: function () {
                    return new egret.Rectangle(this.x - this.size / 2, this["z"] - this.size / 2, this.size, this.size);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "vx", {
                get: function () {
                    return this._vx;
                },
                set: function (value) {
                    this._vx = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "vy", {
                get: function () {
                    return this._vy;
                },
                set: function (value) {
                    this._vy = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "vz", {
                get: function () {
                    return this._vz;
                },
                set: function (value) {
                    this._vz = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IsoObject.prototype, "position2D", {
                get: function () {
                    return new com.steer.Vector2D(this._position.x, this._position.z);
                },
                set: function (value) {
                    this._position2D = value;
                    this._position.x = value.x;
                    this._position.z = value.y;
                },
                enumerable: true,
                configurable: true
            });
            IsoObject.Y_CORRECT = Math.cos(-Math.PI / 6) * Math.SQRT2;
            return IsoObject;
        }(egret.Sprite));
        isometric.IsoObject = IsoObject;
    })(isometric = com.isometric || (com.isometric = {}));
})(com || (com = {}));
// com.isometric.IsoObject.Y_CORRECT = Math.cos(-Math.PI / 6) * Math.SQRT2;
// flash.extendsClass("com.isometric.IsoObject","egret.Sprite")
