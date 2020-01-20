/**
 * Created by chenpeng on 2015/10/21.
 */
module flash {
    export class int {
        /**
         * [静态] 可表示的最大 32 位带符号整数为 2,147,483,647。
         * @type {number}
         */
        public static MAX_VALUE: number = 2147483647;
        /**
         * [静态] 可表示的最小 32 位带符号整数为 -2,147,483,648。
         * @type {number}
         */
        public static MIN_VALUE: number = -2147483648;

        //private $num:number = 0;
        ///**
        // * 构造函数；创建新的 int 对象。
        // * @param num:Object — 要创建的 int 对象的数值，或者要转换为数字的值。如果未提供 value，则默认值为 0。
        // */
        //constructor(num = 0){
        //    num = checkInt(num);
        //    this.$num = num;
        //}
        //
        ///**
        // * 返回数字的字符串表示形式（采用指数表示法）。字符串在小数点前面包含一位，在小数点后面最多包含 20 位（在 fractionDigits 参数中指定）。
        // * @param fractionDigits:number — 介于 0 和 20（含）之间的整数，表示所需的小数位数。
        // * 引发 RangeError — 如果 fractionDigits 参数不在 0 到 20 的范围内，则会引发异常。
        // * @returns {string}
        // */
        //public toExponential(fractionDigits:number):string{
        //    return this.$num.toExponential(fractionDigits);
        //}
        ///**
        // * 返回数字的字符串表示形式（采用定点表示法）。定点表示法是指字符串的小数点后面包含特定的位数（在 fractionDigits 参数中指定）。fractionDigits 参数的有效范围为 0 到 20。如果指定的值在此范围外，则会引发异常。
        // * @param fractionDigits:number — 介于 0 和 20（含）之间的整数，表示所需的小数位数。
        // */
        //public toFixed(fractionDigits:number):string{
        //    return this.$num.toFixed(fractionDigits);
        //}
        //
        ///**
        // * 返回数字的字符串表示形式（采用指数表示法或定点表示法）。
        // * @param precision:number — 介于 1 和 21（含）之间的整数，表示结果字符串中所需的位数。
        // */
        //public toPrecision(precision:number):string{
        //    return this.$num.toPrecision(precision);
        //}
        //
        ///**
        // * 返回 int 对象的字符串表示形式。
        // * @param radix:number — 指定要用于数字到字符串的转换的基数（从 2 到 36）。如果未指定 radix 参数，则默认值为 10。
        // */
        //public toString(radix:number = 10):string{
        //    return this.$num.toString(radix);
        //}
    }

    export var INT_TOTAL_NUM: number = 4294967296;

    /**
     * 检查int数值越界
     * */
    export function checkInt(value: number): number {
        value = parseInt(value.toString());
        if (value <= flash.int.MAX_VALUE && value >= flash.int.MIN_VALUE) {
            return Math.floor(value);
        } else if (value > flash.int.MAX_VALUE) {
            var remain: number = value % flash.INT_TOTAL_NUM;
            if (remain > flash.int.MAX_VALUE) {
                remain = remain - flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        } else if (value < flash.int.MIN_VALUE) {
            var remain: number = value % flash.INT_TOTAL_NUM;
            if (remain < flash.int.MIN_VALUE) {
                remain = remain + flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        } else {
            return 0;
        }
        //return Math.floor(value);
    }

    /**
     * 检查uint数值越界
     * */
    export function checkUint(value: number): number {
        value = parseInt(value.toString());
        if (value <= flash.uint.MAX_VALUE && value >= flash.uint.MIN_VALUE) {
            return Math.floor(value);
        } else if (value > flash.uint.MAX_VALUE) {
            var remain: number = value % flash.INT_TOTAL_NUM;
            if (remain > flash.uint.MAX_VALUE) {
                remain = remain - flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        } else if (value < flash.uint.MIN_VALUE) {
            var remain: number = value % flash.INT_TOTAL_NUM;
            if (remain < flash.uint.MIN_VALUE) {
                remain = remain + flash.INT_TOTAL_NUM;
            }
            return Math.floor(remain);
        } else {
            return 0;
        }
        // return Math.floor(value);
    }
}