/**
 * 具有回收功能的图片
 * Created by leowang on 2016/11/28.
 */
class PBitmap extends egret.Bitmap implements IFObject {
    public static create(value?: egret.Texture | string): PBitmap {
        let obj = ObjectPool.pop(PBitmap,"PBitmap", value);
        return obj;
    }
    public constructor(value?: egret.Texture | string) {
        super();
        this.init(value);
        //this.cacheAsBitmap = true;
    }
    public init(value?: egret.Texture | string) {
        this.setBitmap(value);
    }
    public setBitmap(value?: egret.Texture | string) {
        if (value) {
            let texture = value instanceof egret.Texture ? value : RES.getRes(value);
            this.texture = texture;
        }
    }
    public onDestroy() {
        Utils.removeFromParent(this);
        ObjectPool.push(this);
    }
}