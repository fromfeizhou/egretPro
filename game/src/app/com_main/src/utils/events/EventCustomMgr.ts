/**
 * Created by Tint_ on 2017/3/22.
 */
/**
 * **********    自定义事件调度管理器    ***********
 *
 * **所有自定义事件，使用此类进行管理和调度...
 */
class EventCustomMgr extends egret.EventDispatcher{
    private static _mInstance: EventCustomMgr = null;
    private static _mIsInstance: boolean = false;
    private static getInstance(): EventCustomMgr {
        if (EventCustomMgr._mInstance == null) {
            EventCustomMgr._mIsInstance = true;
            EventCustomMgr._mInstance = new EventCustomMgr();
        }
        return EventCustomMgr._mInstance;
    }
    constructor() {
        super();
        if(EventCustomMgr._mInstance || !EventCustomMgr._mIsInstance){
         
        }
    }
    public static addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void{
        EventCustomMgr.getInstance().addEventListener(type, listener, thisObject, useCapture, priority);
    }
    public static removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void{
        EventCustomMgr.getInstance().removeEventListener(type, listener, thisObject, useCapture);
    }
    public static once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void{
        EventCustomMgr.getInstance().once(type, listener, thisObject, useCapture, priority);
    }
    public static hasEventListener(type: string): boolean{
        return EventCustomMgr.getInstance().hasEventListener(type);
    }
    public static willTrigger(type: string): boolean{
        return EventCustomMgr.getInstance().willTrigger(type);
    }
    public static dispatchEvent(type:string, bubbles?:boolean, cancelable?:boolean):boolean {
        let event = egret.Event.create(egret.Event, type, bubbles, cancelable);
        let result = EventCustomMgr.getInstance().dispatchEvent(event);
        egret.Event.release(event);
        return result;
    }
    /**
     * 派发一个带数据的事件。
     * @param type {string} 事件类型
     * @param data {any} 事件data
     * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
     * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
     */
    public static dispatchEventWith(type: string, data?: any, bubbles?: boolean, cancelable?: boolean): boolean{
        EventCustomMgr.getInstance().dispatchEventWith(type, bubbles, data, cancelable);
        return true;
    }
}