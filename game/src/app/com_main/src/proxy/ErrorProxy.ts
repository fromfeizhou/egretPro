/**
 * 处理错误消息
 * 所有错误的返回都经过这里处理
 */
class ErrorProxy extends BaseProxy {

	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.ERROR_CODE, this, '', 'ErrorCodeResp'],//
		];
	}

	public execute(notification: AGame.INotification) {
		Loading.hide();

		let Service = AGame.ServiceBuilder;
		let body = notification.getBody();
		let protocol: number = notification.getName();

		let cmd = body.cmd;					//对应的请求协议号
		let code = body.code;				//错误码
		let param = body.param;				//提示语参数

		let config = C.ErrorCodeConfig[code]
		if (!config) {
			error("ErrorProxy:execute--->> ProtoDef.PRO_TEST:", body)
			// error(format("ErrorProxy:execute--->> 缺少错误码配置数据！！cmd {1}, code {2}", cmd, code))
			
			return;
		} else {
			if (cmd != 2501) {
				/**替换占位符*/
				let error_msg = GLan(config.name);//读配置
				error_msg = format(error_msg, ...param);
				// error('ErrorProxy:execute--->>'+error_msg);
				error('ErrorProxy:execute--->>', format("cmd {1}, code {2} :{3}", cmd, code, error_msg));
				//EffectUtils.showTips(format("cmd {1}, code {2} :{3}", cmd, code, error_msg), 5, true);
				EffectUtils.showTips( error_msg, 1, true);
			}
		}

	
		switch (cmd) {
			case ProtoDef.S2C_WAR_COMBAT_UNIT: {
				/**如果进入战斗场景报错，则退回世界地图 */
				WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY);
				break;
			}
			// case ProtoDef.BATTLE_JOIN: {
			// 	com_main.BattleSceneMgr.getInstance().focusToNPC();
			// 	break;
			// }
			case ProtoDef.RECEIVE_CELEBRATION_AWARD: {
				com_main.UpManager.close(true);
				break;
			}
			// case ProtoDef.BATTLE_WITHDRAW: {
			// 	if (code == 501) {
			// 		SceneManager.enterScene(SceneEnums.WORLD_CITY);
			// 	}
			// 	break;
			// }
		}
	}
}