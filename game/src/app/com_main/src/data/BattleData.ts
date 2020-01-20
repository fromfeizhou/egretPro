class BattleData {


	public static getFightEventTickTime(eventType: FightEventType) {
		let ticktime: number = 0;

		//读取配置表
		//(当前时间-startTime)%间隔时间，这个才是当前的倒计时
		// let econfig = this.getFightEventConfig(eventType);
		// if (econfig) {
		// 	let battleinfo = BattleModel.getBattleInfo();
		// 	let currtime = TimerUtils.getServerTimeMill();
		// 	ticktime = (currtime - battleinfo.startTime.toNumber()) % econfig.delay
		// 	ticktime = econfig.delay - ticktime;
		// }

		//读取服务器
		let currtime = TimerUtils.getServerTimeMill();
		// let eventvo = BattleModel.getFightEventToType(eventType);
		// if (eventvo) ticktime = eventvo.happenTime2 - currtime;
		if (ticktime < 0) ticktime = 0;
		return ticktime;
	}
	

	// public static getNoviceBattlePlayerConfig(playerid: number) {
	// 	return C.NoviceBattlePlayerConfig[playerid];
	// }
}