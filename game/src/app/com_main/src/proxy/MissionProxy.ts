//任务
class MissionProxy extends BaseProxy {
	private static isOpenView: boolean = false;

	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_TASK_LIST, this, 'C2S_TASK_LIST', ProxyEnum.SEND],// 获取任务列表
			[ProtoDef.S2C_TASK_LIST, this, 'S2C_TASK_LIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_TASK_RECEIVE, this, 'C2S_TASK_RECEIVE', ProxyEnum.SEND],// 领取任务
			[ProtoDef.S2C_TASK_RECEIVE, this, 'S2C_TASK_RECEIVE', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_TASK_PROGRESS, this, 'S2C_TASK_PROGRESS', ProxyEnum.SEND],// 领取任务

			[ProtoDef.C2S_TASK_REWARD, this, 'C2S_TASK_REWARD', ProxyEnum.SEND],// 领取奖励
			[ProtoDef.S2C_TASK_REWARD, this, 'S2C_TASK_REWARD', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_LIVENESS_INFO, this, 'C2S_LIVENESS_INFO', ProxyEnum.SEND],// 活跃度奖励列表
			[ProtoDef.S2C_LIVENESS_INFO, this, 'S2C_LIVENESS_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_LIVENESS_RECEIVE, this, 'C2S_LIVENESS_RECEIVE', ProxyEnum.SEND],// 领取活跃度奖励
			[ProtoDef.S2C_LIVENESS_RECEIVE, this, 'S2C_LIVENESS_RECEIVE', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_TASK_REWARD_MULTI, this, 'C2S_TASK_REWARD_MULTI', ProxyEnum.SEND],// 一键领取奖励
			[ProtoDef.S2C_TASK_REWARD_MULTI, this, 'S2C_TASK_REWARD_MULTI', ProxyEnum.RECEIVE],


			[ProtoDef.C2S_ACTIVITY_TASK_LIST, this, 'C2S_ACTIVITY_TASK_LIST', ProxyEnum.SEND],// 活动任务
			[ProtoDef.S2C_ACTIVITY_TASK_LIST, this, 'S2C_ACTIVITY_TASK_LIST', ProxyEnum.RECEIVE],
		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.S2C_TASK_LIST: {// 获取
				MissionModel.initPlayerMissionInfoList(body);
				break;
			}
			case ProtoDef.S2C_ACTIVITY_TASK_LIST: {// 获取活动任务列表
				MissionModel.initActivityList(body);
				break;
			}

			case ProtoDef.S2C_TASK_RECEIVE: {// 领取任务
				MissionModel.addPlayerMissionInfoList(body);
				break;
			}

			case ProtoDef.S2C_TASK_PROGRESS: {// 任务状态刷新
				MissionModel.updateMissionInfos(body);
				break;
			}
			case ProtoDef.S2C_TASK_REWARD: {// 领奖
				MissionModel.receiveReward(body);
				break;
			}

			case ProtoDef.S2C_LIVENESS_INFO: {
				MissionModel.initActivaInfo(body);
				break;
			}
			case ProtoDef.S2C_LIVENESS_RECEIVE: {
				let data = body as gameProto.S2C_LIVENESS_RECEIVE;
				if (data.state == 0) {
					let reward = C.LivesRewardConfig[data.id].Reward;
					Utils.open_view(TASK_UI.GET_REWARD_VIEW, reward);
				}
				break;
			}
			case ProtoDef.S2C_TASK_REWARD_MULTI: {// 一键领奖
				MissionModel.receiveAllReward(body);
				break;
			}
			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**请求任务信息 */
	public static send_GET_PLAYER_MISSION() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**领取奖励 */
	public static send_MISSION_REWARD(taskId: number, taskConditionId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_REWARD);
		data.taskId = taskId;
		data.taskConditionId = taskConditionId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**请求活跃度信息 */
	public static send_MISSION_ACTIVE_INFO() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_LIVENESS_INFO);
		AGame.ServiceBuilder.sendMessage(data);
	}

	//活跃度领取
	public static send_MISSION_ACTIVE_REWAED(id: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_LIVENESS_RECEIVE);
		data.id = id;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**一键领取奖励 */
	public static send_MISSION_REWARD_Multi(taskConditionId: number[]) {
		while (taskConditionId.length > 500) {
			let res = taskConditionId.splice(0, 500);
			let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_REWARD_MULTI);
			data.taskConditionId = res;
			AGame.ServiceBuilder.sendMessage(data);
		}
		if (taskConditionId.length > 0) {
			let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TASK_REWARD_MULTI);
			data.taskConditionId = taskConditionId;
			AGame.ServiceBuilder.sendMessage(data);
		}

	}

	/**获取活动任务列表 */
	public static C2S_ACTIVITY_TASK_LIST(activityId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACTIVITY_TASK_LIST) as gameProto.IC2S_ACTIVITY_TASK_LIST;
		data.activityId = activityId;
		AGame.ServiceBuilder.sendMessage(data);
	}
}