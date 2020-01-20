/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
class DisplayUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    public createBitmap(resName?: any): egret.Bitmap {
        let result: egret.Bitmap = new egret.Bitmap();
        if (resName) {
            let texture = resName instanceof egret.Texture ? resName : RES.getRes(resName);
            result.texture = texture;
        }
        return result;
    }

    public createPBitmap(value?: egret.Texture | string): PBitmap {
        let result: PBitmap = PBitmap.create(value);
        return result;
    }

    public createPBitmapText(value?: string): PBitmapText {
        let result: PBitmapText = PBitmapText.create(value);
        return result;
    }

    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {eui.Image}
     */
    public createEImage(resName?: any): eui.Image {
        let result: eui.Image = new eui.Image();
        if (resName) {
            let texture = resName instanceof egret.Texture ? resName : RES.getRes(resName);
            result.source = texture;
        }
        return result;
    }
    public createPImage(value?: any): PImage {
        let result: PImage = PImage.create(value);
        return result;
    }

    /** */
    public createLabel(parent?: egret.DisplayObjectContainer, size?: number, color?, stroke?) {
        let label = new eui.Label();
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.textColor = color || GameConfig.TextColors.fontWhite;
        label.strokeColor = stroke || GameConfig.TextColors.stroke;
        label.size = fontSize(size || 25);
        label.stroke = 2;
        if (parent) Utils.addChild(parent, label)
        return label;
    }

    /**
     * 从父级移除child
     * @param child
     */
    public removeFromParent(child: egret.DisplayObject) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    }

    /**绘制矩形 */
    public drawRect(obj: any, color?, width?: number, height?: number, alpha?: number) {
        width = width || obj.width;
        height = height || obj.height;
        obj.graphics.clear();
        obj.graphics.lineStyle(1);
        obj.graphics.beginFill(color || 0x000000, alpha || 0.4);
        obj.graphics.drawRect(0, 0, width, height);
        obj.graphics.endFill();
    }

    /**绘制菱形 */
    public drawDiamond(obj: any, color?, linecolor?, width?: number, height?: number) {
        width = width || obj.width;
        height = height || obj.height;
        let midW = width * 0.5;
        let midH = height * 0.5;
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
    }

    public drawCircle(obj: egret.Sprite, radius?: number, color?, linecolor?) {
        radius = radius || obj.width / 2;
        obj.graphics.clear();
        if (color) {
            obj.graphics.beginFill(color || 0x000000);
        }
        obj.graphics.lineStyle(1, linecolor || 0x000000);
        obj.graphics.drawCircle(0, 0, radius);
        obj.graphics.endFill();
    }
}
