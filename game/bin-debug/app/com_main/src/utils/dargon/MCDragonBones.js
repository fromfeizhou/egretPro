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
 * Created by Tint_ on 2017/4/17.
 * 龙骨动画的一个包装类。不涉及回收，使用时请注意！！！！！
 * 使用时，初始化一次
 * 在打开界面时play()
 * 关闭界面时remove2Clock()
 */
var MCDragonBones = /** @class */ (function (_super_1) {
    __extends(MCDragonBones, _super_1);
    function MCDragonBones() {
        var _this = _super_1.call(this) || this;
        /**龙骨动画*/
        _this._mDBArmature = null;
        _this._mInit = false;
        _this._mDBName = null; //龙骨名字    
        _this.m_pPlayName = null;
        _this.m_pPlayTimes = 0;
        _this.m_pAddEvent = null;
        _this.m_pTimeScale = 1; //时间加速
        _this.m_pSlotName = null; //换装的骨头名
        _this.m_pTextureName = null; //换装的资源名
        _this.m_pIsRemoveAll = false; //是否已经移除
        _this.m_pIsPlay = false; //是否在播放
        /**是否自动播放一次后就自动移除 */
        _this.m_pIsAutoRemove = false;
        _this.m_pOnResLoadCompleter = null;
        _this.m_pTarget = null;
        _this._scaleX = 1;
        _this._scaleY = 1;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    // private downloadList = [];
    // private downloadFailNum = 0;
    // private loadResNum = 0;
    // private isGroup: boolean = false;
    // private resNum: number = 0;
    MCDragonBones.prototype.init = function (dbName) {
        if (this._mInit)
            return;
        //对象已清理
        if (!this._mDBName)
            return;
        this._mDBArmature = DragonBonesManager.getDragonBones(dbName);
        this.addChild(this._mDBArmature);
        this._mInit = true;
        if (C.DragonBonesScaleConfig && C.DragonBonesScaleConfig[dbName]) {
            this.setScale(1 / C.DragonBonesScaleConfig[dbName].scale, 1 / C.DragonBonesScaleConfig[dbName].scale);
        }
        this._mDBArmature.scaleX = this._scaleX;
        this._mDBArmature.scaleY = this._scaleY;
        //初始化回调
        if (this.m_initArmationCallFunc) {
            this.m_initArmationCallFunc.call(this.m_initArmationCallObj);
        }
        DragonBonesManager.addMcInsCahce(this._mDBName);
    };
    /**异步加载资源 */
    MCDragonBones.prototype.initAsync = function (dbName) {
        // 选择低品质
        if (GameConfig.BTEELE_QUALITY == BattleQualityEnum.LOW && C.DragonBonesScaleConfig && C.DragonBonesScaleConfig[dbName + '_s']) {
            dbName = dbName + '_s';
        }
        this._mDBName = dbName;
        if (this.checkData(dbName) == false) {
            this.downloadData(dbName);
        }
        else {
            this.init(dbName);
        }
    };
    MCDragonBones.prototype.stop = function () {
        this.m_pIsPlay = false;
        if (this._mDBArmature) {
            /**记录上次暂停的时间 */
            var aniState = this._mDBArmature.animation.getState(this.m_pPlayName);
            if (aniState) {
                this.m_currentTime = aniState.currentTime;
            }
            this._mDBArmature.animation.stop();
            this._mDBArmature.animation.reset();
        }
    };
    MCDragonBones.prototype.setScale = function (scaleX, scaleY) {
        this._scaleX = scaleX;
        this._scaleY = scaleY;
    };
    MCDragonBones.prototype.dbTimeScale = function (_timeScale) {
        if (this._mDBArmature) {
            this._mDBArmature.animation.timeScale = _timeScale;
        }
        this.m_pTimeScale = _timeScale;
    };
    MCDragonBones.prototype.addDBEventListener = function (eventType, onResourceLoadError, target) {
        if (this._mDBArmature) {
            this._mDBArmature.addEventListener(eventType, onResourceLoadError, target);
        }
        else {
            this.m_pAddEvent = [eventType, onResourceLoadError, target];
        }
    };
    MCDragonBones.prototype.removeDBEventListener = function (eventType, onResourceLoadError, target) {
        if (this._mDBArmature) {
            this._mDBArmature.removeEventListener(eventType, onResourceLoadError, target);
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
    MCDragonBones.prototype.addLoadCompleteEvent = function (onResLoadCompleter, target) {
        this.m_pOnResLoadCompleter = onResLoadCompleter;
        this.m_pTarget = target;
        if (this._mDBArmature) {
            if (this.m_pOnResLoadCompleter && this.m_pTarget) {
                this.m_pOnResLoadCompleter.call(this.m_pTarget);
            }
        }
    };
    Object.defineProperty(MCDragonBones.prototype, "isPlaying", {
        get: function () {
            if (this._mDBArmature) {
                return this._mDBArmature.animation.isPlaying;
            }
            else {
                return this.m_pIsPlay;
            }
        },
        enumerable: true,
        configurable: true
    });
    MCDragonBones.prototype.reset = function () {
        if (this._mDBArmature) {
            this._mDBArmature.animation.reset();
        }
    };
    /**
     * isAutoRemove  是否自动播放n次后就自动移除
     * isContinuePlayLast  是否从上次暂停的地方播放
     */
    MCDragonBones.prototype.play = function (playName, times, isAutoRemove, isContinuePlayLast) {
        if (times === void 0) { times = 0; }
        if (isAutoRemove === void 0) { isAutoRemove = false; }
        if (isContinuePlayLast === void 0) { isContinuePlayLast = false; }
        if (this._mDBArmature == null) {
            this.m_pPlayName = playName;
            this.m_pPlayTimes = times;
            this.m_pIsPlay = true;
            this.m_pIsAutoRemove = isAutoRemove;
            return;
        }
        else {
            this.m_pPlayName = playName;
            if (isContinuePlayLast && this.m_currentTime) {
                this._mDBArmature.animation.gotoAndPlayByTime(playName, this.m_currentTime, times);
            }
            else {
                this._mDBArmature.animation.play(playName, times);
            }
            if (times > 0 && isAutoRemove == true) {
                this._mDBArmature.addEventListener(egret.Event.COMPLETE, this.removeDragonBones, this);
            }
            else {
                if (!this._mDBArmature.hasEvent(egret.Event.LOOP_COMPLETE))
                    this._mDBArmature.addEventListener(egret.Event.LOOP_COMPLETE, this.onLoopComplete, this);
            }
        }
    };
    /**
     * 绑定函数，初始化后回调
     */
    MCDragonBones.prototype.bindInitCallback = function (initArmationCallFunc, obj) {
        this.m_initArmationCallFunc = initArmationCallFunc;
        this.m_initArmationCallObj = obj;
    };
    /**
     * 替换插槽
     * @param slotName 插槽名称 原材料
     * @param textureName 图片名  xxx_png
     * @param 偏移量
     */
    MCDragonBones.prototype.setNewSlot = function (slotName, textureName, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (!this._mDBArmature)
            return;
        var slot = this._mDBArmature.armature.getSlot(slotName);
        if (!slot) {
            return;
        }
        var b = new eui.Image();
        b.source = textureName;
        // b.x = slot.display.x;
        // b.y = slot.display.y;
        b.anchorOffsetX = b.width / 2 + offsetX;
        b.anchorOffsetY = b.height / 2 + offsetY;
        // slot.setDisplay(b);
        slot.displayList = [b];
    };
    MCDragonBones.prototype.setSlotDisplayList = function (slotName, textureName, width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (!this._mDBArmature)
            return;
        var slot = this._mDBArmature.armature.getSlot(slotName);
        if (!slot) {
            console.log("找不到骨架:", slotName);
            return;
        }
        var arr = [];
        for (var _i = 0, textureName_1 = textureName; _i < textureName_1.length; _i++) {
            var source = textureName_1[_i];
            var img = ObjectPool.pop(eui.Image, "eui.Image");
            img.width = width;
            img.height = height;
            img.source = source;
            img.anchorOffsetX = width / 2;
            img.anchorOffsetY = height / 2;
            arr.push(img);
        }
        slot.displayList = arr;
        return arr;
    };
    MCDragonBones.prototype.setSlotDisplay = function (slotName, obj, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (!this._mDBArmature)
            return;
        var slot = this._mDBArmature.armature.getSlot(slotName);
        if (!slot) {
            return;
        }
        obj.anchorOffsetX = obj.width / 2 + offsetX;
        obj.anchorOffsetY = obj.height / 2 + offsetY;
        slot.setDisplay(obj);
    };
    //循环回调
    MCDragonBones.prototype.onLoopComplete = function (e) {
        var target = e.target;
        if (target) {
            var parent_1 = target.parent;
            if (parent_1) {
                this.doComplateAction();
            }
        }
    };
    /**设置回调 */
    MCDragonBones.prototype.setCallback = function (callback, callbackObj) {
        this.m_pCallBack = callback;
        this.m_pCallBackObj = callbackObj;
    };
    /**播放一次回调(动画自动销毁) */
    MCDragonBones.prototype.playOnceDone = function (playName, callback, callbackObj) {
        //移除场景 不执行回调
        // if (!this['$McAutoClear']) {
        //     //移除函数 挂钩新内容
        //     this['$McAutoClear'] = true;
        //     let removeFunc = this.$onRemoveFromStage.bind(this);
        //     this.$onRemoveFromStage = function () {
        //         removeFunc();
        //         this.removeAll();
        //     }
        // }
        this.m_pCallBack = callback;
        this.m_pCallBackObj = callbackObj;
        this.play(playName, 1, true);
    };
    /**复用动画播放一次回调(动画 需手动回收到对象池)*/
    MCDragonBones.prototype.playNorOnce = function (playName, callback, callbackObj) {
        this.m_pCallBack = callback;
        this.m_pCallBackObj = callbackObj;
        this.play(playName, 1);
    };
    /**回调执行 */
    MCDragonBones.prototype.doComplateAction = function () {
        if (this.m_pCallBack) {
            this.m_pCallBack.call(this.m_pCallBackObj);
        }
    };
    MCDragonBones.prototype.removeDragonBones = function (e) {
        var target = e.target;
        if (target) {
            target.removeEventListener(egret.Event.COMPLETE, this.removeDragonBones, this);
            var parent_2 = target.parent;
            if (parent_2) {
                this.doComplateAction();
                parent_2.destroy();
                //target.parent.removeChild(target);
            }
        }
    };
    Object.defineProperty(MCDragonBones.prototype, "Armature", {
        get: function () {
            return this._mDBArmature;
        },
        enumerable: true,
        configurable: true
    });
    MCDragonBones.prototype.removeAll = function () {
        this.m_pIsPlay = false;
        this.m_pIsRemoveAll = true;
        var dbName = this._mDBName;
        this._mDBName = null;
        this.m_pPlayName = null;
        if (this.m_pAddEvent) {
            this.m_pAddEvent[0] = null;
            this.m_pAddEvent[1] = null;
            this.m_pAddEvent[2] = null;
        }
        this.m_pAddEvent = null;
        this.m_pCallBack = null;
        this.m_pCallBackObj = null;
        this.m_initArmationCallFunc = null;
        this.m_initArmationCallObj = null;
        if (!this._mInit)
            return;
        this._mInit = false;
        // DragonBonesManager.removeMcInsCache(dbName);
        this.removeChildren();
        this.stop();
        if (this._mDBArmature) {
            this._mDBArmature.removeEventListener(egret.Event.LOOP_COMPLETE, this.onLoopComplete, this);
            this._mDBArmature.dispose();
            DragonBonesManager.removeMcInsCache(dbName);
        }
        this._mDBArmature = null;
    };
    MCDragonBones.prototype.destroy = function () {
        this.visible = false;
        this.removeAll();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    //检查是否已存在龙骨数据
    MCDragonBones.prototype.checkData = function (dbName) {
        var group = RES.getGroupByName(dbName);
        for (var i = 0; i < group.length; i++) {
            var res = RES.getRes(group[i].name);
            if (res == null) {
                return false;
            }
        }
        // RES.removeEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.downloadFinsh, this );
        return true;
    };
    Object.defineProperty(MCDragonBones.prototype, "dbName", {
        /**获得骨骼名字*/
        get: function () {
            return this._mDBName;
        },
        enumerable: true,
        configurable: true
    });
    //下载相关数据
    MCDragonBones.prototype.downloadData = function (dbName) {
        if (isNull(dbName))
            return;
        AGame.ResUtils.loadGroups([dbName], this.downloadFinsh, null, this);
    };
    //下载完成
    MCDragonBones.prototype.downloadFinsh = function () {
        if (!this._mDBName)
            return; //下载中间删除动画
        if (this.checkData(this._mDBName)) {
            this.init(this._mDBName);
            if (this.m_pPlayName != null && this.m_pIsPlay == true) {
                this.dbTimeScale(this.m_pTimeScale);
                if (this.m_pAddEvent) {
                    this.addDBEventListener(this.m_pAddEvent[0], this.m_pAddEvent[1], this.m_pAddEvent[2]);
                }
                if (this.m_pOnResLoadCompleter && this.m_pTarget) {
                    this.m_pOnResLoadCompleter.call(this.m_pTarget);
                }
                if (this.m_pPlayName != null && this.m_pIsPlay == true) {
                    this.play(this.m_pPlayName, this.m_pPlayTimes, this.m_pIsAutoRemove);
                }
            }
        }
    };
    MCDragonBones.prototype.download = function (dbName) {
        RES.getResAsync(dbName, function (data, key) {
            if (data) {
                debug(key + "下载完成");
                this.loadResNum += 1;
                // if (this.loadResNum >= 3 && !this.isGroup) {
                //     this.downloadFinsh();
                // } else if (this.loadResNum >= (this.resNum * 2 + 3) && this.isGroup) {
                //     this.downloadGroupFinsh()
                // }
                if (this.loadResNum >= 3) {
                    this.downloadFinsh();
                }
            }
            else {
                this.downloadFailNum++;
                debug(key + "下载失败,次数=" + this.downloadFailNum);
                if (this.downloadFailNum <= 6) {
                    this.download(key);
                }
                else {
                    debug("下载失败次数多过--停止了");
                }
            }
        }, this);
    };
    return MCDragonBones;
}(egret.DisplayObjectContainer));
