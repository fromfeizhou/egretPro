class ChatProxy extends BaseProxy {

	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_CHAT_RECORD_LIST, this, 'C2S_CHAT_RECORD_LIST', ProxyEnum.SEND],// 获取聊天记录
			[ProtoDef.S2C_CHAT_RECORD_LIST, this, 'S2C_CHAT_RECORD_LIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_CHAT_PUSH, this, 'C2S_CHAT_PUSH', ProxyEnum.SEND],// 聊天推送
			[ProtoDef.S2C_CHAT_PUSH, this, 'S2C_CHAT_PUSH', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_CHAT_PRIVATE_LIST, this, 'C2S_CHAT_PRIVATE_LIST', ProxyEnum.SEND],// 私聊列表
			[ProtoDef.S2C_CHAT_PRIVATE_LIST, this, 'S2C_CHAT_PRIVATE_LIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_CHAT_PRIVATE_RECORD_LIST, this, 'C2S_CHAT_PRIVATE_RECORD_LIST', ProxyEnum.SEND],//获取私聊记录
			[ProtoDef.S2C_CHAT_PRIVATE_RECORD_LIST, this, 'S2C_CHAT_PRIVATE_RECORD_LIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_CHAT_PRIVATE_CLEAN, this, 'C2S_CHAT_PRIVATE_CLEAN', ProxyEnum.SEND],//清除私聊列表成员
			[ProtoDef.S2C_CHAT_PRIVATE_CLEAN, this, 'S2C_CHAT_PRIVATE_CLEAN', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_CHAT_PRIVATE_HEAD, this, 'S2C_CHAT_PRIVATE_HEAD', ProxyEnum.RECEIVE],	//私聊列表添加头像

			[ProtoDef.C2S_CHAT_BLACKLIST, this, 'C2S_CHAT_BLACKLIST', ProxyEnum.SEND],//获取黑名单
			[ProtoDef.S2C_CHAT_BLACKLIST, this, 'S2C_CHAT_BLACKLIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_CHAT_ADD_BLACKLIST, this, 'C2S_CHAT_ADD_BLACKLIST', ProxyEnum.SEND],//添加黑名单
			[ProtoDef.S2C_CHAT_ADD_BLACKLIST, this, 'S2C_CHAT_ADD_BLACKLIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_CHAT_DEL_BLACKLIST, this, 'C2S_CHAT_DEL_BLACKLIST', ProxyEnum.SEND],//删除黑名单
			[ProtoDef.S2C_CHAT_DEL_BLACKLIST, this, 'S2C_CHAT_DEL_BLACKLIST', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_CHAT_REPORT, this, 'C2S_CHAT_REPORT', ProxyEnum.SEND],//举报
			[ProtoDef.S2C_CHAT_REPORT, this, 'S2C_CHAT_REPORT', ProxyEnum.RECEIVE],
		]
	}

	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let protocol: number = Number(notification.getName());
		switch (protocol) {
			case ProtoDef.S2C_CHAT_RECORD_LIST: {// 获取聊天记录
				ChatModel.pushChatRecordMsg(body)
				break;
			}
			case ProtoDef.S2C_CHAT_PUSH: {// 聊天推送
				ChatModel.pushChatMsg(body)
				break;
			}
			case ProtoDef.S2C_CHAT_PRIVATE_LIST: {// 私聊列表
				let data = body as gameProto.IS2C_CHAT_PRIVATE_LIST;
				ChatModel.parseHeadList(data.playerHeadPortrait);
				break;
			}
			case ProtoDef.S2C_CHAT_PRIVATE_HEAD: {// 私聊列表添加头像
				let data = body as gameProto.IS2C_CHAT_PRIVATE_HEAD;
				ChatModel.parseHeadList([data.playerHeadPortraitAdd]);
				break;
			}
			case ProtoDef.S2C_CHAT_PRIVATE_RECORD_LIST: {//获取私聊记录
				let data = body as gameProto.IS2C_CHAT_PRIVATE_RECORD_LIST;
				ChatModel.clearPriMsgById(data.playerId);
				ChatModel.pushPriMsg(data.playerId, data.data, true);
				break;
			}
			case ProtoDef.S2C_CHAT_PRIVATE_CLEAN: {//清除私聊列表成员
				if (body.state == 0) {
					ChatModel.delHead(body.playerId);
				}
				break;
			}
			case ProtoDef.S2C_CHAT_BLACKLIST: {//获取黑名单
				let data = body as gameProto.IS2C_CHAT_BLACKLIST;
				ChatModel.pushBlackList(data.headPortrait);
				break;
			}
			case ProtoDef.S2C_CHAT_ADD_BLACKLIST: {//添加黑名单
				let data = body as gameProto.IS2C_CHAT_ADD_BLACKLIST;
				if (data.state == 0) {
					EffectUtils.showTips(GCodeFromat(CLEnum.CHAT_BLACK_SUC,data.headPortrait.playerName));
					ChatModel.pushBlackList([data.headPortrait]);
				}
				break;
			}
			case ProtoDef.S2C_CHAT_DEL_BLACKLIST: {//解除黑名单
				let data = body as gameProto.IS2C_CHAT_DEL_BLACKLIST;
				if (data.state == 0) {
					EffectUtils.showTips(GCode(CLEnum.CHAT_BLACK_DEL));
					ChatModel.delBlackList(data.playerId);
				}
				break;
			}
			case ProtoDef.S2C_CHAT_REPORT: {//举报
				let data = body as gameProto.IS2C_CHAT_REPORT;
				if (data.state == 0) {
					EffectUtils.showTips(GCode(CLEnum.CHAT_REPORT_TIPS));
				} else {
					EffectUtils.showTips(GCode(CLEnum.CHAT_REPORT_FAL));
				}
				break;
			}
		}
	}

	/**获取聊天记录 */
	public static C2S_CHAT_RECORD_LIST() {
		let data: gameProto.IC2S_CHAT_RECORD_LIST = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_RECORD_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**发送消息 */
	public static C2S_CHAT_PUSH(type: ChatType, msg: string, playerId?: number, msgType?: ChatMsgType) {
		let data: gameProto.IC2S_CHAT_PUSH = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PUSH);
		data.msg = msg;
		data.type = type;
		data.targetPlayerId = playerId;
		data.msgType = unNull(msgType) ? msgType : ChatMsgType.NORMAL;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**私聊列表 */
	public static C2S_CHAT_PRIVATE_LIST() {
		let data: gameProto.IC2S_CHAT_PRIVATE_LIST = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PRIVATE_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**获取私聊记录 */
	public static C2S_CHAT_PRIVATE_RECORD_LIST(playerId: number) {
		let data: gameProto.IC2S_CHAT_PRIVATE_RECORD_LIST = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PRIVATE_RECORD_LIST);
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**清除私聊列表成员 */
	public static C2S_CHAT_PRIVATE_CLEAN(playerId: number) {
		let data: gameProto.IC2S_CHAT_PRIVATE_CLEAN = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_PRIVATE_CLEAN);
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**获取黑名单 */
	public static C2S_CHAT_BLACKLIST() {
		let data: gameProto.IC2S_CHAT_BLACKLIST = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_BLACKLIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**添加黑名单 */
	public static C2S_CHAT_ADD_BLACKLIST(playerId: number) {
		let data: gameProto.IC2S_CHAT_ADD_BLACKLIST = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_ADD_BLACKLIST);
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**删除黑名单 */
	public static C2S_CHAT_DEL_BLACKLIST(playerId: number) {
		let data: gameProto.IC2S_CHAT_DEL_BLACKLIST = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_DEL_BLACKLIST);
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**举报 */
	public static C2S_CHAT_REPORT(playerId: number) {
		let data: gameProto.IC2S_CHAT_REPORT = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CHAT_REPORT);
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}

}