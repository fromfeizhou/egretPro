/**
 * Created by chenpeng on 2015/10/21.
 */
var flash;
(function (flash) {
    var int = /** @class */ (function () {
        function int() {
        }
        /**
         * [静态] 可表示的最大 32 位带符号整数为 2,147,483,647。
         * @type {number}
         */
        int.MAX_VALUE = 2147483647;
        /**
         * [静态] 可表示的最小 32 位带符号整数为 -2,147,483,648。
         * @type {number}
         */
        int.MIN_VALUE = -2147483648;
        return int;
    }());
    flash.int = int;
    flash.INT_TOTAL_NUM = 4294967296;
    /**
     * 检查int数值越界
     * */
    function checkInt(value) {
        value = parseInt(value.toString());
        if (value <= flash.int.MAX_VALUE && value >= flash.int.MIN_VALUE) {
            return Math.floor(value);
        }
        else if (value > flash.int.MAX_VALUE) {
            var remain = value % flash.INT_TOTAL_NUM;
            if (remain > flash.int.MAX_VALUE) {
                remain = remain - flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        }
        else if (value < flash.int.MIN_VALUE) {
            var remain = value % flash.INT_TOTAL_NUM;
            if (remain < flash.int.MIN_VALUE) {
                remain = remain + flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        }
        else {
            return 0;
        }
        //return Math.floor(value);
    }
    flash.checkInt = checkInt;
    /**
     * 检查uint数值越界
     * */
    function checkUint(value) {
        value = parseInt(value.toString());
        if (value <= flash.uint.MAX_VALUE && value >= flash.uint.MIN_VALUE) {
            return Math.floor(value);
        }
        else if (value > flash.uint.MAX_VALUE) {
            var remain = value % flash.INT_TOTAL_NUM;
            if (remain > flash.uint.MAX_VALUE) {
                remain = remain - flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        }
        else if (value < flash.uint.MIN_VALUE) {
            var remain = value % flash.INT_TOTAL_NUM;
            if (remain < flash.uint.MIN_VALUE) {
                remain = remain + flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        }
        else {
            return 0;
        }
        // return Math.floor(value);
    }
    flash.checkUint = checkUint;
})(flash || (flash = {}));
