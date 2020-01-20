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
/**任务活动 */
var AcTaskVo = /** @class */ (function (_super_1) {
    __extends(AcTaskVo, _super_1);
    function AcTaskVo() {
        var _this = _super_1.call(this) || this;
        _this.taskInfoDic = {};
        return _this;
    }
    AcTaskVo.prototype.createMissionInfo = function (data) {
        if (this.taskInfoDic[data.taskId]) {
            this.taskInfoDic[data.taskId].update(data);
        }
        else {
            var vo = MissionInfoVo.create(data);
            this.taskInfoDic[vo.taskId] = vo;
        }
    };
    /**获得红点 */
    AcTaskVo.prototype.getDayRedState = function (day, taskId) {
        var openDay = Math.ceil((TimerUtils.getServerTimeMill() - this.openDate) / 86400000);
        if (taskId) {
            for (var key in this.taskInfoDic) {
                var vo = this.taskInfoDic[key];
                if (taskId == vo.taskId && openDay - vo.cfg.rewardDay >= 0 && vo.getFinishConditionNum() > 0)
                    return 1;
            }
            return 0;
        }
        else {
            day = day ? day : 0;
            for (var key in this.taskInfoDic) {
                var vo = this.taskInfoDic[key];
                if (vo.cfg.rewardDay == day || day == 0) {
                    if (!taskId || taskId == vo.taskId) {
                        if (openDay - vo.cfg.rewardDay >= 0 && vo.getFinishConditionNum() > 0)
                            return 1;
                    }
                }
            }
            return 0;
        }
    };
    /**获得日常任务红点 */
    AcTaskVo.prototype.getRedState = function (taskId) {
        for (var key in this.taskInfoDic) {
            var vo = this.taskInfoDic[key];
            if (taskId) {
                if (taskId == vo.taskId && vo.getFinishConditionNum() > 0)
                    return 1;
            }
            else {
                if (vo.getFinishConditionNum() > 0)
                    return 1;
            }
        }
        return 0;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**是否需要读取服务器配置(子类重写) */
    AcTaskVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcTaskVo.prototype.requestActivityInfo = function () {
        MissionProxy.C2S_ACTIVITY_TASK_LIST(this.id);
    };
    AcTaskVo.prototype.getConditionCfgs = function (taskId) {
        if (!this.conditionCfgs) {
            this.conditionCfgs = {};
            for (var key in this.configsII) {
                var cfg = this.configsII[key];
                if (unNull(cfg)) {
                    if (!this.conditionCfgs[cfg.taskId])
                        this.conditionCfgs[cfg.taskId] = [];
                    this.conditionCfgs[cfg.taskId].push(cfg);
                }
            }
            for (var key in this.conditionCfgs) {
                if (this.conditionCfgs[key])
                    this.conditionCfgs[key].sort(function (a, b) { return a.id - b.id; });
            }
        }
        return this.conditionCfgs[taskId];
    };
    return AcTaskVo;
}(ActivityVo));
