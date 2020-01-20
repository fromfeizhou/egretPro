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
var FrameAnimNumType;
(function (FrameAnimNumType) {
    FrameAnimNumType[FrameAnimNumType["num"] = 0] = "num";
    FrameAnimNumType[FrameAnimNumType["string"] = 1] = "string";
})(FrameAnimNumType || (FrameAnimNumType = {}));
;
var com_main;
(function (com_main) {
    /**
     *
     * @author
     *
     */
    var FrameAnim = /** @class */ (function (_super_1) {
        __extends(FrameAnim, _super_1);
        function FrameAnim(actionName) {
            var _this = _super_1.call(this) || this;
            _this.framesToHold = 3;
            _this.frameNumType = 0; //整数补位类型
            _this.isFrameFinished = false;
            _this.m_bIsReverse = false; //是否倒序
            _this.m_pNextFrameIndex = 0;
            _this.m_pFrameIndex = 0;
            _this.m_pActionName = '';
            _this.m_pNumFrames = 0;
            _this.m_pAnimations = {};
            _this.m_isPlay = false;
            _this.actionName = actionName;
            return _this;
        }
        Object.defineProperty(FrameAnim.prototype, "isPlay", {
            get: function () {
                return this.m_isPlay;
            },
            set: function (play) {
                this.m_isPlay = play;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameAnim.prototype, "numFrames", {
            get: function () {
                return this.m_pNumFrames;
            },
            set: function (len) {
                this.m_pNumFrames = len;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameAnim.prototype, "frameIndex", {
            get: function () {
                return this.m_pFrameIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameAnim.prototype, "isReverse", {
            set: function (bool) {
                this.m_bIsReverse = bool;
                this.resetFrameIndex();
            },
            enumerable: true,
            configurable: true
        });
        FrameAnim.prototype.set = function (key, texture) {
            if (!this.m_pAnimations) {
                return;
            }
            this.m_pAnimations[key] = texture;
            this.numFrames = Utils.objectLenght(this.m_pAnimations);
        };
        Object.defineProperty(FrameAnim.prototype, "animations", {
            get: function () {
                return this.m_pAnimations;
            },
            set: function (anim) {
                this.m_pAnimations = anim;
                this.numFrames = Utils.objectLenght(anim);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameAnim.prototype, "actionName", {
            get: function () {
                return this.m_pActionName;
            },
            set: function (name) {
                this.m_pActionName = name;
                this.m_pFrameIndex = 0;
            },
            enumerable: true,
            configurable: true
        });
        FrameAnim.prototype.findAction = function (name) {
            var action = {};
            var nameLen = name.length;
            var animation = this.m_pAnimations;
            for (var key in animation) {
                var match = key.substr(0, nameLen);
                if (name == match) {
                    action[key] = animation[key];
                }
            }
            return action;
        };
        FrameAnim.prototype.resetAction = function () {
            var action = this.findAction(this.actionName);
            this.numFrames = Utils.objectLenght(action);
        };
        Object.defineProperty(FrameAnim.prototype, "nextFrameIndex", {
            get: function () {
                return this.m_pNextFrameIndex;
            },
            enumerable: true,
            configurable: true
        });
        FrameAnim.prototype.nextFrame = function (successIsReset) {
            if (successIsReset === void 0) { successIsReset = true; }
            ++this.m_pNextFrameIndex;
            if (this.m_pNextFrameIndex >= this.framesToHold) {
                this.m_pNextFrameIndex = 0;
                if (this.m_bIsReverse) {
                    --this.m_pFrameIndex;
                    this.isFrameFinished = this.m_pFrameIndex < 0;
                    if (this.isFrameFinished) {
                        if (successIsReset)
                            this.m_pFrameIndex = this.m_pNumFrames - 1;
                        else
                            this.m_pFrameIndex = 0;
                    }
                }
                else {
                    ++this.m_pFrameIndex;
                    if (this.actionName == "EBarracks_GBYStand")
                        error(this.actionName + " =====  " + this.m_pFrameIndex);
                    this.isFrameFinished = this.m_pFrameIndex >= this.numFrames;
                    if (this.isFrameFinished) {
                        if (successIsReset)
                            this.m_pFrameIndex = 0;
                        else
                            this.m_pFrameIndex = this.m_pNumFrames - 1;
                    }
                }
            }
        };
        FrameAnim.prototype.resetFrameIndex = function () {
            this.m_pNextFrameIndex = 0;
            if (this.m_bIsReverse) {
                this.m_pFrameIndex = this.m_pNumFrames - 1;
            }
            else {
                this.m_pFrameIndex = 0;
            }
        };
        FrameAnim.prototype.getLastFrame = function () {
            var last_index = this.m_bIsReverse ? 0 : this.m_pNumFrames - 1;
            var name;
            var suffix = "_png";
            name = this.m_pActionName + '_' + StringUtils.pad(last_index, this.frameNumType);
            return FrameManager.getFrame(this.m_pActionName, name + suffix);
        };
        FrameAnim.prototype.getLastFrame2 = function () {
            var last_index = this.m_bIsReverse ? 0 : this.m_pNumFrames - 1;
            var name;
            name = this.m_pActionName + '_' + StringUtils.pad(last_index, this.frameNumType);
            return this.m_pAnimations[name];
        };
        FrameAnim.prototype.getFrame = function () {
            var name;
            var suffix = "_png";
            name = this.m_pActionName + '_' + StringUtils.pad(this.m_pFrameIndex, this.frameNumType);
            return FrameManager.getFrame(this.m_pActionName, name + suffix);
        };
        FrameAnim.prototype.getFrame2 = function (actionName, frameIndex) {
            actionName = actionName || this.m_pActionName;
            frameIndex = frameIndex || this.m_pFrameIndex;
            var name;
            name = this.m_pActionName + '_' + StringUtils.pad(frameIndex, this.frameNumType);
            return this.m_pAnimations[name];
        };
        FrameAnim.prototype.num2Zero = function (index) {
            var str = index < 10 ? "0" + index : "" + index;
            return str;
        };
        FrameAnim.prototype.getFrameByName = function (name) {
            return this.m_pAnimations[name];
        };
        FrameAnim.prototype.clear = function () {
            FrameManager.removeFrames(this.m_pActionName);
        };
        FrameAnim.createAnim = function (framesToHold, actionName, frameNumType) {
            if (framesToHold === void 0) { framesToHold = 3; }
            if (frameNumType === void 0) { frameNumType = 0; }
            var action = new FrameAnim(actionName);
            action.framesToHold = framesToHold;
            action.frameNumType = frameNumType;
            return action;
        };
        return FrameAnim;
    }(egret.HashObject));
    com_main.FrameAnim = FrameAnim;
    var SpriteAnimation = /** @class */ (function (_super_1) {
        __extends(SpriteAnimation, _super_1);
        function SpriteAnimation(target, actionName, framesToHold, frameNumType) {
            if (framesToHold === void 0) { framesToHold = 3; }
            if (frameNumType === void 0) { frameNumType = 0; }
            var _this = _super_1.call(this) || this;
            _this.isRepeat = false;
            _this.m_pLoaded = false;
            _this.m_pIsStart = false;
            _this.m_pThisArg = null;
            _this.m_pCallback = null;
            _this.m_pArgs = null;
            _this.m_pLoaderComplete = null;
            _this.m_pLoaderCompleteThis = null;
            _this.m_pBitmaps = {};
            _this.m_pBitmaps_len = 0;
            _this.m_pIsDestroy = false;
            /**是否回调后清除回调引用 */
            _this.m_autoClearCallback = true;
            /**播放结束后是否重置回第一帧 */
            _this.m_pSuccessIsReset = true;
            //FIX ME
            //临时处理标识
            _this.tempTag = false;
            //关键帧
            _this.keyframe = -1;
            _this.isLife = false;
            if (target) {
                _this.m_pBitmaps[target.hashCode] = target;
                _this.m_pBitmaps_len += 1;
            }
            _this.m_pFrameAnim = FrameAnim.createAnim(framesToHold, actionName, frameNumType);
            return _this;
        }
        SpriteAnimation.prototype.addBitmap = function (bitmap) {
            if (isNull(bitmap))
                return;
            if (!this.m_pBitmaps[bitmap.hashCode])
                this.m_pBitmaps_len += 1;
            this.m_pBitmaps[bitmap.hashCode] = bitmap;
            // this.m_pBitmaps_len += 1;
            this.autoRunStop();
        };
        SpriteAnimation.prototype.removeBitmap = function (bitmap) {
            if (isNull(bitmap))
                return;
            if (this.m_pBitmaps[bitmap.hashCode]) {
                delete this.m_pBitmaps[bitmap.hashCode];
                this.m_pBitmaps_len -= 1;
                this.autoRunStop();
            }
        };
        /**自动判断是否要运行或者停止 */
        SpriteAnimation.prototype.autoRunStop = function () {
            var len = this.m_pBitmaps_len;
            if (len > 0 && !this.isLife) {
                this.runAction();
            }
            else if (len == 0) {
                this.stopAction();
            }
        };
        Object.defineProperty(SpriteAnimation.prototype, "autoClearCallback", {
            set: function (isClear) {
                this.m_autoClearCallback = isClear;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteAnimation.prototype, "anim", {
            get: function () {
                return this.m_pFrameAnim;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteAnimation.prototype, "isReverse", {
            set: function (bool) {
                this.m_pFrameAnim.isReverse = bool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteAnimation.prototype, "framesToHold", {
            set: function (framesToHold) {
                this.m_pFrameAnim.framesToHold = framesToHold;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteAnimation.prototype, "fps", {
            set: function (fps) {
                this.framesToHold = Math.ceil((1 / fps) / (1 / 30));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteAnimation.prototype, "successIsReset", {
            /**播放结束后是否重置回第一帧 */
            set: function (successIsReset) {
                this.m_pSuccessIsReset = successIsReset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteAnimation.prototype, "currentFrameIndex", {
            /**当前播放的帧序列 */
            get: function () {
                return this.m_pFrameAnim.frameIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteAnimation.prototype, "totalFrames", {
            get: function () {
                return this.m_pFrameAnim.numFrames;
            },
            enumerable: true,
            configurable: true
        });
        SpriteAnimation.prototype.loadFiles = function (files, callback, callbackThis, args) {
            this.m_pNumComplete = 0;
            this.m_pLoaderNum = files.length;
            this.m_pLoaderComplete = callback;
            this.m_pLoaderCompleteThis = callbackThis;
            FrameManager.addType(this.m_pFrameAnim.actionName);
            if (FrameManager.isCheck(this.m_pFrameAnim.actionName)) {
                this.m_pLoaded = true;
                this.m_pFrameAnim.numFrames = FrameManager.numFrames(this.m_pFrameAnim.actionName);
                if (this.m_pIsStart)
                    this.isLife = true;
                if (this.m_pLoaderCompleteThis) {
                    this.m_pLoaderComplete.call(this.m_pLoaderCompleteThis, null, args);
                    // this.m_pFrameAnim.numFrames = FrameManager.numFrames(this.m_pFrameAnim.actionName);
                }
            }
            else {
                for (var i = 0; i < this.m_pLoaderNum; i++) {
                    this.loadFile(files[i], RES.ResourceItem.TYPE_SHEET, args);
                }
            }
        };
        SpriteAnimation.prototype.loadFile = function (url, type, args) {
            var _this = this;
            RES.getResByUrl(url, function (sheets) {
                if (_this.onFileLoadComplete) {
                    _this.onFileLoadComplete.call(_this, sheets, args);
                }
            }, this, type);
        };
        SpriteAnimation.prototype.onFileLoadComplete = function (sheets, animation) {
            if (!this.m_pIsDestroy) {
                var texture = sheets._textureMap;
                ++this.m_pNumComplete;
                try {
                    FrameManager.setFrames(this.m_pFrameAnim.actionName, texture, this.m_pNumComplete == this.m_pLoaderNum);
                    if (this.m_pNumComplete == this.m_pLoaderNum) {
                        this.m_pLoaded = true;
                        if (this.m_pIsStart)
                            this.isLife = true;
                        this.m_pFrameAnim.numFrames = FrameManager.numFrames(this.m_pFrameAnim.actionName);
                        if (this.m_pLoaderComplete) {
                            if (this.m_pLoaderCompleteThis) {
                                this.m_pLoaderComplete.call(this.m_pLoaderCompleteThis, sheets, animation);
                            }
                            else {
                                this.m_pLoaderComplete(sheets, animation);
                            }
                        }
                    }
                }
                catch (e) {
                    error("onFileLoadComplete--->>", e, this.m_pFrameAnim.actionName);
                }
            }
        };
        SpriteAnimation.prototype.setCallBack = function (callback, thisArg, args) {
            if (args === void 0) { args = null; }
            this.m_pCallback = callback;
            this.m_pThisArg = thisArg;
            this.m_pArgs = args;
        };
        SpriteAnimation.prototype.runAction = function (callback, thisArg, needReset, keyFrame) {
            if (needReset === void 0) { needReset = true; }
            if (keyFrame != null || keyFrame != undefined) {
                this.keyframe = keyFrame;
            }
            if (callback)
                this.m_pCallback = callback;
            if (thisArg)
                this.m_pThisArg = thisArg;
            this.m_pIsStart = true;
            if (this.m_pLoaded) {
                if (needReset) {
                    this.m_pFrameAnim.isFrameFinished = false;
                    this.m_pFrameAnim.resetFrameIndex();
                }
                this.isLife = true;
            }
        };
        SpriteAnimation.prototype.stopAction = function () {
            this.isLife = false;
        };
        SpriteAnimation.prototype.startAction = function () {
            this.isLife = true;
        };
        SpriteAnimation.prototype.removeAction = function () {
            this.m_pIsDestroy = true;
            this.stopAction();
            this.onDestroy();
            if (this.m_pFrameAnim) {
                this.m_pFrameAnim.clear();
                this.m_pFrameAnim = null;
            }
            this.m_pThisArg = null;
            this.m_pCallback = null;
            this.m_pArgs = null;
            this.m_pLoaderComplete = null;
            this.m_pLoaderCompleteThis = null;
            this.m_pBitmaps = null;
        };
        SpriteAnimation.prototype.onEnterFrame = function (delta) {
            if (!this.isLife)
                return;
            if (this.m_pFrameAnim) {
                this.m_pFrameAnim.nextFrame(this.m_pSuccessIsReset);
                //关键帧回调
                if (this.m_pFrameAnim.m_pFrameIndex == this.keyframe) {
                    this.keyframe = -1;
                    this.m_pCallback.call(this.m_pThisArg, this.m_pArgs);
                }
                if (this.m_pFrameAnim.isFrameFinished) {
                    if (!this.isRepeat) {
                        this.stopAction();
                        if (this.m_pCallback) {
                            this.m_pCallback.call(this.m_pThisArg, this.m_pArgs);
                            if (this.m_autoClearCallback) {
                                this.m_pCallback = null;
                                this.m_pThisArg = null;
                                this.m_pArgs = null;
                            }
                            return;
                        }
                    }
                }
                var bitmaps = this.m_pBitmaps;
                for (var key in bitmaps) {
                    if (bitmaps.hasOwnProperty(key)) {
                        var bitmap = bitmaps[key];
                        if (this.tempTag)
                            bitmap.texture = this.m_pFrameAnim.getFrame2();
                        else
                            bitmap.texture = this.m_pFrameAnim.getFrame();
                    }
                }
            } /*else {
                error("this.m_pFrameAnim is null");
            }*/
        };
        return SpriteAnimation;
    }(com_main.Animate));
    com_main.SpriteAnimation = SpriteAnimation;
})(com_main || (com_main = {}));
