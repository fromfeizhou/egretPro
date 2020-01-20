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
 * 工会科技
 */
var LegionTeachVo = /** @class */ (function (_super_1) {
    __extends(LegionTeachVo, _super_1);
    function LegionTeachVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    LegionTeachVo.create = function (body) {
        var obj = new LegionTeachVo(body);
        return obj;
    };
    LegionTeachVo.prototype.onDestroy = function () {
    };
    LegionTeachVo.prototype.init = function (body) {
        this.parseKeys(body);
    };
    /**更新数据 */
    LegionTeachVo.prototype.update = function (body) {
        this.parseKeys(body);
    };
    /**解析服务器协议 */
    LegionTeachVo.prototype.parseKeys = function (body) {
        var keys = LegionTeachVo.AttriKey;
        Utils.voParsePbData(this, body, LegionTeachVo.AttriKey);
        this.cfg = LegionModel.getTechCfgById(this.id);
        /**对应科技类型 数据更新 */
        com_main.EventMgr.dispatchEvent(LegionEvent.LEGION_TECH_UPDATE, this.type);
    };
    Object.defineProperty(LegionTeachVo.prototype, "level", {
        /**等级 */
        get: function () {
            return this.cfg.level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegionTeachVo.prototype, "name", {
        /**名字 */
        get: function () {
            return GLan(this.cfg.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegionTeachVo.prototype, "des", {
        /**描述 */
        get: function () {
            return GLan(this.cfg.describe);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegionTeachVo.prototype, "nextDes", {
        /**next level描述 */
        get: function () {
            var nextcfg = LegionModel.getTechCfgById(this.nextId);
            if (nextcfg)
                return GLan(nextcfg.describe);
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegionTeachVo.prototype, "maxExp", {
        /**升级经验 */
        get: function () {
            return this.cfg.exp > 0 ? this.cfg.exp : -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegionTeachVo.prototype, "nextId", {
        /**下一级id */
        get: function () {
            return this.cfg.nexttechID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegionTeachVo.prototype, "nextCfg", {
        get: function () {
            return LegionModel.getTechCfgById(this.nextId);
        },
        enumerable: true,
        configurable: true
    });
    /**属性值 */
    LegionTeachVo.AttriKey = ["id", "exp", "type"];
    return LegionTeachVo;
}(BaseClass));
