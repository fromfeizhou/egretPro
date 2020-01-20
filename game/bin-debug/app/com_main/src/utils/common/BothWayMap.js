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
* 双向map
*/
var BothWayMap = /** @class */ (function (_super_1) {
    __extends(BothWayMap, _super_1);
    function BothWayMap(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    BothWayMap.create = function (body) {
        var obj = new BothWayMap(body);
        return obj;
    };
    BothWayMap.prototype.init = function (body) {
        this.m_map = {};
        this.m_keyMap = {};
        if (body) {
            for (var key in body) {
                this.add(key, body[key]);
            }
        }
    };
    BothWayMap.prototype.clear = function () {
        this.m_keyMap = null;
        this.m_keyMap = null;
    };
    BothWayMap.prototype.onDestroy = function () {
        this.clear();
    };
    /**
     * 添加指定类型的数据
     * @param key 可以是字符、数字
     * @param value 可以是字符、数字
     */
    BothWayMap.prototype.add = function (key, value) {
        this.m_map[key] = value;
        this.m_keyMap[value] = key;
    };
    /**根据key 获得值 */
    BothWayMap.prototype.getVal = function (key) {
        return this.m_map[key];
    };
    /**根据值 获得value */
    BothWayMap.prototype.getKey = function (value) {
        return this.m_keyMap[value];
    };
    return BothWayMap;
}(egret.HashObject));
