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
/**签到 */
var AcSignUpVo = /** @class */ (function (_super_1) {
    __extends(AcSignUpVo, _super_1);
    function AcSignUpVo() {
        return _super_1.call(this) || this;
    }
    /**解析签到数据 */
    AcSignUpVo.prototype.initSignUpData = function (m_signResp) {
        this.m_signResp = m_signResp;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_SIGN_MONTH, null);
    };
    AcSignUpVo.prototype.getSignUpData = function () {
        return this.m_signResp;
    };
    /**可以领取奖励 */
    AcSignUpVo.prototype.hasAward = function () {
        var data = this.m_signResp;
        if (!data)
            return 0;
        var canSign = data.lastTime == 0 || TimerUtils.isOverDay(data.lastTime * 1000) || data.rewardStatus > 0;
        if (canSign)
            return 1;
        for (var i = 0; i < data.notReceiveExtras.length; i++) {
            var rewardId = data.notReceiveExtras[i];
            if (data.receiveExtras.indexOf(rewardId) == -1)
                return 1;
        }
        return 0;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcSignUpVo.prototype.isNeedServerCfg = function () {
        return false;
    };
    /**请求活动内容(子类重写)  */
    AcSignUpVo.prototype.requestActivityInfo = function () {
        WelfareProxy.send_GET_SIGN_UP();
    };
    /**跨天请求 */
    AcSignUpVo.prototype.crossDayRequest = function () {
        this.requestActivityInfo();
    };
    return AcSignUpVo;
}(ActivityVo));
