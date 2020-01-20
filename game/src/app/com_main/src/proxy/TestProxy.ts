class TestProxy extends BaseProxy {

	protected listenerProtoNotifications(): any[] {
        return [
            [ProtoDef.S2C_WAR_BATTLE_INIT, this, 'BattleListReq', 'BattleListResp'],//请求所有战场信息
        ];
    }

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
	}

	public static test() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.S2C_WAR_BATTLE_INIT);
		AGame.ServiceBuilder.sendMessage(data);
	}
}