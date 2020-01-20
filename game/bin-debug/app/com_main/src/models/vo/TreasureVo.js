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
/**宝物信息 */
var TreasureVo = /** @class */ (function (_super_1) {
    __extends(TreasureVo, _super_1);
    function TreasureVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    TreasureVo.create = function (body) {
        var obj = new TreasureVo(body);
        return obj;
    };
    /**初始化 */
    TreasureVo.prototype.init = function (body) {
        this.parseData(body);
        this.updateHoleOpenNum();
        var treaCfg = C.TreasureConfig[this.itemId];
        if (treaCfg) {
            this.treaCfg = treaCfg;
            this.maxLevel = treaCfg.highLevel;
            this.generalTypes = JSON.parse(treaCfg.generalType);
            this.initSuitInfos();
        }
        this.parseLvCost();
        this.parseStarCost();
        this.initAttributeList();
        this.calculateFight();
    };
    /**销毁 */
    TreasureVo.prototype.onDestroy = function () {
    };
    /**数据更新 */
    TreasureVo.prototype.update = function (body) {
        this.parseData(body);
        this.parseLvCost();
        this.parseStarCost();
        this.updateHoleOpenNum();
        this.initAttributeList();
        this.calculateFight();
    };
    TreasureVo.prototype.parseData = function (body) {
        Utils.voParsePbData(this, body, TreasureVo.AttriKey, ['uuId']);
    };
    /**刷新孔位解锁数 */
    TreasureVo.prototype.updateHoleOpenNum = function () {
        var cfg = this.getStarCfg();
        if (cfg)
            this.holeOpenNum = cfg.unlockHole;
    };
    /**获得星级配置表 */
    TreasureVo.prototype.getStarCfg = function () {
        return TreasureModel.getStarCfg(this.star, this.quality);
    };
    /**序列化 属性列表*/
    TreasureVo.prototype.initAttributeList = function () {
        this.mainAttriList = StringUtils.keyValsToNumber(this.mainAttribute);
        this.mainAttris = StringUtils.keyValsToNumberArray(this.mainAttribute);
        Utils.sortAttriList(this.mainAttris);
        this.allAttriList = StringUtils.keyValsToNumber(this.allAttribute);
        this.allAttris = StringUtils.keyValsToNumberArray(this.allAttribute);
    };
    /**获得当前主属性列表 */
    TreasureVo.prototype.getMainAttriList = function () {
        return this.mainAttriList;
    };
    /**获得当前主属性数组 */
    TreasureVo.prototype.getMainAttris = function () {
        return this.mainAttris;
    };
    /**获得总属性 */
    TreasureVo.prototype.getAllAttriList = function () {
        return this.allAttriList;
    };
    /**获得总属性数组 */
    TreasureVo.prototype.getAllAttris = function () {
        return this.allAttris;
    };
    /**获得基础属性列表 */
    TreasureVo.prototype.getBaseAttris = function () {
        return StringUtils.keyValsToNumber(this.treaCfg.mainAttribute);
    };
    /**获得当前主属性 等级成长 */
    TreasureVo.prototype.getLevelGrowValues = function () {
        return TreasureModel.getMainAttris(this.itemId, this.level + 1, this.star, this.quality);
    };
    /**获得当前主属性 星级成长 */
    TreasureVo.prototype.getStarGrowValues = function () {
        return TreasureModel.getMainAttris(this.itemId, this.level, this.star + 1, this.quality);
    };
    /**获得孔位解锁星级 */
    TreasureVo.prototype.getStoneOpenStar = function (holeId) {
        return TreasureModel.getStoneOpenStar(this.quality, holeId);
    };
    /**是否达到等级上限 */
    TreasureVo.prototype.isMaxLevel = function () {
        return this.level >= this.maxLevel;
    };
    /**是否达到等级上限 */
    TreasureVo.prototype.isMaxStar = function () {
        return this.star >= TreasureModel.STAR_MAX;
    };
    /**是否可以装备 */
    TreasureVo.prototype.canEquipByType = function (type) {
        for (var i = 0; i < this.generalTypes.length; i++) {
            if (this.generalTypes[i] == type)
                return true;
        }
        return false;
    };
    /**计算战斗力 */
    TreasureVo.prototype.calculateFight = function () {
        this.fight = Utils.calculateNorFight(this.allAttriList);
    };
    /**根据属性名字获取属性值 */
    TreasureVo.prototype.getAllAttriValByName = function (type) {
        return Utils.getAttriValByType(this.allAttriList, type);
    };
    /**初始化宝石套装 */
    TreasureVo.prototype.initSuitInfos = function () {
        var suitStr = this.treaCfg.constitute.split(',');
        this.suitInfos = [];
        for (var i = 0; i < suitStr.length; i++) {
            var vals = suitStr[i].split('_');
            this.suitInfos.push({
                type: Number(vals[0]),
                exAttr: { key: Number(vals[1]), value: Number(vals[2]) }
            });
        }
    };
    /**获得宝物套装结构 */
    TreasureVo.prototype.getSuitInfos = function () {
        return this.suitInfos;
    };
    /**获取套装命中个数 */
    TreasureVo.prototype.getSuitLevel = function () {
        var level = 0;
        for (var _i = 0, _a = this.suitInfos; _i < _a.length; _i++) {
            var data = _a[_i];
            if (this.isInLayStone(data.type))
                level++;
        }
        return level;
    };
    /**是否存在指定类型石头 */
    TreasureVo.prototype.isInLayStone = function (type) {
        for (var i = 0; i < this.holes.length; i++) {
            var id = this.holes[i].gemstoneId;
            if (id > 0) {
                var stoneType = C.GemstoneConfig[this.holes[i].gemstoneId].type;
                if (stoneType == type)
                    return true;
            }
        }
        return false;
    };
    /**获得专属武将id */
    TreasureVo.prototype.getDedicatedGenId = function () {
        return this.treaCfg.exclusiveId;
    };
    /**专用武将激活 */
    TreasureVo.prototype.isInDedicatedGeneral = function () {
        if (this.treaCfg.exclusiveId == 0)
            return false;
        return this.generalId == this.treaCfg.exclusiveId;
    };
    /**获得宝物专用属性加成 */
    TreasureVo.prototype.getDedicatedAddList = function () {
        return StringUtils.keyValsToNumberArray(this.treaCfg.exclusiveAdd);
    };
    /**解析等级消耗 */
    TreasureVo.prototype.parseLvCost = function () {
        var lvCfg = C.TreasureLevelConfig[this.level];
        if (lvCfg) {
            this.lvConsume = Utils.parseCommonItemJson(lvCfg.consume);
        }
        else {
            this.lvConsume = null;
        }
    };
    /**解析升星消耗 */
    TreasureVo.prototype.parseStarCost = function () {
        var starCfg = TreasureModel.getStarCfg(this.star, this.quality);
        if (starCfg) {
            var res = [];
            res.push({ itemId: this.treaCfg.fragment, count: starCfg.fragmenNum });
            this.starConsume = res.concat(Utils.parseCommonItemJson(starCfg.consume));
        }
        else {
            this.starConsume = null;
        }
    };
    /**获得红点 */
    TreasureVo.prototype.getRedState = function (type) {
        if (type > 0) {
            switch (type) {
                case RedEvtType.TREA_STRENG:
                    return this.canStreng();
                case RedEvtType.TREA_STAR:
                    return this.canStar();
                case RedEvtType.TREA_INLAY:
                    return this.canInlay();
            }
        }
        else {
            var res = this.canStreng();
            if (!res)
                res = this.canStar();
            if (!res)
                res = this.canInlay();
            return res;
        }
        return false;
    };
    /**可强化 */
    TreasureVo.prototype.canStreng = function () {
        if (this.isMaxLevel())
            return false;
        var cfg = this.getStarCfg();
        if (!cfg || this.level >= cfg.levelLimit)
            return false;
        if (this.lvConsume && PropModel.isItemListEnough(this.lvConsume, 0)) {
            return true;
        }
        return false;
    };
    /**可升星 */
    TreasureVo.prototype.canStar = function () {
        if (this.isMaxStar())
            return false;
        if (this.starConsume && PropModel.isItemListEnough(this.starConsume, 0)) {
            return true;
        }
        return false;
    };
    /**可镶嵌 */
    TreasureVo.prototype.canInlay = function () {
        var count = 0;
        for (var i = 0; i < this.holes.length; i++) {
            var id = this.holes[i].gemstoneId;
            if (id > 0) {
                count++;
            }
        }
        if (this.holeOpenNum > count) {
            var list = PropModel.getGemList(PropStoneType.ALL);
            if (list.length > 0)
                return true;
        }
        return false;
    };
    /**属性值 */
    TreasureVo.AttriKey = ["itemId", "mainAttribute", "allAttribute", "quality", "level", "generalId", "star", "holes", 'secondAttrId'];
    return TreasureVo;
}(BaseClass));
