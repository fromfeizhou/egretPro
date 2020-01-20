
class MainMapProxy extends BaseProxy {

	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.BUILDING_CLEAN_COOLING, this, 'BuildingCleanCoolingReq', 'BuildingCleanCoolingResp'],// 请求金币清除冷却
			[ProtoDef.PUSH_BUILDING_OPEN, this, '', 'BuildingOpenInfo'],// 推送建筑开放信息
		]
	}

	// 监听协议
	protected listenerProtoNotificationsNew(): any[] {
		return [
			[ProtoDef.C2S_TOUCH_BUILDING, this, 'C2S_TOUCH_BUILDING', ProxyEnum.SEND],//通知服务器建筑升级

			[ProtoDef.C2S_BUILDING_INFO, this, 'C2S_BUILDING_INFO', ProxyEnum.SEND],//请求建筑信息
			[ProtoDef.S2C_BUILDING_INFO, this, 'S2C_BUILDING_INFO', ProxyEnum.RECEIVE],//请求建筑信息

			[ProtoDef.C2S_BUILDING_ACTIVATED, this, 'C2S_BUILDING_ACTIVATED', ProxyEnum.SEND],//请求建筑激活 
			[ProtoDef.S2C_BUILDING_ACTIVATED, this, 'S2C_BUILDING_ACTIVATED', ProxyEnum.RECEIVE],//请求建筑激活 

			[ProtoDef.C2S_BUILDING_UPLEVEL, this, 'C2S_BUILDING_UPLEVEL', ProxyEnum.SEND],//请求建筑升级
			[ProtoDef.S2C_BUILDING_UPLEVEL, this, 'S2C_BUILDING_UPLEVEL', ProxyEnum.RECEIVE],//请求建筑升级  

			[ProtoDef.C2S_BUILDING_SPEED, this, 'C2S_BUILDING_SPEED', ProxyEnum.SEND],//请求建筑加速  
			[ProtoDef.S2C_BUILDING_SPEED, this, 'S2C_BUILDING_SPEED', ProxyEnum.RECEIVE],//请求建筑加速  	

			[ProtoDef.C2S_BUILDING_LEVY, this, 'C2S_BUILDING_LEVY', ProxyEnum.SEND],//征收资源
			[ProtoDef.S2C_BUILDING_LEVY, this, 'S2C_BUILDING_LEVY', ProxyEnum.RECEIVE],//征收资源

		];
	}


	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.S2C_BUILDING_INFO: {// 请求建筑信息
				//let buildings = body.buildings;

				MainMapModel.init(body);

				break;
			}
			case ProtoDef.S2C_BUILDING_ACTIVATED: {// 请求建筑激活
				let data = body as gameProto.IS2C_BUILDING_ACTIVATED;
				MainMapModel.updateBuild(data.building);
				if (data.buildingLevy) {
					MainMapModel.initBuildLevy([data.buildingLevy]);
				}
				if (data.trainArmys) {
					MainMapModel.initBuildArmy([data.trainArmys]);
				}
				com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);
				com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_ACTIVATED, data.building.id);

				break;
			}
			case ProtoDef.S2C_BUILDING_UPLEVEL: {// 请求建筑升级
				Loading.hide();
				let data = body as gameProto.IS2C_BUILDING_UPLEVEL;
				let bId = body.bId;
				if (data.resultCode == 0) {

					//zb
					// let startTime = (<Long>body.buildStartTime).toNumber();
					// let endTime = (<Long>body.buildEndTime).toNumber();
					// let harvestTime = (<Long>body.harvestTime).toNumber();
					let startTime = body.buildStartTime;
					let endTime = body.buildEndTime;
					let harvestTime = body.harvestTime;

					MainMapModel.resetHarvestTimeById(bId, harvestTime);
					MainMapModel.startBuildUpLevel(bId, startTime, endTime);
					com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);
				} else {
					MainMapModel.setLevel(bId, data.newLevel)
				}


				break;
			}
			case ProtoDef.PUSH_BUILDING_OPEN: {// 推送建筑开放信息
				let building = body.building;
				for (var key in building) {
					if (building.hasOwnProperty(key)) {
						var element = building[key];
						MainMapModel.updateBuild(element)
					}
				}

				break;
			}
			case ProtoDef.S2C_BUILDING_SPEED: {// 请求建筑加速
				Loading.hide();
				let data = body as gameProto.IS2C_BUILDING_SPEED;
				if (data.retCode == 0) {
					if (data.speedTime == 0) {//0 代表立刻完成
						MainMapModel.finishBuildUpLevel(data.bId);
						com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_FAST_UP_LEVEL, data.bId);
					} else {
						// let speedTime = Long.fromValue(body.speedTime).toNumber();
						MainMapModel.addBuildUpLvSpeed(data.bId, data.speedTime);
					}
				}
				break;
			}
			case ProtoDef.BUILDING_CLEAN_COOLING: {// 请求金币清除冷却
				Loading.hide();
				MainMapModel.finishBuildUpLevel(body.bId);
				break;
			}
			case ProtoDef.S2C_BUILDING_LEVY: {//征收资源回调
				let data = body as gameProto.IS2C_BUILDING_LEVY;
				Loading.hide();
				let errorCode = data.errorCode;
				let buildingLevy = data.buildingLevy;

				if (errorCode > 0) {
					Utils.showErrorCode(errorCode);
				}

				if (data.levyData) {
					let element = data.levyData;
					let type = element.type;
					// //zb
					// // let harvestTime = (<Long>element.harvestTime).toNumber();
					// let harvestTime = element.harvestTime;

					if (errorCode == 0) {
						let harvestTime = data.buildingLevy[0].harvestTime;
						MainMapModel.resetHarvestTime(type, harvestTime);
					}

					com_main.MainMap.zsCall(type);
				}
				// if (data.buildingLevy) {
				// 	MainMapModel.initBuildLevy(data.buildingLevy);
				// }

				break;
			}

			// case ProtoDef.MANUFACTURE_PROPS: {
			// 	MainMapModel.addprops(body.prop);
			// 	break;
			// }
			// case ProtoDef.GET_PROPS: {
			// 	MainMapModel.deleteprops(body.id);
			// 	break;
			// }
			// case ProtoDef.PUSH_BUILDING_ITEM: {
			// 	MainMapModel.addBuildItems(body.items, false);
			// 	break;
			// }
			// case ProtoDef.GET_BUILDING_ITEM: {
			// 	let bid = body.bid;
			// 	MainMapModel.removeBuildItem(bid);
			// 	break;
			// }

			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**通知服务器建筑升级 */
	public static C2S_TOUCH_BUILDING(bId) {
		let data: gameProto.C2S_TOUCH_BUILDING = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TOUCH_BUILDING);
		data.bId = bId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**请求建筑信息 */
	public static send_BUILDING_INFO() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_INFO);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**请求建筑激活 */
	public static send_BUILDING_ACTIVATED(bId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_ACTIVATED);
		data.bId = bId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**请求建筑升级 */
	public static send_BUILDING_UP_LEVEL(bId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_UPLEVEL);
		data.bId = bId;
		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}

	/**请求建筑加速 */
	public static send_BUILDING_SPEED(bId: number, propId: number, num: number, isConst: boolean = false) {
		if (!isConst) {
			let buildVo = MainMapModel.getBuildInfo(bId);
			if (!buildVo || buildVo.isBuildEnd()) return;
		}
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_SPEED);
		data.bId = bId;
		data.itemId = propId;
		data.itemNum = num;
		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}

	/**请求金币清除冷却 */
	public static send_BUILDING_CLEAN_COOLING(bId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.BUILDING_CLEAN_COOLING);
		data.bId = bId;
		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}

	/**征收资源
	 * bId  建筑id（传-1为一键征收）
	 */
	public static send_BUILDING_LEVY(type: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_BUILDING_LEVY);
		data.type = type;
		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}

}