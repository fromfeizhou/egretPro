/**
 * 联盟
 */

class LegionProxy extends BaseProxy {
	private static isOpenView: boolean = false;
	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.GUILD_LIST, this, 'GuildListReq', 'GuildListResp'],// 获取联盟列表
			[ProtoDef.CREATE_GUILD, this, 'CreateGuildReq', 'CreateGuildResp'],// 创建联盟
			[ProtoDef.APPLY_JOIN_GUILD, this, 'ApplyJoinGuildReq', 'ApplyJoinGuildResp'],// 申请加入工会
			[ProtoDef.GET_GUILD_LIST_BY_NAME, this, 'GetGuildListByNameReq', 'GetGuildListByNameResp'],// 通过搜索名称获取联盟列表
			[ProtoDef.GET_GUILD_INFO, this, 'GetGuildInfoReq', 'GetGuildInfoResp'],// 获取自己所在的联盟的信息
			[ProtoDef.LEAVE_GUILD, this, 'LeaveGuildReq', 'LeaveGuildResp'],// 退出联盟
			// [ProtoDef.APPOINT_POSITION, this, 'AddDonationReq', 'AddDonationResp'],// 联盟捐献
			[ProtoDef.GUILD_TECH_DONATE, this, 'GuildTechDonateReq', 'GuildTechDonateResp'],// 联盟捐献3619
			[ProtoDef.CHANGE_GUILD_LEADER, this, 'ChangeGuildLeaderReq', 'ChangeGuildLeaderResp'],// 改变联盟团长
			[ProtoDef.GUILD_TECHNOLOGY_VIEW, this, 'GuildTechnologyViewReq', 'GuildTechnologyViewResp'],// 科技内容列表
			[ProtoDef.GUILD_TECHNOLOGY_LEVEL_UP, this, '', 'GuildTechnologyLevelUpResp'],// 联盟科技升级返回
			[ProtoDef.KICK_OUT_GUILD, this, 'KickOutGuildReq', 'KickOutGuildResp'],// 联盟科技升级返回
			[ProtoDef.APPOINT_POSITION, this, 'AppointPositionReq', 'AppointPositionResp'],// 服务器发送给联盟的团长等有权限的人3615
			[ProtoDef.INVITE_JOIN_GUILD, this, 'InviteJoinGuildReq', 'InviteJoinGuildResp'],// 邀请加入联盟5002
			[ProtoDef.BE_INVITE_JOIN_GUILD, this, 'BeInviteJoinGuildReq', 'BeInviteJoinGuildResp'],// 邀请加入联盟(被邀请人)5003
			[ProtoDef.SURE_INVITE_JOIN_GUILD, this, 'SuerInviteJoinGuildReq', 'SuerInviteJoinGuildResp'],// 确定被邀请加入联盟:邀请人5004
			[ProtoDef.BE_SURE_INVITE_JOIN_GUILD, this, 'BeSuerInviteJoinGuildReq', 'BeSuerInviteJoinGuildResp'],// 确定被邀请加入联盟:被邀请人5005
			[ProtoDef.JOIN_GUILD_STATUS, this, 'JoinGuildStatusReq', 'JoinGuildStatusResp'],// 入团设置5006
			[ProtoDef.GUILD_ICON_STATUS, this, 'GuildIconStatusReq', 'GuildIconStatusResp'],// 联盟标志设置5007
			[ProtoDef.GUILD_INFORMATION, this, 'GuildInformationReq', 'GuildInformationResp'],// 联盟消息（GUILD_INFORMATION)5008
			[ProtoDef.KICK_OUT_FROM_GUILD, this, '', 'KickOutFromGuildResp'],// 3610）服务器发送给被踢的成员)3610
			[ProtoDef.CHECK_APPLY_JOIN_GUILD, this, 'CheckApplyJoinGuildReq', 'CheckApplyJoinGuildResp'],// 申请入会待审核3617
			[ProtoDef.ACCEPT_APPLY_JOIN_GUILD, this, 'AcceptApplyJoinGuildReq', 'AcceptApplyJoinGuildResp'],// 接受别人加入联盟3607
			[ProtoDef.JOIN_GUILD, this, '', 'JoinGuildResp'],// 加入联盟（JOIN_GUILD 3608
			[ProtoDef.BE_APPOINT_POSITION, this, '', 'BeAppointPositionResp'],// 3616）服务器发送给被任命的人 
			[ProtoDef.DISSOLVE_GUILD, this, 'DissolveGuildReq', 'DissolveGuildResp'],// 解散联盟（DISSOLVE_GUILD3618 
			[ProtoDef.CHANGE_DECLARATION, this, 'ChangeDeclarationReq', 'ChangeDeclarationResp'],//  改变联盟宣言（CHANGE_DECLARATION = 3613）

		]
	}
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.C2S_ACCUSE_GUILD, this, 'C2S_ACCUSE_GUILD', ProxyEnum.SEND],// 盟主坦克
			[ProtoDef.S2C_ACCUSE_GUILD, this, 'S2C_ACCUSE_GUILD', ProxyEnum.RECEIVE],
		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {
			case ProtoDef.GUILD_LIST: {
				if (body) {
					let data = body as gameProto.IGuildListResp;
					if (LegionProxy.isOpenView) {
						LegionProxy.isOpenView = false;
						Utils.open_view(TASK_UI.LEGION_LIST_WND, data.guildData);
					}
				}
				break;
			}
			// case ProtoDef.GET_GUILD_LIST_BY_NAME: {// 通过搜索名称获取联盟列表
			// 	if (body) {
			// 		let data = body as gameProto.IGetGuildListByNameResp;
			// 		Utils.open_view(TASK_UI.LEGION_LIST_WND_UPDATE,data.guildData);
			// 	}
			// 	break;
			// }
			case ProtoDef.CREATE_GUILD: {// 创建联盟
				if (body.guildInfo) {
					let data = body as gameProto.GetGuildInfoResp;
					LegionModel.setGuildInfo(data.guildInfo);
					LegionModel.parseTeach(data.guildInfo.guildTechInfo);
					LegionModel.updateResourceNum(data.guildInfo.donateResourceCount);
					com_main.UpManager.close();
					Utils.open_view(TASK_UI.LEGION_MAIN_WND);
				} else {

				}

				break;
			}
			case ProtoDef.GET_GUILD_INFO: {//  如果没有加入任何帮会，该变量没有值
				if (body.guildInfo) {
					let data = body as gameProto.GetGuildInfoResp;
					LegionModel.setGuildInfo(body.guildInfo);
					LegionModel.parseTeach(data.guildInfo.guildTechInfo);
					LegionModel.updateResourceNum(data.guildInfo.donateResourceCount);
					if (LegionProxy.isOpenView) {
						LegionProxy.isOpenView = false;
						Utils.open_view(TASK_UI.LEGION_MAIN_WND);
					}
				}
				break;
			}
			case ProtoDef.S2C_ACCUSE_GUILD: {//  如果没有加入任何帮会，该变量没有值
				let data = body as gameProto.S2C_ACCUSE_GUILD;
				if (data) {
					LegionProxy.send_GET_GUILD_INFO(false, 0);
				}
				break;
			}
			case ProtoDef.APPLY_JOIN_GUILD: {// 申请加入工会
				// 			required uint64 id = 1; // 帮会的唯一id
				// required uint32 join = 2; // 联盟是否立即加入， 不是立即加入就等待审核后才加入0：自由1：需要审核
				// required uint32 GuildBuildingLevel = 3;//大殿等级
				if (body.join == 0) {
					let level = MainMapModel.getBuildInfo(1).level;
					if (level >= body.GuildBuildingLevel) {
						com_main.UpManager.removeAllPanel();
						LegionProxy.send_GET_GUILD_INFO(true, 0);
					} else {
						EffectUtils.showTips(GCodeFromat(CLEnum.GUILD_APPLY_FAL, body.GuildBuildingLevel), 1, true);
					}


				} else if (body.join == 1) {

					EffectUtils.showTips(GCode(CLEnum.GUILD_APPLY_IN), 1, true);
				}

				break;
			}

			case ProtoDef.LEAVE_GUILD: {// 退出联盟成功，不成功直接返回错误码
				LegionModel.dissolve();
				break;
			}
			case ProtoDef.GUILD_TECH_DONATE: {// 联盟捐献
				if (body) {
					let data = body as gameProto.IGuildTechDonateResp;
					LegionModel.updateTeach(data.guildTechInfo);
					LegionModel.updateResourceNum(data.donateResourceCount);
				}
				break;
			}
			case ProtoDef.GUILD_TECHNOLOGY_LEVEL_UP: {// 联盟科技升级返回
				if (body) {

				}
				break;
			}

			case ProtoDef.CHANGE_GUILD_LEADER: {// 装让盟主
				LegionProxy.send_GET_GUILD_INFO(false, 0);
				break;
			}
			case ProtoDef.GUILD_TECHNOLOGY_VIEW: {// 联盟内容请求
				if (body) {
					// LegionModel.setTechInfo(body);
					// Utils.open_view(TASK_UI.LEGION_DONATION_PANEL,body);
				}

				break;
			}
			case ProtoDef.KICK_OUT_GUILD: {//踢出工会
				LegionProxy.send_GET_GUILD_INFO(false, 0);
				break;
			}
			case ProtoDef.APPOINT_POSITION: {//服务器发送给联盟的团长等有权限的人3615
				if (body) {
					/** add code */
					LegionProxy.send_GET_GUILD_INFO(false, 0);
				}
				break;
			}

			case ProtoDef.INVITE_JOIN_GUILD: {//邀请加入军团联盟02
				if (body) {
					/** add code */
				}
				break;
			}
			case ProtoDef.BE_INVITE_JOIN_GUILD: {//邀请加入联盟(被邀请人)5003
				if (body) {
					/** add code */
				}
				break;
			}
			case ProtoDef.SURE_INVITE_JOIN_GUILD: {//确定被邀请加入联盟:邀请人5004
				if (body) {
					/** add code */
				}
				break;
			}
			case ProtoDef.BE_SURE_INVITE_JOIN_GUILD: {//确定被邀请加入联盟:被邀请人5005
				if (body) {
					/** add code */
				}
				break;
			}
			case ProtoDef.JOIN_GUILD_STATUS: {//入团设置5006
				if (body) {
					/** add code */
					EffectUtils.showTips(GCode(CLEnum.GUILD_SET_TIPS), 1, true);
				}
				break;
			}
			case ProtoDef.GUILD_ICON_STATUS: {//联盟标志设置5007
				if (body) {
					/** add code */
				}
				break;
			}
			case ProtoDef.GUILD_INFORMATION: {//联盟标志设置5008
				if (body) {
					/** add code */
				}
				break;
			}
			case ProtoDef.KICK_OUT_FROM_GUILD: {//
				if (body) {
					if (body.playerId == RoleData.playerId) {
						EffectUtils.showTips(GCode(CLEnum.GUILD_KICK_TIPS), 1, true);
						LegionModel.dissolve();
						let obj = SceneManager.getClass(LayerEnums.POPUP, com_main.LegionMainWnd.NAME);
						if (obj) {
							com_main.UpManager.close();


						}
					}
				}
				break;
			}
			case ProtoDef.CHECK_APPLY_JOIN_GUILD: {//3617
				if (body) {
					let info = body.stayApplyJoin;
					LegionModel.m_messInfoTotalPage = info.length;
				}
				break;
			}
			case ProtoDef.ACCEPT_APPLY_JOIN_GUILD: {//3607
				if (body) {
					/** add code */
					if (body.status == 0)
						LegionProxy.send_GET_GUILD_INFO(false, 0);
				}
				break;
			}
			case ProtoDef.JOIN_GUILD: {//3608  申请者被同意
				if (body) {
					LegionModel.setGuildInfo(body.guildInfo);
					// LegionProxy.send_GET_GUILD_INFO(false,0);

					let obj = SceneManager.getClass(LayerEnums.POPUP, com_main.LegionListWnd.NAME);
					if (obj) {
						com_main.UpManager.close();
						LegionProxy.send_GET_GUILD_INFO(true, 0);
					} else {
						LegionProxy.send_GET_GUILD_INFO(false, 0);
					}

				}
				break;
			}
			case ProtoDef.BE_APPOINT_POSITION: {//3616
				if (body) {
					LegionProxy.send_GET_GUILD_INFO(false, 0);
				}
				break;
			}
			case ProtoDef.DISSOLVE_GUILD: {//3618
				if (body) {
					com_main.UpManager.close();
					EffectUtils.showTips(GCode(CLEnum.GUILD_DISS_TIPS), 1, true);
					LegionModel.dissolve();
				}
				break;
			}
			case ProtoDef.CHANGE_DECLARATION: {//3613

				break;
			}

			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**请求联盟列表 */
	public static send_GUILD_LIST_OPEN_VIEW() {
		this.isOpenView = true;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**请求联盟列表 */
	public static send_GUILD_LIST() {
		this.isOpenView = false;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_LIST);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**请求创建联盟 */
	public static send_CREATE_GUILD(legionName, LegionNotice) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.CREATE_GUILD);
		data.name = legionName; // 名称
		data.declaration = LegionNotice; // 联盟宣言
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**请求加入联盟 */
	public static send_APPLY_JOIN_GUILD(id) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APPLY_JOIN_GUILD);
		data.id = id;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*查找工会 */
	public static send_GET_GUILD_LIST_BY_NAME(name) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_GUILD_LIST_BY_NAME);
		data.name = name;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*获取自己工会的信息id《=0，other》0 */
	public static send_GET_GUILD_INFO(isOpenView: boolean, id) {
		this.isOpenView = isOpenView;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_GUILD_INFO);
		data.id = id;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*退出联盟 */
	public static send_LEAVE_GUILD() {

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.LEAVE_GUILD);
		AGame.ServiceBuilder.sendMessage(data);
	}

	// /*有权限的人任命成员 */
	public static send_AppointPositionReq(playerId, positionId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APPOINT_POSITION);
		data.playerId = playerId;
		data.positionId = positionId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*军团联盟捐献 */
	public static send_GUILD_TECH_DONATE(techType, valueType) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_TECH_DONATE);
		data.techType = techType;
		data.valueType = valueType;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*盟主装让 */
	public static send_CHANGE_GUILD_LEADER(newLeaderId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.CHANGE_GUILD_LEADER);
		data.newLeaderId = newLeaderId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*联盟科技内容 */
	public static send_GUILD_TECHNOLOGY_VIEW() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_TECHNOLOGY_VIEW);
		AGame.ServiceBuilder.sendMessage(data);
	}

	/*联盟踢出联盟 */
	public static send_KICK_OUT_GUILD(playerId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.KICK_OUT_GUILD);
		data.playerId = playerId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*服务器发送给联盟的团长等有权限的人3615 */
	public static send_APPOINT_POSITION(playerId, positionId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.APPOINT_POSITION);
		data.playerId = playerId;
		data.positionId = positionId;
		AGame.ServiceBuilder.sendMessage(data);

	}

	/*邀请加入联盟5002 */
	public static send_INVITE_JOIN_GUILD(beInvitePlayerId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.INVITE_JOIN_GUILD);
		data.beInvitePlayerId = beInvitePlayerId;
		AGame.ServiceBuilder.sendMessage(data);

	}
	/*邀请加入联盟(被邀请人)5003 */
	public static send_BE_INVITE_JOIN_GUILD() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.BE_INVITE_JOIN_GUILD);
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*确定被邀请加入联盟:邀请人5004 */
	public static send_SURE_INVITE_JOIN_GUILD(beInvitePlayerId, guildId, name) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.SURE_INVITE_JOIN_GUILD);
		data.beInvitePlayerId = beInvitePlayerId;
		data.guildId = guildId;
		data.name = name;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/*确定被邀请加入联盟:被邀请人5005 */
	public static send_BE_SURE_INVITE_JOIN_GUILD(playerId, guildId, name) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.BE_SURE_INVITE_JOIN_GUILD);
		data.playerId = playerId;
		data.guildId = guildId;
		data.name = name;
		AGame.ServiceBuilder.sendMessage(data);

	}
	/*入团设置:/大殿等级/joinStatus 0：自由1：需要审核 */
	public static send_JOIN_GUILD_STATUS(buildingLevel, joinStatus) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.JOIN_GUILD_STATUS);
		data.buildingLevel = buildingLevel;
		data.joinStatus = joinStatus;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**联盟标志设置 */
	public static send_GUILD_ICON_STATUS(iconStatus) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_ICON_STATUS);
		data.iconStatus = iconStatus;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**联盟消息 */
	public static send_GUILD_INFORMATION(giildId, page) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_INFORMATION);
		data.giildId = giildId;
		data.page = page;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**申请入会待审核 */
	public static send_CHECK_APPLY_JOIN_GUILD(page) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.CHECK_APPLY_JOIN_GUILD);
		data.page = page;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/**申请入会待审核 0:同意，1：拒绝*/
	public static send_ACCEPT_APPLY_JOIN_GUILD(playerId, status, type) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.ACCEPT_APPLY_JOIN_GUILD);
		data.playerId = playerId;
		data.status = status;
		data.type = type;
		AGame.ServiceBuilder.sendMessage(data);

	}
	/**解散联盟 */
	public static send_DISSOLVE_GUILD(giildId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.DISSOLVE_GUILD);
		data.giildId = giildId;
		AGame.ServiceBuilder.sendMessage(data);

	}
	/**更改联盟宣言 */
	public static send_CHANGE_DECLARATION(newDeclaration) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.CHANGE_DECLARATION);
		data.newDeclaration = newDeclaration;
		AGame.ServiceBuilder.sendMessage(data);

	}
	/**弹劾盟主 */
	public static C2S_ACCUSE_GUILD() {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACCUSE_GUILD) as gameProto.C2S_ACCUSE_GUILD;
		AGame.ServiceBuilder.sendMessage(data);
	}

}