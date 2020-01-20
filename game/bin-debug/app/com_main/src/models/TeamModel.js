var TeamModel = /** @class */ (function () {
    function TeamModel() {
    }
    TeamModel.init = function () {
        this.teamDic = {};
        this.teamTypeList = {};
        this.armyNumsDic = {};
        this.defTeamOrder = 0;
        this.otherTeamData = [];
        this.seatOpenLimit = ConstUtil.getNumArray(IConstEnum.UNLOCK_POSITION);
    };
    TeamModel.clear = function () {
        this.teamDic = null;
        this.teamTypeList = null;
    };
    /**设置大地图最大队伍数量 */
    TeamModel.setMaxTeamNum = function (maxNum) {
        this.TEAM_MAX_NUN = maxNum;
    };
    /**获得最大队伍数量 */
    TeamModel.getTeamMax = function (type) {
        if (type == 5 /* CROSS_SERVER */)
            return this.TEAM_MAX_CROSS_NUN;
        return this.TEAM_MAX_NUN;
    };
    /**解析队伍列表 */
    TeamModel.parseTeamList = function (body) {
        for (var i = 0; i < body.teamList.length; i++) {
            var data = body.teamList[i];
            if (!this.teamDic[data.teamType]) {
                this.teamDic[data.teamType] = {};
            }
            if (!this.teamDic[data.teamType][data.order]) {
                var teamVo = TeamVo.create();
                this.teamDic[data.teamType][data.order] = teamVo;
                teamVo.init(data);
                //列表存储y
                if (!this.teamTypeList[data.teamType]) {
                    this.teamTypeList[data.teamType] = [];
                }
                this.teamTypeList[data.teamType].push(teamVo);
            }
            else {
                this.teamDic[data.teamType][data.order].update(data);
            }
        }
        this.defTeamOrder = body.defaultTeamOrder;
        this.setOnBattleList();
    };
    TeamModel.parseOtherPlayerItem = function (body) {
        //取第一只
        var team;
        for (var index = 0; index < body.teamList.length; index++) {
            if (TeamModel.otherTeamid == body.teamList[index].id) {
                team = body.teamList[index];
                TeamModel.otherTeamid = 0;
                break;
            }
        }
        if (isNull(team))
            return;
        this.otherTeamData = [];
        var teamGeneralData = team.teamGeneralData.slice(0); //复制
        for (var index = 0; index < teamGeneralData.length; index++) {
            var data = teamGeneralData[index];
            var otherGenData = { generalId: data.generalId, level: data.generalLevel, star: data.generalStar };
            this.otherTeamData.push(otherGenData);
        }
    };
    TeamModel.getOtherTeamData = function () {
        return this.otherTeamData;
    };
    TeamModel.resetOtherTeamData = function () {
        this.otherTeamData = [];
    };
    /**重新设置上阵武将 */
    TeamModel.setOnBattleList = function () {
        var oldList = this.onBattleList;
        this.onBattleList = [];
        for (var key in this.teamTypeList) {
            var list = this.teamTypeList[key];
            for (var i = 0; i < list.length; i++) {
                this.addTeamGens(list[i], oldList);
            }
        }
        //移除旧武将红点
        if (oldList) {
            for (var i = 0; i < oldList.length; i++) {
                if (!this.isOnBattle(oldList[i]))
                    RedPointModel.removeGeneralInfo(oldList[i]);
            }
        }
    };
    /**添加上阵武将 */
    TeamModel.addTeamGens = function (teamVo, oldList) {
        //忽略历史武将 和 竞技场防守
        if (teamVo.teamType == 3 /* DEF_APK */ || teamVo.teamType == 4 /* HISTORY_WAR */)
            return;
        for (var i = 0; i < teamVo.teamGeneralData.length; i++) {
            var generalId = teamVo.teamGeneralData[i].generalId;
            if (generalId > 0 && this.onBattleList.indexOf(generalId) == -1) {
                this.onBattleList.push(generalId);
                if (!oldList || oldList.indexOf(generalId) == -1)
                    RedPointModel.addGeneralInfo(generalId);
            }
        }
    };
    /**是否上阵武将 */
    TeamModel.isOnBattle = function (generalId) {
        if (this.onBattleList && this.onBattleList.indexOf(generalId) >= 0)
            return true;
        return false;
    };
    /**根据部队类型获取是否上阵武将 */
    TeamModel.getTeamBattleByType = function (generalId, type) {
        var list = this.teamDic[type];
        if (!list)
            return false;
        for (var key in list) {
            var info = list[key];
            if (info && info.hasGeneralById(generalId)) {
                return true;
            }
        }
        return false;
    };
    TeamModel.cleanTeamByType = function (teamType) {
        var teamList = this.teamDic[teamType];
        for (var key in teamList) {
            var order = Number(key);
            var teamVo = teamList[order];
            if (unNull(teamVo)) {
                teamVo.teamGeneralData = [];
            }
        }
    };
    /**获得武将在指定类型的部队下标 */
    TeamModel.getGeneralTeamId = function (teamType, generalId, offOrder) {
        if (offOrder === void 0) { offOrder = -1; }
        var teamList = this.teamDic[teamType];
        for (var key in teamList) {
            var order = Number(key);
            //忽略指定 下标队伍
            if (order == offOrder)
                continue;
            var teamVo = teamList[order];
            if (unNull(teamVo) && teamVo.hasGeneralById(generalId)) {
                return order;
            }
        }
        return -1;
    };
    /**获得队伍信息 */
    TeamModel.getTeamVoByType = function (teamType, order) {
        if (order === void 0) { order = 0; }
        if (this.teamDic[teamType])
            return this.teamDic[teamType][order];
        return null;
    };
    /**获得队伍信息 */
    TeamModel.getTeamVoByTypeId = function (teamType, teamId) {
        if (teamId === void 0) { teamId = 0; }
        var list = this.teamDic[teamType];
        for (var key in list) {
            var vo = list[key];
            if (vo && vo.id == teamId) {
                return vo;
            }
        }
        return null;
    };
    /**
     * 根据城池获得队伍列表
     */
    TeamModel.getTeamVoListByCityId = function (cityId) {
        cityId = WorldModel.getXiangBirthMapCityId(cityId);
        var list = this.teamTypeList[1 /* WORLD */];
        var res = [];
        for (var i = 0; i < list.length; i++) {
            var vo = list[i];
            if (vo.cityId == cityId && !vo.isEmptyTeam()) {
                res.push(vo);
            }
        }
        return res;
    };
    TeamModel.getTeamMainHero = function (teamVo) {
        var teamGeneralData = teamVo.teamGeneralData;
        if (!teamGeneralData)
            return 0;
        var heroid = 0, fight = 0;
        for (var _i = 0, teamGeneralData_1 = teamGeneralData; _i < teamGeneralData_1.length; _i++) {
            var gid = teamGeneralData_1[_i];
            var hero = GeneralModel.getOwnGeneral(Number(gid.generalId));
            if (!hero)
                continue;
            if (heroid == 0) {
                heroid = hero.generalId;
                fight = hero.fight;
            }
            else if (hero.fight > fight) {
                heroid = hero.generalId;
            }
        }
        return heroid;
    };
    /**获取可上阵武将列表 */
    TeamModel.getCanUpGeneralList = function (teamType, order, nationLimit, typeLimit) {
        if (order === void 0) { order = 0; }
        if (nationLimit === void 0) { nationLimit = []; }
        if (typeLimit === void 0) { typeLimit = []; }
        var list = [];
        var voList = this.teamTypeList[teamType];
        var generalList = GeneralModel.getOwnGeneralWithSortFight();
        for (var i = 0; i < generalList.length; i++) {
            var inPut = true;
            var genVo = generalList[i];
            //如果是历史战役要过滤一下
            if (teamType == 4 /* HISTORY_WAR */ && (nationLimit.indexOf(genVo.config.nationType) != -1 || typeLimit.indexOf(genVo.config.armyType) != -1))
                continue;
            //过滤 非本队伍的上阵武将
            for (var k = 0; k < voList.length; k++) {
                var vo = voList[k];
                if (vo.order != order && vo.hasGeneralById(genVo.generalId)) {
                    inPut = false;
                    break;
                }
            }
            if (inPut) {
                list.push(genVo);
            }
        }
        var curVo = voList[order];
        list.sort(function (a, b) {
            var aId = curVo.hasGeneralById(a.generalId) ? 0 : 1;
            var bId = curVo.hasGeneralById(b.generalId) ? 0 : 1;
            return aId - bId;
        });
        return list;
    };
    /**
     * 获取前排可上阵队伍
     */
    TeamModel.getCanUpGeneralFrontList = function (teamType, order, nationLimit, typeLimit) {
        if (order === void 0) { order = 0; }
        if (nationLimit === void 0) { nationLimit = []; }
        if (typeLimit === void 0) { typeLimit = []; }
        var list = [];
        var voList = this.teamTypeList[teamType];
        var generalList = GeneralModel.getOwnGeneralWithSortFight();
        for (var i = 0; i < generalList.length; i++) {
            var inPut = true;
            var genVo = generalList[i];
            if (genVo.config.armyType == SoldierMainType.ARROWSOLDIER)
                continue;
            //如果是历史战役要过滤一下
            if (teamType == 4 /* HISTORY_WAR */ && (nationLimit.indexOf(genVo.config.nationType) != -1 || typeLimit.indexOf(genVo.config.armyType) != -1))
                continue;
            //过滤 非本队伍的上阵武将
            for (var k = 0; k < voList.length; k++) {
                var vo = voList[k];
                if (vo.order != order && vo.hasGeneralById(genVo.generalId)) {
                    inPut = false;
                    break;
                }
            }
            if (inPut) {
                list.push(genVo);
            }
        }
        var curVo = voList[order];
        list.sort(function (a, b) {
            var aId = curVo.hasGeneralById(a.generalId) ? 0 : 1;
            var bId = curVo.hasGeneralById(b.generalId) ? 0 : 1;
            if (a.fight != b.fight) {
                return b.fight - a.fight;
            }
            else {
                return aId - bId;
            }
        });
        return list;
    };
    /**
     * 获取后排武将
     */
    TeamModel.getCanUpGeneralBackList = function (teamType, order, nationLimit, typeLimit) {
        if (order === void 0) { order = 0; }
        if (nationLimit === void 0) { nationLimit = []; }
        if (typeLimit === void 0) { typeLimit = []; }
        var list = [];
        var voList = this.teamTypeList[teamType];
        var generalList = GeneralModel.getOwnGeneralWithSortFight();
        for (var i = 0; i < generalList.length; i++) {
            var inPut = true;
            var genVo = generalList[i];
            if (genVo.config.armyType != SoldierMainType.ARROWSOLDIER)
                continue;
            //如果是历史战役要过滤一下
            if (teamType == 4 /* HISTORY_WAR */ && (nationLimit.indexOf(genVo.config.nationType) != -1 || typeLimit.indexOf(genVo.config.armyType) != -1))
                continue;
            //过滤 非本队伍的上阵武将
            for (var k = 0; k < voList.length; k++) {
                var vo = voList[k];
                if (vo.order != order && vo.hasGeneralById(genVo.generalId)) {
                    inPut = false;
                    break;
                }
            }
            if (inPut) {
                list.push(genVo);
            }
        }
        var curVo = voList[order];
        list.sort(function (a, b) {
            var aId = curVo.hasGeneralById(a.generalId) ? 0 : 1;
            var bId = curVo.hasGeneralById(b.generalId) ? 0 : 1;
            if (a.fight != b.fight) {
                return b.fight - a.fight;
            }
            else {
                return aId - bId;
            }
        });
        return list;
    };
    /**部队数量开启等级 */
    TeamModel.getLastOpenTeamLev = function () {
        var openLevList = ConstUtil.getNumArray(IConstEnum.PLAYER_LEVEL_WORLD_MAP_TEAM);
        if (isNull(openLevList))
            return 0;
        var len = openLevList.length;
        for (var index = 0; index < len; index++) {
            if (openLevList[index] > RoleData.level)
                return openLevList[index];
        }
        return 0;
    };
    /**
   * @param gid 武将id
   * @param pos 所在位置  -1 为下阵 其他位置(0-4) 为上阵 或更变位置
   */
    TeamModel.setTmpTeamGeneralData = function (tmpData, gid, pos) {
        //过滤
        if (pos >= 0) {
            var data = tmpData[pos];
            if (data.generalId == gid) {
                //阵型没有任何变动 发送事件 恢复给隐藏的上阵英雄
                com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, [gid]);
                return;
            }
        }
        //更改队列
        var changeIds = [];
        changeIds.push(gid);
        //下阵
        var oldPos = -1;
        for (var i = 0; i < tmpData.length; i++) {
            var data = tmpData[i];
            if (data.generalId == gid) {
                data.generalId = 0;
                oldPos = i;
            }
        }
        if (pos >= 0) {
            var data = tmpData[pos];
            //新位置有武将
            if (data.generalId > 0) {
                changeIds.push(data.generalId);
                //存在旧位置 交换位置
                if (oldPos >= 0) {
                    var oldData = tmpData[oldPos];
                    oldData.generalId = data.generalId;
                }
            }
            data.generalId = gid;
        }
        com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, changeIds);
    };
    /**获得部队状态描述 */
    TeamModel.getStateDes = function (state) {
        switch (state) {
            case 0 /* IDLE */:
                return GCode(CLEnum.WOR_TEAM_KX);
            case 4 /* MOVE */:
                return GCode(CLEnum.WOR_TEAM_XJ);
            // case TeamState.COLLECT:
            //     return '采集中';
            case 1 /* QUEQUIE */:
                return GCode(CLEnum.WOR_TEAM_GZPD);
            case 5 /* WAR */:
            case 2 /* WORLD_BATTLE */:
                return GCode(CLEnum.WOR_TEAM_GZZD);
            // case TeamState.BATTLE:
            //     return '战斗中';
        }
        return '';
    };
    /**是否是空队伍 */
    TeamModel.isEmptyTeamPVE = function () {
        var teamVo = this.getTeamVoByType(2 /* PVE */, this.defTeamOrder);
        return teamVo.isEmptyTeam();
    };
    /**是否是空队伍 */
    TeamModel.isEmptyTeamHistoryWar = function () {
        var teamVo = this.getTeamVoByType(4 /* HISTORY_WAR */, this.defTeamOrder);
        return teamVo.isEmptyTeam();
    };
    /**是否有空位置 */
    TeamModel.hasGenEmptyPos = function () {
        var teamVo = this.getTeamVoByType(2 /* PVE */, this.defTeamOrder);
        var genNum = GeneralModel.getOwnGeneralNum();
        var count = 0;
        var seatNum = 0;
        for (var i = 0; i < this.seatOpenLimit.length; i++) {
            if (RoleData.level >= this.seatOpenLimit[i]) {
                seatNum++;
            }
        }
        for (var i = 0; i < teamVo.teamGeneralData.length; i++) {
            if (teamVo.teamGeneralData[i].generalId > 0) {
                count++;
            }
        }
        //剩余武将 与剩余位置大于0
        if ((genNum - count) > 0 && (seatNum - count) > 0) {
            return true;
        }
        return false;
    };
    /**判断pve阵型红点 */
    TeamModel.hasPVEEmptyPos = function () {
        var teamVo = this.getTeamVoByType(2 /* PVE */, this.defTeamOrder);
        var pTmpTeamList = teamVo.cloneTeamGeneralData();
        //先判断前排
        var genVoFrontList = this.getCanUpGeneralFrontList(2 /* PVE */);
        if (this.checkPosGen(pTmpTeamList.slice(0, 3), true, genVoFrontList))
            return true;
        var genVoBackList = this.getCanUpGeneralBackList(2 /* PVE */);
        if (this.checkPosGen(pTmpTeamList.slice(3), false, genVoBackList))
            return true;
        return false;
    };
    //检查武将在合适的位置上
    TeamModel.checkPosGen = function (teamGeListData, isFront, genVoList) {
        if (isFront === void 0) { isFront = true; }
        if (isNull(genVoList) || genVoList.length == 0)
            return false;
        var i = isFront ? 0 : 3;
        var len = isFront ? 3 : 2;
        var end = isFront ? 3 : 5;
        var genIdList = [];
        var minLen = Math.min(genVoList.length, len);
        var tempVoList = genVoList.splice(0, minLen);
        tempVoList.forEach(function (v, i, a) {
            genIdList.push(v.generalId);
        });
        for (; i < end; i++) {
            if (RoleData.level >= this.seatOpenLimit[i]) {
                //如果这个位置没有武将//这个位置已经有武将了但是不是前三
                var teamGenData = teamGeListData[i];
                if (isNull(teamGenData) || genIdList.indexOf(teamGenData.generalId) == -1) {
                    //有没有符合条件的空位武将给他
                    if (this.checkEmptyGen(teamGeListData, i, genIdList))
                        return true;
                    continue;
                }
            }
        }
        return false;
    };
    //检查符合条件的空位武将
    TeamModel.checkEmptyGen = function (teamGeListData, curPos, genIdList) {
        if (curPos === void 0) { curPos = 0; }
        var pos = 0;
        for (var index = 0, len = teamGeListData.length; index < len; index++) {
            if (index == curPos)
                continue;
            if (RoleData.level < this.seatOpenLimit[index])
                continue;
            var teamGenData = teamGeListData[index];
            if (unNull(teamGenData) && genIdList.indexOf(teamGenData.generalId) != -1)
                pos++;
        }
        //判断占的坑小于武将数
        return pos < genIdList.length;
    };
    /* */
    /**=====================================================================================
     * 练兵营 begin
     * =====================================================================================
     */
    /**已招募士兵 */
    TeamModel.parseTroopsInfo = function (body) {
        if (body) {
            for (var i = 0; i < body.armys.length; i++) {
                var data = body.armys[i];
                this.armyNumsDic[data.armyType] = data;
                com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, data.armyType);
            }
        }
    };
    /**获得练兵结构 */
    TeamModel.getTroopsInfo = function (type) {
        return this.armyNumsDic[type];
    };
    /**获得兵种进阶加成 */
    TeamModel.getSoldierGradeAdd = function (type, level) {
        var cfg = this.getArmyProgressConfig(type, level - 1);
        var curCfg = this.getArmyProgressConfig(type, level);
        if (!cfg || !curCfg)
            return null;
        var atts = StringUtils.keyValsToNumber(cfg.attribute);
        var curAtts = StringUtils.keyValsToNumber(curCfg.attribute);
        var res = [];
        res.push(GCodeFromat(CLEnum.LEVEL_ADD, 1));
        for (var key in curAtts) {
            var val = atts[key] || 0;
            val = curAtts[key] - val;
            res.push(Utils.getAttriFormat({ key: Number(key), value: val }));
        }
        res.push(GCodeFromat(CLEnum.FIGHT_ADD, curCfg.score));
        return res;
    };
    /**判断某兵种可否招募 */
    TeamModel.isCanTrain = function (armsType) {
        var data = this.armyNumsDic[armsType];
        var buildId = MainMapModel.getBuildInfoBySolider(armsType).id;
        var cfg = MainMapModel.getBuildingTrainCfgbyBuildId(buildId);
        /**达不到招募条件 */
        if (!cfg) {
            return false;
        }
        var army = MainMapModel.getTrainArmyVoById(buildId);
        var isTraning = false;
        if (army) {
            var remainTime = army.endTime - TimerUtils.getServerTime() - army.speedTime;
            if (remainTime > 0)
                isTraning = true;
        }
        if (isTraning)
            return false; //招募中
        if (data.num >= cfg.storagelimit)
            return false; //达到最大数
        var traninData = Utils.parseCommonItemJson(cfg.consumes);
        for (var i = 0; i < traninData.length; i++) {
            var info = new com_main.LvUpConditionsBaseInfo(traninData[i].itemId, traninData[i].count * 1);
            if (!info.getIsCan())
                return false; //材料不足
        }
        return true;
    };
    /**判断某兵种可否升阶 */
    TeamModel.isCanUpgrade = function (armsType) {
        var level = this.getTroopsInfo(armsType).level;
        var armyProgressConfig = C.ArmyProgressConfigDic[armsType][level];
        var nextArmyProgressConfig = C.ArmyProgressConfigDic[armsType][level + 1];
        if (!nextArmyProgressConfig)
            return false; //已达到最高级
        var maxLv = MainMapModel.getSoliderBuildLvByType(armsType) + 10;
        if (level >= maxLv)
            return false; //超过建筑10级
        var consume = Utils.parseCommonItemJson(armyProgressConfig.coumses);
        if (!PropModel.isItemListEnough(consume))
            return false;
        return true;
    };
    TeamModel.checkCanTrain = function (armsType) {
        if (!FunctionModel.isFunctionOpen(FunctionType.ARMEY))
            return;
        //列表
        if (isNull(armsType)) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.isCanTrain(this.list[i]))
                    return true;
            }
        }
        //单个选项
        else {
            if (this.isCanTrain(armsType))
                return true;
        }
        return false;
    };
    TeamModel.checkCanUpgrade = function (armsType) {
        if (!FunctionModel.isFunctionOpen(FunctionType.ARMEY))
            return;
        //列表
        if (isNull(armsType)) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.isCanUpgrade(this.list[i]))
                    return true;
            }
        }
        //单个选项
        else {
            if (this.isCanUpgrade(armsType))
                return true;
        }
        return false;
    };
    /**
     * 获得兵阶配置表
     * @param mainType 兵种类型
     * @param gradeLv 进阶等级
     *  */
    TeamModel.getArmyProgressConfig = function (mainType, gradeLv) {
        return C.ArmyProgressConfigDic[mainType][gradeLv];
    };
    /**=====================================================================================
     * 练兵营 end
     * =====================================================================================
     */
    /**大地图解锁 */
    TeamModel.getTeamOpenTips = function () {
        var openLv = TeamModel.getLastOpenTeamLev();
        var vipLv = VipModel.getVipPrivileUp(RoleData.vipLevel, VipPrivillType.MAP_EXTRA_TEAM);
        if (vipLv == 0) {
            return GCodeFromat(CLEnum.WOR_TEAM_JSTS2, openLv);
        }
        if (openLv == 0) {
            return platform.isHidePayFunc() ? '' : GCodeFromat(CLEnum.WOR_TEAM_JSTS1, vipLv);
        }
        if (vipLv > 0 && openLv > 0) {
            return platform.isHidePayFunc() ? '' : GCodeFromat(CLEnum.WOR_TEAM_JSTS, openLv, vipLv);
        }
        return '';
    };
    /**状态判断 */
    TeamModel.isWar = function (state) {
        switch (state) {
            case 1 /* QUEQUIE */:
            case 5 /* WAR */:
            case 2 /* WORLD_BATTLE */:
                return true;
        }
        return false;
    };
    TeamModel.TEAM_MAX_NUN = 2; //大地图最大队伍数
    TeamModel.TEAM_MAX_CROSS_NUN = 2; //跨服战最大队伍数
    TeamModel.isUpdateTeam = false;
    TeamModel.isNeedTroopTips = false;
    TeamModel.oTherPlayerId = 0; //查看目标玩家信息的id；
    TeamModel.otherTeamid = 0; //其他玩家的队伍team
    TeamModel.list = [SoldierMainType.FOOTSOLDIER, SoldierMainType.RIDESOLDIER, SoldierMainType.ARROWSOLDIER];
    return TeamModel;
}());
