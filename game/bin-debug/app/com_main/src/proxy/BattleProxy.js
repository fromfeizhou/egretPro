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
var BattleProxy = /** @class */ (function (_super_1) {
    __extends(BattleProxy, _super_1);
    function BattleProxy() {
        var _this = _super_1.call(this) || this;
        FightResponseUtil.battleProxy = _this;
        return _this;
    }
    BattleProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.S2C_WAR_BATTLE_INIT, this, 'S2C_WAR_BATTLE_INIT', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_COMBAT_UNIT, this, 'S2C_WAR_COMBAT_UNIT', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_DEATH, this, 'S2C_WAR_DEATH', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_FOLLOW_UP, this, 'S2C_WAR_FOLLOW_UP', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_MOVE_SYNC, this, 'S2C_WAR_MOVE_SYNC', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_SYNC_MOVE_SPEED, this, 'S2C_WAR_SYNC_MOVE_SPEED', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_BUFF_ADD, this, 'S2C_WAR_BUFF_ADD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_BUFF_UN, this, 'S2C_WAR_BUFF_UN', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_BUFF_OFFSET, this, 'S2C_WAR_BUFF_OFFSET', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_BUFF_BLOOD, this, 'S2C_WAR_BUFF_BLOOD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_ELEMENT_BLOOD, this, 'S2C_WAR_ELEMENT_BLOOD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD, this, 'S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_GUIDE, this, 'S2C_WAR_GUIDE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WAR_START, this, 'C2S_WAR_START', ProxyEnum.SEND],
            [ProtoDef.S2C_WAR_START, this, 'S2C_WAR_START', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WAR_ANAGER_SKILL, this, 'C2S_WAR_ANAGER_SKILL', ProxyEnum.SEND],
            [ProtoDef.C2S_WAR_REENTRY_BATTLE, this, 'C2S_WAR_REENTRY_BATTLE', ProxyEnum.SEND],
            [ProtoDef.S2C_WAR_REENTRY_BATTLE, this, 'S2C_WAR_REENTRY_BATTLE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WAR_QUIT_BATTLE, this, 'C2S_WAR_QUIT_BATTLE', ProxyEnum.SEND],
            [ProtoDef.S2C_WAR_QUIT_BATTLE, this, 'S2C_WAR_QUIT_BATTLE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WAR_QUICK_BATTLE, this, 'C2S_WAR_QUICK_BATTLE', ProxyEnum.SEND],
            [ProtoDef.S2C_WAR_QUICK_BATTLE, this, 'S2C_WAR_QUICK_BATTLE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WAR_AUTO, this, 'C2S_WAR_AUTO', ProxyEnum.SEND],
            [ProtoDef.S2C_WAR_AUTO, this, 'S2C_WAR_AUTO', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WAR_AUTO_LIST, this, 'C2S_WAR_AUTO_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_WAR_AUTO_LIST, this, 'S2C_WAR_AUTO_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_WAR_QUERY_HERO_DATA, this, 'C2S_WAR_QUERY_HERO_DATA', ProxyEnum.SEND],
            [ProtoDef.S2C_WAR_QUERY_HERO_DATA, this, 'S2C_WAR_QUERY_HERO_DATA', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_SKILL_FAIL, this, 'S2C_WAR_SKILL_FAIL', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_OVER, this, 'S2C_WAR_OVER', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GM_WAR, this, 'C2S_GM_WAR', ProxyEnum.SEND],
            [ProtoDef.S2C_GM_WAR, this, 'S2C_GM_WAR', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_GM_WAR_OVER, this, 'S2C_GM_WAR_OVER', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_WAR_OVER_HP, this, 'S2C_WAR_OVER_HP', ProxyEnum.RECEIVE],
        ];
    };
    BattleProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_WAR_BATTLE_INIT: {
                Loading.hide();
                var data = body;
                var lastMapId = 0;
                if (BattleModel.getJoinedBattleId()) {
                    lastMapId = BattleModel.getMapId();
                    BattleModel.clear();
                    BattleModel.alreadyDestroy = true;
                }
                var battleinfo = BattleInfoVo.create(data);
                BattleModel.addBattleInfo(battleinfo);
                BattleModel.setJoinedBattleId(battleinfo.battleId);
                BattleModel.setMapId(data.terrainId); //战场地图
                this.addHeroWarData(data.attack);
                this.addHeroWarData(data.defense);
                this.addSceneUnit(data.sceneCombatUnit);
                // if(DEBUG){
                // 	let atkHp = 0;
                // 	let defHp = 0;
                // 	let SceneUnit = 0;
                // 	for(let i of data.attack){
                // 		for(let k of i.combatUnit){
                // 			atkHp += k.troops;
                // 		}
                // 	}
                // 	for(let i of data.defense){
                // 		for(let k of i.combatUnit){
                // 			defHp += k.troops;
                // 		}
                // 	}
                // 	for(let k of data.sceneCombatUnit){
                // 		SceneUnit += k.troops;
                // 	}
                // 	console.log("战斗开始血量 攻方场景",atkHp,defHp,SceneUnit)
                // }
                BattleModel.setAtkAllMaxBlood(data.atkMaxTroops);
                BattleModel.setDefAllMaxBlood(data.defMaxTroops);
                //设置预加技能
                var group = SceneResGroupCfg.getResGroup(ModuleEnums.BATTLE_MAP_INIT);
                var skillGroup = BattleModel.getPreDownload();
                SceneResGroupCfg.setResGroup(SceneEnums.BATTLE_MAP, group.concat(skillGroup));
                //不同场景的重新创建地图
                if (lastMapId != BattleModel.getMapId()) {
                    SceneManager.enterScene(SceneEnums.BATTLE_MAP, null, false);
                    return;
                }
                var bool = SceneManager.enterScene(SceneEnums.BATTLE_MAP, null);
                if (!bool) {
                    var map = com_main.BattleMap.getClass();
                    if (map) {
                        map.destoryDate();
                        map.initData();
                        MapUtil.initMapData(BattleModel.getMapId());
                        map.setMapSetting(MapLoader.getMapSetting(BattleModel.getMapId()));
                        map.onEnterDealData();
                    }
                    var battleView = com_main.BattleView.getInstance(); //SceneManager.getView("com_main.BattleView", body);
                    battleView.setData();
                    com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_CHANGE_MAP, null);
                }
                break;
            }
            case ProtoDef.S2C_WAR_COMBAT_UNIT: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            case ProtoDef.S2C_WAR_FOLLOW_UP: {
                this.addHeroWarData(body.heroWarData);
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            case ProtoDef.S2C_WAR_MOVE_SYNC: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            case ProtoDef.S2C_WAR_SYNC_MOVE_SPEED: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            case ProtoDef.S2C_WAR_DEATH: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            case ProtoDef.S2C_WAR_BUFF_ADD: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            //取消buff
            case ProtoDef.S2C_WAR_BUFF_UN: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            //BUFF偏移
            case ProtoDef.S2C_WAR_BUFF_OFFSET: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            //BUFF气血
            case ProtoDef.S2C_WAR_BUFF_BLOOD: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            //更新元素气血
            case ProtoDef.S2C_WAR_ELEMENT_BLOOD: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            //BUFF气血（雷戟专用）
            case ProtoDef.S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            //引导通知
            case ProtoDef.S2C_WAR_GUIDE: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            //战斗结束
            case ProtoDef.S2C_WAR_OVER: {
                FightResponseUtil.AddData(protocol, body.flowTime, notification);
                return;
            }
            case ProtoDef.S2C_WAR_OVER_HP: {
                // console.log('结算血量 攻守',body.attCountHp,body.defCountHp);
                BattleModel.setLastHp(body.battleId, body.attCountHp, body.defCountHp);
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_OVER, null);
                break;
            }
            //发送开始战斗返回
            case ProtoDef.S2C_WAR_START: {
                // if(body.status == 0){
                Utils.TimerManager.doTimer(500, 1, function () {
                    com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_START_RUN, null);
                }, this);
                // }
                break;
            }
            //重新进入战场
            case ProtoDef.S2C_WAR_REENTRY_BATTLE: {
                if (body.state && BattleModel.isReConnectBattle) {
                    SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
                }
                BattleModel.isReConnectBattle = false;
                break;
            }
            //退出战场
            case ProtoDef.S2C_WAR_QUIT_BATTLE: {
                // // if( body.state == 0 ){
                // 	SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
                // // }
                // let battleType: CheckPointType = BattleModel.getCheckPointType(BattleModel.getJoinedBattleId());
                // if(battleType == CheckPointType.NEW_CITY_WAR){
                // 	SceneManager.enterScene(SceneEnums.WORLD_CITY);
                // }else{
                // 	SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
                // }
                break;
            }
            //快速战斗返回结果
            case ProtoDef.S2C_WAR_QUICK_BATTLE: {
                //返回 1:失败 0:成功 
                if (body.state === 0) {
                    FightResponseUtil.quickBattle();
                }
                // else {
                // 	EffectUtils.showTips("此战斗无法跳过", 1, false);
                // }
                break;
            }
            //设置是否自动战斗
            case ProtoDef.S2C_WAR_AUTO: {
                if (body.state == 0) {
                    BattleModel.setAutoState(BattleProxy.autoState);
                    com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_CHANGE_PLAYER_STATUS, null);
                }
                break;
            }
            //获取各个战斗类型的自动状态
            case ProtoDef.S2C_WAR_AUTO_LIST: {
                BattleModel.setWarAutoList(body);
                break;
            }
            case ProtoDef.S2C_WAR_QUERY_HERO_DATA: {
                // message QueryHeroData{
                // 	required int32 elementId	=1;	//元素ID
                // 	required int64 heroId		=2;	//英雄唯一ID
                // 	required int32 heroSysId	=3;	//英雄配置表ID
                // 	repeated SysKeyValue keyValue 	=4;	//基础属性
                // 	repeated QueryHeroBuffData buffData=5;//buff属性
                // }
                // //查看武将属性
                // message S2C_WAR_QUERY_HERO_DATA{
                // 	required int64 battleId = 1;	//战场ID
                // 	repeated QueryHeroData heroData=2;		//英雄数据
                // }
                for (var _i = 0, _a = body.heroData; _i < _a.length; _i++) {
                    var heroData = _a[_i];
                    var unit = BattleModel.getUnit(heroData.elementId);
                    // debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~start")
                    // debug("id :", heroData.elementId, "名字：", unit.getName())
                    for (var _b = 0, _c = heroData.keyValue; _b < _c.length; _b++) {
                        var Attri = _c[_b];
                        var name_1 = Utils.getAttriNameByType(Attri.key);
                        var value = Attri.value;
                        if (Attri.isFloat == 1) {
                            value = value / 10000;
                        }
                        else {
                            value = value;
                        }
                        debug(name_1, " : ", value);
                    }
                    // debug(heroData.buffData);
                    // debug("buff 属性~~~~~~~~~~~~~~~~")
                    for (var _d = 0, _e = heroData.buffData; _d < _e.length; _d++) {
                        var buff = _e[_d];
                        var name_2 = Utils.getAttriNameByType(buff.attributeId);
                        var value = buff.attributeValue;
                        // debug("buffid = " + buff.buffId, "配置表id=", buff.buffSysId, name, " : ", value);
                    }
                    // debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~end")
                }
                break;
            }
            case ProtoDef.S2C_WAR_SKILL_FAIL: {
                debugBatt("释放技能失败");
                break;
            }
            case ProtoDef.S2C_GM_WAR: {
                console.log(body);
                if (!body.status) {
                    BattleProxy.send_C2S_WAR_REENTRY_BATTLE(body.battleId);
                }
                break;
            }
            case ProtoDef.S2C_GM_WAR_OVER: {
                Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.isVictory, rewards: [], battleType: CheckPointType.GM });
                break;
            }
            default: {
                debug("未处理事件:", protocol);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    BattleProxy.prototype.dealData = function (notification) {
        if (!notification) {
            return;
        }
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_WAR_COMBAT_UNIT: {
                var list = [];
                for (var _i = 0, _a = body.realTimeWar; _i < _a.length; _i++) {
                    var attackInfo = _a[_i];
                    var avo = SkillAtkVo.create(attackInfo, body.flowTime);
                    if (attackInfo.callCombatUnit && attackInfo.callCombatUnit.length > 0) {
                        this.addSceneUnit(attackInfo.callCombatUnit);
                    }
                    list.push(avo);
                }
                body.realTimeWar = list;
                break;
            }
            case ProtoDef.S2C_WAR_FOLLOW_UP: {
                this.addHeroWarData(body.heroWarData);
                break;
            }
            case ProtoDef.S2C_WAR_MOVE_SYNC: {
                break;
            }
            case ProtoDef.S2C_WAR_SYNC_MOVE_SPEED: {
                var data = body;
                for (var i in data.moveSpeedData) {
                    var moveSpeedData = data.moveSpeedData[i];
                    var buId = (moveSpeedData >> 17) & 0x3fff;
                    var speed = (moveSpeedData >> 3) & 0x3fff;
                    var unit = BattleModel.getUnit(buId);
                    if (unit) {
                        var lastSpeed = unit.moveSpeed;
                        unit.setSpeed(speed);
                        var cruSpeed = unit.moveSpeed;
                        // console.log("lastSpeed = ,speed",lastSpeed,cruSpeed);
                    }
                }
                break;
            }
            case ProtoDef.S2C_WAR_DEATH: {
                if (!body.warDeathData) {
                    error("body.warDeathData is null");
                    error("body", body);
                    return;
                }
                for (var _b = 0, _c = body.warDeathData; _b < _c.length; _b++) {
                    var deathData = _c[_b];
                    var elementId = deathData.elementId;
                    var isDeath = deathData.isDeath;
                    if (isDeath) {
                        var unit = BattleModel.getUnit(elementId);
                        if (unit && unit.type == UnitType.GENERAL) {
                            BattleModel.addGeneralDie(unit.faction, unit.sysId);
                        }
                        // BattleModel.removeUnit(elementId);
                    }
                    for (var _d = 0, _e = deathData.soldierElementId; _d < _e.length; _d++) {
                        var elementId_1 = _e[_d];
                        BattleModel.addSoldierDie(elementId_1);
                        // BattleModel.removeUnit(elementId);
                    }
                    // repeated BuffData buffData=3;	//BUFF 目标元素ID(14位)+buffId(14位)+buffSysId(22位)
                }
                break;
            }
            case ProtoDef.S2C_WAR_BUFF_ADD: {
                debugBatt("添加buff");
                debugBatt(body);
                for (var _f = 0, _g = body.buffData; _f < _g.length; _f++) {
                    var buff = _g[_f];
                    debugBatt("tarId, buffId, buffSysId = ", buff.elementId, buff.buffId, buff.buffSysId);
                    BattleModel.addBuff(buff);
                }
                break;
            }
            //取消buff
            case ProtoDef.S2C_WAR_BUFF_UN: {
                // required int64 battleId = 1;	//战场ID
                // required int32 flowTime = 2;
                // repeated int32 buffData=3;	//BUFF 目标元素ID(14位)+buffId(14位)
                debugBatt("取消buff ");
                debugBatt(body);
                break;
            }
            //BUFF偏移
            case ProtoDef.S2C_WAR_BUFF_OFFSET: {
                debugBatt("buff 偏移 ");
                // required int64 battleId = 1;		//战场ID
                // required int32 flowTime = 2;
                // repeated BuffOffsetXy offsetXy=3; 	//buffID（14位 最大值16383）+元素ID（14位 最大值16383）+buff使对方移位 状态（4位）+X轴（8）+y（7位） 状态：0.无，1 击退（往前击退） 2击飞 3冲退 4击退（往两边击退）
                break;
            }
            //BUFF气血
            case ProtoDef.S2C_WAR_BUFF_BLOOD: {
                break;
            }
            //更新元素气血
            case ProtoDef.S2C_WAR_ELEMENT_BLOOD: {
                // required int64 battleId = 1;	//战场ID
                // required int32 flowTime = 2;
                // repeated int32 anger=3; 			//元素ID（14位 最大值16383）+攻击者当前怒气(武将才有)（7位）
                // for (int i = 0; i < msg.anger.Count; i++)
                // {
                // 	number item = msg.anger[i];
                // 	int id = (int)((item >> 17) & 0x3fff);
                // 	int angry = (int)((item >> 10) & 0x7f);
                // 	BattleUnit bu = ModelFight.Instance.GetUnit(id);
                // 	if (bu != null)
                // 	{
                // 		bu.fightObjVo.angry = angry;
                // 		/*      if(MyDebug.isDebug)
                // 			{
                // 				MyDebug.Log("心跳怒气 >> ", id, angry, Director.Instance.Runtime);
                // 			}   */
                // 	}
                // }
                break;
            }
            //BUFF气血（雷戟专用）
            case ProtoDef.S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD: {
                break;
            }
            //引导通知
            case ProtoDef.S2C_WAR_GUIDE: {
                break;
            }
            //战斗结束
            case ProtoDef.S2C_WAR_OVER: {
                var data = body;
                FightResponseUtil.isWarOver = true;
                BattleModel.setIsStopPlay(true);
                FightResponseUtil.victory = data.victory;
                var delayTime = ConstUtil.getValue(IConstEnum.BATTLE_SETTLE_DELAY_TIME);
                Utils.TimerManager.doTimer(delayTime, 1, function () {
                    FightResponseUtil.showResultView();
                }, this);
                WorldModel.battleOver();
                // console.log('结算血量 攻守',data.attCountHp,data.defCountHp);
                // BattleModel.setLastHp(data.attCountHp,data.defCountHp);
                // com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_OVER, null);
                break;
            }
            default: {
                debug("未处理事件:", protocol);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    BattleProxy.prototype.addHeroWarData = function (data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var heroWarData = data_1[_i];
            BattleModel.addSoldierType(heroWarData.soldierType);
            // console.log("heroWarData.name", heroWarData.name, "heroWarData.attOrDef =", heroWarData.attOrDef)
            BattleModel.setPlayerName({ attOrDef: heroWarData.attOrDef, name: heroWarData.name, country: heroWarData.country });
            var combatUnit = heroWarData.combatUnit;
            var generalName11 = "";
            var benumberUId = 0;
            for (var _a = 0, combatUnit_1 = combatUnit; _a < combatUnit_1.length; _a++) {
                var unit = combatUnit_1[_a];
                unit["faction"] = heroWarData.attOrDef;
                unit["soldierType"] = heroWarData.soldierType;
                unit["soldierLv"] = heroWarData.soldierLv;
                unit["heroPosition"] = heroWarData.heroPosition;
                if (unit.generalName) {
                    generalName11 = unit.generalName;
                    benumberUId = unit.elementId;
                }
                else {
                    unit.generalName = generalName11;
                    unit["benumberUId"] = benumberUId;
                }
                var unitinfo = UnitInfoVo.create(unit);
                BattleModel.addUnit(unitinfo);
                if (unit.type == UnitType.GENERAL) {
                    BattleModel.setPosInfo(heroWarData.attOrDef, heroWarData.heroPosition, heroWarData.soldierType, unit.elementId);
                }
            }
        }
    };
    BattleProxy.prototype.addSceneUnit = function (combatUnit) {
        for (var _i = 0, combatUnit_2 = combatUnit; _i < combatUnit_2.length; _i++) {
            var unit = combatUnit_2[_i];
            unit["faction"] = FactionType.DEF;
            unit["type"] = unit.soldierType;
            var unitinfo = UnitInfoVo.create(unit);
            BattleModel.addUnit(unitinfo);
        }
    };
    /////////////////////////////////////////////////////////////////////
    /**发送重新进入战斗 */
    BattleProxy.send_C2S_WAR_REENTRY_BATTLE = function (battleId) {
        // if (BattleModel.getJoinedBattleId() == battleId) {
        // 	return;
        // }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_REENTRY_BATTLE);
        data.battleId = battleId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**进入战场结果 */
    BattleProxy.send_C2S_WAR_START = function () {
        var battleInfo = BattleModel.getJoinedBattleInfo();
        if (!battleInfo) {
            return;
        }
        battleInfo.setTimeStart();
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_START);
        data.battleId = BattleModel.getBattleInfo().battleId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**发送战斗单位使用技能 */
    BattleProxy.send_BATTLE_USE_SKILL = function (elementId, skillId) {
        debugBatt("BattleProxy:---send_BATTLE_USE_SKILL>>", elementId, skillId);
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_ANAGER_SKILL);
        data.battleId = BattleModel.getJoinedBattleId();
        data.elementId = elementId;
        data.baseSkillId = skillId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    BattleProxy.send_C2S_WAR_QUIT_BATTLE = function (battleId) {
        if (this.exitId == battleId)
            return;
        this.exitId = battleId;
        debugBatt("BattleProxy:---send_C2S_WAR_QUIT_BATTLE>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_QUIT_BATTLE);
        data.battleId = battleId ? battleId : BattleModel.getJoinedBattleId();
        AGame.ServiceBuilder.sendMessage(data);
    };
    //快速战斗返回结果
    BattleProxy.send_C2S_WAR_QUICK_BATTLE = function () {
        debugBatt("BattleProxy:---send_C2S_WAR_QUICK_BATTLE>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_QUICK_BATTLE);
        data.battleId = BattleModel.getJoinedBattleId();
        AGame.ServiceBuilder.sendMessage(data);
    };
    BattleProxy.send_C2S_WAR_AUTO = function (autoState) {
        debugBatt("BattleProxy:---send_C2S_WAR_AUTO>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_AUTO);
        data.battleId = BattleModel.getJoinedBattleId();
        data.autoState = autoState;
        AGame.ServiceBuilder.sendMessage(data);
        this.autoState = autoState;
    };
    //获取各个战斗类型的自动状态
    BattleProxy.send_C2S_WAR_AUTO_LIST = function () {
        debugBatt("BattleProxy:---send_C2S_WAR_AUTO_LIST>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_AUTO_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    //获取战斗对象属性
    BattleProxy.send_C2S_WAR_QUERY_HERO_DATA = function (battleId, list) {
        debugBatt("BattleProxy:---send_C2S_WAR_QUERY_HERO_DATA>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_WAR_QUERY_HERO_DATA);
        data.battleId = BattleModel.getJoinedBattleId();
        data.elementId = list;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //gm指令战斗
    BattleProxy.send_C2S_GM_WAR = function (arg) {
        debugBatt("BattleProxy:---send_C2S_GM_WAR>>");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GM_WAR);
        data.att = arg.att;
        data.def = arg.def;
        data.terrainId = arg.terrainId;
        data.isNotSoldier = arg.isNotSoldier;
        data.isSingleSoldier = arg.isSingleSoldier;
        data.isDefendAuto = arg.isDefendAuto;
        data.isSkillStop = arg.isSkillStop;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //设置是否自动战斗
    BattleProxy.autoState = true;
    return BattleProxy;
}(BaseProxy));
