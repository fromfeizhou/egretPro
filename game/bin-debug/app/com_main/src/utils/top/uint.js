/**
 * Created by chenpeng on 2015/10/21.
 */
var flash;
(function (flash) {
    var uint = /** @class */ (function () {
        function uint() {
        }
        /**
         *[静态] 可表示的最大 32 位无符号整数为 4,294,967,295。
         * @type {number}
         */
        uint.MAX_VALUE = 4294967295;
        /**
         *[静态] 可表示的最小无符号整数为 0。
         * @type {number}
         */
        uint.MIN_VALUE = 0;
        return uint;
    }());
    flash.uint = uint;
})(flash || (flash = {}));
