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
var com_main;
(function (com_main) {
    var BattleMap = /** @class */ (function (_super_1) {
        __extends(BattleMap, _super_1);
        function BattleMap() {
            var _this = _super_1.call(this) || this;
            /**是否第一次移动镜头到城墙 */
            _this.m_isFirstMove = true;
            _this.frames = 0;
            _this.framesTime = 0;
            _this.name = BattleMap.NAME;
            return _this;
        }
        BattleMap.prototype.init = function () {
            _super_1.prototype.init.call(this);
            this.initData();
        };
        BattleMap.prototype.initData = function () {
            this.SCALE_MAX = 1;
            var cpType = BattleModel.getCheckPointType();
            this.SCALE_DEF = 0.8;
            this.setIsCanScale(false);
            if (BattleModel.getMapId() != 6) {
                this.setIsCanMove(false);
            }
            else {
                this.setIsCanMove(true);
            }
            this.m_bIsDestroy = false;
            this.m_pSceneMgr = com_main.BattleSceneMgr.getInstance();
            this.m_pSceneMgr.init();
            this.m_pSceneMgr.setMapView(this);
            this.m_pSkillMgr = com_main.BattleSkillMgr.getInstance();
            this.m_pSkillMgr.init();
            this.m_pSkillMgr.setMapView(this);
            //避免战斗场景出现黑边
            this.x = 0;
            this.y = 0;
        };
        /**
         * 销毁方法
         */
        BattleMap.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            // let mapId = BattleModel.getMapId();
            //清理模块资源 最后调用 避免龙骨动画没有执行destroy
            // SceneResGroupCfg.setResGroup(ModuleEnums.BATTLE_MAP_DYNAMICS,['map_battle_'+mapId]);
            // SceneResGroupCfg.clearModelRes([ModuleEnums.BATTLE,ModuleEnums.BATTLE_MAP_DYNAMICS]);
            this.destoryDate();
            //退出地图，清理国战信息
            WorldModel.clearCityWar();
        };
        BattleMap.prototype.destoryDate = function () {
            com_main.CBulletMgr.getIns().onDestroy();
            com_main.CEffectMgr.getIns().onDestroy();
            com_main.CSquareMgr.getIns().onDestroy();
            this.m_pSceneMgr.onDestroy();
            this.m_pSceneMgr = null;
            this.m_pSkillMgr.onDestroy();
            this.m_pSkillMgr = null;
            '';
            this.m_pMapSetting = null;
            this.m_pOvOInfo = null;
            FightResponseUtil.reset(); //战斗协议开始
            this.m_isFirstMove = true;
            Utils.TimerManager.remove(this.removeUnit, this);
            if (this.m_blackBorder) {
                Utils.removeFromParent(this.m_blackBorder);
            }
            this.m_bIsDestroy = true;
        };
        BattleMap.prototype.setMapSetting = function (setting) {
            if (this.m_bIsDestroy)
                return;
            this.m_pMapSetting = setting;
            var mapid = this.m_pMapSetting.getMapId();
            this.m_pTileConfig = MapData.getTileMapConfig(mapid);
            this.m_pSceneMgr.setMapSetting(this.m_pMapSetting);
        };
        BattleMap.prototype.onEnterDealData = function () {
            var _this = this;
            if (this.m_bIsDestroy)
                return;
            this.m_pSceneMgr.initView();
            // this.m_pSceneMgr.makeGrid();
            // this.m_pSceneMgr.createElement();
            // this.m_pSceneMgr.wallEffect();
            // this.m_pSceneMgr.createNPCObj();
            // this.m_pSceneMgr.createPlayerObjs();  //旗帜 出生点
            //防止地图出现黑边
            // this.set_scale(Math.max(0.8, GameConfig.curWidth() / this.m_pBg.width)) ;
            this.m_pSceneMgr.createUnits();
            this.m_pSceneMgr.onEnter();
            //攻墙战地图
            if (BattleModel.getMapId() == 6) {
                if (BattleModel.getIsAleardyCurBattle()) {
                    this.moveTo(881, 870, false);
                }
                else {
                    this.moveTo(1480, 542, false);
                    // TimerManager.getInstance()
                    Utils.TimerManager.doTimer(2000, 1, function () {
                        if (!BattleModel.getJoinedBattleId()) {
                            return;
                        }
                        _this.moveTo(881, 870, true, 30);
                        _this.setForceCall(function () { Utils.TimerManager.doTimer(1000, 1, function () { FightResponseUtil.play(); }, _this); }, _this);
                        Utils.TimerManager.doTimer(2000, 1, function () { com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER, 0); }, _this);
                    }, this);
                }
            }
            else {
                var point = ConstUtil.getNumArray(IConstEnum.BATTLE_MAP_1_START_POINT);
                this.moveTo(point[0], point[1], false);
                //开战
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER, 0);
            }
            if (BattleModel.m_isGuideBattle) {
                //电影上下黑边效果
                this.m_blackBorder = new com_main.GuideBlackBorder();
            }
        };
        BattleMap.prototype.onEnter = function () {
            _super_1.prototype.onEnter.call(this);
            debug("BattleMap:onEnter--->>");
            SceneManager.sceneCreateComplete();
            this.onEnterDealData();
            // let isopen = LocalData.getData('open_map_grid', "0");
            // if (parseInt(isopen)) this.m_pSceneMgr.drawGrid();
            this.resetTile([1, 1, 1]);
            this.m_nMoveRate = 2;
            //移除本场战斗不需要的模型和地图
            SceneResGroupCfg.clearGroup('soldier', BattleModel.getModelList());
            var mapId = BattleModel.getMapId();
            SceneResGroupCfg.clearGroup('map_battle', ["map_battle_" + mapId + "_000_jpg"]);
        };
        /**新手新导攻墙战移动镜头 */
        BattleMap.prototype.moveToWall = function () {
            if (this.m_bIsDestroy)
                return;
            if (this.m_isFirstMove) {
                this.moveTo(1346, 624, true, 100);
                this.m_isFirstMove = false;
            }
        };
        BattleMap.prototype.onExit = function () {
            _super_1.prototype.onExit.call(this);
            debug("BattleMap:onExit--->>");
            if (this.m_bIsDestroy)
                return;
            this.m_pSceneMgr.onExit();
        };
        BattleMap.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_WAR_MOVE_SYNC,
                ProtoDef.S2C_WAR_COMBAT_UNIT,
                ProtoDef.S2C_WAR_DEATH,
                ProtoDef.S2C_WAR_FOLLOW_UP,
                ProtoDef.S2C_WAR_BUFF_ADD,
                ProtoDef.S2C_WAR_BUFF_UN,
                ProtoDef.S2C_WAR_BUFF_BLOOD,
                ProtoDef.S2C_WAR_ELEMENT_BLOOD,
                ProtoDef.S2C_WAR_SYNC_MOVE_SPEED,
                ProtoDef.S2C_WAR_OVER
            ];
        };
        /**
         * 处理战斗事件
         */
        BattleMap.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_WAR_MOVE_SYNC: { //战斗单位移动
                    if (this.m_bIsDestroy)
                        return;
                    this.moveProto(body);
                    break;
                }
                case ProtoDef.S2C_WAR_COMBAT_UNIT: {
                    if (this.m_bIsDestroy)
                        return;
                    for (var _i = 0, _a = body.realTimeWar; _i < _a.length; _i++) {
                        var avo = _a[_i];
                        this.m_pSceneMgr.unitSkillUse(avo);
                        if (avo.callCombatUnit) {
                            for (var _b = 0, _c = avo.callCombatUnit; _b < _c.length; _b++) {
                                var data = _c[_b];
                                var unit1 = BattleModel.getUnit(data.elementId);
                                this.m_pSceneMgr.createUnits([unit1]);
                            }
                        }
                        // avo.onDestroy();
                        // ObjectPool.push(avo);
                    }
                    break;
                }
                case ProtoDef.S2C_WAR_DEATH: {
                    if (this.m_bIsDestroy)
                        return;
                    this.dealWarDeath(body);
                    break;
                }
                case ProtoDef.S2C_WAR_FOLLOW_UP: {
                    if (this.m_bIsDestroy)
                        return;
                    for (var _d = 0, _e = body.heroWarData; _d < _e.length; _d++) {
                        var heroWarData = _e[_d];
                        var combatUnit = heroWarData.combatUnit;
                        for (var _f = 0, combatUnit_1 = combatUnit; _f < combatUnit_1.length; _f++) {
                            var data = combatUnit_1[_f];
                            var unit1 = BattleModel.getUnit(data.elementId);
                            this.m_pSceneMgr.createUnits([unit1]);
                        }
                    }
                    break;
                }
                case ProtoDef.S2C_WAR_BUFF_ADD: {
                    if (this.m_bIsDestroy)
                        return;
                    this.addBuff(body);
                    break;
                }
                case ProtoDef.S2C_WAR_BUFF_UN: {
                    if (this.m_bIsDestroy)
                        return;
                    this.removeBuff(body);
                    break;
                }
                case ProtoDef.S2C_WAR_BUFF_BLOOD: {
                    if (this.m_bIsDestroy)
                        return;
                    this.m_pSceneMgr.buffBlood(body);
                    break;
                }
                case ProtoDef.S2C_WAR_ELEMENT_BLOOD: {
                    // this.m_pSceneMgr.refreshAnger(body);
                    break;
                }
                case ProtoDef.S2C_WAR_SYNC_MOVE_SPEED: {
                    if (this.m_bIsDestroy)
                        return;
                    var data = body;
                    for (var i in data.moveSpeedData) {
                        var moveSpeedData = data.moveSpeedData[i];
                        var buId = (moveSpeedData >> 17) & 0x3fff;
                        var speed = (moveSpeedData >> 3) & 0x3fff;
                        var csquare = this.m_pSceneMgr.getDynamicObj(buId, com_main.CSquare);
                        var unit = BattleModel.getUnit(buId);
                        if (csquare && unit) {
                            // csquare.setMoveSpeed(null,unit.moveSpeed)
                            csquare.resetSpeed(unit.moveSpeed);
                        }
                    }
                    break;
                }
                //战斗结束
                case ProtoDef.S2C_WAR_OVER: {
                    this.stopAllSoldier();
                }
            }
        };
        BattleMap.prototype.onTouchBegan = function (e) {
            _super_1.prototype.onTouchBegan.call(this, e);
            // let obj = Battle_SKillBar.getClass();
            // if (obj && obj.skilltouch) {
            // 	obj.skilltouch = false;
            // 	let rpoint = this.m_pBg.globalToLocal(e.stageX, e.stageY);
            // 	EventMgr.dispatchEvent(SpellNav.SPELL_TOUCH, rpoint);
            // }
        };
        BattleMap.prototype.onTouchMoved = function (e) {
            _super_1.prototype.onTouchMoved.call(this, e);
            if (this.m_bIsDestroy)
                return;
            this.m_pSceneMgr.onTouchMoved(e);
        };
        BattleMap.prototype.onTouchEnd = function (e) {
            _super_1.prototype.onTouchEnd.call(this, e);
            // var pos = new egret.Point();
            // this.m_pSceneMgr.getWorld().globalToLocal(e.stageX, e.stageY, pos);
            // debug("pos = "+pos.x + "   " + pos.y);
        };
        BattleMap.prototype.startEnterFrame = function () {
            Utils.TimerManager.doFrame(1, 0, this.onEnterFrame, this);
        };
        BattleMap.prototype.checkCenterPos = function () {
        };
        BattleMap.prototype.onEnterFrame = function (delta) {
            if (this.m_bIsDestroy)
                return;
            _super_1.prototype.onEnterFrame.call(this, delta);
            this.framesTime += delta;
            this.frames += 1;
            if (this.frames > 1) {
                // 场景对象刷新
                this.m_pSceneMgr.onEnterFrame(this.framesTime);
                FightResponseUtil.enterFrame(this.framesTime);
                this.framesTime = 0;
                this.frames = 0;
            }
        };
        /**
         * 获取实例
         */
        BattleMap.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.MAP, BattleMap.NAME);
            return obj;
        };
        BattleMap.prototype.createSoldier = function (id, direction, x, y) {
            if (this.m_bIsDestroy)
                return;
            var soldier = com_main.CSquare.createId(id, true, true);
            soldier.x = x;
            soldier.y = y;
            soldier.changeDirection(direction);
            soldier.changeStatus(CSquare_Status.STATUS_STAND);
            this.m_pSceneMgr.addChildToWorld(soldier);
            this.m_pSoldierList[id] = soldier;
            // GuideUI.showMask2(true);
        };
        // public moveSoldier(id: number, direction: number, x: number, y: number, isFollow: boolean = false) {
        //     let soldier = <CSquare>this.m_pSoldierList[id];
        //     if (soldier) {
        //         soldier.changeDirection(direction);
        //         soldier.changeStatus(CSquare_Status.STATUS_WALK);
        //         let pos1 = egret.Point.create(soldier.x, soldier.y);
        //         let pos2 = egret.Point.create(x, y);
        //         let distance = Point.distance(pos1, pos2);
        //         egret.Tween.get(soldier).to({ x: x, y: y }, distance * 7).call(() => {
        // 			this.m_pSceneMgr.onSortUnits();
        //             soldier.changeStatus(CSquare_Status.STATUS_STAND);
        //         }, this);
        //         if (isFollow) {
        //             this.m_pIsFollow = true;
        //             this.m_pFollowTarget = id;
        //         }
        //     }
        // }
        BattleMap.prototype.showSkillNameEffect = function (avo, csquare) {
            if (this.m_bIsDestroy)
                return;
            var generalId = avo.attackData.id;
            var sysId = BattleModel.getUnit(generalId).sysId;
            var config = GeneralModel.getGeneralConfig(sysId);
            if (avo.getSkillConfig().pauseTime) {
                var skillNameEffect = new com_main.BattleSkillName1(csquare, avo);
                AGame.R.app.menuLevel.addChild(skillNameEffect);
            }
            else {
                var skillNameFrame = new com_main.SmallActiveSkillName(avo, csquare);
                skillNameFrame.y = 20 + csquare.y - csquare.anchorOffsetY - 35;
                skillNameFrame.x = 50 + csquare.x - csquare.anchorOffsetX;
                this.m_pSceneMgr.addChildToBlood(skillNameFrame);
                csquare.startSkillEffect(avo.getSkillConfig().skillEffectId);
            }
            if (config && config.skillSound) {
                //播放音效
                Sound.playID1(config.skillSound);
            }
        };
        /**处理移动协议 */
        BattleMap.prototype.moveProto = function (body) {
            if (this.m_bIsDestroy)
                return;
            for (var _i = 0, _a = body.xz; _i < _a.length; _i++) {
                var xy = _a[_i];
                var buId = xy >> 17;
                var way = (xy >> 15) & 0x1;
                var posX = (xy >> 7) & 0xff;
                var posY = (xy & 0x7f);
                var position = ISOMap.getInstance().leftDownCellToPixel(posX, posY);
                var unitid = buId;
                var unit = BattleModel.getUnit(unitid);
                var csquare = this.m_pSceneMgr.getDynamicObj(unitid, com_main.CSquare);
                if (!unit || !csquare) {
                    debug(format("S2C_WAR_MOVE_SYNC 没找到战斗单位:uid:{1}", unitid));
                    break;
                }
                unit.setCellXY(xy);
                var spos = unit.position;
                var epos = egret.Point.create(position[0], position[1]); //new egret.Point();
                this.m_pSceneMgr.findPathPos(unitid, spos, epos);
                unit.position = epos;
                egret.Point.release(epos);
            }
        };
        /**士兵逃跑动画 */
        BattleMap.prototype.soldierEscape = function (id) {
            if (this.m_bIsDestroy)
                return;
            // let unit:UnitInfoVo = BattleModel.getUnit(id)
            var csquare = this.m_pSceneMgr.getDynamicObj(id, com_main.CSquare);
            if (csquare) {
                /**设置逃跑的速度 */
                // unit.setEscape(); 
                var unit = csquare.getUnitInfo();
                csquare.resetSpeed((unit.moveSpeed * 1 + unit.moveSpeed * Math.random()) * 0.66 * 7);
                // let [x,y] = unit.getCellXY();
                // let endCellX = 0;
                // if(unit.faction == FactionType.ATK){
                // 	endCellX = x + 3;
                // }else{
                // 	endCellX = x - 3;
                // }
                // let position = ISOMap.getInstance().leftDownCellToPixel(endCellX,y);
                var spos = unit.position;
                var epos = void 0;
                var dis = (1 + Math.random()) * 200;
                if (unit.faction == FactionType.ATK) {
                    epos = new egret.Point(spos.x - dis, spos.y + dis / 2);
                }
                else {
                    epos = new egret.Point(spos.x + dis, spos.y - dis / 2);
                }
                this.m_pSceneMgr.findPathPos(id, spos, epos);
                csquare.changeStatus(CSquare_Status.STATUS_WALK);
                csquare.runAnimation();
            }
        };
        BattleMap.prototype.dealWarDeath = function (body) {
            // required int64 battleId = 1;//战场ID
            // required int32 flowTime = 2;
            // repeated WarDeathData warDeathData=3;//死亡元素列表
            if (this.m_bIsDestroy)
                return;
            for (var _i = 0, _a = body.warDeathData; _i < _a.length; _i++) {
                var deathData = _a[_i];
                var elementId = deathData.elementId;
                var isDeath = deathData.isDeath;
                var isDeathSoldier = BattleModel.isSoldierDie(elementId);
                Utils.TimerManager.doTimer(1500, 1, this.removeUnit, this, null, null, elementId);
                for (var _b = 0, _c = deathData.soldierElementId; _b < _c.length; _b++) {
                    var soldierId = _c[_b];
                    this.soldierEscape(soldierId);
                }
            }
        };
        BattleMap.prototype.removeUnit = function (dt, elementId) {
            if (this.m_bIsDestroy)
                return;
            if (this.m_pSceneMgr && this.m_pSceneMgr.removeUnitObj) {
                var unit = BattleModel.getUnit(elementId);
                if (unit && unit.type != UnitType.BUILDING_WALL && unit.type != UnitType.BUILDING_BARTIZAN) {
                    this.m_pSceneMgr.removeUnitObj(elementId);
                    BattleModel.removeUnit(elementId);
                }
            }
        };
        BattleMap.prototype.addBuff = function (body) {
            if (this.m_bIsDestroy)
                return;
            for (var _i = 0, _a = body.buffData; _i < _a.length; _i++) {
                var buffdata = _a[_i];
                com_main.BattleSkillMgr.getInstance().addBuff(buffdata);
            }
        };
        BattleMap.prototype.removeBuff = function (body) {
            debug("removeBuff~~~~~~~~~~~~~~~~~~~~~~~~~~~", body);
            if (this.m_bIsDestroy)
                return;
            for (var _i = 0, _a = body.buffData; _i < _a.length; _i++) {
                var buffdata = _a[_i];
                var buId = (buffdata >> 17) & 0x3fff;
                var buffId = (buffdata >> 3) & 0x3fff;
                com_main.BattleSkillMgr.getInstance().removeBuff(buId, buffId);
            }
        };
        BattleMap.prototype.stopAllSoldier = function () {
            if (this.m_bIsDestroy)
                return;
            var csquareList = this.m_pSceneMgr.getDynamicObjs();
            for (var i in csquareList) {
                var csquare = csquareList[i];
                if (csquare.isLive && csquare.changeStatus) {
                    csquare.changeStatus(CSquare_Status.STATUS_STAND);
                }
            }
        };
        BattleMap.NAME = "BattleMap";
        /**
         * 测试
         */
        BattleMap.m_pAnimations = {};
        return BattleMap;
    }(com_main.BaseMap));
    com_main.BattleMap = BattleMap;
})(com_main || (com_main = {}));
