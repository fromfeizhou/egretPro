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
/**每日登录 */
var AcLoginDayVo = /** @class */ (function (_super_1) {
    __extends(AcLoginDayVo, _super_1);
    function AcLoginDayVo() {
        return _super_1.call(this) || this;
    }
    /**解析每日登录数据 */
    AcLoginDayVo.prototype.initLoginDay = function (data) {
        this.loginDaySet = data.loginDaySet;
        this.loginDayList = data.awardRecordSet;
        // let activiCfg: ActivityConfig = C.ActivityConfig[this.id];
        // if (isNull(activiCfg))
        //     return;
        // if (activiCfg.notice == 1 && this.loginDayList && this.loginDayList.indexOf(3) == -1 && RoleData.level >= 5) {
        //     ActivityModel.updateActAwardIds(activiCfg.activityType);
        // }
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.id);
    };
    /**领取奖励 */
    AcLoginDayVo.prototype.finishAward = function (data) {
        //领奖错误
        if (data.resultCode != 0)
            return;
        this.loginDayList = data.awardRecord;
        Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_LOGIN_DAY, this.id);
    };
    /**获取每日登录当前的第几天 */
    AcLoginDayVo.prototype.getCurday = function (day) {
        var numStr;
        var maxDay = Math.max.apply(null, this.loginDaySet);
        if (day > maxDay) {
            numStr = Global.getChineseNum(day - maxDay);
        }
        return numStr;
    };
    /**判断当天登录状态 */
    AcLoginDayVo.prototype.getBoxState = function () {
        if (this.loginDayList && this.loginDayList.length > 0) {
            for (var i in this.loginDayList) {
                if (this.loginDayList[i] == 8) {
                    return true;
                }
            }
        }
        return false;
    };
    /**判断当天登录状态 */
    AcLoginDayVo.prototype.getDaysState = function (loginDay) {
        var state = 1;
        if (this.loginDaySet && this.loginDaySet.length > 0) {
            for (var i = 0; i < this.loginDaySet.length; i++) {
                var loginday = this.loginDaySet[i];
                if (loginday == loginDay) {
                    state = 0;
                    break;
                }
                else {
                    if (loginDay < loginday) {
                        state = 3;
                    }
                }
            }
        }
        return state;
    };
    /** 每日登录 获得item按钮红点*/
    AcLoginDayVo.prototype.getLoginDailyBtnRed = function (loginDay, id) {
        var state = 1; //进行中
        if (this.loginDayList && this.loginDayList.length > 0) {
            for (var i in this.loginDayList) {
                if (this.loginDayList[i] != id) { //排除已领的id
                    state = this.getDaysState(loginDay);
                }
                else { //已领取
                    state = 2;
                    break;
                }
            }
        }
        else {
            if (this.loginDaySet && this.loginDaySet.length > 0) {
                for (var i = 0; i < this.loginDaySet.length; i++) {
                    if (this.loginDaySet[i] == loginDay) {
                        state = 0;
                        break;
                    }
                    else {
                        state = this.getDaysState(loginDay);
                    }
                }
            }
        }
        return state;
    };
    /**可领奖励 */
    AcLoginDayVo.prototype.hasAward = function () {
        for (var key in this.configs) {
            var cfg = this.configs[key];
            if (cfg && this.loginDaySet.indexOf(cfg.loginDays) >= 0 && this.loginDayList.indexOf(cfg.id) == -1) {
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
    AcLoginDayVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    AcLoginDayVo.prototype.requestActivityInfo = function () {
        ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_INFO(this.id);
    };
    /**跨天请求 */
    AcLoginDayVo.prototype.crossDayRequest = function () {
        this.requestActivityInfo();
    };
    return AcLoginDayVo;
}(ActivityVo));
