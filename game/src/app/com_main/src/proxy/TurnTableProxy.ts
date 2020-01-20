
//转盘
class TurnTableProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	protected listenerProtoNotificationsNew(): any[] {
		return [
			[ProtoDef.C2S_ACTIVITY_GET_PRIZE_INFO, this, 'C2S_ACTIVITY_GET_PRIZE_INFO', ProxyEnum.SEND],// 获取幸运转盘玩家个人信息
			[ProtoDef.S2C_ACTIVITY_GET_PRIZE_INFO, this, 'S2C_ACTIVITY_GET_PRIZE_INFO', ProxyEnum.RECEIVE],
			[ProtoDef.C2S_ACTIVITY_PRIZE_PLAY, this, 'C2S_ACTIVITY_PRIZE_PLAY', ProxyEnum.SEND],// 点击转盘（1次，10次）
			[ProtoDef.S2C_ACTIVITY_PRIZE_PLAY, this, 'S2C_ACTIVITY_PRIZE_PLAY', ProxyEnum.RECEIVE],
			[ProtoDef.C2S_ACTIVITY_DRAW_PRIZE_REWARD, this, 'C2S_ACTIVITY_DRAW_PRIZE_REWARD', ProxyEnum.SEND],// 领取幸运转盘累积奖励
			[ProtoDef.S2C_ACTIVITY_DRAW_PRIZE_REWARD, this, 'S2C_ACTIVITY_DRAW_PRIZE_REWARD', ProxyEnum.RECEIVE],
		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.S2C_ACTIVITY_GET_PRIZE_INFO: {    //获取幸运转盘玩家个人信息
				let data = body as gameProto.IS2C_ACTIVITY_GET_PRIZE_INFO;
				let vo = ActivityModel.getActivityVoById<AcTurnTableVo>(data.activityId);
				if (vo) vo.getInfoData(data);
				break;
			}
			case ProtoDef.S2C_ACTIVITY_PRIZE_PLAY: {    //玩幸运转盘
				let data = body as gameProto.IS2C_ACTIVITY_PRIZE_PLAY;
				let vo = ActivityModel.getActivityVoById<AcTurnTableVo>(data.activityId);
				if (vo) vo.parsePalyData(data);
				break;
			}
			case ProtoDef.S2C_ACTIVITY_DRAW_PRIZE_REWARD: {    //领取幸运转盘累积奖励
				let data = body as gameProto.IS2C_ACTIVITY_DRAW_PRIZE_REWARD;
				let vo = ActivityModel.getActivityVoById<AcTurnTableVo>(data.activityAward.avtivityId);
				if (vo) vo.finishAward(data.activityAward);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}
	/**获取幸运转盘玩家个人信息 */
	public static C2S_ACTIVITY_GET_PRIZE_INFO(activityId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_GET_PRIZE_INFO);
		data.activityId = activityId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**点击幸运转盘(1次,10次) */
	public static C2S_ACTIVITY_PRIZE_PLAY(activityId: number, type: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_PRIZE_PLAY);
		data.activityId = activityId;
		data.type = type;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**领取幸运转盘累积奖励*/
	public static C2S_ACTIVITY_DRAW_PRIZE_REWARD(activityId: number, id: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_DRAW_PRIZE_REWARD);
		data.id = id;
		data.activityId = activityId;
		AGame.ServiceBuilder.sendMessage(data);
	}



}