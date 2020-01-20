class TechnologyProxy extends BaseProxy {

	public static isOpenView: boolean = true;

	protected listenerProtoNotificationsNew(): any[] {
		return [
			[ProtoDef.C2S_TECHNOLOGY_VIEW, this, 'C2S_TECHNOLOGY_VIEW', ProxyEnum.SEND],// 科技信息
			[ProtoDef.S2C_TECHNOLOGY_VIEW, this, 'S2C_TECHNOLOGY_VIEW', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_TECHNOLOGY_UPGRADE, this, 'C2S_TECHNOLOGY_UPGRADE', ProxyEnum.SEND],// 科技升级
			[ProtoDef.S2C_TECHNOLOGY_UPGRADE, this, 'S2C_TECHNOLOGY_UPGRADE', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_TECHNOLOGY_INFO, this, 'C2S_TECHNOLOGY_INFO', ProxyEnum.SEND],// 科技信息刷新请求
			[ProtoDef.S2C_TECHNOLOGY_INFO, this, 'S2C_TECHNOLOGY_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_TECHNOLOGY_SPEEDUP, this, 'C2S_TECHNOLOGY_SPEEDUP', ProxyEnum.SEND],// 科技升级加速
			[ProtoDef.S2C_TECHNOLOGY_SPEEDUP, this, 'S2C_TECHNOLOGY_SPEEDUP', ProxyEnum.RECEIVE],
		];
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.S2C_TECHNOLOGY_VIEW: {
				let data = body as gameProto.IS2C_TECHNOLOGY_VIEW;
				TechnoModel.parseTechnoList(data.technoloyList);
				TechnoModel.parseTimeData(data.upgradeState);
				break;
			}
			case ProtoDef.S2C_TECHNOLOGY_UPGRADE: {
				let data = body as gameProto.IS2C_TECHNOLOGY_UPGRADE;
				if (data.errorCode == 0) {
					if (!data.gold) {
						TechnoModel.parseTimeData(data.upgradeState);
					} else {
						TechnoModel.updateTechnoInfo(data.technology);
						// 主动获得获得练兵信息
						SoldierProxy.send_GET_ARMY();//科技会有加成
					}

				}
				break;
			}
			case ProtoDef.S2C_TECHNOLOGY_INFO: {
				let data = body as gameProto.IS2C_TECHNOLOGY_INFO;
				TechnoModel.updateTechnoInfo(data.technology);
				// 主动获得获得练兵信息
				SoldierProxy.send_GET_ARMY();//科技会有加成
				break;
			}
			case ProtoDef.S2C_TECHNOLOGY_SPEEDUP: {
				let data = body as gameProto.IS2C_TECHNOLOGY_SPEEDUP;
				if (data.errorCode == 0) {
					TechnoModel.parseTimeData(data.state);
				}
				break;
			}
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**
	 * 科技面板请求
	 */
	public static C2S_TECHNOLOGY_VIEW() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_VIEW);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 升级科技请求
	 */
	public static C2S_TECHNOLOGY_UPGRADE(id: number, isGold: boolean) {
		let data: gameProto.IC2S_TECHNOLOGY_UPGRADE = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_UPGRADE);
		data.id = id;
		data.gold = isGold;
		AGame.ServiceBuilder.sendMessage(data);
	}

	//请求某个科技数据（倒数后请求）
	public static C2S_TECHNOLOGY_INFO(id: number) {
		let data: gameProto.IC2S_TECHNOLOGY_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_INFO);
		data.id = id;
		AGame.ServiceBuilder.sendMessage(data);
	}

	//请求科技立刻升级
	public static C2S_TECHNOLOGY_SPEEDUP(id: number, itemId: number, num: number) {
		let data: gameProto.IC2S_TECHNOLOGY_SPEEDUP = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TECHNOLOGY_SPEEDUP);
		data.id = id;
		data.itemId = itemId;
		data.num = num;
		AGame.ServiceBuilder.sendMessage(data);

	}
}