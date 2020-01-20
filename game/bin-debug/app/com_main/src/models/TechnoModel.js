/**常规效果类型 */
var NorEffType;
(function (NorEffType) {
    /**粮食 */
    NorEffType[NorEffType["FOOT"] = 1001] = "FOOT";
    /**伐木 */
    NorEffType[NorEffType["WOOD"] = 1018] = "WOOD";
    /** 铁矿 */
    NorEffType[NorEffType["IRON"] = 1019] = "IRON";
    /**训练士兵 */
    NorEffType[NorEffType["SOLDIER"] = 2001] = "SOLDIER";
    /**步兵 */
    NorEffType[NorEffType["SOLDIER_BB"] = 3001] = "SOLDIER_BB";
    /**弓兵 */
    NorEffType[NorEffType["SOLDIER_GB"] = 3002] = "SOLDIER_GB";
    /**骑兵 */
    NorEffType[NorEffType["SOLDIER_QB"] = 3003] = "SOLDIER_QB";
    /**猛将 */
    NorEffType[NorEffType["GENERAL_MJ"] = 4001] = "GENERAL_MJ";
    /**豪杰 */
    NorEffType[NorEffType["GENERAL_HJ"] = 4002] = "GENERAL_HJ";
    /**军师 */
    NorEffType[NorEffType["GENERAL_JS"] = 4003] = "GENERAL_JS";
})(NorEffType || (NorEffType = {}));
/** 生成加成 */
var NEProduceEnum;
(function (NEProduceEnum) {
    /**产量加成 */
    NEProduceEnum[NEProduceEnum["ADDITION"] = 1] = "ADDITION";
    /**容量加成 */
    NEProduceEnum[NEProduceEnum["VOLUME"] = 2] = "VOLUME";
    /**生成加速（配置单位时间减少） */
    NEProduceEnum[NEProduceEnum["TIME"] = 3] = "TIME";
})(NEProduceEnum || (NEProduceEnum = {}));
/**练兵加成 */
var NESoldierEnum;
(function (NESoldierEnum) {
    /**减少训练时间 */
    NESoldierEnum[NESoldierEnum["TIME"] = 1] = "TIME";
    /**减少训练价格 */
    NESoldierEnum[NESoldierEnum["PRICE"] = 2] = "PRICE";
    /**单次练兵最大数量 */
    NESoldierEnum[NESoldierEnum["VOLUME"] = 3] = "VOLUME";
})(NESoldierEnum || (NESoldierEnum = {}));
var TechnoType;
(function (TechnoType) {
    TechnoType[TechnoType["SOLDIER_BB"] = 1] = "SOLDIER_BB";
    TechnoType[TechnoType["SOLDIER_GB"] = 2] = "SOLDIER_GB";
    TechnoType[TechnoType["SOLDIER_QIB"] = 3] = "SOLDIER_QIB";
    TechnoType[TechnoType["SOLDIER_QB"] = 6] = "SOLDIER_QB";
    TechnoType[TechnoType["PRODUCE"] = 4] = "PRODUCE";
    TechnoType[TechnoType["ASSIST"] = 5] = "ASSIST";
})(TechnoType || (TechnoType = {}));
var TechnoModel = /** @class */ (function () {
    function TechnoModel() {
    }
    Object.defineProperty(TechnoModel, "timeData", {
        get: function () {
            return this._timeData;
        },
        set: function (data) {
            this._timeData = data;
        },
        enumerable: true,
        configurable: true
    });
    TechnoModel.init = function () {
        this.initTechnoList();
    };
    /**数据清理 */
    TechnoModel.clear = function () {
        this.removeTimer();
        this.technoList = null;
        this.timeData = null;
    };
    /**解析服务器数据 */
    TechnoModel.parseTechnoList = function (data) {
        for (var i = 0; i < data.length; i++) {
            var vo = this.getTechVoById(data[i].id);
            if (vo)
                vo.update(data[i]);
        }
    };
    /**更新数据 */
    TechnoModel.updateTechnoInfo = function (data) {
        var vo = this.getTechVoById(data.id);
        if (vo)
            vo.update(data);
    };
    /**获得科技节点 */
    TechnoModel.getTechVoById = function (id) {
        var vo = this.technoList[id];
        if (vo)
            vo.init();
        return this.technoList[id];
    };
    /**获得科技数据列表 */
    TechnoModel.getTechVosByType = function (type) {
        var res = [];
        for (var id in this.technoList) {
            var vo = this.technoList[id];
            if (vo.type == type)
                res.push(vo);
        }
        return res;
    };
    //=============================================================================================================================================
    //倒计时 begin
    //============================================================================================================================================= 
    /**解析升级倒计时 */
    TechnoModel.parseTimeData = function (timeData) {
        var isClear = false;
        if (!timeData || (timeData.end - timeData.speed - timeData.start) <= 0)
            isClear = true;
        if (isClear) {
            this.removeTimer();
        }
        else {
            this.timeData = timeData;
            this.startTimer();
        }
    };
    /**升级中 */
    TechnoModel.isInLevelCd = function () {
        if (this.timeData)
            return true;
        return false;
    };
    /**升级中 */
    TechnoModel.isInUpLv = function (id) {
        if (this.timeData && this.timeData.id == id)
            return true;
        return false;
    };
    /**获得等级倒计时 */
    TechnoModel.getTimeData = function () {
        return this.timeData;
    };
    TechnoModel.startTimer = function () {
        Utils.TimerManager.remove(this.timeCallback, this);
        Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.timeData.id);
    };
    TechnoModel.removeTimer = function () {
        if (this.timeData && this.timeData.id > 0) {
            var id = this.timeData.id;
            TechnologyProxy.C2S_TECHNOLOGY_INFO(this.timeData.id);
            this.timeData = null;
            com_main.EventMgr.dispatchEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, id);
        }
        Utils.TimerManager.remove(this.timeCallback, this);
    };
    /**升级倒计时 */
    TechnoModel.timeCallback = function () {
        var time = TimerUtils.getServerTime();
        if (time >= (this.timeData.end + 5 - this.timeData.speed)) {
            this.removeTimer();
        }
    };
    //=============================================================================================================================================
    //倒计时 end
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    /**科技图标 */
    TechnoModel.getIcon = function (id) {
        var cfg = C.TechnologyConfig[id];
        var name = cfg.icon + "_png";
        return Utils.GetResName(name, 'icon_node_png');
    };
    /**初始化科技节点 */
    TechnoModel.initTechnoList = function () {
        this.technoList = {};
        for (var key in C.TechnologyConfig) {
            var data = C.TechnologyConfig[key];
            if (unNull(data)) {
                var vo = TechnoVo.create({ id: Number(key), level: 0 });
                this.technoList[vo.id] = vo;
            }
        }
    };
    /**获得科技等级配置表 */
    TechnoModel.getTechnoLvCfg = function (id, level) {
        if (C.TechnologyLevelConfigDic[id]) {
            return C.TechnologyLevelConfigDic[id][level];
        }
    };
    /**获得科技等级效果描述 */
    TechnoModel.getTechnoEffDesc = function (effStr) {
        var attris = StringUtils.keyValsToNumberArray(effStr);
        if (attris.length > 0) {
            var data = attris[0];
            var cfg = C.TechnologyEffectConfig[data.key];
            if (cfg.valType == 1) {
                var rate = data.value / 100;
                GLan(cfg.effectDesc) + "\uFF1A" + rate + "%";
            }
            else {
                return "\uFF1A" + data.value;
            }
        }
        return '';
    };
    /**红点判断 */
    TechnoModel.canUpLevel = function (type, id) {
        if (id === void 0) { id = 0; }
        // return false;
        if (this.isInLevelCd())
            return false;
        if (isNull(type)) {
            // 全部遍历
            for (var id_1 in this.technoList) {
                var vo = this.technoList[id_1];
                if (vo.canUpLevel())
                    return true;
            }
        }
        else {
            if (id == 0) {
                //单类型遍历
                var list = this.getTechVosByType(type);
                for (var i in list) {
                    var vo = list[i];
                    if (vo.canUpLevel() && !(this.isInUpLv(vo.id)))
                        return true;
                }
            }
            else {
                var vo = this.getTechVoById(id);
                if (vo)
                    return vo.canUpLevel();
            }
        }
        return false;
    };
    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //常规效果类型 begin
    //============================================================================================================================================= 
    /**
     * @param baseVal 基础值
     * @param mainType 科技主类型
     * @param subType 科技子类型
     */
    TechnoModel.getTechnoNorEffVal = function (baseVal, mainType, subType) {
        var value = baseVal;
        for (var id in this.technoList) {
            var vo = this.technoList[id];
            if (vo.level > 0 && vo.addMainType == mainType && vo.addSubType == subType) {
                value = vo.addValType == 0 ? (value + vo.addValue) : Math.floor(value + value * vo.addValue);
            }
        }
        return value;
    };
    return TechnoModel;
}());
