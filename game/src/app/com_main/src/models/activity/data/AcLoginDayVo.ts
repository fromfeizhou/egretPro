/**每日登录 */
class AcLoginDayVo extends ActivityVo implements IFObject {
    public loginDaySet: number[];//登陆天数数组
    public loginDayList: number[];//每日登录活动领奖记录

    public configs: { [key: number]: ActivityLoginDaysRewardConfig };
    public constructor() {
        super();
    }

    /**解析每日登录数据 */
    public initLoginDay(data: gameProto.IS2C_ACTIVITY_GET_LOGIN_DAYS_INFO) {
        this.loginDaySet = data.loginDaySet;
        this.loginDayList = data.awardRecordSet;
        // let activiCfg: ActivityConfig = C.ActivityConfig[this.id];
        // if (isNull(activiCfg))
        //     return;
        // if (activiCfg.notice == 1 && this.loginDayList && this.loginDayList.indexOf(3) == -1 && RoleData.level >= 5) {
        //     ActivityModel.updateActAwardIds(activiCfg.activityType);
        // }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.id);
    }

    /**领取奖励 */
    public finishAward(data: gameProto.IActivityAward) {
        //领奖错误
        if (data.resultCode != 0) return;
        this.loginDayList = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.id);
    }

    /**获取每日登录当前的第几天 */
    public getCurday(day: number) {
        let numStr: string;
        var maxDay = Math.max.apply(null, this.loginDaySet);
        if (day > maxDay) {
            numStr = Global.getChineseNum(day - maxDay);
        }
        return numStr;
    }
    /**判断当天登录状态 */
    public getBoxState() {
        if (this.loginDayList && this.loginDayList.length > 0) {
            for (let i in this.loginDayList) {
                if (this.loginDayList[i] == 8) {
                    return true;
                }
            }
        }
        return false;
    }
    /**判断当天登录状态 */
    public getDaysState(loginDay: number) {
        let state: number = 1;
        if (this.loginDaySet && this.loginDaySet.length > 0) {
            for (let i = 0; i < this.loginDaySet.length; i++) {
                let loginday = this.loginDaySet[i];
                if (loginday == loginDay) {
                    state = 0;
                    break;
                } else {
                    if (loginDay < loginday) {
                        state = 3;
                    }
                }
            }
        }
        return state;
    }
    /** 每日登录 获得item按钮红点*/
    public getLoginDailyBtnRed(loginDay: number, id: number) {
        let state: number = 1;  //进行中
        if (this.loginDayList && this.loginDayList.length > 0) {
            for (let i in this.loginDayList) {
                if (this.loginDayList[i] != id) {//排除已领的id
                    state = this.getDaysState(loginDay);
                } else {//已领取
                    state = 2;
                    break;
                }
            }
        } else {
            if (this.loginDaySet && this.loginDaySet.length > 0) {
                for (let i = 0; i < this.loginDaySet.length; i++) {
                    if (this.loginDaySet[i] == loginDay) {
                        state = 0;
                        break;
                    } else {
                        state = this.getDaysState(loginDay);
                    }
                }
            }
        }
        return state;
    }

    /**可领奖励 */
    public hasAward() {
        for (let key in this.configs) {
            let cfg = this.configs[key];
            if (cfg && this.loginDaySet.indexOf(cfg.loginDays) >= 0 && this.loginDayList.indexOf(cfg.id) == -1) {
                return 1;
            }
        }
        return 0;
    }

    /**=====================================================================================
	 * 数据配置相关 begin
	 * =====================================================================================
	 */

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

    /**请求活动内容(子类重写)  */
    public requestActivityInfo() {
        ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_INFO(this.id);
    }

    /**跨天请求 */
	public crossDayRequest(){
        this.requestActivityInfo();
	}

	/**=====================================================================================
	 * 数据配置相关 end
	 * =====================================================================================
	 */
}