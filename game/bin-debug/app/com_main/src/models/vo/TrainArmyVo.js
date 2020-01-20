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
var TrainArmyVo = /** @class */ (function (_super_1) {
    __extends(TrainArmyVo, _super_1);
    function TrainArmyVo(body) {
        var _this = _super_1.call(this) || this;
        _this.speedTime = 0;
        _this.init(body);
        return _this;
    }
    TrainArmyVo.create = function (body) {
        var vo = new TrainArmyVo(body);
        return vo;
    };
    TrainArmyVo.prototype.init = function (body) {
        var keys = ["bId", "armyType", "startTime", "endTime", "num", "speedTime"];
        for (var index in keys) {
            var key = keys[index];
            this[key] = body[key];
        }
    };
    TrainArmyVo.prototype.reset = function () {
        var keys = ["bId", "armyType", "startTime", "endTime", "num", "speedTime"];
        for (var index in keys) {
            var key = keys[index];
            this[key] = null;
        }
    };
    TrainArmyVo.prototype.onDestroy = function () {
    };
    return TrainArmyVo;
}(egret.HashObject));
