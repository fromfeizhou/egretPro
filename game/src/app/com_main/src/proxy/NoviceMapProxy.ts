class NoviceMapProxy extends BaseProxy {

    protected listenerProtoNotifications(): any[] {
        return [
            // [ProtoDef.CITY_BATTLE_NOVICE_AFFAIR, this, 'CityBattleNoviceAffairsReq', 'CityBattleNoviceAffairsResp'],//请求世界地图数据
            // [ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR, this, 'CityBattleTriggerNoviceAffairReq', 'CityBattleTriggerNoviceAffairResp'],//触发新手城池外事件请求
            // [ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD, this, 'CityBattleGainNoviceAffairRewardReq', 'CityBattleGainNoviceAffairRewardResp'],//获取新手城池外事件奖励结果
        ];
    }

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		// switch (protocol) {
        //     //请求新手 世界事件的信息
		// 	case ProtoDef.CITY_BATTLE_NOVICE_AFFAIR: {
        //         var remove_ids = {};

		// 		// if (body.type == WorldEventType.GOVERNMENT_AFFAIRS) {
		// 		// 	remove_ids = WorldMapModel.clearWorldEvents(WorldEventType.GOVERNMENT_AFFAIRS);
		// 		// }

		// 		remove_ids = NoviceMapModel.clearWorldEvents();

		// 		let result = NoviceMapModel.analysisWorldEvent(body);

		// 		let data = {
		// 			'type': body.type,
		// 			'list': result,
		// 			'remove_ids': remove_ids
		// 		}
		// 		notification.setBody(data);
		// 		break;
		// 	}
        //     //触发新手城池外事件请求
        //     case ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR: {
        //         let result = NoviceMapModel.onTouchWorldEvent(body);

		// 		notification.setBody(result);
		// 		break;
		// 	}
        //     //获取新手城池外事件奖励结果
        //     case ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD: {
        //         NoviceMapModel.removeWorldEvent(body.id, body.index);
		// 		break;
		// 	}
		// 	default:
		// 		break;
		// }

		AGame.ServiceBuilder.notifyView(notification);
	}

	// /**请求新手 世界事件的信息 */
	// public static send_CITY_BATTLE_NOVICE_AFFAIR() {
	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_NOVICE_AFFAIR);
	// 	AGame.ServiceBuilder.sendMessage(data, null, null, false);
	// }

    // /**触发新手城池外事件请求 */
	// public static send_CITY_BATTLE_TRIGGER_NOVICE_AFFAIR(index:number) {
	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR);
	// 	data.index = index;
	// 	AGame.ServiceBuilder.sendMessage(data, null, null, false);
	// }

    // /**获取新手城池外事件奖励结果 */
	// public static send_CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD(index:number) {
	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD);
	// 	data.index = index;
	// 	AGame.ServiceBuilder.sendMessage(data, null, null, false);
	// }

}