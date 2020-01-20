/**道具id枚举 */
var PropEnum;
(function (PropEnum) {
    PropEnum[PropEnum["NONE"] = 0] = "NONE";
    /**资源类 */
    PropEnum[PropEnum["GOLD"] = 1] = "GOLD";
    PropEnum[PropEnum["SILVER"] = 2] = "SILVER";
    PropEnum[PropEnum["FOOD"] = 3] = "FOOD";
    PropEnum[PropEnum["WOOD"] = 22] = "WOOD";
    PropEnum[PropEnum["YU"] = 6] = "YU";
    PropEnum[PropEnum["IRON"] = 7] = "IRON";
    PropEnum[PropEnum["MILITARY_EXPLOIT"] = 4] = "MILITARY_EXPLOIT";
    PropEnum[PropEnum["EXP"] = 5] = "EXP";
    // MARBLE = 6,//大理石
    PropEnum[PropEnum["MILITARY_MERITS_DAY"] = 8] = "MILITARY_MERITS_DAY";
    PropEnum[PropEnum["BFS"] = 9] = "BFS";
    PropEnum[PropEnum["SilverSacrifice"] = 11] = "SilverSacrifice";
    PropEnum[PropEnum["FoodSacrifice"] = 12] = "FoodSacrifice";
    PropEnum[PropEnum["warSacrifice"] = 13] = "warSacrifice";
    PropEnum[PropEnum["gemSacrifice"] = 14] = "gemSacrifice";
    PropEnum[PropEnum["VIP_EXP"] = 15] = "VIP_EXP";
    PropEnum[PropEnum["CONQUER"] = 32] = "CONQUER";
    PropEnum[PropEnum["GUILD_POINT"] = 18] = "GUILD_POINT";
    PropEnum[PropEnum["PVP_MEDAL"] = 23] = "PVP_MEDAL";
    PropEnum[PropEnum["WORLD_VISIT_ITEM"] = 24] = "WORLD_VISIT_ITEM";
    PropEnum[PropEnum["WORLE_MOVE_BACK"] = 25] = "WORLE_MOVE_BACK";
    PropEnum[PropEnum["EQUIP_QH"] = 26] = "EQUIP_QH";
    PropEnum[PropEnum["EQUIP_SJ"] = 27] = "EQUIP_SJ";
    PropEnum[PropEnum["EQUIP_JL"] = 28] = "EQUIP_JL";
    PropEnum[PropEnum["TREA_JH"] = 34] = "TREA_JH";
    PropEnum[PropEnum["NAME_CARD"] = 50] = "NAME_CARD";
    PropEnum[PropEnum["BOSSSCORE"] = 51] = "BOSSSCORE";
    PropEnum[PropEnum["TUPODAN"] = 52] = "TUPODAN";
    PropEnum[PropEnum["MILITARY_MERITS_CONSUMED"] = 53] = "MILITARY_MERITS_CONSUMED";
    PropEnum[PropEnum["MILITARY_MERITS_WEEK"] = 54] = "MILITARY_MERITS_WEEK";
    PropEnum[PropEnum["TURNTABLE"] = 55] = "TURNTABLE";
    PropEnum[PropEnum["HONOR"] = 200] = "HONOR";
    /**道具类 */
    // Alcohol = 101,//酒
    // JY = 102,//箭雨
    // Hammer = 103,//锤子
    // ExpFlag = 104,//经验旗
    // MilitaryExploitFlag = 105,//军功旗
    // Gift = 108,//礼物
    // GoldCup = 109,//金酒杯
    // MBL = 110,//募兵令
    PropEnum[PropEnum["CHAT_ITEM"] = 126] = "CHAT_ITEM";
    // BFS                     = 111,//兵法书
    PropEnum[PropEnum["BronzeHF"] = 1035] = "BronzeHF";
    PropEnum[PropEnum["IronHF"] = 1045] = "IronHF";
    PropEnum[PropEnum["GoldHF"] = 1055] = "GoldHF";
    PropEnum[PropEnum["XWHF"] = 1061] = "XWHF";
    PropEnum[PropEnum["QLHF"] = 1062] = "QLHF";
    PropEnum[PropEnum["ZQHF"] = 1063] = "ZQHF";
    PropEnum[PropEnum["BHHF"] = 1064] = "BHHF";
    PropEnum[PropEnum["CBF"] = 1335] = "CBF";
    PropEnum[PropEnum["WXF"] = 1345] = "WXF";
    PropEnum[PropEnum["DWF"] = 1355] = "DWF";
    PropEnum[PropEnum["XWF"] = 1361] = "XWF";
    PropEnum[PropEnum["QLF"] = 1362] = "QLF";
    PropEnum[PropEnum["ZQF"] = 1363] = "ZQF";
    PropEnum[PropEnum["BHF"] = 1364] = "BHF";
    PropEnum[PropEnum["HTBY"] = 1635] = "HTBY";
    PropEnum[PropEnum["WCFS"] = 1645] = "WCFS";
    PropEnum[PropEnum["XLBY"] = 1655] = "XLBY";
    PropEnum[PropEnum["XWSS"] = 1661] = "XWSS";
    PropEnum[PropEnum["ZQSS"] = 1662] = "ZQSS";
    PropEnum[PropEnum["QLSS"] = 1663] = "QLSS";
    PropEnum[PropEnum["BHSS"] = 1664] = "BHSS";
    PropEnum[PropEnum["Gem1"] = 2001] = "Gem1";
    PropEnum[PropEnum["Gem2"] = 2002] = "Gem2";
    PropEnum[PropEnum["Gem3"] = 2003] = "Gem3";
    PropEnum[PropEnum["Gem4"] = 2004] = "Gem4";
    PropEnum[PropEnum["Gem5"] = 2005] = "Gem5";
    PropEnum[PropEnum["Gem6"] = 2006] = "Gem6";
    PropEnum[PropEnum["Gem7"] = 2007] = "Gem7";
    PropEnum[PropEnum["Gem8"] = 2008] = "Gem8";
    PropEnum[PropEnum["Gem9"] = 2009] = "Gem9";
    PropEnum[PropEnum["Gem10"] = 2010] = "Gem10";
    PropEnum[PropEnum["CJHB"] = 112] = "CJHB";
    PropEnum[PropEnum["ZJHB"] = 113] = "ZJHB";
    PropEnum[PropEnum["GJHB"] = 114] = "GJHB";
    PropEnum[PropEnum["CJZD"] = 115] = "CJZD";
    PropEnum[PropEnum["ZJZD"] = 116] = "ZJZD";
    PropEnum[PropEnum["GJZD"] = 117] = "GJZD";
    PropEnum[PropEnum["CJNH"] = 118] = "CJNH";
    PropEnum[PropEnum["ZJNH"] = 119] = "ZJNH";
    PropEnum[PropEnum["GJNH"] = 120] = "GJNH";
    PropEnum[PropEnum["ZCCL"] = 121] = "ZCCL";
    PropEnum[PropEnum["HSSY"] = 122] = "HSSY";
    PropEnum[PropEnum["ZSSY"] = 123] = "ZSSY";
    PropEnum[PropEnum["expBook1"] = 2101] = "expBook1";
    PropEnum[PropEnum["expBook2"] = 2102] = "expBook2";
    PropEnum[PropEnum["expBook3"] = 2103] = "expBook3";
    PropEnum[PropEnum["expBook4"] = 2104] = "expBook4";
    PropEnum[PropEnum["expBook5"] = 2105] = "expBook5";
    PropEnum[PropEnum["MarchSpeedItem1"] = 2241] = "MarchSpeedItem1";
    PropEnum[PropEnum["MarchSpeedItem2"] = 2242] = "MarchSpeedItem2";
    PropEnum[PropEnum["ZML"] = 3000] = "ZML";
    PropEnum[PropEnum["XW"] = 1001] = "XW";
})(PropEnum || (PropEnum = {}));
var PropMainType;
(function (PropMainType) {
    PropMainType[PropMainType["All"] = 0] = "All";
    PropMainType[PropMainType["RES"] = 1] = "RES";
    PropMainType[PropMainType["ACC"] = 2] = "ACC";
    PropMainType[PropMainType["SOUL"] = 3] = "SOUL";
    PropMainType[PropMainType["SKILL_SOUL"] = 4] = "SKILL_SOUL";
    PropMainType[PropMainType["TREASURE"] = 5] = "TREASURE";
    PropMainType[PropMainType["STONE"] = 6] = "STONE";
    PropMainType[PropMainType["EXP_BOOK"] = 7] = "EXP_BOOK";
    PropMainType[PropMainType["SPEED"] = 8] = "SPEED";
    PropMainType[PropMainType["BUFF_PROP"] = 9] = "BUFF_PROP";
    PropMainType[PropMainType["GIFT"] = 10] = "GIFT";
    PropMainType[PropMainType["RUN_BACK"] = 11] = "RUN_BACK";
    PropMainType[PropMainType["EQUIP_STRENG"] = 12] = "EQUIP_STRENG";
    PropMainType[PropMainType["EQUIP_GRADE"] = 13] = "EQUIP_GRADE";
    PropMainType[PropMainType["EQUIP_WROUGHT"] = 14] = "EQUIP_WROUGHT";
    PropMainType[PropMainType["EQUIP"] = 15] = "EQUIP";
    PropMainType[PropMainType["EQUIP_SOUL"] = 16] = "EQUIP_SOUL";
    PropMainType[PropMainType["ARMY_GRADE"] = 17] = "ARMY_GRADE";
    PropMainType[PropMainType["GENERAL"] = 18] = "GENERAL";
    PropMainType[PropMainType["TREA_SOUL"] = 20] = "TREA_SOUL";
})(PropMainType || (PropMainType = {}));
/**宝石类型(PropMainType = 6) */
var PropStoneType;
(function (PropStoneType) {
    PropStoneType[PropStoneType["ALL"] = 0] = "ALL";
    /**尖晶石*/
    PropStoneType[PropStoneType["JJS"] = 1] = "JJS";
    /**日光石*/
    PropStoneType[PropStoneType["RGS"] = 2] = "RGS";
    /**虎睛石*/
    PropStoneType[PropStoneType["HQS"] = 3] = "HQS";
    /**绿松石*/
    PropStoneType[PropStoneType["LSS"] = 4] = "LSS";
    /**青金石*/
    PropStoneType[PropStoneType["QJS"] = 5] = "QJS";
    /**月长石*/
    PropStoneType[PropStoneType["YCS"] = 6] = "YCS";
    /**苏纪石*/
    PropStoneType[PropStoneType["SJS"] = 7] = "SJS";
})(PropStoneType || (PropStoneType = {}));
/**加速道具类型(PropMainType = 8) */
var PropSpeedType;
(function (PropSpeedType) {
    /**通用 */
    PropSpeedType[PropSpeedType["All"] = 1] = "All";
    /**建筑 */
    PropSpeedType[PropSpeedType["Build"] = 2] = "Build";
    /**科技 */
    PropSpeedType[PropSpeedType["Technology"] = 3] = "Technology";
    /**练兵 */
    PropSpeedType[PropSpeedType["Soldier"] = 4] = "Soldier";
    /**行军加速 */
    PropSpeedType[PropSpeedType["WorldMove"] = 5] = "WorldMove";
    /**采集加速 */
    PropSpeedType[PropSpeedType["WorldGather"] = 6] = "WorldGather";
    /**拜访加速 */
    PropSpeedType[PropSpeedType["WorldVisit"] = 7] = "WorldVisit";
    /**城市建筑加速 */
    PropSpeedType[PropSpeedType["CityBuild"] = 8] = "CityBuild";
})(PropSpeedType || (PropSpeedType = {}));
var IItemInfoPool = /** @class */ (function () {
    function IItemInfoPool() {
    }
    IItemInfoPool.create = function (id, count) {
        if (this.pool.length > 0) {
            var info = this.pool.pop();
            info.itemId = id;
            info.count = count;
            return info;
        }
        return { itemId: id, count: count };
    };
    IItemInfoPool.release = function (info) {
        this.pool.push(info);
    };
    IItemInfoPool.pool = [];
    return IItemInfoPool;
}());
/** 道具管理 */
var PropModel = /** @class */ (function () {
    function PropModel() {
    }
    /** 初始化道具列表*/
    PropModel.init = function (list) {
        this.propDic = Dictionary.create();
        this.propList = [];
    };
    /**清理道具列表*/
    PropModel.clear = function () {
        this.propList = null;
        this.propDic = null;
    };
    /**初始化背包数据 */
    PropModel.initPorpItems = function (list) {
        for (var i = 0; i < list.length; i++) {
            this.addProp(list[i]);
        }
    };
    /**
     * 添加道具
     *  */
    PropModel.addProp = function (data, isNew) {
        if (isNew === void 0) { isNew = false; }
        var cfg = C.ItemConfig[data.itemId];
        //装备 宝物数据不缓存到背包
        if (!cfg || cfg.mainType == PropMainType.EQUIP || cfg.mainType == PropMainType.TREASURE)
            return;
        if (this.getPropByUId(data.uuid)) {
            this.updateProp(data);
            return;
        }
        var vo = PropVo.create(data);
        vo.isNew = isNew;
        this.propDic.add(vo.uuid, vo);
        if (isNull(this.propList[vo.itemId])) {
            this.propList[vo.itemId] = [];
        }
        this.propList[vo.itemId].push(vo);
        /**新物品红点 */
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_ITEM_ADD, vo.uuid);
    };
    /**更新物品 */
    PropModel.updateProp = function (info) {
        var vo = this.getPropByUId(info.uuid);
        if (vo) {
            vo.update(info);
            if (vo.count == 0) {
                this.delProp(info.uuid);
            }
        }
        else {
            this.addProp(info, true);
        }
        com_main.EventMgr.dispatchEvent(EventEnum.PROP_ITEM_CHANGE, info.itemId);
    };
    /**删除物品 */
    PropModel.delProp = function (uuid) {
        var vo = this.getPropByUId(uuid);
        if (!vo)
            return;
        var list = this.propList[vo.itemId];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].uuid == vo.uuid) {
                    list.splice(i, 1);
                    break;
                }
            }
        }
        if (list.length == 0)
            delete this.propList[vo.itemId];
        this.propDic.del(uuid);
        vo.onDestroy();
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_ITEM_DEL, uuid);
    };
    /**获得物品 */
    PropModel.getPropByUId = function (uuid) {
        if (this.propDic.has(uuid)) {
            return this.propDic.get(uuid);
        }
    };
    /**获得道具数据表 */
    PropModel.getPropList = function () {
        return this.propDic;
    };
    /**获得排序列表 */
    PropModel.getSortPropList = function () {
        var list = [];
        this.propDic.forEach(function (key, data) {
            list.push(data);
        });
        list.sort(this.sortItemFunc.bind(this));
        return list;
    };
    /**物品排序 */
    PropModel.sortItemFunc = function (a, b) {
        if (a.isNew != b.isNew)
            return a.isNew ? -1 : 1;
        if (a.type != b.type) {
            if (a.type == PropMainType.GIFT)
                return -1;
            if (b.type == PropMainType.GIFT)
                return 1;
            return a.type - b.type;
        }
        if (a.quality != b.quality) {
            return b.quality - a.quality;
        }
        return a.itemId - b.itemId;
    };
    /**
     * 获取道具数量
     * itemId 道具id
     *  */
    PropModel.getPropNum = function (itemId) {
        var itemCfg = C.ItemConfig[itemId];
        //是否是资源
        if (itemCfg.type == PropType.RESOURCE) {
            return RoleData.GetMaterialNumById(itemId);
        }
        var res = 0;
        var list = this.propList[itemId];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                res += list[i].count;
            }
        }
        res = res ? res : 0;
        return res;
    };
    /**
     * 获取某个种类的道具(根据道具表)
     * itemType 道具id
     *  */
    PropModel.getPropItemListInCfgByType = function (itemType) {
        var list = [];
        var cfg = C.ItemConfig;
        for (var i in cfg) {
            if (cfg[i].mainType == itemType) {
                list.push(cfg[i]);
            }
        }
        return list;
    };
    /**
     * 获取某个n种类的道具
     * @param itemType 主类型
     */
    PropModel.getPropItemListByTypes = function (itemType, isSort) {
        if (isSort === void 0) { isSort = true; }
        var list = [];
        for (var i = 0; i < itemType.length; i++) {
            list = list.concat(this.getPropItemListByType(itemType[i], false));
        }
        if (isSort) {
            list.sort(this.sortItemFunc);
        }
        return list;
    };
    /**
     * 获取某个种类的道具
     * @param itemType 主类型
     */
    PropModel.getPropItemListByType = function (itemType, isSort) {
        if (isSort === void 0) { isSort = true; }
        var list = [];
        this.propDic.forEach(function (key, data) {
            if (itemType == PropMainType.All) {
                //过滤装备碎片 武将碎片 技能碎片
                switch (data.type) {
                    case PropMainType.EQUIP_SOUL:
                    case PropMainType.SOUL:
                    case PropMainType.SKILL_SOUL:
                    case PropMainType.STONE:
                    case PropMainType.TREA_SOUL: {
                        break;
                    }
                    default: {
                        list.push(data);
                        break;
                    }
                }
            }
            else {
                if (data.type == itemType)
                    list.push(data);
            }
        });
        if (isSort) {
            list.sort(this.sortItemFunc);
        }
        return list;
    };
    /**
    * 获取某个种类的道具
    * @param itemType 主类型
    * @param subType 子类型
    */
    PropModel.getPropItemListByAllType = function (itemType, subType, isSort) {
        if (isSort === void 0) { isSort = true; }
        var list = [];
        this.propDic.forEach(function (key, data) {
            if (data.type == itemType && data.subType == subType) {
                list.push(data);
            }
        });
        if (isSort) {
            list.sort(this.sortItemFunc);
        }
        return list;
    };
    /**根据id判断物品是否存在 */
    PropModel.isOwnItemById = function (itemId) {
        if (this.propList[itemId] && this.propList[itemId].length > 0)
            return true;
        return false;
    };
    /**清理物品记录 */
    PropModel.ClearNewPorpState = function () {
        this.propDic.forEach(function (key, data) {
            data.isNew = false;
        });
        /**红点(重新计算 背包是否存在新物品 判断红点) */
        com_main.EventMgr.dispatchEvent(BagEvent.BAG_STATE_DEL, null);
    };
    //获取宝石
    PropModel.getGemList = function (type) {
        if (type === void 0) { type = PropStoneType.ALL; }
        var list = this.getPropItemListByType(PropMainType.STONE);
        var res = [];
        for (var i = 0; i < list.length; i++) {
            var info = list[i];
            if (type == PropStoneType.ALL || type == info.subType) {
                res.push(info);
            }
        }
        //升序
        res.sort(function (a, b) {
            return a.itemId - b.itemId;
        });
        return res;
    };
    /**
     * 道具是否足够
     * @param itemId 道具id
     * @param cost 物品数量 1111111
     * @param tipsState (2进制位运算)道具不足时候 是否显示tip [(0-不显示) (1-显示文本tips) (2-显示道具来源)] //例如：3= 1 + 2 显示文本tips+显示道具来源
     * @returns {boolean}
     */
    PropModel.isItemEnough = function (itemId, cost, tipsState, tipsStr) {
        if (tipsState === void 0) { tipsState = 0; }
        if (tipsStr === void 0) { tipsStr = ""; }
        var itemCfg = C.ItemConfig[itemId];
        var isEnough = false;
        var isResource = itemCfg.type == PropType.RESOURCE; //是否是资源
        if (itemCfg) {
            if (isResource) {
                isEnough = RoleData.isbeyond(itemId, cost);
            }
            else {
                var itemNum = this.getPropNum(itemId);
                isEnough = itemNum >= cost;
            }
        }
        if (isEnough)
            return true;
        if (tipsState == 0)
            return false;
        //勾玉,元宝特殊处理
        if (itemId == PropEnum.GOLD) {
            this.goldLessToCharge();
        }
        else if (itemId == PropEnum.YU) {
            this.yuLessToCharge();
        }
        else {
            //弹出提示
            if ((tipsState & 1) == 1) {
                if (tipsStr == "") {
                    var tips = GCodeFromat(CLEnum.BAG_TIPS_DJSL, GLan(itemCfg.name), cost);
                    EffectUtils.showTips(tips, 1, true);
                }
                else {
                    EffectUtils.showTips(tipsStr, 1, true);
                }
            }
            //弹出道具来源
            if ((tipsState & 2) == 2) {
                if (itemCfg.sourcePrice != '') {
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(itemId);
                }
                else {
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, itemId);
                }
            }
        }
        return false;
    };
    /**
     * 道具列表是否满足
     * @param tipsState (2进制位运算)道具不足时候 是否显示tip [(0-不显示) (1-显示文本tips) (2-显示道具来源)] //例如：3= 1 + 2 显示文本tips+显示道具来源
     *
     *  */
    PropModel.isItemListEnough = function (infos, tipsState, tipsStr) {
        if (tipsState === void 0) { tipsState = 0; }
        if (tipsStr === void 0) { tipsStr = ""; }
        for (var i = 0; i < infos.length; i++) {
            if (!this.isItemEnough(infos[i].itemId, infos[i].count, tipsState, tipsStr))
                return false;
        }
        return true;
    };
    PropModel.goldLessToCharge = function (isClose) {
        if (isClose === void 0) { isClose = false; }
        if (platform.isHidePayFunc()) {
            EffectUtils.showTips(GCode(CLEnum.GOLD_LESS));
            return;
        }
        var tip = GCode(CLEnum.GOLD_LESS_TIPS);
        var func = function () {
            if (isClose)
                com_main.UpManager.history();
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        };
        Utils.showConfirmPop(tip, func, this);
    };
    /**勾玉不足提示前往充值*/
    PropModel.yuLessToCharge = function (isClose) {
        if (isClose === void 0) { isClose = false; }
        if (platform.isHidePayFunc()) {
            EffectUtils.showTips(GCode(CLEnum.YU_LESS));
            return;
        }
        var tip = GCode(CLEnum.YU_LESS_TIPS);
        var func = function () {
            if (isClose)
                com_main.UpManager.history();
            Utils.open_view(TASK_UI.POP_PAY_SHOP_YU_VIEW);
        };
        Utils.showConfirmPop(tip, func, this);
    };
    /**
     * 道具变动飘字
     */
    PropModel.itemAwardTips = function (valuesMessage) {
        for (var key in valuesMessage) {
            var element = valuesMessage[key];
            var resourceName = Utils.getPropName(element.itemId);
            EffectUtils.showTips(GCodeFromat(CLEnum.BAG_GET_TIPS, resourceName, element.count));
        }
    };
    //=============================================================================================================================================
    //判断红点 begin
    //============================================================================================================================================= 
    /**是否有新物品 */
    PropModel.getNewPorpNum = function () {
        var res = 0;
        this.propDic.forEach(function (key, data) {
            if (data.type != PropMainType.EQUIP_SOUL && data.isNew) {
                res = 1;
                return 'break';
            }
        });
        return res;
    };
    /**是否有合成装备 */
    PropModel.getEquipCompNum = function () {
        var res = 0;
        this.propDic.forEach(function (key, data) {
            if (data.type == PropMainType.EQUIP_SOUL) {
                var cfg = C.EquipmentS2EConfig[data.itemId];
                if (PropModel.getPropNum(data.itemId) >= cfg.fragmentCount) {
                    res = 1;
                    return 'break';
                }
            }
        });
        return res;
    };
    //=============================================================================================================================================
    //判断红点 end
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    PropModel.getCfg = function (itemId) {
        var data = C.ItemConfig[itemId];
        return data;
    };
    PropModel.getqualityPngByItemId = function (itemId) {
        var data = C.ItemConfig[itemId];
        if (data != null) {
            if (data.mainType == PropMainType.SOUL || data.mainType == PropMainType.SKILL_SOUL) {
                return "Qualitykuang" + data.quality + "_sp_png";
            }
            else {
                return "Qualitykuang" + data.quality + "_png";
            }
        }
        else
            return "";
    };
    PropModel.getQualitySoulIcon = function (itemId) {
        var data = C.ItemConfig[itemId];
        return Utils.GetResName("quality_icon" + data.quality + "_png", 'quality_icon1_png');
    };
    /**获取道具图片路径 */
    PropModel.getPropIcon = function (id) {
        var key = id;
        var cfg = C.ItemConfig[key];
        if (cfg) {
            key = cfg.sourceIcon;
        }
        return Utils.GetResName('common_prop_' + key + '_png', "common_prop_101_png");
    };
    /**
     * 获取品质颜色
     */
    PropModel.getColorOfItemId = function (itemId) {
        var data = C.ItemConfig[itemId];
        var quality = data ? data.quality : 1;
        return Utils.getColorOfQuality(quality);
    };
    /**物品描述 */
    PropModel.getItemDesc = function (itemId) {
        var data = this.getCfg(itemId);
        var desc = GLan(data.name);
        return desc;
    };
    /**过滤军功显示 */
    PropModel.filterItemList = function (rewards) {
        var len = rewards.length;
        for (var i = len - 1; i > 0; i--) {
            var element = rewards[i];
            var itemId = element.itemId;
            if (itemId == PropEnum.MILITARY_MERITS_CONSUMED || itemId == PropEnum.MILITARY_MERITS_WEEK)
                rewards.splice(i, 1);
        }
        return rewards;
    };
    /**是否有经验书 */
    PropModel.isHasExpBook = function () {
        var list = this.getPropItemListByType(PropMainType.EXP_BOOK);
        for (var i = 0; i < list.length; i++) {
            if (list[i].count > 0) {
                return true;
            }
        }
        return false;
    };
    return PropModel;
}());
