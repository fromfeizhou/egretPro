/**
 * Created by yangsong on 2014/11/23.
 * 分帧处理
 */
class FrameExecutor {
    private functions: any[][];
    private delayFrame: number;
    private frameDelay: FrameDelay;
    private m_pIsExecute: boolean;

    public static create($delayFrame: number = 1) {
        return new FrameExecutor($delayFrame);
    }

    /**
     * 构造函数
     */
    public constructor($delayFrame: number) {
        this.init($delayFrame);
    }

    public init($delayFrame: number) {
        this.functions = [];
        this.delayFrame = $delayFrame;
        this.frameDelay = new FrameDelay();
    }

    public clear() {
        this.functions = [];
        this.delayFrame = 0;
        this.frameDelay.clear();
        this.m_pIsExecute = false;
    }

    public onDestroy() {
        this.clear();
        this.functions = null;
        this.frameDelay = null;
    }

    /**
     * 注册要分帧处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    public regist($func: Function, $thisObj: any, args?: any): void {
        this.functions.push([$func, $thisObj, args]);
        // debug("FrameExecutor:regist--->>", this.functions.length)
    }

    /**
     * 执行
     */
    public execute(): void {
        // debug("FrameExecutor:execute--->>开始执行", this.functions.length)
        if (this.functions.length) {
            let arr: any[] = this.functions.shift();
            let func = arr[0];
            let self = arr[1];
            let args = arr[2];
            func.call(self, args);
        }
        if (this.functions.length) {
            // debug("FrameExecutor:execute--->>", this.functions.length)
            this.m_pIsExecute = true;
            this.frameDelay.delayCall(this.delayFrame, this.execute, this);
        } else {
            this.m_pIsExecute = false;
        }
    }

    public isExecute() {
        return this.m_pIsExecute;
    }
}
