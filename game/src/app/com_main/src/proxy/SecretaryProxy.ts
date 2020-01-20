class SecretaryProxy extends BaseProxy {

	public constructor() {
		super();
	}

	protected listenerProtoNotifications(): any[] {
		return [
			// [ProtoDef.GET_CELEBRATION, this, 'GetCelebrationReq', 'GetCelebrationResp'],        //获取庆典信息
			// [ProtoDef.CEREMONIES, this, 'CeremoniesReq', 'CeremoniesResp'],						//举办庆典
			// [ProtoDef.LIGHT_LANTERN, this, 'LightLanternReq', 'LightLanternResp'],				//点亮灯笼
			// [ProtoDef.RECEIVE_CELEBRATION_AWARD, this, 'ReceiveAwardReq', 'ReceiveAwardResp'],	//领取奖励
		];
	}

	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let proto = notification.getName() as number;
		switch (proto) {
			case ProtoDef.GET_CELEBRATION: {
				// debug("SecretaryProxy:execute-------->> GET_CELEBRATION", body)
				// CelebrationModel.endTime = body.endTime ? Long.fromValue(body.endTime) : Long.fromValue(0);
				// CelebrationModel.m_pGainScore = body.totalScore - CelebrationModel.totalScore;
				// CelebrationModel.totalScore = body.totalScore;
				// CelebrationModel.setAdditions(body.additions);
				// CelebrationModel.setLanterns(body.lanterns);
				// CelebrationModel.isReward = body.isReward;

				// if (SecretaryProxy.checkCelebration()) {
				// 	SecretaryProxy.send_CEREMONIES();
				// }
				break;
			}
			default: {
				debug("未处理事件:", proto);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	/////////////////////////////////////////////////////////////////////

	/** 获取庆典信息 */
	public static send_GET_CELEBRATION() {
		debug("SecretaryProxy:send_GET_CELEBRATION--->>");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_CELEBRATION);
		AGame.ServiceBuilder.sendMessage(data);
	}

}