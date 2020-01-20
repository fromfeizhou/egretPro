/**
 * 聚宝盆协议（附加藏宝阁协议）
 */

class CornucopiaProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	// protected listenerProtoNotifications(): any[] {
	// 	return [
	// 		[ProtoDef.Generate_Silver_Coin, this, 'GenerateSivlerCoinReq', 'GenerateSivlerCoinResp'],// 聚宝
	// 		[ProtoDef.Extra_Gold, this, 'ExtraGoldReq', 'ExtraGoldResp'],// 额外元宝
	// 		[ProtoDef.Jackpot_Info, this, 'JackpotInfoReq', 'JackpotInfoResp'],// 聚宝基本信息
	// 	]
	// }
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_TREASURE_WASHBOWL_USE, this, 'C2S_TREASURE_WASHBOWL_USE', ProxyEnum.SEND],	//聚宝
			[ProtoDef.S2C_TREASURE_WASHBOWL_USE, this, 'S2C_TREASURE_WASHBOWL_USE', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_TREASURE_WASHBOWL_EXTRAGOLD, this, 'C2S_TREASURE_WASHBOWL_EXTRAGOLD', ProxyEnum.SEND],	//额外元宝
			[ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD, this, 'S2C_TREASURE_WASHBOWL_EXTRAGOLD', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_TREASURE_WASHBOWL_INFO, this, 'C2S_TREASURE_WASHBOWL_INFO', ProxyEnum.SEND],	//聚宝基本信息
			[ProtoDef.S2C_TREASURE_WASHBOWL_INFO, this, 'S2C_TREASURE_WASHBOWL_INFO', ProxyEnum.RECEIVE],
		]
	}


	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) { // 聚宝基本信息
			case ProtoDef.S2C_TREASURE_WASHBOWL_INFO: {
				if (body) {
					CornucopiaModel.setCornucopiaInfo(body);
					if (CornucopiaProxy.isOpenView) {
						CornucopiaProxy.isOpenView = false;
						Utils.open_view(TASK_UI.Cornucopai_PANEL);
					}
				}
				break;
			}
			case ProtoDef.S2C_TREASURE_WASHBOWL_EXTRAGOLD: {// 额外元宝
				CornucopiaModel.setCornucopiaTime(body.refreshTime);
				break;
			}
			case ProtoDef.S2C_TREASURE_WASHBOWL_USE: {//  聚宝
				break;
			}

			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**聚宝基本信息-打开界面 isopen = true */
	public static C2S_TREASURE_WASHBOWL_INFO_OPEN_VIEW() {
		this.isOpenView = true;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_INFO);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**聚宝基本信息-不打开界面  isopen = false  */
	public static C2S_TREASURE_WASHBOWL_INFO() {
		this.isOpenView = false;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_INFO);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**聚宝 */
	public static C2S_TREASURE_WASHBOWL_USE() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_USE);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**额外元宝 */
	public static C2S_TREASURE_WASHBOWL_EXTRAGOLD() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TREASURE_WASHBOWL_EXTRAGOLD);
		AGame.ServiceBuilder.sendMessage(data);
	}


}