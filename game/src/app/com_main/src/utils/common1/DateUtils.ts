/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
class DateUtils extends BaseClass {
    public constructor() {
        super();
    }

    public getFormatTime(milliSec: number, type: number = 1) {
        return this.getFormatBySecond(milliSec / 1000, type)
    }

    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1[00:00:00]   2[yyyy-mm-dd h:m:s]   3[00:00]   4[x天xx小时   xx小时xx分钟  xx分钟xx秒]
     * @return
     *
     */
    public getFormatBySecond(second: number, type: number = 1): string {
        var str: string = "";
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
    }

    //获取倒计时数据(进度，文本，剩余时间)
    /**
     * isRate: true 百分比，false 比例 
     * return 比例or百分比，倒计时文本，剩余时间(秒)
     */
    public getCountdownInfo(startTime: number, endTime: number, speedUpTime: number = 0, isRate: boolean = true) {
        let stime = startTime;
        let etime = endTime;
        let spTime = speedUpTime;
        let time = TimerUtils.getServerTimeMill();
        let allTime = etime - stime;
        let runTime = time - stime + spTime;
        runTime = runTime > allTime ? allTime : runTime;
        let per = runTime / allTime;
        if (isRate)
            per = per * 100;
        let remainingTime = Math.floor(allTime - runTime);
        let str = Utils.DateUtils.getCountdownStrByCfg(remainingTime);
        remainingTime = Math.floor(remainingTime * 0.001);
        return [per, str, remainingTime];
    }

    //时间(毫秒)转文本
    public timeToText(time: number) {
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
    }

    /**
     * 根据剩余秒数获取倒计时文本（活动用，带字体颜色）
     * millSecond 毫秒
     * 1 [xx天xx时xx分]
     * 2 [xx时xx分xx秒]
     **/
    public getActiveDownStr(millSecond: number, type: number = 1) {
        let second = millSecond * 0.001;
        let rSec = Math.floor(second % 60);
        let rMin = Math.floor(second / 60);
        let rHour = Math.floor(second / (60 * 60));
        let rDay = Math.floor(second / (24 * 60 * 60));
        rMin -= rHour * 60;
        rHour -= rDay * 24;

        let strHour = StringUtils.pad(rHour, 2);
        let strMin = StringUtils.pad(rMin, 2);
        let strSec = StringUtils.pad(rSec, 2);
        let str = type == 1 ? GCodeFromat(CLEnum.ACT_DJS, rDay, strHour, strMin) : GCodeFromat(CLEnum.ACT_SFM, strHour, strMin, strSec);

        return str;
    }

    /**
     * 根据剩余秒数获取倒计时文本
     * millSecond 毫秒
     * 1[xx天xx时xx分]
     **/
    public getCountdownStrByCfg(millSecond: number, type?: number) {
        let second = millSecond * 0.001;
        return this.getCountDownStrBySecond(second, type);
    }

    public getCountDownStrBySecond(second: number, type?: number) {
        let rSec = Math.floor(second % 60);
        let rMin = Math.floor(second / 60);
        let rHour = Math.floor(second / (60 * 60));
        let rDay = Math.floor(second / (24 * 60 * 60));
        rMin -= rHour * 60;
        rHour -= rDay * 24;
        if (type == 1) {
            return GCodeFromat(CLEnum.TIME, rDay, StringUtils.pad(rHour, 2), StringUtils.pad(rMin, 2));
        } else {
            if (rDay > 0)
                return GCodeFromat(CLEnum.TIME1, rDay, StringUtils.pad(rHour, 2));
            else
                return `${StringUtils.pad(rHour, 2)}:${StringUtils.pad(rMin, 2)}:${StringUtils.pad(rSec, 2)}`//hours + ":" + mins + ":" + sens;
        }
    }

    /**根据结束时间戳获取倒计时文本*/
    public getCountdownStrByTimestamp(endTime: number) {
        let curtime = TimerUtils.getServerTimeMill();
        let t = endTime - curtime;
        return this.getCountdownStrByCfg(t);
    }

    //1: 00:00:00
    private getFormatBySecond1(second: number = 0): string {
        let rSec = Math.floor(second % 60);
        let rMin = Math.floor(second / 60);
        let rHour = Math.floor(second / (60 * 60));
        rMin -= rHour * 60;
        return `${StringUtils.pad(rHour, 2)}:${StringUtils.pad(rMin, 2)}:${StringUtils.pad(rSec, 2)}`;
    }

    //3: 00:00
    private getFormatBySecond3(second: number = 0): string {
        let rSec = Math.floor(second % 60);
        let rMin = Math.floor(second / 60);
        return `${StringUtils.pad(rMin, 2)}:${StringUtils.pad(rSec, 2)}`;
    }

    //2:yyyy-mm-dd h:m:s
    private getFormatBySecond2(time: number): string {
        var date: Date = new Date(time * 1000);
        var year: number = date.getFullYear();
        var month: number = date.getMonth() + 1; 	//返回的月份从0-11；
        var day: number = date.getDate();
        var hours: number = date.getHours();
        var minute: number = date.getMinutes();
        var second: number = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;

    }


    // x天xx小时   xx小时xx分钟  xx分钟xx秒
    private getFormatBySecond4(second: number): string {
        let rSec = Math.floor(second % 60);
        let rMin = Math.floor(second / 60);
        let rHour = Math.floor(second / (60 * 60));
        let rDay = Math.floor(second / (24 * 60 * 60));
        rMin -= rHour * 60;
        rHour -= rDay * 24;
        if (rDay > 0) {
            return GCodeFromat(CLEnum.TIME1, rDay, StringUtils.pad(rHour, 2));
        } else {
            if (rHour > 0) {
                return GCodeFromat(CLEnum.TIME2, StringUtils.pad(rHour, 2), StringUtils.pad(rMin, 2));
            } else {
                return GCodeFromat(CLEnum.TIME3, StringUtils.pad(rMin, 2), StringUtils.pad(rSec, 2));
            }
        }
    }

    /**
     * 参数 时间戳
     * 
     * 返回 XX月XX日XX：XX
     * 1不带颜色 2带颜色
     */
    public getDateStr(time: number, type = 1) {
        var date = new Date(time * 1000);
        var month: number = date.getMonth() + 1; 	//返回的月份从0-11；
        var day: number = date.getDate();
        var hours: number = date.getHours();
        var minute: number = date.getMinutes();
        var str: string = "";
        switch (type) {
            case 1:
                str = GCodeFromat(CLEnum.DATE, month, day, StringUtils.pad(hours, 2), StringUtils.pad(minute, 2));
                break;
            case 2:
                str = GCodeFromat(CLEnum.DATE_COLOR, month, day, StringUtils.pad(hours, 2), StringUtils.pad(minute, 2));
                break;
        }
        return str;
    }

}