/**聊天频道 */
enum ChatType {
	/**国家 */
	COUNTRY = 1,
	/**联盟 */
	LEGION = 2,
	/**世界 */
	WORLD = 3,
	/**私人 */
	PRIVATE = 4,

	/**系统 */
	SYSTEM = 100,
	/**黑名单 */
	BLCAK = 201,
}

enum ChatMsgType {
	/**常规信息 */
	NORMAL = 0,
	/**邀请工会 */
	INVITE = 1,
	/**系统 */
	SYSTEM = 2,
}

interface IChatRecord {
	record: boolean;
	datas: ChatVo[];
}

class ChatModel {
	public static MSG_MAX: number = 50;		/**频道消息上限 */
	public static MSG_PRI_MAX: number = 30;	/**私聊信息上限 */
	public static HEAD_MAX: number = 20;		/**私聊列表上限 */
	public static BLACK_MAX: number = 30;	/**黑名单上限 */
	public static MSG_CHAT_MAX: number = 50;		/**聊天内容长度限制 */

	public static chatTypeList: { [type: number]: ChatVo[] };	/**聊天数据 */

	public static chatPriList: Dictionary;//玩家私聊信息
	public static chatHeadList: Dictionary;	//玩家私聊头像列表
	public static blackList: Dictionary;//黑名单列表

	public static lastMsgCache: ChatVo[];

	public static clear() {
		this.chatTypeList = null;
		this.chatPriList = null;
		this.chatHeadList = null;
		this.blackList = null;
		this.lastMsgCache = null;
	}


	public static init() {
		//聊天数据
		this.chatTypeList = {
			[ChatType.LEGION]: [],
			[ChatType.COUNTRY]: [],
			[ChatType.WORLD]: [],
			[ChatType.SYSTEM]: [],
		};
		this.lastMsgCache = [null, null];
		//玩家私聊信息
		this.chatPriList = Dictionary.create();
		//玩家私聊头像列表
		this.chatHeadList = Dictionary.create();
		//黑名单列表
		this.blackList = Dictionary.create();
	}

	/**解析聊天数据 */
	public static pushChatMsg(body: gameProto.IS2C_CHAT_PUSH) {
		this.pushMsg(body.type, body.data, body.targetPlayerId);
	}

	/**解析聊天记录数据 */
	public static pushChatRecordMsg(body: gameProto.IS2C_CHAT_RECORD_LIST) {
		let list: { type: ChatType, data: gameProto.IMsgData }[] = [];
		for (let i = 0; i < body.countryData.length; i++) {
			list.push({ type: ChatType.COUNTRY, data: body.countryData[i] });
		}

		for (let i = 0; i < body.labourUnionData.length; i++) {
			list.push({ type: ChatType.LEGION, data: body.labourUnionData[i] });
		}
		list.sort((a, b) => {
			return a.data.time - b.data.time;
		})
		for (let i = 0; i < list.length; i++) {
			this.pushMsg(list[i].type, list[i].data);
		}
	}

	/**塞入聊天数据 */
	private static pushMsg(type: ChatType, data: gameProto.IMsgData, targetId?: number, msgType?: number) {
		//黑名单过滤
		if (data.headPortrait && this.inBlackList(data.headPortrait.playerId)) return;
		//私聊信息  链表独立处理 添加消息由私聊队列控制
		if (type == ChatType.PRIVATE) {
			// 第一次收到私聊消息 申请聊天记录
			this.pushPriMsg(targetId, [data]);
		} else {
			let list = this.chatTypeList[type];
			let vo = ChatVo.create(type, data);
			list.push(vo);
			while (list.length > ChatModel.MSG_MAX) {
				let tmpVo = list.shift();
				tmpVo.onDestroy();
			}
			this.lastMsgCache.push(vo);
			if (this.lastMsgCache.length > 2) this.lastMsgCache.shift();
			com_main.EventMgr.dispatchEvent(ChatEvent.MSG_UPDATE, { channel: type, vo: vo, targetId: targetId });
		}
	}

	/**获得对应频道聊天 */
	public static getMsgByType(type: ChatType) {
		return this.chatTypeList[type];
	}

	/**请求私聊记录*/
	public static requestPriMsg(playerId: number) {
		let request = false;
		if (!this.chatPriList.has(playerId)) {
			request = true;
		} else {
			let data: IChatRecord = this.chatPriList.get(playerId);
			if (!data.record) request = true;
		}
		if (request) {
			ChatProxy.C2S_CHAT_PRIVATE_RECORD_LIST(playerId);
		}
	}

	/**塞入个人私聊对象信息 */
	public static pushPriMsg(targetId: number, datas: gameProto.IMsgData[], record: boolean = false) {
		for (let i = 0; i < datas.length; i++) {
			let vo = ChatVo.create(ChatType.PRIVATE, datas[i]);
			vo.isRead = record;
			this.addPriInfo(targetId, vo, record);

			//更新私聊头像列表记录时间 和头像信息(排除接收自己发送消息)
			if (vo.headPortrait.playerId != RoleData.playerId) {
				let data: gameProto.IPlayerHeadPortrait = {
					lastTime: vo.time,
					headPortrait: vo.headPortrait
				}
				this.updateHead(data);
			}
			//通知消息增加
			com_main.EventMgr.dispatchEvent(ChatEvent.MSG_UPDATE, { channel: ChatType.PRIVATE, vo: vo, targetId: targetId });
		}
	}

	/**添加个人聊天记录 */
	private static addPriInfo(targetId: number, vo: ChatVo, record: boolean) {
		if (!this.chatPriList.has(targetId)) {
			let data: IChatRecord = { record: record, datas: [] }
			this.chatPriList.add(targetId, data);
		}

		let data: IChatRecord = this.chatPriList.get(targetId);
		let list = data.datas;
		list.push(vo);

		while (list.length > ChatModel.MSG_PRI_MAX) {
			let tmpVo = list.shift();
			tmpVo.onDestroy();
		}
	}

	/**获得对应频道聊天 */
	public static getPriMsgById(playerId: number): ChatVo[] {
		if (this.chatPriList.has(playerId)) {
			let data: IChatRecord = this.chatPriList.get(playerId);
			return data.datas;
		}
		return [];
	}

	/**清理私聊对象消息 */
	public static clearPriMsgById(playerId: number) {
		if (this.chatPriList.has(playerId)) {
			let data: IChatRecord = this.chatPriList.get(playerId);
			let list = data.datas;
			while (list.length > 0) {
				let vo = list.shift();
				vo.onDestroy();
			}
			this.chatPriList.del(playerId);
			com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_MSG_PRI_CLEAR, playerId);
		}
	}


	/**=====================================================================================
     * 头像列表 begin
     * =====================================================================================
     */
	/**解析私聊头像列表 */
	public static parseHeadList(list: gameProto.IPlayerHeadPortrait[]) {
		for (let i = 0; i < list.length; i++) {
			this.updateHead(list[i]);
		}
	}

	/**更新私聊头像信息 */
	public static updateHead(body: gameProto.IPlayerHeadPortrait) {
		let playerId = body.headPortrait.playerId;
		if (!this.chatHeadList.has(playerId)) {
			this.chatHeadList.add(playerId, ChatHeadVo.create(body));
			//头像增加刷新
			com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_ADD, playerId);
			//移除超时限定数量头像
			if (this.chatHeadList.count > ChatModel.HEAD_MAX) {
				let tmpId: number;
				let timeMin = 0;
				this.chatHeadList.forEach((key, data: ChatHeadVo) => {
					if (data.lastTime > timeMin) {
						tmpId = data.headPortrait.playerId;
						timeMin = data.lastTime;
					}
				}, this);
				this.delHead(tmpId);
			}
		} else {
			let info: ChatHeadVo = this.chatHeadList.get(playerId);
			info.update(body);
			com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_UPDATE, playerId);
		}

	}

	/**删除头像和私聊记录 */
	public static delHead(playerId: number) {
		if (playerId == 0) {
			this.chatHeadList.forEach((key, data: ChatHeadVo) => {
				data.onDestroy();
				this.clearPriMsgById(data.headPortrait.playerId);
			}, this);
			this.chatHeadList.clear();
			com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_DEL, null);
		} else {
			let data: ChatHeadVo = this.chatHeadList.get(playerId);
			if (data) {
				data.onDestroy();
				this.chatHeadList.del(playerId);
				this.clearPriMsgById(playerId);
				com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_HEAD_DEL, playerId);
			}
		}

	}


	/**获得私聊头像队列 */
	public static getPriHeads() {
		let res: ChatHeadVo[] = [];
		this.chatHeadList.forEach((key, data: ChatHeadVo) => {
			res.push(data);
		}, this);
		return res;
	}

	/**获得私聊头像 */
	public static getPriHeadById(id: number): ChatHeadVo {
		return this.chatHeadList.get(id);
	}


	/**=====================================================================================
     * 头像列表 end
     * =====================================================================================
     */

	/**=====================================================================================
     * 黑名单 begin
     * =====================================================================================
     */
	/**塞入黑名单列表 */
	public static pushBlackList(list: gameProto.IHeadPortrait[]) {
		for (let i = 0; i < list.length; i++) {
			let data = list[i];
			if (!this.blackList.has(data.playerId)) {
				this.blackList.add(data.playerId, data);
				//移除聊天记录
				this.delHead(data.playerId);
				com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_BLACK_LIST_ADD, data.playerId);
			}
		}
	}

	/**获得黑名单数据 */
	public static getBlackInfo(id: number): gameProto.IHeadPortrait {
		return this.blackList.get(id);
	}

	/**获得黑名单数据 */
	public static inBlackList(id: number) {
		return this.blackList.has(id);
	}

	/**获得黑名单列表数组 */
	public static delBlackList(id: number) {
		if (this.blackList.has(id)) {
			this.blackList.del(id);
			com_main.EventMgr.dispatchEvent(ChatEvent.CHAT_BLACK_LIST_DEL, id);
		}
	}

	/**获得黑名单列表数组 */
	public static getBlackList(): gameProto.IHeadPortrait[] {
		let res = [];
		this.blackList.forEach((key, data: gameProto.IHeadPortrait) => {
			res.push(data);
		}, this);
		return res;
	}

	/**黑名单上限 */
	public static isBlackListMax(): boolean {
		return this.blackList.count >= ChatModel.BLACK_MAX;
	}

	/**=====================================================================================
     * 黑名单 begin
     * =====================================================================================
     */

	/**=====================================================================================
     * 配置 begin
     * =====================================================================================
     */
	/**频道名称 */
	public static getChannelName(type: ChatType) {
		switch (type) {
			case ChatType.PRIVATE:
				return GCode(CLEnum.CHAT_PRIVATE);
			case ChatType.LEGION:
				return GCode(CLEnum.CHAT_LEGION);
			case ChatType.COUNTRY:
				return GCode(CLEnum.CHAT_COUNTRY);
			case ChatType.WORLD:
				return GCode(CLEnum.CHAT_WORLD);
			case ChatType.SYSTEM:
				return GCode(CLEnum.CHAT_SYSTEM);
		}
		return '';
	}

	/**时间描述 */
	public static timeFormat(time: number) {
		if (time == 0) return '';

		let dt = TimerUtils.getServerTime() - time;
		let secDay = 24 * 60 * 60;
		if (dt > secDay) {
			let day = Math.floor(dt / secDay)
			return GCodeFromat(CLEnum.ARENA_TIME, day);
		}
		let secHour = 60 * 60
		if (dt > secHour) {
			let hour = Math.floor(dt / secHour)
			return GCodeFromat(CLEnum.ARENA_TIME1, hour);
		}
		if (dt > 60) {
			let min = Math.floor(dt / 60)
			return GCodeFromat(CLEnum.ARENA_TIME2, min);
		}

		return GCode(CLEnum.CHAT_MSG_TIME);
	}
	/**=====================================================================================
     * 配置 end
     * =====================================================================================
     */
	/**获得私聊红点 */
	public static getRedState(playerId?: number) {
		if (!playerId) {
			let res = 0;
			this.chatPriList.forEach((key: number, data: IChatRecord) => {
				if (this.getRedStateById(key) > 0) {
					res = 1;
					return 'break'
				}
			});
			return res;
		} else {
			return this.getRedStateById(playerId);
		}
	}

	/**获得私聊红点 */
	private static getRedStateById(playerId: number) {
		if (this.chatPriList.has(playerId)) {
			let list = this.getPriMsgById(playerId);
			for (let i = 0; i < list.length; i++) {
				if (!list[i].isRead) return 1;
			}
		}
		return 0;
	}


	/**获得邀请工会消息结构 */
	public static parseInviteMsg(msg: string, info: gameProto.IHeadPortrait) {
		if (info.playerId == RoleData.playerId) {
			return GCodeFromat(CLEnum.CHAT_MSG_INVATE, msg, info.labourUnionName);
		} else {
			return GCodeFromat(CLEnum.CHAT_MSG_INVATE2, info.playerName, info.labourUnionName);
		}
	}

	/**获得系统消息结构 */
	public static sendSystemMsg(msg: string, chatType: ChatType) {
		let data: gameProto.IMsgData = {
			headPortrait: null,
			msgType: ChatMsgType.SYSTEM,
			time: TimerUtils.getServerTime(),
			msg: msg
		}
		this.pushMsg(chatType, data)
	}
}

