var MovieClip = egret.MovieClip;
var MovieClipDataFactory = egret.MovieClipDataFactory;
/**
 * Created by Tint_ on 2017/3/27.
 */
var MovieClipManager = /** @class */ (function () {
    function MovieClipManager() {
    }
    /**
     * 序列帧动画
     * @param name 动画名字
     * @param isCache 是否启用缓存，默认不启用
     * @returns {MovieClip}
     */
    MovieClipManager.creatMovieClip = function (name, isCache) {
        if (isCache === void 0) { isCache = false; }
        return MMCManager.getInstance().getMovieClip(name, isCache);
    };
    /**
     * 动画回收，每creat一个动画，在退出此动画所在的界面时，使用此方法回收回收
     * @param mc
     */
    MovieClipManager.release = function (mc) {
        if (mc == null || MMCManager.getInstance(true) == null)
            return;
        MMCManager.getInstance().delMC2Pools(mc);
    };
    return MovieClipManager;
}());
var MMCManager = /** @class */ (function () {
    function MMCManager() {
        this._mMovicCipPools = null;
        this._mArrMovicCipFactory = null;
        this._mMovicCipPools = [];
        this._mArrMovicCipFactory = {};
    }
    MMCManager.getInstance = function (check) {
        if (check === void 0) { check = false; }
        if (check)
            return MMCManager._mInstance;
        if (MMCManager._mInstance == null) {
            MMCManager._mInstance = new MMCManager();
        }
        return MMCManager._mInstance;
    };
    MMCManager.prototype.getMovieClip = function (name, isCache) {
        if (isCache === void 0) { isCache = false; }
        var mc = this.getMCFromPools();
        var mcFactory = this.getMCDataFactory(name + "_json", name + "_png", isCache);
        mc.movieClipData = mcFactory.generateMovieClipData(name);
        return mc;
    };
    MMCManager.prototype.delMC2Pools = function (mc) {
        if (this._mMovicCipPools.indexOf(mc) != -1) {
            error("这个MC已经被回收了！！！！！");
            return;
        }
        if (mc.parent)
            mc.parent.removeChild(mc);
        mc.stop();
        mc.x = mc.y = mc.skewX = mc.skewY = 0;
        mc.scaleX = mc.scaleY = 1;
        mc.movieClipData = null;
        this._mMovicCipPools.push(mc);
    };
    MMCManager.prototype.getMCDataFactory = function (data, texture, isCache) {
        var mcFactory = this._mArrMovicCipFactory[data];
        if (mcFactory == null) {
            mcFactory = new MovieClipDataFactory(RES.getRes(data), RES.getRes(texture));
            mcFactory.enableCache = isCache;
            this._mArrMovicCipFactory[data] = mcFactory;
        }
        return mcFactory;
    };
    MMCManager.prototype.getMCFromPools = function () {
        var mc = this._mMovicCipPools.pop();
        if (mc == null) {
            if (++MMCManager._mMCMaxNum > 30) {
                console.error("MC的创建大于30, 如果不是同屏内MC的数量，检查之前是不是没有删掉！！！");
            }
            mc = new MovieClip();
        }
        return mc;
    };
    MMCManager._mInstance = null;
    MMCManager._mMCMaxNum = 0;
    return MMCManager;
}());
