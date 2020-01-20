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
/**襄阳战 */
var AcEmperorBattleVO = /** @class */ (function (_super_1) {
    __extends(AcEmperorBattleVO, _super_1);
    function AcEmperorBattleVO() {
        var _this = _super_1.call(this) || this;
        /**襄阳战个人战功奖励列表 */
        _this.m_pKillAwardList = [];
        _this._isJoin = false;
        _this.m_pKillAwardList = [];
        AcEmperorBattleVO.MAX_KILL_AWARD = C.XiangyangPlayerBattleRewardConfig ? Utils.objectLenght(C.XiangyangPlayerBattleRewardConfig) : 0;
        _this.m_pCountryAwardList = [];
        return _this;
    }
    AcEmperorBattleVO.prototype.init = function (body) {
        _super_1.prototype.init.call(this, body);
        ActivityModel.addActivityVo(this);
        this.calcuResetTime();
    };
    AcEmperorBattleVO.prototype.parseData = function (data) {
        this.calcuResetTime();
        this.m_data = data;
        this.commRank = data.commRank;
        this.receiveId = data.receiveId;
        this.warCount = data.warCount;
        this.clearCountryAwrdList();
        this.updateCountryAward(data.wei, CountryType.WEI);
        this.updateCountryAward(data.shu, CountryType.SHU);
        this.updateCountryAward(data.wu, CountryType.WU);
        this.updateKillAward(data.receiveId);
    };
    /**攻击准备期间 */
    AcEmperorBattleVO.prototype.isInAttReady = function () {
        var curTime = TimerUtils.getServerTimeMill();
        // let readyTime: number = ConstUtil.getValue(IConstEnum.XIANGYANG_FIGHT_TIME) * 1000;
        return curTime >= this.preViewDate && curTime <= this.openDate;
    };
    /**战斗期 */
    AcEmperorBattleVO.prototype.isInBattleTime = function () {
        var curTime = TimerUtils.getServerTimeMill();
        return curTime >= this.preViewDate && curTime <= this.closeDate;
    };
    AcEmperorBattleVO.prototype.close = function () {
        this.m_pKillAwardList = null;
        this.m_pCountryAwardList = null;
        _super_1.prototype.close.call(this);
    };
    /**所有玩家排行榜数据 */
    AcEmperorBattleVO.prototype.getRankData = function () {
        return this.commRank;
    };
    AcEmperorBattleVO.prototype.getWarCountReceiveId = function () {
        return [this.warCount, this.receiveId];
    };
    /**所有单个国家玩家排行榜数据 */
    AcEmperorBattleVO.prototype.getSingleRankData = function (countryId) {
        var list = [];
        var listRank = this.getRankData();
        if (isNull(listRank))
            return list;
        listRank.forEach(function (v, i, a) {
            if (v.playerHead.countryId == countryId) {
                list.push(v);
            }
        });
        return list;
    };
    /**获取玩家个人的排行榜数据 */
    AcEmperorBattleVO.prototype.getPlayerRankData = function () {
        var data = null;
        var listRank = this.getSingleRankData(RoleData.countryId);
        listRank.forEach(function (v, i, a) {
            if (v.playerHead.playerId === RoleData.playerId) {
                data = v;
            }
        });
        return data;
    };
    /**检查是否开启 */
    AcEmperorBattleVO.prototype.checkIsOpen = function () {
        _super_1.prototype.checkIsOpen.call(this);
        if (this.bActivited)
            WorldModel.openTick();
    };
    /**图标是否可见 */
    AcEmperorBattleVO.prototype.isOpenIcon = function () {
        return true;
    };
    /**预告倒计时(ms) */
    AcEmperorBattleVO.prototype.getPreTime = function () {
        return this.preViewDate - TimerUtils.getServerTimeMill();
    };
    /**是否预告请求 */
    AcEmperorBattleVO.prototype.isNoticeRequest = function () {
        return true;
    };
    /**本地修正活动时间 */
    AcEmperorBattleVO.prototype.calcuResetTime = function () {
        if (TimerUtils.getServerTimeMill() < this.closeDate)
            return;
        var timeDelay = 7 * 3600 * 24 * 1000;
        this.preViewDate = this.preViewDate + timeDelay;
        this.openDate = this.openDate + timeDelay;
        this.closeDate = this.closeDate + timeDelay;
    };
    /**弹称帝面板 */
    AcEmperorBattleVO.prototype.emperorCoronation = function (info) {
        // Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION, info);
        ScenePopQueWnd.addEmperorNotice(info);
    };
    /**更新襄阳战个人战功奖励领取记录 */
    AcEmperorBattleVO.prototype.updateKillAward = function (id, single) {
        if (single === void 0) { single = false; }
        if (isNull(id) || id < 1)
            return;
        if (isNull(this.m_pKillAwardList))
            this.m_pKillAwardList = [];
        if (single) {
            if (this.m_pKillAwardList.indexOf(id) == -1)
                this.m_pKillAwardList.push(id);
        }
        else {
            for (var i = 1; i <= id; i++) {
                if (this.m_pKillAwardList.indexOf(i) == -1)
                    this.m_pKillAwardList.push(i);
            }
        }
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.EXPLOIT_AWARD_UPDATE, null);
    };
    /**判断当前个人战功奖励是否可以领取 */
    AcEmperorBattleVO.prototype.checkKillAward = function (curPro, isReceive) {
        if (isReceive === void 0) { isReceive = false; }
        if (isReceive) {
            if (this.m_pKillAwardList.indexOf(curPro) == -1)
                return true;
            return false;
        }
        var xyConfig = C.XiangyangPlayerBattleRewardConfig[curPro];
        if (isNull(xyConfig))
            return false;
        var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
        var _a = vo.getWarCountReceiveId(), warCount = _a[0], receiveId = _a[1];
        if (isNull(warCount))
            return false;
        if (warCount < xyConfig.count)
            return false;
        if (this.m_pKillAwardList.indexOf(curPro) != -1)
            return false;
        if (curPro > 1 && this.m_pKillAwardList.indexOf(curPro - 1) == -1)
            return false;
        return true;
    };
    /**更新领取宝箱状态 */
    AcEmperorBattleVO.prototype.checkKillAwardBoxState = function (curPro) {
        if (this.m_pKillAwardList.indexOf(curPro) == -1)
            return false;
        return true;
    };
    /**奖励弹框显示 */
    AcEmperorBattleVO.prototype.receiveKillReward = function (data) {
        if (data.state == 0) {
            var cfg = C.XiangyangPlayerBattleRewardConfig[data.receiveId];
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);
            }
        }
    };
    AcEmperorBattleVO.prototype.updateCountryAward = function (value, countryId) {
        var awList = { countryId: countryId, value: value };
        this.m_pCountryAwardList.push(awList);
    };
    /**获取已经领取的宝箱列表 */
    AcEmperorBattleVO.prototype.getDoneKillAwardList = function () {
        return this.m_pKillAwardList;
    };
    /**获取国家战功列表 */
    AcEmperorBattleVO.prototype.getCountryAwardList = function () {
        return this.m_pCountryAwardList;
    };
    /**清除列表 */
    AcEmperorBattleVO.prototype.clearCountryAwrdList = function () {
        this.m_pCountryAwardList = [];
    };
    /**检测个人挑战奖励红点 */
    AcEmperorBattleVO.prototype.checkBattleRewardRedPoint = function () {
        if (this.svReceiveId && this.svReceiveId > 0) {
            if (this.checkKillAward(this.svReceiveId, true))
                return 1;
            return 0;
        }
        for (var curPro = 1; curPro <= AcEmperorBattleVO.MAX_KILL_AWARD; curPro++) {
            if (this.checkKillAward(curPro))
                return 1;
        }
        return 0;
    };
    Object.defineProperty(AcEmperorBattleVO.prototype, "isJoin", {
        get: function () {
            return this._isJoin;
        },
        set: function (v) {
            this._isJoin = v;
        },
        enumerable: true,
        configurable: true
    });
    /**=====================================================================================
     * 配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcEmperorBattleVO.prototype.isNeedServerCfg = function () {
        return false;
    };
    /**请求活动内容(子类重写)  */
    AcEmperorBattleVO.prototype.requestActivityInfo = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.WORLD_MAP))
            return;
        AcBattleProxy.C2S_XIANGYANG_INFO();
        WorldProxy.m_pVersion = null;
    };
    AcEmperorBattleVO.MAX_KILL_AWARD = 0;
    return AcEmperorBattleVO;
}(ActivityVo));
