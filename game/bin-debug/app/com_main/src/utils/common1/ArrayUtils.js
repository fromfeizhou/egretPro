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
 * Created by egret on 15-8-7.
 */
var ArrayUtils = /** @class */ (function (_super_1) {
    __extends(ArrayUtils, _super_1);
    function ArrayUtils() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    ArrayUtils.prototype.forEach = function (arr, func, funcObj) {
        for (var i = 0, len = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    };
    ArrayUtils.prototype.dicToArray = function (dic) {
        var datas = [];
        for (var i = 0; i < dic.length; i++) {
            if (dic[i]) {
                datas.push(dic[i]);
            }
        }
        return datas;
    };
    ArrayUtils.prototype.charsToNums = function (maps) {
        var nums = [];
        maps.forEach(function (value, index, array) {
            nums[index] = Number(value);
        });
        return nums;
    };
    /**
     * 把array转换成map
     * key : 键值
     */
    ArrayUtils.prototype.arrayToMap = function (arr, key) {
        if (!arr || arr.length == 0) {
            return arr;
        }
        var news = [];
        for (var i in arr) {
            var item = arr[i];
            news[item[key]] = item;
        }
        return news;
    };
    ArrayUtils.prototype.equals = function (datas, searchElement) {
        return datas.indexOf(searchElement, 0) != -1;
    };
    return ArrayUtils;
}(BaseClass));
