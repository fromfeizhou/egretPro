
class GuideProxy extends BaseProxy {

	/**第二版协议监听 */
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_GUIDE_RECORD, this, 'C2S_GUIDE_RECORD', ProxyEnum.SEND], 		//查询新手进度
			[ProtoDef.S2C_GUIDE_RECORD, this, 'S2C_GUIDE_RECORD', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_GUIDE_COMMIT, this, 'C2S_GUIDE_COMMIT', ProxyEnum.SEND], //新手指引提交
		];
	}

	public execute(notification: AGame.INotification) {

		let body = notification.getBody();
		let protocol: number = Number(notification.getName());
		switch (protocol) {
			case ProtoDef.S2C_GUIDE_RECORD: {
				let data = body as gameProto.IS2C_GUIDE_RECORD;
				GuideModel.parseGuideRecord(data.records);
				break;
			}
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**查询新手进程 */
	public static C2S_GUIDE_RECORD() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GUIDE_RECORD);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**提交新手进程 */
	public static C2S_GUIDE_COMMIT(id: number) {
		if(RoleData.playerId == 0) return ; 
		if (!GuideModel.records || GuideModel.records.indexOf(id) >= 0) return;
		GuideModel.records.push(id);

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GUIDE_COMMIT) as gameProto.IC2S_GUIDE_COMMIT;
		data.id = id;
		AGame.ServiceBuilder.sendMessage(data);
	}

}