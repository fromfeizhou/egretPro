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
/**转盘 */
var AcTurnTableVo = /** @class */ (function (_super_1) {
    __extends(AcTurnTableVo, _super_1);
    function AcTurnTableVo() {
        return _super_1.call(this) || this;
    }
    /**解析转盘信息数据 */
    AcTurnTableVo.prototype.getInfoData = function (data) {
        this.parseData(data);
    };
    /**点击转盘返回数据 */
    AcTurnTableVo.prototype.parsePalyData = function (data) {
        this.parseData(data);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_TURNTABLE_UPDATE, data.message);
    };
    /**领取奖励 */
    AcTurnTableVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        this.accumulates = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE, null);
    };
    /**解析转盘信息数据 */
    AcTurnTableVo.prototype.parseData = function (data) {
        this.accumulates = [];
        this.account = data.prizeInfo.account;
        this.luncky = data.prizeInfo.luncky;
        this.playNum = data.prizeInfo.playNum;
        this.freeCount = data.prizeInfo.fireNum;
        this.m_activityId = data.activityId;
        for (var i = 0; i < data.prizeInfo.accumulates.length; i++) {
            this.accumulates.push(data.prizeInfo.accumulates[i].accumulate);
        }
    };
    /**=====================================================================================
     * 配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcTurnTableVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**可领奖励 */
    AcTurnTableVo.prototype.hasAward = function () {
        var prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE); //幸运转盘数量
        var prizeCfg = [];
        for (var key in this.configsII) {
            var cfg = this.configsII[key];
            prizeCfg.push(cfg);
        }
        for (var i = 0; i < prizeCfg.length; i++) {
            var vo = prizeCfg[i];
            if (vo) {
                if (this.accumulates.indexOf(vo.id) == -1) {
                    if (this.account >= vo.accumulate) {
                        return 1;
                    }
                }
            }
        }
        if (prizeNum > 0)
            return 1;
        if (this.freeCount > 0)
            return 1;
        return 0;
    };
    /**请求活动内容(子类重写)  */
    AcTurnTableVo.prototype.requestActivityInfo = function () {
        TurnTableProxy.C2S_ACTIVITY_GET_PRIZE_INFO(this.id);
    };
    /**跨天请求 */
    AcTurnTableVo.prototype.crossDayRequest = function () {
        this.requestActivityInfo();
    };
    return AcTurnTableVo;
}(ActivityVo));
