/**世界地图 */
class WorldModel {
    public static m_tWorldParam: com_main.IWorldMapData;        //世界地图入口参数

    /**世界等级 */
    public static worldLevel: number = 0;
    /**城池所有信息 */
    private static m_pCityBuildInfo: { [k: number]: gameProto.ICityInfo };
    /**城池解锁列表 */
    private static m_pCityLockedList: number[] = []
    /**首都(世界地图) */
    private static m_pCapitalId: number = 0;

    /**初始需要移动的城池 */
    public static m_pInitMoveId: number = 0;

    /**地图部队移动 数据列表 */
    private static m_pMoveList: { [key: string]: gameProto.ITeamMoveDataResp };

    /**地图部队移动 数据列表 */
    private static m_pClientMoveList: { [key: string]: IClientMoveEt };
    /** 地图事件信息 */
    private static m_pEventList: { [key: string]: WorldEventVo } = {};

    /**城池和事件点对应关系 */
    public static m_pCityEventList: { [cityId: number]: number[] } = {}
   
    /**拜访事件列表 */
    private static m_pVisitEvent: { [k: number]: gameProto.IVisitEventData } = {};

    /**国战奖励领取记录 */
    private static m_pExploitAwardList: number[] = [];

    /**城市攻击事件列表 */
    private static m_aAttackEvent: { [k: number]: ItfAttackEvent } = {};
    /**资源攻击事件列表 */
    private static m_aAttackResEvent: { [k: number]: ItfAttackEvent } = {};
    private static m_aHeroAttactEvent: { [k: number]: number } = {};
    public static m_pResRefEventMap: { [key: number]: IResEventRefresh } = {}

    /**每日战功和等级对应关系*/
    private static m_militaryMeritsDayList: { [key: number]: number } = {}
    /**是否从搜索界面而来 */
    public static isFromSearchPanel: boolean = false;
    /**是否在搜索界面 */
    public static isInSearchPanel: boolean = false;
    /**拜访操作来计数*/
    public static visvitOperCount: number = 0;
    public static OUR_ARMY_MASS: number = 1;
    public static ENEMY_MASS: number = 2;
    public static isNoticeComplete: boolean = true;
    public static isVisvitFromSerarch: boolean = false;
    public static isUnlockFightFinish: boolean = false;
    public static isFromUnLockFight: boolean = false;
    public static unLockCid: number = 0;
    public static unLockTaskId: number = 0;
    /**国战奖励最大的阶段 */
    public static MAX_EXPLOIT_AWARD: number = 0;

    /**获得本国出生城 */
    private static birthCityList: number[] = []
    private static xiangBirthCityList: number[] = [];
    private static _birthCity: number = 0;

    /**已解锁列表备份 */
    // private static m_lockedCityList: number[] = [];
    private static bOnTick: boolean;   //开启活动计时
    private static bPreNotice: boolean = false;
    private static bWwarNotice: boolean = false;
    private static m_nTimeOut: number = 0;
    private static m_nStopOut: number = 0;

    public static get capitalId(): number {
        if (this.m_pCapitalId == 0) {
            for (let key in C.WorldMapConfig) {
                let v = C.WorldMapConfig[key];
                if (!v || v.first != 1 || v.mapId != SceneEnums.WORLD_CITY) continue;
                if (v.countryId == RoleData.countryId) {
                    this.m_pCapitalId = v.id;
                    break;
                }
            }
        }
        return SceneManager.isWorldScene() ? this.m_pCapitalId : C.WorldMapConfig[this.m_pCapitalId].mapCity;
    }

    public static init() {
        this.m_pCityBuildInfo = {};
        this.m_pMoveList = {};
        this.m_pClientMoveList = {};
        this.m_pEventList = {};
        this.m_pVisitEvent = {};
        this.m_pResRefEventMap = {};
        this.m_pCapitalId = 0;
        this.m_militaryMeritsDayList = {};

        this.MAX_EXPLOIT_AWARD = C.MilitaryMeritsConfig ? Utils.objectLenght(C.MilitaryMeritsConfig) - 1 : 0;
        this.parseBirthCity();
        this.parseMilitaryMeritsDayLimit();
    }

    public static clear() {
        this.m_pCityBuildInfo = null;
        this.m_pMoveList = null;
        this.m_pClientMoveList = null;
        this.m_pEventList = null;
        this.m_pResRefEventMap = null;
        this.m_militaryMeritsDayList = null;
        this.clearNoticeTimer();
    }

    /**=============================================================================================================
     * @brief 城池相关
     * =============================================================================================================
     */
    public static getCityConfig(iid: number): WorldMapConfig {
        return C.WorldMapConfig[iid];
    }
    /**解析获得出生城 */
    public static parseBirthCity() {
        this.birthCityList = [];
        this.xiangBirthCityList = [];
        for (let cityId in C.WorldMapConfig) {
            let city: WorldMapConfig = C.WorldMapConfig[cityId];
            if (city.type == CityType.BIRTH) {
                this.birthCityList.push(city.id);
            }
            if (city.type == CityType.XIANG_BIRTH) {
                this.xiangBirthCityList.push(city.id);
            }
        }
    }
    /**解析每日战功配置 */
    public static parseMilitaryMeritsDayLimit() {
        for (let key in C.MilitaryMeritsDayLimitConfig) {
            let militaryMeritsLimit: MilitaryMeritsDayLimitConfig = C.MilitaryMeritsDayLimitConfig[key];
            if (isNull(militaryMeritsLimit)) continue;
            if (isNull(this.m_militaryMeritsDayList[militaryMeritsLimit.dayLimit])) {
                this.m_militaryMeritsDayList[militaryMeritsLimit.dayLimit] = militaryMeritsLimit.id;
            }
        }
    }
    /**得到下一个上限 */
    public static getNextMilitaryMeritsDayLimitLev(militory: number): number {
        for (let key in this.m_militaryMeritsDayList) {
            if (Number(key) > militory) {
                return this.m_militaryMeritsDayList[key]
            }
        }
        return 200;
    }
    public static get birthCity(): number {
        for (let index = 0; index < this.birthCityList.length; index++) {
            let city: WorldMapConfig = C.WorldMapConfig[this.birthCityList[index]];
            if (city.countryId == RoleData.countryId)
                return city.id;
        }
        return 0;
    }
    public static get xBirthCity(): number {
        for (let index = 0; index < this.xiangBirthCityList.length; index++) {
            let city: WorldMapConfig = C.WorldMapConfig[this.xiangBirthCityList[index]];
            if (city.countryId == RoleData.countryId)
                return city.id;
        }
        return 0;
    }
    public static birtyCityTips(cityid: number) {
        if (cityid == this.birthCity)
            return;

    }
    public static XPathCovertWorld(through: number[]) {

    }
    /**获得城市名字 */
    public static getCityName(iid: number) {
        let cityConf = C.WorldMapConfig[iid];
        if (cityConf) return GLan(cityConf.name);
        return '';
    }

    /**获得城池类型名字 */
    public static getCityTypeName(level: number) {
        switch (level) {
            case CityLevel.CAPITAL:
                return GCode(CLEnum.WOR_BD_DC);
            case CityLevel.TOWN:
                return GCode(CLEnum.WOR_BD_JC);
            case CityLevel.COUNTY:
                return GCode(CLEnum.WOR_BD_XC);
        }
    }
    /**活动时间开始定时器 */
    public static openTick() {
        let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
        if (TimerUtils.getServerTimeMill() > vo.openDate) {
            this.clearNoticeTimer();
            return;
        }
        if (this.bOnTick) return;
        this.bOnTick = true;
        this.bPreNotice = false;
        this.bWwarNotice = false;
        this.m_nTimeOut = Math.floor((vo.preViewDate - TimerUtils.getServerTimeMill()) / 1000);
        this.m_nStopOut = Math.floor((vo.openDate - TimerUtils.getServerTimeMill()) / 1000);
        //每分钟检查一遍
        Utils.TimerManager.doTimer(2000, 0, this.updateXYReadyTime, this);
    }
    /**活动定时器 */
    private static updateXYReadyTime() {
        this.m_nStopOut -= 2;
        this.m_nTimeOut -= 2;
        if (!this.bPreNotice && this.m_nTimeOut <= 0) {
            this.playNotice(INoticeEnum.XIANG_YANG_NOTICE);
            this.bPreNotice = true;
        }

        if (!this.bWwarNotice && this.m_nStopOut <= 0) {
            this.playNotice(INoticeEnum.XIANG_YANG_WAR);
            this.bWwarNotice = true;
            this.clearNoticeTimer();
        }

    }
    public static playNotice(id: INoticeEnum) {
        let notice = C.NoticeConfig[id]
        if (notice) {
            let str = GLan(notice.msg)
            com_main.SystemNotice.show(str);
        }
    }
    public static clearNoticeTimer() {
        Utils.TimerManager.remove(this.updateXYReadyTime, this)
    }
    /**
     * 解析建筑数据
     * @param  {any} data
     * @returns void
     */
    public static initCityBuildInfo(data: gameProto.ICityInfo[]): void {
        for (let k in data) {
            let info = <gameProto.ICityInfo>data[k];
            this.m_pCityBuildInfo[info.id] = info;

            // let country = RoleData.countryId;
            // //被攻击
            // if (info.atkCountry > 0 && info.status == 1) {
            //     if (info.country == country) {
            //         // this.setAttackWarn(EumWarnType.ATTACKING_ENEMY, info.id, 0, info.atkCountry);
            //         let warn = <ItfWarnItem>{
            //             cityId: info.id,
            //             pid: EumWarnType.ATTACKING_ENEMY,
            //             content: [info.id, info.atkCountry],
            //             dt: 0,
            //             startdt: 0
            //         }
            //         this.addWarnNotice(warn)
            //     } else if (info.atkCountry == country) {
            //         // this.setAttackWarn(EumWarnType.ATTACKING, info.id, 0, info.country);
            //         let warn = <ItfWarnItem>{
            //             cityId: info.id,
            //             pid: EumWarnType.ATTACKING,
            //             content: [info.id],
            //             dt: 0,
            //             startdt: 0
            //         }
            //         this.addWarnNotice(warn)
            //     }
            // }
            // } else if (info.atkCountry == 0) {
            //     this.removeAttackWarn(info.id);
            // }
        }
    }
    /**解析解锁数据 */
    public static initCityLockData(mapUnLock: number[]) {
        if (isNull(mapUnLock)) return;
        this.m_pCityLockedList = mapUnLock;
    }

    /**
     * 当前国家占领的城池列表
     * @static
     * @return gameProto.ICityInfo[] 
     * @memberof WorldModel
     */
    public static getSelfCity(): gameProto.ICityInfo[] {
        let arr = [];
        for (let i in this.m_pCityBuildInfo) {
            let conf = this.m_pCityBuildInfo[i];
            if (conf.country == RoleData.countryId)
                arr.push(conf);
        }
        return arr;
    }

    /**是否是本势力城池 */
    public static isOwnerCity(cityId: number) {
        let info = this.getCityBuildInfo(cityId);
        if (info.country == RoleData.countryId) return true;
        return false;
    }
    /**
     * 解析警报信息
     * 
     */
    public static updateWarnInfomation(data: gameProto.S2C_WORLDMAP_INFORMATION) {
        this.m_mWarnList = {};
        /**攻城 */
        if (data.atkCity.length > 0) {
            for (let cityId of data.atkCity)
                this.setAttackWarn(EumWarnType.ATTACKING, cityId, 0, null);
        }
        /**守城 */
        if (data.defCity.length > 0) {
            for (let defInfo of data.defCity)
                this.setAttackWarn(EumWarnType.ATTACKING_ENEMY, defInfo.cityId, 0, defInfo.countryId);
        }
        /**攻城集结 */
        if (data.massMap.length > 0) {
            for (let massInfo of data.massMap)
                this.setAttackWarn(EumWarnType.ATTACK, massInfo.cityId, massInfo.timeArrival, null, massInfo.teamCount);
        }
        /**守方集结 */
        if (data.enemyMassMap.length) {
            for (let enemyMassInfo of data.enemyMassMap)
                this.setAttackWarn(EumWarnType.ATTACK_ENEMY, enemyMassInfo.cityId, enemyMassInfo.timeArrival, null, enemyMassInfo.teamCount);
        }
    }
    /**
     * 警报通知
     */
    public static updateWarnNotice(data: gameProto.S2C_WORLDMAP_INFORMATION_MASS_NOTICE) {
        let warnCfg: WarningConfig;
        if (data.enemyAndUs == WorldModel.OUR_ARMY_MASS) {
            // warnCfg = C.WarningConfig[EumWarnType.ATTACK]
            let warn = <ItfWarnItem>{
                cityId: data.targetCity,
                pid: EumWarnType.ATTACK,
                content: [0, data.targetCity],
                dt: 0,
                startdt: 0
            }
            this.addWarnNotice(warn)

        } else if (data.enemyAndUs == WorldModel.ENEMY_MASS) {
            // warnCfg = C.WarningConfig[EumWarnType.ATTACK_ENEMY]
            let warn = <ItfWarnItem>{
                cityId: data.targetCity,
                pid: EumWarnType.ATTACK_ENEMY,
                content: [0, data.targetCity],
                dt: 0,
                startdt: 0
            }
            this.addWarnNotice(warn)
        }
    }
    /**
     * 处理警报通知
     */
    public static addWarnNotice(warn: ItfWarnItem) {
        this.m_mWarnNoticeDic[warn.cityId] = warn;
        this.m_mWarnNoticeList.push(warn)
        // com_main.EventMgr.dispatchEvent(RedPointEvent.RED_POINT_NORMAL_UPDATE, RedEvtType.WARN);
    }

    public static __check_args(pid, content, ...args): string {
        if (this.checkNum(content) != args.length) {
            error("====__check_args args is err====================", pid, args);
            return "";
        }
        let c = "";
        if (pid == 1 || pid == 2) {
            let [batt, cid] = args;
            c = StringUtils.stringFormat(content, this.checkBatt(batt), this.checkCity(cid));
            c = c.replace("【0】", "")
        } else if (pid == 3) {
            let [cid] = args;
            c = StringUtils.stringFormat(content, this.checkCity(cid));
        } else if (pid == 4 || pid == 6) {
            let [cid, country] = args;
            c = StringUtils.stringFormat(content, this.checkCity(cid), this.checkCountry(country));
        }
        return c;
    }
    /**检测占位数 */
    public static checkNum(str: string): number {
        let count = 0,
            pos = str.indexOf("%s");
        while (pos !== -1) {
            count++;
            pos = str.indexOf("%s", pos + 1);
        }
        return count;
    }
    /**
     * 检查部队数
     * 
     */
    public static checkBatt(num: number): string {
        if (num < 10000) return "" + num;
        return `${Math.floor(num / 10000)}${GCode(CLEnum.NUM_WAN)}`;
    }
    /**
     * 检测城池
     */
    public static checkCity(cid: number): string {
        let conf = C.WorldMapConfig[cid];
        if (!conf)
            return;
        return GLan(conf.name);
    }
    /**
     * 检测国家
     */
    public static checkCountry(country: number): string {
        let text = ""
        switch (country) {
            case 1:
                text = GCode(CLEnum.STATE_WEI);
                break;
            case 2:
                text = GCode(CLEnum.STATE_SHU);
                break;
            case 3:
                text = GCode(CLEnum.STATE_WU);
                break;
        }
        return text;
    }
    /**
     * 更新单个城池信息
     * @param  {any} data
     * @returns number
     */
    public static updateCityBuildInfo(data: any): [number, boolean, number[]] {
        let info = <gameProto.ICityInfo>(data);
        let old: gameProto.ICityInfo = this.m_pCityBuildInfo[data.id];
        let ret = false, atk = [];
        const country = RoleData.countryId;

        if (old && old.atkCountry != country && info.atkCountry == country) {
            ret = true;
            atk.push(info.id);
        } else if (old && old.atkCountry == country && info.atkCountry != country) {
            ret = true;
            atk.push(info.id);
        }

        this.m_pCityBuildInfo[data.id] = info;

        // //被攻击
        // if (info.atkCountry > 0) {
        //     if (info.country == country) {
        //         this.setAttackWarn(EumWarnType.ATTACKING_ENEMY, info.id, 0, info.atkCountry);
        //     } else if (info.atkCountry == country) {
        //         this.setAttackWarn(EumWarnType.ATTACKING, info.id, 0, info.country);
        //     }
        // } else if (ret && info.atkCountry == 0) {
        //     if (old.country == country || old.atkCountry == country)
        //         this.removeAttackWarn(info.id);
        // }

        return [data.id, ret, atk];
    }
    /**检测是否有首战奖励 */
    public static checkIsHasFirstAward(cityId: number): boolean {
        let conf = WorldModel.getCityConfig(cityId);
        let cityInfo = WorldModel.getCityBuildInfo(cityId);
        if (!conf || !cityInfo) {
            return false;
        }
        if (!conf.firstreward || cityInfo.hasBeenOccupied || conf.firstreward == "[]")
            return false;
        return true;
    }
    /**根据首占奖励ran1得到武将id */
    public static getGenIdByWorldCfg(worldCityMapCfg: WorldMapConfig): number {
        if (isNull(worldCityMapCfg)) return 1001;
        let itemId: number = Number(worldCityMapCfg.firstrewardRank1.split("_")[0])
        let itemCfg: ItemConfig = C.ItemConfig[itemId];
        if (isNull(itemCfg)) return 1001;
        let generalId: number = Number(itemCfg.common);
        return generalId;
    }
    /**检测是否有解锁图标 */
    public static checkIsHasLock(cityId: number): boolean {
        let cityInfo = WorldModel.getCityBuildInfo(cityId);
        let conf: WorldMapConfig = C.WorldMapConfig[cityId];
        return this.m_pCityLockedList.indexOf(cityId) == -1 && RoleData.countryId == cityInfo.country && cityInfo.unlockTaskId != 0 && conf && conf.mapId == SceneEnums.WORLD_CITY;
    }
    public static getCountryRange(country?: number): number[] {
        country = country || RoleData.countryId;

        let arr = []
        let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
        for (let i in this.m_pCityBuildInfo) {
            let conf = this.m_pCityBuildInfo[i];
            let config: WorldMapConfig = C.WorldMapConfig[Number(i)]
            if (config.type == CityType.EMPEROR_BATTLE) {
                conf = this.m_pCityBuildInfo[config.mapCity];
            }
            // if (conf.country == country || conf.atkCountry == country) {
            if (conf.country == country || (conf.status == 1) || (config.type == CityType.EMPEROR_BATTLE && vo && vo.isOpenIcon() && vo.activited)) {
                const point = WorldTmxData.getRange(config.id);
                arr = arr.concat(point)
            }
        }
        return arr;
    }

    private static compare(x, y) {
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    }


	/**
	* 获取所有建筑信息
	*/
    public static getCityBuildInfos(): { [k: number]: gameProto.ICityInfo } {
        return this.m_pCityBuildInfo;
    }
    public static getXiangBirthMapCityId(cityId: number): number {
        let config: WorldMapConfig = C.WorldMapConfig[cityId];
        if (config && config.type == CityType.XIANG_BIRTH) return config.mapCity;
        return cityId;
    }
	/**
	* 获取单个建筑信息
	*/
    public static getCityBuildInfo(id: number): gameProto.ICityInfo {
        id = this.getXiangBirthMapCityId(id);
        let info = this.m_pCityBuildInfo[id];
        return info ? info : null;
    }

    /**获取国家占有城池数量 */
    public static getCountryCount(type: CountryType) {
        let count = 0;
        for (let key in this.m_pCityBuildInfo) {
            let data = this.m_pCityBuildInfo[key];
            if (unNull(data)) {
                let cfg = C.WorldMapConfig[data.id];
                if (cfg.mapId == SceneEnums.WORLD_CITY && data.country == type) {
                    count++;
                }
            }
        }
        return count;
    }

    public static checkHaveCd(info: gameProto.ICityInfo): boolean {
        // let _st = info.buildStartTime ? info.buildStartTime : 0;
        // let _et = info.buildEndTime ? info.buildEndTime : 0;
        // return info.buildStartTime != null && info.buildEndTime != null && _st > 0 && _et > 0 && TimerUtils.getServerTimeMill() < _et;
        return false;
    }

    /**获得未解锁城池id */
    public static getLockedCityId() {
        let list = this.getSelfCity();
        for (let i = 0; i < list.length; i++) {
            let info = list[i];
            //排除开战城池
            if (this.m_pCityLockedList.indexOf(info.id) == -1 && info.status != 1) return info.id;
        }
        return 0;
    }

    /**当前国家未占领的城池列表 */
    public static getNotSelfCity(): gameProto.ICityInfo[] {
        let arr = [];
        for (let i in this.m_pCityBuildInfo) {
            let conf = this.m_pCityBuildInfo[i];
            // 排除开战城池 2休战状态暂时无 不用判断
            let notWar = conf.status != 1;
            //排除襄阳城
            let notXY = conf.id != 32;
            if (notWar && notXY && conf.country != RoleData.countryId)
                arr.push(conf);
        }
        return arr;
    }

    /**获取可攻打最近的城池id */
    public static getNearestCanAttackCity() {
        let list = this.getNotSelfCity();
        let cList: gameProto.ICityInfo[] = [];
        for (let i = 0; i < list.length; i++) {
            if (!list[i]) continue;
            let info = list[i];
            // 出生城池 WorldModel.birthCity
            let [dt, speed, _] = com_main.DjikstraGraph.Instance.GetWayTime(WorldModel.birthCity, info.id);
            if (dt == 0 && speed == 0) continue;
            cList.push(info);
        }
        // SortTools.sortMap(cList, "npcLv", true);
        cList.sort((a, b) => {
            let conf_a = WorldModel.getCityConfig(a.id);
            let conf_b = WorldModel.getCityConfig(b.id);
            return conf_a.AtackCityLv - conf_b.AtackCityLv;
        });
        return cList.length == 0 ? 0 : cList[0].id;
    }
    /**=============================================================================================================
     * @brief 城池相关
     * =============================================================================================================
     */


    /**=============================================================================================================
     * @brief 地图移动队伍
     * =============================================================================================================
     */

    public static get moveList(): { [key: string]: gameProto.ITeamMoveDataResp } {
        return this.m_pMoveList;
    }

    public static getTeamMoveKey(data: gameProto.ITeamMoveDataResp) {
        return `${data.playerId}_${data.teamId}`;
    }

    /**获得玩家自己队伍的移动对象数据 */
    public static getOwnerTeamMoveKey(order: number) {
        let teamData = TeamModel.getTeamVoByType(TeamType.WORLD, order);
        return `${RoleData.playerId}_${teamData.id}`
    }

    /**解析队伍列表 */
    public static parseTeamMove(moveDatas: gameProto.ITeamMoveDataResp[], isReplace: boolean = false) {
        if (isReplace) {
            this.m_pMoveList = {};
        }

        //更新列表
        for (let i = 0; i < moveDatas.length; i++) {
            let data = moveDatas[i];
            if (this.runTargetScene == SceneEnums.WORLD_XIANGYANG_CITY && this.checkWorldPath(data.cityPath)) continue;
            if (this.runTargetScene == SceneEnums.WORLD_CITY && this.checkXyPath(data.cityPath)) continue;
            data.cityPath = this.worldToXYPath(data.cityPath);
            if (isNull(data.cityPath)) continue;
            let teamkey = this.getTeamMoveKey(data);
            this.m_pMoveList[teamkey] = data;
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_MOVE_LIST_UPDATE, teamkey);
        }
    }
    /**队伍路径转换把世界地图点转成襄阳战点 */
    public static worldToXYPath(path: number[]): number[] {
        if (!this.checkXyPath(path)) return path;
        for (let index = 0; index < path.length; index++) {
            let conf: WorldMapConfig = C.WorldMapConfig[path[index]]
            if (conf.mapId == SceneEnums.WORLD_CITY) {
                path[index] = conf.mapCity;
            }
        }
        return path;
    }
    public static checkXyPath(path: number[]): boolean {
        if (isNull(path)) return false;
        if (path.length < 1) return false;
        for (let index = 0; index < path.length; index++) {
            if (C.WorldMapConfig[path[index]].mapId == SceneEnums.WORLD_XIANGYANG_CITY) return true;
        }
        return false;
    }

    public static checkWorldPath(path: number[]): boolean {
        if (isNull(path)) return false;
        if (path.length < 1) return false;
        for (let index = 0; index < path.length; index++) {
            if (C.WorldMapConfig[path[index]].mapId == SceneEnums.WORLD_XIANGYANG_CITY) return false;
        }
        return true;
    }
    public static checkEnterXyScene(): boolean {
        // let limitLev: number = ConstUtil.getValue(IConstEnum.XIANGYANG_LEVEL_LIMIT);
        // if (RoleData.level < limitLev) {
        //     EffectUtils.showTips(GCodeFromat(CLEnum.HAN_FIGHT_LIMIT, limitLev), 1, true)
        //     return false;
        // }
        return true;
    }
    /**获得移动对象数据 */
    public static getTeamMoveData(key: string) {
        return this.m_pMoveList[key];
    }

    /**获得玩家自己队伍的移动对象数据 */
    public static getOwnerTeamMoveData(order: number) {
        let teamData = TeamModel.getTeamVoByType(TeamType.WORLD, order);
        let key = `${RoleData.playerId}_${teamData.id}`
        return this.m_pMoveList[key];
    }

    /**请求服务更新队伍 */
    public static sendUpdateTeamData() {
        let list: gameProto.ITeamValueKey[] = [];
        for (let key in this.m_pMoveList) {
            let data = this.m_pMoveList[key];
            if (data) {
                list.push({ playerId: data.playerId, teamId: data.teamId, countryId: data.countryId });
            }
        }
        WorldProxy.C2S_TEAMMOVE_LIST(list);
        console.log("C2S_TEAMMOVE_LIST=====")
    }
    /**解析驻军 */
    public static parseTroop(datas: gameProto.IPlayerWarData[]) {
        let len: number = datas.length;
        let res: com_main.ITroopData[] = [];
        if (len == 0) {
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TROOP, res);
            return;
        }
        let tropData: com_main.ITroopData;
        let data: gameProto.IPlayerWarData;

        let generalTroopDic: { [key: number]: com_main.ITroopData } = {};
        for (let index = 0; index < len; index++) {
            data = datas[index];
            if (data.generalId == 0 || data.teamForce == 0) continue;
            if (data.isNpc) continue;
            tropData = generalTroopDic[data.playerId]
            if (isNull(tropData)) {
                tropData = { name: data.userName, count: 1, troop: data.teamForce };
            } else {
                tropData.count = tropData.count + 1;
                tropData.troop = tropData.troop + data.teamForce;
            }
            generalTroopDic[data.playerId] = tropData;
            // res.push(tropData);
        }
        for (let key in generalTroopDic) {
            if (generalTroopDic[key].count == 0) continue;
            res.push(generalTroopDic[key]);
        }
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TROOP, res);
    }
    /**获得客户端本地移动事件 */
    public static get clientMoveList() {
        return this.m_pClientMoveList;
    }

    /**获得客户端本地移动事件 */
    public static getClientMoveByTeamId(teamId: number) {
        return this.m_pClientMoveList[teamId];
    }

    /**资源点 存在队伍前往 */
    public static isInTeamMoveRes(evtPosId: number) {
        for (let teamId in this.m_pClientMoveList) {
            let data = this.m_pClientMoveList[teamId];
            if (data.evtPosId == evtPosId) {
                return true;
            }
        }
        return false;
    }

    /**创建本地移动对象 back为true的时候是反向移动*/
    public static createClientMove(teamId: number, evtPosId: number, isBack: boolean = false) {
        let evtVo = this.getEventVoByPosId(evtPosId);
        if (evtVo) {
            let data: IClientMoveEt = {
                teamId: teamId,
                evtPosId: evtVo.eventCoordinatesId,
                evtDataId: evtVo.eventDataId,
                startTime: TimerUtils.getServerTime(),
                endTime: TimerUtils.getServerTime() + 5,
                isBack: isBack
            }
            this.m_pClientMoveList[teamId] = data;
            com_main.WorldView.callFunc(com_main.WORLD_FUNC.CREATE_CLIENT_MOVE, data);
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.CLIENT_MOVE_UPDATE, null);

            /**添加timeOut函数 */
            let time = (data.endTime - data.startTime) * 1000;
            egret.setTimeout((teamId: number) => {
                if (!this.m_pClientMoveList || !this.m_pClientMoveList[teamId])
                    return;
                if (!isBack) {
                    WorldProxy.C2S_WORLDMAP_EVENT_ACT(this.m_pClientMoveList[teamId].evtPosId, this.m_pClientMoveList[teamId].evtDataId, teamId, evtVo.cityId);
                    com_main.EventMgr.dispatchEvent(TaskWorldEvent.CLIENT_MOVE_UPDATE, null);
                }
                delete this.m_pClientMoveList[teamId];

            }, this, time, teamId);

        }
    }

    /**=============================================================================================================
     * @brief 地图移动队伍 end
     * =============================================================================================================
     */

    /**=============================================================================================================
    * @brief 地图事件
    * =============================================================================================================
    */

    /**获得事件列表 */
    public static get eventList(): { [k: number]: WorldEventVo } {
        return this.m_pEventList;
    }
    /**根据城池获得事件 */
    public static getEventVoByPosId(eventPosId: number): WorldEventVo {
        return this.m_pEventList[eventPosId];
    }

    /**根据类型获得事件列表 */
    public static getEventVosByType(evtType: WorldEventType, subType?: number) {
        let res: WorldEventVo[] = [];
        for (let key in this.m_pEventList) {
            let vo = this.m_pEventList[key];
            if (this.checkIsHasLock(vo.cityId))
                continue;
            if (vo && vo.type == evtType) {
                if (!subType || vo.subType == subType) res.push(vo);
            }
        }
        return res;
    }

    public static parseEventList(list: gameProto.IMapEventData[], isReplace: boolean = true, isRefresh: boolean = false) {
        if (isReplace) {
            this.m_pEventList = {};
            this.m_pCityEventList = {};
        }
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            if (!this.m_pEventList[data.eventCoordinatesId]) {
                let worldEvtVo: WorldEventVo = WorldEventVo.create(data);
                this.m_pEventList[data.eventCoordinatesId] = worldEvtVo;
                if (isNull(this.m_pCityEventList[worldEvtVo.cityId]))
                    this.m_pCityEventList[worldEvtVo.cityId] = [];
                this.m_pCityEventList[worldEvtVo.cityId].push(data.eventCoordinatesId);

            } else {
                this.m_pEventList[data.eventCoordinatesId].update(data);
            }


        }
    }

    /**根据队伍id 获取队伍事件 */
    public static getTeamEvtTypeById(teamId: number): WorldEventType {
        /**事件移动中 */
        if (this.m_pClientMoveList[teamId]) {
            return WorldEventType.MOVE;
        }
        /**事件清理中 */
        for (let key in this.m_pEventList) {
            let vo = this.m_pEventList[key];
            if (vo) {
                if ((vo.getTeamId() == teamId)) {
                    return vo.type;
                }
            }
        }
        return WorldEventType.NONE;
    }
    /**根据队伍获取事件 */
    public static getTeamEvtById(teamId: number): WorldEventVo {
        for (let key in this.m_pEventList) {
            let vo = this.m_pEventList[key];
            if (vo) {
                if ((vo.getTeamId() == teamId)) {
                    return vo;
                }
            }
        }
        return null;
    }
    /**获得部队状态描述 */
    public static getEventDes(type: WorldEventType) {
        switch (type) {
            case WorldEventType.NONE:
                return GCode(CLEnum.WOR_TEAM_KX);
            case WorldEventType.RES_COLLECT:
                return GCode(CLEnum.WOR_TEAM_CJ);
            case WorldEventType.RES_GATHER:
                return GCode(CLEnum.WOR_TEAM_SJ);
            case WorldEventType.FIGHT:
                return GCode(CLEnum.WOR_TEAM_JF);
            case WorldEventType.MOVE:
                return GCode(CLEnum.WOR_TEAM_YD);
        }
        return '';
    }

    /**事件更新 */
    public static updateWorldEvent(data: gameProto.IMapEventData) {
        let evtVo = this.getEventVoByPosId(data.eventCoordinatesId);
        if (evtVo) evtVo.update(data);
    }

    /**事件结束 */
    public static endWorldEvent(data: gameProto.S2C_WORLDMAP_EVENT_OVER) {
        let evtVo = this.m_pEventList[data.eventCoordinatesId];
        if (!evtVo) return;
        delete this.m_pEventList[data.eventCoordinatesId];
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, data.eventCoordinatesId);
    }
    /**获得事件 */
    public static getWorldEvent(eventCoordinatesId: number): WorldEventVo {
        let evtVo = this.m_pEventList[eventCoordinatesId];
        if (!evtVo) return null;
        return evtVo;
    }
    /**清除时间 */
    public static clearWorldEvent(eventCoordinatesId: number) {
        delete this.m_pEventList[eventCoordinatesId];
    }
    /**更新解锁状态 */
    public static updateCityLockState(cityId: number) {
        if (isNull(this.m_pCityLockedList))
            this.m_pCityLockedList = []
        if (this.m_pCityLockedList.indexOf(cityId) == -1)
            this.m_pCityLockedList.push(cityId)
    }
    /**得到城池的解锁状态 true已经解锁*/
    public static checkCityLocked(cityId: number): boolean {
        return this.m_pCityLockedList.indexOf(cityId) != -1;
    }
    /**解锁奖励弹框显示 */
    public static receiveUnLockReward(data: gameProto.S2C_UNLOCK_CITY) {
        if (data.errorCode == 0) {
            let cfg = C.WorldMapConfig[data.cityId]
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.unlockReward);
            }

        }
    }
    /**
     * 重置事件
     */
    public static resetWorldEvent(data: gameProto.IMapEventData) {
        this.m_pEventList[data.eventCoordinatesId] = WorldEventVo.create(data);
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, data.eventCoordinatesId);
    }
    /**
     * 存储完成的事件点
     */
    public static addFinishWorldEvent(eventCoordinatesId: number) {
        //  totalTime: number;//累计时间
        // confTime: number;//配置的刷新时
        let conf = C.EventCoordinatesConfig[eventCoordinatesId];
        if (isNull(conf)) return;
        this.m_pResRefEventMap[eventCoordinatesId] = { totalTime: 0, confTime: conf.frequency }
    }
    /**=============================================================================================================
     * @brief 地图事件 end
     * =============================================================================================================
     */


    /**=============================================================================================================
    * @brief 拜访事件 begin
    * =============================================================================================================
    */

    /**获得拜访列表 */
    public static get visitEventList(): { [k: number]: gameProto.IVisitEventData } {
        return this.m_pVisitEvent;
    }
    /**获得可拜访列表 */
    public static getCanVisitEventList(): gameProto.IVisitEventData[] {
        let res: gameProto.IVisitEventData[] = []
        for (let key in this.m_pVisitEvent) {
            let data = this.m_pVisitEvent[key];
            if (this.checkIsHasLock(data.cityId))
                continue;
            if (data && this.isOwnerCity(data.cityId)) {
                res.push(data);
            }
        }
        return res;
    }

    /**武将拜访中 */
    public static isInVisitbyGenId(generalId: number) {
        for (let key in this.m_pVisitEvent) {
            let data = this.m_pVisitEvent[key];
            if (data && data.generalId == generalId) {
                return true
            }
        }
        return false;
    }

    /**获得拜访数据 */
    public static getVisitEventById(cityId: number): gameProto.IVisitEventData {
        return this.m_pVisitEvent[cityId];
    }

    /**解析拜访列表 */
    public static parseVisitEventList(list: gameProto.IVisitEventData[], isReplace: boolean = true) {
        if (isReplace) {
            this.m_pVisitEvent = {};
        }
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            this.m_pVisitEvent[data.cityId] = data;
        }
    }


    /**解析拜访列表 */
    public static updateVisitEvent(data: gameProto.IVisitEventData) {
        if (this.m_pVisitEvent[data.cityId]) {
            this.m_pVisitEvent[data.cityId] = data;
        }
    }

    /**移除拜访事件 */
    public static removeVisitEvent(cityId: number) {
        delete this.m_pVisitEvent[cityId];
    }

    /**=============================================================================================================
    * @brief 拜访事件 end
    * =============================================================================================================
    */


    public static createEvent(data: any) {

    }




    /**
     * 发送事件包
     * @static
     * @param  {ItfEventObject} obj 
     * @return {} 
     * @memberof WorldModel
     */
    public static getEventPack(obj: ItfEventObject): {} {
        return {
            gid: obj.gid,
            status: obj.status,
            path: {
                from: obj.from,
                to: obj.to,
                throughIds: obj.through,
                type: obj.type,
            },
            mainGid: obj.mainGid,
            unitSid: obj.armyId,
        }
    }


    /**
     * 初始化攻击事件
     * @static
     * @param  {*} body 
     * @return void
     * @memberof WorldModel
     */
    public static initAttackEvent(body: any): number[][] {
        if (!body || !body.pre) return null;
        let l1 = [], l2 = [], l3 = [], l4 = [];
        return [l1, l2, l3, l4];
    }

    public static checkHeroAttackEvent(iid: number) {
        let eid = this.m_aHeroAttactEvent[iid];
        if (eid) {
            if (this.m_aAttackResEvent[eid]) return 1;
            if (this.m_aAttackEvent[eid]) return 2;
        }
        return 0;
    }

    /**
     * 清除攻击事件
     * @static
     * @param  {*} body 
     * @return void
     * @memberof WorldModel
     */
    public static endAttackEvent(body: any) {
        let obj = this.m_aAttackEvent[body.id];
        if (obj) {
            for (let gid of obj.gid) {
                delete this.m_aHeroAttactEvent[gid];
            }
            delete this.m_aAttackEvent[body.id];
            return obj;
        }
        obj = this.m_aAttackResEvent[body.id];
        if (obj) {
            for (let gid of obj.gid) {
                delete this.m_aHeroAttactEvent[gid];
            }
            delete this.m_aAttackResEvent[body.id];
            return obj;
        }
    }

    public static getCAttackToCids(): number[] {
        let l = []
        for (let i in this.m_pCityBuildInfo) {
            const city = this.m_pCityBuildInfo[i];
            if (city.atkCountry > 0) {
                l.push(city.id)
            }
        }
        return l;
    }

    /**
     * 资源存在的攻击事件
     * @static
     * @param  {number} iid 资源id
     * @param  {number} [type=1] 资源类型
     * @return ItfAttackEvent[] 
     * @memberof WorldModel
     */
    public static checkAttackEvent(iid: number, type: number = 1): ItfAttackEvent[] {
        let events = type == 1 ? this.m_aAttackEvent : this.m_aAttackResEvent;
        let l = []
        for (let id in events) {
            let event = events[id];
            if (event.pos != iid) continue;
            l.push(event);
        }
        return l;
    }

    /**
     * 所有的攻击事件
     * @static
     * @return ItfAttackEvent[] 
     * @memberof WorldModel
     */
    public static getAllAttackEvent(): ItfAttackEvent[] {
        let events = [];

        for (let i in this.m_aAttackEvent) {
            events.push(this.m_aAttackEvent[i]);
        }
        for (let i in this.m_aAttackResEvent) {
            events.push(this.m_aAttackResEvent[i]);
        }


        return events.sort(WorldModel.compareAttackEvent);
    }

    /**
     * 获取城池和资源的攻击事件
     * @static
     * @param  {number[]} city 城池攻击id列表
     * @param  {number[]} [res] 资源攻击id列表
     * @return ItfAttackEvent[] 
     * @memberof WorldModel
     */
    public static getAttackEvent(city: number[], res?: number[]): ItfAttackEvent[] {
        let events = []
        if (city) {
            for (let id of city) {
                events.push(this.m_aAttackEvent[id]);
            }
        }
        if (res) {
            for (let id of res) {
                events.push(this.m_aAttackResEvent[id]);
            }
        }
        return events;
    }

    public static compareAttackEvent(value1: ItfAttackEvent, value2: ItfAttackEvent): number {
        if (value1.dt < value2.dt) {
            return 1;
        } else if (value1.dt > value2.dt) {
            return -1;
        } else {
            return 0;
        }
    }

    /**
     * 获得战场id
     * @static
     * @param  {*} body 
     * @return boolean 
     * @memberof WorldModel
     */
    public static updateBattleId(body: any): boolean {
        let event = this.m_aAttackEvent[body.id];
        if (!event) event = this.m_aAttackResEvent[body.id];
        if (!event) return false;;
        event.battleId = body.bid;
        return TimerUtils.getServerTime() < event.dt;
    }

    //========================================================
    //============================攻城战=======================
    //========================================================

    /**左边英雄列表 */
    public static m_cityWarMyteam = [];
    /**城市战场信息 */
    public static m_cityWarGo: gameProto.IS2C_CITY_WAR_GO;

    /**观看战斗信息 */
    public static m_watchPlayerId;
    public static m_watchTeamId;
    public static m_isHaveMyTeam: boolean;

    /**
     * 获取我攻击的所有队伍
     * @static
     * @param  
     * @return 
     * @memberof WorldModel
     */
    public static initCityWarMyteam(data: gameProto.IS2C_CITY_WAR_MYTEAM) {
        this.m_cityWarMyteam = data.myTeamWar;
        com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_SIEGE_SELF, null);
    }

    public static getCityWarMyteam() {
        return this.m_cityWarMyteam;
    }

    public static getIsHaveTeam(){
        return this.m_isHaveMyTeam;
    }

    public static setCurWatchTeamId(playerId, teamId) {
        if(playerId == RoleData.playerId){
            this.m_isHaveMyTeam = true;
        }
        this.m_watchTeamId = teamId;
        this.m_watchPlayerId = playerId;
    }

    public static battleOver() {
        if (WorldModel.getCityWarInfo()) {
            WorldProxy.send_C2S_CITY_WATCH_WAR_TEAM(WorldModel.getCityWarInfo().cityId, this.m_watchPlayerId, this.m_watchTeamId);
        }
    }

    /**
     * 清理国战信息
     * @static
     * @return null
     * @memberof WorldModel
     */
    public static clearCityWar() {
        this.m_cityWarMyteam = [];
        this.m_cityWarGo = null;
        this.m_watchPlayerId = null;
        this.m_watchTeamId = null;
        this.m_isHaveMyTeam = null;
    }

    /**
     * 当前城池自己的战斗信息
     * @static
     * @param  {number} cid 
     * @return [number[], number] [当前所有部队,排队位置]
     * @memberof WorldModel
     */
    public static getSiegeSelf() {

        let siegeList = [];

        for (let info of this.m_cityWarMyteam) {
            let teamid = info.teamId;
            let battleId = info.battleId;

            let team = TeamModel.getTeamVoByTypeId(TeamType.WORLD, teamid) || TeamModel.getTeamVoByTypeId(TeamType.CROSS_SERVER,teamid);
            if(team){
                let list = team.teamGeneralData;

                let aconf = <ItfSiegeBase>{
                    cityId: 0,
                    roleId: 0,
                    mainGid: list[0].generalId,
                    battleId: battleId,
                    teamId: teamid,
                }

                siegeList.push(aconf)
            }
        }
        return siegeList;
    }

    // public static setCurrentWarCity(cid:number){
    //     this.m_curCid = cid;
    // }

    // public static getCurrentWarCity(){
    //     return this.m_curCid;
    // }

    public static setCityWarInfo(data: gameProto.IS2C_CITY_WAR_GO) {
        this.m_cityWarGo = data;
        if (this.m_cityWarGo) this.m_cityWarGo.countDownTime = TimerUtils.getServerTime() + this.m_cityWarGo.countDownTime / 1000;
    }

    public static getCityWarInfo(): gameProto.IS2C_CITY_WAR_GO {
        return this.m_cityWarGo;
    }

    //更新城战队伍数量
    public static setCityItemCount(data: gameProto.IS2C_CITY_ITEM_COUNT) {
        if (this.m_cityWarGo && this.m_cityWarGo.cityId == data.cityId) {
            this.m_cityWarGo.defTeamCount = data.defTeamCount;
            this.m_cityWarGo.atkTeamCount = data.atkTeamCount;
        } else {
            WorldProxy.send_C2S_CITY_WAR_OUT(data.cityId);
        }
    }

    public static checkSiegeTime() {
        return this.m_cityWarGo ? this.m_cityWarGo.countDownTime - TimerUtils.getServerTime() : 0;
    }

    public static isInCityWar() {
        return this.m_cityWarGo ? true : false;
    }

    //退出攻城战
    public static cleanCityWarInfo() {
        this.m_cityWarGo = null;
        WorldModel.setCurWatchTeamId(0, -1);
    }

    //获取城池倒计时
    public static checkSiegeTimeByCityid(cid: number) {
        let pInfo = WorldModel.getCityBuildInfo(cid);
        if (pInfo.warStartTime) {
            return pInfo.warStartTime - TimerUtils.getServerTime();
        } else {
            return 0;
        }
    }

    /**
     * 攻城战结果
     * @static
     * @param  {*} data 
     * @return ItfSiegeResult
     * @memberof WorldModel
     */
    public static updateSiegeResult(data: gameProto.IS2C_CITY_WAR_SETTLEMENT): ItfSiegeResult {
        let ret = <ItfSiegeResult>{
            isCross:false,
            cityId: data.cityId,
            atkCountry: data.attData.countryId,
            defCountry: data.defData.countryId,
            result: Number(!data.isVictory),
            atkRemainQueue: data.attData.surplusSoldiersCount,
            atkDead: data.attData.lossSoldiersCount,
            defRemainQueue: data.defData.surplusSoldiersCount,
            defDead: data.defData.lossSoldiersCount,
            roleKillNum: data.myCityWarData.killSoldiersCount,
            roleLostNum: data.myCityWarData.lossSoldiersCount,
            roleFight: data.myCityWarData.warMerits,
        }
        return ret;
    }

    /**跨服战结算 */
    public static updateCrossSiegeResult(data: gameProto.IS2C_CROSS_SERVER_BATTLE_SETTLEMENT): ItfSiegeResult {
        let ret = <ItfSiegeResult>{
            isCross:true,
            isAttack:data.isAttack,
            cityId: data.cityId,
            atkCountry: data.attData.countryId,
            defCountry: data.defData.countryId,
            result: Number(!data.isVictory),
            atkRemainQueue: data.attData.surplusSoldiersCount,
            atkDead: data.attData.lossSoldiersCount,
            defRemainQueue: data.defData.surplusSoldiersCount,
            defDead: data.defData.lossSoldiersCount,
            roleKillNum: data.myCityWarData.killSoldiersCount,
            roleLostNum: data.myCityWarData.lossSoldiersCount,
            roleFight: data.myCityWarData.warMerits,
        }
        return ret;
    }

    private static siegeList: gameProto.S2C_CITY_WAR_CONFRONTATION_LIST;
    /**
     * 国战对战列表
     * @static
     * @param   
     * @return 
     * @memberof WorldModel
     */
    public static setSiegeList(body: gameProto.S2C_CITY_WAR_CONFRONTATION_LIST) {
        WorldModel.siegeList = body;
    }

    /**
     * 国战对战列表
     * @static
     * @param   
     * @return 
     * @memberof WorldModel
     */
    public static getSiegeList(): gameProto.S2C_CITY_WAR_CONFRONTATION_LIST {
        return WorldModel.siegeList;
    }

    //========================================================
    //============================警报=======================
    //========================================================

    private static m_mWarnList: { [k: number]: ItfWarnItem } = {};

    private static m_mWarnNoticeDic: { [k: number]: ItfWarnItem } = {};

    private static m_mWarnNoticeList: ItfWarnItem[] = []

    // /**
    //  * 初始化警报列表
    //  * @static
    //  * @param  {*} data 
    //  * @return 
    //  * @memberof WorldModel
    //  */
    // public static initWarn(data: any) {
    //     if (!data || !data.list) return;
    //     for (let o of data.list) {
    //         this.m_mWarnList[o.cityId] = <ItfWarnItem> {
    //             cityId: o.cityId,
    //             pid: o.id,
    //             content: o.num,
    //             dt: o.time,
    //             startdt: o.generateTime,
    //         }
    //     }
    // }

    // /**
    //  * 更新警报
    //  * @static
    //  * @param  {*} data 
    //  * @return void
    //  * @memberof WorldModel
    //  */
    // public static updateWarn(data: any) {
    //     const o = data.warn;
    //     let item = this.m_mWarnList[o.cityId];
    //     if (!item) {
    //         this.m_mWarnList[o.cityId] = <ItfWarnItem> {
    //             cityId: o.cityId,
    //             pid: o.id,
    //             content: o.num,
    //             dt: o.time,
    //             startdt: o.generateTime,
    //         }
    //     } else {
    //         item.pid = o.id;
    //         item.content = o.num;
    //         item.dt = o.time;
    //         item.startdt = o.generateTime;
    //     }
    // }

    // /**
    //  * 警报结束
    //  * @static
    //  * @param  {*} data 
    //  * @return void
    //  * @memberof WorldModel
    //  */
    // public static endWarn(data: any) {
    //     const cid = data.cityId;
    //     delete this.m_mWarnList[cid];
    // }

    public static getWarn(cid: number): ItfWarnItem {
        return this.m_mWarnList[cid]
    }

    public static getWarns(): { [k: number]: ItfWarnItem } {
        return this.m_mWarnList;
    }
    public static getWarnNotices(): ItfWarnItem[] {
        return this.m_mWarnNoticeList;
    }
    /**
     * 添加警报
     * @static
     * @param  {EumWarnType} type 警报类型
     * @param  {number} cid 城池ID
     * @param  {number} dt 结束时间
     * @param  {number} country 国家ID
     * @param  {number} [batt] 总兵力
     * @return void
     * @memberof WorldModel
     */
    public static setAttackWarn(type: EumWarnType, cid: number, dt: number, country: number, batt?: number) {
        let warn = this.m_mWarnList[cid];
        switch (type) {
            case EumWarnType.ATTACK: {
                this.__set_attack_warn(type, warn, cid, dt, batt);
                break;
            }
            case EumWarnType.ATTACK_ENEMY: {
                this.__set_attack_warn(type, warn, cid, dt, batt);
                break;
            }
            case EumWarnType.ATTACK_OTHER: {
                break;
            }
            case EumWarnType.ATTACKING: {
                this.__set_attacking_warn(type, warn, cid, country)
                break;
            }
            case EumWarnType.ATTACKING_ENEMY: {
                this.__set_attacking_warn(type, warn, cid, country)
                break;
            }
        }

    }

    /**
     * 攻击警报
     * @private
     * @static
     * @param  {EumWarnType} type 
     * @param  {ItfWarnItem} warn 
     * @param  {number} cid 
     * @param  {number} dt 
     * @param  {number} batt 
     * @return 
     * @memberof WorldModel
     */
    private static __set_attack_warn(type: EumWarnType, warn: ItfWarnItem, cid: number, dt: number, batt: number) {
        if (!warn) {
            warn = <ItfWarnItem>{
                cityId: cid,
                pid: type,
                content: [batt, cid],
                dt: dt,
                startdt: TimerUtils.getServerTime()
            }
            this.m_mWarnList[warn.cityId] = warn;
        } else {
            // if (warn.pid == EumWarnType.ATTACKING && type == EumWarnType.ATTACK) {
            //     return;
            // }
            // if (warn.pid == EumWarnType.ATTACKING_ENEMY && type == EumWarnType.ATTACK_ENEMY)
            //     return;
            dt = Math.min(warn.dt, dt);
            warn.content[0] = batt;
            warn.dt = dt;
        }
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, { cid });

    }

    /**
     * 攻击中警报
     * @private
     * @static
     * @param  {EumWarnType} type 
     * @param  {ItfWarnItem} warn 
     * @param  {number} cid 
     * @param  {number} country 
     * @return 
     * @memberof WorldModel
     */
    private static __set_attacking_warn(type: EumWarnType, warn: ItfWarnItem, cid: number, country: number) {
        const b = type == EumWarnType.ATTACKING_ENEMY;
        if (warn) {
            if (warn.pid == type) {
                let c = warn.content.length == 2 ? warn.content[1] : warn.content[0]
                if (c == country) return;
            }
        }
        if (!warn) {
            warn = <ItfWarnItem>{
                cityId: cid,
            }
            this.m_mWarnList[warn.cityId] = warn;
        }
        warn.pid = type;
        warn.content = b ? [cid, country] : [cid];
        warn.startdt = TimerUtils.getServerTime();
        warn.dt = 0;
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, { cid });
    }

    /**
     * 移除警报
     * @static
     * @param  {number} cid 城池ID
     * @return 
     * @memberof WorldModel
     */
    public static removeAttackWarn(cid: number) {
        let warn = this.m_mWarnList[cid]
        if (!warn) return;
        delete this.m_mWarnList[cid];

        this.__check_attack_warn(cid);
        warn = this.m_mWarnList[cid]
        let del = warn == undefined;
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, { cid, del });
    }

    public static removeAttackWarnByDt(cid: number, dt: number) {
        let warn = this.m_mWarnList[cid];
        if (!warn) return;
        if (warn.pid != EumWarnType.ATTACK_ENEMY && warn.pid != EumWarnType.ATTACK) return;
        if (warn.dt != dt) return;
        delete this.m_mWarnList[cid];

        this.__check_attack_warn(cid);
        warn = this.m_mWarnList[cid]
        let del = warn == undefined;
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, { cid, del });
    }

    private static __check_attack_warn(cid: number) {
        const country = RoleData.countryId;
        // for (let i in this.m_aEventList) {
        //     const obj = this.m_aEventList[i];
        //警报事件
        // if (obj.mt == EumWorldEventMoveType.GO && obj.type == EumWorldEventPosType.CITY) {
        //     const city = this.getCityBuildInfo(obj.to)
        //         , cid = city.country;
        //     if (cid != country && obj.trpsType == 2) {
        //         this.setAttackWarn(EumWarnType.ATTACK_ENEMY, city.id, obj.dt, 0, obj.batt)
        //     } else if (cid != country && obj.trpsType != 2) {
        //         this.setAttackWarn(EumWarnType.ATTACK, city.id, obj.dt, 0, obj.batt)
        //     }
        // }
        // }
    }
    /**检测是否有警报 */
    public static checkHasAttackWarn(): boolean {
        for (let warnKey in this.m_mWarnList)
            return true;
        return false;
    }
    //========================================================
    //======================国战信息排行========================
    //========================================================

    private static m_mSiegeKill: { [k: number]: ItfSiegeKill } = {};
    private static m_mSiegeAllyKill: { [k: number]: ItfSiegeKill } = {};

    public static initSiegeKill(data: gameProto.S2C_CITY_WAR_DMG_RANK) {
        if (!data) return;
        this.m_mSiegeKill = {};
        this.m_mSiegeAllyKill = {};
        for (let o of data.playerRank) {
            let obj = new ItfSiegeKill();
            obj.id = o.playerId;
            obj.playerName = o.playerName;
            obj.rank = o.rank;
            obj.num = o.damage;
            obj.countryId = o.countryId;
            this.m_mSiegeKill[obj.id] = obj;
            obj.type = EumSiegeKillType.PLAYER;
        }

        for (let o of data.guildRank) {
            let obj = new ItfSiegeKill();
            obj.id = o.guildId;
            obj.playerName = o.guildName;
            obj.rank = o.rank;
            obj.num = o.damage;
            obj.countryId = o.countryId;
            this.m_mSiegeAllyKill[obj.id] = obj;
            obj.type = EumSiegeKillType.ALLY;
        }
    }

    public static sortSiegeKill(type: EumSiegeKillType) {
        if (type == EumSiegeKillType.PLAYER)
            return this.getSiegeKillSort();
        return this.getSiegeKillAllySort();
    }

    public static getSiegeKillSort(): number[] {
        let arr = [];
        for (let id in this.m_mSiegeKill) {
            let obj = this.m_mSiegeKill[id]
            arr.push(obj.id)
        }
        arr = arr.sort((a, b) => {
            let obj1 = this.m_mSiegeKill[a], obj2 = this.m_mSiegeKill[b]
            if (obj1.num > obj2.num) return -1;
            else if (obj1.num < obj2.num) return 1;
            return 0;
        })
        return arr;
    }

    public static getSiegeKillAllySort(): number[] {
        let arr = [];
        for (let id in this.m_mSiegeAllyKill) {
            let obj = this.m_mSiegeAllyKill[id]
            arr.push(obj.id)
        }
        arr = arr.sort((a, b) => {
            let obj1 = this.m_mSiegeAllyKill[a], obj2 = this.m_mSiegeAllyKill[b]
            if (obj1.num > obj2.num) return -1;
            else if (obj1.num < obj2.num) return 1;
            return 0;
        })
        return arr;
    }

    public static getSiegeKill(type: EumSiegeKillType, id: number) {
        if (type == EumSiegeKillType.ALLY) {
            return this.m_mSiegeAllyKill[id];
        }
        return this.m_mSiegeKill[id];
    }

    /**=============================================================================================================
    * @brief 战力系统
    * =============================================================================================================
    */
    /**
     * 更新最新的国战领取记录
     */
    public static updateExploitAward(ids: number[]) {
        if (!ids)
            return;
        for (let index = 0; index < ids.length; index++) {
            if (this.m_pExploitAwardList.indexOf(ids[index]) == -1)
                this.m_pExploitAwardList.push(ids[index]);
        }
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.EXPLOIT_AWARD_UPDATE, null);
    }
    /**判断当前阶段国战奖励是否可以领取 */
    public static checkExploitAward(curPro): boolean {
        let militoryAwardCfg: MilitaryMeritsConfig = C.MilitaryMeritsConfig[curPro];
        if (!militoryAwardCfg)
            return false;
        if (RoleData.militaryWeekExp < this.calcuExploit(curPro + 1))
            return false;
        if (this.m_pExploitAwardList.indexOf(curPro) != -1)
            return false;
        if (curPro > 1 && this.m_pExploitAwardList.indexOf(curPro - 1) == -1)
            return false;
        return true;
    }
    /**更新领取宝箱状态
     * 
     */
    public static checkExploitAwardBoxState(curPro): boolean {
        if (this.m_pExploitAwardList.indexOf(curPro) == -1)
            return false;
        return true;
    }
    /**计算战功的累加值 */
    public static calcuExploit(curPro: number): number {
        let exploit: number = 0;
        for (let index = 1; index < curPro; index++) {
            if (!C.MilitaryMeritsConfig[index])
                return;
            exploit += C.MilitaryMeritsConfig[index].militaryMerits;
        }
        return exploit;
    }
    /**检测军功红点 */
    public static checkExploitRedPoint(): number {
        for (let curPro = 1; curPro <= this.MAX_EXPLOIT_AWARD; curPro++) {
            if (this.checkExploitAward(curPro))
                return 1;
        }
        return 0;
    }
    public static checkWarnRedPoint(): number {
        let arr: ItfWarnItem[] = [];
        for (let id in this.m_mWarnList) {
            arr.push(this.m_mWarnList[id])
        }
        return arr.length > 0 ? 1 : 0;
    }
    /**奖励弹框显示 */
    public static receiveMilitoryReward(data: gameProto.IS2C_MILITARYMERITS_REWARD_RECEIVE) {
        if (data.errorCode == 0) {
            let cfg = C.MilitaryMeritsConfig[data.id]
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);
            }

        }
    }
    /**得到已经领取奖励的列表 */
    public static getMilitoryAwardList() {
        return this.m_pExploitAwardList;
    }

    /**===============================================================================================================
     * 场景跳转being
     * ===============================================================================================================
     */
    /**设置入口参数 */
    public static setWorldParam(param: com_main.IWorldMapData) {
        this.m_tWorldParam = param;
    }

    public static getWordlParam() {
        return this.m_tWorldParam;
    }

    public static resetWorldParam() {
        this.m_tWorldParam = null;
    }
    /**场景切换（世界地图 襄阳地图） */
    private static runTargetScene: SceneEnums;
    public static gotoWorldScene(scene: SceneEnums, param?: com_main.IWorldMapData) {
        if (FunctionModel.isFunctionOpenWithWarn(FunctionType.WORLD_MAP)) {
            if (SceneManager.getCurrScene() == scene) return;
            if (param) this.setWorldParam(param);
            let curScene = SceneManager.getCurrScene();
            this.runTargetScene = scene;
            if (curScene == SceneEnums.WORLD_CITY || curScene == SceneEnums.WORLD_XIANGYANG_CITY) {
                /**最后一条请求队伍信息 收到信息切换场景 */
                WorldProxy.C2S_TEAMMOVE_LIST([]);
            } else {
                WorldProxy.send_CITY_BATTLE_LOAD_WORLD_MAP();
                if (this.runTargetScene == SceneEnums.WORLD_CITY) {
                    WorldProxy.C2S_WORLDMAP_INFORMATION(RoleData.countryId);
                    WorldProxy.C2S_MILITARYMERITS_REWARD_INFO();
                }
                /**最后一条请求队伍信息 收到信息切换场景 */
                WorldProxy.C2S_TEAMMOVE_LIST([]);
            }
        };
    }

    /**协议收到返回 切换场景 */
    public static runScene() {
        Loading.hide();
        if (this.runTargetScene) {
            BattleModel.setIsStopPlay(false);
            SceneManager.runScene(this.runTargetScene);
            this.runTargetScene = null;
        }
    }

    /**检查是否退出世界地图(runScene 赋值后执行) */
    public static checkWorldScene() {
        let preScene = SceneManager.getLastScene();
        let curScene = SceneManager.getCurrScene();
        let preWorld = preScene == SceneEnums.WORLD_CITY || preScene == SceneEnums.WORLD_XIANGYANG_CITY;
        let curtWorld = curScene == SceneEnums.WORLD_CITY || curScene == SceneEnums.WORLD_XIANGYANG_CITY;
        //世界场景 切换至非世界场景
        if (preWorld && !curtWorld) {
            WorldProxy.send_CITY_BATTLE_EXIT_WORLD_MAP();
        }
    }
    /**===============================================================================================================
     * 场景跳转end
     * ===============================================================================================================
     */
}