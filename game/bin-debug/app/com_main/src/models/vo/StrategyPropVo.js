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
var StrategyPropVo = /** @class */ (function (_super_1) {
    __extends(StrategyPropVo, _super_1);
    function StrategyPropVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    StrategyPropVo.create = function (body) {
        var vo = new StrategyPropVo(body);
        return vo;
    };
    StrategyPropVo.prototype.init = function (body) {
        var keys = ["id", "startTime", "endTime", "index"];
        for (var index in keys) {
            var key = keys[index];
            this[key] = body[key];
        }
    };
    StrategyPropVo.prototype.reset = function () {
        var keys = ["id", "startTime", "endTime"];
        for (var index in keys) {
            var key = keys[index];
            this[key] = null;
        }
    };
    StrategyPropVo.prototype.onDestroy = function () {
    };
    return StrategyPropVo;
}(egret.HashObject));
