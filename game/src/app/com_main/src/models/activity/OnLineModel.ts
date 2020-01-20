/**
 * 处理活动开放开关
 */
class OnLineModel {
    public static onlineTime: number;//在线时长(秒)
    public static onlineList: number[];//在线领奖记录


    public static viewState: boolean;    //界面是否打开状态
    public static bAwardState: boolean;    //能否领取在线奖励
    public static bInitTick: boolean;    //定时器
    /**模块初始化 */
    public static init() {
        this.bAwardState = false;
        this.bInitTick = false;
    }
    /**清理 */
    public static clear() {
        this.removeTick();
    }

    /**活动时间开始定时器 */
    public static addTick() {
        if (this.bInitTick) return;
        this.bInitTick = true;
        Utils.TimerManager.doTimer(60000, 1, this.onTickHandler, this);
    }

    private static removeTick() {
        Utils.TimerManager.remove(this.onTickHandler, this);
        this.bInitTick = false;
        FunctionModel.removeFunc(FunctionType.ONLINE);
    }

    private static onTickHandler() {
        this.onlineTime += 60;
        if (this.bAwardState) return;
        this.updateAwardState();
    }

    /**添加领奖记录 */
    public static addAwardRecord(data: gameProto.IS2C_ONLINE_REWARD) {
        if (data.resultCode == 0) {
            this.onlineList = data.awardRecord;
            this.updateAwardState();
            if (this.checkOnlineEnd()) {//判断是否已全部领完直接删除在线图标
                FunctionModel.removeFunc(FunctionType.ONLINE);
                return;
            }
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        }
    }

    /**计算是否有未领取奖励 */
    private static updateAwardState() {
        let val = false;
        let info = this.getCurCfgInfo();
        if (info) {
            let olTime = info.minutes * 60 - this.onlineTime;
            if (olTime <= 0) {
                val = true;
            }
        }
        if (this.bAwardState != val)
            this.bAwardState = val;
        com_main.EventMgr.dispatchEvent(OnLineEvent.ONLINE_UPDATE, null);
    }

    /**计算是否有未领取奖励 */
    public static getAwardState() {
        return this.bAwardState;
    }

    /**解析服务器在线数据 */
    public static parseData(data: gameProto.IS2C_ONLINE_INFO) {
        this.onlineTime = data.onlineTime;
        this.onlineList = data.awardRecordSet;

        if (this.checkOnlineEnd()) {//判断是否已全部领完直接删除在线图标
            FunctionModel.removeFunc(FunctionType.ONLINE);
            return;
        }
        this.updateAwardState();//是否可领
        let allTime = this.getCfgAllTime();//配置全部奖励总的时长（秒）
        if (this.onlineTime <= allTime) {
            this.addTick();
        }

        if (OnLineModel.viewState) {
            Utils.open_view(TASK_UI.POP_ACTIVITY_ONLINE_REWARD);
            OnLineModel.viewState = false;
        }
    }

    /**判断奖励是否领取完毕 */
    public static checkOnlineEnd() {
        let arr = [];
        let onlineCfg = C.ActivityOnlineTimeRewardConfig;
        for (let k in onlineCfg) {
            arr.push(onlineCfg[k]);
        }
        if (this.onlineList.length && this.onlineList.length > 0) {
            if (this.onlineList.length == arr.length) {
                return true;
            }
        }
        return false;
    }

    /**取在线配置表总时长 */
    public static getCfgAllTime() {
        let state: number = 0;
        let onlineCfg = C.ActivityOnlineTimeRewardConfig;
        for (let k in onlineCfg) {
            state += onlineCfg[k].minutes * 60;
        }
        return state;
    }

    /**取在线配置表对应显示数据 */
    public static getCurCfgInfo() {
        let onlineCfg = C.ActivityOnlineTimeRewardConfig;
        for (let k in onlineCfg) {
            let state = this.getOnlineState(onlineCfg[k].id);
            if (state != ActivityStatus.REWARD) {
                return onlineCfg[k];
            }
        }
        return null;
    }

    /**获取在线奖励是否领取状态 */
    public static getOnlineState(onlineId: number) {
        let state: number = 1;
        if (this.onlineList && this.onlineList.length > 0) {
            for (let k = 0; k < this.onlineList.length; k++) {
                let info = this.onlineList[k];
                if (info != null && info != undefined) {
                    if (onlineId == info) {
                        state = 2;
                    }
                }
            }
        }
        return state;
    }

    /** 计算红点*/
    // public static onlineFinishRed(onlineId: number, time: number) {
    //     if (this.onlineList && this.onlineList.length > 0) {
    //         for (let k = 0; k < this.onlineList.length; k++) {
    //             let info = this.onlineList[k];
    //             if (info != null && info != undefined) {
    //                 if (onlineId != info) {
    //                     if (time - this.onlineTime <= 0) {
    //                         return 0;
    //                     }
    //                 }
    //             }
    //         }
    //     } else {
    //         if (time - this.onlineTime <= 0) {
    //             return 0;
    //         }
    //     }
    //     return 1;
    // }

}
