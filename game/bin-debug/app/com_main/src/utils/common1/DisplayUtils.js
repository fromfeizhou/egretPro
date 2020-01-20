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
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
var DisplayUtils = /** @class */ (function (_super_1) {
    __extends(DisplayUtils, _super_1);
    /**
     * 构造函数
     */
    function DisplayUtils() {
        return _super_1.call(this) || this;
    }
    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    DisplayUtils.prototype.createBitmap = function (resName) {
        var result = new egret.Bitmap();
        if (resName) {
            var texture = resName instanceof egret.Texture ? resName : RES.getRes(resName);
            result.texture = texture;
        }
        return result;
    };
    DisplayUtils.prototype.createPBitmap = function (value) {
        var result = PBitmap.create(value);
        return result;
    };
    DisplayUtils.prototype.createPBitmapText = function (value) {
        var result = PBitmapText.create(value);
        return result;
    };
    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {eui.Image}
     */
    DisplayUtils.prototype.createEImage = function (resName) {
        var result = new eui.Image();
        if (resName) {
            var texture = resName instanceof egret.Texture ? resName : RES.getRes(resName);
            result.source = texture;
        }
        return result;
    };
    DisplayUtils.prototype.createPImage = function (value) {
        var result = PImage.create(value);
        return result;
    };
    /** */
    DisplayUtils.prototype.createLabel = function (parent, size, color, stroke) {
        var label = new eui.Label();
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.textColor = color || GameConfig.TextColors.fontWhite;
        label.strokeColor = stroke || GameConfig.TextColors.stroke;
        label.size = fontSize(size || 25);
        label.stroke = 2;
        if (parent)
            Utils.addChild(parent, label);
        return label;
    };
    /**
     * 从父级移除child
     * @param child
     */
    DisplayUtils.prototype.removeFromParent = function (child) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    /**绘制矩形 */
    DisplayUtils.prototype.drawRect = function (obj, color, width, height, alpha) {
        width = width || obj.width;
        height = height || obj.height;
        obj.graphics.clear();
        obj.graphics.lineStyle(1);
        obj.graphics.beginFill(color || 0x000000, alpha || 0.4);
        obj.graphics.drawRect(0, 0, width, height);
        obj.graphics.endFill();
    };
    /**绘制菱形 */
    DisplayUtils.prototype.drawDiamond = function (obj, color, linecolor, width, height) {
        width = width || obj.width;
        height = height || obj.height;
        var midW = width * 0.5;
        var midH = height * 0.5;
        obj.graphics.clear();
        if (color) {
            obj.graphics.beginFill(color || 0x000000);
        }
        obj.graphics.lineStyle(1, linecolor || 0x000000);
        obj.graphics.moveTo(midW, 0);
        obj.graphics.lineTo(0, midH);
        obj.graphics.lineTo(midW, height);
        obj.graphics.lineTo(width, midH);
        obj.graphics.lineTo(midW, 0);
        obj.graphics.endFill();
    };
    DisplayUtils.prototype.drawCircle = function (obj, radius, color, linecolor) {
        radius = radius || obj.width / 2;
        obj.graphics.clear();
        if (color) {
            obj.graphics.beginFill(color || 0x000000);
        }
        obj.graphics.lineStyle(1, linecolor || 0x000000);
        obj.graphics.drawCircle(0, 0, radius);
        obj.graphics.endFill();
    };
    return DisplayUtils;
}(BaseClass));
