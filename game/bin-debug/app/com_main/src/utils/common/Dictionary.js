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
* 对象存储器,可根据字符名称和对象作为标签名来存储的数据.
* 建议"get"一次后缓存好数据不要频繁使用"get对象key","字符key"不影响
* 支持用对象作为key存储数据.
* @author 交流联系方式 564139153@qq.com 一块红布
*/
var Dictionary = /** @class */ (function (_super_1) {
    __extends(Dictionary, _super_1);
    function Dictionary(body) {
        var _this = _super_1.call(this) || this;
        /**
         * 字典计数器
         */
        _this._count = 0;
        _this.init(body);
        return _this;
    }
    Dictionary.create = function (body) {
        var obj = new Dictionary(body);
        return obj;
    };
    Dictionary.prototype.init = function (body) {
        this._maps = {};
        this._hashMaps = {};
        this._objKeys = [];
        this._objDatum = [];
        if (body) {
            for (var key in body) {
                this.add(key, body[key]);
            }
        }
    };
    Dictionary.prototype.clear = function () {
        this._maps = {};
        this._hashMaps = {};
        this._objKeys.length = 0;
        this._objDatum.length = 0;
        this._count = 0;
    };
    Dictionary.prototype.onDestroy = function () {
        this.clear();
    };
    /**
     * 添加指定类型的数据
     * @param key 可以是对象、字符、数字
     * @param data 任何类型
     */
    Dictionary.prototype.add = function (key, data) {
        // if(key instanceof Long) {
        // 	key = key.toString(16)
        // }
        if (typeof (key) != "object") {
            if (!this._maps[key]) {
                this._count++;
            }
            this._maps[key] = data;
        }
        else if (key instanceof egret.HashObject) {
            if (!this._hashMaps[key.hashCode]) {
                this._count++;
            }
            this._hashMaps[key.hashCode] = [key, data];
        }
        else {
            var index = this._objKeys.lastIndexOf(key);
            if (index == -1) {
                this._objKeys.push(key);
                this._objDatum.push(data);
                this._count++;
            }
            else {
                this._objDatum[index] = data;
            }
        }
    };
    /**
     * 删除指定类型的全部数据
     * @param key  可以是对象、字符、数字
     *
     */
    Dictionary.prototype.del = function (key) {
        var index;
        // if(key instanceof Long) {
        // 	key = key.toString(16)
        // }
        if (typeof (key) != "object") {
            if (this._maps[key]) {
                delete this._maps[key];
                this._count--;
            }
        }
        else if (key instanceof egret.HashObject) {
            if (this._hashMaps[key.hashCode]) {
                delete this._hashMaps[key.hashCode];
                this._count--;
            }
        }
        else {
            index = this._objKeys.lastIndexOf(key);
            if (index != -1) {
                this._objKeys.splice(index, 1);
                this._objDatum.splice(index, 1);
                this._count--;
            }
        }
    };
    /**
     * 获取存储中的数据,对象作为key实际上需要进行遍历索引，所以在同一个字典中尽量不要添加过多的key会影响性能,
     * 建议get一次后缓存好数据不要频繁使用get对象key,字符key不影响
     * @param key 可以是对象、字符、数字
     * @return
     */
    Dictionary.prototype.get = function (key) {
        // if(key instanceof Long) {
        // 	key = key.toString(16)
        // }
        if (typeof (key) != "object") {
            if (!this._maps[key]) {
                return null;
            }
            return this._maps[key];
        }
        else if (key instanceof egret.HashObject) {
            if (!this._hashMaps[key.hashCode]) {
                return null;
            }
            return this._hashMaps[key.hashCode][1];
        }
        else {
            var index = this._objKeys.lastIndexOf(key);
            if (index != -1) {
                return this._objDatum[index];
            }
            return null;
        }
    };
    /**
     * 检查是否有该类型的数据存在
     * @param key 可以是对象、字符、数字
     * @return
     */
    Dictionary.prototype.has = function (key) {
        // if(key instanceof Long) {
        // 	key = key.toString(16)
        // }
        if (typeof (key) != "object") {
            if (this._maps[key] == null || this._maps[key] == undefined)
                return false;
            return true;
        }
        else if (key instanceof egret.HashObject) {
            return this._hashMaps[key.hashCode] ? true : false;
        }
        else {
            var index = this._objKeys.lastIndexOf(key);
            if (index != -1) {
                return true;
            }
            return false;
        }
    };
    Object.defineProperty(Dictionary.prototype, "count", {
        /**
         *  获取字典中储存数据的个数
         *
         */
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 对字典中的每一项执行函数，用该函数可以省去for循环，
     * 允许回调函数中删除当前正在执行的key，
     * 但是删除字典中的其他key可能会出现少遍历或重复遍历的情况.
     *
     */
    Dictionary.prototype.forEach = function (callback, thisObject) {
        if (thisObject === void 0) { thisObject = null; }
        var name, arr, funcRes;
        for (name in this._maps) {
            funcRes = callback.call(thisObject, name, this._maps[name]);
            if (funcRes == 'break')
                return;
        }
        for (name in this._hashMaps) {
            arr = this._hashMaps[name];
            funcRes = callback.call(thisObject, arr[0], arr[1]);
            if (funcRes == 'break')
                return;
        }
        for (var j = 0; j < this._objKeys.length; j++) {
            var key = this._objKeys[j];
            funcRes = callback.call(thisObject, this._objKeys[j], this._objDatum[j]);
            if (key != this._objKeys[j]) {
                j--;
            }
            if (funcRes == 'break')
                return;
        }
    };
    Object.defineProperty(Dictionary.prototype, "elements", {
        /**
         *  获取字典中储存key和data的队列
         *
         */
        get: function () {
            var _list = [];
            var name, arr;
            for (name in this._maps) {
                _list.push({ key: name, data: this._maps[name] });
            }
            for (name in this._hashMaps) {
                arr = this._hashMaps[name];
                _list.push({ key: arr[0], data: arr[1] });
            }
            var len = this._objKeys.length;
            for (var j = 0; j < len; j++) {
                _list.push({ key: this._objKeys[j], data: this._objDatum[j] });
            }
            return _list;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "keys", {
        /**
         *  获取字典中储存key队列
         *
         */
        get: function () {
            var _list = [];
            var name;
            for (name in this._maps) {
                _list.push(name);
            }
            for (name in this._hashMaps) {
                _list.push(this._hashMaps[name][0]);
            }
            _list = _list.concat(this._objKeys);
            return _list;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "datum", {
        /**
         *  获取字典中储存data的队列
         *
         */
        get: function () {
            var _list = [];
            var name;
            for (name in this._maps) {
                _list.push(this._maps[name]);
            }
            for (name in this._hashMaps) {
                _list.push(this._hashMaps[name][1]);
            }
            _list = _list.concat(this._objDatum);
            return _list;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  打印字典中的所有数据
     *
     */
    Dictionary.prototype.dump = function () {
        var name, arr;
        for (name in this._maps) {
            debug("key:", name, "---> data:", this._maps[name]);
        }
        for (name in this._hashMaps) {
            arr = this._hashMaps[name];
            debug("key:", arr[0], "---> data:", arr[1]);
        }
        var len = this._objKeys.length;
        for (var j = 0; j < len; j++) {
            debug("key:", typeof (this._objKeys[j]), " ---> data:", this._objDatum[j]);
        }
    };
    Dictionary.assign = function (target, ass) {
        for (var p in ass) {
            if (ass.hasOwnProperty(p) && (target.hasOwnProperty(p)))
                target[p] = ass[p];
        }
        return target;
    };
    return Dictionary;
}(egret.HashObject));
