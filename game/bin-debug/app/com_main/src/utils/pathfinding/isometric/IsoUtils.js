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
        var IsoUtils = /** @class */ (function (_super_1) {
            __extends(IsoUtils, _super_1);
            function IsoUtils() {
                return _super_1 !== null && _super_1.apply(this, arguments) || this;
            }
            IsoUtils.isoToScreen = function (pos) {
                var screenX = pos.x - pos.z;
                var screenY = pos.y * com.isometric.IsoUtils.Y_CORRECT + (pos.x + pos.z) * .5;
                return new egret.Point(screenX, screenY);
            };
            IsoUtils.screenToIso = function (point) {
                var xpos = point.y + point.x * .5;
                var ypos = 0;
                var zpos = point.y - point.x * .5;
                return new com.isometric.Point3D(xpos, ypos, zpos);
            };
            return IsoUtils;
        }(egret.HashObject));
        isometric.IsoUtils = IsoUtils;
    })(isometric = com.isometric || (com.isometric = {}));
})(com || (com = {}));
com.isometric.IsoUtils.Y_CORRECT = Math.cos(-Math.PI / 6) * Math.SQRT2;
