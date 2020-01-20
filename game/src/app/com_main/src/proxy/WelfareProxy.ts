/**
 * 福利
 */

class WelfareProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.GET_SIGN_UP, this, 'GetSignUpReq', 'GetSignUpResp'],// 请求签到信息
			[ProtoDef.SIGN_UP, this, 'SignUpReq', 'SignUpResp'],// 请求签到信息
			[ProtoDef.SUPPLEMENT_SIGN_UP, this, 'SupplementSignUpReq', 'SupplementSignUpResp'],// 补签
			[ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD, this, 'ReceiveSignUpExTraRewardReq', 'ReceiveSignUpExTraRewardResp'],// 请求获得额外奖励
			[ProtoDef.DAILY_LOGIN_ACT, this, 'DailyLoginActReq', 'DailyLoginActResp'],// 每日登陆请求
			[ProtoDef.DAILY_LOGIN_ACT_REWARD, this, 'DailyLoginActRewardReq', 'DailyLoginActRewardResp'],// 每日登陆领奖
			[ProtoDef.PATCH_COLLAR_REWARD, this, 'PatchCollarReq', 'PatchCollarResp'],// 补领

		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		debug("PropProxy body:", body);
		switch (protocol) {
			case ProtoDef.GET_SIGN_UP: {
				if (body) {
					let vo = ActivityModel.getActivityVo<AcSignUpVo>(AcViewType.SIGN_MONTH_DAY);
					if (vo) {
						vo.initSignUpData(body);
					}
				}
				break;
			}
			case ProtoDef.SIGN_UP: {
				let data = body as gameProto.SignUpResp;
				// PropModel.itemAwardTips(data.vaule);
				Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);
				break;
			}
			case ProtoDef.SUPPLEMENT_SIGN_UP: {// 补签
				let data = body as gameProto.SupplementSignUpResp;
				// PropModel.itemAwardTips(data.vaule);
				Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);
				break;
			}
			case ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD: {
				let data = body as gameProto.ReceiveSignUpExTraRewardResp;
				Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);

				break;
			}
			case ProtoDef.PATCH_COLLAR_REWARD: {//  补领
				let data = body as gameProto.PatchCollarResp;
				// PropModel.itemAwardTips(data.vaule);
				Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.vaule);
				break;
			}


			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**请求签到信息 */
	public static send_GET_SIGN_UP() {

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_SIGN_UP);
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**请求签到 */
	public static send_SIGN_UP() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.SIGN_UP);
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**buqian */
	public static send_SUPPLEMENT_SIGN_UP() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.SUPPLEMENT_SIGN_UP);
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**额外奖励 */
	public static send_RECEIVE_SIGN_UP_EXTRA_REWARD(id) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD);
		data.id = id;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**每日登陆请求 */
	public static send_DAILY_LOGIN_ACT() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.DAILY_LOGIN_ACT);
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**每日登陆领奖请求 */
	public static send_DAILY_LOGIN_ACT_REWARD(id) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.DAILY_LOGIN_ACT_REWARD);
		data.id = id;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**补领 */
	public static send_PATCH_COLLA() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.PATCH_COLLAR_REWARD);
		AGame.ServiceBuilder.sendMessage(data);
	}

}