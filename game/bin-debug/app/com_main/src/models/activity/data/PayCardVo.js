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
/**周卡月卡 */
var PayCardVo = /** @class */ (function (_super_1) {
    __extends(PayCardVo, _super_1);
    function PayCardVo() {
        var _this = _super_1.call(this) || this;
        _this.weekMonthCardInfoDic = {};
        return _this;
        // this.addActNotice();
    }
    /**解析周卡月卡数据 */
    PayCardVo.prototype.initPayCard = function (info) {
        if (info.cardInfo && info.cardInfo.length > 0) {
            for (var i = 0; i < info.cardInfo.length; i++) {
                var data = info.cardInfo[i];
                this.weekMonthCardInfoDic[data.cardType] = data;
            }
        }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_MOON_CARD, null);
    };
    /**领取奖励 */
    PayCardVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        for (var i in data.cardInfo) {
            var payVo = data.cardInfo[i];
            this.weekMonthCardInfoDic[payVo.cardType] = payVo;
        }
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_MOON_CARD, null);
    };
    //获取对应配置表
    PayCardVo.prototype.getRechargeCfgBy = function () {
        // return C.RechargeConfig;
    };
    //获得周卡充值配置
    PayCardVo.prototype.getWeekRechargeCfg = function () {
        return this.rechargeCfgs[0];
    };
    //获得月卡充值配置
    PayCardVo.prototype.getMonthRechargeCfg = function () {
        return this.rechargeCfgs[1];
    };
    //活动配置
    PayCardVo.prototype.getWeekMonthCfg = function (index) {
        if (index === void 0) { index = 0; }
        for (var key in C.ActivityWeekMonthCardConfig) {
            var config = C.ActivityWeekMonthCardConfig[key];
            if (unNull(config) && config.cardType == this.rechargeIds[index])
                return config;
        }
    };
    /** 周卡月卡按钮红点*/
    PayCardVo.prototype.getGrowFundBtnRed = function (key) {
        var state = 1; //进行中
        var infoVo = this.weekMonthCardInfoDic[key];
        if (infoVo) {
            if (infoVo.canReceive) {
                state = 0;
            }
            else {
                state = 2;
            }
        }
        return state;
    };
    /**有可领取奖励 */
    PayCardVo.prototype.hasAward = function () {
        for (var key in this.weekMonthCardInfoDic) {
            var data = this.weekMonthCardInfoDic[key];
            if (data && data.canReceive)
                return 1;
        }
        return 0;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    PayCardVo.prototype.isNeedServerCfg = function () {
        return false;
    };
    /**请求活动内容(子类重写)  */
    PayCardVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_INFO(this.id);
    };
    /**跨天请求 */
    PayCardVo.prototype.crossDayRequest = function () {
        this.requestActivityInfo();
    };
    return PayCardVo;
}(ActivityVo));
