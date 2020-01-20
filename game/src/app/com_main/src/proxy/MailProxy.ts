class MailProxy extends BaseProxy {

	public constructor() {
		super();
	}

	// 监听协议
	protected listenerProtoNotificationsNew(): any[] {
		return [
			//C2S_MAILBOX_TITLE_LSIT
			[ProtoDef.C2S_MAILBOX_TITLE_LSIT, this, 'C2S_MAILBOX_TITLE_LSIT', ProxyEnum.SEND],//邮件读取
			[ProtoDef.S2C_MAILBOX_TITLE_LSIT, this, 'S2C_MAILBOX_TITLE_LSIT', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_MAILBOX_INFO, this, 'C2S_MAILBOX_INFO', ProxyEnum.SEND],//邮件读取
			[ProtoDef.S2C_MAILBOX_INFO, this, 'S2C_MAILBOX_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_MAILBOX_DEL, this, 'C2S_MAILBOX_DEL', ProxyEnum.SEND],//邮件删除
			[ProtoDef.S2C_MAILBOX_DEL, this, 'S2C_MAILBOX_DEL', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_MAILBOX_ALLDEL, this, 'C2S_MAILBOX_ALLDEL', ProxyEnum.SEND],//一键删除
			[ProtoDef.S2C_MAILBOX_ALLDEL, this, 'S2C_MAILBOX_ALLDEL', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_MAILBOX_ALLREAD, this, 'C2S_MAILBOX_ALLREAD', ProxyEnum.SEND],//一键阅读
			[ProtoDef.S2C_MAILBOX_ALLREAD, this, 'S2C_MAILBOX_ALLREAD', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_MAILBOX_ATTACHMENT, this, 'C2S_MAILBOX_ATTACHMENT', ProxyEnum.SEND],//领取附件
			[ProtoDef.S2C_MAILBOX_ATTACHMENT, this, 'S2C_MAILBOX_ATTACHMENT', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_MAILBOX_NOTICE, this, 'S2C_MAILBOX_NOTICE', ProxyEnum.RECEIVE],//新邮件通知
			[ProtoDef.S2C_MAILBOX_TITLE_UP, this, 'S2C_MAILBOX_TITLE_UP', ProxyEnum.RECEIVE],//状态更新
			//S2C_MAILBOX_TITLE_UP
		];
	}


	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let protocol: number = Number(notification.getName());
		switch (protocol) {
			case ProtoDef.S2C_MAILBOX_TITLE_LSIT: {
				let data = body as gameProto.S2C_MAILBOX_TITLE_LSIT;
				MailModel.parseMailTitles(data.mailTitle);
				break;
			}
			case ProtoDef.S2C_MAILBOX_INFO: {
				Loading.hide();
				let data = body as gameProto.S2C_MAILBOX_INFO;
				MailModel.readMail(data);
				break;
			}
			case ProtoDef.S2C_MAILBOX_DEL: {
				let data = body as gameProto.S2C_MAILBOX_DEL;
				if (data.status == 0) {
					MailModel.deleteMail(data.id);
					let valueMsgs = data.attachment;
					if (valueMsgs && valueMsgs.length > 0) Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
				} else {
					EffectUtils.showTips(GCode(CLEnum.MAIL_DEL_FAL), 1, true);
				}
				break;
			}
			case ProtoDef.S2C_MAILBOX_ALLDEL: {
				let data = body as gameProto.S2C_MAILBOX_ALLDEL;
				if (data.status == 0) {
					MailModel.deleteMails(data.delId);
					let valueMsgs = data.attachment;
					if (valueMsgs && valueMsgs.length > 0) Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
				} else {
					EffectUtils.showTips(GCode(CLEnum.MAIL_DEL_FAL), 1, true);
				}
				break;
			}
			case ProtoDef.S2C_MAILBOX_ALLREAD: {
				let data = body as gameProto.S2C_MAILBOX_ALLREAD;
				//数据通过S2C_MAILBOX_TITLE_UP 更新
				if (data.status == 0) {
					let valueMsgs = data.attachment;
					if (valueMsgs && valueMsgs.length > 0) Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
				}
				break;
			}
			case ProtoDef.S2C_MAILBOX_ATTACHMENT: {
				let data = body as gameProto.S2C_MAILBOX_ATTACHMENT;
				if (data.status == 0) {
					let valueMsgs = data.attachment;
					if (valueMsgs && valueMsgs.length > 0) Utils.open_view(TASK_UI.GET_REWARD_VIEW, valueMsgs);
					MailModel.attachMail(data.mailId);
				// } else {
				// 	EffectUtils.showTips(GCode(CLEnum.MAIL_ATT_GET_FAL), 1, true);
				}
				break;
			}
			case ProtoDef.S2C_MAILBOX_NOTICE: {
				let data = body as gameProto.S2C_MAILBOX_NOTICE;
				MailModel.addMailTitle(data.mailTitle);
				break;
			}
			case ProtoDef.S2C_MAILBOX_TITLE_UP: {
				let data = body as gameProto.S2C_MAILBOX_TITLE_UP;
				MailModel.parseMailTitles(data.mailTitle);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);
	}

	/**
	 * 请求邮件列表
	 */
	public static C2S_MAILBOX_TITLE_LSIT() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_TITLE_LSIT) as gameProto.C2S_MAILBOX_TITLE_LSIT;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 请求邮件读取
	 */
	public static C2S_MAILBOX_INFO(mailId: number) {
		if (MailModel.curReadId && MailModel.curReadId == mailId) return;

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_INFO) as gameProto.C2S_MAILBOX_INFO;
		data.id = mailId;
		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}

	/**
	 * 请求邮件删除
	 */
	public static C2S_MAILBOX_DEL(mailId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_DEL) as gameProto.C2S_MAILBOX_DEL;
		data.id = mailId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 请求邮件一键删除
	 */
	public static C2S_MAILBOX_ALLDEL(type: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_ALLDEL) as gameProto.C2S_MAILBOX_ALLDEL;
		data.type = type;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 请求邮件一键已读
	 */
	public static C2S_MAILBOX_ALLREAD(type: MailType) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_ALLREAD) as gameProto.C2S_MAILBOX_ALLREAD;
		data.type = type;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 请求邮件领取附件
	 */
	public static C2S_MAILBOX_ATTACHMENT(mailId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAILBOX_ATTACHMENT) as gameProto.C2S_MAILBOX_ATTACHMENT;
		data.id = mailId;
		AGame.ServiceBuilder.sendMessage(data);
	}


}