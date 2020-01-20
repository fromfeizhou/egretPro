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
/**战斗属性改变 */
var BattleUnitAttrChangeVo = /** @class */ (function (_super_1) {
    __extends(BattleUnitAttrChangeVo, _super_1);
    function BattleUnitAttrChangeVo(body) {
        var _this = _super_1.call(this) || this;
        /**仅在血量变化时有效,造成单位血量变化的玩家ID(如果玩家不存在,则为-1) */
        //zb
        _this.changerPlayerId = 0;
        if (body) {
            _this.init(body);
        }
        else {
            _this.onDestroy();
        }
        return _this;
    }
    BattleUnitAttrChangeVo.create = function (body) {
        var obj = new BattleUnitAttrChangeVo(body);
        return obj;
    };
    BattleUnitAttrChangeVo.prototype.init = function (body) {
        var keys = ["unitId", "HP", "speed",
            "changerPlayerId", "skillId", "speedType",
            "armyMainType", "generalId", "result", "useSkillUnitId"];
        for (var ind in keys) {
            var key = keys[ind];
            var val = body[key];
            this[key] = val;
            if (val != undefined) {
                if (key == "changerPlayerId") {
                    //zb
                    // this[key] = Long.fromValue(val);
                    this[key] = val;
                }
            }
        }
        var name = BattleModel.getUnitNameUnitId(body.unitId);
        if (!name) {
            return;
        }
        var useSkillname = BattleModel.getUnitNameUnitId(body.useSkillUnitId);
        var skillConfig = SkillData.getSkillConfig(this.skillId);
        var skillName = "未知";
        if (skillConfig) {
            skillName = skillConfig.name;
        }
        var loseHp = BattleModel.getUnit(body.unitId).getHp() - this.HP[0];
        var resultType = "";
        if (this.result == AttackResult.CRIT) {
            resultType = "暴击";
        }
        else if (this.result == AttackResult.DODGE) {
            resultType = "闪避";
        }
        else if (this.result == AttackResult.IMMUNE) {
            resultType = "免疫";
        }
        else if (this.result == AttackResult.DES_DEFENSE) {
            resultType = "破防";
        }
        else if (this.result == AttackResult.CRIT_ADD_DES_DEFENSE) {
            resultType = "暴击加破防";
        }
        console.log(useSkillname + "使用技能 " + skillName + "  打了 " + name + " " + loseHp + "血" + "  剩下 " + this.HP[0] + "血" + "  " + resultType);
    };
    BattleUnitAttrChangeVo.prototype.onDestroy = function () {
        this.unitId = null;
        this.HP = null;
        this.speed = null;
        this.changerPlayerId = null;
        this.skillId = null;
        this.speedType = null;
        this.armyMainType = null;
        this.generalId = null;
    };
    BattleUnitAttrChangeVo.prototype.getHp = function (ind) {
        if (ind === void 0) { ind = 0; }
        if (this.HP)
            return this.HP[ind];
        return 0;
    };
    return BattleUnitAttrChangeVo;
}(egret.HashObject));
