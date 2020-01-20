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
var VoBuffOnSkill = /** @class */ (function (_super_1) {
    __extends(VoBuffOnSkill, _super_1);
    //BUFF 目标元素ID(14位)+buffId(14位)+buffSysId(20位)+buff触发时间类型(0攻击前 1攻击后)（1位）+取消buffId(14位)
    function VoBuffOnSkill(data) {
        var _this = _super_1.call(this) || this;
        _this.init(data);
        return _this;
    }
    VoBuffOnSkill.prototype.init = function (data) {
        this.buId = data.elementId;
        this.bufId = data.buffId;
        this.bufSysId = data.buffSysId;
        this.happenTime = data.isAttackAfter;
        this.removeBufId = data.unBuff;
        // debugBatt("技能BUFF >> ", this.buId, this.bufId, this.bufSysId, this.happenTime, this.removeBufId);
        debugSkill("技能BUFF >> buffid:" + this.bufSysId, "目标id：" + this.buId, "触发时间:" + this.happenTime + "取消buffid" + this.removeBufId);
    };
    VoBuffOnSkill.prototype.onDestroy = function () {
        this.buId = 0;
        this.bufId = 0;
        this.bufSysId = 0;
        this.happenTime = 0;
        this.removeBufId = 0;
    };
    return VoBuffOnSkill;
}(BaseClass));
var VoBuffOnSceneEff = /** @class */ (function (_super_1) {
    __extends(VoBuffOnSceneEff, _super_1);
    //场景BUFF buffId(14位)+buffSysId(22位)+buff触发时间类型(0攻击前 1攻击后)（1位）+中心点（不一定有，X（8位）Z（7位））
    function VoBuffOnSceneEff(data) {
        var _this = _super_1.call(this) || this;
        _this.pos = { x: 0, y: 0 };
        _this.init(data);
        return _this;
    }
    VoBuffOnSceneEff.prototype.init = function (data) {
        this.bufId = data.buffId;
        this.bufSysId = data.buffSysId;
        this.happenTime = data.isAttackAfter;
        var position = ISOMap.getInstance().leftDownCellToPixel(data.x, data.y);
        this.pos.x = position[0];
        this.pos.y = position[1];
        // pos = FightPointConvert.convertServerDataMinus2(posx, posy, ModelFight.GRID_SIZE_X / 2, ModelFight.GRID_SIZE_Y / 2);
        debugBatt("场景BUFF >> ", this.bufId, this.bufSysId, this.happenTime, this.pos.x, this.pos.y);
    };
    VoBuffOnSceneEff.prototype.onDestroy = function () {
        this.bufId = 0;
        this.bufSysId = 0;
        this.happenTime = 0; //触发时间 (1攻击前 ，2攻击后)
        this.pos = { x: 0, y: 0 };
    };
    return VoBuffOnSceneEff;
}(BaseClass));
