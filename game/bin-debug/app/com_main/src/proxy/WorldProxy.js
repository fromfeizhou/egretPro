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
var WorldProxy = /** @class */ (function (_super_1) {
    __extends(WorldProxy, _super_1);
    function WorldProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    WorldProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.CITY_BATTLE_LOAD_WORLD_MAP, this, 'CityBattleLoadWorldMapReq', 'CityBattleLoadWorldMapResp'],
            [ProtoDef.CITY_BATTLE_EXIT_WORLD_MAP, this, 'CITY_BATTLE_EXIT_WORLD_MAP', ''],
        ];
    };
    WorldProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.S2C_CITY_UPDATE, this, 'S2C_CITY_UPDATE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GENERAL_VISIT, this, 'C2S_GENERAL_VISIT', ProxyEnum.SEND],
            [ProtoDef.S2C_GENERAL_VISIT, this, 'S2C_GENERAL_VISIT', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_VISIT_EVENT_UPDATE, this, 'S2C_VISIT_EVENT_UPDATE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAMMOVE_LIST, this, 'C2S_TEAMMOVE_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAMMOVE_LIST, this, 'S2C_TEAMMOVE_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAMMOVE_TO, this, 'C2S_TEAMMOVE_TO', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAMMOVE_TO, this, 'S2C_TEAMMOVE_TO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAMMOVE_QUICKEN, this, 'C2S_TEAMMOVE_QUICKEN', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAMMOVE_QUICKEN, this, 'S2C_TEAMMOVE_QUICKEN', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_TEAMMOVE_RETURN, this, 'C2S_TEAMMOVE_RETURN', ProxyEnum.SEND],
            [ProtoDef.S2C_TEAMMOVE_RETURN, this, 'S2C_TEAMMOVE_RETURN', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WORLDMAP_EVENT_ACT, this, 'C2S_WORLDMAP_EVENT_ACT', ProxyEnum.SEND],
            [ProtoDef.S2C_WORLDMAP_EVENT_ACT, this, 'S2C_WORLDMAP_EVENT_ACT', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WORLDMAP_EVENT_OVER, this, 'S2C_WORLDMAP_EVENT_OVER', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN, this, 'C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN', ProxyEnum.SEND],
            [ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN, this, 'S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_WAR_GO, this, 'C2S_CITY_WAR_GO', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_WAR_GO, this, 'S2C_CITY_WAR_GO', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CITY_ITEM_COUNT, this, 'S2C_CITY_ITEM_COUNT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_WAR_MYTEAM, this, 'C2S_CITY_WAR_MYTEAM', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_WAR_MYTEAM, this, 'S2C_CITY_WAR_MYTEAM', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_WAR_TEAM, this, 'C2S_CITY_WAR_TEAM', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_WAR_TEAM, this, 'S2C_CITY_WAR_TEAM', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_WAR_OUT, this, 'C2S_CITY_WAR_TEAM', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_WAR_OUT, this, 'S2C_CITY_WAR_OUT', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CITY_WAR_SINGLE_OVER, this, 'S2C_CITY_WAR_SINGLE_OVER', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_CITY_WAR_SETTLEMENT, this, 'S2C_CITY_WAR_SETTLEMENT', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_WAR_CONFRONTATION_LIST, this, 'C2S_CITY_WAR_CONFRONTATION_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_WAR_CONFRONTATION_LIST, this, 'S2C_CITY_WAR_CONFRONTATION_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_WAR_DMG_RANK, this, 'C2S_CITY_WAR_DMG_RANK', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_WAR_DMG_RANK, this, 'S2C_CITY_WAR_DMG_RANK', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_WATCH_WAR_TEAM, this, 'C2S_CITY_WATCH_WAR_TEAM', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_WATCH_WAR_TEAM, this, 'S2C_CITY_WATCH_WAR_TEAM', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WORLDMAP_INFORMATION, this, 'C2S_WORLDMAP_INFORMATION', ProxyEnum.SEND],
            [ProtoDef.S2C_WORLDMAP_INFORMATION, this, 'S2C_WORLDMAP_INFORMATION', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WORLDMAP_INFORMATION_MASS_NOTICE, this, 'S2C_WORLDMAP_INFORMATION_MASS_NOTICE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MILITARYMERITS_REWARD_INFO, this, 'C2S_MILITARYMERITS_REWARD_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_MILITARYMERITS_REWARD_INFO, this, 'S2C_MILITARYMERITS_REWARD_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MILITARYMERITS_REWARD_RECEIVE, this, 'C2S_MILITARYMERITS_REWARD_RECEIVE', ProxyEnum.SEND],
            [ProtoDef.S2C_MILITARYMERITS_REWARD_RECEIVE, this, 'S2C_MILITARYMERITS_REWARD_RECEIVE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER, this, 'S2C_WORLDMAP_EVENT_WAR_OVER', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GET_MAP_EVENT_DATA, this, 'C2S_GET_MAP_EVENT_DATA', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_MAP_EVENT_DATA, this, 'S2C_GET_MAP_EVENT_DATA', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_VISIT_DATA_REFRESH, this, 'C2S_VISIT_DATA_REFRESH', ProxyEnum.SEND],
            [ProtoDef.S2C_VISIT_DATA_REFRESH, this, 'S2C_VISIT_DATA_REFRESH', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_VISIT_CD_SPEED, this, 'C2S_VISIT_CD_SPEED', ProxyEnum.SEND],
            [ProtoDef.S2C_VISIT_CD_SPEED, this, 'S2C_VISIT_CD_SPEED', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_UNLOCK_CITY, this, 'C2S_UNLOCK_CITY', ProxyEnum.SEND],
            [ProtoDef.S2C_UNLOCK_CITY, this, 'S2C_UNLOCK_CITY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_MAP_EVENT_BUY, this, 'C2S_MAP_EVENT_BUY', ProxyEnum.SEND],
            [ProtoDef.S2C_MAP_EVENT_BUY, this, 'S2C_MAP_EVENT_BUY', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_CITY_ITEM_INFO, this, 'C2S_CITY_ITEM_INFO', ProxyEnum.SEND],
            [ProtoDef.S2C_CITY_ITEM_INFO, this, 'S2C_CITY_ITEM_INFO', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_TEAMMOVE_DEL, this, 'S2C_TEAMMOVE_DEL', ProxyEnum.RECEIVE],
        ];
    };
    WorldProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        debug("WorldProxy===protocol: " + protocol, body);
        switch (protocol) {
            case ProtoDef.CITY_BATTLE_LOAD_WORLD_MAP: {
                var data = body;
                WorldProxy.m_pVersion = data.version;
                WorldModel.worldLevel = data.wordLv;
                WorldModel.initCityBuildInfo(data.cityInfo);
                WorldModel.parseEventList(data.mapEventData, true);
                WorldModel.parseVisitEventList(data.visitEventData, true);
                WorldModel.initCityLockData(data.mapUnLock);
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_UPDATE, data.cityInfo);
                break;
            }
            case ProtoDef.S2C_CITY_UPDATE: { //城池状态更新 
                var data = body;
                WorldModel.initCityBuildInfo(data.cityInfo);
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_UPDATE, data.cityInfo);
                break;
            }
            case ProtoDef.S2C_MAP_EVENT_BUY: { //次数更新
                var data = body;
                if (data.state == 0)
                    EffectUtils.showTips(GCode(CLEnum.MAT_BUY_SUC));
                break;
            }
            case ProtoDef.S2C_VISIT_EVENT_UPDATE: { //拜访事件更新
                var data = body;
                if (data.state == 1) {
                    WorldModel.removeVisitEvent(data.visitEventData.cityId);
                }
                else {
                    WorldModel.updateVisitEvent(data.visitEventData);
                }
                break;
            }
            // case ProtoDef.S2C_TEAMMOVE_DEL: {   //删除行军路线
            //     let data = body as gameProto.S2C_TEAMMOVE_DEL;
            //      worldview 处理
            //     break;
            // }
            case ProtoDef.S2C_UNLOCK_CITY: { //城池解锁
                var data = body;
                var cityInfo = WorldModel.getCityBuildInfo(data.cityId);
                var taskUnlockCfg = C.WorldMapUnlockTaskConfig[cityInfo.unlockTaskId];
                var worldMapCfg = C.WorldMapConfig[data.cityId];
                var isVictory = data.errorCode == 0;
                if (data.errorCode == 0) {
                    WorldModel.updateCityLockState(data.cityId);
                    if (taskUnlockCfg.type == WorldLockTaskType.FIGHT) {
                        WorldModel.isUnlockFightFinish = true;
                    }
                    if (taskUnlockCfg.type == WorldLockTaskType.FIGHT) {
                        WorldModel.m_pInitMoveId = data.cityId;
                        WorldModel.unLockCid = data.cityId;
                        WorldModel.unLockTaskId = taskUnlockCfg.id;
                        if (FightResponseUtil.victory && GuideModel.doWarEndStep()) {
                            break;
                        }
                        Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: isVictory, rewards: Utils.parseCommonItemJson(worldMapCfg.unlockReward), battleType: CheckPointType.UNLOCK_WAR });
                        WorldModel.isFromUnLockFight = true;
                    }
                }
                else {
                    // EffectUtils.showTips("城池解锁失败")
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: isVictory, rewards: Utils.parseCommonItemJson(worldMapCfg.unlockReward), battleType: CheckPointType.UNLOCK_WAR });
                }
                break;
            }
            case ProtoDef.S2C_TEAMMOVE_LIST: { //移动队列
                var data = body;
                WorldModel.parseTeamMove(data.teamMoveDataResp, true);
                WorldModel.runScene();
                break;
            }
            case ProtoDef.S2C_CITY_ITEM_INFO: { //移动队列
                var data = body;
                WorldModel.parseTroop(data.defPlayerWarData);
                break;
            }
            case ProtoDef.S2C_TEAMMOVE_TO: { //移动回调
                var data = body;
                WorldModel.parseTeamMove(data.teamMoveDataResp);
                break;
            }
            case ProtoDef.S2C_TEAMMOVE_QUICKEN: { //加速
                var data = body;
                WorldModel.parseTeamMove([data.teamMoveDataResp]);
                break;
            }
            case ProtoDef.S2C_TEAMMOVE_RETURN: { //返回
                var data = body;
                WorldModel.parseTeamMove([data.teamMoveDataResp]);
                break;
            }
            case ProtoDef.S2C_WORLDMAP_EVENT_ACT: { //事件操作返回
                var data = body;
                if (data.state == 0) {
                    WorldModel.updateWorldEvent(data.mapEventData);
                }
                else if (data.state == 3802) {
                    EffectUtils.showTips("次数不够");
                }
                break;
            }
            case ProtoDef.S2C_WORLDMAP_EVENT_OVER: { //事件完成
                var data = body;
                break;
            }
            case ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN: { //采集加速
                var data = body;
                if (data.state == 0) {
                    WorldModel.updateWorldEvent(data.mapEventData);
                }
                break;
            }
            case ProtoDef.S2C_CITY_WAR_GO: { //进入城市战场
                var data = body;
                if (data.state == 0) {
                    WorldModel.setCityWarInfo(data);
                    WorldProxy.send_C2S_CITY_WAR_MYTEAM(data.cityId);
                }
                break;
            }
            case ProtoDef.S2C_CITY_ITEM_COUNT: {
                WorldModel.setCityItemCount(body);
                com_main.EventMgr.dispatchEvent(BattleEvent.CITY_ITEM_COUNT_UPDATE, null);
                break;
            }
            case ProtoDef.S2C_WORLDMAP_INFORMATION: { //警报
                var data = body;
                WorldModel.updateWarnInfomation(data);
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WARN_UPDATE, null);
                break;
            }
            case ProtoDef.S2C_WORLDMAP_INFORMATION_MASS_NOTICE: { //警报
                var data = body;
                WorldModel.updateWarnNotice(data);
                /**手动请求警报 */
                WorldProxy.C2S_WORLDMAP_INFORMATION(RoleData.countryId);
                break;
            }
            case ProtoDef.S2C_CITY_WAR_MYTEAM: {
                var data = body;
                var first = data.myTeamWar[0];
                if (!WorldModel.isInCityWar() || data.cityId != WorldModel.getCityWarInfo().cityId) {
                    WorldProxy.send_C2S_CITY_WAR_OUT(data.cityId);
                    return;
                }
                WorldModel.initCityWarMyteam(data);
                // 如果已经再观战
                for (var _i = 0, _a = data.myTeamWar; _i < _a.length; _i++) {
                    var myTeam = _a[_i];
                    if (myTeam.battleId && myTeam.battleId == BattleModel.getJoinedBattleId() && RoleData.playerId == WorldModel.m_watchPlayerId) {
                        return;
                    }
                }
                // 如果战斗结束 选择当前观看队伍的战斗观看
                for (var _b = 0, _c = data.myTeamWar; _b < _c.length; _b++) {
                    var myTeam = _c[_b];
                    if (RoleData.playerId == WorldModel.m_watchPlayerId && myTeam.teamId == WorldModel.m_watchTeamId) {
                        if (myTeam.battleId != 0) {
                            // BattleProxy.send_C2S_WAR_REENTRY_BATTLE(myTeam.battleId);
                            WorldModel.setCurWatchTeamId(RoleData.playerId, myTeam.teamId);
                            WorldProxy.send_C2S_CITY_WATCH_WAR_TEAM(WorldModel.getCityWarInfo().cityId, RoleData.playerId, myTeam.teamId);
                            return;
                        }
                    }
                }
                // 选择一场战斗进行观看
                for (var _d = 0, _e = data.myTeamWar; _d < _e.length; _d++) {
                    var myTeam = _e[_d];
                    if (myTeam.battleId != 0) {
                        // BattleProxy.send_C2S_WAR_REENTRY_BATTLE(myTeam.battleId);
                        WorldModel.setCurWatchTeamId(RoleData.playerId, myTeam.teamId);
                        WorldProxy.send_C2S_CITY_WATCH_WAR_TEAM(WorldModel.getCityWarInfo().cityId, RoleData.playerId, myTeam.teamId);
                        return;
                    }
                }
                if (first) {
                    //等待界面
                    if (SceneManager.getCurrScene() != SceneEnums.BATTLE_MAP) {
                        SceneManager.enterScene(SceneEnums.WAIT_BATTLE_MAP, { teamId: first.teamId });
                    }
                }
                else {
                    // 观战
                    // WorldProxy.send_C2S_CITY_WAR_CONFRONTATION_LIST(WorldModel.getCityWarInfo().cityId);
                    WorldProxy.send_C2S_CITY_WATCH_WAR_TEAM(WorldModel.getCityWarInfo().cityId, 0, 0);
                }
                break;
            }
            case ProtoDef.S2C_CITY_WAR_TEAM: {
                break;
            }
            case ProtoDef.S2C_CITY_WATCH_WAR_TEAM: {
                var data = body;
                if (data.state != 0) {
                    //观战中退出，有队伍的等待结算界面
                    if (!WorldModel.getIsHaveTeam()) {
                        SceneManager.runSceneBefore(SceneOperateEnums.WATCH_WORLD_BATTLE);
                        Utils.showErrorCode(data.state);
                    }
                    return;
                }
                BattleProxy.send_C2S_WAR_REENTRY_BATTLE(data.battleId);
                WorldModel.setCurWatchTeamId(data.playerId, data.teamId);
                break;
            }
            case ProtoDef.S2C_GET_MAP_EVENT_DATA: {
                var data = body;
                WorldModel.parseEventList(data.mapEventData, false, true);
                break;
            }
            case ProtoDef.S2C_CITY_WAR_OUT: {
                var data = body;
                if (data.state == 0 && WorldModel.getCityWarInfo() && WorldModel.getCityWarInfo().cityId == data.cityId) {
                    WorldModel.cleanCityWarInfo();
                }
                break;
            }
            case ProtoDef.S2C_VISIT_DATA_REFRESH: {
                var data = body;
                WorldModel.updateVisitEvent(data.visitEventData);
                break;
            }
            case ProtoDef.S2C_VISIT_CD_SPEED: {
                var data = body;
                WorldModel.updateVisitEvent(data.visitEventData);
                break;
            }
            case ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER: {
                var data = body;
                //结算
                FightResponseUtil.addResultCache(notification);
                break;
            }
            case ProtoDef.S2C_MILITARYMERITS_REWARD_INFO: {
                var data = body;
                WorldModel.updateExploitAward(data.receivedIds);
                break;
            }
            case ProtoDef.S2C_MILITARYMERITS_REWARD_RECEIVE: {
                var data = body;
                if (data.errorCode == 0) {
                    WorldModel.updateExploitAward([data.id]);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.WOR_BAT_GET_FAL));
                }
                break;
            }
            case ProtoDef.S2C_CITY_WAR_SINGLE_OVER: {
                // //单场战斗完成通知
                // let cityWarInfo = WorldModel.getCityWarInfo();
                // let cityId = cityWarInfo.cityId;
                // WorldProxy.send_C2S_CITY_WAR_MYTEAM(cityId);
                break;
            }
            case ProtoDef.S2C_CITY_WAR_SETTLEMENT: {
                // //国战总结算  
                var ret = WorldModel.updateSiegeResult(body);
                notification.setBody(ret);
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_SIEGE_END, { result: ret });
                break;
            }
            case ProtoDef.S2C_CITY_WAR_CONFRONTATION_LIST: {
                WorldModel.setSiegeList(body);
                break;
            }
            case ProtoDef.S2C_CITY_WAR_DMG_RANK: {
                WorldModel.initSiegeKill(body);
                break;
            }
            // default:
            //     break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**请求世界地图数据 */
    WorldProxy.send_CITY_BATTLE_LOAD_WORLD_MAP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_LOAD_WORLD_MAP);
        if (WorldProxy.m_pVersion != null)
            data.version = WorldProxy.m_pVersion;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求世界事件 */
    // public static send_CITY_BATTLE_WORLD_AFFAIRS(type: WorldEventType) {
    // 	if (RoleData.countryId == 0) return;
    // 	let data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_WORLD_AFFAIRS);
    // 	data.type = type;
    // 	AGame.ServiceBuilder.sendMessage(data);
    // }
    /**获取队伍列表队列 */
    WorldProxy.C2S_TEAMMOVE_LIST = function (ids) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAMMOVE_LIST);
        data.teamValueKey = ids;
        if (ids.length == 0) {
            //进入场景请求队伍列表
            AGame.ServiceBuilder.sendMessage(data, null, null, true);
        }
        else {
            //普通同步
            AGame.ServiceBuilder.sendMessage(data);
        }
    };
    /**部队前往 */
    WorldProxy.C2S_TEAMMOVE_TO = function (teamMoveData, cityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAMMOVE_TO);
        data.teamMoveData = teamMoveData;
        data.cityId = cityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
    * 请求部队加速
    * @static
    * @param  {number} aid 部队id
    * @param  {number} ty 类型(1:25，2:50)
    * @return void type 1为道具加速 2为元宝加速
    * @memberof WorldProxy
    */
    WorldProxy.C2S_TEAMMOVE_QUICKEN = function (teamId, itemid, type) {
        if (type === void 0) { type = 1; }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAMMOVE_QUICKEN);
        data.teamId = teamId,
            data.itemId = itemid;
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求部队召回
     * @static
     * @param  {number} aid 部队id
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.C2S_TEAMMOVE_RETURN = function (teamId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_TEAMMOVE_RETURN);
        data.teamId = teamId,
            data.itemId = PropEnum.WORLE_MOVE_BACK;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**事件操作 */
    WorldProxy.C2S_WORLDMAP_EVENT_ACT = function (eventCoordinatesId, eventDataId, teamId, cityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WORLDMAP_EVENT_ACT);
        data.eventDataId = eventDataId;
        data.eventCoordinatesId = eventCoordinatesId;
        data.teamId = teamId;
        data.cityId = cityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**采集加速 */
    WorldProxy.C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN = function (eventCoordinatesId, itemId, count) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN);
        data.eventCoordinatesId = eventCoordinatesId;
        data.itemId = itemId;
        data.count = count;
        // data.cityId = cityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**事件拜访 */
    WorldProxy.C2S_GENERAL_VISIT = function (gid, cid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GENERAL_VISIT);
        data.generalId = gid,
            data.cityId = cid,
            AGame.ServiceBuilder.sendMessage(data);
    };
    /**请求国战已领取的奖励数据 */
    WorldProxy.C2S_MILITARYMERITS_REWARD_INFO = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MILITARYMERITS_REWARD_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求已领取奖励数据
     */
    WorldProxy.C2S_MILITARYMERITS_REWARD_RECEIVE = function (id) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MILITARYMERITS_REWARD_RECEIVE);
        data.id = id;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
 * 请求攻击事件列表
 * @static
 * @return void
 * @memberof WorldProxy
 */
    WorldProxy.send_WORLD_ATTACK_EVENT_LIST = function () {
        // let data = AGame.ServiceBuilder.newClazz(ProtoDef.WORLD_ATTACK_EVENT_LIST);
        // AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求战场id
     * @static
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.send_WORLD_GET_BATTLE_ID = function (id) {
        // let data = AGame.ServiceBuilder.newClazz(ProtoDef.WORLD_GET_BATTLE_ID);
        // data.id = id;
        // AGame.ServiceBuilder.sendMessage(data);
    };
    WorldProxy.send_CITY_BATTLE_EXIT_WORLD_MAP = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.CITY_BATTLE_EXIT_WORLD_MAP);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求警报信息
     */
    WorldProxy.C2S_WORLDMAP_INFORMATION = function (countryId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WORLDMAP_INFORMATION);
        data.countryId = countryId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 请求事件点刷新
     *
     */
    WorldProxy.C2S_GET_MAP_EVENT_DATA = function () {
        var eventCoordinatesId = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            eventCoordinatesId[_i] = arguments[_i];
        }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_MAP_EVENT_DATA);
        data.eventCoordinatesId = eventCoordinatesId;
        AGame.ServiceBuilder.sendMessage(data);
        delete WorldModel.m_pResRefEventMap[eventCoordinatesId[0]];
    };
    /**
     * 刷新武将显示
     */
    WorldProxy.C2S_VISIT_DATA_REFRESH = function (cityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_VISIT_DATA_REFRESH);
        data.cityId = cityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
  * 解锁城池
  */
    WorldProxy.C2S_UNLOCK_CITY = function (cityId, teamId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_UNLOCK_CITY);
        data.cityId = cityId;
        data.teamId = teamId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
 * 次数购买
 */
    WorldProxy.C2S_MAP_EVENT_BUY = function (type) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MAP_EVENT_BUY);
        data.type = type;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
* 刷新加速
*/
    WorldProxy.C2S_VISIT_CD_SPEED = function (cityId, gold, itemId, itemCout) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_VISIT_CD_SPEED);
        data.cityId = cityId;
        data.gold = gold;
        data.itemId = itemId;
        data.itemCount = itemCout;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**查看城池驻军信息 */
    WorldProxy.C2S_CITY_ITEM_INFO = function (cityId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_ITEM_INFO);
        data.cityId = cityId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 攻城战所有信息
     * @static
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.send_WORLD_SIEGE_LIST = function () {
        // let data = AGame.ServiceBuilder.newClazz(ProtoDef.WORLD_SIEGE_LIST);
        // AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 攻城排行
     * @static
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.send_C2S_CITY_WAR_DMG_RANK = function (cid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_WAR_DMG_RANK);
        data.cityId = cid;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 进入城市战场
     * @static
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.send_C2S_CITY_WAR_GO = function (cid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_WAR_GO);
        data.cityId = cid;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 根据城市ID，获取我攻击的所有队伍
     * @static
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.send_C2S_CITY_WAR_MYTEAM = function (cid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_WAR_MYTEAM);
        data.cityId = cid;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 获取为打仗的队伍数据
     * @static
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.send_C2S_CITY_WAR_TEAM = function (cid, teamId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_WAR_TEAM);
        data.cityId = cid;
        data.teamId = teamId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 退出战场
     * @static
     * @return void
     * @memberof WorldProxy
     */
    WorldProxy.send_C2S_CITY_WAR_OUT = function (cid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_WAR_OUT);
        data.cityId = cid;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 国战对战列表
     * @static
     * @return cid 城池id
     * @memberof WorldProxy
     */
    WorldProxy.send_C2S_CITY_WAR_CONFRONTATION_LIST = function (cid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_WAR_CONFRONTATION_LIST);
        data.cityId = cid;
        data.page = 0;
        AGame.ServiceBuilder.sendMessage(data);
    };
    WorldProxy.send_C2S_CITY_WATCH_WAR_TEAM = function (cid, playerId, teamId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_CITY_WATCH_WAR_TEAM);
        data.cityId = cid;
        data.playerId = playerId;
        data.teamId = teamId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    WorldProxy.m_pVersion = null; //城池缓存的数据版本
    return WorldProxy;
}(BaseProxy));
