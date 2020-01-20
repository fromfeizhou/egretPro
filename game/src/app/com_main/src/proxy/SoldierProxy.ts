/**
 * 练兵营
 */

class SoldierProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	protected listenerProtoNotifications(): any[] {
		return [
			// [ProtoDef.TRAINING_CLEAN_COOLING, this, 'TrainCleanCoolingReq', 'TrainCleanCoolingResp'],// 请求金币清除练兵冷却
			[ProtoDef.GET_ARMY, this, 'GetArmyReq', 'GetArmyResp'],// 请求兵种数量
			[ProtoDef.ARMY_UPGRADE_LEVEL, this, 'ArmyUpgradeLevelReq', 'ArmyUpgradeLevelResp'],//4002兵种进阶
			// [ProtoDef.TRAINING_ARMY, this, 'TrainingArmyReq', 'TrainingArmyResp'],// 请求训练士兵
			// [ProtoDef.GET_TRAIN_ARMY, this, 'GetTrainArmyReq', 'GetTrainArmyResp'],// 征收士兵
		]
	}

	// 监听协议
	protected listenerProtoNotificationsNew(): any[] {
		return [
			[ProtoDef.C2S_TRAINING_ARMY, this, 'C2S_TRAINING_ARMY', ProxyEnum.SEND],//请求训练士兵
			[ProtoDef.S2C_TRAINING_ARMY, this, 'S2C_TRAINING_ARMY', ProxyEnum.RECEIVE],//训练士兵

			[ProtoDef.C2S_TRAINING_SPEED, this, 'C2S_TRAINING_SPEED', ProxyEnum.SEND],//加速练兵
			[ProtoDef.S2C_TRAINING_SPEED, this, 'S2C_TRAINING_SPEED', ProxyEnum.RECEIVE],//加速练兵

			[ProtoDef.C2S_TRAINING_GET, this, 'C2S_TRAINING_GET', ProxyEnum.SEND],//请求收兵
			[ProtoDef.S2C_TRAINING_GET, this, 'S2C_TRAINING_GET', ProxyEnum.RECEIVE],//请求收兵

		];
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		debug("PropProxy body:", body);
		switch (protocol) {
			////练兵清CD
			case ProtoDef.S2C_TRAINING_SPEED: {
				let data = body as gameProto.IS2C_TRAINING_SPEED;
				if (data.itemId == 0) {
					MainMapModel.resetArmysByBuildid(data.bId);
					SoldierProxy.send_C2S_TRAINING_GET(data.bId);
					// SoldierProxy.send_GET_ARMY();
				} else {
					MainMapModel.SpeedUpTrain(data.bId, data.speedTime);
					let armType = MainMapModel.getSoliderTypeByBuildId(data.bId);
					// SoldierProxy.send_GET_ARMY();
					if (!MainMapModel.isInTrain(data.bId)) {
						// 主动获得获得练兵信息
						SoldierProxy.send_GET_ARMY();
					}
				}

				let soldierType = MainMapModel.getSoliderTypeByBuildId(data.bId);
				com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, soldierType);

				break;
			}
			case ProtoDef.GET_ARMY: {//请求兵种数量
				let arr = TeamModel.parseTroopsInfo(body);
				break;
			}
			case ProtoDef.ARMY_UPGRADE_LEVEL: {//兵种升级
				let data = body as gameProto.ArmyUpgradeLevelResp;
				let info = TeamModel.getTroopsInfo(data.armyType);
				info.level = data.level;
				let param = {
					armyType: body.armyType,
					level: body.level
				}
				com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_UPGRADE, param);
				break;
			}

			case ProtoDef.S2C_TRAINING_ARMY: {
				if (body.trainArmy) {
					MainMapModel.updateArmyInfo(body.trainArmy);
					//更新状态
					MainMapModel.updateBuildArmysById(body.trainArmy.bId)
					let soldierType = MainMapModel.getSoliderTypeByBuildId(body.trainArmy.bId);
					com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, soldierType);
					break;
				}
			}

			case ProtoDef.S2C_TRAINING_GET: {//征收士兵回调
				let buildVo = MainMapModel.getBuildInfo(body.bId);
				//清掉建筑存量士兵
				buildVo.clearTrainOutNum();
				SoldierProxy.send_GET_ARMY();
				com_main.EventMgr.dispatchEvent(ArmyEvent.ARMY_FINISH, null);
				break;
			}
			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**请求练兵 */
	public static send_TRAINING_ARMY(bId, num) {

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TRAINING_ARMY);
		data.bId = bId;
		if (num <= 0) return;
		data.num = num;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**练兵加速 */
	public static send_C2S_TRAINING_SPEED(bId: number, propId: number, num: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TRAINING_SPEED);
		data.bId = bId;
		data.itemId = propId;
		data.itemNum = num;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**请求兵数据 */
	public static send_GET_ARMY() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_ARMY);
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**兵种升级 */
	public static send_ARMY_UPGRADE_LEVEL(type) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.ARMY_UPGRADE_LEVEL);
		data.armyType = type;
		AGame.ServiceBuilder.sendMessage(data);
	}

	public static send_C2S_TRAINING_GET(bId: number) {

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TRAINING_GET);
		data.bId = bId;
		AGame.ServiceBuilder.sendMessage(data);
	}

}