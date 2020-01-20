// class TankProxy extends BaseProxy {
// 	public static tag_resp_open_info_view = false;
// 	/**购买请求ID */
// 	public static temp_request_buy: number;
// 	/**使用请求ID */
// 	public static temp_request_use: number;
// 	/**强化请求类型 */
// 	public static temp_request_strengthen: number;
// 	public constructor() {
// 		super();
// 	}
// 	protected listenerProtoNotifications(): any[] {
// 		return [
// 			[ProtoDef.TANK_INFO, this, 'TankInfoReq', 'TankInfoResp'],//获取战车信息
// 			[ProtoDef.TANK_STRENGTHEN, this, 'TankStrengthenReq', 'TankStrengthenResp'],//战车强化
// 			[ProtoDef.TANK_USE, this, 'TankUseReq', 'TankUseResp'],//使用战车
// 			[ProtoDef.TANK_BUY, this, 'TankBuyReq', 'TankBuyResp'],//购买战车
// 		];
// 	}
// 	public execute(notification: AGame.INotification) {
// 		let protocol: number = Number(notification.getName());
// 		let body = notification.getBody();
// 		switch (protocol) {
// 			case ProtoDef.TANK_INFO: {
// 				TankModel.setTankInfo(body);
// 				if (TankProxy.tag_resp_open_info_view)
// 					AGame.R.notifyView(TASK_UI.POP_TANK_OPEN);
// 				break;
// 			}
// 			case ProtoDef.TANK_STRENGTHEN: {
// 				let vo = TankModel.getTankVo();
// 				let addExp = body.tankExp - vo.tankExp;
// 				let addExpFixed = vo.getStrengthenAddExp(TankProxy.temp_request_strengthen);
// 				if (addExp > addExpFixed) {
// 					//FIX ME
// 					EffectUtils.showTips("暴击", 1, false);
// 				}
// 				TankModel.updateTankInfo(body);
// 				break;
// 			}
// 			case ProtoDef.TANK_USE: {
// 				let vo = TankModel.getTankVo();
// 				vo.tankSkinId = TankProxy.temp_request_use;
// 				break;
// 			}
// 			case ProtoDef.TANK_BUY: {
// 				TankProxy.send_TANK_INFO();
// 				break;
// 			}
// 			default:
// 				break;
// 		}
// 		AGame.ServiceBuilder.notifyView(notification);
// 	}
// 	/////////////////////////////////////////////////////////////////////
// 	/**
// 	 * 获取战车信息
// 	 */
// 	public static send_TANK_INFO(open: boolean = false) {
// 		debug("RankProxy:send_TANK_INFO--->>");
// 		TankProxy.tag_resp_open_info_view = open;
// 		let data = AGame.ServiceBuilder.newClazz(ProtoDef.TANK_INFO);
// 		AGame.ServiceBuilder.sendMessage(data);
// 	}
// 	/**
// 	 * 战车强化
// 	 */
// 	public static send_TANK_STRENGTHEN(consumeType) {
// 		debug("RankProxy:send_TANK_STRENGTHEN--->>");
// 		TankProxy.temp_request_strengthen = consumeType;
// 		let data = AGame.ServiceBuilder.newClazz(ProtoDef.TANK_STRENGTHEN);
// 		data.type = consumeType;
// 		AGame.ServiceBuilder.sendMessage(data);
// 	}
// 	/**
// 	 * 使用战车
// 	 */
// 	public static send_TANK_USE(skinId) {
// 		debug("RankProxy:send_TANK_USE--->>");
// 		TankProxy.temp_request_use = skinId;
// 		let data = AGame.ServiceBuilder.newClazz(ProtoDef.TANK_USE);
// 		data.tankSkinId = skinId;
// 		AGame.ServiceBuilder.sendMessage(data);
// 	}
// 	/**
// 	 * 购买战车
// 	 */
// 	public static send_TANK_BUY(skinId) {
// 		debug("RankProxy:send_TANK_BUY--->>");
// 		TankProxy.temp_request_buy = skinId;
// 		let data = AGame.ServiceBuilder.newClazz(ProtoDef.TANK_BUY);
// 		data.tankSkinId = skinId;
// 		AGame.ServiceBuilder.sendMessage(data);
// 	}
// }
