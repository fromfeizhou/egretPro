class CountryProxy extends BaseProxy {
	private static isOpenView: boolean = true;

	public constructor() {
		super();
	}

	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.COUNTRY_INFO, this, 'CountryInfoReq', 'CountryInfoResp'], //国家信息
			[ProtoDef.COUNTRY_EDITOR_NOTICE, this, 'CountryNoticeReq', 'CountryNoticeResp'], //公告编辑
			[ProtoDef.COUNTRY_JOB_APPLY_UP, this, 'CountryApplyJobReq', 'CountryApplyJobResp'], //官职任命
			[ProtoDef.COUNTRY_CITY_APPLY_UP, this, 'CountryApplyCityReq', 'CountryApplyCityResp'], //城池任命更新
			[ProtoDef.COUNTRY_APPLY_LIST, this, 'CountryApplyListReq', 'CountryApplyListResp'], //城池任命
			// [ProtoDef.COUNTRY_TASK_FINISH, this, 'CountryTaskFinishReq', 'CountryTaskFinishResp'], //完成国家任务
			[ProtoDef.COUNTRY_ABDICATE, this, 'CountryAbdicateReq', ''], //禅让
			// [ProtoDef.COUNTRY_TASK_UPDATE, this, '', 'UpdateCountryTaskStateResp'], //完成国家任务
		];
	}
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_COUNTRY_CITY_INFO, this, 'C2S_COUNTRY_CITY_INFO', ProxyEnum.SEND],// 请求城池信息
			[ProtoDef.S2C_COUNTRY_CITY_INFO, this, 'S2C_COUNTRY_CITY_INFO', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_COUNTRY_KING_CHANGE_STAMP, this, 'C2S_COUNTRY_KING_CHANGE_STAMP', ProxyEnum.SEND],// 请求城池信息
			[ProtoDef.S2C_COUNTRY_KING_CHANGE_STAMP, this, 'S2C_COUNTRY_KING_CHANGE_STAMP', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_COUNTRY_START_IMPEACH, this, 'C2S_COUNTRY_START_IMPEACH', ProxyEnum.SEND],//弹劾
			[ProtoDef.S2C_COUNTRY_START_IMPEACH, this, 'S2C_COUNTRY_START_IMPEACH', ProxyEnum.RECEIVE],//弹劾

			[ProtoDef.C2S_COUNTRY_VOTE_IMPEACH, this, 'C2S_COUNTRY_VOTE_IMPEACH', ProxyEnum.SEND],//投票
			[ProtoDef.S2C_COUNTRY_VOTE_IMPEACH, this, 'S2C_COUNTRY_VOTE_IMPEACH', ProxyEnum.RECEIVE],//投票

			[ProtoDef.C2S_COUNTRY_SALARY, this, 'C2S_COUNTRY_SALARY', ProxyEnum.SEND],       //领取俸禄
			[ProtoDef.S2C_COUNTRY_SALARY, this, 'S2C_COUNTRY_SALARY', ProxyEnum.RECEIVE],    //领取俸禄

			[ProtoDef.C2S_COUNTRY_CITY, this, 'C2S_COUNTRY_CITY', ProxyEnum.SEND],       //查看城池归属
			[ProtoDef.S2C_COUNTRY_CITY, this, 'S2C_COUNTRY_CITY', ProxyEnum.RECEIVE],


			[ProtoDef.C2S_COUNTRY_CITY_REVENUE, this, 'C2S_COUNTRY_CITY_REVENUE', ProxyEnum.SEND],       //城池税收
			[ProtoDef.S2C_COUNTRY_CITY_REVENUE, this, 'S2C_COUNTRY_CITY_REVENUE', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_COUNTRY_CITY_REVENUE_STATUS, this, 'S2C_COUNTRY_CITY_REVENUE_STATUS', ProxyEnum.RECEIVE],

			[ProtoDef.C2S_COUNTRY_EMPEROR_INFO, this, 'C2S_COUNTRY_EMPEROR_INFO', ProxyEnum.SEND],       //查看襄阳战国王信息
			[ProtoDef.S2C_COUNTRY_EMPEROR_INFO, this, 'S2C_COUNTRY_EMPEROR_INFO', ProxyEnum.RECEIVE],
			
			[ProtoDef.C2S_CITY_CHANGE_INFO_LIST, this, 'C2S_CITY_CHANGE_INFO_LIST', ProxyEnum.SEND],       //请求城池变动信息列表
			[ProtoDef.S2C_CITY_CHANGE_INFO_LIST, this, 'S2C_CITY_CHANGE_INFO_LIST', ProxyEnum.RECEIVE],

			[ProtoDef.S2C_CITY_CHANGE_INFO, this, 'S2C_CITY_CHANGE_INFO', ProxyEnum.RECEIVE],       //收到城池变动信息
		]
	}

	public execute(notification: AGame.INotification) {
		let body = notification.getBody();
		let proto = notification.getName() as number;

		switch (proto) {
			case ProtoDef.COUNTRY_INFO: {
				let VO = body as gameProto.CountryInfoResp;
				CountryModel.Self_PlayerInfo = VO.selfPlayerInfo as gameProto.CountryPlayerInfo;
				CountryModel.King_PlayerInfo = VO.kingPlayerInfo as gameProto.CountryPlayerInfo;
				CountryModel.Notice = VO.notice;
				// CountryModel.TaskId = VO.taskId;
				// CountryModel.updateTaskInfo(VO.taskId, VO.taskCurValue);
				CountryModel.selfSalaryStamp = VO.salaryStamp;
				CountryModel.selfSalaryJobId = VO.salaryJobId;
				CountryModel.ReplaceJobInfos(VO.jobInfos, true);
				CountryModel.countryCoronation(VO.selfPlayerInfo)
				CountryModel.ReplaceCityInfos(VO.cityInfos);

				// if (CountryProxy.isOpenView) {
				// 	Utils.open_view(TASK_UI.COUNTRY_MAIN_PANEL);
				// }
				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_INFO, body);
				break;
			}
			case ProtoDef.COUNTRY_EDITOR_NOTICE: {
				CountryModel.Notice = CountryModel.oldNotice;
				break;
			}
			case ProtoDef.S2C_COUNTRY_CITY_REVENUE: {
				let data = body as gameProto.S2C_COUNTRY_CITY_REVENUE;
				if (data.errorCode == 0) {
					CountryModel.receivenueReward(data)
				}
				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_CITY_REVENUE, body);
				break;
			}
			case ProtoDef.S2C_COUNTRY_CITY_REVENUE_STATUS: {
				let data = body as gameProto.S2C_COUNTRY_CITY_REVENUE_STATUS;
				RoleData.hasCityRevenue = data.canReceiveCityRevenue;
				
				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_CITY_REVENUE_STATUS, body);
				break;
			}
			case ProtoDef.COUNTRY_JOB_APPLY_UP: {
				let jobs = body.jobInfos as gameProto.ICountryJobInfo[];
				CountryModel.ReplaceJobInfos(jobs);
				if (CountryModel.curBtnStr != "") {
					EffectUtils.showTips(CountryModel.curBtnStr);
					CountryModel.curBtnStr = ""
				}
				if (CountryModel.curBtn == 2) {
					//卸任
					delete CountryModel.JobInfos[CountryModel.curJobId];
				}

				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_JOB_APPLY_UP, body);
				break;
			}
			case ProtoDef.COUNTRY_CITY_APPLY_UP: {
				let citys = body.cityInfos as gameProto.ICountryCityInfo[];
				CountryModel.ReplaceCityInfos(citys);
				EffectUtils.showTips(GCode(CLEnum.GUILD_APPLY_TIPS));

				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_CITY_APPLY_UP, body);
				break;
			}
			case ProtoDef.COUNTRY_APPLY_LIST: {
				let param: any = CountryModel.ApplyListViewParam;
				param.ApplyList = body.playerInfoList;
				Utils.open_view(TASK_UI.COUNTRY_APPLY_LIST, param);
				break;
			}
			case ProtoDef.S2C_COUNTRY_CITY_INFO: {
				let data = body as gameProto.IS2C_COUNTRY_CITY_INFO;
				CountryModel.ReplaceCityInfos(data.cities);
				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_CITY_INFO, body);
				break;
			}
			// case ProtoDef.COUNTRY_TASK_FINISH: {
			// 	let data = body as gameProto.CountryTaskFinishResp;
			// 	if (data.message && data.message.length > 0) {
			// 		Utils.open_view(TASK_UI.GET_REWARD_VIEW,data.message);
			// 	}
			// 	CountryModel.updateTaskInfo(data.nextTaskId, data.taskCurValue);
			// 	break;
			// }
			// case ProtoDef.COUNTRY_TASK_UPDATE: {
			// 	let VO = body as gameProto.UpdateCountryTaskStateResp;
			// 	CountryModel.updateTaskInfo(VO.taskId, VO.taskCurValue);
			// 	break;
			// }
			//弹劾
			case ProtoDef.S2C_COUNTRY_START_IMPEACH: {
				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_START_IMPEACH, body);
				break;
			}
			//弹劾投票
			case ProtoDef.S2C_COUNTRY_VOTE_IMPEACH: {
				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_VOTE_IMPEACH, body);
				break;
			}
			//领取俸禄
			case ProtoDef.S2C_COUNTRY_SALARY: {
				com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_SALARY, body);
				break;
			}

			case ProtoDef.S2C_COUNTRY_EMPEROR_INFO: {
				CountryModel.setCountryEmperorInfo(body);
				break;
			}

			//收到城池变动信息列表
			case ProtoDef.S2C_CITY_CHANGE_INFO_LIST: {
				CountryModel.setCityChangeInfo(body);
				break;
			}

			//收到城池变动信息
			case ProtoDef.S2C_CITY_CHANGE_INFO: {
				CountryModel.addCityChangeInfo(body.infos);
				break;
			}
		}
		AGame.ServiceBuilder.notifyView(notification);

	}
	/////////////////////////////////////////////////////////////////////

	// /** 国家信息 打开界面 isopen = true*/
	// public static send_COUNTRY_INFO_OPEN_VIEW() {
	// 	// this.isOpenView = true;
	// 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_INFO);
	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	/** 国家信息 不打开界面  isopen = false*/
	public static send_COUNTRY_INFO() {
		// this.isOpenView = false;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_INFO);
		AGame.ServiceBuilder.sendMessage(data);
	}


	private _oldNotice: string;
	/** 公告编辑 */
	public static send_COUNTRY_NOTICE(notice: string) {
		CountryModel.oldNotice = notice;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_EDITOR_NOTICE)
		data.notice = notice;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**城池信息 */
	public static C2S_COUNTRY_CITY_INFO() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_CITY_INFO) as gameProto.C2S_COUNTRY_CITY_INFO;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/** 官职任命 */
	public static send_COUNTRY_APPLY_JOB(jobId: number, playerId: number) {
		if (jobId == 1) {
			this.send_COUNTRY_ABDICATE(playerId);
		}
		else {
			CountryModel.curJobId = jobId;
			let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_JOB_APPLY_UP);
			data.jobId = jobId;
			data.playerId = playerId;
			AGame.ServiceBuilder.sendMessage(data);
		}
	}

	/** 城池任命 */
	public static send_COUNTRY_APPLY_CITY(cityId: number, playerId: number) {
		CountryModel.curCityId = cityId;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_CITY_APPLY_UP);
		data.cityId = cityId;
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/** 完成国家任务 */
	// public static send_COUNTRY_TASK_FINISH(taskId: number) {
	// 	let data: gameProto.CountryTaskFinishReq = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_TASK_FINISH);
	// 	data.taskId = taskId;
	// 	AGame.ServiceBuilder.sendMessage(data);
	// }

	/** 请求玩家任命列表数据 */
	public static send_COUNTRY_APPLY_LIST(listType: number,jobId?:number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_APPLY_LIST) as gameProto.ICountryApplyListReq;
		data.listType = listType;
		data.jobId = jobId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/** 禅让 */
	private static send_COUNTRY_ABDICATE(playerId: number) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_ABDICATE);
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**称王阅读 */
	public static C2S_COUNTRY_KING_CHANGE_STAMP() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_KING_CHANGE_STAMP);
		AGame.ServiceBuilder.sendMessage(data);
	}

	public static C2S_COUNTRY_START_IMPEACH() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_START_IMPEACH);
		AGame.ServiceBuilder.sendMessage(data);
	}

	public static C2S_COUNTRY_VOTE_IMPEACH() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_VOTE_IMPEACH);
		AGame.ServiceBuilder.sendMessage(data);
	}

	public static C2S_COUNTRY_SALARY() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_SALARY);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**查看城池归属 */
	public static C2S_COUNTRY_CITY() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_CITY);
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**城市税收 */
	public static C2S_COUNTRY_CITY_REVENUE() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_CITY_REVENUE);
		AGame.ServiceBuilder.sendMessage(data);
	}
	//查看襄阳战国王信息
	public static send_C2S_COUNTRY_EMPEROR_INFO(){
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_EMPEROR_INFO);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**获取城池变更信息 */
	public static send_C2S_CITY_CHANGE_INFO_LIST(){
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_CHANGE_INFO_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

}