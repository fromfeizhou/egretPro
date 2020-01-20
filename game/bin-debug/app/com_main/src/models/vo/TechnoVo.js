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
 * 科技信息
 */
var TechnoVo = /** @class */ (function (_super_1) {
    __extends(TechnoVo, _super_1);
    function TechnoVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    TechnoVo.create = function (body) {
        var obj = new TechnoVo(body);
        return obj;
    };
    TechnoVo.prototype.init = function (body) {
        if (body)
            this.parseKeys(body);
        this.techCfg = C.TechnologyConfig[this.id] || C.TechnologyConfig[1];
        // this.techLvlCfg = C.TechnologyLevelConfig[this.id] || C.TechnologyLevelConfig[1];
        this.techLvlCfg = TechnoModel.getTechnoLvCfg(this.id, this.level);
        this.techEffCfg = C.TechnologyEffectConfig[this.id] || C.TechnologyEffectConfig[1];
        this.type = this.techCfg.type;
    };
    /**更新数据 */
    TechnoVo.prototype.update = function (body) {
        this.parseKeys(body);
        com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.id);
    };
    /**解析服务器协议 */
    TechnoVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, TechnoVo.AttriKey);
        this.parseAddVal();
    };
    /**解析加成 */
    TechnoVo.prototype.parseAddVal = function () {
        if (this.level == 0)
            return;
        var cfg = TechnoModel.getTechnoLvCfg(this.id, this.level);
        if (isNull(cfg))
            return;
        var res = StringUtils.keyValsToNumberArray(cfg.effect);
        if (res.length > 0) {
            var keyVal = res[0];
            var attCfg = C.TechnologyEffectConfig[keyVal.key];
            this.addMainType = attCfg.type;
            this.addSubType = attCfg.subType;
            this.addValType = attCfg.valType;
            this.addValue = this.addValType == 0 ? keyVal.value : keyVal.value / 10000;
        }
    };
    Object.defineProperty(TechnoVo.prototype, "maxLevel", {
        /**最大等级 */
        get: function () {
            return this.techCfg.maxLevel;
        },
        enumerable: true,
        configurable: true
    });
    /**是否满级 */
    TechnoVo.prototype.isMaxLevel = function () {
        return this.level >= this.techCfg.maxLevel;
    };
    Object.defineProperty(TechnoVo.prototype, "gidPos", {
        /**获取位置 */
        get: function () {
            return { row: this.techCfg.row, col: this.techCfg.col };
        },
        enumerable: true,
        configurable: true
    });
    TechnoVo.prototype.onDestroy = function () {
    };
    /**是否可以升级 */
    TechnoVo.prototype.canUpLevel = function () {
        if (this.isMaxLevel())
            return false;
        //等级限制
        var info = new com_main.LvUpConditionsBuildInfo(BuildingType.MINISTRY_DEFENCE, this.techLvlCfg.limitLv);
        if (!info.getIsCan())
            return false;
        //前置条件
        var limits = StringUtils.keyValsToNumberArray(this.techLvlCfg.limitTechs);
        for (var i = 0; i < limits.length; i++) {
            var info2 = new com_main.LvUpConditionsTechnologyInfo(limits[i].key, limits[i].value);
            if (!info2.getIsCan())
                return false;
        }
        //材料
        var itemCosts = Utils.parseCommonItemJson(this.techLvlCfg.consume);
        if (itemCosts) {
            for (var i = 0; i < itemCosts.length; i++) {
                var info3 = new com_main.LvUpConditionsBaseInfo(itemCosts[i].itemId, itemCosts[i].count);
                if (!info3.getIsCan())
                    return false;
            }
        }
        return true;
    };
    /**属性值 */
    TechnoVo.AttriKey = ["id", "level"];
    return TechnoVo;
}(egret.HashObject));
