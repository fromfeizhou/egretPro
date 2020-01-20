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
/**跨服战 */
var AcCrossServerVo = /** @class */ (function (_super_1) {
    __extends(AcCrossServerVo, _super_1);
    function AcCrossServerVo() {
        return _super_1.call(this) || this;
    }
    /**预告检测 */
    AcCrossServerVo.prototype.checkPreIcon = function () {
        if (this.bActivited)
            return;
        if (this.preViewDate > 0 && !this.preNotice) {
            var time = TimerUtils.getServerTimeMill();
            // debug('bar==========>>',Utils.DateUtils.getFormatB,2),Utils.DateUtils.getFormatBySecond(this.preViewDate/1000,2),Utils.DateUtils.getFormatBySecond(this.closeDate/1000,2))
            if (time > this.preViewDate && time < this.closeDate) {
                this.preNotice = true;
            }
        }
    };
    /**攻击准备期间 */
    AcCrossServerVo.prototype.isInAttReady = function () {
        var time = TimerUtils.getServerTimeMill();
        return (time >= this.preViewDate && time <= this.openDate);
    };
    /**图标是否可见 */
    AcCrossServerVo.prototype.isOpenIcon = function () {
        if (this.bClose)
            return false;
        var time = TimerUtils.getServerTimeMill();
        return time > this.preViewDate && time < this.closeDate;
    };
    AcCrossServerVo.prototype.close = function () {
        _super_1.prototype.close.call(this);
    };
    /**=====================================================================================
     * 配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcCrossServerVo.prototype.isNeedServerCfg = function () {
        return false;
    };
    /**请求活动内容(子类重写)  */
    AcCrossServerVo.prototype.requestActivityInfo = function () {
    };
    /**是否预告请求 */
    AcCrossServerVo.prototype.isNoticeRequest = function () {
        return true;
    };
    return AcCrossServerVo;
}(ActivityVo));
