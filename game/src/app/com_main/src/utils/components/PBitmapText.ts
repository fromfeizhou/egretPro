/**
 * 具有回收功能的图片
 * Created by leowang on 2016/11/28.
 */
class PBitmapText extends egret.BitmapText implements IFObject {
    public static create(value?: egret.Texture | string): PBitmapText {
        let obj = ObjectPool.pop(PBitmapText,"PBitmapText", value);
        return obj;
    }
    public constructor(/**value?: egret.Texture | string */) {
        super();
        // this.init(value);
        // this.cacheAsBitmap = true;
    }
    public init(value?: egret.Texture | string) {
        // this.setBitmap(value);
    }
    // public setBitmap(value?: egret.Texture | string) {
    //     if (value) {
    //         let texture = value instanceof egret.Texture ? value : RES.getRes(value);
    //         this.texture = texture;
    //     }
    // }
    public onDestroy() {
        Utils.removeFromParent(this);
        ObjectPool.push(this);
    }
}