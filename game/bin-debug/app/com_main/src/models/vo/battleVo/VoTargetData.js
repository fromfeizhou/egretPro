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
var VoTargetMoveData = /** @class */ (function () {
    function VoTargetMoveData(xy) {
        this.moveType = (xy >> 27) & 0xf;
        this.movePosX = (xy >> 19) & 0xff;
        this.movePosY = (xy >> 12) & 0x7f;
    }
    return VoTargetMoveData;
}());
var VoTargetData = /** @class */ (function (_super_1) {
    __extends(VoTargetData, _super_1);
    // /**反弹伤害 */
    // public reboundDamage: number;
    // /**吸收伤害 */
    // public absorbHurt: number;
    // /**克制 */
    // public restrain: number;
    function VoTargetData(target) {
        var _this = _super_1.call(this) || this;
        _this.moveData = null;
        _this.init(target);
        return _this;
    }
    VoTargetData.prototype.init = function (target) {
        this.hp = target.troops;
        this.attackHurt = target.hurt;
        //战斗数值 目标元素ID(14位)+攻击状态（4位）+目标当前怒气(武将才有)（7位）+是否间接（1位）[1暴击 ,2闪避 ,3 免疫, 4破防, 5暴击+破防]
        this.id = (target.value >> 17) & 0x3fff;
        this.attackStatus = (target.value >> 13) & 0xf;
        this.angry = (target.value >> 6) & 0x7f;
        this.isDirectHurt = (target.value >> 5) & 0x1;
        if (target.xy > 0) {
            this.moveData = new VoTargetMoveData(target.xy);
        }
        if (this.attackStatus == 0 && target.ext) {
            if (target.ext.reboundHurt > 0) {
                this.attackStatus = AttackResult.REBOUND;
            }
            if (target.ext.absorbHurt > 0) {
                this.attackStatus = AttackResult.ABSORB;
            }
            if (target.ext.restrain > 0) {
                this.attackStatus = AttackResult.RESTRAIN;
            }
            // this.reboundDamage = target.ext.reboundHurt;
            // this.absorbHurt = target.ext.absorbHurt;
            // this.restrain = target.ext.restrain;
        }
    };
    VoTargetData.prototype.onDestroy = function () {
        this.hp = 0;
        this.attackHurt = 0;
        this.id = 0;
        this.attackStatus = 0;
        this.angry = 0;
        this.isDirectHurt = 0;
        this.moveData = null;
        // this.reboundDamage = 0;
        // this.absorbHurt = 0;
        // this.restrain = 0;
    };
    return VoTargetData;
}(BaseClass));
