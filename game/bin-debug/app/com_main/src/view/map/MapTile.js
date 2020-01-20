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
    var MapTile = /** @class */ (function (_super_1) {
        __extends(MapTile, _super_1);
        function MapTile(value) {
            var _this = _super_1.call(this, value) || this;
            _this.m_pIndex = 0;
            return _this;
        }
        Object.defineProperty(MapTile.prototype, "index", {
            get: function () {
                return this.m_pIndex;
            },
            set: function (index) {
                this.m_pIndex = index;
            },
            enumerable: true,
            configurable: true
        });
        return MapTile;
    }(egret.Bitmap));
    com_main.MapTile = MapTile;
})(com_main || (com_main = {}));
