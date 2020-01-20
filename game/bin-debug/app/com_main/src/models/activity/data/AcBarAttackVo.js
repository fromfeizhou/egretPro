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
/**南蛮入侵 */
var AcBarAttackVo = /** @class */ (function (_super_1) {
    __extends(AcBarAttackVo, _super_1);
    function AcBarAttackVo() {
        var _this = _super_1.call(this) || this;
        _this.cityDatas = {};
        _this.evtDatas = [];
        return _this;
    }
    AcBarAttackVo.prototype.parseData = function (evts) {
        if (this.bClose)
            return false;
        for (var i = 0; i < evts.length; i++) {
            this.syncList(evts[i]);
            this.cityDatas[evts[i].cityId] = evts[i];
        }
    };
    /**同步列表 */
    AcBarAttackVo.prototype.syncList = function (data) {
        if (this.bClose)
            return false;
        for (var i = 0; i < this.evtDatas.length; i++) {
            if (this.evtDatas[i].cityId == data.cityId) {
                this.evtDatas[i] = data;
                return;
            }
        }
        this.evtDatas.push(data);
    };
    /**预告检测 */
    AcBarAttackVo.prototype.checkPreIcon = function () {
        if (this.bActivited)
            return;
        if (this.preViewDate > 0 && !this.preNotice) {
            var time = TimerUtils.getServerTimeMill();
            // debug('bar==========>>',Utils.DateUtils.getFormatBySecond(time/1000,2),Utils.DateUtils.getFormatBySecond(this.preViewDate/1000,2),Utils.DateUtils.getFormatBySecond(this.closeDate/1000,2))
            if (time >= this.preViewDate && time < this.closeDate) {
                this.preNotice = true;
            }
        }
    };
    /**攻击准备期间 */
    AcBarAttackVo.prototype.isInAttReady = function () {
        var time = TimerUtils.getServerTimeMill();
        return (time >= this.preViewDate && time < this.openDate);
    };
    /**图标是否可见 */
    AcBarAttackVo.prototype.isOpenIcon = function () {
        if (this.bClose)
            return false;
        var time = TimerUtils.getServerTimeMill();
        return time >= this.preViewDate && time < this.closeDate;
    };
    AcBarAttackVo.prototype.close = function () {
        // this.cityDatas = null;
        // this.evtDatas = null;
        _super_1.prototype.close.call(this);
    };
    /**=====================================================================================
     * 配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcBarAttackVo.prototype.isNeedServerCfg = function () {
        return false;
    };
    /**请求活动内容(子类重写)  */
    AcBarAttackVo.prototype.requestActivityInfo = function () {
        AcBattleProxy.C2S_BARBARIAN_BREAKOUT_EVENT();
    };
    /**是否预告请求 */
    AcBarAttackVo.prototype.isNoticeRequest = function () {
        return true;
    };
    return AcBarAttackVo;
}(ActivityVo));
