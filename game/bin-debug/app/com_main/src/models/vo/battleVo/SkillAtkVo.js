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
/**攻击技能信息 */
var SkillAtkVo = /** @class */ (function (_super_1) {
    __extends(SkillAtkVo, _super_1);
    function SkillAtkVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    SkillAtkVo.create = function (body, flowTime) {
        var obj = ObjectPool.pop(SkillAtkVo, "SkillAtkVo", body);
        obj.flowTime = flowTime;
        return obj;
    };
    SkillAtkVo.prototype.init = function (attackInfo) {
        this.skillId = (attackInfo.skillData >> 10) & 0x1fffff;
        this.attIndex = (attackInfo.skillData >> 6) & 0xf;
        this.attIndexChild = (attackInfo.skillData >> 2) & 0xf;
        this.isSwingSkill = (attackInfo.skillData >> 1) & 0x1;
        this.isFlyWord = (attackInfo.skillData & 0x1) > 0;
        this.targetDataArr = [];
        this.attackData = ObjectPool.pop(VoAttackData, "VoAttackData", attackInfo.attacker, attackInfo.attackerTroops);
        if (DEBUG) {
            debugBatt("技能开始打印~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            var str = "";
            if (this.isSwingSkill) {
                str = "前摇";
            }
            else {
                str = "后摇";
            }
            var unit = BattleModel.getUnit(this.attackData.id);
            if (!unit) {
                return;
            }
            debugBatt("攻击者id = " + this.attackData.id + "," + str, "名字:", unit.getName(), "当前血量 " + this.attackData.hp, "当前怒气  " + this.attackData.angry, str + "技能id  = " + this.skillId);
        }
        if (attackInfo.warTarget != null) {
            for (var _i = 0, _a = attackInfo.warTarget; _i < _a.length; _i++) {
                var target = _a[_i];
                var targetdata = ObjectPool.pop(VoTargetData, "VoTargetData", target);
                this.targetDataArr.push(targetdata);
                // battleDebug("targetId ,hp   attackHurt = ",targetdata.id,targetdata.hp,targetdata.attackHurt);
                if (DEBUG) {
                    var targetunit = BattleModel.getUnit(targetdata.id);
                    if (targetunit) {
                        debugBatt("攻击者id = " + this.attackData.id + "," + str, " 受击:id = " + targetdata.id + targetunit.getName(), str + "技能id  = " + this.skillId, "攻击伤害:" + targetdata.attackHurt, "目标血量：" + targetdata.hp, "当前怒气  " + targetdata.angry);
                    }
                    else {
                        debugBatt("攻击者id = " + this.attackData.id + "," + str, " 受击:id = " + targetdata.id, str + "技能id  = " + this.skillId, "攻击伤害:" + targetdata.attackHurt, "目标血量：" + targetdata.hp);
                    }
                }
            }
        }
        /**召唤物列表 */
        this.callCombatUnit = attackInfo.callCombatUnit;
        var tempPos = attackInfo.centerPoint;
        this.effPosArr = [];
        for (var _b = 0, tempPos_1 = tempPos; _b < tempPos_1.length; _b++) {
            var pos = tempPos_1[_b];
            var posx1 = (pos >> 16) & 0xff;
            var posy1 = (pos >> 0) & 0x7f;
            var position = ISOMap.getInstance().leftDownCellToPixel(posx1 / 2, posy1 / 2);
            this.effPosArr.push({ x: position[0], y: position[1] });
        }
        for (var _c = 0, _d = attackInfo.buff; _c < _d.length; _c++) {
            var buff = _d[_c];
            var bufdata = ObjectPool.pop(VoBuffOnSkill, "VoBuffOnSkill", buff);
            if (bufdata.happenTime == 1) {
                if (!this.add_buff_after) {
                    this.add_buff_after = [];
                }
                this.add_buff_after.push(bufdata);
            }
            else {
                if (!this.add_buff_before) {
                    this.add_buff_before = [];
                }
                this.add_buff_before.push(bufdata);
            }
            BattleModel.addBuff({ buffId: bufdata.bufId, elementId: bufdata.buId, buffSysId: bufdata.bufSysId });
        }
        for (var _e = 0, _f = attackInfo.scenesBuff; _e < _f.length; _e++) {
            var scenesBuff = _f[_e];
            var bufdata = ObjectPool.pop(VoBuffOnSceneEff, "VoBuffOnSceneEff", scenesBuff);
            if (bufdata.happenTime == 1) {
                if (!this.add_scenebuff_after) {
                    this.add_scenebuff_after = [];
                }
                this.add_scenebuff_after.push(bufdata);
            }
            else {
                if (!this.add_scenebuff_before) {
                    this.add_scenebuff_before = [];
                }
                this.add_scenebuff_before.push(bufdata);
            }
        }
        this.frozenElement = attackInfo.frozenScenesElement;
        debugBatt("结束打印~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    };
    Object.defineProperty(SkillAtkVo.prototype, "targetList", {
        get: function () {
            return this.targetDataArr;
        },
        enumerable: true,
        configurable: true
    });
    SkillAtkVo.prototype.getTargetId = function () {
        if (this.targetDataArr[0]) {
            return this.targetDataArr[0].id;
        }
        debugBatt("没有攻击目标");
        return null;
    };
    SkillAtkVo.prototype.getOnePosition = function () {
        if (this.effPosArr.length > 1) {
            console.log("多特效技能");
            console.log("this.effPosArr = ", this.effPosArr);
        }
        if (this.effPosArr.length) {
            return this.effPosArr[0];
        }
        else {
            return;
        }
    };
    SkillAtkVo.prototype.onDestroy = function () {
        this.attackData.onDestroy();
        ObjectPool.push(this.attackData);
        for (var _i = 0, _a = this.targetDataArr; _i < _a.length; _i++) {
            var target = _a[_i];
            target.onDestroy();
            ObjectPool.push(target);
        }
        this.targetDataArr = null;
        if (this.add_buff_after) {
            for (var _b = 0, _c = this.add_buff_after; _b < _c.length; _b++) {
                var voBuff = _c[_b];
                voBuff.onDestroy();
                ObjectPool.push(voBuff);
            }
        }
        this.add_buff_after = null;
        if (this.add_buff_before) {
            for (var _d = 0, _e = this.add_buff_before; _d < _e.length; _d++) {
                var voBuff = _e[_d];
                voBuff.onDestroy();
                ObjectPool.push(voBuff);
            }
        }
        this.add_buff_before = null;
        if (this.add_scenebuff_after) {
            for (var _f = 0, _g = this.add_scenebuff_after; _f < _g.length; _f++) {
                var scenebuff = _g[_f];
                scenebuff.onDestroy();
                ObjectPool.push(scenebuff);
            }
        }
        this.add_scenebuff_after = null;
        if (this.add_scenebuff_before) {
            for (var _h = 0, _j = this.add_scenebuff_before; _h < _j.length; _h++) {
                var scenebuff = _j[_h];
                scenebuff.onDestroy();
                ObjectPool.push(scenebuff);
            }
        }
        this.add_scenebuff_before = null;
    };
    SkillAtkVo.prototype.getSkillConfig = function () {
        return SkillData.getSkillConfig(this.skillId);
    };
    return SkillAtkVo;
}(BaseClass));
