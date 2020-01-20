class WorldMapProxy extends BaseProxy {

	public static m_pVersion: number = null;//城池缓存的数据版本


    protected listenerProtoNotifications(): any[] {
        return [
            // [ProtoDef.CITY_BATTLE_LOAD_WORLD_MAP, this, 'CityBattleLoadWorldMapReq', 'CityBattleLoadWorldMapResp'],//请求世界地图数据
            // [ProtoDef.CITY_BATTLE_ENTER, this, 'CityBattleEnterReq', 'CityBattleEnterResp'],//进入城池
			// [ProtoDef.CITY_BATTLE_CITY_INFO, this, 'CityBattleCityInfoReq', 'CityBattleCityInfoResp'], //查看城池信息
			// [ProtoDef.CITY_BATTLE_PUSH_WIN_REWARD, this, '', 'CityBattleWinRewardResp'],//攻守战奖励推送
			// [ProtoDef.CITY_BATTLE_UPDATE_CITY, this, '', 'CityBattleUpdateCityResp'],//推送更新单个城池
			// [ProtoDef.CITY_BATTLE_WORLD_AFFAIRS, this, 'CityBattleWorldAffairsReq', 'CityBattleWorldAffairsResp'],//世界事件的信息
			// [ProtoDef.CITY_BATTLE_TRIGGER_WORLD_AFFAIR, this, 'CityBattleTriggerWorldAffairReq', 'CityBattleTriggerWorldAffairResp'],//触发城池外事件请求
			// [ProtoDef.CITY_BATTLE_GAIN_WORLD_AFFAIR_REWARD, this, 'CityBattleGainWorldAffairRewardReq', 'CityBattleGainWorldAffairRewardResp'],//获取城池外事件奖励请求
			[ProtoDef.COUNTRY_ALLIANCE, this, 'CountryAllianceReq', 'CountryAllianceResp'],//查询国家结盟状态信息
			// [ProtoDef.CITY_BATTLE_TARGET_CITY, this, '', 'CityBattleTargetCityResp'],//国君可选择攻击目标城池
			// [ProtoDef.CITY_BATTLE_CHOOSE_CITY, this, 'CityBattleChooseCityReq', 'CityBattleChooseCityResp'],//国君选择攻击城池
			// [ProtoDef.PUSH_RESOURCE_REWARD, this, '', 'ResourceRewardInfo'],//决战奖励开放提示
			// [ProtoDef.CITY_BATTLE_WARRIOR, this, '', 'CityBattleWarriorResp'],//通知猛将提示
			// [ProtoDef.CITY_BATTLE_EXIT_WORLD_MAP, this, 'CityBattleExitWorldMap', ''],//通知猛将提示

        ];
    }

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {//请求世界数据结果
            // case ProtoDef.CITY_BATTLE_LOAD_WORLD_MAP: {
			// 	debug("世界地图数据返回:", body);
			// 	// debug("WorldMapProxy executes:", body);
			// 	WorldMapProxy.m_pVersion = body.version;
			// 	WorldMapModel.initCityBuildInfo(body.cityBattleInfo);

			// 	if (SceneManager.getCurrScene() == SceneEnums.WORLD_CITY)
			// 		Utils.open_view(TASK_UI.MAP_WORLD);
			// 	FiefModel.eventHandler(EventEnum.FIEF_LOGIN_GETRES, null);
			// 	FiefModel.eventHandler(EventEnum.FIEF_GRAB, null);
			// 	FiefModel.eventHandler(EventEnum.FIEF_CONSTRU, null);
			// 	FiefModel.eventHandler(EventEnum.FIEF_OPENVIEW_PRE, null);
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_ENTER: {//进入城池

			// 	let bid = body.battleId;
			// 	debug("获取数据", body);
			// 	SceneManager.enterScene(SceneEnums.BATTLE_MAP, bid);
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_CITY_INFO: {//请求城池信息结果返回
			// 	// debug("请求城池信息结果返回:", body);		
			// 	if (RoleData.isAuto) {
			// 		Utils.TimerManager.doTimer(2000, 1, () => {
			// 			SceneManager.enterScene(SceneEnums.BATTLE_MAP, body.battleId);
			// 		}, this);
			// 	}

			// 	Utils.open_view(TASK_UI.POP_MAP_BUILD_INFO, body);
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_PUSH_WIN_REWARD: {//攻守战奖励推送
			// 	if (body.endTime) {
			// 		body.type = WorldEvent.WIN_REWARD;
			// 		//zb
			// 		// body.startTime = (<Long>body.startTime).toNumber();
			// 		// body.endTime = (<Long>body.endTime).toNumber();
			// 		body.startTime = body.startTime;
			// 		body.endTime = body.endTime;
			// 		body.index = 0;
			// 		WorldMapModel.addWorldEvent(body.id, body);
			// 	}
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_UPDATE_CITY: {//推送更新单个城池
			// 	// debug("推送更新单个城池:",body);
			// 	WorldMapModel.updateCityBuildInfo(body.cityBattleInfo);
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_WORLD_AFFAIRS: {//世界事件的信息
			// 	var remove_ids = {};

			// 	// if (body.type == WorldEventType.GOVERNMENT_AFFAIRS) {
			// 	// 	remove_ids = WorldMapModel.clearWorldEvents(WorldEventType.GOVERNMENT_AFFAIRS);
			// 	// }

			// 	remove_ids = WorldMapModel.clearWorldEvents(body.type);

			// 	let result = WorldMapModel.analysisWorldEvent(body);

			// 	let data = {
			// 		'type': body.type,
			// 		'list': result,
			// 		'remove_ids': remove_ids
			// 	}
			// 	notification.setBody(data);
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_TRIGGER_WORLD_AFFAIR: {//触发城池外事件请求
			// 	// debug('触发城池外事件请求:', body);
			// 	let result = WorldMapModel.onTouchWorldEvent(body);


			// 	notification.setBody(result);
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_GAIN_WORLD_AFFAIR_REWARD: {//获取城池外事件请求
			// 	// debug('获取城池外事件请求:', body);
			// 	WorldMapModel.removeWorldEvent(body.id, body.index);
			// 	break;
			// }
			case ProtoDef.COUNTRY_ALLIANCE: {
				let isAlliance = body.isAlliance;//true 结盟   false 解除结盟
				let countryOne = body.countryOne;
				let countryTwo = body.countryTwo;

				let self_coutry = RoleData.countryId;

				if (isAlliance) {
					if (countryOne != self_coutry && countryTwo != self_coutry) {
						RoleData.alliance = -1;//大国崛起状态
					} else {
						RoleData.alliance = countryOne == self_coutry ? countryTwo : countryOne;//结盟国家id
					}
				} else {
					RoleData.alliance = 0;
				}
				break;
			}
			// case ProtoDef.CITY_BATTLE_TARGET_CITY: {//国家攻击目标
			// 	//zb
			// 	let endTime = body.endTime;
			// 	let cityIds = body.cityIds;

			// 	WorldMapModel.addSelectAttackTargetIds(cityIds, endTime);
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_CHOOSE_CITY: {//选择攻击目标回调
			// 	break;
			// }
			// case ProtoDef.PUSH_RESOURCE_REWARD: {//决战奖励提示
			// 	console.log("收到决战奖励", body.isReward);
			// 	if (com_main.WorldMap.getClass()) {
			// 		com_main.WorldMap.getClass().updateMineReward(body.isReward);
			// 	} else {
			// 		com_main.WorldMap.isHasMineReward = body.isReward;
			// 	}
			// 	break;
			// }
			// case ProtoDef.CITY_BATTLE_WARRIOR: {//通知猛将提示
			// 	WorldMapModel.setMJData(body);
			// 	break;
			// }
			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**请求世界地图数据 */
	public static send_CITY_BATTLE_LOAD_WORLD_MAP() {
		debug("请求世界地图数据");
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_LOAD_WORLD_MAP);

		if (WorldMapProxy.m_pVersion != null)
			data.version = WorldMapProxy.m_pVersion;

		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}

	/**进入城池（战斗） */
	// public static send_CITY_BATTLE_ENTER(build_id: number) {
	// 	// debug("city_battle_enter");
	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_ENTER);
	// 	data.id = build_id;

	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	/**请求城池信息 */
	// public static send_CITY_BATTLE_CITY_INFO(build_id: number) {
	// 	debug("请求城池信息build_id:", build_id);

	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_CITY_INFO);
	// 	data.id = build_id;

	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	/**请求世界事件 */
	// public static send_CITY_BATTLE_WORLD_AFFAIRS(type: WorldEventType) {
	// 	console.log('send_CITY_BATTLE_WORLD_AFFAIRS:', type);
	// 	if (RoleData.countryId == 0) return;

	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_WORLD_AFFAIRS);
	// 	data.type = type;

	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	/**触发城池外事件请求 */
	// public static send_CITY_BATTLE_TRIGGER_WORLD_AFFAIR(index: number) {
	// 	debug('send_CITY_BATTLE_TRIGGER_WORLD_AFFAIR:', index);

	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_TRIGGER_WORLD_AFFAIR);
	// 	data.index = index;

	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	/**获取城池外事件请求 */
	// public static send_CITY_BATTLE_GAIN_WORLD_AFFAIR_REWARD(index: number) {
	// 	debug('CITY_BATTLE_GAIN_WORLD_AFFAIR_REWARD:', index);

	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_GAIN_WORLD_AFFAIR_REWARD);
	// 	data.index = index;

	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	/**查询结盟信息 */
	public static send_COUNTRY_ALLIANCE() {
		RoleData.alliance = 0;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_ALLIANCE);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**国君选择攻击目标城池 */
	// public static send_CITY_BATTLE_CHOOSE_CITY(bId: number) {
	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_CHOOSE_CITY);
	// 	data.id = bId;
	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	// public static send_CITY_BATTLE_EXIT_WORLD_MAP() {
	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_EXIT_WORLD_MAP);
	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

}