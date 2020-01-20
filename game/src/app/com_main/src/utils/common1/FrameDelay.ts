/**
 * Created by yangsong on 2014/11/23.
 * 帧延迟处理
 */
class FrameDelay {
    private args: any;
    private thisObj: any;
    private func: Function;

    /**
     * 构造函数
     */
    public constructor() {
    }

    public clear() {
        Utils.TimerManager.remove(this.listener_enterFrame, this);
        this.args = null;
        this.func = null;
        this.thisObj = null;
    }

    /**
     * 延迟处理
     * @param delayFrame 延迟帧数
     * @param func 延迟执行的函数
     * @param thisObj 延迟执行的函数的所属对象
     */
    public delayCall(delayFrame: number, func: Function, thisObj: any, args?: any): void {
        this.args = args;
        this.func = func;
        this.thisObj = thisObj;
        Utils.TimerManager.remove(this.listener_enterFrame, this);
        Utils.TimerManager.removeFormDelHandlers(this.listener_enterFrame, this);
        Utils.TimerManager.doFrame(delayFrame, 2, this.listener_enterFrame, this);
    }

    private listener_enterFrame(): void {
        this.func.call(this.thisObj, this.args);
    }
}