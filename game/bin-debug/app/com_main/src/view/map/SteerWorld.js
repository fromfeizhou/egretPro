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
/**
 * Created by leowang on 2016/12/20
 */
var com;
(function (com) {
    var view;
    (function (view) {
        var SteerWorld = /** @class */ (function (_super_1) {
            __extends(SteerWorld, _super_1);
            function SteerWorld() {
                var _this = _super_1.call(this) || this;
                _this._mass = 1.0;
                _this._maxSpeed = 30;
                _this._maxForce = 4;
                _this._arrivalThreshold = 50;
                return _this;
            }
            SteerWorld.create = function () {
                return new SteerWorld();
            };
            SteerWorld.prototype.init = function () {
                _super_1.prototype.init.call(this);
                this.touchEnabled = true;
                this._position = new com.steer.Vector2D();
                this._velocity = new com.steer.Vector2D();
                this._steeringForce = new com.steer.Vector2D();
            };
            SteerWorld.prototype.onDestroy = function () {
                _super_1.prototype.onDestroy.call(this);
                this._position = null;
                this._velocity = null;
                this._steeringForce = null;
            };
            SteerWorld.prototype.update = function () {
                this._steeringForce.truncate(this._maxForce);
                this._steeringForce = this._steeringForce.divide(this._mass);
                this._velocity = this._velocity.add(this._steeringForce);
                this._steeringForce = new com.steer.Vector2D();
                this._velocity.truncate(this._maxSpeed);
                this._position = this._position.add(this._velocity);
                this.updateX();
                this.updateY();
            };
            SteerWorld.prototype.updateX = function () {
                this.x = this.position.x;
            };
            SteerWorld.prototype.updateY = function () {
                this.y = this.position.y;
            };
            SteerWorld.prototype.camaraFocu = function (actor) {
                var acVec = new com.steer.Vector2D(actor.x, actor.y);
                // var camPos: egret.Point = flash.globalToLocal(this, new egret.Point(400 - 200, 300 - 200));
                var pos = new egret.Point(this.stage.stageWidth / 2, this.stage.stageHeight / 2);
                var camPos = this.globalToLocal(pos.x, pos.y, pos);
                var camaraVec = new com.steer.Vector2D(camPos.x, camPos.y);
                var desiredVelocity = camaraVec.subtract(acVec);
                desiredVelocity.normalize();
                var dist = acVec.dist(camaraVec);
                if (dist > this._arrivalThreshold) {
                    desiredVelocity = desiredVelocity.multiply(this._maxSpeed);
                }
                else {
                    desiredVelocity = desiredVelocity.multiply(this._maxSpeed * dist / this._arrivalThreshold);
                }
                var forse = desiredVelocity.subtract(this._velocity);
                this._steeringForce = this._steeringForce.add(forse);
            };
            Object.defineProperty(SteerWorld.prototype, "mass", {
                get: function () {
                    return this._mass;
                },
                set: function (value) {
                    this._mass = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteerWorld.prototype, "maxSpeed", {
                get: function () {
                    return this._maxSpeed;
                },
                set: function (value) {
                    this._maxSpeed = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteerWorld.prototype, "position", {
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                    this.x = this._position.x;
                    this.y = this._position.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteerWorld.prototype, "velocity", {
                get: function () {
                    return this._velocity;
                },
                set: function (value) {
                    this._velocity = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteerWorld.prototype, "x", {
                get: function () {
                    return egret.superGetter(com.view.SteerWorld, this, "x");
                },
                set: function (value) {
                    egret.superSetter(com.view.SteerWorld, this, "x", value);
                    this._position.x = this.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteerWorld.prototype, "y", {
                get: function () {
                    return egret.superGetter(com.view.SteerWorld, this, "y");
                },
                set: function (value) {
                    egret.superSetter(com.view.SteerWorld, this, "y", value);
                    this._position.y = this.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteerWorld.prototype, "maxForce", {
                get: function () {
                    return this._maxForce;
                },
                set: function (value) {
                    this._maxForce = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteerWorld.prototype, "arriveThreshold", {
                get: function () {
                    return this._arrivalThreshold;
                },
                set: function (value) {
                    this._arrivalThreshold = value;
                },
                enumerable: true,
                configurable: true
            });
            SteerWorld.prototype.setColor = function (filter) {
                this.m_pWorld.filters = [filter];
                this.m_pBuild.filters = [filter];
            };
            return SteerWorld;
        }(com.isometric.IsoWorld));
        view.SteerWorld = SteerWorld;
    })(view = com.view || (com.view = {}));
})(com || (com = {}));
// flash.extendsClass("com.view.SteerWorld", "com.isometric.IsoWorld")
