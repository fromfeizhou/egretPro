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
 * Created by Tint_ on 2017/3/22.
 */
/**
 * **********    自定义事件调度管理器    ***********
 *
 * **所有自定义事件，使用此类进行管理和调度...
 */
var EventCustomMgr = /** @class */ (function (_super_1) {
    __extends(EventCustomMgr, _super_1);
    function EventCustomMgr() {
        var _this = _super_1.call(this) || this;
        if (EventCustomMgr._mInstance || !EventCustomMgr._mIsInstance) {
        }
        return _this;
    }
    EventCustomMgr.getInstance = function () {
        if (EventCustomMgr._mInstance == null) {
            EventCustomMgr._mIsInstance = true;
            EventCustomMgr._mInstance = new EventCustomMgr();
        }
        return EventCustomMgr._mInstance;
    };
    EventCustomMgr.addEventListener = function (type, listener, thisObject, useCapture, priority) {
        EventCustomMgr.getInstance().addEventListener(type, listener, thisObject, useCapture, priority);
    };
    EventCustomMgr.removeEventListener = function (type, listener, thisObject, useCapture) {
        EventCustomMgr.getInstance().removeEventListener(type, listener, thisObject, useCapture);
    };
    EventCustomMgr.once = function (type, listener, thisObject, useCapture, priority) {
        EventCustomMgr.getInstance().once(type, listener, thisObject, useCapture, priority);
    };
    EventCustomMgr.hasEventListener = function (type) {
        return EventCustomMgr.getInstance().hasEventListener(type);
    };
    EventCustomMgr.willTrigger = function (type) {
        return EventCustomMgr.getInstance().willTrigger(type);
    };
    EventCustomMgr.dispatchEvent = function (type, bubbles, cancelable) {
        var event = egret.Event.create(egret.Event, type, bubbles, cancelable);
        var result = EventCustomMgr.getInstance().dispatchEvent(event);
        egret.Event.release(event);
        return result;
    };
    /**
     * 派发一个带数据的事件。
     * @param type {string} 事件类型
     * @param data {any} 事件data
     * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
     * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
     */
    EventCustomMgr.dispatchEventWith = function (type, data, bubbles, cancelable) {
        EventCustomMgr.getInstance().dispatchEventWith(type, bubbles, data, cancelable);
        return true;
    };
    EventCustomMgr._mInstance = null;
    EventCustomMgr._mIsInstance = false;
    return EventCustomMgr;
}(egret.EventDispatcher));
