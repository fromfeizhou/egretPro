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
var PBitmapText = /** @class */ (function (_super_1) {
    __extends(PBitmapText, _super_1);
    function PBitmapText( /**value?: egret.Texture | string */) {
        return _super_1.call(this) || this;
        // this.init(value);
        // this.cacheAsBitmap = true;
    }
    PBitmapText.create = function (value) {
        var obj = ObjectPool.pop(PBitmapText, "PBitmapText", value);
        return obj;
    };
    PBitmapText.prototype.init = function (value) {
        // this.setBitmap(value);
    };
    // public setBitmap(value?: egret.Texture | string) {
    //     if (value) {
    //         let texture = value instanceof egret.Texture ? value : RES.getRes(value);
    //         this.texture = texture;
    //     }
    // }
    PBitmapText.prototype.onDestroy = function () {
        Utils.removeFromParent(this);
        ObjectPool.push(this);
    };
    return PBitmapText;
}(egret.BitmapText));
