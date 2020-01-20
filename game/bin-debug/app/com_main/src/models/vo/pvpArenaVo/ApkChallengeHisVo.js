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
/**
 * 任务基本信息
 */
var ApkChallengeHisVo = /** @class */ (function (_super_1) {
    __extends(ApkChallengeHisVo, _super_1);
    function ApkChallengeHisVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    ApkChallengeHisVo.create = function (body) {
        var obj = new ApkChallengeHisVo(body);
        return obj;
    };
    ApkChallengeHisVo.prototype.init = function (body) {
        if (body) {
            var keys = ["playerId", "playerName", "head", "modifyRank", "force", "challengeTime", "challengeWin", "countryId"];
            for (var ind in keys) {
                var key = keys[ind];
                this[key] = body[key];
            }
        }
        else {
        }
    };
    ApkChallengeHisVo.prototype.onDestroy = function () {
    };
    return ApkChallengeHisVo;
}(BaseClass));
