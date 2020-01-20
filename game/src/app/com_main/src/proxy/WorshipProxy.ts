/**
 * 膜拜协议
 */

class WorshipProxy extends BaseProxy {

	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_WORSHIP, this, 'C2S_WORSHIP', ProxyEnum.SEND],	//膜拜
			[ProtoDef.S2C_WORSHIP, this, 'S2C_WORSHIP', ProxyEnum.RECEIVE],


            [ProtoDef.C2S_WORSHIP_INFO, this, 'C2S_WORSHIP_INFO', ProxyEnum.SEND],	//膜拜信息
			[ProtoDef.S2C_WORSHIP_INFO, this, 'S2C_WORSHIP_INFO', ProxyEnum.RECEIVE],
		]
	}


	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
            case ProtoDef.S2C_WORSHIP: {
				let data = body as gameProto.IS2C_WORSHIP;
				if (data.ret == 0) {//膜拜成功

                    if(data.worshipType == WorshipType.KING){
                        WorshipModel.worshipState = [{worshipType:WorshipType.KING,canWorship: false}];
                        RedPointModel.onRedPointEvtUpdate(RedEvtType.BATTLE_KING_WORSHIP);
                    }else if(data.worshipType == WorshipType.FIGHT_RANK){
						WorshipModel.worshipState = [{worshipType:WorshipType.FIGHT_RANK,canWorship: false}];
						RedPointModel.onRedPointEvtUpdate(RedEvtType.FIGHT_RANK_WORSHIP);
					}

					Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
					// EffectUtils.showTips('膜拜成功', 1, true);
					WorshipProxy.send_C2S_WORSHIP_INFO(data.worshipType);
				}

				break;
			}

            case ProtoDef.S2C_WORSHIP_INFO: {
                WorshipModel.worshipData = body.datas;
            }

			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**膜拜*/
	public static send_C2S_WORSHIP(worshipType: number, rank: number) {
		let data: gameProto.IC2S_WORSHIP = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WORSHIP);
		data.worshipType = worshipType;
		data.rank = rank;
		AGame.ServiceBuilder.sendMessage(data);
	}

    /**获取膜拜信息*/
	public static send_C2S_WORSHIP_INFO(worshipType: number) {
		let data: gameProto.IC2S_WORSHIP_INFO = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WORSHIP_INFO);
        data.worshipType = worshipType;
		AGame.ServiceBuilder.sendMessage(data);
	}

}