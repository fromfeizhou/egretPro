/**
 * Created by yangsong on 2014/11/23.
 * 分帧处理
 */
var FrameExecutor = /** @class */ (function () {
    /**
     * 构造函数
     */
    function FrameExecutor($delayFrame) {
        this.init($delayFrame);
    }
    FrameExecutor.create = function ($delayFrame) {
        if ($delayFrame === void 0) { $delayFrame = 1; }
        return new FrameExecutor($delayFrame);
    };
    FrameExecutor.prototype.init = function ($delayFrame) {
        this.functions = [];
        this.delayFrame = $delayFrame;
        this.frameDelay = new FrameDelay();
    };
    FrameExecutor.prototype.clear = function () {
        this.functions = [];
        this.delayFrame = 0;
        this.frameDelay.clear();
        this.m_pIsExecute = false;
    };
    FrameExecutor.prototype.onDestroy = function () {
        this.clear();
        this.functions = null;
        this.frameDelay = null;
    };
    /**
     * 注册要分帧处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    FrameExecutor.prototype.regist = function ($func, $thisObj, args) {
        this.functions.push([$func, $thisObj, args]);
        // debug("FrameExecutor:regist--->>", this.functions.length)
    };
    /**
     * 执行
     */
    FrameExecutor.prototype.execute = function () {
        // debug("FrameExecutor:execute--->>开始执行", this.functions.length)
        if (this.functions.length) {
            var arr = this.functions.shift();
            var func = arr[0];
            var self_1 = arr[1];
            var args = arr[2];
            func.call(self_1, args);
        }
        if (this.functions.length) {
            // debug("FrameExecutor:execute--->>", this.functions.length)
            this.m_pIsExecute = true;
            this.frameDelay.delayCall(this.delayFrame, this.execute, this);
        }
        else {
            this.m_pIsExecute = false;
        }
    };
    FrameExecutor.prototype.isExecute = function () {
        return this.m_pIsExecute;
    };
    return FrameExecutor;
}());
