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
/**新武将拜访活动 */
var AcNewGenVisVo = /** @class */ (function (_super_1) {
    __extends(AcNewGenVisVo, _super_1);
    function AcNewGenVisVo() {
        return _super_1.call(this) || this;
    }
    /**新武将信息 */
    AcNewGenVisVo.prototype.initNewGenVis = function (data) {
        this.m_limitStatu = data.generalBagStatu;
        this.m_todayCostKeepsake = data.todayCostKeepsake;
        this.m_boxReardRecord = data.boxReardRecord;
        this.parseChooseRewardList(data.chooseRewardList);
        this.m_visitCost = this.getNewGenRewordCfg().visitCost[0];
        this.m_visitCost10 = this.getNewGenRewordCfg().visitCost10[0];
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_INFO, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    };
    /**拜访返回 */
    AcNewGenVisVo.prototype.parseVisInfo = function (data) {
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        this.m_todayCostKeepsake = data.todayCostKeepsake;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_VISIT_REWARD, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    };
    /**选择奖励返回 */
    AcNewGenVisVo.prototype.parseChangeReward = function (data) {
        this.parseChooseRewardList(data.items);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, null);
    };
    /**领取宝箱返回 */
    AcNewGenVisVo.prototype.parseGetBox = function (data) {
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        this.m_boxReardRecord = data.boxReardRecord;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_BOX_REWARD, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    };
    AcNewGenVisVo.prototype.parseChooseRewardList = function (data) {
        var list = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var info = data_1[_i];
            list.push({ itemId: info.key, count: info.value });
        }
        this.m_chooseRewardList = list;
    };
    //限购礼包状态更新
    AcNewGenVisVo.prototype.setLimitStatu = function (s) {
        this.m_limitStatu = s;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_LIM, null);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    };
    AcNewGenVisVo.prototype.getLimitStatu = function () {
        return this.m_limitStatu;
    };
    //购买限购礼包
    AcNewGenVisVo.prototype.bugLimit = function (data) {
        this.setLimitStatu(data.generalBagStatu);
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
    };
    AcNewGenVisVo.prototype.getChooseList = function () {
        return this.m_chooseRewardList;
    };
    AcNewGenVisVo.prototype.getCostKeepsake = function () {
        return this.m_todayCostKeepsake;
    };
    AcNewGenVisVo.prototype.getBoxReardRecord = function () {
        return this.m_boxReardRecord;
    };
    /**获取信物id */
    AcNewGenVisVo.prototype.getVisCost = function () {
        return this.m_visitCost;
    };
    /**拜访一次消耗信物数 */
    AcNewGenVisVo.prototype.getVisCost10 = function () {
        return this.m_visitCost10;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcNewGenVisVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcNewGenVisVo.prototype.requestActivityInfo = function () {
        ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_INFO(this.id);
    };
    /** 获取ActivityNewGeneralReward配置表  */
    AcNewGenVisVo.prototype.getNewGenRewordCfg = function () {
        for (var i in this.configs) {
            return this.configs[i];
        }
    };
    AcNewGenVisVo.prototype.getKeepsakeRewardCfg = function () {
        if (!this.m_sortList) {
            this.m_sortList = [];
            for (var i in this.configsII) {
                this.m_sortList.push(this.configsII[i]);
            }
            this.m_sortList.sort(function (a, b) {
                return a.id < b.id ? 0 : 1;
            });
        }
        return this.m_sortList;
    };
    /**=====================================================================================
     * 数据配置相关 end
     * =====================================================================================
     */
    AcNewGenVisVo.prototype.setClick = function () {
        this.m_isClick = true;
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_NEW_GEN_VIS_RED, null);
    };
    //信物红点
    AcNewGenVisVo.prototype.newGenVisRedState = function () {
        if (!this.m_isClick) {
            return true;
        }
        if (PropModel.getPropNum(this.m_visitCost.itemId) >= this.m_visitCost.count) {
            return true;
        }
        var cfg = this.getKeepsakeRewardCfg();
        for (var i = 0; i <= 3; i++) {
            if (this.m_todayCostKeepsake >= cfg[i].keepsakeCount && this.m_boxReardRecord.indexOf(i + 1) == -1) {
                return true;
            }
        }
        return false;
    };
    //限购红点
    AcNewGenVisVo.prototype.newGenLimRedS = function () {
        if (this.m_limitStatu == 1) {
            return true;
        }
        return false;
    };
    return AcNewGenVisVo;
}(ActivityVo));
