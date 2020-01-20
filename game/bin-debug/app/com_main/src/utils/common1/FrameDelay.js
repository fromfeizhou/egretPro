/**
 * Created by yangsong on 2014/11/23.
 * 帧延迟处理
 */
var FrameDelay = /** @class */ (function () {
    /**
     * 构造函数
     */
    function FrameDelay() {
    }
    FrameDelay.prototype.clear = function () {
        Utils.TimerManager.remove(this.listener_enterFrame, this);
        this.args = null;
        this.func = null;
        this.thisObj = null;
    };
    /**
     * 延迟处理
     * @param delayFrame 延迟帧数
     * @param func 延迟执行的函数
     * @param thisObj 延迟执行的函数的所属对象
     */
    FrameDelay.prototype.delayCall = function (delayFrame, func, thisObj, args) {
        this.args = args;
        this.func = func;
        this.thisObj = thisObj;
        Utils.TimerManager.remove(this.listener_enterFrame, this);
        Utils.TimerManager.removeFormDelHandlers(this.listener_enterFrame, this);
        Utils.TimerManager.doFrame(delayFrame, 2, this.listener_enterFrame, this);
    };
    FrameDelay.prototype.listener_enterFrame = function () {
        this.func.call(this.thisObj, this.args);
    };
    return FrameDelay;
}());
