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
/** 战场信息 */
var BattleInfoVo = /** @class */ (function (_super_1) {
    __extends(BattleInfoVo, _super_1);
    function BattleInfoVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    BattleInfoVo.create = function (body) {
        var obj = new BattleInfoVo(body);
        return obj;
    };
    BattleInfoVo.prototype.init = function (body) {
        var keys = [
            "battleId", "warType", "continueTime", "terrainId", "cityId", "roundNumber", "guideId", "warContinueTime", "atkArrogance", "defArrogance"
        ];
        for (var ind in keys) {
            var key = keys[ind];
            if (key == "battleId") {
                //zb
                this[key] = body[key];
            }
            else {
                this[key] = body[key];
            }
        }
        this.endTime = TimerUtils.getServerTimeMill() + (120 - this.warContinueTime) * 1000;
    };
    BattleInfoVo.prototype.setTimeStart = function () {
        if (!this.warContinueTime) {
            this.warContinueTime = 0.01;
            this.endTime = TimerUtils.getServerTimeMill() + (120 - this.warContinueTime) * 1000;
        }
    };
    BattleInfoVo.prototype.onDestroy = function () {
    };
    return BattleInfoVo;
}(egret.HashObject));
