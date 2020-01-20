/**
 * 功能协议处理
 */
class FunctionProxy extends BaseProxy {
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_FUNCTION_PREVIEW, this, 'C2S_FUNCTION_PREVIEW', ProxyEnum.SEND],// 每日奖励
			[ProtoDef.S2C_FUNCTION_PREVIEW, this, 'S2C_FUNCTION_PREVIEW', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_FUNCTION_INFO,    this, 'C2S_FUNCTION_INFO', ProxyEnum.SEND],
			[ProtoDef.S2C_FUNCTION_INFO,    this, 'S2C_FUNCTION_INFO', ProxyEnum.RECEIVE],
		]
	}
	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let protocol: number = Number(notification.getName());
		switch (protocol) {
			case ProtoDef.S2C_FUNCTION_INFO: {
				FunctionModel.updateFunctionList(body.funtionIds);
				break;
			}
			case ProtoDef.S2C_FUNCTION_PREVIEW: {
				let data = body as gameProto.S2C_FUNCTION_PREVIEW;
				FunctionModel.updateFunction(data);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	/**发送功能预览状态 */
	public static send_C2S_FUNCTION_INFO() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_FUNCTION_INFO) as gameProto.C2S_FUNCTION_INFO;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**发送功能预览状态 */
	public static C2S_FUNCTION_PREVIEW(funcId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_FUNCTION_PREVIEW) as gameProto.C2S_FUNCTION_PREVIEW;
		data.functionId = funcId;
		AGame.ServiceBuilder.sendMessage(data);
	}
}