//官职模块
var CountryModel = /** @class */ (function () {
    function CountryModel() {
    }
    CountryModel.init = function () {
    };
    CountryModel.clear = function () {
    };
    CountryModel.IsKing = function (playerId) {
        return CountryModel.King_PlayerInfo.playerId == playerId;
    };
    CountryModel.IsSelf = function (playerId) {
        return CountryModel.Self_PlayerInfo.playerId == playerId;
    };
    CountryModel.ReplaceJobInfos = function (jobs, isReplace) {
        if (isReplace === void 0) { isReplace = false; }
        if (isReplace) {
            CountryModel.JobInfos = {};
            CountryModel.Self_PlayerInfo.jobId = 0;
        }
        CountryModel.m_jobNumber = jobs.length;
        for (var _i = 0, jobs_1 = jobs; _i < jobs_1.length; _i++) {
            var job = jobs_1[_i];
            var jobInfo = new JobInfo();
            jobInfo.PlayerInfo = job.playerInfo;
            if (jobInfo.PlayerInfo) {
                CountryModel.JobInfos[job.jobId] = jobInfo;
            }
            else {
                if (job && job.jobId)
                    delete CountryModel.JobInfos[job.jobId];
            }
            if (jobInfo.PlayerInfo && jobInfo.PlayerInfo.playerId == RoleData.playerId) {
                CountryModel.Self_PlayerInfo = jobInfo.PlayerInfo;
            }
            if (jobInfo.PlayerInfo && jobInfo.PlayerInfo.jobId == 1) {
                CountryModel.King_PlayerInfo = jobInfo.PlayerInfo;
            }
        }
    };
    CountryModel.ReplaceCityInfos = function (citys) {
        for (var _i = 0, citys_1 = citys; _i < citys_1.length; _i++) {
            var city = citys_1[_i];
            if (city.cityId == 0) {
                this.CityInfos[CountryModel.curCityId].PlayerInfo = null;
                continue;
            }
            var cityInfo = this.CityInfos[city.cityId];
            if (isNull(cityInfo))
                cityInfo = new CityInfo();
            cityInfo.CityCfg = C.WorldMapConfig[city.cityId];
            if (unNull(city.playerInfo)) {
                cityInfo.PlayerInfo = city.playerInfo;
            }
            else {
                cityInfo.PlayerInfo = null;
            }
            this.CityInfos[city.cityId] = cityInfo;
        }
    };
    CountryModel.getCityPlayerInfoByCityId = function (cityId) {
        return this.CityInfos[cityId] ? this.CityInfos[cityId].PlayerInfo : null;
    };
    /**
     * 根据id获得城池类型
     */
    CountryModel.getCityInfoByCityId = function (cityId) {
        return this.CityInfos[cityId];
    };
    /**更新任务 */
    // public static updateTaskInfo(taskId: number, taskProVal: number) {
    //     this.TaskId = taskId;
    //     this.TaskCurValue = taskProVal;
    //     com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_COUNTRY, null);
    // }
    /**判断是否弹称王面板 */
    CountryModel.countryCoronation = function (info) {
        var kingchangeList = info.kingchange;
        if (isNull(kingchangeList) || kingchangeList.length == 0)
            return;
        var isChange = false;
        for (var _i = 0, kingchangeList_1 = kingchangeList; _i < kingchangeList_1.length; _i++) {
            var notice = kingchangeList_1[_i];
            if (info.kingChangeStamp < notice.changeStamp && notice.countryId == RoleData.countryId && RoleData.level >= 20) {
                ScenePopQueWnd.addKingNotice(notice);
                if (isChange)
                    continue;
                isChange = true;
                CountryProxy.C2S_COUNTRY_KING_CHANGE_STAMP();
            }
        }
        // }
    };
    /**国家任务完成 */
    CountryModel.isCompleteCountryTask = function (isWorld, state) {
        if (isWorld === void 0) { isWorld = false; }
        if (state === void 0) { state = 0; }
        if (isWorld && !FunctionModel.isFunctionOpen(FunctionType.WORLD_MAP)) {
            return false;
        }
        var condition = MissionModel.getCountryTask();
        var res = condition ? condition.state == TaskStatus.FINISH : false;
        if (state == 1)
            res = !res;
        return res;
    };
    CountryModel.canAward = function () {
        var time = TimerUtils.getTodayStartTime(21 * 3600); //刷新时间戳
        if (CountryModel.selfSalaryJobId && CountryModel.selfSalaryStamp < time) {
            return true;
        }
        return false;
    };
    //=============================================================================================================================================
    //配置表 begin
    //============================================================================================================================================= 
    /**获得官职加成 */
    CountryModel.getJobAdd = function (type) {
        type = Number(type);
        var effectCfg = this.getJobEffectCfg();
        if (effectCfg) {
            switch (type) {
                case AttriType.POWER: {
                    return effectCfg.power;
                }
                case AttriType.INTELLIGENCE: {
                    return effectCfg.intelligence;
                }
                case AttriType.LEADERSHIP: {
                    return effectCfg.leadership;
                }
                //攻击加成 百分比
                case AttriType.ATK_AFFIX: {
                    return effectCfg.atk;
                }
                //防御加成 百分比
                case AttriType.DEF_AFFIX: {
                    return effectCfg.def;
                }
                case AttriType.HP: {
                    return effectCfg.hp;
                }
                case AttriType.SOLDIER: {
                    return effectCfg.armyHp;
                }
            }
        }
        return 0;
    };
    /**获得世界地图移动速度加成 % */
    CountryModel.getJobAddWorldSpeed = function () {
        var effectCfg = this.getJobEffectCfg();
        if (effectCfg) {
            return effectCfg.mobile;
        }
        return 0;
    };
    /**获得科技加速时间 s */
    CountryModel.getJobAddTeachFreeTime = function () {
        var effectCfg = this.getJobEffectCfg();
        if (effectCfg) {
            return effectCfg.technology;
        }
        return 0;
    };
    /**领取税收奖励 */
    /**等级奖励弹框显示 */
    CountryModel.receivenueReward = function (data) {
        if (data.errorCode == 0) {
            RoleData.hasCityRevenue = false;
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        }
    };
    /**获得官职加成效果配置表 */
    CountryModel.getJobEffectCfg = function () {
        if (RoleData.governmentPost > 0) {
            var cfg = C.JobConfig[RoleData.governmentPost];
            if (cfg != null && cfg != undefined) {
                var effectCfg = C.JobInfoConfig[cfg.effect];
                if (effectCfg != null && effectCfg != undefined) {
                    return effectCfg;
                }
            }
        }
        return null;
    };
    //=============================================================================================================================================
    //配置表 end
    //============================================================================================================================================= 
    CountryModel.setCountryEmperorInfo = function (info) {
        this.countryEmperorInfo = info;
    };
    CountryModel.getCountryEmperorInfo = function () {
        return this.countryEmperorInfo;
    };
    CountryModel.setCityChangeInfo = function (list) {
        this.m_cityChangeList = [];
        for (var _i = 0, _a = list.infos; _i < _a.length; _i++) {
            var i = _a[_i];
            this.addCityChangeInfo(i);
        }
        var len = this.m_cityChangeList.length;
        if (!len)
            return;
        var lastTime = this.m_cityChangeList[len - 1].time.toString();
        var norTime = LocalData.getData('LAST_CITY_CHANGE_TIME');
        if (norTime == '' && len) {
            LocalData.setData('LAST_CITY_CHANGE_TIME', lastTime);
            this.m_cityChangeRed = true;
        }
        else if (norTime != '' && len) {
            if (norTime != lastTime) {
                LocalData.setData('LAST_CITY_CHANGE_TIME', lastTime);
                this.m_cityChangeRed = true;
            }
        }
    };
    CountryModel.addCityChangeInfo = function (info) {
        var info1 = {
            time: info.time,
            cityId: info.cityId,
            countryId: info.countryId,
            type: info.type
        };
        this.m_cityChangeList.push(info1);
    };
    CountryModel.getCityChangeInfo = function () {
        return this.m_cityChangeList;
    };
    CountryModel.getCityChangeRed = function () {
        return this.m_cityChangeRed;
    };
    CountryModel.setCityChangeRed = function (boo) {
        this.m_cityChangeRed = boo;
        com_main.EventMgr.dispatchEvent(CountryEvent.CITY_CHANGE, null);
        if (!boo && this.m_cityChangeList && this.m_cityChangeList.length) {
            var lastTime = this.m_cityChangeList[this.m_cityChangeList.length - 1].time.toString();
            LocalData.setData('LAST_CITY_CHANGE_TIME', lastTime);
            this.m_cityChangeRed = false;
        }
    };
    // public static TaskId: number = 19;
    // public static TaskCurValue: number = 0;
    CountryModel.CityInfos = {};
    CountryModel.JobInfos = {};
    CountryModel.curBtnStr = "";
    CountryModel.curBtn = 0;
    CountryModel.curJobId = 0;
    CountryModel.curCityId = 0;
    CountryModel.m_cityChangeRed = false;
    return CountryModel;
}());
var CityInfo = /** @class */ (function () {
    function CityInfo() {
    }
    return CityInfo;
}());
var JobInfo = /** @class */ (function () {
    function JobInfo() {
    }
    return JobInfo;
}());
