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
 * 具有回收功能的图片
 * Created by leowang on 2016/11/28.
 */
var PBitmap = /** @class */ (function (_super_1) {
    __extends(PBitmap, _super_1);
    function PBitmap(value) {
        var _this = _super_1.call(this) || this;
        _this.init(value);
        return _this;
        //this.cacheAsBitmap = true;
    }
    PBitmap.create = function (value) {
        var obj = ObjectPool.pop(PBitmap, "PBitmap", value);
        return obj;
    };
    PBitmap.prototype.init = function (value) {
        this.setBitmap(value);
    };
    PBitmap.prototype.setBitmap = function (value) {
        if (value) {
            var texture = value instanceof egret.Texture ? value : RES.getRes(value);
            this.texture = texture;
        }
    };
    PBitmap.prototype.onDestroy = function () {
        Utils.removeFromParent(this);
        ObjectPool.push(this);
    };
    return PBitmap;
}(egret.Bitmap));
