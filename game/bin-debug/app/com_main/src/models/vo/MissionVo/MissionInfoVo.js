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
/**
 * 任务基本信息
 *
 */
var MissionInfoVo = /** @class */ (function (_super_1) {
    __extends(MissionInfoVo, _super_1);
    function MissionInfoVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    MissionInfoVo.create = function (body) {
        var obj = new MissionInfoVo(body);
        return obj;
    };
    MissionInfoVo.prototype.onDestroy = function () {
    };
    MissionInfoVo.prototype.init = function (body) {
        this.parseKeys(body);
        this.initCondition(body);
        this.conditionDic = {};
        for (var i = 0; i < this.condition.length; i++) {
            var info = this.condition[i];
            this.conditionDic[info.conditionBaseId] = info;
        }
        // this.checkAuto();
    };
    /**初始化子任务 */
    MissionInfoVo.prototype.initCondition = function (body) {
        if (this.taskLink) {
            //线性任务初始化
            this.condition = [];
            var conditonCfgs = this.getConditionCfgs();
            if (this.taskLink.rewardOrderType == 0) {
                //领奖顺序固定
                for (var i = this.taskLink.rewardOrderLink; i < conditonCfgs.length; i++) {
                    var cfg = conditonCfgs[i];
                    var state = i >= this.taskLink.overOrder ? TaskStatus.PROCESSING : TaskStatus.FINISH;
                    var process = state == TaskStatus.FINISH ? cfg.paramValue : this.taskLink.count;
                    if (cfg.order > this.taskLink.overOrder)
                        process = this.taskLink.nextCount;
                    this.condition.push({ conditionBaseId: cfg.id, maxCount: cfg.paramValue, count: process, order: cfg.order, state: state });
                }
            }
            else {
                //领奖无序
                for (var i = 0; i < conditonCfgs.length; i++) {
                    var cfg = conditonCfgs[i];
                    var state = i >= this.taskLink.overOrder ? TaskStatus.PROCESSING : TaskStatus.FINISH;
                    var process = state == TaskStatus.PROCESSING ? this.taskLink.count : cfg.paramValue;
                    if (state == TaskStatus.FINISH) {
                        if (this.matchAward(cfg.order, this.taskLink.rewardOrder))
                            state = TaskStatus.REWARD;
                    }
                    //未领奖任务初始化
                    if (cfg.order > this.taskLink.overOrder)
                        process = this.taskLink.nextCount;
                    this.condition.push({ conditionBaseId: cfg.id, maxCount: cfg.paramValue, count: process, order: cfg.order, state: state });
                }
            }
        }
        else {
            this.condition = body.condition;
            for (var _i = 0, _a = this.condition; _i < _a.length; _i++) {
                var info = _a[_i];
                info.maxCount = this.getConditionCfg(info.conditionBaseId).paramValue;
            }
        }
    };
    /**是否领取 */
    MissionInfoVo.prototype.matchAward = function (order, rewardIds) {
        order = order - 1; //order 由1开始
        var index = Math.floor(order / 31);
        if (index >= rewardIds.length)
            return;
        var row = 30 - (order % 30);
        return (1 << row) & rewardIds[index];
    };
    /**更新数据 */
    MissionInfoVo.prototype.update = function (body) {
        this.parseKeys(body);
        if (this.taskLink) {
            //更新链式任务
            this.updateOrder();
        }
        else {
            //更新常规任务
            this.updateConditoin(body);
        }
        // this.checkAuto();
    };
    /**常规任务更新 */
    MissionInfoVo.prototype.updateConditoin = function (body) {
        for (var i = 0; i < body.condition.length; i++) {
            var info = body.condition[i];
            var localData = this.conditionDic[info.conditionBaseId];
            if (localData) {
                if (localData.count != info.count || localData.state != info.state) {
                    localData.count = info.count;
                    localData.state = info.state;
                    var param = { taskId: this.taskId, conditionId: info.conditionBaseId, type: this.taskType, activityId: this.activityId };
                    com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_INFO, param);
                }
            }
            else {
                //主线任务 单条codition发送 有机会使用
                this.conditionDic[info.conditionBaseId] = info;
                info.maxCount = this.getConditionCfg(info.conditionBaseId).paramValue;
                var param = { taskId: this.taskId, conditionId: info.conditionBaseId, type: this.taskType, activityId: this.activityId };
                com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_ADD_INFO, param);
            }
            /**新手条件 */
            if (this.taskType == TaskType.MainLine) {
                GuideModel.sendGuideRecordByTask(info.conditionBaseId, info.state);
            }
        }
    };
    /**更新order */
    MissionInfoVo.prototype.updateOrder = function () {
        if (this.taskType == TaskType.MainLine || this.taskType == TaskType.Country || this.taskType == TaskType.CountryRepeat)
            return;
        for (var _i = 0, _a = this.condition; _i < _a.length; _i++) {
            var info = _a[_i];
            var isEvt = false;
            if (info.state == TaskStatus.PROCESSING)
                if (info.order <= this.taskLink.overOrder) {
                    info.state = TaskStatus.FINISH;
                    info.count = info.maxCount;
                    isEvt = true;
                }
                else {
                    var process = this.taskLink.count;
                    if (info.order > this.taskLink.overOrder)
                        process = this.taskLink.nextCount;
                    info.count = process;
                }
            var param = { taskId: this.taskId, conditionId: info.conditionBaseId, type: this.taskType, activityId: this.activityId };
            com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_INFO, param);
        }
    };
    /**发送创建任务对象事件  （model 创建vo后调用 保证数据存在model列表） */
    MissionInfoVo.prototype.sendCreateConditionEvt = function () {
        for (var i = 0; i < this.condition.length; i++) {
            var param = { taskId: this.taskId, conditionId: this.condition[i].conditionBaseId, type: this.taskType, activityId: this.activityId };
            com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_ADD_INFO, param);
            /**新手条件 */
            if (this.taskType == TaskType.MainLine) {
                GuideModel.sendGuideRecordByTask(param.conditionId, this.condition[i].state);
            }
        }
    };
    /**解析服务器协议 */
    MissionInfoVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, MissionInfoVo.AttriKey);
    };
    /**获得任务对象 */
    MissionInfoVo.prototype.getTaskCondition = function (cId) {
        var info = this.conditionDic[cId];
        return info;
    };
    /**获取任务下面的子列表 */
    MissionInfoVo.prototype.getTaskConditionList = function () {
        var res = [];
        for (var key in this.conditionDic) {
            var conditon = this.conditionDic[key];
            res.push(conditon);
        }
        return res;
    };
    /**修改任务状态(已领奖 领取奖励) */
    MissionInfoVo.prototype.setTaskCondtionAward = function (cId) {
        var info = this.getTaskCondition(cId);
        if (!info)
            return;
        info.state = TaskStatus.REWARD;
        if (this.taskType != TaskType.Daily && this.taskType != TaskType.Activity && this.taskType != TaskType.CountryRepeat) {
            //非日常任务完成 活动任务 发送删除消息
            var param = { taskId: this.taskId, conditionId: cId, type: this.taskType, activityId: this.activityId };
            //删除任务节点数据
            this.delRewardCodition(cId);
            com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_DELETE_INFO, param);
            var newTask = this.getPriorityTask();
            if (newTask) {
                var param_1 = { taskId: this.taskId, conditionId: newTask.conditionBaseId, type: this.taskType, activityId: this.activityId };
                com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_ADD_INFO, param_1);
            }
        }
        else {
            //日常任务发送 更新消息
            var param = { taskId: this.taskId, conditionId: cId, type: this.taskType, activityId: this.activityId };
            com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_INFO, param);
        }
        /**新手条件 */
        if (this.taskType == TaskType.MainLine) {
            GuideModel.sendGuideRecordByTask(cId, info.state);
        }
    };
    /**获得任务状态 */
    MissionInfoVo.prototype.getTaskConditionState = function (cId) {
        var info = this.getTaskCondition(cId);
        if (info)
            return info.state;
        return 0;
    };
    /**获取当前优先级最高任务 */
    MissionInfoVo.prototype.getPriorityTask = function () {
        var conditon = null;
        for (var key in this.conditionDic) {
            var tmp = this.conditionDic[key];
            if (tmp.state == TaskStatus.FINISH) {
                return tmp;
            }
            if (!conditon && tmp.state == TaskStatus.PROCESSING) {
                conditon = tmp;
            }
        }
        return conditon;
    };
    /**主线任务显示 */
    MissionInfoVo.prototype.getCurTaskCondition = function () {
        for (var key in this.conditionDic) {
            var conditon = this.conditionDic[key];
            if (conditon.state != TaskStatus.REWARD) {
                return conditon;
            }
        }
    };
    /**获取完成节点数量(红点计数) */
    MissionInfoVo.prototype.getFinishConditionNum = function () {
        var res = 0;
        for (var key in this.conditionDic) {
            var conditon = this.conditionDic[key];
            if (conditon && conditon.state == TaskStatus.FINISH) {
                res++;
            }
        }
        return res;
    };
    /**获取完成节点全部条件ID(用于一键领取) */
    MissionInfoVo.prototype.getFinishConditionCId = function () {
        var res = [];
        for (var key in this.conditionDic) {
            var conditon = this.conditionDic[key];
            if (conditon && conditon.state == TaskStatus.FINISH) {
                res.push(conditon.conditionBaseId);
            }
        }
        return res;
    };
    /**删除已领奖任务节点 */
    MissionInfoVo.prototype.delRewardCodition = function (cId) {
        delete this.conditionDic[cId];
    };
    Object.defineProperty(MissionInfoVo.prototype, "cfg", {
        /**检查自动领奖 */
        // private checkAuto() {
        // 	/**新手条件 */
        // 	if (this.taskType == TaskType.MainLine && this.isAuto()) {
        // 		for (let key in this.conditionDic) {
        // 			let conditon = this.conditionDic[key];
        // 			if (conditon && conditon.state == TaskStatus.FINISH) {
        // 				MissionProxy.send_MISSION_REWARD(this.taskId, conditon.conditionBaseId);
        // 			}
        // 		}
        // 	}
        // }
        // /**自动领奖 */
        // private isAuto() {
        // 	return this.cfg.guideTask == 1 || this.cfg.guideTask == 2;
        // }
        /**获取配置表 */
        get: function () {
            if (!this.m_taskcfg) {
                if (this.taskType == TaskType.Activity) {
                    var vo = ActivityModel.getActivityVoById(this.activityId);
                    if (vo)
                        this.m_taskcfg = vo.configs[this.taskId];
                }
                else {
                    this.m_taskcfg = C.TaskConfig[this.taskId];
                }
            }
            return this.m_taskcfg;
        },
        enumerable: true,
        configurable: true
    });
    /**获得所有子任务配置 */
    MissionInfoVo.prototype.getConditionCfgs = function () {
        if (this.taskType == TaskType.Activity) {
            var vo = ActivityModel.getActivityVoById(this.activityId);
            if (vo)
                return vo.getConditionCfgs(this.taskId);
        }
        else {
            return MissionModel.getConditionCfgs(this.taskId);
        }
    };
    /**获得所有子任务配置 */
    MissionInfoVo.prototype.getConditionCfg = function (id) {
        if (this.taskType == TaskType.Activity) {
            var vo = ActivityModel.getActivityVoById(this.activityId);
            if (vo)
                return vo.configsII[id];
        }
        else {
            return C.TaskConditionConfig[id];
        }
    };
    /**属性值 */
    MissionInfoVo.AttriKey = ["taskId", "taskType", "activityId", "taskLink"];
    return MissionInfoVo;
}(BaseClass));
