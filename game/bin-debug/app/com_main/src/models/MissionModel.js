/**
 * 任务类型
 */
var TaskType;
(function (TaskType) {
    TaskType[TaskType["ALL"] = 0] = "ALL";
    /**日常任务 */
    TaskType[TaskType["Daily"] = 1] = "Daily";
    /**主线任务 */
    TaskType[TaskType["MainLine"] = 2] = "MainLine";
    /**培养任务 */
    TaskType[TaskType["Cultivate"] = 3] = "Cultivate";
    /**主城任务 */
    TaskType[TaskType["MainCity"] = 4] = "MainCity";
    /**官职任务 */
    TaskType[TaskType["Office"] = 5] = "Office";
    /**战斗任务 */
    TaskType[TaskType["Battle"] = 6] = "Battle";
    /**活动任务 */
    TaskType[TaskType["Activity"] = 101] = "Activity";
    /**国家任务(魏国) */
    TaskType[TaskType["Country"] = 103] = "Country";
    /**国家任务(循环) */
    TaskType[TaskType["CountryRepeat"] = 104] = "CountryRepeat";
})(TaskType || (TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    /** 进行中*/
    TaskStatus[TaskStatus["PROCESSING"] = 0] = "PROCESSING";
    /** 完成*/
    TaskStatus[TaskStatus["FINISH"] = 1] = "FINISH";
    /** 已领取奖励*/
    TaskStatus[TaskStatus["REWARD"] = 2] = "REWARD";
})(TaskStatus || (TaskStatus = {}));
var LivenssStatus;
(function (LivenssStatus) {
    /** 进行中*/
    LivenssStatus[LivenssStatus["PROCESSING"] = 0] = "PROCESSING";
    /** 完成*/
    LivenssStatus[LivenssStatus["FINISH"] = 1] = "FINISH";
    /** 已领取奖励*/
    LivenssStatus[LivenssStatus["REWARD"] = 2] = "REWARD";
})(LivenssStatus || (LivenssStatus = {}));
var MissionModel = /** @class */ (function () {
    function MissionModel() {
    }
    MissionModel.init = function () {
        this.initData();
        this.parseLivenessCfg();
    };
    MissionModel.initData = function () {
        this.clear();
        this.taskInfoList = {};
        this.taskInfoDic = {};
        this.activeList = {};
    };
    MissionModel.clear = function () {
        this.taskInfoDic = null;
        this.taskInfoList = null;
        this.activeList = null;
    };
    //获取活跃度列表
    MissionModel.getActiveInfoList = function () {
        return this.activeList;
    };
    //获取当前活跃度
    MissionModel.getCurActiveNum = function () {
        return this.activeNum;
    };
    //获取活跃度状态
    MissionModel.getActiveInfoById = function (id) {
        return this.activeList[id];
    };
    //活跃度数据
    MissionModel.initActivaInfo = function (data) {
        if (data.infos) {
            for (var index = 0; index < data.infos.length; index++) {
                var info = data.infos[index];
                this.activeList[info.id] = info;
            }
        }
        this.activeNum = data.liveness;
        com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_UPDATE_LIVENESS, null);
    };
    //登陆获取所有数据
    MissionModel.initPlayerMissionInfoList = function (data) {
        debug("MissionModel: initPlayerMissionInfoList----------------------->>");
        for (var key in data.taskList) {
            //活动任务初始化 不走此协议
            if (data.taskList[key].taskType != TaskType.Activity)
                this.createMissionInfo(data.taskList[key]);
        }
    };
    //活动任务初始化
    MissionModel.initActivityList = function (data) {
        var vo = ActivityModel.getActivityVoById(data.activityId);
        if (vo) {
            for (var _i = 0, _a = data.taskList; _i < _a.length; _i++) {
                var info = _a[_i];
                vo.createMissionInfo(info);
            }
        }
    };
    /**接取任务 */
    MissionModel.addPlayerMissionInfoList = function (data) {
        switch (data.taskData.taskType) {
            case TaskType.MainLine:
            case TaskType.Country:
            case TaskType.CountryRepeat:
            case TaskType.Daily: {
                this.createMissionInfo(data.taskData, true);
                break;
            }
        }
    };
    /**更新任务状态 */
    MissionModel.updateMissionInfos = function (data) {
        for (var _i = 0, _a = data.taskList; _i < _a.length; _i++) {
            var info = _a[_i];
            if (info.taskType == TaskType.Activity) {
                var vo = ActivityModel.getActivityVoById(info.activityId);
                if (vo && vo.taskInfoDic[info.taskId])
                    vo.taskInfoDic[info.taskId].update(info);
            }
            else {
                if (this.taskInfoDic[info.taskId])
                    this.taskInfoDic[info.taskId].update(info);
            }
        }
    };
    //create info
    MissionModel.createMissionInfo = function (data, isEvt) {
        if (isEvt === void 0) { isEvt = false; }
        var baseData = C.TaskConfig[data.taskId];
        if (baseData) {
            if (this.taskInfoDic[data.taskId]) {
                this.taskInfoDic[data.taskId].update(data);
            }
            else {
                var vo = MissionInfoVo.create(data);
                if (vo.taskType == TaskType.MainLine) {
                    //删除旧主线任务
                    this.delTaskByType(TaskType.MainLine);
                }
                else if (vo.taskType == TaskType.Country) {
                    //删除旧国家任务
                    this.delTaskByType(TaskType.Country);
                }
                this.taskInfoDic[vo.taskId] = vo;
                if (!this.taskInfoList[vo.taskType]) {
                    this.taskInfoList[vo.taskType] = [];
                }
                this.taskInfoList[vo.taskType].push(vo);
                //首次创建 任务 存入taskInfoList 后发送创建任务事件(否则 逻辑层不能通过model访问到 vo节点) 首次初始化不需要发送
                if (isEvt)
                    vo.sendCreateConditionEvt();
            }
        }
    };
    /**按类型移除任务 */
    MissionModel.delTaskByType = function (type) {
        //删除主线任务
        var list = this.taskInfoList[type];
        if (!list)
            return;
        for (var i = 0; i < list.length; i++) {
            delete this.taskInfoDic[list[i].taskId];
        }
        delete this.taskInfoList[type];
    };
    /**
     * @param taskId 任务id
     * @param cId
     */
    MissionModel.onClickMissionCell = function (taskId, cId) {
        var vo = this.taskInfoDic[taskId];
        if (vo) {
            var condition = vo.getTaskCondition(cId);
            if (condition.state == TaskStatus.FINISH) {
                MissionProxy.send_MISSION_REWARD(taskId, cId);
            }
            else if (condition.state == TaskStatus.PROCESSING) {
                var cfg = C.TaskConditionConfig[cId];
                FunctionModel.funcToPanel(cfg.turnPanel);
            }
        }
    };
    /**
     * 获取主线任务tips信息
     * [注意 主任务 已修改为 唯一1条处理] 服务器做了过滤逻辑
     *
     * */
    MissionModel.getMainMissionData = function () {
        var list = this.taskInfoList[TaskType.MainLine];
        var data = [];
        if (!list)
            return null;
        for (var i = 0; i < list.length; i++) {
            var condition = list[i].getCurTaskCondition();
            if (condition) {
                return { taskId: list[i].taskId, conditionId: condition.conditionBaseId, type: list[i].taskType, activityId: list[i].activityId };
            }
        }
        return null;
    };
    //领取
    MissionModel.receiveReward = function (data) {
        debug("MissionModel: Receive Mission Reward ----------------------->>State: " + data.taskConditionId);
        var vo;
        if (data.state == 0) {
            if (data.taskType == TaskType.Activity) {
                var acVo = ActivityModel.getActivityVoById(data.activityId);
                if (acVo)
                    vo = acVo.taskInfoDic[data.taskId];
            }
            else {
                vo = this.taskInfoDic[data.taskId];
            }
            if (!vo)
                return;
            vo.setTaskCondtionAward(data.taskConditionId);
            // 0:手动领取
            // 1：自动领取并弹出奖励小条提示
            // 2：自动领取，不弹出奖励小条提示，不显示于任务列表内
            // 3：手动领取任务，弹出奖励小条提示
            // 仅在任务小条可见，任务列表内不可见
            if (vo.cfg.guideTask == 2)
                return;
            var conditionCfg = vo.getConditionCfg(data.taskConditionId);
            if (conditionCfg)
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, conditionCfg.rewardItem);
        }
    };
    //一键领取
    MissionModel.receiveAllReward = function (data) {
        var reward = [];
        for (var i = 0; i < data.taskCondition.length; i++) {
            var condition = data.taskCondition[i];
            var taskId = C.TaskConditionConfig[condition.conditionBaseId].taskId;
            var vo = this.getMissionInfoById(taskId);
            vo.setTaskCondtionAward(condition.conditionBaseId);
            reward = reward.concat(C.TaskConditionConfig[condition.conditionBaseId].rewardItem);
        }
        if (reward.length > 0) {
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, reward);
        }
    };
    /**获得任务列表 */
    MissionModel.getMissionInfoList = function (missionType) {
        if (this.taskInfoList[missionType]) {
            return this.taskInfoList[missionType];
        }
        return [];
    };
    /**获得主任务数据 */
    MissionModel.getMissionInfoById = function (taskId) {
        return this.taskInfoDic[taskId];
    };
    /**获得子任务数据 */
    MissionModel.getConditoinInfoById = function (taskId, cId) {
        var vo = this.taskInfoDic[taskId];
        if (vo) {
            var condition = vo.getTaskCondition(cId);
            return condition;
        }
        return null;
    };
    /**获取完成数量(红点) */
    MissionModel.getFinishMissionByType = function (type) {
        var res = 0;
        if (type == TaskType.ALL) {
            res += this.getFinishMission(TaskType.Daily);
            res += this.getFinishMission(TaskType.MainLine);
            res += this.getFinishMission(TaskType.Cultivate);
            res += this.getFinishMission(TaskType.MainCity);
            return res;
        }
        //有指定类型
        return this.getFinishMission(type);
    };
    MissionModel.getFinishMission = function (type) {
        var res = 0;
        var list = this.getMissionInfoList(type);
        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            res += info.getFinishConditionNum();
        }
        return res;
    };
    /**获取完成任务的条件ID(用于一键领取) */
    MissionModel.getFinishCidByType = function (type) {
        var res = [];
        //有指定类型
        var list = this.getMissionInfoList(type);
        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            res = res.concat(info.getFinishConditionCId());
        }
        return res;
    };
    /**获取可领取活跃度宝箱(红点) */
    MissionModel.getActivityBoxNum = function () {
        var res = 0;
        for (var id in this.activeList) {
            var data = this.activeList[id];
            if (data != null && data != undefined) {
                if (data.state == LivenssStatus.FINISH) {
                    res++;
                }
            }
        }
        return res;
    };
    /**存在子任务 */
    MissionModel.hasMissionById = function (taskId, cId) {
        var condition = this.getConditoinInfoById(taskId, cId);
        if (condition && condition.state != TaskStatus.REWARD) {
            return true;
        }
        return false;
    };
    //=============================================================================================================================================
    //国家任务 begin
    //============================================================================================================================================= 
    /**获得当前进行国家任务 */
    MissionModel.getCountryTask = function () {
        var list = this.taskInfoList[TaskType.Country];
        if (list && list.length > 0) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var info = list_1[_i];
                var res = info.getCurTaskCondition();
                if (res)
                    return res;
            }
        }
        //显示循环任务
        list = this.taskInfoList[TaskType.CountryRepeat];
        if (list && list.length > 0) {
            return list[0].condition[0];
        }
    };
    //=============================================================================================================================================
    //国家任务 end
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //配置表 begin
    //============================================================================================================================================= 
    /**解析活跃度配置表 */
    MissionModel.parseLivenessCfg = function () {
        for (var key in C.LivesRewardConfig) {
            var cfg = C.LivesRewardConfig[key];
            if (unNull(cfg) && cfg.liveness > MissionModel.LIVENESS_MAX) {
                MissionModel.LIVENESS_MAX = cfg.liveness;
            }
        }
    };
    MissionModel.getConditionCfgs = function (taskId) {
        if (!this.conditionCfgs) {
            this.conditionCfgs = {};
            for (var key in C.TaskConditionConfig) {
                var cfg = C.TaskConditionConfig[key];
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
    MissionModel.LIVENESS_MAX = 100;
    MissionModel.activeNum = 0; //当前活跃度
    MissionModel.isFinishNoticeCon = false;
    return MissionModel;
}());
