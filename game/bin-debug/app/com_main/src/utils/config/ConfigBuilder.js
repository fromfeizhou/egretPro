var ConfigBuilder = /** @class */ (function () {
    function ConfigBuilder() {
        this.isInit = false;
    }
    ConfigBuilder.getInstance = function () {
        ConfigBuilder._instance = ConfigBuilder._instance || new ConfigBuilder();
        return ConfigBuilder._instance;
    };
    ConfigBuilder.prototype.loadConfig = function (callback, target) {
        if (this.isInit) {
            callback.call(target);
            return;
        }
        // console.log("ConfigBuilder:loadConfig------>>", GameConfig.getConfigUrl());
        RES.getResByUrl(GameConfig.getConfigUrl(), function (param) {
            if (param) {
                var zip = new JSZip(param);
                for (var i in zip.files) {
                    var name_1 = zip.files[i].name;
                    if (name_1.indexOf('/') > 0)
                        continue;
                    var text = zip.files[i].asText();
                    try {
                        var jdata = JSON.parse(text);
                        this.parseConfig(jdata.clazzName, jdata.data);
                    }
                    catch (e) {
                        error("ConfigBuilder:loadConfig------>>配置有问题！！！！");
                        error("ConfigBuilder:loadConfig------>>", text);
                    }
                }
                this.parseConfigSpec();
                this.isInit = true;
                callback.call(target);
                //读取配置后销毁
                RES.destroyRes(GameConfig.getConfigUrl());
            }
        }, this, RES.ResourceItem.TYPE_BIN);
    };
    /**自定义解析配置 */
    ConfigBuilder.prototype.parseConfigSpec = function () {
        //技能等级效果表
        this.setConfigDic('SkillLvConfig', 'skillId', 'skillLv');
        //建筑等级表
        this.setConfigDic('BuildingLevelConfig', 'buildingType', 'level');
        //建筑产出表
        this.setConfigDic('BuildingResourcesLvConfig', 'type', 'lv');
        //掉落表
        this.setConfigDic('DropConfig', 'dropNo', 'id');
        //每日签到
        this.setConfigDic('SignUpConfig', 'month', 'day');
        //兵种配置表
        this.setConfigDic('GeneralSoldierLvConfig', 'mainType', 'LV');
        this.setConfigDic('ArmyProgressConfig', 'armyType', 'progressLevel');
        //装备配置表 碎片指向配置表
        this.setSubConfig('EquipmentConfig', 'EquipmentS2EConfig', 'fragmentId');
        //装备强化表 
        this.setConfigDic('EquipmentSlotStrengthenConfig', 'slot', 'level');
        //装备进阶表 
        this.setConfigDic('EquipmentSlotUpgradeConfig', 'slot', 'level');
        //装备精炼表 
        this.setConfigDic('EquipmentSlotWroughtConfig', 'slot', 'level');
        //装备加成
        this.setConfigDic('EquipmentSlotSumConfig', 'type', 'sumLevel');
        //科技等级表
        this.setConfigDic('TechnologyLevelConfig', 'techId', 'level');
        //套装表
        this.setConfigDic('GemstoneConstituteConfig', 'suitId', 'level');
        //宝物星级表
        this.setConfigDic('TreasureStarConfig', 'starLevel', 'quality');
        //章节表
        this.setConfigDic('ChapterConfig', 'chapterId', 'level');
        // 章节星星奖励配置表
        this.setConfigDic('StarRewardConfig', 'chapterId', 'star');
        //世界战役表
        this.setConfigDic('HistoryWarConfig', 'chapterId', 'level');
        // 世界战役章节星星奖励配置表
        this.setConfigDic('HistoryWarStarRewardConfig', 'chapterId', 'star');
        // 城池建造
        this.setConfigDic('CityMadeConfig', 'cityId', 'level');
        //宝物次属性表
        this.setConfigDic('SecondAttributeConfig', 'team', 'quality');
        // 跨服战奖励配置表
        this.setConfigDic('CrossServerRewardConfig', 'type', 'value');
    };
    /**配置表副表格式（主key不一样） */
    ConfigBuilder.prototype.setSubConfig = function (cfgName, subName, mainKey) {
        C[subName] = {};
        for (var key in C[cfgName]) {
            var info = C[cfgName][key];
            if (unNull(info)) {
                C[subName][info[mainKey]] = info;
            }
        }
    };
    /**设置通用自定义配置表 */
    ConfigBuilder.prototype.setConfigDic = function (cfgName, key1, key2) {
        var dictionary = {};
        for (var key in C[cfgName]) {
            var info = C[cfgName][key];
            if (unNull(info)) {
                var key1Val = info[key1];
                if (!key1Val) {
                    var a = 0;
                }
                var key2Val = info[key2];
                if (isNull(dictionary[key1Val])) {
                    dictionary[key1Val] = {};
                }
                dictionary[key1Val][key2Val] = info;
            }
        }
        C[cfgName + "Dic"] = dictionary;
    };
    ConfigBuilder.prototype.parseConfig = function (name, config) {
        // let key = this.configMapKey(name);
        var tables = this.parseTable(name, config);
        // let configs = Utils.ArrayUtils.arrayToMap(tables, ConfigBuilder.KEY);
        // let configs = key ? Utils.ArrayUtils.arrayToMap(tables, key) : tables;
        C[name] = tables;
    };
    ConfigBuilder.prototype.parseTable = function (name, datas) {
        var tables = {};
        for (var i = 0; i < datas.length; i++) {
            try {
                var clazz = egret.getDefinitionByName(name);
                var ca = new clazz();
                var data = datas[i];
                var attrs = ca.attrs();
                var types = ca.types();
                for (var j = 0; j < data.length; j++) {
                    var key = attrs[j];
                    var type = types[j];
                    ca[key] = this.parseKey(type, data[j]);
                }
                tables[ca[ConfigBuilder.KEY]] = ca;
            }
            catch (e) {
                error("ConfigBuilder:parseTable------>>", name, e);
            }
        }
        return tables;
    };
    /**解析对应类型的key */
    ConfigBuilder.prototype.parseKey = function (type, data) {
        switch (type) {
            case "IItemInfo[]":
                return this.getItemInfo(data);
            case "IItemInfo":
                return this.getItemInfo(data, true);
        }
        return data;
    };
    /**获得物品配置 */
    ConfigBuilder.prototype.getItemInfo = function (data, isSingle) {
        if (isSingle === void 0) { isSingle = false; }
        var list = Utils.parseCommonItemJson(data);
        if (isSingle) {
            return list.length > 0 ? list[0] : null;
        }
        return list;
    };
    ConfigBuilder.KEY = 'id';
    return ConfigBuilder;
}());
