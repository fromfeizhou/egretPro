/**
 * 基础红点结构
 **/
var RPBaseData = /** @class */ (function () {
    function RPBaseData() {
        this.evt2Calls = {}; //事件对应回调
        this.init();
    }
    /**初始化 */
    RPBaseData.prototype.init = function () {
        this.evt2Calls = {};
        this.evtTypeCaches = {};
        this.isInCaches = false;
        this.dataEvents = [];
        this.initEvent();
        // this.registerEvent();
    };
    /**清理 */
    RPBaseData.prototype.clear = function () {
        this.evt2Calls = null;
        this.evtTypeCaches = null;
        this.removeEvent();
    };
    /**红点ui赋值判断 */
    RPBaseData.prototype.refreshView = function (info, evtType) {
        if (this.evtTypeCaches[evtType]) {
            delete this.evtTypeCaches[evtType];
        }
    };
    /**---------------------------------------------------------------------------------------------------------------
     * 注册延迟函数begin
     * ---------------------------------------------------------------------------------------------------------------
     */
    /**注册延迟回调 */
    // protected registEvtCallBack(evtType: RedEvtType, callback: Function) {
    //     this.evt2Calls[evtType] = callback;
    // }
    // protected registerEvent() {
    //     //与通用红点类型区分 使用-1
    //     this.registEvtCallBack(RPBaseData.CACHE_NORMAL_TYPE, this.onNormalLater)
    // }
    /**常规回调添加(每分钟检测一次) */
    // protected addNorEvtInCaches(evtType: RedEvtType) {
    //     this.addEvtInCaches(RPBaseData.CACHE_NORMAL_TYPE, evtType);
    // }
    /**常规红点延迟 */
    RPBaseData.prototype.onNormalLater = function (evtType) {
        RedPointModel.onRedPointEvtUpdate(evtType);
    };
    /**
     * 添加延迟执行事件
     * 注意：添加的事件类型 必须registEvtCallBack中找到
     */
    // protected addEvtInCaches(evtType: RedEvtType, ...args: any[]) {
    //     if (!this.evtTypeCaches[evtType]) this.evtTypeCaches[evtType] = [];
    //     let list = this.evtTypeCaches[evtType]
    //     let argsKey = JSON.stringify(args);
    //     for (let i = 0; i < list.length; i++) {
    //         if (list[i].length == args.length && JSON.stringify(list[i]) == argsKey) {
    //             //已存在 参数跳出
    //             return;
    //         }
    //     }
    //     this.evtTypeCaches[evtType].push(args);
    //     this.isInCaches = true;
    // }
    /**统一由redPointModel 执行回调 */
    // public doEvtTypeCachesCall() {
    //     if (!this.isInCaches) return;
    //     for (let key in this.evtTypeCaches) {
    //         let list = this.evtTypeCaches[key];
    //         let func = this.evt2Calls[key];
    //         if (func) {
    //             for (let i = 0; i < list.length; i++) {
    //                 let args: any[] = list[i];
    //                 func.apply(this, args);
    //             }
    //         } else {
    //             error('没有注册 延迟执行函数：evtType:', key)
    //         }
    //     }
    //     this.evtTypeCaches = {};
    //     this.isInCaches = false;
    // }
    /**---------------------------------------------------------------------------------------------------------------
      * 注册延迟函数end
      * ---------------------------------------------------------------------------------------------------------------
      */
    /**
    * 监听事件
    * 注意频繁刷新事件或列表循环里的事件 绝对不用
    * 如列表数据更新 可监听列表循环外的事件
    *  */
    RPBaseData.prototype.initEvent = function () {
    };
    /**移除事件 */
    RPBaseData.prototype.removeEvent = function () {
        if (!this.dataEvents)
            return;
        for (var i = 0; i < this.dataEvents.length; i++) {
            com_main.EventMgr.removeStaticEvent(this.dataEvents[i].key, this.dataEvents[i].callback);
        }
        this.dataEvents = null;
    };
    /**添加数据事件监听 */
    RPBaseData.prototype.addDataEvent = function (type, callback, thisObject) {
        this.dataEvents.push({ key: type, callback: callback });
        com_main.EventMgr.addEvent(type, callback, thisObject);
    };
    return RPBaseData;
}());
