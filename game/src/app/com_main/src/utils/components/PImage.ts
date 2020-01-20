/**
 * 具有回收功能的图片
 * Created by leowang on 2016/11/28.
 */
class PImage extends AGame.AImage implements IFObject {
    public static create(source?: string | egret.Texture): PImage {
        let obj = ObjectPool.pop(PImage,"PImage", source);
        return obj;
    }
    public constructor(source?: string | egret.Texture) {
        super(source);
        //this.cacheAsBitmap = true;
    }
    public init(source?: string | egret.Texture) {
        NodeUtils.reset(this,true);
        this.setImage(source);
    }
    public setImage(source?: string | egret.Texture) {
        this.source = source;
    }
    public onDestroy() {
        Utils.removeFromParent(this);
        this.source = '';
        ObjectPool.push(this);
    }
}