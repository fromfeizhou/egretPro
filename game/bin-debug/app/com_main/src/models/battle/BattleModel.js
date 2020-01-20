/** 战场数据管理 */
var BattleModel = /** @class */ (function () {
    function BattleModel() {
    }
    BattleModel.init = function () {
        this.units = [];
        this.battleInfos = [];
        this.joinedBattleId = 0;
        this.mapId = 0;
        this.atkAllMaxBlood = 0;
        this.defAllMaxBlood = 0;
        this.atkBlood = -1;
        this.defBlood = -1;
        this.isStopPlay = false;
        this.isObserver = false;
        this.isQuene = false;
        this.siegeInfo = null;
        this.m_generalDieList = [];
        this.m_generalDieList[FactionType.ATK] = [];
        this.m_generalDieList[FactionType.DEF] = [];
        this.m_isPlayGeneralDieList = [];
        this.m_isPlayGeneralDieList[FactionType.ATK] = false;
        this.m_isPlayGeneralDieList[FactionType.DEF] = false;
        // this.warAutoList = [];
        this.m_playerInfoList = [];
        this.m_soldierDieList = [];
        this.m_buffList = [];
        this.m_isGuideBattle = false;
        this.m_allSoldierType = [];
        this.m_posInfo = [];
        this.m_posInfo[FactionType.ATK] = [];
        this.m_posInfo[FactionType.DEF] = [];
        this.m_modelList = [];
    };
    BattleModel.clear = function () {
        if (this.alreadyDestroy) {
            this.alreadyDestroy = false;
            return;
        }
        debug("BattleModel:clear-------->>");
        this.clearJoin();
        this.init();
    };
    /**清除当前玩家集结信息 */
    BattleModel.clearJoin = function () {
        BattleModel.setJoinedBattleId(0);
        this.isObserver = false;
        this.isQuene = false;
        this.siegeInfo = null;
    };
    /**设置当前玩家正在参与的战斗id */
    BattleModel.setJoinedBattleId = function (id) {
        debug("BattleModel:setJoinedBattleId--->>", id);
        this.joinedBattleId = id || 0;
        if (this.battleInfos[this.joinedBattleId]) {
            // com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_CHECK_LEVELID,this.battleInfos[this.joinedBattleId].checkPointId);
        }
    };
    //获取当前玩家正在参与的战斗id(表id)
    // public static getJoinedBattleCfgId(){
    // 	if(this.battleInfos[this.joinedBattleId]){
    // 		return this.battleInfos[this.joinedBattleId].checkPointId;
    // 	}else{
    // 		return -1;
    // 	}
    // }
    /**
     * 获取当前玩家正在参与的战斗id
     */
    BattleModel.getJoinedBattleId = function () {
        return this.joinedBattleId;
    };
    /**
     * 获取当前玩家正在参与的战斗信息
     */
    BattleModel.getJoinedBattleInfo = function () {
        if (!this.battleInfos || !this.joinedBattleId) {
            return null;
        }
        return this.battleInfos[this.joinedBattleId];
    };
    /**
     * 获取所有战斗信息
     */
    BattleModel.getBattleInfos = function () {
        return this.battleInfos;
    };
    /**
     * 添加战斗信息
     */
    BattleModel.addBattleInfo = function (info) {
        this.battleInfos[info.battleId] = info;
        // this.setOwnFaction();
    };
    /**
     * 移除战斗信息
     */
    BattleModel.removeBattleInfo = function (battleid) {
        var info = this.getBattleInfo(battleid);
        if (info)
            info.onDestroy();
        this.battleInfos[battleid] = null;
        delete this.battleInfos[battleid];
    };
    /**
     * 获取战斗信息
     */
    BattleModel.getBattleInfo = function (battleid) {
        if (isNull(battleid)) {
            battleid = this.getJoinedBattleId();
        }
        return this.battleInfos[battleid];
    };
    // public static getCheckPointID(battleid?: number): number {
    // 	let battleinfo: BattleInfoVo = this.getBattleInfo(battleid);
    // 	if (battleinfo) return battleinfo.checkPointId;
    // 	return 0;
    // }
    /**战斗是否已经开始了 做3秒钟兼容处理*/
    BattleModel.getIsAleardyCurBattle = function () {
        var battleInfo = BattleModel.getJoinedBattleInfo();
        return battleInfo ? battleInfo.continueTime >= 3 : true;
    };
    /**获取战斗关卡类型 */
    BattleModel.getCheckPointType = function (battleid) {
        var battleVo = this.getBattleInfo(battleid);
        if (battleVo) {
            return battleVo.warType;
        }
        else {
            return CheckPointType.CITY_WAR;
        }
    };
    /**当前战场是否攻城战 */
    BattleModel.isCityWar = function () {
        var boo = BattleModel.getCheckPointType() == CheckPointType.NEW_CITY_WAR || BattleModel.getCheckPointType() == CheckPointType.CROSS_SERVER;
        return boo;
    };
    /**战场地图 */
    BattleModel.getMapId = function () {
        return this.mapId;
    };
    /**战场地图 */
    BattleModel.setMapId = function (id) {
        this.mapId = id;
        debug('BattleModel:setMapId-------->>', id);
    };
    /**战场单位 UnitInfo  */
    BattleModel.getUnits = function () {
        return this.units;
    };
    // /**自动战斗  */
    // public static setAutoUseSkill(isAuto) {
    // 	this.isAutoUseSkill = isAuto;
    // }
    // /**自动战斗  */
    // public static getAutoUseSkill() {
    // 	return this.isAutoUseSkill;
    // }
    // /**是否观战  */
    // public static setIsObserve(isBserve) {
    // 	this.isObserver = isBserve;
    // }
    BattleModel.getIsObserve = function () {
        if (this.joinedBattleId == 0) {
            return false;
        }
        else if (this.getPlayerName(FactionType.ATK) != RoleData.nickName && this.getPlayerName(FactionType.DEF) != RoleData.nickName) {
            return true;
        }
        else {
            return false;
        }
    };
    //zb
    BattleModel.addUnit = function (unit) {
        debugBatt('BattleModel:addUnit-------->>', unit.elementId, this.getTypeName(unit.type), "  武将名字=", unit.generalName, "  hp=", unit.getHp(), "hp上限:", unit.getMaxHp());
        this.units[unit.elementId] = unit;
        // if (unit.faction == FactionType.ATK) {
        // 	// this.atkAllBlood += unit.getHp();
        // 	this.atkAllMaxBlood += unit.getMaxHp();
        // } else if (unit.faction == FactionType.DEF) {
        // 	// this.defAllBlood += unit.getHp();
        // 	this.defAllMaxBlood += unit.getMaxHp();
        // }
    };
    /**获取 某种类型的 战场单位 UnitInfo  */
    BattleModel.getUnitListType = function (type, faction) {
        var unitList = [];
        for (var i in this.units) {
            var unit = this.units[i];
            if (unit.type == type) {
                if (unit.faction && unit.faction == faction) {
                    unitList.push(unit);
                }
                else if (!faction) {
                    unitList.push(unit);
                }
            }
        }
        return unitList;
    };
    BattleModel.removeUnit = function (unitid) {
        var vo = this.getUnit(unitid);
        if (vo) {
            // if (Utils.isGeneral(vo.type)) {
            // 	com_main.EventMgr.dispatchEvent(UnitNav.SQUARE_REMOVE, vo);
            // 	debug('BattleModel:removeUnit-------->> SQUARE_REMOVE uid:', unitid);
            // } else if (Utils.isBuild(vo.type)) {
            // 	debug('BattleModel:removeUnit-------->> 删除建筑数据', unitid);
            // } else {
            // 	debug('BattleModel:removeUnit-------->>', unitid);
            // }
            this.units[unitid] = null;
            delete this.units[unitid];
        }
    };
    /**id 可为空 */
    BattleModel.getUnit = function (id, type) {
        // if (!this.units) return null;
        if (type != undefined) {
            for (var key in this.units) {
                if (this.units.hasOwnProperty(key)) {
                    var unitvo = this.units[key];
                    if (unitvo.type == type) {
                        if (id != undefined) {
                            if (unitvo.elementId == id)
                                return unitvo;
                        }
                        else {
                            return unitvo;
                        }
                    }
                }
            }
        }
        return this.units[id];
    };
    /**根据战斗单位类型获取战斗单位 */
    BattleModel.getUnitsByType = function (type) {
        var datas = [];
        if (!this.units)
            return datas;
        for (var key in this.units) {
            if (this.units.hasOwnProperty(key)) {
                var unitvo = this.units[key];
                if (unitvo.type == type) {
                    datas.push(unitvo);
                }
            }
        }
        return datas;
    };
    /**根据id,faction获取unit*/
    BattleModel.getUnitByFaction = function (id, faction) {
        var unit = this.getUnit(id);
        if (unit)
            return unit.faction == faction ? unit : null;
        return null;
    };
    /**根据faction获取unit*/
    BattleModel.getUnitsByFaction = function (faction) {
        var units = [];
        for (var key in this.units) {
            if (this.units.hasOwnProperty(key)) {
                var unitvo = this.units[key];
                if (unitvo.faction == faction) {
                    units.push(unitvo);
                }
            }
        }
        return units;
    };
    /**攻城战矫正血量 */
    BattleModel.setLastHp = function (battleid, atkHp, defHp) {
        if (battleid == this.getJoinedBattleId()) {
            this.atkBlood = atkHp;
            this.defBlood = defHp;
        }
    };
    BattleModel.setAtkAllMaxBlood = function (maxHp) {
        this.atkAllMaxBlood = maxHp;
    };
    BattleModel.getAtkAllMaxBlood = function () {
        return this.atkAllMaxBlood;
    };
    BattleModel.getAtkAllBlood = function () {
        if (this.atkBlood > -1) {
            return this.atkBlood;
        }
        var blood = 0;
        for (var i in this.units) {
            var unit = this.units[i];
            if (unit.faction == FactionType.ATK) {
                blood += unit.getHp();
            }
        }
        return blood;
    };
    BattleModel.setDefAllMaxBlood = function (maxHp) {
        this.defAllMaxBlood = maxHp;
    };
    BattleModel.getDefAllMaxBlood = function () {
        return this.defAllMaxBlood;
    };
    BattleModel.getDefAllBloodd = function () {
        if (this.defBlood > -1) {
            return this.defBlood;
        }
        var blood = 0;
        for (var i in this.units) {
            var unit = this.units[i];
            if (unit.faction == FactionType.DEF) {
                blood += unit.getHp();
            }
        }
        return blood;
    };
    BattleModel.setIsStopPlay = function (bool) {
        this.isStopPlay = bool;
    };
    BattleModel.getIsStopPlay = function () {
        return this.isStopPlay;
    };
    // public static setBattleStartTime(time: number) {
    // 	this.battleStartTime = time;
    // }
    // public static getBattleStartTime() {
    // 	return this.battleStartTime;
    // }
    BattleModel.addGeneralDie = function (faction, roleId) {
        this.m_generalDieList[faction].push(roleId);
        this.playGeneralDie(faction);
    };
    BattleModel.playGeneralDieComplete = function (faction) {
        this.m_isPlayGeneralDieList[faction] = false;
        this.m_generalDieList[faction].splice(0, 1);
        this.playGeneralDie(faction);
    };
    BattleModel.playGeneralDie = function (faction) {
        if (!this.m_isPlayGeneralDieList[faction] && this.m_generalDieList[faction].length > 0) {
            this.m_isPlayGeneralDieList[faction] = true;
            com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_PLAY_GENGERAL_DIE, { faction: faction, roleId: this.m_generalDieList[faction][0] });
        }
    };
    BattleModel.getUnitNameUnitId = function (unitId) {
        var unitInfoVo = BattleModel.getUnit(unitId);
        if (!unitInfoVo) {
            error("获取不到单位 unitInfoVo ~~~~~~~~~~~~~", unitId);
            return;
        }
        var name = "";
        if (unitInfoVo.type == UnitType.BUILDING_BARTIZAN) {
            name = GCode(CLEnum.WAR_BARTIZAN);
        }
        else if (unitInfoVo.type == UnitType.BUILDING_WALL) {
            name = GCode(CLEnum.WAR_WALL);
        }
        else {
        }
        return name;
    };
    BattleModel.getTypeName = function (type) {
        var name = "";
        if (type == UnitType.BUILDING_BARTIZAN) {
            name = GCode(CLEnum.WAR_BARTIZAN);
        }
        else if (type == UnitType.BUILDING_WALL) {
            name = GCode(CLEnum.WAR_WALL);
        }
        else if (type == UnitType.GENERAL) {
            name = GCode(CLEnum.WAR_GEN);
        }
        else if (type == UnitType.SOLDIER) {
            name = GCode(CLEnum.WAR_SOLDIER);
        }
        else if (type == UnitType.ZHAO_HUAN_WU) {
            name = GCode(CLEnum.WAR_ZHW);
        }
        return name;
    };
    /**初始化自动战斗 */
    BattleModel.setWarAutoList = function (body) {
        var list = body.list;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var state = list_1[_i];
            this.warAutoList[state.warType] = state.autoState;
        }
        for (var i in C.WarTypeConfig) {
            var config = C.WarTypeConfig[i];
            var id = config["id"];
            if (isNull(this.warAutoList[id])) {
                this.warAutoList[id] = config["initAuto"];
            }
        }
    };
    BattleModel.getAutoState = function () {
        var battleType = this.getCheckPointType(this.joinedBattleId);
        return this.warAutoList[battleType];
    };
    BattleModel.setAutoState = function (autoState) {
        var battleType = this.getCheckPointType(this.joinedBattleId);
        this.warAutoList[battleType] = autoState;
    };
    BattleModel.setPlayerName = function (info) {
        this.m_playerInfoList[info.attOrDef] = info;
    };
    BattleModel.getPlayerName = function (faction) {
        var name = '';
        this.m_playerInfoList[faction] ? name = this.m_playerInfoList[faction].name : name = '';
        return name;
    };
    BattleModel.getBelongTypeById = function (elementId) {
        var unit = this.getUnit(elementId);
        if (!unit) {
            return BelongType.OWN;
        }
        return BattleModel.getBelongTypeByFaction(unit.faction);
    };
    BattleModel.getBelongTypeByFaction = function (faction) {
        if (this.getCheckPointType() == CheckPointType.GM) {
            if (faction == FactionType.ATK) {
                return BelongType.OWN;
            }
            else {
                return BelongType.ENEMY;
            }
        }
        var playerInfo = this.m_playerInfoList[faction];
        if (!playerInfo) {
            return BelongType.OWN;
        }
        if (playerInfo.name == RoleData.nickName) {
            return BelongType.OWN;
        }
        else {
            if (BattleModel.getCheckPointType() == CheckPointType.NEW_CITY_WAR) {
                if (playerInfo.country == RoleData.countryId) {
                    return BelongType.OWN;
                }
            }
            return BelongType.ENEMY;
        }
    };
    //逃跑士兵
    BattleModel.addSoldierDie = function (id) {
        this.m_soldierDieList.push(id);
    };
    BattleModel.isSoldierDie = function (id) {
        for (var _i = 0, _a = this.m_soldierDieList; _i < _a.length; _i++) {
            var dieId = _a[_i];
            if (id === dieId) {
                return true;
            }
        }
        return false;
    };
    BattleModel.addBuff = function (buffData) {
        this.m_buffList[buffData.buffId] = buffData;
    };
    BattleModel.getBuff = function (id) {
        return this.m_buffList[id];
    };
    BattleModel.addSoldierType = function (type) {
        var isExist = false;
        for (var _i = 0, _a = this.m_allSoldierType; _i < _a.length; _i++) {
            var t = _a[_i];
            if (type == t)
                isExist = true;
        }
        if (!isExist)
            this.m_allSoldierType.push(type);
    };
    BattleModel.getSoldierType = function () {
        return this.m_allSoldierType;
    };
    /**获取战斗预加载资源列表 */
    BattleModel.getPreDownload = function () {
        var group = [];
        var modelList = [];
        for (var i in this.units) {
            var unit = this.units[i];
            if (unit.type == UnitType.GENERAL && unit.belongType == BelongType.OWN) {
                var generalConfig = C.GeneralConfig[unit.generalId];
                if (generalConfig) {
                    var skillid = Number(generalConfig.angerSkill.split("_")[0]);
                    ;
                    var skillRes = C.ShowSkillEffectConfig[C.SkillConfig[skillid].skillEffectId].animation;
                    if (group.indexOf(skillRes) == -1) {
                        group.push(skillRes);
                    }
                }
            }
            if (unit.generalModelId && modelList.indexOf(unit.generalModelId) == -1) {
                modelList.push(unit.generalModelId);
            }
        }
        this.m_modelList = [];
        for (var _i = 0, modelList_1 = modelList; _i < modelList_1.length; _i++) {
            var modelId = modelList_1[_i];
            this.m_modelList.push('soldier_' + modelId + '_png');
            this.m_modelList.push('soldier_' + modelId + '_json');
        }
        var modelResGroup = RES.createGroup('modelId', this.m_modelList, true);
        group.push('modelId');
        return group;
    };
    Object.defineProperty(BattleModel, "isReConnectBattle", {
        get: function () {
            return this.m_isReConnectBattle;
        },
        //是否进行战斗重连
        set: function (bool) {
            this.m_isReConnectBattle = bool;
        },
        enumerable: true,
        configurable: true
    });
    BattleModel.setPosInfo = function (fT, pos, gt, gId) {
        this.m_posInfo[fT][pos] = [gt, gId];
    };
    // 获取克制关系
    BattleModel.getKZ = function (pos) {
        if (!this.m_posInfo[FactionType.ATK][pos])
            return;
        if (!this.m_posInfo[FactionType.DEF][pos])
            return;
        var tA = this.m_posInfo[FactionType.ATK][pos][0];
        var tD = this.m_posInfo[FactionType.DEF][pos][0];
        if (tA && tD) {
            if ((tA == SoldierMainType.FOOTSOLDIER && tD == SoldierMainType.PIKEMAN) ||
                (tA == SoldierMainType.PIKEMAN && tD == SoldierMainType.RIDESOLDIER) ||
                (tA == SoldierMainType.RIDESOLDIER && tD == SoldierMainType.FOOTSOLDIER)) {
                return 1;
            }
            if ((tA == SoldierMainType.FOOTSOLDIER && tD == SoldierMainType.RIDESOLDIER) ||
                (tA == SoldierMainType.PIKEMAN && tD == SoldierMainType.FOOTSOLDIER) ||
                (tA == SoldierMainType.RIDESOLDIER && tD == SoldierMainType.PIKEMAN)) {
                return 2;
            }
        }
    };
    // 获取克制关系
    BattleModel.getKZGen = function (pos) {
        var type = this.getKZ(pos);
        if (type) {
            return [type, this.m_posInfo[FactionType.ATK][pos][1]];
        }
        return [0, 0];
    };
    BattleModel.getModelList = function () {
        return this.m_modelList;
    };
    //退出跳转
    BattleModel.exitBattle = function (type) {
        SceneManager.runSceneBefore();
        var battleType = type;
        if (battleType == CheckPointType.ARENA) {
            //擂台
            Utils.open_view(TASK_UI.POP_ARENA_PANEL);
        }
        else if (battleType == CheckPointType.PK) {
            Utils.open_view(TASK_UI.POP_PVPARENA_PANEL);
        }
        else if (battleType == CheckPointType.CHECKPOINT) {
            HeadQuartersProxy.send_HQ_GET_INFO_OPEN_VIEW();
        }
        else if (battleType == CheckPointType.HISTORY_WAR) {
            Utils.open_view(TASK_UI.HISTORYWAR_MAIN_PANEL);
        }
        else if (battleType == CheckPointType.BOSS) {
            //BOSS
            BossProxy.C2S_GET_BOSS_OPEN_VIEW();
        }
        else if (battleType == CheckPointType.MATERIAL) {
            //材料副本
            if (MaterialModel.isSweep) {
                MaterialProxy.C2S_MATERIAL_INFO();
            }
            else {
                MaterialProxy.C2S_MATERIAL_INFO_OPEN();
            }
        }
    };
    BattleModel.exitWatchBattle = function (cityId) {
        //退出观战
        if (cityId) {
            WorldProxy.send_C2S_CITY_WAR_OUT(cityId);
        }
        BattleProxy.send_C2S_WAR_QUIT_BATTLE();
        SceneManager.runSceneBefore();
        // let conf: WorldMapConfig = C.WorldMapConfig[cityId];
        // if (BattleModel.isQuene) {
        // 	if (conf&&conf.mapId == SceneEnums.WORLD_XIANGYANG_CITY) {
        // 		WorldModel.gotoWorldScene(SceneEnums.WORLD_XIANGYANG_CITY);
        // 	} else {
        // 		WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY);
        // 	}
        // }
        // else {
        // 	let battleType: CheckPointType = BattleModel.getCheckPointType(BattleModel.getJoinedBattleId());
        // 	if (battleType == CheckPointType.NEW_CITY_WAR || battleType == CheckPointType.FIGHT_WILD || battleType == CheckPointType.CITY_VISIT || battleType == CheckPointType.UNLOCK_WAR) {
        // 		if (conf&&conf.mapId == SceneEnums.WORLD_XIANGYANG_CITY) {
        // 			WorldModel.gotoWorldScene(SceneEnums.WORLD_XIANGYANG_CITY);
        // 		} else {
        // 			WorldModel.gotoWorldScene(SceneEnums.WORLD_CITY);
        // 		}
        // 	} else {
        // 		// SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
        // 		SceneManager.runSceneBefore()
        // 	}
        // 	BattleProxy.send_C2S_WAR_QUIT_BATTLE();
        // }
    };
    BattleModel.challengeNext = function (battleType, curId) {
        if (battleType == CheckPointType.ARENA) {
            ArenaProxy.send_ENTER_ARENA_BATTLE(1);
            com_main.UpManager.history();
        }
        else if (battleType == CheckPointType.CHECKPOINT) {
            var nextId = HeadQuartersModel.getNextId(curId);
            if (nextId && HeadQuartersModel.canChallenges(nextId)) {
                HeadQuartersProxy.send_HQ_CHALLENGES(nextId, 1);
                com_main.UpManager.history();
            }
            else {
                EffectUtils.showTips('无法挑战下一关', 1, true);
                return;
            }
        }
    };
    //城池id
    BattleModel.cityId = 0;
    //是否排队
    BattleModel.isQuene = false;
    //战斗类型的自动状态
    BattleModel.warAutoList = [];
    return BattleModel;
}());
