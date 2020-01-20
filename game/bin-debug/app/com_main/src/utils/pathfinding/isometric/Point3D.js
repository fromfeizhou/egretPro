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
        var Point3D = /** @class */ (function (_super_1) {
            __extends(Point3D, _super_1);
            function Point3D(x, y, z) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (z === void 0) { z = 0; }
                var _this = _super_1.call(this) || this;
                _this.x = NaN;
                _this.y = NaN;
                _this.z = NaN;
                _this.x = x;
                _this.y = y;
                _this.z = z;
                return _this;
            }
            return Point3D;
        }(egret.HashObject));
        isometric.Point3D = Point3D;
    })(isometric = com.isometric || (com.isometric = {}));
})(com || (com = {}));
