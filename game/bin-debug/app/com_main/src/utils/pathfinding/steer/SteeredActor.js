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
        var SteeredActor = /** @class */ (function (_super_1) {
            __extends(SteeredActor, _super_1);
            function SteeredActor(size) {
                var _this = _super_1.call(this, size) || this;
                _this._maxForce = 12;
                _this._arrivalThreshold = 10;
                _this._minDis = 20;
                size = flash.checkInt(size);
                _this._steeringForce = new com.steer.Vector2D();
                return _this;
            }
            Object.defineProperty(SteeredActor.prototype, "maxForce", {
                get: function () {
                    return this._maxForce;
                },
                set: function (value) {
                    this._maxForce = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SteeredActor.prototype, "arriveThreshold", {
                get: function () {
                    return this._arrivalThreshold;
                },
                set: function (value) {
                    this._arrivalThreshold = value;
                },
                enumerable: true,
                configurable: true
            });
            SteeredActor.prototype.update = function () {
                this._steeringForce.truncate(this._maxForce);
                this._steeringForce = this._steeringForce.divide(this._mass);
                this._velocity = this._velocity.add(this._steeringForce);
                this._steeringForce = new com.steer.Vector2D();
                _super_1.prototype.update.call(this);
            };
            SteeredActor.prototype.arrive = function (target) {
                var desiredVelocity = target.subtract(this.position2D);
                desiredVelocity.normalize();
                var dist = this.position2D.dist(target);
                if (dist > this._arrivalThreshold) {
                    desiredVelocity = desiredVelocity.multiply(this._maxSpeed);
                }
                else {
                    desiredVelocity = desiredVelocity.multiply(this._maxSpeed * dist / this._arrivalThreshold);
                }
                var force = desiredVelocity.subtract(this._velocity);
                this._steeringForce = this._steeringForce.add(force);
                if (dist < this._minDis) {
                    return true;
                }
                else {
                    return false;
                }
            };
            return SteeredActor;
        }(com.steer.Actor));
        steer.SteeredActor = SteeredActor;
    })(steer = com.steer || (com.steer = {}));
})(com || (com = {}));
// flash.extendsClass("com.steer.SteeredActor","com.steer.Actor")
