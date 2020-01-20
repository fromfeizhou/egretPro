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
var VoAttackData = /** @class */ (function (_super_1) {
    __extends(VoAttackData, _super_1);
    function VoAttackData(attackerValue, atthp) {
        var _this = _super_1.call(this) || this;
        _this.init(attackerValue, atthp);
        return _this;
    }
    VoAttackData.prototype.init = function (attackerValue, atthp) {
        this.hp = atthp;
        this.id = attackerValue.elementId;
        this.angry = attackerValue.anger;
        this.isOffSet = attackerValue.isOffset;
        this.toPosX = attackerValue.offsetX;
        this.toPosY = attackerValue.offsetZ;
        this.way = attackerValue.direction;
        if (this.isOffSet > 0) {
            debug("攻击者移动  >> " + this.id + "  , toPosX:" + this.toPosX + "  , toPosY:" + this.toPosY);
        }
        // debugBatt("攻击者id  >> " + this.id);
    };
    VoAttackData.prototype.onDestroy = function () {
        this.id = 0;
        this.hp = 0;
        this.angry = 0;
        this.isOffSet = 0;
        this.toPosX = 0;
        this.toPosY = 0;
        this.way = 0;
    };
    return VoAttackData;
}(BaseClass));
