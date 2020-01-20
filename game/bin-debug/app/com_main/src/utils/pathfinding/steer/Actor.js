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
        var Actor = /** @class */ (function (_super_1) {
            __extends(Actor, _super_1);
            function Actor(size) {
                var _this = _super_1.call(this, size) || this;
                _this._edgeBehavior = com.steer.Actor.BOUNCE;
                _this._mass = 1.0;
                _this._maxSpeed = 120;
                size = flash.checkInt(size);
                _this._velocity = new com.steer.Vector2D();
                _this.draw();
                return _this;
            }
            Actor.prototype.draw = function () {
                this.graphics.clear();
                this.graphics.beginFill(0xFF0000);
                this.graphics.lineStyle(0);
                this.graphics.moveTo(10, 0);
                this.graphics.lineTo(-10, 5);
                this.graphics.lineTo(-10, -5);
                this.graphics.lineTo(10, 0);
                this.graphics.endFill();
            };
            Actor.prototype.update = function () {
                this._velocity.truncate(this._maxSpeed);
                this.position2D = this.position2D.add(this._velocity);
                this.x = this.position.x;
                this.y = this.position.y;
                if (this._velocity.x == 0 && this._velocity.y == 0)
                    return;
                var isoP = com.isometric.IsoUtils.isoToScreen(new com.isometric.Point3D(this._velocity.x, 0, this._velocity.y));
                this.rotation = Math.atan2(isoP.y, isoP.x) * 180 / Math.PI;
            };
            Actor.prototype.bounce = function () {
                if (this.stage != null) {
                    if (this.position.x > this.stage.stageWidth) {
                        this.position.x = this.stage.stageWidth;
                        this.velocity.x *= -1;
                    }
                    else if (this.position.x < 0) {
                        this.position.x = 0;
                        this.velocity.x *= -1;
                    }
                    if (this.position.y > this.stage.stageHeight) {
                        this.position.y = this.stage.stageHeight;
                        this.velocity.y *= -1;
                    }
                    else if (this.position.y < 0) {
                        this.position.y = 0;
                        this.velocity.y *= -1;
                    }
                }
            };
            Actor.prototype.wrap = function () {
                if (this.stage != null) {
                    if (this.position.x > this.stage.stageWidth)
                        this.position.x = 0;
                    if (this.position.x < 0)
                        this.position.x = this.stage.stageWidth;
                    if (this.position.y > this.stage.stageHeight)
                        this.position.y = 0;
                    if (this.position.y < 0)
                        this.position.y = this.stage.stageHeight;
                }
            };
            Object.defineProperty(Actor.prototype, "edgeBehavior", {
                get: function () {
                    return this._edgeBehavior;
                },
                set: function (value) {
                    this._edgeBehavior = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "mass", {
                get: function () {
                    return this._mass;
                },
                set: function (value) {
                    this._mass = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "maxSpeed", {
                get: function () {
                    return this._maxSpeed;
                },
                set: function (value) {
                    this._maxSpeed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "velocity", {
                get: function () {
                    return this._velocity;
                },
                set: function (value) {
                    this._velocity = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "x", {
                get: function () {
                    return egret.superGetter(com.steer.Actor, this, "x");
                },
                set: function (value) {
                    egret.superSetter(com.steer.Actor, this, "x", value);
                    this._position.x = this.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Actor.prototype, "y", {
                get: function () {
                    return egret.superGetter(com.steer.Actor, this, "y");
                },
                set: function (value) {
                    egret.superSetter(com.steer.Actor, this, "y", value);
                    this._position.y = this.y;
                },
                enumerable: true,
                configurable: true
            });
            return Actor;
        }(com.isometric.IsoObject));
        steer.Actor = Actor;
    })(steer = com.steer || (com.steer = {}));
})(com || (com = {}));
com.steer.Actor.WRAP = "wrap";
com.steer.Actor.BOUNCE = "bounce";
// flash.extendsClass("com.steer.Actor","com.isometric.IsoObject")
