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
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
var DateUtils = /** @class */ (function (_super_1) {
    __extends(DateUtils, _super_1);
    function DateUtils() {
        return _super_1.call(this) || this;
    }
    DateUtils.prototype.getFormatTime = function (milliSec, type) {
        if (type === void 0) { type = 1; }
        return this.getFormatBySecond(milliSec / 1000, type);
    };
    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1[00:00:00]   2[yyyy-mm-dd h:m:s]   3[00:00]   4[x天xx小时   xx小时xx分钟  xx分钟xx秒]
     * @return
     *
     */
    DateUtils.prototype.getFormatBySecond = function (second, type) {
        if (type === void 0) { type = 1; }
        var str = "";
        switch (type) {
            case 1:
                str = this.getFormatBySecond1(second);
                break;
            case 2:
                str = this.getFormatBySecond2(second);
                break;
            case 3:
                str = this.getFormatBySecond3(second);
                break;
            case 4:
                str = this.getFormatBySecond4(second);
                break;
        }
        return str;
    };
    //获取倒计时数据(进度，文本，剩余时间)
    /**
     * isRate: true 百分比，false 比例
     * return 比例or百分比，倒计时文本，剩余时间(秒)
     */
    DateUtils.prototype.getCountdownInfo = function (startTime, endTime, speedUpTime, isRate) {
        if (speedUpTime === void 0) { speedUpTime = 0; }
        if (isRate === void 0) { isRate = true; }
        var stime = startTime;
        var etime = endTime;
        var spTime = speedUpTime;
        var time = TimerUtils.getServerTimeMill();
        var allTime = etime - stime;
        var runTime = time - stime + spTime;
        runTime = runTime > allTime ? allTime : runTime;
        var per = runTime / allTime;
        if (isRate)
            per = per * 100;
        var remainingTime = Math.floor(allTime - runTime);
        var str = Utils.DateUtils.getCountdownStrByCfg(remainingTime);
        remainingTime = Math.floor(remainingTime * 0.001);
        return [per, str, remainingTime];
    };
    //时间(毫秒)转文本
    DateUtils.prototype.timeToText = function (time) {
        time = time * 0.001;
        var t = Math.floor(time / 3600);
        if (t > 0) {
            if (t > 24) {
                return Math.floor(t / 24) + GCode(CLEnum.DAY);
            }
            else {
                return t + GCode(CLEnum.HOUR);
            }
        }
        else {
            return Math.floor(time / 60) + GCode(CLEnum.MIN);
        }
    };
    /**
     * 根据剩余秒数获取倒计时文本（活动用，带字体颜色）
     * millSecond 毫秒
     * 1 [xx天xx时xx分]
     * 2 [xx时xx分xx秒]
     **/
    DateUtils.prototype.getActiveDownStr = function (millSecond, type) {
        if (type === void 0) { type = 1; }
        var second = millSecond * 0.001;
        var rSec = Math.floor(second % 60);
        var rMin = Math.floor(second / 60);
        var rHour = Math.floor(second / (60 * 60));
        var rDay = Math.floor(second / (24 * 60 * 60));
        rMin -= rHour * 60;
        rHour -= rDay * 24;
        var strHour = StringUtils.pad(rHour, 2);
        var strMin = StringUtils.pad(rMin, 2);
        var strSec = StringUtils.pad(rSec, 2);
        var str = type == 1 ? GCodeFromat(CLEnum.ACT_DJS, rDay, strHour, strMin) : GCodeFromat(CLEnum.ACT_SFM, strHour, strMin, strSec);
        return str;
    };
    /**
     * 根据剩余秒数获取倒计时文本
     * millSecond 毫秒
     * 1[xx天xx时xx分]
     **/
    DateUtils.prototype.getCountdownStrByCfg = function (millSecond, type) {
        var second = millSecond * 0.001;
        return this.getCountDownStrBySecond(second, type);
    };
    DateUtils.prototype.getCountDownStrBySecond = function (second, type) {
        var rSec = Math.floor(second % 60);
        var rMin = Math.floor(second / 60);
        var rHour = Math.floor(second / (60 * 60));
        var rDay = Math.floor(second / (24 * 60 * 60));
        rMin -= rHour * 60;
        rHour -= rDay * 24;
        if (type == 1) {
            return GCodeFromat(CLEnum.TIME, rDay, StringUtils.pad(rHour, 2), StringUtils.pad(rMin, 2));
        }
        else {
            if (rDay > 0)
                return GCodeFromat(CLEnum.TIME1, rDay, StringUtils.pad(rHour, 2));
            else
                return StringUtils.pad(rHour, 2) + ":" + StringUtils.pad(rMin, 2) + ":" + StringUtils.pad(rSec, 2); //hours + ":" + mins + ":" + sens;
        }
    };
    /**根据结束时间戳获取倒计时文本*/
    DateUtils.prototype.getCountdownStrByTimestamp = function (endTime) {
        var curtime = TimerUtils.getServerTimeMill();
        var t = endTime - curtime;
        return this.getCountdownStrByCfg(t);
    };
    //1: 00:00:00
    DateUtils.prototype.getFormatBySecond1 = function (second) {
        if (second === void 0) { second = 0; }
        var rSec = Math.floor(second % 60);
        var rMin = Math.floor(second / 60);
        var rHour = Math.floor(second / (60 * 60));
        rMin -= rHour * 60;
        return StringUtils.pad(rHour, 2) + ":" + StringUtils.pad(rMin, 2) + ":" + StringUtils.pad(rSec, 2);
    };
    //3: 00:00
    DateUtils.prototype.getFormatBySecond3 = function (second) {
        if (second === void 0) { second = 0; }
        var rSec = Math.floor(second % 60);
        var rMin = Math.floor(second / 60);
        return StringUtils.pad(rMin, 2) + ":" + StringUtils.pad(rSec, 2);
    };
    //2:yyyy-mm-dd h:m:s
    DateUtils.prototype.getFormatBySecond2 = function (time) {
        var date = new Date(time * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
    };
    // x天xx小时   xx小时xx分钟  xx分钟xx秒
    DateUtils.prototype.getFormatBySecond4 = function (second) {
        var rSec = Math.floor(second % 60);
        var rMin = Math.floor(second / 60);
        var rHour = Math.floor(second / (60 * 60));
        var rDay = Math.floor(second / (24 * 60 * 60));
        rMin -= rHour * 60;
        rHour -= rDay * 24;
        if (rDay > 0) {
            return GCodeFromat(CLEnum.TIME1, rDay, StringUtils.pad(rHour, 2));
        }
        else {
            if (rHour > 0) {
                return GCodeFromat(CLEnum.TIME2, StringUtils.pad(rHour, 2), StringUtils.pad(rMin, 2));
            }
            else {
                return GCodeFromat(CLEnum.TIME3, StringUtils.pad(rMin, 2), StringUtils.pad(rSec, 2));
            }
        }
    };
    /**
     * 参数 时间戳
     *
     * 返回 XX月XX日XX：XX
     * 1不带颜色 2带颜色
     */
    DateUtils.prototype.getDateStr = function (time, type) {
        if (type === void 0) { type = 1; }
        var date = new Date(time * 1000);
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var str = "";
        switch (type) {
            case 1:
                str = GCodeFromat(CLEnum.DATE, month, day, StringUtils.pad(hours, 2), StringUtils.pad(minute, 2));
                break;
            case 2:
                str = GCodeFromat(CLEnum.DATE_COLOR, month, day, StringUtils.pad(hours, 2), StringUtils.pad(minute, 2));
                break;
        }
        return str;
    };
    return DateUtils;
}(BaseClass));
