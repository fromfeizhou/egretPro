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
var PImage = /** @class */ (function (_super_1) {
    __extends(PImage, _super_1);
    function PImage(source) {
        return _super_1.call(this, source) || this;
        //this.cacheAsBitmap = true;
    }
    PImage.create = function (source) {
        var obj = ObjectPool.pop(PImage, "PImage", source);
        return obj;
    };
    PImage.prototype.init = function (source) {
        NodeUtils.reset(this, true);
        this.setImage(source);
    };
    PImage.prototype.setImage = function (source) {
        this.source = source;
    };
    PImage.prototype.onDestroy = function () {
        Utils.removeFromParent(this);
        this.source = '';
        ObjectPool.push(this);
    };
    return PImage;
}(AGame.AImage));
