var TreaType;
(function (TreaType) {
    TreaType[TreaType["ALL"] = 0] = "ALL";
    /**兵器 */
    TreaType[TreaType["WEAPON"] = 1] = "WEAPON";
    /**马匹 */
    TreaType[TreaType["RIDE"] = 2] = "RIDE";
    /**珍宝 */
    TreaType[TreaType["GEM"] = 3] = "GEM";
})(TreaType || (TreaType = {}));
/**宝物模块 */
var TreasureModel = /** @class */ (function () {
    function TreasureModel() {
    }
    /**模块初始化 */
    TreasureModel.init = function () {
        this.m_tTreaList = {};
        this.m_tPreTreaList = {};
    };
    /**清理 */
    TreasureModel.clear = function () {
        this.m_tTreaList = null;
    };
    /**初始化宝物列表 */
    TreasureModel.initDataList = function (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i]) {
                this.addData(list[i]);
            }
        }
    };
    /**添加宝物 */
    TreasureModel.addData = function (data) {
        var vo = TreasureVo.create(data);
        this.m_tTreaList[vo.itemId] = vo;
        com_main.EventMgr.dispatchEvent(TreaEvent.TREA_ADD, vo.itemId);
    };
    /**刷新宝物信息 */
    TreasureModel.updateData = function (body) {
        var vo = this.m_tTreaList[body.itemId];
        if (vo) {
            vo.update(body);
        }
    };
    /**是否拥有宝物 */
    TreasureModel.isOwner = function (itemId) {
        if (this.m_tTreaList[itemId])
            return true;
        return false;
    };
    /**获得宝物 */
    TreasureModel.getData = function (itemId) {
        return this.m_tTreaList[itemId];
    };
    /**获得已拥有宝物列表 */
    TreasureModel.getOwnerList = function () {
        var res = [];
        for (var key in this.m_tTreaList) {
            res.push(Number(key));
        }
        return res;
    };
    /**获得所有宝物列表 */
    TreasureModel.getAllList = function (isOwner) {
        if (isOwner === void 0) { isOwner = true; }
        if (isOwner)
            return this.getOwnerList();
        var res = [];
        for (var key in C.TreasureConfig) {
            var cfg = C.TreasureConfig[key];
            if (unNull(cfg) && !this.isOwner(cfg.id)) {
                res.push(cfg.id);
            }
        }
        return res;
    };
    /**根据武将类型获取可装备列表 */
    TreasureModel.getTreasByGeneralType = function (type) {
        if (type === void 0) { type = SoliderGeneralType.HAO_JIE; }
        var res = [];
        for (var key in this.m_tTreaList) {
            var vo = this.m_tTreaList[key];
            if (vo && vo.canEquipByType(type))
                res.push(vo);
        }
        //升序
        res.sort(function (a, b) {
            if (a.generalId > 0 && b.generalId == 0)
                return -1;
            if (a.generalId == 0 && b.generalId > 0)
                return 1;
            return b.fight - a.fight;
        });
        return res;
    };
    /**等级获得成长值
     *@param id 宝物id
     *@param level 等级
     */
    TreasureModel.getMainAttris = function (id, level, star, quality) {
        var treaCfg = C.TreasureConfig[id];
        var res = [];
        if (treaCfg) {
            var baseAttrs = StringUtils.keyValsToNumberArray(treaCfg.mainAttribute);
            var lvCfg = C.TreasureLevelConfig[level];
            var lvRates = StringUtils.keyValsToNumber(lvCfg.growUp);
            var starCfg = this.getStarCfg(star, quality);
            var starRates = StringUtils.keyValsToNumber(starCfg.attriAddRate);
            for (var i = 0; i < baseAttrs.length; i++) {
                var data = baseAttrs[i];
                var rate = Utils.getAttriValByType(lvRates, data.key) + Utils.getAttriValByType(starRates, data.key);
                data.value = Math.floor(data.value * (1 + rate / 10000));
                res.push(data);
            }
        }
        return res;
    };
    /**获得宝物品质框 */
    TreasureModel.getTreaQualityBg = function (quality) {
        var imgUrl = "com_trea_quality" + quality + "_png";
        return Utils.GetResName(imgUrl, "com_trea_quality1_png");
    };
    /**获得宝物图标（常规图标） */
    TreasureModel.getTreaIcon = function (itemId) {
        return PropModel.getPropIcon(itemId);
    };
    /**获得宝物图标(大图标) */
    TreasureModel.getTreaBigIcon = function (itemId) {
        var cfg = C.ItemConfig[itemId];
        var sourceId = cfg ? cfg.sourceIcon : itemId;
        var imgUrl = "icon_trea_b_" + sourceId + "_png";
        return Utils.GetResName(imgUrl, "icon_trea_b_1035_png");
    };
    /**获得宝石类型图标 */
    TreasureModel.getPropStoneTypeIcon = function (type) {
        var imgUrl = "com_stone_icon" + type + "_png";
        return Utils.GetResName(imgUrl, "com_stone_icon1_png");
    };
    /**获得宝石类型名字 */
    TreasureModel.getPropStoneTypeName = function (type) {
        switch (type) {
            case PropStoneType.JJS: return GCode(CLEnum.BAG_ITEM_JJS);
            case PropStoneType.RGS: return GCode(CLEnum.BAG_ITEM_RGS);
            case PropStoneType.HQS: return GCode(CLEnum.BAG_ITEM_HQS);
            case PropStoneType.LSS: return GCode(CLEnum.BAG_ITEM_LSS);
            case PropStoneType.QJS: return GCode(CLEnum.BAG_ITEM_QJS);
            case PropStoneType.YCS: return GCode(CLEnum.BAG_ITEM_YCS);
            case PropStoneType.SJS: return GCode(CLEnum.BAG_ITEM_SJS);
        }
        return '';
    };
    /**预览宝物数据 */
    TreasureModel.getPreViewVo = function (id) {
        if (!this.m_tPreTreaList[id]) {
            var cfg = C.TreasureConfig[id];
            var data = {
                mainAttribute: cfg.mainAttribute,
                allAttribute: cfg.mainAttribute,
                generalId: 0,
                itemId: id,
                level: 1,
                quality: cfg.quality,
                star: 0,
                holes: [],
                secondAttrId: [],
            };
            this.m_tPreTreaList[id] = TreasureVo.create(data);
        }
        return this.m_tPreTreaList[id];
    };
    /**获得红点状态 */
    TreasureModel.getRedState = function (itemId, type) {
        if (!FunctionModel.isFunctionOpen(FunctionType.TREASURE))
            return 0;
        if (itemId > 0) {
            var vo = this.getData(itemId);
            if (vo) {
                return vo.getRedState(type) ? 1 : 0;
            }
        }
        else {
            var list = this.getOwnerList();
            for (var i = 0; i < list.length; i++) {
                var vo = this.getData(list[i]);
                if (vo.getRedState(type))
                    return 1;
            }
        }
        return 0;
    };
    /**获得动画名字 */
    TreasureModel.getMcName = function (id) {
        var cfg = C.ItemConfig[id];
        return cfg ? "Trea" + cfg.sourceIcon : '';
    };
    /**存在动画资源 */
    TreasureModel.hasMcRes = function (id) {
        var name = this.getMcName(id);
        var skeletonData = RES.hasRes(name + "_ske_dbbin");
        var pngData = RES.hasRes(name + "_tex_png");
        var textureData = RES.hasRes(name + "_tex_json");
        if (!pngData || !skeletonData || !textureData) {
            return false;
        }
        return true;
    };
    /**============================================================================================================================
     * 配置表 相关
     * ============================================================================================================================
     * */
    /**获得星级配置表 */
    TreasureModel.getStarCfg = function (star, quality) {
        if (star === void 0) { star = 0; }
        if (quality === void 0) { quality = 1; }
        return C.TreasureStarConfigDic[star][quality];
    };
    /**解析加成配置 */
    TreasureModel.parseAddRateByCfg = function (configs, cfgPropName) {
        if (cfgPropName === void 0) { cfgPropName = "attriAddRate"; }
        var records = {};
        for (var key in configs) {
            var cfg = configs[key];
            if (cfg != null && cfg != undefined) {
                //表id数据链 (星级 品质)
                records[key] = {};
                var list = StringUtils.keyValsToNumber(cfg[cfgPropName]);
                for (var tmpKey in list) {
                    var attriType = Number(tmpKey);
                    records[key][attriType] = list[attriType];
                }
            }
        }
        return records;
    };
    /**获得对应孔位解锁星级 */
    TreasureModel.getStoneOpenStar = function (quality, holeId) {
        for (var i = 0; i <= TreasureModel.STAR_MAX; i++) {
            var cfg = this.getStarCfg(i, quality);
            if ((cfg.unlockHole - 1) == holeId)
                return i;
        }
    };
    /**获得所有宝物列表 */
    TreasureModel.getAllCfgs = function () {
        var res = [];
        for (var key in C.TreasureConfig) {
            var cfg = C.TreasureConfig[key];
            if (unNull(cfg)) {
                res.push(cfg);
            }
        }
        return res;
    };
    /**获得宝物固定次属性 */
    TreasureModel.getSecondAttr = function (team, quality) {
        return C.SecondAttributeConfigDic[team] ? C.SecondAttributeConfigDic[team][quality] : null;
    };
    TreasureModel.STAR_MAX = 5;
    return TreasureModel;
}());
