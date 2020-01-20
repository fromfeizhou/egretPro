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
var ApkRankVo = /** @class */ (function (_super_1) {
    __extends(ApkRankVo, _super_1);
    function ApkRankVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    ApkRankVo.create = function (body) {
        var obj = new ApkRankVo(body);
        return obj;
    };
    ApkRankVo.prototype.init = function (body) {
        if (body) {
            var keys = ["playerId", "playerName", "head", "rank", "force", "generalWinInfo", "countryId"];
            for (var ind in keys) {
                var key = keys[ind];
                this[key] = body[key];
            }
        }
    };
    ApkRankVo.prototype.setReward = function () {
        if (this.rank) {
            for (var key in C.ApkRankAwardConfig) {
                var cfg = C.ApkRankAwardConfig[key];
                if (cfg.minRank <= this.rank && cfg.maxRank >= this.rank) {
                    this.rewardList = Utils.parseCommonItemJson(cfg.reward);
                }
            }
        }
        else {
        }
    };
    ApkRankVo.prototype.onDestroy = function () {
    };
    return ApkRankVo;
}(BaseClass));
