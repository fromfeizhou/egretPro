/**
 * Created by yangsong on 2014/11/23.
 * 百分比类
 */
var Percent = /** @class */ (function () {
    /**
     * 构造函数
     * @param $currentValue 当前值
     * @param $totalValue 总值
     */
    function Percent($currentValue, $totalValue) {
        this.currentValue = $currentValue;
        this.totalValue = $totalValue;
    }
    /**
     * 计算当前百分比
     * @returns {number}
     */
    Percent.prototype.computePercent = function () {
        return this.currentValue / this.totalValue * 100;
    };
    /**
     * 计算当前比例
     * @returns {number}
     */
    Percent.prototype.computeRate = function () {
        return this.currentValue / this.totalValue;
    };
    /**
     * 反转
     * @returns {Percent}
     */
    Percent.prototype.reverse = function () {
        this.currentValue = this.totalValue - this.currentValue;
        return this;
    };
    /**
     * 复制
     * @returns {Percent}
     */
    Percent.prototype.copy = function () {
        return new Percent(this.currentValue, this.totalValue);
    };
    /**
     * 计算百分比反转
     * @returns {number}
     */
    Percent.prototype.computePercentReverse = function () {
        return (this.totalValue - this.currentValue) / this.totalValue * 100;
    };
    /**
     * 计算比例反转
     * @returns {number}
     */
    Percent.prototype.computeRateReverse = function () {
        return (this.totalValue - this.currentValue) / this.totalValue;
    };
    return Percent;
}());
