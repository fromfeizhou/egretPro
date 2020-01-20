var com_main;
(function (com_main) {
    var EventMgr = /** @class */ (function () {
        function EventMgr() {
        }
        /**
         * 添加事件侦听
         * type 事件ID
         * callback 事件处理
         * thisObject 对象
         */
        EventMgr.addEvent = function (type, callback, thisObject) {
            if (this.eventList[type] == null) {
                this.eventList[type] = [];
            }
            // let num = this.eventList[type].length;
            if (!this.hasEvent(type, callback, thisObject)) {
                this.eventList[type].push({ "callback": callback, "thisObject": thisObject });
            }
        };
        /**
         * 删除静态对象使用 其他对象使用（removeEventByObject）
         * 【注意】 同一个类多个实例 回调函数值相同 (移除会移除监听列表 位置0的回调) 导致难以发现的bug
         * 所以只用做静态对象的移除（静态对象 通常只会调用一次监听）
         * 删除事件侦听
         */
        EventMgr.removeStaticEvent = function (type, callback) {
            var events = this.eventList[type];
            if (events != null) {
                for (var i = events.length - 1; i >= 0; i--) {
                    var evt = events[i];
                    if (evt["callback"] == callback) {
                        events.splice(i, 1);
                    }
                }
                if (events.length == 0)
                    delete this.eventList[type];
            }
        };
        /**
         * 删除事件侦听
         */
        EventMgr.removeEventByObject = function (type, thisObject) {
            var events = this.eventList[type];
            if (events != null) {
                for (var i = events.length - 1; i >= 0; i--) {
                    var evt = events[i];
                    if (evt["thisObject"].hashCode == thisObject.hashCode) {
                        events.splice(i, 1);
                    }
                }
                if (events.length == 0)
                    delete this.eventList[type];
            }
        };
        /**
         * 派发事件
         * type 事件ID
         * data 自定义数据
         */
        EventMgr.dispatchEvent = function (type, data) {
            var events = this.eventList[type];
            if (events) {
                var num = events.length;
                for (var i = 0; i < num; i++) {
                    var evt = events[i];
                    var callback = evt["callback"];
                    var obj = evt["thisObject"];
                    callback.apply(obj, [data]);
                }
            }
        };
        /**
         * 判断EventMgr是否有该事件的某个回调函数S
         * type 事件ID
         * callback 回调函数
         */
        EventMgr.hasEvent = function (type, callback, thisObject) {
            var events = this.eventList[type];
            if (events != null) {
                var num = events.length;
                for (var i = 0; i < num; i++) {
                    var evt = events[i];
                    var cb = evt["callback"];
                    var obj = evt["thisObject"];
                    if (cb == callback) {
                        if (obj && thisObject && obj.hashCode == thisObject.hashCode)
                            return true;
                    }
                }
            }
            return false;
        };
        EventMgr.eventList = {};
        return EventMgr;
    }());
    com_main.EventMgr = EventMgr;
})(com_main || (com_main = {}));
