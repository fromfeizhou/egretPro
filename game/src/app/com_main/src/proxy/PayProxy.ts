class PayProxy extends BaseProxy {



	protected listenerProtoNotificationsNew(): any[] {
		return [
			[ProtoDef.C2S_JADE_BUY, this, 'C2S_JADE_BUY', ProxyEnum.SEND],// 请求玉石超市购买
			[ProtoDef.C2S_RECHARGE_CONFIGS, this, 'C2S_RECHARGE_CONFIGS', ProxyEnum.SEND],// 充值配置表
			[ProtoDef.S2C_RECHARGE_CONFIGS, this, 'S2C_RECHARGE_CONFIGS', ProxyEnum.RECEIVE],


			[ProtoDef.C2S_PLAY_ORDERNO, this, 'C2S_PLAY_ORDERNO', ProxyEnum.SEND],    //获取订单
			[ProtoDef.S2C_PLAY_ORDERNO, this, 'S2C_PLAY_ORDERNO', ProxyEnum.RECEIVE], //获取订单

			[ProtoDef.C2S_RECHARGE_INFO, this, 'C2S_RECHARGE_INFO', ProxyEnum.SEND],//充值信息
			[ProtoDef.S2C_RECHARGE_INFO, this, 'S2C_RECHARGE_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_RECHARGE, this, 'C2S_RECHARGE', ProxyEnum.SEND],//充值信息
			[ProtoDef.S2C_RECHARGE, this, 'S2C_RECHARGE', ProxyEnum.RECEIVE],
			[ProtoDef.C2S_GOLD_BUY, this, 'C2S_GOLD_BUY', ProxyEnum.SEND],//使用元宝购买

		];
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.S2C_RECHARGE_CONFIGS: {
				let data = body as gameProto.IS2C_RECHARGE_CONFIGS;
				if (data.activityId == 0) {
					PayModel.parseRechargeCfg(data.rechargeConfig);
				} else {
					let vo = ActivityModel.getActivityVoById<ActivityVo>(data.activityId);
					if (vo) vo.parseRechargeCfg(data.rechargeConfig);
				}
				break;
			}
			// case ProtoDef.S2C_JADE_CONFIGS: {
			// 	let data = body as gameProto.IS2C_JADE_CONFIGS;
			// 	let vo = ActivityModel.getActivityVoById<ActivityVo>(data.activityId);
			// 	if (vo) vo.parseRechargeCfg(data.jadeConfig);
			// 	break;
			// }

			case ProtoDef.S2C_PLAY_ORDERNO: {
				let data = body as gameProto.IS2C_PLAY_ORDERNO;
				platform.pay(data.orderNo, data.itemId, data.name, data.price);
				break;
			}

			case ProtoDef.S2C_RECHARGE_INFO: {
				let data = body as gameProto.IS2C_RECHARGE_INFO;
				VipModel.updateVipVo(data.rechargeInfo);
				//更新充值记录
				PayModel.rechargeRecords = data.rechargeIds;
				break;
			}
			case ProtoDef.S2C_RECHARGE: {
				let data = body as gameProto.IS2C_RECHARGE;
				EffectUtils.showTips(GCode(CLEnum.MAT_BUY_SUC), 1, true);

				if (data.reward && data.reward.length > 0) Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.reward);
				com_main.EventMgr.dispatchEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, data.id);
				Loading.hide();
				break;
			}
			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}


	/**获得充值配置表 */
	public static C2S_RECHARGE_CONFIGS(activityId: number, rechargeIds: number[]) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECHARGE_CONFIGS) as gameProto.IC2S_RECHARGE_CONFIGS;
		data.activityId = activityId;
		data.rechargeIds = rechargeIds;
		AGame.ServiceBuilder.sendMessage(data);
	}


	/**请求玉石超市购买 */
	private static C2S_JADE_BUY(shopId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_JADE_BUY) as gameProto.IC2S_JADE_BUY;
		data.shopId = shopId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**获取订单号 正式环境 */
	private static send_C2S_PLAY_ORDERNO(itemId: number) {
		let data: gameProto.C2S_PLAY_ORDERNO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_PLAY_ORDERNO);
		data.itemId = itemId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**请求元宝购买 */
	public static C2S_GOLD_BUY(shopId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GOLD_BUY) as gameProto.IC2S_GOLD_BUY;
		data.shopId = shopId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**充值信息*/
	public static C2S_RECHARGE_INFO() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECHARGE_INFO) as gameProto.C2S_RECHARGE_INFO;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**Vip充值*/
	public static C2S_RECHARGE(id: number, cost: number) {
		// 如果正常流程 走充值接口
		let isNormal = PayModel.NORMAL_RECHARGE_CFG.indexOf(id) >= 0;
		if (isNormal || PlatConst.isRmbPay()) {
			if (PlatConst.isNormalPay()) {
				this.send_C2S_PLAY_ORDERNO(id);
			} else {
				let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_RECHARGE) as gameProto.C2S_RECHARGE;
				data.id = id;
				AGame.ServiceBuilder.sendMessage(data);

			}
		} else {
			if (PropModel.isItemEnough(PropEnum.YU, cost, 1)) {
				this.C2S_JADE_BUY(id);
			}
		}
	}

}