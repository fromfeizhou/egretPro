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
    var CSquareFrameAnim = /** @class */ (function (_super_1) {
        __extends(CSquareFrameAnim, _super_1);
        function CSquareFrameAnim(actionName) {
            var _this = _super_1.call(this) || this;
            /**延迟帧数 */
            _this.m_delayFrame = 0;
            /**延迟帧计数 */
            _this.m_delayCount = 0;
            _this.actionName = actionName;
            return _this;
        }
        CSquareFrameAnim.createAnim = function (framesToHold, actionName, frameNumType) {
            if (framesToHold === void 0) { framesToHold = 3; }
            if (frameNumType === void 0) { frameNumType = 0; }
            var action = new CSquareFrameAnim(actionName);
            action.framesToHold = framesToHold;
            action.frameNumType = frameNumType;
            return action;
        };
        /**
         * 重设延迟帧数
         */
        CSquareFrameAnim.prototype.resetDelay = function (delay) {
            this.m_delayFrame = delay;
            this.m_delayCount = 0;
        };
        CSquareFrameAnim.prototype.nextFrame = function (successIsReset) {
            if (successIsReset === void 0) { successIsReset = true; }
            // ++this.m_pNextFrameIndex;
            if (this.m_delayCount < this.m_delayFrame) {
                ++this.m_delayCount;
            }
            else {
                ++this.m_pNextFrameIndex;
            }
            // if (this.m_pNextFrameIndex >= this.framesToHold && this.m_delayCount >= this.m_delayFrame) {
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
        return CSquareFrameAnim;
    }(com_main.FrameAnim));
    com_main.CSquareFrameAnim = CSquareFrameAnim;
    var CSquareAnimation = /** @class */ (function (_super_1) {
        __extends(CSquareAnimation, _super_1);
        function CSquareAnimation(targetList, actionName, framesToHold, frameNumType) {
            if (framesToHold === void 0) { framesToHold = 3; }
            if (frameNumType === void 0) { frameNumType = 0; }
            var _this = _super_1.call(this, null, actionName, framesToHold, frameNumType) || this;
            _this.m_actionName = "";
            _this.m_pSpriteList = null;
            _this.m_pActionList = [];
            _this.m_pFrameAnimList = [];
            _this.m_pFrameAnims = [];
            _this.m_pSinglePlayFrameAnims = [];
            _this.m_numFrameAnims = 0;
            _this.m_pIsOneShoot = false;
            _this.m_fps = 0;
            _this.m_lastFrameIndex = 0;
            _this.m_pKeyCallback = null;
            _this.m_pKeyCallObject = null;
            _this.m_data = {};
            _this.m_actionName = actionName;
            return _this;
        }
        CSquareAnimation.create = function (targetList, actionName, framesToHold, frameNumType) {
            if (framesToHold === void 0) { framesToHold = 3; }
            if (frameNumType === void 0) { frameNumType = 0; }
            var obj = new CSquareAnimation(targetList, actionName, framesToHold, frameNumType);
            obj.spriteList = targetList;
            return obj;
        };
        CSquareAnimation.prototype.initFrameAnims = function (actionName, framesToHold, frameNumType) {
            if (framesToHold === void 0) { framesToHold = 3; }
            if (frameNumType === void 0) { frameNumType = 0; }
            for (var i = 0; i < this.m_numFrameAnims; i++) {
                var frameAnim = this.m_pFrameAnims[i];
                if (!frameAnim) {
                    frameAnim = CSquareFrameAnim.createAnim(framesToHold, actionName, frameNumType);
                    frameAnim.animations = this.anim.animations;
                    this.m_pFrameAnims[i] = frameAnim;
                }
            }
        };
        Object.defineProperty(CSquareAnimation.prototype, "spriteList", {
            set: function (targetList) {
                this.m_pSpriteList = targetList;
                this.m_numFrameAnims = this.m_pSpriteList.length;
                this.initFrameAnims(this.m_actionName);
            },
            enumerable: true,
            configurable: true
        });
        CSquareAnimation.prototype.setSpriteList = function (targetList, actionName) {
            if (actionName)
                this.m_actionName = actionName;
            this.spriteList = targetList;
        };
        CSquareAnimation.prototype.setAnimation = function (anims) {
            try {
                for (var i = 0; i < this.m_numFrameAnims; i++) {
                    var frameAnim = this.m_pFrameAnims[i];
                    frameAnim.animations = anims;
                    frameAnim.resetAction();
                }
            }
            catch (e) {
                error(e);
            }
            this.m_pLoaded = true;
            this.isLife = true;
        };
        CSquareAnimation.prototype.setFps = function (fps, index) {
            var trans = Math.ceil((1 / fps) / (1 / 30));
            if (index != null && index != undefined) {
                var frameAnim = this.m_pFrameAnims[index];
                if (frameAnim)
                    frameAnim.framesToHold = trans;
            }
            else {
                this.m_fps = trans;
                for (var i = 0; i < this.m_numFrameAnims; i++) {
                    var frameAnim = this.m_pFrameAnims[i];
                    if (frameAnim)
                        frameAnim.framesToHold = trans;
                }
            }
        };
        CSquareAnimation.prototype.getFps = function (index) {
            if (index != null && index != undefined) { }
            return this.m_fps;
        };
        CSquareAnimation.prototype.runActionByName = function (actionName, index, isOneShoot, callback, thisArg, keyFrame, keyCallback, keyCallObject, data, status) {
            if (isOneShoot === void 0) { isOneShoot = false; }
            if (index != null && index != undefined && status == CSquare_Status.STATUS_DEAD) {
                this.m_pActionList[index] = { "isOneShoot": isOneShoot, "callback": callback, "thisArg": thisArg };
            }
            else {
                this.m_pIsOneShoot = isOneShoot;
                this.m_pCallback = callback;
                this.m_pThisArg = thisArg;
            }
            this.m_keyFrameIndex = keyFrame;
            this.m_pKeyCallback = keyCallback;
            this.m_pKeyCallObject = keyCallObject;
            this.m_data = data;
            if (actionName) {
                this.m_pIsStart = true;
                if (this.m_pLoaded) {
                    if (index != null && index != undefined) {
                        var frameAnim = this.m_pFrameAnims[index];
                        if (frameAnim) {
                            frameAnim.actionName = actionName;
                            frameAnim.isFrameFinished = false;
                            frameAnim.resetFrameIndex();
                            frameAnim.resetAction();
                            frameAnim.isPlay = true;
                            if (status == CSquare_Status.STATUS_DEAD) {
                                //单独播放处理,放到独立播放列表
                                this.m_pSinglePlayFrameAnims[index] = frameAnim;
                                this.m_pFrameAnims[index] = null;
                            }
                        }
                        // console.log("Single Single Single",actionName);
                    }
                    else {
                        for (var i = 0; i < this.m_numFrameAnims; i++) {
                            var frameAnim = this.m_pFrameAnims[i];
                            if (frameAnim) {
                                if (status == CSquare_Status.STATUS_ATTACK) {
                                    frameAnim.resetDelay(i * 3 % 15);
                                }
                                frameAnim.actionName = actionName;
                                frameAnim.isFrameFinished = false;
                                frameAnim.resetFrameIndex();
                                frameAnim.resetAction();
                                frameAnim.isPlay = true;
                            }
                        }
                    }
                    this.refreshFrame();
                    this.isLife = true;
                }
            }
        };
        CSquareAnimation.prototype.cleanFrameAnimList = function () {
            for (var i = 0; i < this.m_pSinglePlayFrameAnims.length; i++) {
                var frameAnim = this.m_pSinglePlayFrameAnims[i];
                if (frameAnim) {
                    frameAnim.clear();
                    frameAnim = null;
                }
                delete this.m_pSinglePlayFrameAnims[i];
                this.m_pSinglePlayFrameAnims[i] = null;
            }
            this.m_pSinglePlayFrameAnims = [];
        };
        CSquareAnimation.prototype.cleanFrameAnim = function () {
            for (var i = 0; i < this.m_pFrameAnims.length; i++) {
                var frameAnim = this.m_pFrameAnims[i];
                if (frameAnim) {
                    frameAnim.clear();
                    frameAnim = null;
                }
            }
            this.m_pFrameAnims = [];
        };
        CSquareAnimation.prototype.removeAction = function (index) {
            if (index != null && index != undefined) {
                var frameAnim = this.m_pSinglePlayFrameAnims[index];
                if (frameAnim) {
                    frameAnim.clear();
                    frameAnim = null;
                }
                delete this.m_pSinglePlayFrameAnims[index];
                this.m_pSinglePlayFrameAnims[index] = null;
                this.m_pActionList[index] = null;
                this.m_pSpriteList[index] = null;
            }
            else {
                _super_1.prototype.removeAction.call(this);
                this.cleanFrameAnim();
                this.m_pActionList = [];
            }
            this.m_pKeyCallback = null;
            this.m_pKeyCallObject = null;
        };
        CSquareAnimation.prototype.nextFrameInFrameAnimList = function () {
            for (var i = 0; i < this.m_pSinglePlayFrameAnims.length; i++) {
                var frameAnim = this.m_pSinglePlayFrameAnims[i];
                if (frameAnim && frameAnim.isPlay)
                    frameAnim.nextFrame(false);
            }
        };
        CSquareAnimation.prototype.nextFrame = function (oneShoot) {
            for (var i = 0; i < this.m_pFrameAnims.length; i++) {
                var frameAnim = this.m_pFrameAnims[i];
                if (frameAnim && frameAnim.isPlay)
                    frameAnim.nextFrame(!oneShoot);
            }
        };
        CSquareAnimation.prototype.finishInFrameAnimList = function () {
            for (var i = 0; i < this.m_pSinglePlayFrameAnims.length; i++) {
                var frameAnim = this.m_pSinglePlayFrameAnims[i];
                var action = this.m_pActionList[i];
                if (frameAnim && frameAnim.isFrameFinished) {
                    frameAnim.isPlay = false;
                    if (action && action["isOneShoot"] && action["callback"]) {
                        action["callback"].call(action["thisArg"]);
                    }
                }
            }
        };
        CSquareAnimation.prototype.finish = function () {
            //第一个最后死,所以拿第一个作标准
            var frameAnim = this.m_pFrameAnims[0];
            var action = this.m_pActionList[0];
            if (frameAnim && frameAnim.isFrameFinished) {
                if (this.m_pIsOneShoot) {
                    frameAnim.isPlay = false;
                    this.stopAction();
                    if (this.m_pCallback) {
                        this.m_pCallback.call(this.m_pThisArg);
                        this.m_pCallback = null;
                        return;
                    }
                }
            }
        };
        CSquareAnimation.prototype.refreshFrame = function () {
            // if (this.anim.nextFrameIndex == 0) {
            var len = this.m_pSpriteList.length;
            for (var i = 0; i < len; i++) {
                var sprite = this.m_pSpriteList[i];
                if (sprite && sprite.parent) {
                    var frameAnim = this.m_pFrameAnims[i];
                    if (frameAnim) {
                        if (frameAnim.nextFrameIndex == 0 && frameAnim.isPlay)
                            sprite.texture = frameAnim.getFrame2();
                    }
                    else {
                        var singleFA = this.m_pSinglePlayFrameAnims[i];
                        sprite.texture = singleFA.getFrame2();
                    }
                }
            }
            // }
        };
        CSquareAnimation.prototype.onEnterFrame = function () {
            if (!this.isLife)
                return;
            // var lastTime = egret.getTimer();
            // if (this.anim.isPlay)
            // 	this.anim.nextFrame();
            this.nextFrame(this.m_pIsOneShoot);
            this.nextFrameInFrameAnimList();
            this.onKeyFrame();
            // if (this.anim.isFrameFinished) {
            // 	if (this.m_pIsOneShoot && this.anim.isPlay) {
            // 		this.anim.isPlay = false;
            // 		this.stopAction();
            // 		if (this.m_pCallback) {
            // 			this.m_pCallback.call(this.m_pThisArg);
            // 			// this.m_pCallback = null;
            // 			// this.m_pThisArg = null;
            // 			return;
            // 		}
            // 	}
            // }
            this.finishInFrameAnimList();
            this.finish();
            this.refreshFrame();
            // var passTime = egret.getTimer() - lastTime;
            // debug("animation refresh time : " + passTime);
        };
        /**
         * 配置的关键帧回调
         */
        CSquareAnimation.prototype.onKeyFrame = function () {
            // if (this.m_keyFrameIndex != null && this.m_keyFrameIndex != undefined
            // 	&& this.m_keyFrameIndex == this.anim.frameIndex
            // 	&& this.m_lastFrameIndex != this.anim.frameIndex) {
            // 	if (this.m_pKeyCallback) {
            // 		this.m_pKeyCallback.call(this.m_pKeyCallObject, this.anim.actionName, this.m_data);
            // 	}
            // }
            // this.m_lastFrameIndex = this.anim.frameIndex;
            //第一个是最后移除的,所以以它做标准
            var frameAnim = this.m_pFrameAnims[0];
            if (frameAnim) {
                if (this.m_keyFrameIndex != null && this.m_keyFrameIndex != undefined
                    && this.m_keyFrameIndex == frameAnim.frameIndex
                    && this.m_lastFrameIndex != frameAnim.frameIndex) {
                    if (this.m_pKeyCallback) {
                        this.m_pKeyCallback.call(this.m_pKeyCallObject, frameAnim.actionName, this.m_data);
                    }
                }
                this.m_lastFrameIndex = frameAnim.frameIndex;
            }
        };
        CSquareAnimation.prototype.drawRect = function (width, height) {
            var rt = new egret.RenderTexture();
            var shape = new egret.Shape();
            shape.graphics.clear();
            shape.graphics.beginFill(0xff0000, 0.5);
            shape.graphics.drawRect(0, 0, width, height);
            shape.graphics.endFill();
            rt.drawToTexture(shape);
            return rt;
        };
        return CSquareAnimation;
    }(com_main.SpriteAnimation));
    com_main.CSquareAnimation = CSquareAnimation;
})(com_main || (com_main = {}));
