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
    /**
     * Created by leowang on 2016/12/20
     */
    var BattleSkillMgr = /** @class */ (function (_super_1) {
        __extends(BattleSkillMgr, _super_1);
        function BattleSkillMgr() {
            return _super_1.call(this) || this;
        }
        BattleSkillMgr.prototype.init = function () {
            this.m_bIsDestroy = false;
            this.m_pSceneMgr = com_main.BattleSceneMgr.getInstance();
            this.m_pFrameBuff = FrameExecutor.create();
        };
        BattleSkillMgr.prototype.onDestroy = function () {
            this.m_bIsDestroy = true;
            this.m_pMapView = null;
            this.m_pSceneMgr = null;
            Utils.TimerManager.removeAll(this);
        };
        BattleSkillMgr.prototype.setMapView = function (view) {
            this.m_pMapView = view;
        };
        /**战斗单位攻击 */
        BattleSkillMgr.prototype.unitActack = function (avo) {
            if (this.m_bIsDestroy)
                return;
            if (!this.m_pMapView || !avo)
                return;
            var obj = this.m_pSceneMgr.getDynamicObj(avo.attackData.id);
            // if(obj.getUnitInfo().type == UnitType.BUILDING_BARTIZAN){
            // 	console.log(obj.getUnitInfo().generalName,avo);
            // }
            var unitInfo = BattleModel.getUnit(avo.attackData.id);
            if (!obj)
                return;
            if (unitInfo && unitInfo.type == UnitType.GENERAL && unitInfo.faction == FactionType.ATK) {
                //刷新攻击者信息
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, { id: avo.attackData.id, hp: avo.attackData.hp, rage: avo.attackData.angry, flowTime: avo.flowTime });
                // debugBatt(" rage = ",avo.attackData.angry);
            }
            /**前摇 播放攻击特效 */
            if (avo.isSwingSkill) {
                this.playSkillFron(avo);
            }
            else {
                this.skillEnd(avo);
            }
            if (avo.add_buff_before) {
                for (var _i = 0, _a = avo.add_buff_before; _i < _a.length; _i++) {
                    var buff = _a[_i];
                    this.addBuffEffect(buff);
                }
            }
            // if(avo.add_buff_after){
            // 	for(let buff of avo.add_buff_after){
            // 		this.addBuffEffect(buff);
            // 	}
            // }
            /**冻结场景 */
            if (avo.frozenElement) {
                this.m_pSceneMgr.stopSquareAction(avo.frozenElement.time);
            }
            //vo回收
            if (avo.isSwingSkill) {
                avo.onDestroy();
                ObjectPool.push(avo);
            }
            else {
                var skilldata = avo.getSkillConfig();
                if (skilldata.skillType == SkillType.SKILL_NONE) {
                    avo.onDestroy();
                    ObjectPool.push(avo);
                }
            }
        };
        BattleSkillMgr.prototype.addBuffEffect = function (body) {
            if (this.m_bIsDestroy)
                return;
            this.m_pFrameBuff.regist(this.onAddBuffEffect, this, body);
            if (!this.m_pFrameBuff.isExecute()) {
                this.m_pFrameBuff.execute();
            }
        };
        BattleSkillMgr.prototype.onAddBuffEffect = function (body) {
            if (this.m_bIsDestroy)
                return;
            var csquare = this.m_pSceneMgr.getDynamicObj(body.buId, com_main.CSquare);
            if (csquare) {
                csquare.addBuff(body.bufSysId);
            }
            if (body.removeBufId > 0) {
                this.removeBuff(body.buId, body.removeBufId);
            }
        };
        BattleSkillMgr.prototype.addBuff = function (body) {
            if (this.m_bIsDestroy)
                return;
            var csquare = this.m_pSceneMgr.getDynamicObj(body.elementId, com_main.CSquare);
            if (csquare) {
                csquare.addBuff(body.buffSysId);
            }
        };
        BattleSkillMgr.prototype.removeBuff = function (buId, buffId) {
            if (this.m_bIsDestroy)
                return;
            // let buId = (buffData >> 17) & 0x3fff;
            // let buffId = (buffData >> 3) & 0x3fff;
            var data = BattleModel.getBuff(buffId);
            if (!data) {
                return;
            }
            var csquare = this.m_pSceneMgr.getDynamicObj(buId, com_main.CSquare);
            if (csquare) {
                csquare.removeBuff(data.buffSysId);
            }
        };
        /** */
        BattleSkillMgr.prototype.getPosByUnitId = function (unitId) {
            if (this.m_bIsDestroy)
                return;
            var tsquare = this.m_pSceneMgr.getDynamicObj(unitId);
            if (tsquare)
                return tsquare.position;
            return null;
        };
        /**发射技能 */
        BattleSkillMgr.prototype.skillFight = function (data) {
            var _this = this;
            if (this.m_bIsDestroy)
                return;
            var launchPos;
            if (data.attack.getUnitInfo().type == UnitType.BUILDING_BARTIZAN) {
                launchPos = { launchX: 0, launchY: -180, launchDeleyTime: 0 };
            }
            else {
                launchPos = data.attack.getLaunchPos();
            }
            data.spos.x += launchPos.launchX;
            data.spos.y += launchPos.launchY;
            Utils.TimerManager.doTimer(launchPos.launchDeleyTime, 1, function () {
                _this.launchBullet(data.bulletId, data.spos, data.tpos);
            }, this);
        };
        /**发射子弹 */
        BattleSkillMgr.prototype.launchBullet = function (bulletId, cpos, tpos, launchPos, index) {
            if (launchPos === void 0) { launchPos = { "launchX": 0, "launchY": 0 }; }
            if (this.m_bIsDestroy)
                return;
            var bullet = com_main.CBulletMgr.getIns().getBullet(1, bulletId, null);
            bullet.addPath(cpos, tpos);
            bullet.returnPos = cpos;
            this.m_pSceneMgr.addChildToSuspension(bullet);
            bullet.start();
        };
        /**技能前摇 */
        BattleSkillMgr.prototype.playSkillFron = function (avo) {
            if (this.m_bIsDestroy)
                return;
            if (!this.m_pMapView || !avo)
                return;
            var obj = this.m_pSceneMgr.getDynamicObj(avo.attackData.id);
            var targetId = avo.getTargetId();
            // if(obj.getUnitInfo().type == UnitType.BUILDING_BARTIZAN){
            // 	debugSkill("箭塔攻击~~~~~~~~~~~~~~~~~~~~~~~");
            // }
            var targetObj;
            if (targetId) {
                targetObj = this.m_pSceneMgr.getDynamicObj(targetId);
            }
            if (!targetObj) {
                debugBatt("找不到 攻击目标单位");
                targetObj = obj;
                // return ;
            }
            if (!obj)
                return;
            //第二段伤害段不播放技能名
            if (avo.attIndex > 0) {
                // obj.startSkillEffect();
                return;
            }
            var skilldata = avo.getSkillConfig();
            if (Utils.isGeneralObj(obj)) {
                var csquare = obj;
                csquare.setSkillAtk(avo);
                var _a = obj.getMapXY(), x = _a[0], y = _a[1];
                var pos = new egret.Point(x, y - 45);
                var cpos = pos;
                var tpos = new egret.Point(targetObj.x, targetObj.y - 45);
                if (targetObj.getUnitInfo().type == UnitType.BUILDING_WALL) {
                    // console.log("攻击城墙!!!");
                    tpos = new egret.Point(1177, 600.5);
                }
                //转朝向
                csquare.setDirectionOnPos(cpos, tpos);
                if (skilldata) {
                    /**普通攻击 */
                    if (skilldata.skillType == SkillType.SKILL_NONE) {
                        csquare.changeStatus(CSquare_Status.STATUS_ATTACK);
                    }
                    else if (skilldata.skillType == SkillType.SKILL_ACTIVE) {
                        // debugBatt("前摇 技能id   = ",avo.skillId);
                        var battleMap = this.m_pMapView;
                        battleMap.showSkillNameEffect(avo, csquare);
                        // csquare.startSkill(skilldata.skillEffectId)
                    }
                    else if (skilldata.skillType == SkillType.SKILL_PASSIVE) {
                        //被动技能
                        // console.log("被动技能 ~~~~~~~~~~~~~~~~~~~~~",avo.skillId);
                        csquare.startEnterSkill(avo);
                    }
                    else if (skilldata.skillType == SkillType.SKILL_ZHAOHUAN) {
                        //召唤物技能
                        // console.log("召唤物技能 ~~~~~~~~~~~~~~~~~~~~~",avo.skillId);
                    }
                    //有子弹的攻击
                    if (skilldata.bulletId) {
                        this.skillFight({ bulletId: skilldata.bulletId, spos: cpos, tpos: tpos, attack: csquare });
                    }
                }
                else {
                    debug("BattleSkillMgr:unitActack------>>找不到技能信息 uid, skillid:", csquare.getId(), avo.skillId);
                }
            }
            if (obj.getUnitInfo().type == UnitType.BUILDING_BARTIZAN) {
                var cpos = new egret.Point(obj.x, obj.y - 38);
                var tpos = new egret.Point(targetObj.x, targetObj.y - 38);
                if (skilldata.bulletId) {
                    // 屏幕变色因为这行代码
                    // this.skillFight({bulletId:skilldata.bulletId,spos:cpos,tpos:tpos,attack:obj});
                    this.skillFight({ bulletId: 1, spos: cpos, tpos: tpos, attack: obj });
                }
                this.skillEnd(avo);
            }
        };
        /**技能后摇
         * 主要是处理掉血 buff之类的
         */
        BattleSkillMgr.prototype.skillEnd = function (avo) {
            if (this.m_bIsDestroy)
                return;
            if (!this.m_pMapView)
                return;
            var attackObj = this.m_pSceneMgr.getDynamicObj(avo.attackData.id);
            var skilldata = avo.getSkillConfig();
            // 大招技能
            if (skilldata.skillType == SkillType.SKILL_ACTIVE) {
                this.m_pSceneMgr.playSkill(avo);
                return;
            }
            /**处理血量显示 */
            var tList = avo.targetList;
            for (var _i = 0, tList_1 = tList; _i < tList_1.length; _i++) {
                var target = tList_1[_i];
                var targetObj = this.m_pSceneMgr.getDynamicObj(target.id);
                if (!targetObj) {
                    debugBatt("skillEnd  找不到 显示对象");
                    continue;
                }
                /**显示武将攻击的血量 */
                if ((attackObj.getUnitInfo().type == UnitType.BUILDING_BARTIZAN || attackObj.getUnitInfo().type == UnitType.GENERAL)
                    && target.attackHurt != -1 && skilldata.skillType == SkillType.SKILL_NONE) {
                    targetObj.changeHp(target.hp, target.attackHurt, true, false, target.attackStatus);
                    // this.dealAttackStatus(target,targetObj);
                }
                else {
                    targetObj.changeHp(target.hp, target.attackHurt, false);
                }
                // if(targetObj.getUnitInfo().type == UnitType.BUILDING_BARTIZAN){
                // 	//箭塔掉血
                // 	this.dealTower(target.id,target.hp);
                // 	continue ;
                // }
                // if(targetObj.getUnitInfo().type == UnitType.BUILDING_WALL){
                // 	//城墙
                // 	this.dealWall(target.id,target.hp);
                // 	continue ;
                // }
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_BLOOD_CHANGE, { id: target.id, hp: target.hp, flowTime: avo.flowTime });
                this.dealMoveData(target, targetObj);
            }
        };
        /**处理击飞击退 */
        BattleSkillMgr.prototype.dealMoveData = function (target, targetObj) {
            if (this.m_bIsDestroy)
                return;
            if (target.moveData) {
                var position = ISOMap.getInstance().leftDownCellToPixel(target.moveData.movePosX, target.moveData.movePosY);
                if (target.moveData.moveType == EnumHurtMoveType.JF) {
                    targetObj.hitFlyToPos(position[0], position[1]);
                }
                else if (target.moveData.moveType == EnumHurtMoveType.JT_BACK) {
                    targetObj.hitBackToPos(position[0], position[1]);
                }
            }
        };
        /**处理 反弹 吸收 克制 */
        // public dealAttackStatus(target: VoTargetData, targetObj:CSquare){
        // 	debug("dealAttackStatus");
        // 	debug("反弹~",target.reboundDamage);
        // 	debug("吸收~",target.absorbHurt);
        // 	debug("克制~",target.restrain);
        // 	if(!targetObj.showAttackStatus) {
        // 		return;
        // 	}
        // 	//反弹
        // 	if(target.reboundDamage > 0){
        // 		targetObj.showAttackStatus(AttackResult.REBOUND);
        // 	}
        // 	//吸收
        // 	if(target.absorbHurt > 0){
        // 		targetObj.showAttackStatus(AttackResult.ABSORB);
        // 	}
        // 	//克制
        // 	if(target.restrain > 0){
        // 		targetObj.showAttackStatus(AttackResult.RESTRAIN,target.restrain);
        // 	}
        // }
        BattleSkillMgr.prototype.dealWall = function (id, hp) {
            // let unitInfo = BattleModel.getUnit(id);
            if (this.m_bIsDestroy)
                return;
            var matrixUnitobj = this.m_pSceneMgr.getDynamicObj(id);
            if (!matrixUnitobj) {
                return;
            }
            var unitInfo = matrixUnitobj.getUnitInfo();
            if (unitInfo && unitInfo.type == UnitType.BUILDING_WALL) {
                var per = hp / unitInfo.maxTroops;
                if (hp == 0) {
                    this.m_pSceneMgr.playWallEffect(5, matrixUnitobj);
                }
                else if (per < 0.33) {
                    this.m_pSceneMgr.playWallEffect(4);
                }
                else if (per < 0.66) {
                    this.m_pSceneMgr.playWallEffect(3);
                }
                else {
                    this.m_pSceneMgr.playWallEffect(2);
                }
            }
        };
        BattleSkillMgr.prototype.dealTower = function (id, hp) {
            if (this.m_bIsDestroy)
                return;
            if (hp > 0)
                return;
            var matrixUnitobj = this.m_pSceneMgr.getDynamicObj(id);
            if (!matrixUnitobj) {
                return;
            }
            var unitvo = matrixUnitobj.getUnitInfo();
            var _a = unitvo.cellXY, cellX = _a[0], cellY = _a[1];
            // let tower1 = BBuildTower.create(unitvo);
            cellY == 25 ? this.m_pSceneMgr.playTowerFire(1) : this.m_pSceneMgr.playTowerFire(2);
        };
        return BattleSkillMgr;
    }(BaseClass));
    com_main.BattleSkillMgr = BattleSkillMgr;
})(com_main || (com_main = {}));
