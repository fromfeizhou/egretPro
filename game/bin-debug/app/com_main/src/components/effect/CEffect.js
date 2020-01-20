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
var com_main;
(function (com_main) {
    var CEffect = /** @class */ (function (_super_1) {
        __extends(CEffect, _super_1);
        function CEffect(effectID, data) {
            var _this = _super_1.call(this) || this;
            /**
             *
             */
            _this.m_pBitmap = null;
            /**
             *
             */
            _this.m_pTxtList = [];
            /**
             * 默认帧频
             */
            _this.m_defaultFps = 12;
            /**
             * 播放完回调
             */
            _this.m_pFinishCallback = null;
            /**
             *
             */
            _this.m_pFinishThisArgs = null;
            /**
             * 回调函数参数
             */
            _this.m_pFinishArgs = null;
            /**
             *
             */
            _this.m_pSpriteAnimates = null;
            _this.m_textureSheet = {};
            /**
             * 是否完成资源加载
             */
            _this.m_isResLoadComplete = false;
            /**
             * 是否开始播放
             */
            _this.m_isStartToPlay = false;
            /**
             * 待操作
             */
            _this.m_todoOperation = {};
            /**
             *
             */
            _this.m_isDestroy = false;
            _this.init(effectID, data);
            return _this;
        }
        CEffect.create = function (effectID, data) {
            var obj = new CEffect(effectID, data); //ObjectPool.pop("com_main.CEffect", effectID);
            return obj;
        };
        CEffect.prototype.onDestroy = function () {
            this.m_isDestroy = true;
            this.m_pFinishCallback = null;
            this.m_pFinishThisArgs = null;
            this.m_pFinishArgs = null;
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.removeAction();
                this.m_pSpriteAnimates = null;
            }
            if (this.m_pBitmap) {
                Utils.removeFromParent(this.m_pBitmap);
                this.m_pBitmap = null;
            }
            if (this.m_pTxtList) {
                for (var index in this.m_pTxtList) {
                    var txt = this.m_pTxtList[index];
                    Utils.removeFromParent(txt);
                }
                this.m_pTxtList = null;
            }
            // Utils.removeAllChild(this);
            Utils.removeFromParent(this);
            // ObjectPool.push(this);
        };
        CEffect.prototype.onCleanup = function () {
            this.reInitProperty();
            this.m_pFinishCallback = null;
            this.m_pFinishThisArgs = null;
            this.m_pFinishArgs = null;
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.anim.framesToHold = this.fpsToHold(this.m_defaultFps);
                this.m_pSpriteAnimates.stopAction();
            }
            if (this.m_pBitmap) {
                this.m_pBitmap.scaleX = 1;
                this.m_pBitmap.scaleY = 1;
                this.m_pBitmap.alpha = 1;
                Utils.removeFromParent(this.m_pBitmap);
            }
            if (this.m_pTxtList) {
                for (var index in this.m_pTxtList) {
                    var txt = this.m_pTxtList[index];
                    // txt.x = 0;
                    // txt.y = 0;
                    // txt.scaleX = 1;
                    // txt.scaleY = 1;
                    // txt.alpha = 1;
                    Utils.removeFromParent(txt);
                }
                this.m_pTxtList = [];
            }
            Utils.removeFromParent(this);
        };
        CEffect.prototype.reInitProperty = function () {
            this.visible = true;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.m_isResLoadComplete = false;
            this.m_isStartToPlay = false;
            this.m_todoOperation = {};
        };
        CEffect.prototype.init = function (effectID, data) {
            if (!effectID)
                return;
            this.m_scaleX = 1;
            this.m_scaleY = 1;
            this.m_isDestroy = false;
            this.m_effectID = effectID;
            this.m_data = data;
            this.rotation = 0;
            this.keyFrame = -1;
            if (!this.m_pBitmap) {
                this.m_pBitmap = new egret.Bitmap(); //Utils.DisplayUtils.createBitmap();
            }
            var config = com_main.CEffectMgr.getIns().effectConfig[this.m_effectID];
            if (config) {
                this.m_effectName = config["effectName"];
                this.m_effectFont = config["effectFont"];
                this.m_effectFile = config["effectFile"];
                this.m_isRepeat = config["isRepeat"];
                this.m_spMark = config["spMark"] || 0;
                this.m_tween = config["tween"] || 0;
                this.m_fps = config["fps"] || this.m_defaultFps;
                //设置锚点
                if (config) {
                    if (config.anchorOffsetX)
                        this.anchorOffsetX = config.anchorOffsetX;
                    if (config.anchorOffsetY)
                        this.anchorOffsetY = config.anchorOffsetY;
                }
            }
            else {
                debug("effect---> can not find effect of id : " + this.m_effectID);
                this.m_effectName = "";
                this.m_effectFont = 0;
                this.m_effectFile = "";
                this.m_isRepeat = 0;
                this.m_spMark = 0;
                this.m_tween = 0;
                error("特效id 为空！！", effectID);
            }
            this.initConfig();
        };
        CEffect.prototype.initConfig = function () {
            var self = this;
            function onGetRes(sheets, key) {
                if (this.m_isDestroy)
                    return;
                var texture = sheets._textureMap;
                self.m_textureSheet = {};
                for (var name_1 in texture) {
                    self.m_textureSheet[name_1] = texture[name_1];
                }
                self.m_isResLoadComplete = true;
                if (!self.m_pBitmap.parent)
                    Utils.addChild(self, self.m_pBitmap);
                try {
                    var effectTexture = self.getEffectTexture()[self.m_effectName + "_0"];
                    if (effectTexture) {
                        var config = com_main.CEffectMgr.getIns().effectConfig[this.m_effectID];
                        var effectScale = config["scale"];
                        self.m_pBitmap.texture = effectTexture;
                        self.m_pBitmap.scaleX = effectScale;
                        self.m_pBitmap.scaleY = effectScale;
                        self.width = effectTexture.textureWidth * effectScale;
                        self.height = effectTexture.textureHeight * effectScale;
                        self.anchorOffsetX = self.width * 0.5;
                        self.anchorOffsetY = self.height * 0.5;
                        self.scaleX = this.m_scaleX;
                        self.scaleY = this.m_scaleY;
                        if (!self.m_pSpriteAnimates) {
                            self.m_pSpriteAnimates = new com_main.SpriteAnimation(self.m_pBitmap);
                            self.m_pSpriteAnimates.tempTag = true;
                            // self.m_pSpriteAnimates.successIsReset = true;
                        }
                        self.m_pSpriteAnimates.anim.framesToHold = self.fpsToHold(this.m_fps);
                        self.m_pSpriteAnimates.anim.actionName = self.m_effectName;
                        self.m_pSpriteAnimates.isRepeat = false;
                    }
                }
                catch (e) {
                    error("缺少特效资源:", self.m_effectName, e);
                }
                self.setEffectCollection(self.getEffectTexture());
                if (self.m_isStartToPlay) {
                    self.play(self.m_todoOperation.isRepeat, self.m_todoOperation.finishCallback, self.m_todoOperation.finishThisArgs, self.m_todoOperation.finishArgs);
                }
            }
            if (this.m_tween != 0) {
                this.m_isResLoadComplete = true;
                if (this.m_tween == 3) {
                    // let lan = C["LanguageConfig"];
                    var fontRes = RES.getRes("font_skill_1_fnt");
                    if (this.m_data && this.m_data.faction) {
                        if (this.m_data.faction == 2)
                            fontRes = RES.getRes("font_skill_2_fnt");
                        else if (this.m_data.faction == 3)
                            fontRes = RES.getRes("font_skill_3_fnt");
                    }
                    var strList = GLan(Number(this.m_effectFont)); //lan[Number(this.m_effectName)]["name"]; //
                    var len = strList.length;
                    this.width = 0;
                    this.height = 0;
                    if (!this.m_pTxtList)
                        this.m_pTxtList = [];
                    for (var i = 0; i < len; i++) {
                        var str = strList[i];
                        var txt = this.m_pTxtList[i]; //ObjectPool.pop("egret.BitmapText");
                        if (!txt) {
                            txt = new egret.BitmapText();
                            this.m_pTxtList.push(txt);
                        }
                        // txt.letterSpacing = -20;
                        txt.font = fontRes; //CResMgr.getIns().fontList[0];
                        txt.text = str;
                        txt.anchorOffsetX = txt.width * 0.5;
                        txt.anchorOffsetY = txt.height * 0.5;
                        txt.x = (txt.width * 1.1) * i + (txt.width * 0.5);
                        Utils.addChild(this, txt);
                        this.width = this.width + txt.width;
                        this.height = txt.height;
                    }
                    this.anchorOffsetX = this.width * 0.5;
                    this.anchorOffsetY = this.height * 0.5;
                }
                else {
                    if (!this.m_pBitmap.parent)
                        Utils.addChild(this, this.m_pBitmap);
                    var effectTexture = RES.getRes(this.m_effectName);
                    if (effectTexture) {
                        this.m_pBitmap.texture = effectTexture;
                        this.width = effectTexture.textureWidth;
                        this.height = effectTexture.textureHeight;
                        this.anchorOffsetX = this.width * 0.5;
                        this.anchorOffsetY = this.height * 0.5;
                    }
                    else {
                        error('Texture is null：', this.m_effectName);
                    }
                }
            }
            else {
                var fileName = this.m_effectFile + "_json";
                if (RES.hasRes(fileName)) {
                    // let data = RES.getRes(fileName);
                    // if (data) {
                    // 	onGetRes(data, fileName);
                    // } else {
                    // 	RES.getResAsync(fileName, onGetRes, this);
                    // }
                    RES.getResAsync(fileName, onGetRes, this);
                }
                else {
                    // RES.getResByUrl(fileName, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
                }
            }
        };
        CEffect.prototype.setScale = function (scaleX, scaleY) {
            this.m_scaleX = scaleX;
            this.m_scaleY = scaleY;
        };
        CEffect.prototype.getEffectTexture = function () {
            return this.m_textureSheet; //CEffectMgr.getIns().effectTexture[this.m_effectName + "_0"];
        };
        /**
         *
         */
        CEffect.prototype.fpsToHold = function (fps) {
            if (fps)
                return Math.ceil((1 / fps) / (1 / 30));
            return this.m_defaultFps;
        };
        /**
         * 手动设置
         */
        CEffect.prototype.manualSetting = function (actionName, anchorOffsetX, anchorOffsetY) {
            this.m_isResLoadComplete = true;
            if (!this.m_pBitmap) {
                this.m_pBitmap = new egret.Bitmap();
            }
            if (!this.m_pBitmap.parent)
                Utils.addChild(this, this.m_pBitmap);
            //zb
            var aa = com_main.CEffectMgr.getIns();
            var bb = aa.effectTexture;
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            var effectTexture = bb[actionName + "_0"];
            this.m_pBitmap.texture = effectTexture;
            this.width = effectTexture.textureWidth;
            this.height = effectTexture.textureHeight;
            this.anchorOffsetX = anchorOffsetX || (this.width * 0.5);
            this.anchorOffsetY = anchorOffsetY || (this.height * 0.5);
            if (!this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates = new com_main.SpriteAnimation(this.m_pBitmap);
                this.m_pSpriteAnimates.tempTag = true;
            }
            this.m_pSpriteAnimates.anim.actionName = actionName;
            this.m_pSpriteAnimates.isRepeat = true;
        };
        CEffect.prototype.resetActionName = function (actionName) {
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.anim.actionName = actionName;
            }
            else {
                debug("test---> 并不是帧动画!");
            }
        };
        CEffect.prototype.play = function (isRepeat, finishCallback, finishThisArgs, finishArgs, keyFrame) {
            var _this = this;
            this.m_isStartToPlay = true;
            if (this.m_isResLoadComplete) {
                var self_1 = this;
                this.m_pFinishCallback = finishCallback;
                this.m_pFinishThisArgs = finishThisArgs;
                this.m_pFinishArgs = finishArgs;
                if (this.m_tween != 0) {
                    var obj = this.m_pBitmap;
                    if (this.m_tween == 3) {
                        obj = this.m_pTxtList;
                    }
                    com_main.CEffectFunc.getTweenEffect(this.m_tween, obj, function () {
                        // self.onDestroy();
                        self_1.onCleanup();
                    }, this);
                }
                else {
                    if (isRepeat == null || isRepeat == undefined) {
                        isRepeat = (this.m_isRepeat != 0);
                    }
                    var callback = null;
                    var callbackObj = null;
                    if (!isRepeat) {
                        callback = function () {
                            // self.onDestroy();
                            if (_this.m_pFinishCallback && _this.m_pFinishThisArgs) {
                                _this.m_pFinishCallback.call(_this.m_pFinishThisArgs, _this.m_pFinishArgs);
                                _this.m_pFinishCallback = null;
                                _this.m_pFinishThisArgs = null;
                                _this.m_pFinishArgs = null;
                            }
                            if (_this.keyFrame >= 0) {
                                _this.keyFrame = -1;
                            }
                            else {
                                self_1.onCleanup();
                            }
                        };
                        callbackObj = self_1;
                    }
                    if (this.m_pSpriteAnimates) {
                        this.m_pSpriteAnimates.isRepeat = isRepeat;
                        this.m_pSpriteAnimates.runAction(callback, callbackObj, true, this.keyFrame);
                    }
                }
            }
            else {
                this.m_todoOperation.isRepeat = isRepeat;
                this.m_todoOperation.finishCallback = finishCallback;
                this.m_todoOperation.finishThisArgs = finishThisArgs;
                this.m_todoOperation.finishArgs = finishArgs;
                this.keyFrame = keyFrame;
            }
        };
        /**
         * 暂停
         * 仅非缓动动画特效的
         */
        CEffect.prototype.pause = function () {
            if (this.m_isResLoadComplete && this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.stopAction();
            }
        };
        CEffect.prototype.playWithManualSetting = function (isRepeat) {
            if (isRepeat === void 0) { isRepeat = true; }
            if (!this.m_isResLoadComplete)
                return;
            var self = this;
            var callback = null;
            var callbackObj = null;
            if (!isRepeat) {
                callback = function () {
                    // self.onDestroy();
                    self.onCleanup();
                };
                callbackObj = self;
            }
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.isRepeat = isRepeat;
                this.m_pSpriteAnimates.runAction(callback, callbackObj);
            }
        };
        Object.defineProperty(CEffect.prototype, "currentFrameIndex", {
            /**
             * 当前播放的帧序列
             */
            get: function () {
                if (this.m_pSpriteAnimates)
                    return this.m_pSpriteAnimates.currentFrameIndex;
                return -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CEffect.prototype, "spMark", {
            get: function () {
                return this.m_spMark;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CEffect.prototype, "repeat", {
            get: function () {
                return this.m_isRepeat != 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CEffect.prototype, "tweenId", {
            get: function () {
                return this.m_tween;
            },
            enumerable: true,
            configurable: true
        });
        CEffect.prototype.setEffectCollection = function (textures) {
            if (this.m_pSpriteAnimates) {
                this.m_pSpriteAnimates.anim.animations = textures;
                this.m_pSpriteAnimates.anim.resetAction();
                this.m_pSpriteAnimates.m_pLoaded = true;
            }
        };
        return CEffect;
    }(egret.DisplayObjectContainer));
    com_main.CEffect = CEffect;
})(com_main || (com_main = {}));
