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
 * Created by yangsong on 2014/11/23.
 * Debug调试工具
 */
var DebugUtils = /** @class */ (function (_super_1) {
    __extends(DebugUtils, _super_1);
    function DebugUtils() {
        var _this = _super_1.call(this) || this;
        _this._threshold = 1;
        _this._debugSkill = false;
        _this._startTimes = {};
        return _this;
    }
    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    DebugUtils.prototype.isOpen = function (flag) {
        this._isOpen = flag;
    };
    Object.defineProperty(DebugUtils.prototype, "isDebug", {
        /**
         * 是否是调试模式
         * @returns {boolean}
         */
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugUtils.prototype, "isdebugSkill", {
        /**
         * 是否打印技能
         * @returns {boolean}
         */
        get: function () {
            return this._debugSkill;
        },
        enumerable: true,
        configurable: true
    });
    DebugUtils.prototype.setdebugSkill = function (flag) {
        this._debugSkill = flag;
    };
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    DebugUtils.prototype.start = function (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * 停止
     *
     */
    DebugUtils.prototype.stop = function (key) {
        if (!this._isOpen) {
            return 0;
        }
        if (!this._startTimes[key]) {
            return 0;
        }
        var cha = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            debugBatt("consume time--->>" + key + ": " + cha);
        }
        return cha;
    };
    /**
     * 设置时间间隔阈值
     * @param value
     */
    DebugUtils.prototype.setThreshold = function (value) {
        this._threshold = value;
    };
    return DebugUtils;
}(BaseClass));
