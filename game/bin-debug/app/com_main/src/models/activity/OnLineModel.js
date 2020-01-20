/**
 * 处理活动开放开关
 */
var OnLineModel = /** @class */ (function () {
    function OnLineModel() {
    }
    /**模块初始化 */
    OnLineModel.init = function () {
        this.bAwardState = false;
        this.bInitTick = false;
    };
    /**清理 */
    OnLineModel.clear = function () {
        this.removeTick();
    };
    /**活动时间开始定时器 */
    OnLineModel.addTick = function () {
        if (this.bInitTick)
            return;
        this.bInitTick = true;
        Utils.TimerManager.doTimer(60000, 1, this.onTickHandler, this);
    };
    OnLineModel.removeTick = function () {
        Utils.TimerManager.remove(this.onTickHandler, this);
        this.bInitTick = false;
        FunctionModel.removeFunc(FunctionType.ONLINE);
    };
    OnLineModel.onTickHandler = function () {
        this.onlineTime += 60;
        if (this.bAwardState)
            return;
        this.updateAwardState();
    };
    /**添加领奖记录 */
    OnLineModel.addAwardRecord = function (data) {
        if (data.resultCode == 0) {
            this.onlineList = data.awardRecord;
            this.updateAwardState();
            if (this.checkOnlineEnd()) { //判断是否已全部领完直接删除在线图标
                FunctionModel.removeFunc(FunctionType.ONLINE);
                return;
            }
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        }
    };
    /**计算是否有未领取奖励 */
    OnLineModel.updateAwardState = function () {
        var val = false;
        var info = this.getCurCfgInfo();
        if (info) {
            var olTime = info.minutes * 60 - this.onlineTime;
            if (olTime <= 0) {
                val = true;
            }
        }
        if (this.bAwardState != val)
            this.bAwardState = val;
        com_main.EventMgr.dispatchEvent(OnLineEvent.ONLINE_UPDATE, null);
    };
    /**计算是否有未领取奖励 */
    OnLineModel.getAwardState = function () {
        return this.bAwardState;
    };
    /**解析服务器在线数据 */
    OnLineModel.parseData = function (data) {
        this.onlineTime = data.onlineTime;
        this.onlineList = data.awardRecordSet;
        if (this.checkOnlineEnd()) { //判断是否已全部领完直接删除在线图标
            FunctionModel.removeFunc(FunctionType.ONLINE);
            return;
        }
        this.updateAwardState(); //是否可领
        var allTime = this.getCfgAllTime(); //配置全部奖励总的时长（秒）
        if (this.onlineTime <= allTime) {
            this.addTick();
        }
        if (OnLineModel.viewState) {
            Utils.open_view(TASK_UI.POP_ACTIVITY_ONLINE_REWARD);
            OnLineModel.viewState = false;
        }
    };
    /**判断奖励是否领取完毕 */
    OnLineModel.checkOnlineEnd = function () {
        var arr = [];
        var onlineCfg = C.ActivityOnlineTimeRewardConfig;
        for (var k in onlineCfg) {
            arr.push(onlineCfg[k]);
        }
        if (this.onlineList.length && this.onlineList.length > 0) {
            if (this.onlineList.length == arr.length) {
                return true;
            }
        }
        return false;
    };
    /**取在线配置表总时长 */
    OnLineModel.getCfgAllTime = function () {
        var state = 0;
        var onlineCfg = C.ActivityOnlineTimeRewardConfig;
        for (var k in onlineCfg) {
            state += onlineCfg[k].minutes * 60;
        }
        return state;
    };
    /**取在线配置表对应显示数据 */
    OnLineModel.getCurCfgInfo = function () {
        var onlineCfg = C.ActivityOnlineTimeRewardConfig;
        for (var k in onlineCfg) {
            var state = this.getOnlineState(onlineCfg[k].id);
            if (state != ActivityStatus.REWARD) {
                return onlineCfg[k];
            }
        }
        return null;
    };
    /**获取在线奖励是否领取状态 */
    OnLineModel.getOnlineState = function (onlineId) {
        var state = 1;
        if (this.onlineList && this.onlineList.length > 0) {
            for (var k = 0; k < this.onlineList.length; k++) {
                var info = this.onlineList[k];
                if (info != null && info != undefined) {
                    if (onlineId == info) {
                        state = 2;
                    }
                }
            }
        }
        return state;
    };
    return OnLineModel;
}());
