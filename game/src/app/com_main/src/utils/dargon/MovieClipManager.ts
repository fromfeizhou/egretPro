import MovieClip = egret.MovieClip;
import MovieClipDataFactory = egret.MovieClipDataFactory;
/**
 * Created by Tint_ on 2017/3/27.
 */
class MovieClipManager{
    /**
     * 序列帧动画
     * @param name 动画名字
     * @param isCache 是否启用缓存，默认不启用
     * @returns {MovieClip}
     */
    public static creatMovieClip(name:string, isCache:boolean = false):MovieClip{
        return MMCManager.getInstance().getMovieClip(name,isCache);
    }

    /**
     * 动画回收，每creat一个动画，在退出此动画所在的界面时，使用此方法回收回收
     * @param mc
     */
    public static release(mc:MovieClip){
        if(mc == null || MMCManager.getInstance(true) == null) return;
        MMCManager.getInstance().delMC2Pools(mc);
    }
}

class MMCManager{
    private static _mInstance:MMCManager = null;
    public static getInstance(check:boolean = false):MMCManager{
        if(check) return MMCManager._mInstance;
        if(MMCManager._mInstance == null){
            MMCManager._mInstance = new MMCManager();
        }
        return MMCManager._mInstance;
    }
    private _mMovicCipPools:Array<MovieClip> = null;
    private _mArrMovicCipFactory:any = null;
    constructor(){
        this._mMovicCipPools = [];
        this._mArrMovicCipFactory = {};
    }
    public getMovieClip(name:string, isCache:boolean = false):MovieClip{
        let mc:MovieClip = this.getMCFromPools();
        let mcFactory:MovieClipDataFactory = this.getMCDataFactory(name + "_json", name + "_png", isCache);
        mc.movieClipData = mcFactory.generateMovieClipData(name);
        return mc;
    }
    public delMC2Pools(mc:MovieClip){
        if(this._mMovicCipPools.indexOf(mc) != -1){
            error("这个MC已经被回收了！！！！！");
            return;
        }
        if(mc.parent)
            mc.parent.removeChild(mc);
        mc.stop();
        mc.x = mc.y = mc.skewX = mc.skewY = 0;
        mc.scaleX = mc.scaleY = 1;
        mc.movieClipData = null;
        this._mMovicCipPools.push(mc);
    }
    private getMCDataFactory(data:string, texture:string, isCache:boolean):MovieClipDataFactory{
        let mcFactory:MovieClipDataFactory = this._mArrMovicCipFactory[data];
        if(mcFactory == null){
            mcFactory = new MovieClipDataFactory(RES.getRes(data), RES.getRes(texture));
            mcFactory.enableCache = isCache;
            this._mArrMovicCipFactory[data] = mcFactory;
        }
        return mcFactory;
    }
    private static _mMCMaxNum:number = 0;
    private getMCFromPools():MovieClip{
        let mc:MovieClip = this._mMovicCipPools.pop();
        if(mc == null) {
            if(++MMCManager._mMCMaxNum > 30){
                console.error("MC的创建大于30, 如果不是同屏内MC的数量，检查之前是不是没有删掉！！！");
            }
            mc = new MovieClip();
        }
        return mc;
    }
}