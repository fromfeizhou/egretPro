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
 * Created by CJS on 2017/5/31.
 * 创建 白鹭极速格式 的动画。不涉及回收，使用时请注意！！！！！
 * 1)白鹭极速格式 的原理是将复杂的动画直接缓存到二进制数据中，这样就不需要在运行时缓存，也不需要复杂的解析数据过程，
 * 更不需要创建中间数据结构，优化了动画初始化的性能和内存的开支，相应的将不支持融合动画、混合动画、网格动画，
 * 由于运行时没有皮肤、骨骼、插槽的概念，所以不支持获取骨骼或插槽的位置，无法修改骨骼或插槽的任何属性，也就不支持换装。
 * 2)白鹭极速格式 适用于那些完全不需要在播放中改变的动画（或称之为静态动画），可以理解为动画设计师把动画制作成什么样子，
 * 动画在程序中播放就是什么样子，程序没有办法动态的改变动画中的任何元素。
 * 使用时，初始化一次
 * 在打开界面时play()
 * 关闭界面时remove2Clock()
 */
var MovieDragonBones = /** @class */ (function (_super_1) {
    __extends(MovieDragonBones, _super_1);
    function MovieDragonBones() {
        var _this = _super_1.call(this) || this;
        /**龙骨动画*/
        _this._mDBMovie = null;
        _this._mInit = false; //是否已初始化过
        _this._mDBName = null; //龙骨名字    
        _this.m_pIsLoadDbmv = false; //是否已加载完龙骨二进制文件
        _this.m_pIsLoadPng = false; //是否已加载完龙骨图片
        _this.m_pPlayName = null;
        _this.m_pPlayTimes = 0;
        _this.m_pTimeScale = 1; //时间加速
        _this.m_pIsRemoveAll = false; //是否已经移除
        _this.m_pIsPlay = false; //是否在播放
        _this.m_pAddEvent = null;
        _this._scaleX = 1;
        _this._scaleY = 1;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    MovieDragonBones.prototype.init = function (dbName) {
        if (this._mInit)
            return;
        this._mDBMovie = DragonBonesManager.getDragonBonesMovie(dbName);
        this.addChild(this._mDBMovie);
        this._mInit = true;
        this._mDBMovie.scaleX = this._scaleX;
        this._mDBMovie.scaleY = this._scaleY;
    };
    /**异步加载资源 */
    MovieDragonBones.prototype.initAsync = function (dbName) {
        this._mDBName = dbName;
        if (this.checkData(dbName) == false) {
            // error("没有龙骨资源=" + dbName);
            this.downloadData(dbName);
        }
        else {
            this.init(dbName);
        }
    };
    MovieDragonBones.prototype.stop = function () {
        this.m_pIsPlay = false;
        error("stop()-" + this._mDBName);
        if (this._mDBMovie != null) {
            this._mDBMovie.stop();
        }
    };
    MovieDragonBones.prototype.dbTimeScale = function (_timeScale) {
        if (this._mDBMovie) {
            this._mDBMovie.timeScale = _timeScale;
        }
        this.m_pTimeScale = _timeScale;
    };
    MovieDragonBones.prototype.setScale = function (scaleX, scaleY) {
        this._scaleX = scaleX;
        this._scaleY = scaleY;
    };
    MovieDragonBones.prototype.addDBEventListener = function (eventType, onResourceLoadError, target) {
        if (this._mDBMovie) {
            this._mDBMovie.addEventListener(eventType, onResourceLoadError, target);
        }
        else {
            this.m_pAddEvent = [eventType, onResourceLoadError, target];
        }
    };
    MovieDragonBones.prototype.removeDBEventListener = function (eventType, onResourceLoadError, target) {
        if (this._mDBMovie) {
            this._mDBMovie.removeEventListener(eventType, onResourceLoadError, target);
        }
        else {
            if (this.m_pAddEvent) {
                this.m_pAddEvent[0] = null;
                this.m_pAddEvent[1] = null;
                this.m_pAddEvent[2] = null;
            }
            this.m_pAddEvent = null;
        }
    };
    MovieDragonBones.prototype.gotoAndPlay = function (clipName, time, playTimes) {
        if (this._mDBMovie == null) {
            this.m_pPlayName = clipName;
            this.m_pPlayTimes = playTimes;
            this.m_pIsPlay = true;
            return;
        }
        else {
            this._mDBMovie.gotoAndPlay(clipName, time, playTimes);
        }
    };
    MovieDragonBones.prototype.play = function (clipName, playTimes) {
        if (this._mDBMovie == null) {
            this.m_pPlayName = clipName;
            this.m_pPlayTimes = playTimes;
            this.m_pIsPlay = true;
            return;
        }
        else {
            this._mDBMovie.play(clipName, playTimes);
        }
    };
    MovieDragonBones.prototype.getRemainTime = function () {
        if (this._mDBMovie != null) {
            return this._mDBMovie.totalTime - this._mDBMovie.currentTime;
        }
        return 0;
    };
    // public get movie() {
    //     return this._mDBMovie;
    // }
    MovieDragonBones.prototype.removeAll = function () {
        this.m_pIsPlay = false;
        this.m_pIsRemoveAll = true;
        if (!this._mInit)
            return;
        this._mInit = false;
        this.removeChildren();
        this.stop();
        if (this._mDBMovie) {
            this._mDBMovie.dispose();
        }
        this._mDBMovie = null;
        this._mDBName = null;
        this.m_pPlayName = null;
        if (this.m_pAddEvent) {
            this.m_pAddEvent[0] = null;
            this.m_pAddEvent[1] = null;
            this.m_pAddEvent[2] = null;
        }
        this.m_pAddEvent = null;
    };
    MovieDragonBones.prototype.destroy = function () {
        this.visible = false;
        this.removeAll();
        this.parent.removeChild(this);
    };
    //检查是否已存在龙骨数据
    MovieDragonBones.prototype.checkData = function (dbName) {
        var skeletonData = RES.getRes(dbName + "_ske_dbmv");
        var textureData = RES.getRes(dbName + "_tex_png");
        if (skeletonData == null || textureData == null) {
            return false;
        }
        return true;
    };
    //下载相关数据
    MovieDragonBones.prototype.downloadData = function (dbName) {
        var _dbmvStr = dbName + "_ske_dbmv";
        var _pngStr = dbName + "_tex_png";
        var resArr = [_dbmvStr, _pngStr];
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.downloadFinsh, this);
        RES.loadGroup(dbName);
        //  ResLoadManager.getInstance().addLoadPriorityResArr(resArr, this.downloadFinsh, null, null, this);
    };
    //下载完成
    MovieDragonBones.prototype.downloadFinsh = function () {
        if (this.checkData(this._mDBName) == false) {
            this.downloadData(this._mDBName);
        }
        else {
            this.init(this._mDBName);
            if (this.m_pPlayName != null && this.m_pIsPlay == true) {
                this.dbTimeScale(this.m_pTimeScale);
                if (this.m_pAddEvent) {
                    this.addDBEventListener(this.m_pAddEvent[0], this.m_pAddEvent[1], this.m_pAddEvent[2]);
                }
                this.play(this.m_pPlayName, this.m_pPlayTimes);
            }
        }
    };
    MovieDragonBones.prototype.getDBName = function () {
        return this._mDBName;
    };
    return MovieDragonBones;
}(egret.DisplayObjectContainer));
