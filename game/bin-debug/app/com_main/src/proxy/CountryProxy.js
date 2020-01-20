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
var CountryProxy = /** @class */ (function (_super_1) {
    __extends(CountryProxy, _super_1);
    function CountryProxy() {
        return _super_1.call(this) || this;
    }
    CountryProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.COUNTRY_INFO, this, 'CountryInfoReq', 'CountryInfoResp'],
            [ProtoDef.COUNTRY_EDITOR_NOTICE, this, 'CountryNoticeReq', 'CountryNoticeResp'],
            [ProtoDef.COUNTRY_JOB_APPLY_UP, this, 'CountryApplyJobReq', 'CountryApplyJobResp'],
            [ProtoDef.COUNTRY_CITY_APPLY_UP, this, 'CountryApplyCityReq', 'CountryApplyCityResp'],
            [ProtoDef.COUNTRY_APPLY_LIST, this, 'CountryApplyListReq', 'CountryApplyListResp'],
            // [ProtoDef.COUNTRY_TASK_FINISH, this, 'CountryTaskFinishReq', 'CountryTaskFinishResp'], //完成国家任务
            [ProtoDef.COUNTRY_ABDICATE, this, 'CountryAbdicateReq', ''],
        ];
    };
    CountryProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_COUNTRY_CITY_INFO, this, 'C2S_COUNTRY_CITY_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_CITY_INFO, this, 'S2C_COUNTRY_CITY_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_COUNTRY_KING_CHANGE_STAMP, this, 'C2S_COUNTRY_KING_CHANGE_STAMP', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_KING_CHANGE_STAMP, this, 'S2C_COUNTRY_KING_CHANGE_STAMP', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_COUNTRY_START_IMPEACH, this, 'C2S_COUNTRY_START_IMPEACH', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_START_IMPEACH, this, 'S2C_COUNTRY_START_IMPEACH', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_COUNTRY_VOTE_IMPEACH, this, 'C2S_COUNTRY_VOTE_IMPEACH', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_VOTE_IMPEACH, this, 'S2C_COUNTRY_VOTE_IMPEACH', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_COUNTRY_SALARY, this, 'C2S_COUNTRY_SALARY', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_SALARY, this, 'S2C_COUNTRY_SALARY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_COUNTRY_CITY, this, 'C2S_COUNTRY_CITY', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_CITY, this, 'S2C_COUNTRY_CITY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_COUNTRY_CITY_REVENUE, this, 'C2S_COUNTRY_CITY_REVENUE', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_CITY_REVENUE, this, 'S2C_COUNTRY_CITY_REVENUE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_COUNTRY_CITY_REVENUE_STATUS, this, 'S2C_COUNTRY_CITY_REVENUE_STATUS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_COUNTRY_EMPEROR_INFO, this, 'C2S_COUNTRY_EMPEROR_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_COUNTRY_EMPEROR_INFO, this, 'S2C_COUNTRY_EMPEROR_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_CHANGE_INFO_LIST, this, 'C2S_CITY_CHANGE_INFO_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_CHANGE_INFO_LIST, this, 'S2C_CITY_CHANGE_INFO_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CITY_CHANGE_INFO, this, 'S2C_CITY_CHANGE_INFO', ProxyEnum.RECEIVE],
        ];
    };
    CountryProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var proto = notification.getName();
        switch (proto) {
            case ProtoDef.COUNTRY_INFO: {
                var VO = body;
                CountryModel.Self_PlayerInfo = VO.selfPlayerInfo;
                CountryModel.King_PlayerInfo = VO.kingPlayerInfo;
                CountryModel.Notice = VO.notice;
                // CountryModel.TaskId = VO.taskId;
                // CountryModel.updateTaskInfo(VO.taskId, VO.taskCurValue);
                CountryModel.selfSalaryStamp = VO.salaryStamp;
                CountryModel.selfSalaryJobId = VO.salaryJobId;
                CountryModel.ReplaceJobInfos(VO.jobInfos, true);
                CountryModel.countryCoronation(VO.selfPlayerInfo);
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
                var data = body;
                if (data.errorCode == 0) {
                    CountryModel.receivenueReward(data);
                }
                com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_CITY_REVENUE, body);
                break;
            }
            case ProtoDef.S2C_COUNTRY_CITY_REVENUE_STATUS: {
                var data = body;
                RoleData.hasCityRevenue = data.canReceiveCityRevenue;
                com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_CITY_REVENUE_STATUS, body);
                break;
            }
            case ProtoDef.COUNTRY_JOB_APPLY_UP: {
                var jobs = body.jobInfos;
                CountryModel.ReplaceJobInfos(jobs);
                if (CountryModel.curBtnStr != "") {
                    EffectUtils.showTips(CountryModel.curBtnStr);
                    CountryModel.curBtnStr = "";
                }
                if (CountryModel.curBtn == 2) {
                    //卸任
                    delete CountryModel.JobInfos[CountryModel.curJobId];
                }
                com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_JOB_APPLY_UP, body);
                break;
            }
            case ProtoDef.COUNTRY_CITY_APPLY_UP: {
                var citys = body.cityInfos;
                CountryModel.ReplaceCityInfos(citys);
                EffectUtils.showTips(GCode(CLEnum.GUILD_APPLY_TIPS));
                com_main.EventMgr.dispatchEvent(CountryEvent.COUNTRY_CITY_APPLY_UP, body);
                break;
            }
            case ProtoDef.COUNTRY_APPLY_LIST: {
                var param = CountryModel.ApplyListViewParam;
                param.ApplyList = body.playerInfoList;
                Utils.open_view(TASK_UI.COUNTRY_APPLY_LIST, param);
                break;
            }
            case ProtoDef.S2C_COUNTRY_CITY_INFO: {
                var data = body;
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
    };
    /////////////////////////////////////////////////////////////////////
    // /** 国家信息 打开界面 isopen = true*/
    // public static send_COUNTRY_INFO_OPEN_VIEW() {
    // 	// this.isOpenView = true;
    // 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_INFO);
    // 	AGame.ServiceBuilder.sendMessage(data);
    // }
    /** 国家信息 不打开界面  isopen = false*/
    CountryProxy.send_COUNTRY_INFO = function () {
        // this.isOpenView = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 公告编辑 */
    CountryProxy.send_COUNTRY_NOTICE = function (notice) {
        CountryModel.oldNotice = notice;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_EDITOR_NOTICE);
        data.notice = notice;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**城池信息 */
    CountryProxy.C2S_COUNTRY_CITY_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_CITY_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 官职任命 */
    CountryProxy.send_COUNTRY_APPLY_JOB = function (jobId, playerId) {
        if (jobId == 1) {
            this.send_COUNTRY_ABDICATE(playerId);
        }
        else {
            CountryModel.curJobId = jobId;
            var data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_JOB_APPLY_UP);
            data.jobId = jobId;
            data.playerId = playerId;
            AGame.ServiceBuilder.sendMessage(data);
        }
    };
    /** 城池任命 */
    CountryProxy.send_COUNTRY_APPLY_CITY = function (cityId, playerId) {
        CountryModel.curCityId = cityId;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_CITY_APPLY_UP);
        data.cityId = cityId;
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 完成国家任务 */
    // public static send_COUNTRY_TASK_FINISH(taskId: number) {
    // 	let data: gameProto.CountryTaskFinishReq = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_TASK_FINISH);
    // 	data.taskId = taskId;
    // 	AGame.ServiceBuilder.sendMessage(data);
    // }
    /** 请求玩家任命列表数据 */
    CountryProxy.send_COUNTRY_APPLY_LIST = function (listType, jobId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_APPLY_LIST);
        data.listType = listType;
        data.jobId = jobId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 禅让 */
    CountryProxy.send_COUNTRY_ABDICATE = function (playerId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.COUNTRY_ABDICATE);
        data.playerId = playerId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**称王阅读 */
    CountryProxy.C2S_COUNTRY_KING_CHANGE_STAMP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_KING_CHANGE_STAMP);
        AGame.ServiceBuilder.sendMessage(data);
    };
    CountryProxy.C2S_COUNTRY_START_IMPEACH = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_START_IMPEACH);
        AGame.ServiceBuilder.sendMessage(data);
    };
    CountryProxy.C2S_COUNTRY_VOTE_IMPEACH = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_VOTE_IMPEACH);
        AGame.ServiceBuilder.sendMessage(data);
    };
    CountryProxy.C2S_COUNTRY_SALARY = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_SALARY);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**查看城池归属 */
    CountryProxy.C2S_COUNTRY_CITY = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_CITY);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**城市税收 */
    CountryProxy.C2S_COUNTRY_CITY_REVENUE = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_CITY_REVENUE);
        AGame.ServiceBuilder.sendMessage(data);
    };
    //查看襄阳战国王信息
    CountryProxy.send_C2S_COUNTRY_EMPEROR_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_COUNTRY_EMPEROR_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**获取城池变更信息 */
    CountryProxy.send_C2S_CITY_CHANGE_INFO_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_CHANGE_INFO_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    CountryProxy.isOpenView = true;
    return CountryProxy;
}(BaseProxy));
