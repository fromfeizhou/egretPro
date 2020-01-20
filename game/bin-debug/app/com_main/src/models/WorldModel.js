/**世界地图 */
var WorldModel = /** @class */ (function () {
    function WorldModel() {
    }
    Object.defineProperty(WorldModel, "capitalId", {
        get: function () {
            if (this.m_pCapitalId == 0) {
                for (var key in C.WorldMapConfig) {
                    var v = C.WorldMapConfig[key];
                    if (!v || v.first != 1 || v.mapId != SceneEnums.WORLD_CITY)
                        continue;
                    if (v.countryId == RoleData.countryId) {
                        this.m_pCapitalId = v.id;
                        break;
                    }
                }
            }
            return SceneManager.isWorldScene() ? this.m_pCapitalId : C.WorldMapConfig[this.m_pCapitalId].mapCity;
        },
        enumerable: true,
        configurable: true
    });
    WorldModel.init = function () {
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
    };
    WorldModel.clear = function () {
        this.m_pCityBuildInfo = null;
        this.m_pMoveList = null;
        this.m_pClientMoveList = null;
        this.m_pEventList = null;
        this.m_pResRefEventMap = null;
        this.m_militaryMeritsDayList = null;
        this.clearNoticeTimer();
    };
    /**=============================================================================================================
     * @brief 城池相关
     * =============================================================================================================
     */
    WorldModel.getCityConfig = function (iid) {
        return C.WorldMapConfig[iid];
    };
    /**解析获得出生城 */
    WorldModel.parseBirthCity = function () {
        this.birthCityList = [];
        this.xiangBirthCityList = [];
        for (var cityId in C.WorldMapConfig) {
            var city = C.WorldMapConfig[cityId];
            if (city.type == CityType.BIRTH) {
                this.birthCityList.push(city.id);
            }
            if (city.type == CityType.XIANG_BIRTH) {
                this.xiangBirthCityList.push(city.id);
            }
        }
    };
    /**解析每日战功配置 */
    WorldModel.parseMilitaryMeritsDayLimit = function () {
        for (var key in C.MilitaryMeritsDayLimitConfig) {
            var militaryMeritsLimit = C.MilitaryMeritsDayLimitConfig[key];
            if (isNull(militaryMeritsLimit))
                continue;
            if (isNull(this.m_militaryMeritsDayList[militaryMeritsLimit.dayLimit])) {
                this.m_militaryMeritsDayList[militaryMeritsLimit.dayLimit] = militaryMeritsLimit.id;
            }
        }
    };
    /**得到下一个上限 */
    WorldModel.getNextMilitaryMeritsDayLimitLev = function (militory) {
        for (var key in this.m_militaryMeritsDayList) {
            if (Number(key) > militory) {
                return this.m_militaryMeritsDayList[key];
            }
        }
        return 200;
    };
    Object.defineProperty(WorldModel, "birthCity", {
        get: function () {
            for (var index = 0; index < this.birthCityList.length; index++) {
                var city = C.WorldMapConfig[this.birthCityList[index]];
                if (city.countryId == RoleData.countryId)
                    return city.id;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorldModel, "xBirthCity", {
        get: function () {
            for (var index = 0; index < this.xiangBirthCityList.length; index++) {
                var city = C.WorldMapConfig[this.xiangBirthCityList[index]];
                if (city.countryId == RoleData.countryId)
                    return city.id;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    WorldModel.birtyCityTips = function (cityid) {
        if (cityid == this.birthCity)
            return;
    };
    WorldModel.XPathCovertWorld = function (through) {
    };
    /**获得城市名字 */
    WorldModel.getCityName = function (iid) {
        var cityConf = C.WorldMapConfig[iid];
        if (cityConf)
            return GLan(cityConf.name);
        return '';
    };
    /**获得城池类型名字 */
    WorldModel.getCityTypeName = function (level) {
        switch (level) {
            case CityLevel.CAPITAL:
                return GCode(CLEnum.WOR_BD_DC);
            case CityLevel.TOWN:
                return GCode(CLEnum.WOR_BD_JC);
            case CityLevel.COUNTY:
                return GCode(CLEnum.WOR_BD_XC);
        }
    };
    /**活动时间开始定时器 */
    WorldModel.openTick = function () {
        var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
        if (TimerUtils.getServerTimeMill() > vo.openDate) {
            this.clearNoticeTimer();
            return;
        }
        if (this.bOnTick)
            return;
        this.bOnTick = true;
        this.bPreNotice = false;
        this.bWwarNotice = false;
        this.m_nTimeOut = Math.floor((vo.preViewDate - TimerUtils.getServerTimeMill()) / 1000);
        this.m_nStopOut = Math.floor((vo.openDate - TimerUtils.getServerTimeMill()) / 1000);
        //每分钟检查一遍
        Utils.TimerManager.doTimer(2000, 0, this.updateXYReadyTime, this);
    };
    /**活动定时器 */
    WorldModel.updateXYReadyTime = function () {
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
    };
    WorldModel.playNotice = function (id) {
        var notice = C.NoticeConfig[id];
        if (notice) {
            var str = GLan(notice.msg);
            com_main.SystemNotice.show(str);
        }
    };
    WorldModel.clearNoticeTimer = function () {
        Utils.TimerManager.remove(this.updateXYReadyTime, this);
    };
    /**
     * 解析建筑数据
     * @param  {any} data
     * @returns void
     */
    WorldModel.initCityBuildInfo = function (data) {
        for (var k in data) {
            var info = data[k];
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
    };
    /**解析解锁数据 */
    WorldModel.initCityLockData = function (mapUnLock) {
        if (isNull(mapUnLock))
            return;
        this.m_pCityLockedList = mapUnLock;
    };
    /**
     * 当前国家占领的城池列表
     * @static
     * @return gameProto.ICityInfo[]
     * @memberof WorldModel
     */
    WorldModel.getSelfCity = function () {
        var arr = [];
        for (var i in this.m_pCityBuildInfo) {
            var conf = this.m_pCityBuildInfo[i];
            if (conf.country == RoleData.countryId)
                arr.push(conf);
        }
        return arr;
    };
    /**是否是本势力城池 */
    WorldModel.isOwnerCity = function (cityId) {
        var info = this.getCityBuildInfo(cityId);
        if (info.country == RoleData.countryId)
            return true;
        return false;
    };
    /**
     * 解析警报信息
     *
     */
    WorldModel.updateWarnInfomation = function (data) {
        this.m_mWarnList = {};
        /**攻城 */
        if (data.atkCity.length > 0) {
            for (var _i = 0, _a = data.atkCity; _i < _a.length; _i++) {
                var cityId = _a[_i];
                this.setAttackWarn(3 /* ATTACKING */, cityId, 0, null);
            }
        }
        /**守城 */
        if (data.defCity.length > 0) {
            for (var _b = 0, _c = data.defCity; _b < _c.length; _b++) {
                var defInfo = _c[_b];
                this.setAttackWarn(4 /* ATTACKING_ENEMY */, defInfo.cityId, 0, defInfo.countryId);
            }
        }
        /**攻城集结 */
        if (data.massMap.length > 0) {
            for (var _d = 0, _e = data.massMap; _d < _e.length; _d++) {
                var massInfo = _e[_d];
                this.setAttackWarn(1 /* ATTACK */, massInfo.cityId, massInfo.timeArrival, null, massInfo.teamCount);
            }
        }
        /**守方集结 */
        if (data.enemyMassMap.length) {
            for (var _f = 0, _g = data.enemyMassMap; _f < _g.length; _f++) {
                var enemyMassInfo = _g[_f];
                this.setAttackWarn(2 /* ATTACK_ENEMY */, enemyMassInfo.cityId, enemyMassInfo.timeArrival, null, enemyMassInfo.teamCount);
            }
        }
    };
    /**
     * 警报通知
     */
    WorldModel.updateWarnNotice = function (data) {
        var warnCfg;
        if (data.enemyAndUs == WorldModel.OUR_ARMY_MASS) {
            // warnCfg = C.WarningConfig[EumWarnType.ATTACK]
            var warn_1 = {
                cityId: data.targetCity,
                pid: 1 /* ATTACK */,
                content: [0, data.targetCity],
                dt: 0,
                startdt: 0
            };
            this.addWarnNotice(warn_1);
        }
        else if (data.enemyAndUs == WorldModel.ENEMY_MASS) {
            // warnCfg = C.WarningConfig[EumWarnType.ATTACK_ENEMY]
            var warn_2 = {
                cityId: data.targetCity,
                pid: 2 /* ATTACK_ENEMY */,
                content: [0, data.targetCity],
                dt: 0,
                startdt: 0
            };
            this.addWarnNotice(warn_2);
        }
    };
    /**
     * 处理警报通知
     */
    WorldModel.addWarnNotice = function (warn) {
        this.m_mWarnNoticeDic[warn.cityId] = warn;
        this.m_mWarnNoticeList.push(warn);
        // com_main.EventMgr.dispatchEvent(RedPointEvent.RED_POINT_NORMAL_UPDATE, RedEvtType.WARN);
    };
    WorldModel.__check_args = function (pid, content) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (this.checkNum(content) != args.length) {
            error("====__check_args args is err====================", pid, args);
            return "";
        }
        var c = "";
        if (pid == 1 || pid == 2) {
            var batt = args[0], cid = args[1];
            c = StringUtils.stringFormat(content, this.checkBatt(batt), this.checkCity(cid));
            c = c.replace("【0】", "");
        }
        else if (pid == 3) {
            var cid = args[0];
            c = StringUtils.stringFormat(content, this.checkCity(cid));
        }
        else if (pid == 4 || pid == 6) {
            var cid = args[0], country = args[1];
            c = StringUtils.stringFormat(content, this.checkCity(cid), this.checkCountry(country));
        }
        return c;
    };
    /**检测占位数 */
    WorldModel.checkNum = function (str) {
        var count = 0, pos = str.indexOf("%s");
        while (pos !== -1) {
            count++;
            pos = str.indexOf("%s", pos + 1);
        }
        return count;
    };
    /**
     * 检查部队数
     *
     */
    WorldModel.checkBatt = function (num) {
        if (num < 10000)
            return "" + num;
        return "" + Math.floor(num / 10000) + GCode(CLEnum.NUM_WAN);
    };
    /**
     * 检测城池
     */
    WorldModel.checkCity = function (cid) {
        var conf = C.WorldMapConfig[cid];
        if (!conf)
            return;
        return GLan(conf.name);
    };
    /**
     * 检测国家
     */
    WorldModel.checkCountry = function (country) {
        var text = "";
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
    };
    /**
     * 更新单个城池信息
     * @param  {any} data
     * @returns number
     */
    WorldModel.updateCityBuildInfo = function (data) {
        var info = (data);
        var old = this.m_pCityBuildInfo[data.id];
        var ret = false, atk = [];
        var country = RoleData.countryId;
        if (old && old.atkCountry != country && info.atkCountry == country) {
            ret = true;
            atk.push(info.id);
        }
        else if (old && old.atkCountry == country && info.atkCountry != country) {
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
    };
    /**检测是否有首战奖励 */
    WorldModel.checkIsHasFirstAward = function (cityId) {
        var conf = WorldModel.getCityConfig(cityId);
        var cityInfo = WorldModel.getCityBuildInfo(cityId);
        if (!conf || !cityInfo) {
            return false;
        }
        if (!conf.firstreward || cityInfo.hasBeenOccupied || conf.firstreward == "[]")
            return false;
        return true;
    };
    /**根据首占奖励ran1得到武将id */
    WorldModel.getGenIdByWorldCfg = function (worldCityMapCfg) {
        if (isNull(worldCityMapCfg))
            return 1001;
        var itemId = Number(worldCityMapCfg.firstrewardRank1.split("_")[0]);
        var itemCfg = C.ItemConfig[itemId];
        if (isNull(itemCfg))
            return 1001;
        var generalId = Number(itemCfg.common);
        return generalId;
    };
    /**检测是否有解锁图标 */
    WorldModel.checkIsHasLock = function (cityId) {
        var cityInfo = WorldModel.getCityBuildInfo(cityId);
        var conf = C.WorldMapConfig[cityId];
        return this.m_pCityLockedList.indexOf(cityId) == -1 && RoleData.countryId == cityInfo.country && cityInfo.unlockTaskId != 0 && conf && conf.mapId == SceneEnums.WORLD_CITY;
    };
    WorldModel.getCountryRange = function (country) {
        country = country || RoleData.countryId;
        var arr = [];
        var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
        for (var i in this.m_pCityBuildInfo) {
            var conf = this.m_pCityBuildInfo[i];
            var config = C.WorldMapConfig[Number(i)];
            if (config.type == CityType.EMPEROR_BATTLE) {
                conf = this.m_pCityBuildInfo[config.mapCity];
            }
            // if (conf.country == country || conf.atkCountry == country) {
            if (conf.country == country || (conf.status == 1) || (config.type == CityType.EMPEROR_BATTLE && vo && vo.isOpenIcon() && vo.activited)) {
                var point = WorldTmxData.getRange(config.id);
                arr = arr.concat(point);
            }
        }
        return arr;
    };
    WorldModel.compare = function (x, y) {
        if (x < y) {
            return -1;
        }
        else if (x > y) {
            return 1;
        }
        else {
            return 0;
        }
    };
    /**
    * 获取所有建筑信息
    */
    WorldModel.getCityBuildInfos = function () {
        return this.m_pCityBuildInfo;
    };
    WorldModel.getXiangBirthMapCityId = function (cityId) {
        var config = C.WorldMapConfig[cityId];
        if (config && config.type == CityType.XIANG_BIRTH)
            return config.mapCity;
        return cityId;
    };
    /**
    * 获取单个建筑信息
    */
    WorldModel.getCityBuildInfo = function (id) {
        id = this.getXiangBirthMapCityId(id);
        var info = this.m_pCityBuildInfo[id];
        return info ? info : null;
    };
    /**获取国家占有城池数量 */
    WorldModel.getCountryCount = function (type) {
        var count = 0;
        for (var key in this.m_pCityBuildInfo) {
            var data = this.m_pCityBuildInfo[key];
            if (unNull(data)) {
                var cfg = C.WorldMapConfig[data.id];
                if (cfg.mapId == SceneEnums.WORLD_CITY && data.country == type) {
                    count++;
                }
            }
        }
        return count;
    };
    WorldModel.checkHaveCd = function (info) {
        // let _st = info.buildStartTime ? info.buildStartTime : 0;
        // let _et = info.buildEndTime ? info.buildEndTime : 0;
        // return info.buildStartTime != null && info.buildEndTime != null && _st > 0 && _et > 0 && TimerUtils.getServerTimeMill() < _et;
        return false;
    };
    /**获得未解锁城池id */
    WorldModel.getLockedCityId = function () {
        var list = this.getSelfCity();
        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            //排除开战城池
            if (this.m_pCityLockedList.indexOf(info.id) == -1 && info.status != 1)
                return info.id;
        }
        return 0;
    };
    /**当前国家未占领的城池列表 */
    WorldModel.getNotSelfCity = function () {
        var arr = [];
        for (var i in this.m_pCityBuildInfo) {
            var conf = this.m_pCityBuildInfo[i];
            // 排除开战城池 2休战状态暂时无 不用判断
            var notWar = conf.status != 1;
            //排除襄阳城
            var notXY = conf.id != 32;
            if (notWar && notXY && conf.country != RoleData.countryId)
                arr.push(conf);
        }
        return arr;
    };
    /**获取可攻打最近的城池id */
    WorldModel.getNearestCanAttackCity = function () {
        var list = this.getNotSelfCity();
        var cList = [];
        for (var i = 0; i < list.length; i++) {
            if (!list[i])
                continue;
            var info = list[i];
            // 出生城池 WorldModel.birthCity
            var _a = com_main.DjikstraGraph.Instance.GetWayTime(WorldModel.birthCity, info.id), dt = _a[0], speed = _a[1], _ = _a[2];
            if (dt == 0 && speed == 0)
                continue;
            cList.push(info);
        }
        // SortTools.sortMap(cList, "npcLv", true);
        cList.sort(function (a, b) {
            var conf_a = WorldModel.getCityConfig(a.id);
            var conf_b = WorldModel.getCityConfig(b.id);
            return conf_a.AtackCityLv - conf_b.AtackCityLv;
        });
        return cList.length == 0 ? 0 : cList[0].id;
    };
    Object.defineProperty(WorldModel, "moveList", {
        /**=============================================================================================================
         * @brief 城池相关
         * =============================================================================================================
         */
        /**=============================================================================================================
         * @brief 地图移动队伍
         * =============================================================================================================
         */
        get: function () {
            return this.m_pMoveList;
        },
        enumerable: true,
        configurable: true
    });
    WorldModel.getTeamMoveKey = function (data) {
        return data.playerId + "_" + data.teamId;
    };
    /**获得玩家自己队伍的移动对象数据 */
    WorldModel.getOwnerTeamMoveKey = function (order) {
        var teamData = TeamModel.getTeamVoByType(1 /* WORLD */, order);
        return RoleData.playerId + "_" + teamData.id;
    };
    /**解析队伍列表 */
    WorldModel.parseTeamMove = function (moveDatas, isReplace) {
        if (isReplace === void 0) { isReplace = false; }
        if (isReplace) {
            this.m_pMoveList = {};
        }
        //更新列表
        for (var i = 0; i < moveDatas.length; i++) {
            var data = moveDatas[i];
            if (this.runTargetScene == SceneEnums.WORLD_XIANGYANG_CITY && this.checkWorldPath(data.cityPath))
                continue;
            if (this.runTargetScene == SceneEnums.WORLD_CITY && this.checkXyPath(data.cityPath))
                continue;
            data.cityPath = this.worldToXYPath(data.cityPath);
            if (isNull(data.cityPath))
                continue;
            var teamkey = this.getTeamMoveKey(data);
            this.m_pMoveList[teamkey] = data;
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_MOVE_LIST_UPDATE, teamkey);
        }
    };
    /**队伍路径转换把世界地图点转成襄阳战点 */
    WorldModel.worldToXYPath = function (path) {
        if (!this.checkXyPath(path))
            return path;
        for (var index = 0; index < path.length; index++) {
            var conf = C.WorldMapConfig[path[index]];
            if (conf.mapId == SceneEnums.WORLD_CITY) {
                path[index] = conf.mapCity;
            }
        }
        return path;
    };
    WorldModel.checkXyPath = function (path) {
        if (isNull(path))
            return false;
        if (path.length < 1)
            return false;
        for (var index = 0; index < path.length; index++) {
            if (C.WorldMapConfig[path[index]].mapId == SceneEnums.WORLD_XIANGYANG_CITY)
                return true;
        }
        return false;
    };
    WorldModel.checkWorldPath = function (path) {
        if (isNull(path))
            return false;
        if (path.length < 1)
            return false;
        for (var index = 0; index < path.length; index++) {
            if (C.WorldMapConfig[path[index]].mapId == SceneEnums.WORLD_XIANGYANG_CITY)
                return false;
        }
        return true;
    };
    WorldModel.checkEnterXyScene = function () {
        // let limitLev: number = ConstUtil.getValue(IConstEnum.XIANGYANG_LEVEL_LIMIT);
        // if (RoleData.level < limitLev) {
        //     EffectUtils.showTips(GCodeFromat(CLEnum.HAN_FIGHT_LIMIT, limitLev), 1, true)
        //     return false;
        // }
        return true;
    };
    /**获得移动对象数据 */
    WorldModel.getTeamMoveData = function (key) {
        return this.m_pMoveList[key];
    };
    /**获得玩家自己队伍的移动对象数据 */
    WorldModel.getOwnerTeamMoveData = function (order) {
        var teamData = TeamModel.getTeamVoByType(1 /* WORLD */, order);
        var key = RoleData.playerId + "_" + teamData.id;
        return this.m_pMoveList[key];
    };
    /**请求服务更新队伍 */
    WorldModel.sendUpdateTeamData = function () {
        var list = [];
        for (var key in this.m_pMoveList) {
            var data = this.m_pMoveList[key];
            if (data) {
                list.push({ playerId: data.playerId, teamId: data.teamId, countryId: data.countryId });
            }
        }
        WorldProxy.C2S_TEAMMOVE_LIST(list);
        console.log("C2S_TEAMMOVE_LIST=====");
    };
    /**解析驻军 */
    WorldModel.parseTroop = function (datas) {
        var len = datas.length;
        var res = [];
        if (len == 0) {
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TROOP, res);
            return;
        }
        var tropData;
        var data;
        var generalTroopDic = {};
        for (var index = 0; index < len; index++) {
            data = datas[index];
            if (data.generalId == 0 || data.teamForce == 0)
                continue;
            if (data.isNpc)
                continue;
            tropData = generalTroopDic[data.playerId];
            if (isNull(tropData)) {
                tropData = { name: data.userName, count: 1, troop: data.teamForce };
            }
            else {
                tropData.count = tropData.count + 1;
                tropData.troop = tropData.troop + data.teamForce;
            }
            generalTroopDic[data.playerId] = tropData;
            // res.push(tropData);
        }
        for (var key in generalTroopDic) {
            if (generalTroopDic[key].count == 0)
                continue;
            res.push(generalTroopDic[key]);
        }
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_TROOP, res);
    };
    Object.defineProperty(WorldModel, "clientMoveList", {
        /**获得客户端本地移动事件 */
        get: function () {
            return this.m_pClientMoveList;
        },
        enumerable: true,
        configurable: true
    });
    /**获得客户端本地移动事件 */
    WorldModel.getClientMoveByTeamId = function (teamId) {
        return this.m_pClientMoveList[teamId];
    };
    /**资源点 存在队伍前往 */
    WorldModel.isInTeamMoveRes = function (evtPosId) {
        for (var teamId in this.m_pClientMoveList) {
            var data = this.m_pClientMoveList[teamId];
            if (data.evtPosId == evtPosId) {
                return true;
            }
        }
        return false;
    };
    /**创建本地移动对象 back为true的时候是反向移动*/
    WorldModel.createClientMove = function (teamId, evtPosId, isBack) {
        var _this = this;
        if (isBack === void 0) { isBack = false; }
        var evtVo = this.getEventVoByPosId(evtPosId);
        if (evtVo) {
            var data = {
                teamId: teamId,
                evtPosId: evtVo.eventCoordinatesId,
                evtDataId: evtVo.eventDataId,
                startTime: TimerUtils.getServerTime(),
                endTime: TimerUtils.getServerTime() + 5,
                isBack: isBack
            };
            this.m_pClientMoveList[teamId] = data;
            com_main.WorldView.callFunc(19 /* CREATE_CLIENT_MOVE */, data);
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.CLIENT_MOVE_UPDATE, null);
            /**添加timeOut函数 */
            var time = (data.endTime - data.startTime) * 1000;
            egret.setTimeout(function (teamId) {
                if (!_this.m_pClientMoveList || !_this.m_pClientMoveList[teamId])
                    return;
                if (!isBack) {
                    WorldProxy.C2S_WORLDMAP_EVENT_ACT(_this.m_pClientMoveList[teamId].evtPosId, _this.m_pClientMoveList[teamId].evtDataId, teamId, evtVo.cityId);
                    com_main.EventMgr.dispatchEvent(TaskWorldEvent.CLIENT_MOVE_UPDATE, null);
                }
                delete _this.m_pClientMoveList[teamId];
            }, this, time, teamId);
        }
    };
    Object.defineProperty(WorldModel, "eventList", {
        /**=============================================================================================================
         * @brief 地图移动队伍 end
         * =============================================================================================================
         */
        /**=============================================================================================================
        * @brief 地图事件
        * =============================================================================================================
        */
        /**获得事件列表 */
        get: function () {
            return this.m_pEventList;
        },
        enumerable: true,
        configurable: true
    });
    /**根据城池获得事件 */
    WorldModel.getEventVoByPosId = function (eventPosId) {
        return this.m_pEventList[eventPosId];
    };
    /**根据类型获得事件列表 */
    WorldModel.getEventVosByType = function (evtType, subType) {
        var res = [];
        for (var key in this.m_pEventList) {
            var vo = this.m_pEventList[key];
            if (this.checkIsHasLock(vo.cityId))
                continue;
            if (vo && vo.type == evtType) {
                if (!subType || vo.subType == subType)
                    res.push(vo);
            }
        }
        return res;
    };
    WorldModel.parseEventList = function (list, isReplace, isRefresh) {
        if (isReplace === void 0) { isReplace = true; }
        if (isRefresh === void 0) { isRefresh = false; }
        if (isReplace) {
            this.m_pEventList = {};
            this.m_pCityEventList = {};
        }
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            if (!this.m_pEventList[data.eventCoordinatesId]) {
                var worldEvtVo = WorldEventVo.create(data);
                this.m_pEventList[data.eventCoordinatesId] = worldEvtVo;
                if (isNull(this.m_pCityEventList[worldEvtVo.cityId]))
                    this.m_pCityEventList[worldEvtVo.cityId] = [];
                this.m_pCityEventList[worldEvtVo.cityId].push(data.eventCoordinatesId);
            }
            else {
                this.m_pEventList[data.eventCoordinatesId].update(data);
            }
        }
    };
    /**根据队伍id 获取队伍事件 */
    WorldModel.getTeamEvtTypeById = function (teamId) {
        /**事件移动中 */
        if (this.m_pClientMoveList[teamId]) {
            return WorldEventType.MOVE;
        }
        /**事件清理中 */
        for (var key in this.m_pEventList) {
            var vo = this.m_pEventList[key];
            if (vo) {
                if ((vo.getTeamId() == teamId)) {
                    return vo.type;
                }
            }
        }
        return WorldEventType.NONE;
    };
    /**根据队伍获取事件 */
    WorldModel.getTeamEvtById = function (teamId) {
        for (var key in this.m_pEventList) {
            var vo = this.m_pEventList[key];
            if (vo) {
                if ((vo.getTeamId() == teamId)) {
                    return vo;
                }
            }
        }
        return null;
    };
    /**获得部队状态描述 */
    WorldModel.getEventDes = function (type) {
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
    };
    /**事件更新 */
    WorldModel.updateWorldEvent = function (data) {
        var evtVo = this.getEventVoByPosId(data.eventCoordinatesId);
        if (evtVo)
            evtVo.update(data);
    };
    /**事件结束 */
    WorldModel.endWorldEvent = function (data) {
        var evtVo = this.m_pEventList[data.eventCoordinatesId];
        if (!evtVo)
            return;
        delete this.m_pEventList[data.eventCoordinatesId];
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, data.eventCoordinatesId);
    };
    /**获得事件 */
    WorldModel.getWorldEvent = function (eventCoordinatesId) {
        var evtVo = this.m_pEventList[eventCoordinatesId];
        if (!evtVo)
            return null;
        return evtVo;
    };
    /**清除时间 */
    WorldModel.clearWorldEvent = function (eventCoordinatesId) {
        delete this.m_pEventList[eventCoordinatesId];
    };
    /**更新解锁状态 */
    WorldModel.updateCityLockState = function (cityId) {
        if (isNull(this.m_pCityLockedList))
            this.m_pCityLockedList = [];
        if (this.m_pCityLockedList.indexOf(cityId) == -1)
            this.m_pCityLockedList.push(cityId);
    };
    /**得到城池的解锁状态 true已经解锁*/
    WorldModel.checkCityLocked = function (cityId) {
        return this.m_pCityLockedList.indexOf(cityId) != -1;
    };
    /**解锁奖励弹框显示 */
    WorldModel.receiveUnLockReward = function (data) {
        if (data.errorCode == 0) {
            var cfg = C.WorldMapConfig[data.cityId];
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.unlockReward);
            }
        }
    };
    /**
     * 重置事件
     */
    WorldModel.resetWorldEvent = function (data) {
        this.m_pEventList[data.eventCoordinatesId] = WorldEventVo.create(data);
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_UPDATE_EVENT_UPDATE, data.eventCoordinatesId);
    };
    /**
     * 存储完成的事件点
     */
    WorldModel.addFinishWorldEvent = function (eventCoordinatesId) {
        //  totalTime: number;//累计时间
        // confTime: number;//配置的刷新时
        var conf = C.EventCoordinatesConfig[eventCoordinatesId];
        if (isNull(conf))
            return;
        this.m_pResRefEventMap[eventCoordinatesId] = { totalTime: 0, confTime: conf.frequency };
    };
    Object.defineProperty(WorldModel, "visitEventList", {
        /**=============================================================================================================
         * @brief 地图事件 end
         * =============================================================================================================
         */
        /**=============================================================================================================
        * @brief 拜访事件 begin
        * =============================================================================================================
        */
        /**获得拜访列表 */
        get: function () {
            return this.m_pVisitEvent;
        },
        enumerable: true,
        configurable: true
    });
    /**获得可拜访列表 */
    WorldModel.getCanVisitEventList = function () {
        var res = [];
        for (var key in this.m_pVisitEvent) {
            var data = this.m_pVisitEvent[key];
            if (this.checkIsHasLock(data.cityId))
                continue;
            if (data && this.isOwnerCity(data.cityId)) {
                res.push(data);
            }
        }
        return res;
    };
    /**武将拜访中 */
    WorldModel.isInVisitbyGenId = function (generalId) {
        for (var key in this.m_pVisitEvent) {
            var data = this.m_pVisitEvent[key];
            if (data && data.generalId == generalId) {
                return true;
            }
        }
        return false;
    };
    /**获得拜访数据 */
    WorldModel.getVisitEventById = function (cityId) {
        return this.m_pVisitEvent[cityId];
    };
    /**解析拜访列表 */
    WorldModel.parseVisitEventList = function (list, isReplace) {
        if (isReplace === void 0) { isReplace = true; }
        if (isReplace) {
            this.m_pVisitEvent = {};
        }
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            this.m_pVisitEvent[data.cityId] = data;
        }
    };
    /**解析拜访列表 */
    WorldModel.updateVisitEvent = function (data) {
        if (this.m_pVisitEvent[data.cityId]) {
            this.m_pVisitEvent[data.cityId] = data;
        }
    };
    /**移除拜访事件 */
    WorldModel.removeVisitEvent = function (cityId) {
        delete this.m_pVisitEvent[cityId];
    };
    /**=============================================================================================================
    * @brief 拜访事件 end
    * =============================================================================================================
    */
    WorldModel.createEvent = function (data) {
    };
    /**
     * 发送事件包
     * @static
     * @param  {ItfEventObject} obj
     * @return {}
     * @memberof WorldModel
     */
    WorldModel.getEventPack = function (obj) {
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
        };
    };
    /**
     * 初始化攻击事件
     * @static
     * @param  {*} body
     * @return void
     * @memberof WorldModel
     */
    WorldModel.initAttackEvent = function (body) {
        if (!body || !body.pre)
            return null;
        var l1 = [], l2 = [], l3 = [], l4 = [];
        return [l1, l2, l3, l4];
    };
    WorldModel.checkHeroAttackEvent = function (iid) {
        var eid = this.m_aHeroAttactEvent[iid];
        if (eid) {
            if (this.m_aAttackResEvent[eid])
                return 1;
            if (this.m_aAttackEvent[eid])
                return 2;
        }
        return 0;
    };
    /**
     * 清除攻击事件
     * @static
     * @param  {*} body
     * @return void
     * @memberof WorldModel
     */
    WorldModel.endAttackEvent = function (body) {
        var obj = this.m_aAttackEvent[body.id];
        if (obj) {
            for (var _i = 0, _a = obj.gid; _i < _a.length; _i++) {
                var gid = _a[_i];
                delete this.m_aHeroAttactEvent[gid];
            }
            delete this.m_aAttackEvent[body.id];
            return obj;
        }
        obj = this.m_aAttackResEvent[body.id];
        if (obj) {
            for (var _b = 0, _c = obj.gid; _b < _c.length; _b++) {
                var gid = _c[_b];
                delete this.m_aHeroAttactEvent[gid];
            }
            delete this.m_aAttackResEvent[body.id];
            return obj;
        }
    };
    WorldModel.getCAttackToCids = function () {
        var l = [];
        for (var i in this.m_pCityBuildInfo) {
            var city = this.m_pCityBuildInfo[i];
            if (city.atkCountry > 0) {
                l.push(city.id);
            }
        }
        return l;
    };
    /**
     * 资源存在的攻击事件
     * @static
     * @param  {number} iid 资源id
     * @param  {number} [type=1] 资源类型
     * @return ItfAttackEvent[]
     * @memberof WorldModel
     */
    WorldModel.checkAttackEvent = function (iid, type) {
        if (type === void 0) { type = 1; }
        var events = type == 1 ? this.m_aAttackEvent : this.m_aAttackResEvent;
        var l = [];
        for (var id in events) {
            var event_1 = events[id];
            if (event_1.pos != iid)
                continue;
            l.push(event_1);
        }
        return l;
    };
    /**
     * 所有的攻击事件
     * @static
     * @return ItfAttackEvent[]
     * @memberof WorldModel
     */
    WorldModel.getAllAttackEvent = function () {
        var events = [];
        for (var i in this.m_aAttackEvent) {
            events.push(this.m_aAttackEvent[i]);
        }
        for (var i in this.m_aAttackResEvent) {
            events.push(this.m_aAttackResEvent[i]);
        }
        return events.sort(WorldModel.compareAttackEvent);
    };
    /**
     * 获取城池和资源的攻击事件
     * @static
     * @param  {number[]} city 城池攻击id列表
     * @param  {number[]} [res] 资源攻击id列表
     * @return ItfAttackEvent[]
     * @memberof WorldModel
     */
    WorldModel.getAttackEvent = function (city, res) {
        var events = [];
        if (city) {
            for (var _i = 0, city_1 = city; _i < city_1.length; _i++) {
                var id = city_1[_i];
                events.push(this.m_aAttackEvent[id]);
            }
        }
        if (res) {
            for (var _a = 0, res_1 = res; _a < res_1.length; _a++) {
                var id = res_1[_a];
                events.push(this.m_aAttackResEvent[id]);
            }
        }
        return events;
    };
    WorldModel.compareAttackEvent = function (value1, value2) {
        if (value1.dt < value2.dt) {
            return 1;
        }
        else if (value1.dt > value2.dt) {
            return -1;
        }
        else {
            return 0;
        }
    };
    /**
     * 获得战场id
     * @static
     * @param  {*} body
     * @return boolean
     * @memberof WorldModel
     */
    WorldModel.updateBattleId = function (body) {
        var event = this.m_aAttackEvent[body.id];
        if (!event)
            event = this.m_aAttackResEvent[body.id];
        if (!event)
            return false;
        ;
        event.battleId = body.bid;
        return TimerUtils.getServerTime() < event.dt;
    };
    /**
     * 获取我攻击的所有队伍
     * @static
     * @param
     * @return
     * @memberof WorldModel
     */
    WorldModel.initCityWarMyteam = function (data) {
        this.m_cityWarMyteam = data.myTeamWar;
        com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_SIEGE_SELF, null);
    };
    WorldModel.getCityWarMyteam = function () {
        return this.m_cityWarMyteam;
    };
    WorldModel.getIsHaveTeam = function () {
        return this.m_isHaveMyTeam;
    };
    WorldModel.setCurWatchTeamId = function (playerId, teamId) {
        if (playerId == RoleData.playerId) {
            this.m_isHaveMyTeam = true;
        }
        this.m_watchTeamId = teamId;
        this.m_watchPlayerId = playerId;
    };
    WorldModel.battleOver = function () {
        if (WorldModel.getCityWarInfo()) {
            WorldProxy.send_C2S_CITY_WATCH_WAR_TEAM(WorldModel.getCityWarInfo().cityId, this.m_watchPlayerId, this.m_watchTeamId);
        }
    };
    /**
     * 清理国战信息
     * @static
     * @return null
     * @memberof WorldModel
     */
    WorldModel.clearCityWar = function () {
        this.m_cityWarMyteam = [];
        this.m_cityWarGo = null;
        this.m_watchPlayerId = null;
        this.m_watchTeamId = null;
        this.m_isHaveMyTeam = null;
    };
    /**
     * 当前城池自己的战斗信息
     * @static
     * @param  {number} cid
     * @return [number[], number] [当前所有部队,排队位置]
     * @memberof WorldModel
     */
    WorldModel.getSiegeSelf = function () {
        var siegeList = [];
        for (var _i = 0, _a = this.m_cityWarMyteam; _i < _a.length; _i++) {
            var info = _a[_i];
            var teamid = info.teamId;
            var battleId = info.battleId;
            var team = TeamModel.getTeamVoByTypeId(1 /* WORLD */, teamid) || TeamModel.getTeamVoByTypeId(5 /* CROSS_SERVER */, teamid);
            if (team) {
                var list = team.teamGeneralData;
                var aconf = {
                    cityId: 0,
                    roleId: 0,
                    mainGid: list[0].generalId,
                    battleId: battleId,
                    teamId: teamid,
                };
                siegeList.push(aconf);
            }
        }
        return siegeList;
    };
    // public static setCurrentWarCity(cid:number){
    //     this.m_curCid = cid;
    // }
    // public static getCurrentWarCity(){
    //     return this.m_curCid;
    // }
    WorldModel.setCityWarInfo = function (data) {
        this.m_cityWarGo = data;
        if (this.m_cityWarGo)
            this.m_cityWarGo.countDownTime = TimerUtils.getServerTime() + this.m_cityWarGo.countDownTime / 1000;
    };
    WorldModel.getCityWarInfo = function () {
        return this.m_cityWarGo;
    };
    //更新城战队伍数量
    WorldModel.setCityItemCount = function (data) {
        if (this.m_cityWarGo && this.m_cityWarGo.cityId == data.cityId) {
            this.m_cityWarGo.defTeamCount = data.defTeamCount;
            this.m_cityWarGo.atkTeamCount = data.atkTeamCount;
        }
        else {
            WorldProxy.send_C2S_CITY_WAR_OUT(data.cityId);
        }
    };
    WorldModel.checkSiegeTime = function () {
        return this.m_cityWarGo ? this.m_cityWarGo.countDownTime - TimerUtils.getServerTime() : 0;
    };
    WorldModel.isInCityWar = function () {
        return this.m_cityWarGo ? true : false;
    };
    //退出攻城战
    WorldModel.cleanCityWarInfo = function () {
        this.m_cityWarGo = null;
        WorldModel.setCurWatchTeamId(0, -1);
    };
    //获取城池倒计时
    WorldModel.checkSiegeTimeByCityid = function (cid) {
        var pInfo = WorldModel.getCityBuildInfo(cid);
        if (pInfo.warStartTime) {
            return pInfo.warStartTime - TimerUtils.getServerTime();
        }
        else {
            return 0;
        }
    };
    /**
     * 攻城战结果
     * @static
     * @param  {*} data
     * @return ItfSiegeResult
     * @memberof WorldModel
     */
    WorldModel.updateSiegeResult = function (data) {
        var ret = {
            isCross: false,
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
        };
        return ret;
    };
    /**跨服战结算 */
    WorldModel.updateCrossSiegeResult = function (data) {
        var ret = {
            isCross: true,
            isAttack: data.isAttack,
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
        };
        return ret;
    };
    /**
     * 国战对战列表
     * @static
     * @param
     * @return
     * @memberof WorldModel
     */
    WorldModel.setSiegeList = function (body) {
        WorldModel.siegeList = body;
    };
    /**
     * 国战对战列表
     * @static
     * @param
     * @return
     * @memberof WorldModel
     */
    WorldModel.getSiegeList = function () {
        return WorldModel.siegeList;
    };
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
    WorldModel.getWarn = function (cid) {
        return this.m_mWarnList[cid];
    };
    WorldModel.getWarns = function () {
        return this.m_mWarnList;
    };
    WorldModel.getWarnNotices = function () {
        return this.m_mWarnNoticeList;
    };
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
    WorldModel.setAttackWarn = function (type, cid, dt, country, batt) {
        var warn = this.m_mWarnList[cid];
        switch (type) {
            case 1 /* ATTACK */: {
                this.__set_attack_warn(type, warn, cid, dt, batt);
                break;
            }
            case 2 /* ATTACK_ENEMY */: {
                this.__set_attack_warn(type, warn, cid, dt, batt);
                break;
            }
            case 5 /* ATTACK_OTHER */: {
                break;
            }
            case 3 /* ATTACKING */: {
                this.__set_attacking_warn(type, warn, cid, country);
                break;
            }
            case 4 /* ATTACKING_ENEMY */: {
                this.__set_attacking_warn(type, warn, cid, country);
                break;
            }
        }
    };
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
    WorldModel.__set_attack_warn = function (type, warn, cid, dt, batt) {
        if (!warn) {
            warn = {
                cityId: cid,
                pid: type,
                content: [batt, cid],
                dt: dt,
                startdt: TimerUtils.getServerTime()
            };
            this.m_mWarnList[warn.cityId] = warn;
        }
        else {
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
    };
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
    WorldModel.__set_attacking_warn = function (type, warn, cid, country) {
        var b = type == 4 /* ATTACKING_ENEMY */;
        if (warn) {
            if (warn.pid == type) {
                var c = warn.content.length == 2 ? warn.content[1] : warn.content[0];
                if (c == country)
                    return;
            }
        }
        if (!warn) {
            warn = {
                cityId: cid,
            };
            this.m_mWarnList[warn.cityId] = warn;
        }
        warn.pid = type;
        warn.content = b ? [cid, country] : [cid];
        warn.startdt = TimerUtils.getServerTime();
        warn.dt = 0;
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, { cid });
    };
    /**
     * 移除警报
     * @static
     * @param  {number} cid 城池ID
     * @return
     * @memberof WorldModel
     */
    WorldModel.removeAttackWarn = function (cid) {
        var warn = this.m_mWarnList[cid];
        if (!warn)
            return;
        delete this.m_mWarnList[cid];
        this.__check_attack_warn(cid);
        warn = this.m_mWarnList[cid];
        var del = warn == undefined;
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, { cid, del });
    };
    WorldModel.removeAttackWarnByDt = function (cid, dt) {
        var warn = this.m_mWarnList[cid];
        if (!warn)
            return;
        if (warn.pid != 2 /* ATTACK_ENEMY */ && warn.pid != 1 /* ATTACK */)
            return;
        if (warn.dt != dt)
            return;
        delete this.m_mWarnList[cid];
        this.__check_attack_warn(cid);
        warn = this.m_mWarnList[cid];
        var del = warn == undefined;
        // com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, { cid, del });
    };
    WorldModel.__check_attack_warn = function (cid) {
        var country = RoleData.countryId;
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
    };
    /**检测是否有警报 */
    WorldModel.checkHasAttackWarn = function () {
        for (var warnKey in this.m_mWarnList)
            return true;
        return false;
    };
    WorldModel.initSiegeKill = function (data) {
        if (!data)
            return;
        this.m_mSiegeKill = {};
        this.m_mSiegeAllyKill = {};
        for (var _i = 0, _a = data.playerRank; _i < _a.length; _i++) {
            var o = _a[_i];
            var obj = new ItfSiegeKill();
            obj.id = o.playerId;
            obj.playerName = o.playerName;
            obj.rank = o.rank;
            obj.num = o.damage;
            obj.countryId = o.countryId;
            this.m_mSiegeKill[obj.id] = obj;
            obj.type = 0 /* PLAYER */;
        }
        for (var _b = 0, _c = data.guildRank; _b < _c.length; _b++) {
            var o = _c[_b];
            var obj = new ItfSiegeKill();
            obj.id = o.guildId;
            obj.playerName = o.guildName;
            obj.rank = o.rank;
            obj.num = o.damage;
            obj.countryId = o.countryId;
            this.m_mSiegeAllyKill[obj.id] = obj;
            obj.type = 1 /* ALLY */;
        }
    };
    WorldModel.sortSiegeKill = function (type) {
        if (type == 0 /* PLAYER */)
            return this.getSiegeKillSort();
        return this.getSiegeKillAllySort();
    };
    WorldModel.getSiegeKillSort = function () {
        var _this = this;
        var arr = [];
        for (var id in this.m_mSiegeKill) {
            var obj = this.m_mSiegeKill[id];
            arr.push(obj.id);
        }
        arr = arr.sort(function (a, b) {
            var obj1 = _this.m_mSiegeKill[a], obj2 = _this.m_mSiegeKill[b];
            if (obj1.num > obj2.num)
                return -1;
            else if (obj1.num < obj2.num)
                return 1;
            return 0;
        });
        return arr;
    };
    WorldModel.getSiegeKillAllySort = function () {
        var _this = this;
        var arr = [];
        for (var id in this.m_mSiegeAllyKill) {
            var obj = this.m_mSiegeAllyKill[id];
            arr.push(obj.id);
        }
        arr = arr.sort(function (a, b) {
            var obj1 = _this.m_mSiegeAllyKill[a], obj2 = _this.m_mSiegeAllyKill[b];
            if (obj1.num > obj2.num)
                return -1;
            else if (obj1.num < obj2.num)
                return 1;
            return 0;
        });
        return arr;
    };
    WorldModel.getSiegeKill = function (type, id) {
        if (type == 1 /* ALLY */) {
            return this.m_mSiegeAllyKill[id];
        }
        return this.m_mSiegeKill[id];
    };
    /**=============================================================================================================
    * @brief 战力系统
    * =============================================================================================================
    */
    /**
     * 更新最新的国战领取记录
     */
    WorldModel.updateExploitAward = function (ids) {
        if (!ids)
            return;
        for (var index = 0; index < ids.length; index++) {
            if (this.m_pExploitAwardList.indexOf(ids[index]) == -1)
                this.m_pExploitAwardList.push(ids[index]);
        }
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.EXPLOIT_AWARD_UPDATE, null);
    };
    /**判断当前阶段国战奖励是否可以领取 */
    WorldModel.checkExploitAward = function (curPro) {
        var militoryAwardCfg = C.MilitaryMeritsConfig[curPro];
        if (!militoryAwardCfg)
            return false;
        if (RoleData.militaryWeekExp < this.calcuExploit(curPro + 1))
            return false;
        if (this.m_pExploitAwardList.indexOf(curPro) != -1)
            return false;
        if (curPro > 1 && this.m_pExploitAwardList.indexOf(curPro - 1) == -1)
            return false;
        return true;
    };
    /**更新领取宝箱状态
     *
     */
    WorldModel.checkExploitAwardBoxState = function (curPro) {
        if (this.m_pExploitAwardList.indexOf(curPro) == -1)
            return false;
        return true;
    };
    /**计算战功的累加值 */
    WorldModel.calcuExploit = function (curPro) {
        var exploit = 0;
        for (var index = 1; index < curPro; index++) {
            if (!C.MilitaryMeritsConfig[index])
                return;
            exploit += C.MilitaryMeritsConfig[index].militaryMerits;
        }
        return exploit;
    };
    /**检测军功红点 */
    WorldModel.checkExploitRedPoint = function () {
        for (var curPro = 1; curPro <= this.MAX_EXPLOIT_AWARD; curPro++) {
            if (this.checkExploitAward(curPro))
                return 1;
        }
        return 0;
    };
    WorldModel.checkWarnRedPoint = function () {
        var arr = [];
        for (var id in this.m_mWarnList) {
            arr.push(this.m_mWarnList[id]);
        }
        return arr.length > 0 ? 1 : 0;
    };
    /**奖励弹框显示 */
    WorldModel.receiveMilitoryReward = function (data) {
        if (data.errorCode == 0) {
            var cfg = C.MilitaryMeritsConfig[data.id];
            if (cfg) {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);
            }
        }
    };
    /**得到已经领取奖励的列表 */
    WorldModel.getMilitoryAwardList = function () {
        return this.m_pExploitAwardList;
    };
    /**===============================================================================================================
     * 场景跳转being
     * ===============================================================================================================
     */
    /**设置入口参数 */
    WorldModel.setWorldParam = function (param) {
        this.m_tWorldParam = param;
    };
    WorldModel.getWordlParam = function () {
        return this.m_tWorldParam;
    };
    WorldModel.resetWorldParam = function () {
        this.m_tWorldParam = null;
    };
    WorldModel.gotoWorldScene = function (scene, param) {
        if (FunctionModel.isFunctionOpenWithWarn(FunctionType.WORLD_MAP)) {
            if (SceneManager.getCurrScene() == scene)
                return;
            if (param)
                this.setWorldParam(param);
            var curScene = SceneManager.getCurrScene();
            this.runTargetScene = scene;
            if (curScene == SceneEnums.WORLD_CITY || curScene == SceneEnums.WORLD_XIANGYANG_CITY) {
                /**最后一条请求队伍信息 收到信息切换场景 */
                WorldProxy.C2S_TEAMMOVE_LIST([]);
            }
            else {
                WorldProxy.send_CITY_BATTLE_LOAD_WORLD_MAP();
                if (this.runTargetScene == SceneEnums.WORLD_CITY) {
                    WorldProxy.C2S_WORLDMAP_INFORMATION(RoleData.countryId);
                    WorldProxy.C2S_MILITARYMERITS_REWARD_INFO();
                }
                /**最后一条请求队伍信息 收到信息切换场景 */
                WorldProxy.C2S_TEAMMOVE_LIST([]);
            }
        }
        ;
    };
    /**协议收到返回 切换场景 */
    WorldModel.runScene = function () {
        Loading.hide();
        if (this.runTargetScene) {
            BattleModel.setIsStopPlay(false);
            SceneManager.runScene(this.runTargetScene);
            this.runTargetScene = null;
        }
    };
    /**检查是否退出世界地图(runScene 赋值后执行) */
    WorldModel.checkWorldScene = function () {
        var preScene = SceneManager.getLastScene();
        var curScene = SceneManager.getCurrScene();
        var preWorld = preScene == SceneEnums.WORLD_CITY || preScene == SceneEnums.WORLD_XIANGYANG_CITY;
        var curtWorld = curScene == SceneEnums.WORLD_CITY || curScene == SceneEnums.WORLD_XIANGYANG_CITY;
        //世界场景 切换至非世界场景
        if (preWorld && !curtWorld) {
            WorldProxy.send_CITY_BATTLE_EXIT_WORLD_MAP();
        }
    };
    /**世界等级 */
    WorldModel.worldLevel = 0;
    /**城池解锁列表 */
    WorldModel.m_pCityLockedList = [];
    /**首都(世界地图) */
    WorldModel.m_pCapitalId = 0;
    /**初始需要移动的城池 */
    WorldModel.m_pInitMoveId = 0;
    /** 地图事件信息 */
    WorldModel.m_pEventList = {};
    /**城池和事件点对应关系 */
    WorldModel.m_pCityEventList = {};
    /**拜访事件列表 */
    WorldModel.m_pVisitEvent = {};
    /**国战奖励领取记录 */
    WorldModel.m_pExploitAwardList = [];
    /**城市攻击事件列表 */
    WorldModel.m_aAttackEvent = {};
    /**资源攻击事件列表 */
    WorldModel.m_aAttackResEvent = {};
    WorldModel.m_aHeroAttactEvent = {};
    WorldModel.m_pResRefEventMap = {};
    /**每日战功和等级对应关系*/
    WorldModel.m_militaryMeritsDayList = {};
    /**是否从搜索界面而来 */
    WorldModel.isFromSearchPanel = false;
    /**是否在搜索界面 */
    WorldModel.isInSearchPanel = false;
    /**拜访操作来计数*/
    WorldModel.visvitOperCount = 0;
    WorldModel.OUR_ARMY_MASS = 1;
    WorldModel.ENEMY_MASS = 2;
    WorldModel.isNoticeComplete = true;
    WorldModel.isVisvitFromSerarch = false;
    WorldModel.isUnlockFightFinish = false;
    WorldModel.isFromUnLockFight = false;
    WorldModel.unLockCid = 0;
    WorldModel.unLockTaskId = 0;
    /**国战奖励最大的阶段 */
    WorldModel.MAX_EXPLOIT_AWARD = 0;
    /**获得本国出生城 */
    WorldModel.birthCityList = [];
    WorldModel.xiangBirthCityList = [];
    WorldModel._birthCity = 0;
    WorldModel.bPreNotice = false;
    WorldModel.bWwarNotice = false;
    WorldModel.m_nTimeOut = 0;
    WorldModel.m_nStopOut = 0;
    //========================================================
    //============================攻城战=======================
    //========================================================
    /**左边英雄列表 */
    WorldModel.m_cityWarMyteam = [];
    //========================================================
    //============================警报=======================
    //========================================================
    WorldModel.m_mWarnList = {};
    WorldModel.m_mWarnNoticeDic = {};
    WorldModel.m_mWarnNoticeList = [];
    //========================================================
    //======================国战信息排行========================
    //========================================================
    WorldModel.m_mSiegeKill = {};
    WorldModel.m_mSiegeAllyKill = {};
    return WorldModel;
}());
