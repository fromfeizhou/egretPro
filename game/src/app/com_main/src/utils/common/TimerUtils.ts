class TimerUtils {
	public static OpenServerTime = 0;	//开服时间
	public static ServerTime = 0;       //通过服务器协议返回的时间(毫秒)
	public static ServerTimeStamp = 0;  //时间标尺

	public static crossTimeDelay: number = 0;//18000000 - 10000;//服务器跨天延迟 5小时检验
	private static serverDate: Date = new Date();
	/**
	 * 获取服务器时间
	 */
	public static getServerTime(): number {
		return this.ServerTime / 1000;
	}

	public static getServerTimeMill(): number {
		return this.ServerTime;
	}

	/**
	 * 获取服务器时间date
	 */
	public static getServerDate() {
		this.serverDate.setTime(this.ServerTime)
		return this.serverDate;
	}

	/**
	 * 获取服务器天数判断的date
	 * 服务器 5点钟跨天 计算减5小时
	 *  */
	public static getServerDayDate() {
		//客户端本地延迟60秒计算 避免服务器重置卡顿 
		this.serverDate.setTime(this.ServerTime - this.crossTimeDelay);
		return this.serverDate;
	}

	/**与服务器时间是否同一天(毫秒) */
	public static isSameDay(time: number) {
		let dt = Math.abs(this.ServerTime - time);
		if (dt > 86400 * 1000) return false;
		//都减去5小时判断
		let date = new Date(this.ServerTime - this.crossTimeDelay);
		let tmpDate = new Date(time  - this.crossTimeDelay);
		return date.getDate() == tmpDate.getDate()
	}

	/**与服务器时间是否隔天(毫秒) 减去5小时 */
	public static isOverDay(time: number) {
		return !this.isSameDay(time);
	}

	/**
	 * 获取服务器时间的Ymd格式
	 */
	public static getServerTimeYmd(): number {
		return Number(TimerUtils.dateFormat("yyyyMMdd", TimerUtils.getServerTime()));
	}

	//格式化日期
	public static dateFormat(fmt: string, time: number) {
		var date = new Date(time * 1000);
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	/**
	 *  将时间长度格式化
	 *
	 */
	public static diffTimeFormat(fmt: string, time: number, type: number = 1) {
		var day = Utils.number2int(time / 86400);
		var hour = Utils.number2int(time % 86400 / 3600);
		var minutent = Utils.number2int(time % 3600 / 60);
		var seconds = Utils.number2int(time % 60);
		if (!new RegExp("(d+)").test(fmt)) {
			hour += day * 24;
		}
		if (!new RegExp("(h+)").test(fmt)) {
			minutent += hour * 60;
		}

		var o = {
			"d+": day, //日 
			"h+": hour, //小时 
			"m+": minutent, //分 
			"s+": seconds, //秒 
		};
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) {
				//                    debug((("00" + o[k]).substr(("" + o[k]).length)));
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ("" + o[k]).length == 1 ? "0" + o[k] : o[k]);
			}

		return fmt;
	}


	/**
	 * 格式 08:00:00
	 * 获得时间戳 (s)
	 * */
	public static getTimeByFormatA(time: string) {
		let tmpTime = this.getServerTimeMill();
		let date = new Date(tmpTime);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let format = `${year}/${month}/${day} ${time}`
		return new Date(format).getTime() / 1000;
	}
	/**
 *
 * 获得星期几
 * */
	public static getTimeWeek() {
		let tmpTime = this.getServerTimeMill();
		let date = new Date(tmpTime);
		let day = date.getDay();
		return day;
	}

	/**
	 * 获取当天00：00时间戳 
	 * 返回秒
	 * delayTime 延迟时间 秒
	 */
	public static getTodayStartTime(delayTime?: number) {
		let zeroTime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
		if (!delayTime) {
			return zeroTime;
		}

		if (TimerUtils.getServerTime() - zeroTime > delayTime) {
			return zeroTime + delayTime;
		} else {
			return zeroTime + delayTime - 24 * 3600;
		}
	}
}