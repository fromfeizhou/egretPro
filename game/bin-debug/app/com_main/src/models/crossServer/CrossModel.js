;
;
/**跨服 */
var CrossModel = /** @class */ (function () {
    function CrossModel() {
    }
    CrossModel.init = function () {
        this.initCityList();
        this.initMaxTroop();
    };
    /**数据清理 */
    CrossModel.clear = function () {
        this.sandTableClear();
        this.resetCrossSeverDetailData();
        this.legionClear();
        this.rankDataClear();
    };
    /**是否开放 */
    CrossModel.checkIsOpen = function () {
        var day = CrossUtil.getValue(CrossServerConstType.OPEN_SERVER_DAY);
        var time = day * 24 * 60 * 60 * 1000;
        if (TimerUtils.ServerTime - TimerUtils.OpenServerTime >= time) {
            return true;
        }
        return false;
    };
    /**获得阶段名字 */
    CrossModel.getStateName = function () {
        switch (this.crossStatus) {
            case 0 /* READY */:
            case 1 /* HAS_SIGN */:
            case 3 /* MATCH_SUC */:
                return '准备阶段';
            case 4 /* WALL_WAR */:
            case 5 /* CITY_WAR */:
                return '战斗中';
            default:
                return '跨服战结束';
        }
    };
    /**国战状态解析 */
    CrossModel.parseCrossServerInfo = function (data) {
        this.openTime = data.openTime;
        this.closeTime = data.closeTime;
        this.rewardStatus = data.rewardStatus;
        this.honorBoxIds = data.honorBoxIds;
        if (this.crossStatus != data.status) {
            this.crossStatus = data.status;
            if (6 /* GAME_OVER */ == this.crossStatus)
                this.resetSandTable();
            this.resetCrossSeverDetailData();
        }
        com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_SERVER_STATUS, null);
    };
    /**战斗中 */
    CrossModel.isWar = function () {
        return this.crossStatus == 4 /* WALL_WAR */ || this.crossStatus == 5 /* CITY_WAR */;
    };
    /**跨服战红点 */
    CrossModel.crossServerRedPoint = function () {
        if (CrossModel.isWar() || CrossModel.crossStatus == 3 /* MATCH_SUC */ || CrossModel.rewardStatus == 1) {
            return true;
        }
        return false;
    };
    CrossModel.initMaxTroop = function () {
        this.maxTroop = CrossUtil.getValue(CrossServerConstType.MAX_TROOPS);
        ;
    };
    /**判断补兵是否足够 */
    CrossModel.checkCanTroop = function (order) {
        var teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, order);
        var troop = 0;
        //计算兵力总和
        for (var i = 0; i < teamVo.teamGeneralData.length; i++) {
            var data = teamVo.teamGeneralData[i];
            if (data.generalId > 0) {
                var genVo = GeneralModel.getOwnGeneral(data.generalId);
                var armyType = genVo.getGeneralArmyType();
                var subTroop = genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER) - data.minSoldierTotalCount;
                troop += subTroop;
            }
        }
        return this.curTroop >= troop;
    };
    CrossModel.parseCrossServerDetail = function (data) {
        if (isNull(data))
            return;
        this.bCrossServerDetailInit = true;
        this.warCityId = data.warCityId;
        this.crossDetailData = data;
        Utils.open_view(TASK_UI.CROSS_SERVER_DETAIL_VIEW);
    };
    /**打开详情界面 */
    CrossModel.openCrossServerDetail = function () {
        if (this.bCrossServerDetailInit) {
            Utils.open_view(TASK_UI.CROSS_SERVER_DETAIL_VIEW);
        }
        else {
            CrossProxy.C2S_CROSS_SERVER_WAR_RIVAL_INFO();
        }
    };
    /**得到详情数据 */
    CrossModel.getCrossDetialData = function () {
        return this.crossDetailData;
    };
    /**重置详情界面数据 */
    CrossModel.resetCrossSeverDetailData = function () {
        this.bCrossServerDetailInit = false;
        this.crossDetailData = null;
    };
    /**重置沙盘 */
    CrossModel.resetSandTable = function () {
        this.bSandTableInit = null;
        for (var i = 0, len = this.cityList.length; i < len; i++) {
            var item = this.cityList[i];
            item.servers = [];
            item.isCapture = false;
        }
    };
    /**数据清理 */
    CrossModel.sandTableClear = function () {
        this.bSandTableInit = null;
        this.cityList = null;
        this.warCityId = null;
    };
    /**打开沙盘界面 */
    CrossModel.openSandTable = function () {
        if (this.bSandTableInit) {
            Utils.open_view(TASK_UI.CROSS_SERVER_SAND_TABLE);
        }
        else {
            CrossProxy.C2S_CROSS_SERVER_WAR_SAND_INFO();
        }
    };
    /**收到沙盘数据 */
    CrossModel.parseSandTable = function (data) {
        var _this = this;
        if (isNull(data))
            return;
        this.bSandTableInit = true;
        data.forEach(function (v, i, a) {
            var cityId = v.cityId;
            var iData = _this.getCrossCity(cityId);
            if (iData) {
                var servers = v.servers;
                iData.servers = servers;
                iData.isCapture = servers.some(function (ele) {
                    return ele.status === 2;
                });
            }
        });
        Utils.open_view(TASK_UI.CROSS_SERVER_SAND_TABLE);
    };
    /**获得跨服城池类型名字 */
    CrossModel.getCrossCityTypeName = function (level) {
        switch (level) {
            case 1 /* CAPITAL */:
                return GCode(CLEnum.WOR_BD_HC);
            case 2 /* STATE */:
                return GCode(CLEnum.WOR_BD_ZC);
            case 3 /* TOWN */:
                return GCode(CLEnum.WOR_BD_JC);
            case 4 /* COUNTY */:
                return GCode(CLEnum.WOR_BD_XC);
        }
        return GCode(CLEnum.WOR_BD_XC);
    };
    /**获取沙盘城市 */
    CrossModel.getCrossCity = function (cityId) {
        if (isNull(this.cityList) || this.cityList.length == 0)
            return null;
        for (var i = 0, len = this.cityList.length; i < len; i++) {
            var item = this.cityList[i];
            if (item.id == cityId)
                return item;
        }
        return null;
    };
    /**获取沙盘城市列表 */
    CrossModel.getCrossCityList = function () {
        return this.cityList;
    };
    /**获取沙盘区服信息 */
    CrossModel.getWarsandServerVo = function (servers, serverId) {
        if (isNull(servers) || isNull(serverId))
            return null;
        for (var i = 0, len = servers.length; i < len; i++) {
            if (servers[i].serverId == serverId) {
                return servers[i];
            }
        }
        return null;
    };
    /**根据区服列表拼接字符串 */
    CrossModel.joinServerList = function (servers) {
        if (isNull(servers))
            return "无";
        var str = "";
        servers.forEach(function (ele) {
            if (ele.status === 2)
                str += ele.serverId + "区 ";
        });
        return str === "" ? "无" : str;
    };
    /**城市配置列表初始化 */
    CrossModel.initCityList = function () {
        if (isNull(this.cityList))
            this.cityList = [];
        for (var i in C.CrossServerCityConfig) {
            var vo = C.CrossServerCityConfig[i];
            var item = { id: vo.id, cityName: vo.cityName, servers: [] };
            this.cityList.push(item);
        }
    };
    CrossModel.legionInit = function () {
        this.armpGroup = [];
        this.bArmyInit = false;
    };
    CrossModel.legionClear = function () {
        this.armpGroup = null;
    };
    /**打开军团详细 */
    CrossModel.openArmyWnd = function () {
        if (this.bArmyInit) {
            this.doOpenArmyWnd();
        }
        else {
            CrossProxy.C2S_CROSS_SERVER_ARMY_GROUP();
        }
    };
    /* 军团信息 begin*/
    CrossModel.parseCrossLegionData = function (data) {
        if (data) {
            this.armyType = data.armyType;
            this.armyStatus = data.status;
            this.armpGroup = data.armyGroup;
            this.armyGroupKV = {};
            for (var _i = 0, _a = this.armpGroup; _i < _a.length; _i++) {
                var info = _a[_i];
                this.armyGroupKV[info.id] = info;
            }
            this.bArmyInit = true;
            this.doOpenArmyWnd(true);
        }
    };
    /**判断状态打开界面 */
    CrossModel.doOpenArmyWnd = function (isFirst) {
        if (isFirst === void 0) { isFirst = false; }
        if (this.armyStatus == 0) {
            EffectUtils.showTips(GCode(CLEnum.CROSS_LEGION_NO), 1, true);
            return;
        }
        if (isFirst) {
            Utils.open_view(TASK_UI.CRSOS_SERVER_LEGION_UI);
        }
        else {
            CrossProxy.C2S_CROSS_SERVER_ARMY_HP();
        }
    };
    /* 军团信息2*/
    CrossModel.parseCrossLegionDataHp = function (data) {
        if (data) {
            this.armyStatus = data.status;
            for (var _i = 0, _a = data.armyGroupHp; _i < _a.length; _i++) {
                var info = _a[_i];
                if (info && this.armyGroupKV[info.id])
                    this.armyGroupKV[info.id].troopsRate = info.troopsRate;
            }
        }
        Utils.open_view(TASK_UI.CRSOS_SERVER_LEGION_UI);
    };
    /**城门领袖 */
    CrossModel.parseGateInfo = function (data) {
        this.wallInfo = data;
        SceneManager.runScene(SceneEnums.CROSS_WALL_WAR_MAP);
    };
    /**血量更新 */
    CrossModel.parseGateHp = function (data) {
        this.wallHp = data;
        com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_WALL_UPDATE, null);
    };
    /**城门状态 */
    CrossModel.parseWallStatus = function (data) {
        this.wallStatus = data.status;
        com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_WALL_STATUS, null);
    };
    /**
     * 创建本地移动对象 back为true的时候是反向移动
           playerId:number(后续拓展)
     */
    CrossModel.createClientMove = function (orderId, startId, endId) {
        var _this = this;
        if (!this.moveData) {
            this.moveData = {};
        }
        egret.setTimeout(function (orderId) {
            if (!_this.moveData || !_this.moveData[orderId])
                return;
            delete _this.moveData[orderId];
        }, this, 5000, orderId);
    };
    CrossModel.setSelfGroup = function (group) {
        this.selfGroup = group;
    };
    CrossModel.getSelfGroup = function () {
        return this.selfGroup;
    };
    CrossModel.updateCityInfo = function (data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var i = data_1[_i];
            if (this.cityInfo[i.areaId]) {
                this.cityInfo[i.areaId].init(i);
            }
            else {
                this.cityInfo[i.areaId] = CSBCityInfoVo.create(i);
            }
        }
    };
    CrossModel.updateCityStatus = function (data) {
        if (this.cityInfo[data.cityId]) {
            this.cityInfo[data.cityId].status = data.status;
        }
    };
    CrossModel.getCityInfoById = function (cId) {
        return this.cityInfo[cId];
    };
    CrossModel.getCIdByWarAreaId = function (warAreaId) {
        for (var i in this.cityInfo) {
            if (this.cityInfo[i].warAreaId == warAreaId)
                return this.cityInfo[i].areaId;
        }
        return 0;
    };
    /**通过唯一id获取城池名字 */
    CrossModel.getTeamCityName = function (teamVo) {
        var cId = this.getCIdByWarAreaId(teamVo.cityId);
        if (cId == 0 || cId == 6 || cId == 7) {
            return '城门';
        }
        var data = this.getCityInfoById(cId);
        if (data) {
            return data.getCityName();
        }
        return '城门';
    };
    CrossModel.getCityNumBygroup = function (group) {
        var num = 0;
        for (var i = 1; i <= 5; i++) {
            if (this.cityInfo[i] && this.cityInfo[i].occupant == group) {
                num += 1;
            }
        }
        return num;
    };
    CrossModel.getOwnCityNum = function () {
        return this.getCityNumBygroup(this.selfGroup);
    };
    CrossModel.getEnenyCityNum = function () {
        return this.getCityNumBygroup(this.selfGroup == 1 ? 2 : 1);
    };
    /**获取自己建造的箭塔数量 */
    CrossModel.getTowerNumByGroup = function (group) {
        var num = 0;
        for (var i = 1; i <= 5; i++) {
            if (this.cityInfo[i] && this.cityInfo[i].occupant == group) {
                if (this.cityInfo[i].towerNum.length == 0)
                    break;
                for (var i_1 = 0; i_1 <= 1; i_1++) {
                    if (this.cityInfo[i_1].towerNum[i_1]) {
                        num += 1;
                    }
                }
            }
        }
        return num;
    };
    /**获取自己建造的箭塔数量 */
    CrossModel.getOwnTowerNum = function () {
        return this.getTowerNumByGroup(this.selfGroup);
    };
    /**获取敌人建造的箭塔数量 */
    CrossModel.getEnenyTowerNum = function () {
        return this.getTowerNumByGroup(this.selfGroup == 1 ? 2 : 1);
    };
    /**得到状况组件data */
    CrossModel.getCrossSituData = function (isOwn) {
        if (isOwn === void 0) { isOwn = true; }
        var crossWarSituVo = { isOwn: isOwn, occupant: 1, teamNum: 0 };
        var occupant = 0;
        if (isOwn) {
            occupant = this.getSelfGroup();
        }
        else if (this.getSelfGroup() == 1) {
            occupant = 2;
        }
        else {
            occupant = 1;
        }
        for (var key in this.cityInfo) {
            var cityInfoVo = this.cityInfo[key];
            if (occupant == cityInfoVo.occupant) {
                crossWarSituVo.occupant++;
                crossWarSituVo.teamNum = crossWarSituVo.teamNum + cityInfoVo.defTeamNum;
            }
        }
        return crossWarSituVo;
    };
    /**得到当前战斗的城池 */
    CrossModel.getCurWarCity = function () {
        for (var key in this.cityInfo) {
            var cityInfoVo = this.cityInfo[key];
            if (isNull(cityInfoVo))
                continue;
            if (cityInfoVo.status == 1)
                return cityInfoVo.areaId;
        }
        return 1;
    };
    CrossModel.rankDataClear = function () {
        this.rankHonor = null;
        this.canHonorBoxIds = [];
    };
    /**解析领取每日奖励 */
    CrossModel.parseGetDayReward = function (data) {
        if (isNull(data))
            return;
        var duanWei = data.duanWei;
        this.rewardStatus = 2;
        var cfg = CrossModel.getCrossServerRewardConfig(4 /* DAILY */, duanWei);
        if (cfg)
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);
        com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_SERVER_STATUS, null);
    };
    /**解析推送玩家累计荣誉 */
    CrossModel.parseGetHonor = function (data) {
        if (isNull(data))
            return;
        this.rankHonor = data.honor;
        this.updateCanHonorBox();
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.CROSS_RANK_RY, null);
    };
    /**解析领取荣誉宝箱 */
    CrossModel.parseGetHonorBox = function (data) {
        if (isNull(data))
            return;
        var boxId = data.boxId;
        this.updateHonorBox(boxId);
        com_main.EventMgr.dispatchEvent(TaskWorldEvent.CROSS_RANK_RY, null);
    };
    /**更新累计荣誉奖励领取记录 */
    CrossModel.updateHonorBox = function (boxId) {
        if (this.honorBoxIds.indexOf(boxId) == -1)
            this.honorBoxIds.push(boxId);
        this.honorBoxIds.sort(function (a, b) {
            return a - b;
        });
    };
    /**更新可领取荣誉奖励列表 */
    CrossModel.updateCanHonorBox = function () {
        var cfgs = CrossModel.getCrossServerRewardConfigByType(3 /* HONOR */);
        for (var i = 0; i < cfgs.length; i++) {
            var cfg = cfgs[i];
            if (this.rankHonor >= cfg.value) {
                if (this.canHonorBoxIds.indexOf(cfg.id) == -1)
                    this.canHonorBoxIds.push(cfg.id);
            }
        }
    };
    /**判断当前个人累计荣誉奖励是否可以领取 */
    CrossModel.checkHonorBox = function (boxId) {
        // 可领取列表找不到 false
        if (this.canHonorBoxIds.indexOf(boxId) == -1)
            return false;
        // 领取列表找不到 true
        if (this.honorBoxIds.indexOf(boxId) == -1)
            return true;
        return false;
    };
    /**更新领取宝箱状态 */
    CrossModel.checkHonorBoxState = function (boxId) {
        if (this.honorBoxIds.indexOf(boxId) == -1)
            return false;
        return true;
    };
    /**奖励弹框显示 */
    CrossModel.receiveHonorBox = function (boxId) {
        var cfg = C.CrossServerRewardConfig[boxId];
        if (cfg)
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, cfg.reward);
    };
    /**获取已经领取的宝箱列表 */
    CrossModel.getDoneHonorBoxList = function () {
        return this.honorBoxIds;
    };
    /**检测累计荣誉奖励红点 */
    CrossModel.checkHonorBoxRedPoint = function () {
        if (this.rankHonor > 0) {
            if (this.canHonorBoxIds.length > this.honorBoxIds.length)
                return 1;
            return 0;
        }
        return 0;
    };
    /**获取奖励信息 */
    CrossModel.getCrossServerRewardConfig = function (type, value) {
        return C.CrossServerRewardConfigDic[type] ? C.CrossServerRewardConfigDic[type][value] : null;
    };
    /**根据type获取奖励配置表 */
    CrossModel.getCrossServerRewardConfigByType = function (type) {
        var cfgList = C.CrossServerRewardConfigDic[type];
        var res = [];
        for (var key in cfgList) {
            var cfg = cfgList[key];
            if (cfg)
                res.push(cfg);
        }
        SortTools.sortMap(res, "value", true);
        return res;
    };
    CrossModel.crossStatus = -1;
    /**==================================================================================================================================
    * 补兵 begin
    * ==================================================================================================================================
    */
    CrossModel.curTroop = 0;
    CrossModel.maxTroop = 0;
    CrossModel.bCrossServerDetailInit = false;
    CrossModel.warCityId = 0;
    CrossModel.wallStatus = 0; // 城门状态，0未开战，1开战
    CrossModel.cityInfo = {};
    CrossModel.canHonorBoxIds = []; // 可领取的宝箱列表
    return CrossModel;
}());
