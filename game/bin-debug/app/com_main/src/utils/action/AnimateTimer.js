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
    /**
     *
     * @author
     *
     */
    var Animate = /** @class */ (function (_super_1) {
        __extends(Animate, _super_1);
        function Animate() {
            var _this = _super_1.call(this) || this;
            _this.isLife = true;
            _this.updateTime = 0;
            AnimateTimer.Instance.push(_this);
            return _this;
        }
        Animate.prototype.onCreate = function () {
        };
        Animate.prototype.onDestroy = function () {
            this.isLife = false;
            AnimateTimer.Instance.remove(this);
        };
        Animate.prototype.onEnterFrame = function (delta) {
        };
        Animate.prototype.onTimer = function (delta) {
            var frameTime = Animate.FRAME_TIME_UPDATE;
            this.updateTime += delta;
            while (this.updateTime >= frameTime) {
                // if (!this.isLife) {
                //     break;
                // }
                this.onEnterFrame(frameTime);
                this.updateTime -= frameTime;
            }
        };
        Animate.FRAME_TIME_UPDATE = 1 / 30;
        return Animate;
    }(egret.HashObject));
    com_main.Animate = Animate;
    var AnimateTimer = /** @class */ (function () {
        function AnimateTimer() {
            this.m_pList = [];
            this.m_pTimeStamp = 0;
        }
        AnimateTimer.prototype.onEnterFrame = function (timeStamp) {
            var list = this.m_pList; //this.m_pList.concat();
            var delta = (timeStamp - this.m_pTimeStamp) * 0.001; /// 1000;
            var _lenght = list.length;
            for (var i = 0; i < _lenght; i++) {
                var action = list[i];
                if (action && action.isLife)
                    action.onTimer(delta);
            }
            this.m_pTimeStamp = timeStamp;
            return false;
        };
        AnimateTimer.prototype.push = function (action) {
            var isAction = this.m_pList.length == 0;
            this.m_pList.push(action);
            if (isAction) {
                this.m_pTimeStamp = egret.getTimer();
                egret.startTick(this.onEnterFrame, this);
            }
            return action;
        };
        AnimateTimer.prototype.remove = function (action) {
            var index = this.m_pList.indexOf(action);
            if (index != -1) {
                this.m_pList.splice(index, 1);
            }
            if (this.m_pList.length == 0) {
                egret.stopTick(this.onEnterFrame, this);
            }
        };
        Object.defineProperty(AnimateTimer, "Instance", {
            get: function () {
                if (AnimateTimer._instance == null) {
                    AnimateTimer._instance = new AnimateTimer();
                }
                return AnimateTimer._instance;
            },
            enumerable: true,
            configurable: true
        });
        return AnimateTimer;
    }());
    com_main.AnimateTimer = AnimateTimer;
})(com_main || (com_main = {}));
