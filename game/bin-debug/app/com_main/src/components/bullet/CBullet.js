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
    var CBullet = /** @class */ (function (_super_1) {
        __extends(CBullet, _super_1);
        function CBullet() {
            var _this = _super_1.call(this) || this;
            _this.m_timeOnEnterFrame = 0;
            _this.m_t = 0;
            _this.m_tPercent = 0;
            // /**
            //  * 服务端ID
            //  */
            // private m_missileId: number;
            /**
             * 飞行总时间
             */
            _this.m_totalTime = 0;
            /**
             * 当前计时
             */
            _this.m_curTime = 0;
            /**
             * 目标点
             */
            _this.m_pTargetPoint = new egret.Point();
            /**
             * 出发点
             */
            _this.m_pOriginPoint = new egret.Point();
            /**
             * 拉扯点
             */
            _this.m_pCurvePoint = new egret.Point();
            /**
             * 两点距离
             */
            _this.m_pDistance = 0;
            /**
             * 速度
             */
            _this.m_speed = 2000;
            /**
             * 是否使用投石车轨迹
             */
            _this.m_isCatapultTrack = 0;
            /**
             * 是否自转
             */
            _this.m_isAutoRatation = 0;
            _this.m_isStart = false;
            /**
             * 用于设置拖动点,两点间距离的百分比,取值0-1
             */
            _this.m_disPercent = 1.2;
            /**
             * 两点间夹角的偏离值,用于设置拖动点
             */
            _this.m_angleOffset = 0.4;
            /**
             * 弹跳次数
             */
            _this.m_bounceTime = 0;
            /**
             * 当前已弹跳次数
             */
            _this.m_curBounceTime = 0;
            /**
             * 路径集
             */
            _this.m_paths = [];
            /**
             *
             */
            _this.m_skillVo = null;
            /**
             *
             */
            _this.m_isShowFinishEffect = true;
            /**
             *
             */
            _this.m_pBullet = Utils.DisplayUtils.createBitmap();
            /**
             * 是否回到原点
             */
            _this.m_isReturn = false;
            _this.m_data = null;
            /**
             * 角度隔帧算一次
             */
            _this.m_flame = 1;
            _this.m_pBullet.touchEnabled = false;
            Utils.addChild(_this, _this.m_pBullet);
            return _this;
        }
        Object.defineProperty(CBullet.prototype, "data", {
            set: function (v) {
                this.m_data = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CBullet.prototype, "index", {
            // public get missileId() {
            // 	return this.m_missileId;
            // }
            get: function () {
                return this.m_index;
            },
            enumerable: true,
            configurable: true
        });
        CBullet.prototype.setIndex = function (index) {
            this.m_index = index;
        };
        Object.defineProperty(CBullet.prototype, "skillVo", {
            set: function (vo) {
                this.m_skillVo = vo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CBullet.prototype, "returnPos", {
            get: function () {
                return this.m_returnPos;
            },
            set: function (pos) {
                this.m_returnPos = pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CBullet.prototype, "isReturn", {
            get: function () {
                return this.m_isReturn;
            },
            set: function (v) {
                this.m_isReturn = v;
            },
            enumerable: true,
            configurable: true
        });
        CBullet.create = function (missileId, configID, data, speed) {
            var obj = new CBullet();
            obj.touchEnabled = false;
            obj.touchChildren = false;
            obj.data = data;
            obj.initWithConfig(missileId, configID, speed);
            return obj;
        };
        CBullet.prototype.init = function () {
        };
        CBullet.prototype.onDestroy = function () {
            if (this.m_pBullet) {
                Utils.removeFromParent(this.m_pBullet);
                this.m_pBullet = null;
            }
            this.m_skillVo = null;
            this.m_returnPos = null;
            // this.m_isShowDoneEffect = true;
        };
        CBullet.prototype.reset = function (missileId, configID, data, speed) {
            this.m_t = 0;
            this.data = data;
            this.m_isShowFinishEffect = true;
            this.initWithConfig(missileId, configID, speed);
        };
        CBullet.prototype.initWithConfig = function (missileId, configID, speed) {
            // this.m_missileId = missileId;
            var config = com_main.CBulletMgr.getIns().bulletConfig[configID];
            this.m_isCatapultTrack = config["isCatapultTrack"];
            this.m_pBullet.texture = RES.getRes(config["pic"]);
            this.m_speed = speed || config["speed"];
            this.m_disPercent = config["disPercent"];
            this.m_angleOffset = config["angleOffset"];
            this.m_hitEffect = config["effect"];
            this.m_hitSound = config["sound"];
            this.m_isAutoRatation = config["autoRotation"] || 0;
            // this.m_isShowDoneEffect = isShowDoneEffect;
            this.anchorOffsetX = this.width * 0.5;
            this.anchorOffsetY = this.height * 0.5;
        };
        // private onEnter(): void {
        // }
        // private onExit(): void {
        // }
        // public setFinishCallback(callback, thisArgs) {
        // 	this.m_pFinishCallback = callback;
        // 	this.m_pFinishThisArgs = thisArgs;
        // }
        CBullet.prototype.resetPath = function (target, origin, curve) {
            this.x = origin.x;
            this.y = origin.y;
            this.m_pTargetPoint = new egret.Point(target.x, target.y);
            this.m_pOriginPoint = new egret.Point(origin.x, origin.y);
            this.m_pDistance = egret.Point.distance(this.m_pTargetPoint, this.m_pOriginPoint);
            this.m_pCurvePoint = curve || this.getCurvePoint();
            // this.m_tPercent = (this.m_speed * (1 / 30) * 1000 * 100) / (this.m_pDistance / this.m_speed);//1 / ((this.m_pDistance / this.m_speed) / 1000 * 30); // //0.01 * this.m_speed / this.m_pDistance;
            var rotation = Math.atan2(this.m_pTargetPoint.x - this.x, this.m_pTargetPoint.y - this.y) * 180 / Math.PI;
            this.rotation = rotation;
            // console.log("this.rotation = "+this.rotation);
            this.m_t = 0;
            this.m_curTime = 0;
            // debug("test ---> bullet " + "index : " + this.m_index + " time : " + Math.floor(this.m_pDistance / this.m_speed) + "毫秒");
            this.m_totalTime = Math.floor(this.m_pDistance / this.m_speed);
            // error("this.m_totalTime : " + this.m_totalTime);
            // this.move();
        };
        CBullet.prototype.addPath = function (origin, target) {
            var path = { origin: new egret.Point(origin.x, origin.y), target: new egret.Point(target.x, target.y) };
            this.m_paths.push(path);
        };
        CBullet.prototype.setCurvePoint = function (curve) {
            this.m_pCurvePoint = curve;
        };
        CBullet.prototype.start = function () {
            if (this.m_isStart)
                return;
            var path = this.m_paths.shift();
            this.resetPath(path.target, path.origin);
            this.m_tempTime = egret.getTimer();
            this.m_isStart = true;
            this.onTick(1);
            if (!this.m_pDistance)
                this.finish();
        };
        CBullet.prototype.getStart = function () {
            return this.m_isStart;
        };
        Object.defineProperty(CBullet.prototype, "speed", {
            set: function (sp) {
                this.m_speed = sp;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 播放击中特效
         */
        CBullet.prototype.playHitEffect = function () {
            if (!this.m_hitEffect)
                return;
            var effect = com_main.CEffectFunc.addEffect(this.m_hitEffect); //CEffectMgr.getIns().getEffect(this.m_hitEffect);
            effect.x = this.x;
            effect.y = this.y;
            effect.play();
        };
        CBullet.prototype.move = function () {
            this.m_flame += 1;
            var lastX = this.x;
            var lastY = this.y;
            var diff = (1 - this.m_t);
            var diffSqr = Math.pow(diff, 2);
            var tSqr = Math.pow(this.m_t, 2);
            var curMult = 2 * this.m_t * diff;
            this.x = diffSqr * this.m_pOriginPoint.x + curMult * this.m_pCurvePoint.x + tSqr * this.m_pTargetPoint.x;
            this.y = diffSqr * this.m_pOriginPoint.y + curMult * this.m_pCurvePoint.y + tSqr * this.m_pTargetPoint.y;
            if (this.m_flame > 2) {
                this.m_flame = 0;
                var dx = this.x - lastX;
                var dy = this.y - lastY;
                var rotation = Math.atan2(dy, dx) * 180 / Math.PI;
                if (this.m_isAutoRatation == 0)
                    this.rotation = rotation;
            }
            // else
            // 	this.rotation = (this.rotation + 10) % 360;
            // console.log("this.rotation = "+this.rotation);
        };
        /**
         * 出发点和目标的的角度
         */
        CBullet.prototype.getAngle = function () {
            var dx = this.m_pTargetPoint.x - this.m_pOriginPoint.x;
            var dy = this.m_pTargetPoint.y - this.m_pOriginPoint.y;
            var dt = Math.atan2(dy, dx);
            var angle = dt * 180 / Math.PI + 90;
            // debug("angle : " + angle + " dt : " + dt);
            // var temp = Math.abs(angle % 180 - 90) / 90;
            // this.m_angleOffset = 1 - temp;
            // this.m_disPercent = 1 - temp * 0.5;
            if (this.m_isCatapultTrack == 1) {
                this.getCatapultSetting(angle);
                this.m_angleOffset = Math.abs(this.m_angleOffset);
            }
            else {
                this.m_angleOffset = Math.abs(this.m_angleOffset);
                if (this.m_angleOffset != 0)
                    this.adjustBulletCurve(angle);
            }
            // this.m_angleOffset = Math.abs(this.m_angleOffset);
            if (angle >= 0 && angle <= 180)
                this.m_angleOffset = -this.m_angleOffset;
            return dt + this.m_angleOffset;
        };
        /**调整子弹曲线
         * 根据角度的不同调整
         */
        CBullet.prototype.adjustBulletCurve = function (angle) {
            var upAngle = 0;
            var upOffset = 20;
            var upRightAngle = upAngle + upOffset;
            var upRightOffset = 60;
            var upLeftAngle = upAngle - upOffset;
            var upLeftOffset = 60;
            var bottomAngle = 180;
            var bottomOffset = 20;
            var bottomRightAngle = bottomAngle - bottomOffset;
            var bottomRighOffset = 60;
            var bottomLeftAngle = bottomAngle + bottomOffset;
            var bottomLeftOffset = 60;
            var rightUpAngle = upRightAngle + upRightOffset;
            var rightBottomAngle = bottomRightAngle - bottomRighOffset;
            var leftUpAngle = upLeftAngle - upLeftOffset;
            var leftBottomAngle = bottomLeftAngle + bottomLeftOffset;
            if ((angle >= upRightAngle && angle <= rightUpAngle) || (angle >= leftUpAngle && angle <= upLeftAngle)
                || (angle >= bottomLeftAngle && angle <= leftBottomAngle) || (angle >= rightBottomAngle && angle <= bottomRightAngle)) {
                this.m_angleOffset = this.m_angleOffset - (this.m_angleOffset * 0.3);
                this.m_disPercent = this.m_disPercent - this.m_disPercent * 0.3;
            }
            else if ((angle < bottomLeftAngle && angle > bottomRightAngle) || (angle < upRightAngle && angle > upLeftAngle)) {
                this.m_angleOffset = 0.15;
                this.m_disPercent = 0.5;
            }
            else {
                var upperLimit = 300;
                var lowerLimit = 100;
                var limitDis = upperLimit - lowerLimit;
                if (this.m_pDistance < upperLimit) {
                    var adjustPercent = this.m_pDistance / limitDis;
                    if (adjustPercent < 0.3)
                        adjustPercent = 0.3;
                    this.m_angleOffset = this.m_angleOffset * adjustPercent;
                    // this.m_disPercent = this.m_disPercent * adjustPercent;
                    // if (this.m_pDistance < lowerLimit) {
                    // 	this.m_angleOffset = 0;
                    // 	this.m_disPercent = 0.5;
                    // } else {
                    // 	let adjustPercent = this.m_pDistance / limitDis;
                    // 	if (adjustPercent < 0.3) adjustPercent = 0.3;
                    // 	this.m_angleOffset = this.m_angleOffset * adjustPercent;
                    // 	this.m_disPercent = this.m_disPercent * adjustPercent;
                    // }
                }
            }
        };
        /**
         * 使用投石车设定
         */
        CBullet.prototype.getCatapultSetting = function (angle) {
            var absAngle = Math.abs(angle);
            var temp = Math.abs(absAngle % 180 - 90) / 90;
            this.m_angleOffset = 1 - temp;
            this.m_disPercent = 1 - temp * 0.5;
            if (angle >= 110 && angle <= 250) {
                this.m_disPercent = 0.5;
            }
            // debug("bullet---> temp : " + temp + " angle : " + angle);
            // debug("bullet---> disPercent : " + this.m_disPercent + " angleOffset : " + this.m_angleOffset);
            // if (absAngle <= 90 && absAngle >= 60) {
            // 	this.m_angleOffset = 1;
            // 	this.m_disPercent = 1;
            // } else {
            // 	this.m_angleOffset = 0.2;
            // 	this.m_disPercent = 0.5;
            // }
            // this.m_angleOffset = Math.abs(this.m_angleOffset);
            // if (angle >= 0 && angle <= 180) this.m_angleOffset = -this.m_angleOffset
        };
        CBullet.prototype.getCurvePoint = function () {
            var angle = this.getAngle();
            var dis = egret.Point.distance(this.m_pTargetPoint, this.m_pOriginPoint);
            var disPercent = dis * this.m_disPercent;
            var x = this.m_pOriginPoint.x + Math.cos(angle) * disPercent;
            var y = this.m_pOriginPoint.y + Math.sin(angle) * disPercent;
            return new egret.Point(x, y);
            // let midPos = new egret.Point();
            // midPos.x = this.m_pOriginPoint.x + ((this.m_pTargetPoint.x - this.m_pOriginPoint.x) * 0.5);
            // midPos.y = this.m_pOriginPoint.y + ((this.m_pTargetPoint.y - this.m_pOriginPoint.y) * 0.5);
            // let k1 = (this.m_pTargetPoint.y - this.m_pOriginPoint.y) / (this.m_pTargetPoint.x - this.m_pOriginPoint.x);
            // let k2 = -1 / k1;
            // let dx = ((this.m_pTargetPoint.x - this.m_pOriginPoint.x) / Math.abs(this.m_pTargetPoint.x - this.m_pOriginPoint.x));
            // let v = new egret.Point(1 * dx, -Math.abs(k2 * 1));
            // v.x *= 10;
            // v.y *= 10;
            // let pos = new egret.Point(midPos.x + v.x, midPos.y + v.y);
            // return pos;
        };
        CBullet.prototype.nextPath = function () {
            if (this.m_paths.length > 0) {
                this.m_isShowFinishEffect = true;
                var path = this.m_paths.shift();
                var origin_1 = new egret.Point(this.x, this.y);
                this.resetPath(path.target, origin_1);
                return true;
            }
            if (this.m_returnPos && this.m_isReturn) {
                var origin_2 = new egret.Point(this.x, this.y);
                this.resetPath(this.m_returnPos, origin_2);
                this.m_returnPos = null;
                return true;
            }
            return false;
        };
        // /**
        //  * 是否有下一次弹跳
        //  */
        // private isNextBounce() {
        // 	if (this.m_skillVo) {
        // 		let config = this.m_skillVo.getSkillConfig();
        // 		if (this.m_skillVo.catapultTimes >= config.missileCatapultNum || this.m_skillVo.catapultTimes == -1)
        // 			return false;
        // 		else
        // 			return true;
        // 	}
        // 	// error("this.m_skillVo : " + this.m_skillVo);
        // 	return false;
        // }
        CBullet.prototype.finish = function () {
            // debug("test ---> bullet " + "index : " + this.m_index + " finish : " + Math.floor(egret.getTimer() - this.m_tempTime) + "毫秒");
            this.m_isStart = false;
            //TODO
            //派发事件
            // CBulletMgr.getIns().removeBullet(this.m_index);
            // Utils.open_view(MapNav.BULLET_FINISH, this.m_data);
            // if (this.m_pFinishCallback && this.m_pFinishThisArgs) {
            // 	this.m_pFinishCallback.call(this.m_pFinishThisArgs);
            // 	this.m_pFinishCallback = null;
            // 	this.m_pFinishThisArgs = null;
            // }
            this.m_data = null;
            this.m_skillVo = null;
            this.m_returnPos = null;
            // this.playHitEffect();
            com_main.CBulletMgr.getIns().recycleBullet(this);
            // Utils.removeFromParent(this);
            // if (this.parent) this.parent.removeChild(this);
        };
        CBullet.prototype.onTick = function (delta) {
            if (this.m_isStart) {
                this.m_curTime += delta;
                this.m_t = this.m_curTime / this.m_totalTime;
                // this.m_t += this.m_tPercent; //0.01 * this.m_speed / this.m_pDistance;
                if (this.m_t >= 1) {
                    this.m_t = 1;
                    if (this.m_isShowFinishEffect == true) {
                        this.m_isShowFinishEffect = false;
                        this.playHitEffect();
                    }
                    if (!this.nextPath() /*&& !this.isNextBounce()*/)
                        this.finish();
                }
                this.move();
                // Utils.isInStage(this);
            }
            return false;
        };
        return CBullet;
    }(egret.DisplayObjectContainer));
    com_main.CBullet = CBullet;
})(com_main || (com_main = {}));
