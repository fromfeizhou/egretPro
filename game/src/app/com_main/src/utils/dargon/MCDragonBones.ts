/**
 * Created by Tint_ on 2017/4/17.
 * 龙骨动画的一个包装类。不涉及回收，使用时请注意！！！！！
 * 使用时，初始化一次
 * 在打开界面时play()
 * 关闭界面时remove2Clock()
 */
class MCDragonBones extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.touchEnabled = false;
        this.touchChildren = false;
    }
    /**龙骨动画*/
    private _mDBArmature: dragonBones.EgretArmatureDisplay = null;
    private _mInit: boolean = false;
    private _mDBName: string = null;//龙骨名字    
    private m_pPlayName: string = null;
    private m_pPlayTimes: number = 0;
    private m_pAddEvent: any = null;
    private m_pTimeScale: number = 1;//时间加速
    private m_pSlotName: string = null;//换装的骨头名
    private m_pTextureName: string = null;//换装的资源名
    private m_pIsRemoveAll: boolean = false; //是否已经移除
    private m_pIsPlay: boolean = false;      //是否在播放
    /**是否自动播放一次后就自动移除 */
    private m_pIsAutoRemove: boolean = false;
    private m_pCallBack: any;    //播放回调
    private m_pCallBackObj: any; //播放回调指针
    private m_pOnResLoadCompleter = null;
    private m_pTarget = null;
    private m_initArmationCallFunc: any;    //初始化后回调函数
    private m_initArmationCallObj: any;

    private _scaleX = 1;
    private _scaleY = 1;

    /**上次stop播放的时间点 */
    private m_currentTime: number;

    // private downloadList = [];
    // private downloadFailNum = 0;
    // private loadResNum = 0;
    // private isGroup: boolean = false;
    // private resNum: number = 0;

    private init(dbName: string) {
        if (this._mInit) return;
        //对象已清理
        if (!this._mDBName) return;
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
    }
    /**异步加载资源 */
    public initAsync(dbName: string) {
        // 选择低品质
        if (GameConfig.BTEELE_QUALITY == BattleQualityEnum.LOW && C.DragonBonesScaleConfig && C.DragonBonesScaleConfig[dbName + '_s']) {
            dbName = dbName + '_s';
        }

        this._mDBName = dbName;
        if (this.checkData(dbName) == false) {
            this.downloadData(dbName);
        } else {
            this.init(dbName);
        }
    }
    public stop() {
        this.m_pIsPlay = false;
        if (this._mDBArmature) {
            /**记录上次暂停的时间 */
            let aniState = this._mDBArmature.animation.getState(this.m_pPlayName);
            if (aniState) {
                this.m_currentTime = aniState.currentTime;
            }

            this._mDBArmature.animation.stop();
            this._mDBArmature.animation.reset();
        }

    }
    public setScale(scaleX: number, scaleY: number, ) {
        this._scaleX = scaleX;
        this._scaleY = scaleY;
    }

    public dbTimeScale(_timeScale: number) {
        if (this._mDBArmature) {
            this._mDBArmature.animation.timeScale = _timeScale;
        }
        this.m_pTimeScale = _timeScale;
    }
    public addDBEventListener(eventType: string, onResourceLoadError: Function, target: any) {
        if (this._mDBArmature) {
            this._mDBArmature.addEventListener(eventType, onResourceLoadError, target);
        } else {
            this.m_pAddEvent = [eventType, onResourceLoadError, target];
        }
    }
    public removeDBEventListener(eventType: string, onResourceLoadError: Function, target: any) {
        if (this._mDBArmature) {
            this._mDBArmature.removeEventListener(eventType, onResourceLoadError, target);
        } else {
            if (this.m_pAddEvent) {
                this.m_pAddEvent[0] = null;
                this.m_pAddEvent[1] = null;
                this.m_pAddEvent[2] = null;
            }
            this.m_pAddEvent = null;
        }
    }
    public addLoadCompleteEvent(onResLoadCompleter: Function, target: any) {
        this.m_pOnResLoadCompleter = onResLoadCompleter;
        this.m_pTarget = target;
        if (this._mDBArmature) {
            if (this.m_pOnResLoadCompleter && this.m_pTarget) {
                this.m_pOnResLoadCompleter.call(this.m_pTarget);
            }
        }
    }
    public get isPlaying() {
        if (this._mDBArmature) {
            return this._mDBArmature.animation.isPlaying;
        } else {
            return this.m_pIsPlay;
        }
    }
    public reset() {
        if (this._mDBArmature) {
            this._mDBArmature.animation.reset()
        }
    }
    /**
     * isAutoRemove  是否自动播放n次后就自动移除
     * isContinuePlayLast  是否从上次暂停的地方播放
     */
    public play(playName: string, times: number = 0, isAutoRemove: boolean = false, isContinuePlayLast = false) {
        if (this._mDBArmature == null) {
            this.m_pPlayName = playName;
            this.m_pPlayTimes = times;
            this.m_pIsPlay = true;
            this.m_pIsAutoRemove = isAutoRemove;
            return;
        } else {
            this.m_pPlayName = playName;
            if (isContinuePlayLast && this.m_currentTime) {
                this._mDBArmature.animation.gotoAndPlayByTime(playName, this.m_currentTime, times);
            } else {
                this._mDBArmature.animation.play(playName, times);
            }

            if (times > 0 && isAutoRemove == true) {
                this._mDBArmature.addEventListener(egret.Event.COMPLETE, this.removeDragonBones, this);
            } else {
                if (!this._mDBArmature.hasEvent(egret.Event.LOOP_COMPLETE))
                    this._mDBArmature.addEventListener(egret.Event.LOOP_COMPLETE, this.onLoopComplete, this);
            }
        }
    }
    /**
     * 绑定函数，初始化后回调
     */
    public bindInitCallback(initArmationCallFunc, obj) {
        this.m_initArmationCallFunc = initArmationCallFunc;
        this.m_initArmationCallObj = obj;
    }

    /**
     * 替换插槽
     * @param slotName 插槽名称 原材料
     * @param textureName 图片名  xxx_png
     * @param 偏移量
     */
    public setNewSlot(slotName: string, textureName: string, offsetX: number = 0, offsetY: number = 0) {
        if(!this._mDBArmature) return ;

        var slot: dragonBones.Slot = this._mDBArmature.armature.getSlot(slotName);
        if (!slot) {
            return;
        }

        var b: eui.Image = new eui.Image();
        b.source = textureName;
        // b.x = slot.display.x;
        // b.y = slot.display.y;
        b.anchorOffsetX = b.width / 2 + offsetX;
        b.anchorOffsetY = b.height / 2 + offsetY;
        // slot.setDisplay(b);
        slot.displayList = [b];
    }

    public setSlotDisplayList(slotName: string, textureName: string[], width: number = 0, height: number = 0) {
        if(!this._mDBArmature) return ;
        var slot: dragonBones.Slot = this._mDBArmature.armature.getSlot(slotName);

        if (!slot) {
            console.log("找不到骨架:", slotName)
            return;
        }
        let arr = [];
        for (let source of textureName) {
            var img: eui.Image = ObjectPool.pop(eui.Image, "eui.Image");
            img.width = width;
            img.height = height;
            img.source = source;
            img.anchorOffsetX = width / 2;
            img.anchorOffsetY = height / 2;
            arr.push(img);
        }
        slot.displayList = arr;
        return arr;
    }

    public setSlotDisplay(slotName: string, obj, offsetX: number = 0, offsetY: number = 0) {
        if(!this._mDBArmature) return ;
        var slot: dragonBones.Slot = this._mDBArmature.armature.getSlot(slotName);
        if (!slot) {
            return;
        }
        obj.anchorOffsetX = obj.width / 2 + offsetX;
        obj.anchorOffsetY = obj.height / 2 + offsetY;
        slot.setDisplay(obj);
    }

    //循环回调
    private onLoopComplete(e) {
        var target = e.target as dragonBones.EgretArmatureDisplay;
        if (target) {
            let parent = target.parent as MCDragonBones;
            if (parent) {
                this.doComplateAction();
            }
        }
    }
    /**设置回调 */
    public setCallback(callback: any, callbackObj: any) {
        this.m_pCallBack = callback;
        this.m_pCallBackObj = callbackObj;
    }

    /**播放一次回调(动画自动销毁) */
    public playOnceDone(playName: string, callback: any, callbackObj: any) {
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
    }

    /**复用动画播放一次回调(动画 需手动回收到对象池)*/
    public playNorOnce(playName: string, callback: any, callbackObj: any) {
        this.m_pCallBack = callback;
        this.m_pCallBackObj = callbackObj;
        this.play(playName, 1);
    }

    /**回调执行 */
    private doComplateAction() {
        if (this.m_pCallBack) {
            this.m_pCallBack.call(this.m_pCallBackObj);
        }
    }

    private removeDragonBones(e) {
        var target = e.target as dragonBones.EgretArmatureDisplay;
        if (target) {
            target.removeEventListener(egret.Event.COMPLETE, this.removeDragonBones, this);
            let parent = target.parent as MCDragonBones;
            if (parent) {
                this.doComplateAction();
                parent.destroy();
                //target.parent.removeChild(target);
            }
        }
    }
    public get Armature() {
        return this._mDBArmature;
    }
    public removeAll() {
        this.m_pIsPlay = false;
        this.m_pIsRemoveAll = true;
        let dbName = this._mDBName;
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

        if (!this._mInit) return;
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
    }

    public destroy() {
        this.visible = false;
        this.removeAll();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    //检查是否已存在龙骨数据
    private checkData(dbName: string): boolean {
        let group = RES.getGroupByName(dbName);
        for (let i = 0; i < group.length; i++) {
            let res = RES.getRes(group[i].name);
            if (res == null) {
                return false;
            }
        }
        // RES.removeEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.downloadFinsh, this );
        return true;
    }

    /**获得骨骼名字*/
    public get dbName() {
        return this._mDBName;
    }

    //下载相关数据
    private downloadData(dbName: string) {
        if (isNull(dbName))
            return;
        AGame.ResUtils.loadGroups([dbName], this.downloadFinsh, null, this);
    }

    //下载完成
    private downloadFinsh() {
        if (!this._mDBName) return; //下载中间删除动画
        if (this.checkData(this._mDBName)) {
            this.init(this._mDBName);
            if (this.m_pPlayName != null && this.m_pIsPlay == true) {
                this.dbTimeScale(this.m_pTimeScale);
                if (this.m_pAddEvent) {
                    this.addDBEventListener(this.m_pAddEvent[0], this.m_pAddEvent[1], this.m_pAddEvent[2])
                }
                if (this.m_pOnResLoadCompleter && this.m_pTarget) {
                    this.m_pOnResLoadCompleter.call(this.m_pTarget);
                }
                if (this.m_pPlayName != null && this.m_pIsPlay == true) {
                    this.play(this.m_pPlayName, this.m_pPlayTimes, this.m_pIsAutoRemove);
                }
            }
        }
    }

    private download(dbName: string) {
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
            } else {
                this.downloadFailNum++;
                debug(key + "下载失败,次数=" + this.downloadFailNum);

                if (this.downloadFailNum <= 6) {
                    this.download(key);
                } else {
                    debug("下载失败次数多过--停止了");
                }

            }
        }, this);
    }
}