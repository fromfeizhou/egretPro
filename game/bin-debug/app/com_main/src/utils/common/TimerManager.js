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
   * Timer管理器
   */
var TimerManager = /** @class */ (function (_super_1) {
    __extends(TimerManager, _super_1);
    /**
     * 构造函数
     */
    function TimerManager() {
        var _this = _super_1.call(this) || this;
        _this._handlers = new Array();
        _this._delHandlers = new Array();
        _this._currTime = egret.getTimer();
        _this._count = 0;
        _this._timeScale = 1;
        _this._fps = 60;
        _this._fps_time = 1000 / _this._fps;
        egret.startTick(_this.onEnterFrame, _this);
        return _this;
    }
    /**
     * 设置时间参数
     * @param timeScale
     */
    TimerManager.prototype.setTimeScale = function (timeScale) {
        this._timeScale = timeScale;
    };
    TimerManager.prototype.onEnterFrame = function (timeStamp) {
        var delta = (timeStamp - this._currTime) * 0.001;
        this._currTime = timeStamp;
        var count = this._count;
        for (var i = 0; i < count; i++) {
            var handler = this._handlers[i];
            /**
             * handler 有可能是 undefined 所以要加上判断
             */
            if (handler && timeStamp >= handler.exeTime) {
                var isDel = false;
                if (!handler.repeat) {
                    if (handler.repeatCount > 1) {
                        handler.repeatCount--;
                    }
                    else {
                        this._delHandlers.push(handler);
                        isDel = true;
                    }
                }
                handler.method.call(handler.methodObj, (timeStamp - handler.dealTime) * this._timeScale, handler.args);
                if (isDel && handler.complateMethod) {
                    handler.complateMethod.apply(handler.complateMethodObj);
                }
                handler.dealTime = timeStamp;
                handler.exeTime += handler.delay;
            }
        }
        while (this._delHandlers.length) {
            var handler = this._delHandlers.pop();
            this.remove(handler.method, handler.methodObj);
        }
        return false;
    };
    TimerManager.prototype.create = function (useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj, args) {
        //参数监测
        if (delay < 0 || repeatCount < 0 || method == null) {
            return;
        }
        //先删除相同函数的计时
        this.remove(method, methodObj);
        //创建
        var handler = ObjectPool.pop(TimerHandler, "TimerHandler");
        handler.userFrame = useFrame;
        handler.repeat = repeatCount == 0;
        handler.repeatCount = repeatCount;
        handler.delay = delay;
        handler.method = method;
        handler.methodObj = methodObj;
        handler.complateMethod = complateMethod;
        handler.complateMethodObj = complateMethodObj;
        handler.exeTime = delay + this._currTime;
        handler.dealTime = this._currTime;
        handler.args = args;
        this._handlers.push(handler);
        this._count++;
        this.removeFormDelHandlers(method, methodObj);
    };
    /**修改间隔时间 */
    TimerManager.prototype.changeDelay = function (delay, method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                handler.delay = delay;
                handler.exeTime = delay + this._currTime;
                handler.dealTime = this._currTime;
                return;
            }
        }
    };
    /**
     *
     * 定时执行
     * @param delay 执行间隔:毫秒
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doTimer = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj, args) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(false, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj, args);
    };
    /**修改间隔时间 */
    TimerManager.prototype.changeTimerDelay = function (delay, method, methodObj) {
        this.changeDelay(delay, method, methodObj);
    };
    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doFrame = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(false, delay * this._fps_time, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    /**修改间隔时间 */
    TimerManager.prototype.changeFrameDelay = function (delay, method, methodObj) {
        this.changeDelay(delay * this._fps_time, method, methodObj);
    };
    Object.defineProperty(TimerManager.prototype, "count", {
        /**
         * 定时器执行数量
         * @return
         *
         */
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.remove = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                this._handlers.splice(i, 1);
                handler.clear();
                ObjectPool.push(handler);
                this._count--;
                break;
            }
        }
    };
    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.removeAll = function (methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.methodObj == methodObj) {
                this._handlers.splice(i, 1);
                handler.clear();
                ObjectPool.push(handler);
                this._count--;
                i--;
            }
        }
    };
    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
    TimerManager.prototype.isExists = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                return true;
            }
        }
        return false;
    };
    TimerManager.prototype.removeFormDelHandlers = function (method, methodObj) {
        var count = this._delHandlers.length;
        for (var i = 0; i < count; i++) {
            var handler = this._delHandlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                this._delHandlers.splice(i, 1);
                return;
            }
        }
    };
    return TimerManager;
}(BaseClass));
var TimerHandler = /** @class */ (function (_super_1) {
    __extends(TimerHandler, _super_1);
    function TimerHandler() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        /**执行间隔*/
        _this.delay = 0;
        /**重复执行次数*/
        _this.repeatCount = 0;
        /**执行时间*/
        _this.exeTime = 0;
        /**上次的执行时间*/
        _this.dealTime = 0;
        return _this;
    }
    /**清理*/
    TimerHandler.prototype.clear = function () {
        this.method = null;
        this.methodObj = null;
        this.complateMethod = null;
        this.complateMethodObj = null;
        this.args = null;
    };
    return TimerHandler;
}(egret.HashObject));
