
//转盘
class TurnplateProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.TURN_TABLE_VIEW, this, 'TurnTableReq', 'TurnTableResp'], //获取转盘信息
			[ProtoDef.SPIN_TURN_TABLE, this, 'SpinTurnTableReq', 'SpinTurnTableResp'], //获取转盘奖励
		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
            case ProtoDef.TURN_TABLE_VIEW: {
				TurnplateModel.initTurnTableInfo(body);
				break;
			}
			case ProtoDef.SPIN_TURN_TABLE: {
				break;
			}
        }
		AGame.ServiceBuilder.notifyView(notification);
	}

    	/**转盘信息 */
	public static send_TURN_TABLE_VIEW() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.TURN_TABLE_VIEW);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**转盘奖励 */
	public static send_SPIN_TURN_TABLE() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.SPIN_TURN_TABLE);
		AGame.ServiceBuilder.sendMessage(data);
	}



}