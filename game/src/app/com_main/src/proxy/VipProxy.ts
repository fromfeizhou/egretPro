//任务
class VipProxy extends BaseProxy {
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_VIP_DAILY_REWARD, this, 'C2S_VIP_DAILY_REWARD', ProxyEnum.SEND],// 每日奖励
			[ProtoDef.S2C_VIP_DAILY_REWARD, this, 'S2C_VIP_DAILY_REWARD', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_VIP_LEVEL_REWARD, this, 'C2S_VIP_LEVEL_REWARD', ProxyEnum.SEND],// 等级奖励
			[ProtoDef.S2C_VIP_LEVEL_REWARD, this, 'S2C_VIP_LEVEL_REWARD', ProxyEnum.RECEIVE],
		]
	}

	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let protocol: number = Number(notification.getName());
		switch (protocol) {
			case ProtoDef.S2C_VIP_DAILY_REWARD: {
				let data = body as gameProto.IS2C_VIP_DAILY_REWARD;
				if (data.errorCode == 0) {
					VipModel.updateVipVo(data.rechargeInfo);
					VipModel.receiveDailyReward(data)
				}
				break;
			}
			case ProtoDef.S2C_VIP_LEVEL_REWARD: {
				let data = body as gameProto.IS2C_VIP_LEVEL_REWARD;
				if (data.errorCode == 0) {
					VipModel.updateVipVo(data.rechargeInfo);
					VipModel.receiveLevelReward(data)
				}
				break;
			}

		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	/**充值成功请求 */
	public static rechargeSucc(data: gameProto.IS2C_RECHARGE) {
		// let chargeCfg: RechargeConfig = C.RechargeConfig[data.id];

		// switch (chargeCfg.shopType) {
		// 	/**更新一元购 */
		// 	case RechargeType.ONE_GIFT_BAG: {
		// 		let vo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.ONE_GIFT_BAG);
		// 		if (vo) vo.requestActivityInfo();
		// 		return;
		// 	}
		// 	/**更新直购礼包 */
		// 	case RechargeType.PURCHAGE_BAG: {
		// 		let vo = ActivityModel.getActivityVo<AcPuGigtBagVo>(AcViewType.PURCHAGE_BAG);
		// 		if (vo && data.rechargeInfo) {
		// 			vo.initPuGiftBagData(data.rechargeInfo.rechargedIds)
		// 		}
		// 		Utils.open_view(TASK_UI.GET_REWARD_VIEW, chargeCfg.reward);
		// 		break;
		// 	}
		// }
		// //首充刷新
		// let vo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.FIRST_RECHARGE);
		// if (vo) vo.requestActivityInfo();
	}


	/**Vip每日奖励*/
	public static C2S_VIP_DAILY_REWARD() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_VIP_DAILY_REWARD) as gameProto.C2S_VIP_DAILY_REWARD;
		AGame.ServiceBuilder.sendMessage(data);
	}

    /**
     * vip等级奖励
     * 
     * */
	public static C2S_VIP_LEVEL_REWARD(level: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_VIP_LEVEL_REWARD) as gameProto.C2S_VIP_LEVEL_REWARD;
		data.level = level;
		AGame.ServiceBuilder.sendMessage(data);
	}
	
}