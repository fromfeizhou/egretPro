/**
 * 联盟
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LegionProxy = /** @class */ (function (_super_1) {
    __extends(LegionProxy, _super_1);
    function LegionProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    LegionProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.GUILD_LIST, this, 'GuildListReq', 'GuildListResp'],
            [ProtoDef.CREATE_GUILD, this, 'CreateGuildReq', 'CreateGuildResp'],
            [ProtoDef.APPLY_JOIN_GUILD, this, 'ApplyJoinGuildReq', 'ApplyJoinGuildResp'],
            [ProtoDef.GET_GUILD_LIST_BY_NAME, this, 'GetGuildListByNameReq', 'GetGuildListByNameResp'],
            [ProtoDef.GET_GUILD_INFO, this, 'GetGuildInfoReq', 'GetGuildInfoResp'],
            [ProtoDef.LEAVE_GUILD, this, 'LeaveGuildReq', 'LeaveGuildResp'],
            // [ProtoDef.APPOINT_POSITION, this, 'AddDonationReq', 'AddDonationResp'],// 联盟捐献
            [ProtoDef.GUILD_TECH_DONATE, this, 'GuildTechDonateReq', 'GuildTechDonateResp'],
            [ProtoDef.CHANGE_GUILD_LEADER, this, 'ChangeGuildLeaderReq', 'ChangeGuildLeaderResp'],
            [ProtoDef.GUILD_TECHNOLOGY_VIEW, this, 'GuildTechnologyViewReq', 'GuildTechnologyViewResp'],
            [ProtoDef.GUILD_TECHNOLOGY_LEVEL_UP, this, '', 'GuildTechnologyLevelUpResp'],
            [ProtoDef.KICK_OUT_GUILD, this, 'KickOutGuildReq', 'KickOutGuildResp'],
            [ProtoDef.APPOINT_POSITION, this, 'AppointPositionReq', 'AppointPositionResp'],
            [ProtoDef.INVITE_JOIN_GUILD, this, 'InviteJoinGuildReq', 'InviteJoinGuildResp'],
            [ProtoDef.BE_INVITE_JOIN_GUILD, this, 'BeInviteJoinGuildReq', 'BeInviteJoinGuildResp'],
            [ProtoDef.SURE_INVITE_JOIN_GUILD, this, 'SuerInviteJoinGuildReq', 'SuerInviteJoinGuildResp'],
            [ProtoDef.BE_SURE_INVITE_JOIN_GUILD, this, 'BeSuerInviteJoinGuildReq', 'BeSuerInviteJoinGuildResp'],
            [ProtoDef.JOIN_GUILD_STATUS, this, 'JoinGuildStatusReq', 'JoinGuildStatusResp'],
            [ProtoDef.GUILD_ICON_STATUS, this, 'GuildIconStatusReq', 'GuildIconStatusResp'],
            [ProtoDef.GUILD_INFORMATION, this, 'GuildInformationReq', 'GuildInformationResp'],
            [ProtoDef.KICK_OUT_FROM_GUILD, this, '', 'KickOutFromGuildResp'],
            [ProtoDef.CHECK_APPLY_JOIN_GUILD, this, 'CheckApplyJoinGuildReq', 'CheckApplyJoinGuildResp'],
            [ProtoDef.ACCEPT_APPLY_JOIN_GUILD, this, 'AcceptApplyJoinGuildReq', 'AcceptApplyJoinGuildResp'],
            [ProtoDef.JOIN_GUILD, this, '', 'JoinGuildResp'],
            [ProtoDef.BE_APPOINT_POSITION, this, '', 'BeAppointPositionResp'],
            [ProtoDef.DISSOLVE_GUILD, this, 'DissolveGuildReq', 'DissolveGuildResp'],
            [ProtoDef.CHANGE_DECLARATION, this, 'ChangeDeclarationReq', 'ChangeDeclarationResp'],
        ];
    };
    LegionProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_ACCUSE_GUILD, this, 'C2S_ACCUSE_GUILD', ProxyEnum.SEND],
            [ProtoDef.S2C_ACCUSE_GUILD, this, 'S2C_ACCUSE_GUILD', ProxyEnum.RECEIVE],
        ];
    };
    LegionProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.GUILD_LIST: {
                if (body) {
                    var data = body;
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
            case ProtoDef.CREATE_GUILD: { // 创建联盟
                if (body.guildInfo) {
                    var data = body;
                    LegionModel.setGuildInfo(data.guildInfo);
                    LegionModel.parseTeach(data.guildInfo.guildTechInfo);
                    LegionModel.updateResourceNum(data.guildInfo.donateResourceCount);
                    com_main.UpManager.close();
                    Utils.open_view(TASK_UI.LEGION_MAIN_WND);
                }
                else {
                }
                break;
            }
            case ProtoDef.GET_GUILD_INFO: { //  如果没有加入任何帮会，该变量没有值
                if (body.guildInfo) {
                    var data = body;
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
            case ProtoDef.S2C_ACCUSE_GUILD: { //  如果没有加入任何帮会，该变量没有值
                var data = body;
                if (data) {
                    LegionProxy.send_GET_GUILD_INFO(false, 0);
                }
                break;
            }
            case ProtoDef.APPLY_JOIN_GUILD: { // 申请加入工会
                // 			required uint64 id = 1; // 帮会的唯一id
                // required uint32 join = 2; // 联盟是否立即加入， 不是立即加入就等待审核后才加入0：自由1：需要审核
                // required uint32 GuildBuildingLevel = 3;//大殿等级
                if (body.join == 0) {
                    var level = MainMapModel.getBuildInfo(1).level;
                    if (level >= body.GuildBuildingLevel) {
                        com_main.UpManager.removeAllPanel();
                        LegionProxy.send_GET_GUILD_INFO(true, 0);
                    }
                    else {
                        EffectUtils.showTips(GCodeFromat(CLEnum.GUILD_APPLY_FAL, body.GuildBuildingLevel), 1, true);
                    }
                }
                else if (body.join == 1) {
                    EffectUtils.showTips(GCode(CLEnum.GUILD_APPLY_IN), 1, true);
                }
                break;
            }
            case ProtoDef.LEAVE_GUILD: { // 退出联盟成功，不成功直接返回错误码
                LegionModel.dissolve();
                break;
            }
            case ProtoDef.GUILD_TECH_DONATE: { // 联盟捐献
                if (body) {
                    var data = body;
                    LegionModel.updateTeach(data.guildTechInfo);
                    LegionModel.updateResourceNum(data.donateResourceCount);
                }
                break;
            }
            case ProtoDef.GUILD_TECHNOLOGY_LEVEL_UP: { // 联盟科技升级返回
                if (body) {
                }
                break;
            }
            case ProtoDef.CHANGE_GUILD_LEADER: { // 装让盟主
                LegionProxy.send_GET_GUILD_INFO(false, 0);
                break;
            }
            case ProtoDef.GUILD_TECHNOLOGY_VIEW: { // 联盟内容请求
                if (body) {
                    // LegionModel.setTechInfo(body);
                    // Utils.open_view(TASK_UI.LEGION_DONATION_PANEL,body);
                }
                break;
            }
            case ProtoDef.KICK_OUT_GUILD: { //踢出工会
                LegionProxy.send_GET_GUILD_INFO(false, 0);
                break;
            }
            case ProtoDef.APPOINT_POSITION: { //服务器发送给联盟的团长等有权限的人3615
                if (body) {
                    /** add code */
                    LegionProxy.send_GET_GUILD_INFO(false, 0);
                }
                break;
            }
            case ProtoDef.INVITE_JOIN_GUILD: { //邀请加入军团联盟02
                if (body) {
                    /** add code */
                }
                break;
            }
            case ProtoDef.BE_INVITE_JOIN_GUILD: { //邀请加入联盟(被邀请人)5003
                if (body) {
                    /** add code */
                }
                break;
            }
            case ProtoDef.SURE_INVITE_JOIN_GUILD: { //确定被邀请加入联盟:邀请人5004
                if (body) {
                    /** add code */
                }
                break;
            }
            case ProtoDef.BE_SURE_INVITE_JOIN_GUILD: { //确定被邀请加入联盟:被邀请人5005
                if (body) {
                    /** add code */
                }
                break;
            }
            case ProtoDef.JOIN_GUILD_STATUS: { //入团设置5006
                if (body) {
                    /** add code */
                    EffectUtils.showTips(GCode(CLEnum.GUILD_SET_TIPS), 1, true);
                }
                break;
            }
            case ProtoDef.GUILD_ICON_STATUS: { //联盟标志设置5007
                if (body) {
                    /** add code */
                }
                break;
            }
            case ProtoDef.GUILD_INFORMATION: { //联盟标志设置5008
                if (body) {
                    /** add code */
                }
                break;
            }
            case ProtoDef.KICK_OUT_FROM_GUILD: { //
                if (body) {
                    if (body.playerId == RoleData.playerId) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_KICK_TIPS), 1, true);
                        LegionModel.dissolve();
                        var obj = SceneManager.getClass(LayerEnums.POPUP, com_main.LegionMainWnd.NAME);
                        if (obj) {
                            com_main.UpManager.close();
                        }
                    }
                }
                break;
            }
            case ProtoDef.CHECK_APPLY_JOIN_GUILD: { //3617
                if (body) {
                    var info = body.stayApplyJoin;
                    LegionModel.m_messInfoTotalPage = info.length;
                }
                break;
            }
            case ProtoDef.ACCEPT_APPLY_JOIN_GUILD: { //3607
                if (body) {
                    /** add code */
                    if (body.status == 0)
                        LegionProxy.send_GET_GUILD_INFO(false, 0);
                }
                break;
            }
            case ProtoDef.JOIN_GUILD: { //3608  申请者被同意
                if (body) {
                    LegionModel.setGuildInfo(body.guildInfo);
                    // LegionProxy.send_GET_GUILD_INFO(false,0);
                    var obj = SceneManager.getClass(LayerEnums.POPUP, com_main.LegionListWnd.NAME);
                    if (obj) {
                        com_main.UpManager.close();
                        LegionProxy.send_GET_GUILD_INFO(true, 0);
                    }
                    else {
                        LegionProxy.send_GET_GUILD_INFO(false, 0);
                    }
                }
                break;
            }
            case ProtoDef.BE_APPOINT_POSITION: { //3616
                if (body) {
                    LegionProxy.send_GET_GUILD_INFO(false, 0);
                }
                break;
            }
            case ProtoDef.DISSOLVE_GUILD: { //3618
                if (body) {
                    com_main.UpManager.close();
                    EffectUtils.showTips(GCode(CLEnum.GUILD_DISS_TIPS), 1, true);
                    LegionModel.dissolve();
                }
                break;
            }
            case ProtoDef.CHANGE_DECLARATION: { //3613
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求联盟列表 */
    LegionProxy.send_GUILD_LIST_OPEN_VIEW = function () {
        this.isOpenView = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求联盟列表 */
    LegionProxy.send_GUILD_LIST = function () {
        this.isOpenView = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求创建联盟 */
    LegionProxy.send_CREATE_GUILD = function (legionName, LegionNotice) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.CREATE_GUILD);
        data.name = legionName; // 名称
        data.declaration = LegionNotice; // 联盟宣言
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求加入联盟 */
    LegionProxy.send_APPLY_JOIN_GUILD = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APPLY_JOIN_GUILD);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*查找工会 */
    LegionProxy.send_GET_GUILD_LIST_BY_NAME = function (name) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_GUILD_LIST_BY_NAME);
        data.name = name;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*获取自己工会的信息id《=0，other》0 */
    LegionProxy.send_GET_GUILD_INFO = function (isOpenView, id) {
        this.isOpenView = isOpenView;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GET_GUILD_INFO);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*退出联盟 */
    LegionProxy.send_LEAVE_GUILD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.LEAVE_GUILD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    // /*有权限的人任命成员 */
    LegionProxy.send_AppointPositionReq = function (playerId, positionId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APPOINT_POSITION);
        data.playerId = playerId;
        data.positionId = positionId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*军团联盟捐献 */
    LegionProxy.send_GUILD_TECH_DONATE = function (techType, valueType) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_TECH_DONATE);
        data.techType = techType;
        data.valueType = valueType;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*盟主装让 */
    LegionProxy.send_CHANGE_GUILD_LEADER = function (newLeaderId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.CHANGE_GUILD_LEADER);
        data.newLeaderId = newLeaderId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*联盟科技内容 */
    LegionProxy.send_GUILD_TECHNOLOGY_VIEW = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_TECHNOLOGY_VIEW);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*联盟踢出联盟 */
    LegionProxy.send_KICK_OUT_GUILD = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.KICK_OUT_GUILD);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*服务器发送给联盟的团长等有权限的人3615 */
    LegionProxy.send_APPOINT_POSITION = function (playerId, positionId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.APPOINT_POSITION);
        data.playerId = playerId;
        data.positionId = positionId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*邀请加入联盟5002 */
    LegionProxy.send_INVITE_JOIN_GUILD = function (beInvitePlayerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.INVITE_JOIN_GUILD);
        data.beInvitePlayerId = beInvitePlayerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*邀请加入联盟(被邀请人)5003 */
    LegionProxy.send_BE_INVITE_JOIN_GUILD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.BE_INVITE_JOIN_GUILD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*确定被邀请加入联盟:邀请人5004 */
    LegionProxy.send_SURE_INVITE_JOIN_GUILD = function (beInvitePlayerId, guildId, name) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.SURE_INVITE_JOIN_GUILD);
        data.beInvitePlayerId = beInvitePlayerId;
        data.guildId = guildId;
        data.name = name;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*确定被邀请加入联盟:被邀请人5005 */
    LegionProxy.send_BE_SURE_INVITE_JOIN_GUILD = function (playerId, guildId, name) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.BE_SURE_INVITE_JOIN_GUILD);
        data.playerId = playerId;
        data.guildId = guildId;
        data.name = name;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /*入团设置:/大殿等级/joinStatus 0：自由1：需要审核 */
    LegionProxy.send_JOIN_GUILD_STATUS = function (buildingLevel, joinStatus) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.JOIN_GUILD_STATUS);
        data.buildingLevel = buildingLevel;
        data.joinStatus = joinStatus;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**联盟标志设置 */
    LegionProxy.send_GUILD_ICON_STATUS = function (iconStatus) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_ICON_STATUS);
        data.iconStatus = iconStatus;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**联盟消息 */
    LegionProxy.send_GUILD_INFORMATION = function (giildId, page) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GUILD_INFORMATION);
        data.giildId = giildId;
        data.page = page;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**申请入会待审核 */
    LegionProxy.send_CHECK_APPLY_JOIN_GUILD = function (page) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.CHECK_APPLY_JOIN_GUILD);
        data.page = page;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**申请入会待审核 0:同意，1：拒绝*/
    LegionProxy.send_ACCEPT_APPLY_JOIN_GUILD = function (playerId, status, type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.ACCEPT_APPLY_JOIN_GUILD);
        data.playerId = playerId;
        data.status = status;
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**解散联盟 */
    LegionProxy.send_DISSOLVE_GUILD = function (giildId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.DISSOLVE_GUILD);
        data.giildId = giildId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**更改联盟宣言 */
    LegionProxy.send_CHANGE_DECLARATION = function (newDeclaration) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.CHANGE_DECLARATION);
        data.newDeclaration = newDeclaration;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**弹劾盟主 */
    LegionProxy.C2S_ACCUSE_GUILD = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_ACCUSE_GUILD);
        AGame.ServiceBuilder.sendMessage(data);
    };
    LegionProxy.isOpenView = false;
    return LegionProxy;
}(BaseProxy));
