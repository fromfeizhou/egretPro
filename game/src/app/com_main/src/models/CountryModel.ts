//官职模块
class CountryModel {
    public static Self_PlayerInfo: gameProto.CountryPlayerInfo;
    public static King_PlayerInfo: gameProto.CountryPlayerInfo;
    public static selfSalaryStamp: number;
    public static selfSalaryJobId: number;
    public static Notice: string;
    public static oldNotice: string;

    // public static TaskId: number = 19;
    // public static TaskCurValue: number = 0;


    public static CityInfos: { [id: number]: CityInfo } = {};
    public static JobInfos: { [id: number]: JobInfo } = {};

    public static LeaveCity: boolean;

    public static ApplyListViewParam: any;

    public ownerInfo: gameProto.ICountryPlayerInfo;     //个人信息
    public kingInfo: gameProto.ICountryPlayerInfo;  //国王信息
    public cityInfos: { [id: number]: gameProto.ICityInfo };       //城池列表

    public taskId: number;   //任务id
    public taskVal: number;  //进度
    public static curBtnStr: string = "";
    public static curBtn: number = 0;
    public static curJobId: number = 0;
    public static curCityId: number = 0;

    public static m_jobNumber: number;

    //襄阳战国王信息
    private static countryEmperorInfo: gameProto.S2C_COUNTRY_EMPEROR_INFO;
    public static init() {

    }

    public static clear() {

    }

    public static IsKing(playerId: number): boolean {
        return CountryModel.King_PlayerInfo.playerId == playerId;
    }

    public static IsSelf(playerId: number): boolean {
        return CountryModel.Self_PlayerInfo.playerId == playerId;
    }

    public static ReplaceJobInfos(jobs: gameProto.ICountryJobInfo[], isReplace: boolean = false): void {
        if (isReplace) {
            CountryModel.JobInfos = {};
            CountryModel.Self_PlayerInfo.jobId = 0;
        }
        CountryModel.m_jobNumber = jobs.length;
        for (let job of jobs) {
            let jobInfo: JobInfo = new JobInfo();
            jobInfo.PlayerInfo = job.playerInfo as gameProto.CountryPlayerInfo;
            if (jobInfo.PlayerInfo) {
                CountryModel.JobInfos[job.jobId] = jobInfo;
            } else {
                if (job && job.jobId) delete CountryModel.JobInfos[job.jobId]
            }
            if (jobInfo.PlayerInfo && jobInfo.PlayerInfo.playerId == RoleData.playerId) {
                CountryModel.Self_PlayerInfo = jobInfo.PlayerInfo;
            }
            if (jobInfo.PlayerInfo && jobInfo.PlayerInfo.jobId == 1) {
                CountryModel.King_PlayerInfo = jobInfo.PlayerInfo;
            }
        }
    }

    public static ReplaceCityInfos(citys: gameProto.ICountryCityInfo[]): void {
        for (let city of citys) {
            if (city.cityId == 0) {
                this.CityInfos[CountryModel.curCityId].PlayerInfo = null;
                continue;
            }
            let cityInfo: CityInfo = this.CityInfos[city.cityId]
            if (isNull(cityInfo))
                cityInfo = new CityInfo();
            cityInfo.CityCfg = C.WorldMapConfig[city.cityId];
            if (unNull(city.playerInfo)) {
                cityInfo.PlayerInfo = city.playerInfo as gameProto.CountryPlayerInfo;
            } else {
                cityInfo.PlayerInfo = null;
            }
            this.CityInfos[city.cityId] = cityInfo;
        }
    }
    public static getCityPlayerInfoByCityId(cityId: number): gameProto.ICountryPlayerInfo {
        return this.CityInfos[cityId] ? this.CityInfos[cityId].PlayerInfo : null;
    }
    /**
     * 根据id获得城池类型
     */
    public static getCityInfoByCityId(cityId: number): CityInfo {
        return this.CityInfos[cityId]
    }
    /**更新任务 */
    // public static updateTaskInfo(taskId: number, taskProVal: number) {
    //     this.TaskId = taskId;
    //     this.TaskCurValue = taskProVal;

    //     com_main.EventMgr.dispatchEvent(MissionEvent.MISSION_COUNTRY, null);
    // }
    /**判断是否弹称王面板 */
    public static countryCoronation(info: gameProto.ICountryPlayerInfo) {
        let kingchangeList: gameProto.IKingChangeNotice[] = info.kingchange;
        if (isNull(kingchangeList) || kingchangeList.length == 0)
            return;
        let isChange: boolean = false;
        for (let notice of kingchangeList) {
            if (info.kingChangeStamp < notice.changeStamp && notice.countryId == RoleData.countryId && RoleData.level >= 20) {
                ScenePopQueWnd.addKingNotice(notice);
                if (isChange) continue
                isChange = true;
                CountryProxy.C2S_COUNTRY_KING_CHANGE_STAMP();
            }

        }


        // }

    }
    /**国家任务完成 */
    public static isCompleteCountryTask(isWorld: boolean = false, state: number = 0): boolean {
        if (isWorld && !FunctionModel.isFunctionOpen(FunctionType.WORLD_MAP)) {
            return false;
        }
        let condition = MissionModel.getCountryTask();
        let res = condition ? condition.state == TaskStatus.FINISH : false;
        if (state == 1) res = !res;
        return res;
    }

    public static canAward() {
        let time = TimerUtils.getTodayStartTime(21 * 3600); //刷新时间戳
        if (CountryModel.selfSalaryJobId && CountryModel.selfSalaryStamp < time) {
            return true;
        }
        return false;
    }

    //=============================================================================================================================================
    //配置表 begin
    //============================================================================================================================================= 
    /**获得官职加成 */
    public static getJobAdd(type: AttriType) {
        type = Number(type);
        let effectCfg = this.getJobEffectCfg();
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
    }
    /**获得世界地图移动速度加成 % */
    public static getJobAddWorldSpeed() {
        let effectCfg = this.getJobEffectCfg();
        if (effectCfg) {
            return effectCfg.mobile;
        }
        return 0;
    }

    /**获得科技加速时间 s */
    public static getJobAddTeachFreeTime() {
        let effectCfg = this.getJobEffectCfg();
        if (effectCfg) {
            return effectCfg.technology;
        }
        return 0;
    }
    /**领取税收奖励 */
    /**等级奖励弹框显示 */
    public static receivenueReward(data: gameProto.S2C_COUNTRY_CITY_REVENUE) {
        if (data.errorCode == 0) {
            RoleData.hasCityRevenue = false;
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        }
    }
    /**获得官职加成效果配置表 */
    public static getJobEffectCfg() {
        if (RoleData.governmentPost > 0) {
            let cfg = C.JobConfig[RoleData.governmentPost];
            if (cfg != null && cfg != undefined) {
                let effectCfg = C.JobInfoConfig[cfg.effect];
                if (effectCfg != null && effectCfg != undefined) {
                    return effectCfg;
                }
            }
        }
        return null;
    }
    //=============================================================================================================================================
    //配置表 end
    //============================================================================================================================================= 

    public static setCountryEmperorInfo(info: gameProto.S2C_COUNTRY_EMPEROR_INFO) {
        this.countryEmperorInfo = info;
    }

    public static getCountryEmperorInfo() {
        return this.countryEmperorInfo;
    }

    //=============================================================================================================================================
    //城池变更信息
    //============================================================================================================================================= 
    private static m_cityChangeList: gameProto.ICityChangeInfo[];
    private static m_cityChangeRed: boolean = false;
    public static setCityChangeInfo(list: gameProto.IS2C_CITY_CHANGE_INFO_LIST) {
        this.m_cityChangeList = [];
        for (let i of list.infos) {
            this.addCityChangeInfo(i);
        }
        let len = this.m_cityChangeList.length;
        if (!len) return;
        let lastTime = this.m_cityChangeList[len - 1].time.toString();
        let norTime = LocalData.getData('LAST_CITY_CHANGE_TIME');
        if (norTime == '' && len) {
            LocalData.setData('LAST_CITY_CHANGE_TIME', lastTime);
            this.m_cityChangeRed = true;
        } else if (norTime != '' && len) {
            if (norTime != lastTime) {
                LocalData.setData('LAST_CITY_CHANGE_TIME', lastTime);
                this.m_cityChangeRed = true;
            }
        }
    }

    public static addCityChangeInfo(info: gameProto.ICityChangeInfo) {
        let info1 = {
            time: info.time,
            cityId: info.cityId,
            countryId: info.countryId,
            type: info.type
        }
        this.m_cityChangeList.push(info1);
    }

    public static getCityChangeInfo() {
        return this.m_cityChangeList;
    }

    public static getCityChangeRed() {
        return this.m_cityChangeRed;
    }

    public static setCityChangeRed(boo: boolean) {
        this.m_cityChangeRed = boo;
        com_main.EventMgr.dispatchEvent(CountryEvent.CITY_CHANGE, null);
        if (!boo && this.m_cityChangeList && this.m_cityChangeList.length) {
            let lastTime = this.m_cityChangeList[this.m_cityChangeList.length - 1].time.toString();
            LocalData.setData('LAST_CITY_CHANGE_TIME', lastTime);
            this.m_cityChangeRed = false;
        }
    }


}
class CityInfo {
    public CityCfg: WorldMapConfig;
    public PlayerInfo: gameProto.CountryPlayerInfo;
}

class JobInfo {
    public JobCfg: JobConfig;
    public PlayerInfo: gameProto.CountryPlayerInfo;
}