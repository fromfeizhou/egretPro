var FateStatus;
(function (FateStatus) {
    /** 未激活*/
    FateStatus[FateStatus["NOT_ACTIVE"] = 0] = "NOT_ACTIVE";
    /** 已经激活*/
    FateStatus[FateStatus["FINISH_ACTIVE"] = 1] = "FINISH_ACTIVE";
    /** 能激活*/
    FateStatus[FateStatus["CAN_ACTIVE"] = 2] = "CAN_ACTIVE";
})(FateStatus || (FateStatus = {}));
var FateTriggerType;
(function (FateTriggerType) {
    /**武将 */
    FateTriggerType[FateTriggerType["GENERAL"] = 1] = "GENERAL";
    FateTriggerType[FateTriggerType["TEAM"] = 2] = "TEAM";
})(FateTriggerType || (FateTriggerType = {}));
var FateModel = /** @class */ (function () {
    function FateModel() {
    }
    FateModel.init = function () {
        this.initFateCfg();
    };
    /**数据清理 */
    FateModel.clear = function () {
        this.generalFateVoList = null;
        this.generlFateCfgGeneralList = null;
        this.generlFateCfgList = null;
    };
    /**初始化缘分 */
    FateModel.initFateCfg = function () {
        this.generalFateVoList = {};
        this.fateTypeCurLevelDic = {};
        this.generlFateCfgList = {};
        this.generlFateCfgGeneralList = {};
        for (var key in C.RelationConfig) {
            var data = C.RelationConfig[key];
            if (unNull(data) && unNull(data.generalId) && unNull(data.triggerType == FateTriggerType.GENERAL)) {
                if (isNull(this.generlFateCfgList[data.generalId])) {
                    this.generlFateCfgList[data.generalId] = {};
                    this.generalFateVoList[data.generalId] = {};
                }
                if (isNull(this.generlFateCfgList[data.generalId][data.relationId])) {
                    this.generlFateCfgList[data.generalId][data.relationId] = [];
                    this.generalFateVoList[data.generalId][data.relationId] = FateVo.create(data.id);
                    ;
                }
                this.generlFateCfgList[data.generalId][data.relationId].push(data);
                //关联武将map
                if (data.triggerParameter) {
                    if (isNull(this.generlFateCfgGeneralList[data.generalId]))
                        this.generlFateCfgGeneralList[data.generalId] = [];
                    var triggerParameter = data.triggerParameter.split(",");
                    for (var index = 0; index < triggerParameter.length; index++) {
                        var triggerArr = triggerParameter[index].split("_");
                        if (data.generalId == Number(triggerArr[0])) {
                            continue;
                        }
                        if (this.generlFateCfgGeneralList[data.generalId].indexOf(Number(triggerArr[0])) == -1)
                            this.generlFateCfgGeneralList[data.generalId].push(Number(triggerArr[0]));
                        if (isNull(this.generlFateCfgGeneralList[Number(triggerArr[0])])) {
                            this.generlFateCfgGeneralList[Number(triggerArr[0])] = [];
                        }
                        if (this.generlFateCfgGeneralList[Number(triggerArr[0])].indexOf(data.generalId) == -1)
                            this.generlFateCfgGeneralList[Number(triggerArr[0])].push(data.generalId);
                    }
                }
            }
        }
    };
    /**获得武将缘分列表显示数据 每一种类型取一条*/
    FateModel.getGeneralFateViewDataByGenId = function (generlId) {
        var fateVoList = [];
        for (var key in this.generalFateVoList[generlId]) {
            fateVoList.push(this.generalFateVoList[generlId][Number(key)]);
        }
        return fateVoList;
    };
    /**检查这个武将是否已经配置了缘分 */
    FateModel.checkGeneralFate = function (generalId) {
        return unNull(this.generlFateCfgList[generalId]);
    };
    /**检查武将是否有可激活的缘分 */
    FateModel.checkCanActiveFate = function (generlId) {
        if (!FunctionModel.isFunctionOpen(FunctionType.GENERAL_FATE))
            return false;
        for (var key in this.generalFateVoList[generlId]) {
            var fateVo = this.generalFateVoList[generlId][Number(key)];
            if (isNull(fateVo))
                continue;
            if (fateVo.status == FateStatus.CAN_ACTIVE)
                return true;
        }
        return false;
    };
    /**更新武将缘分 */
    FateModel.updateSingleGeneralFateStatus = function (generalId) {
        for (var key in this.generlFateCfgList[generalId]) {
            var fateVo = this.generalFateVoList[generalId][Number(key)];
            if (isNull(fateVo)) {
                var fateTypeCfgList = this.generlFateCfgList[generalId][Number(key)];
                fateTypeCfgList.sort(this.sortByLevel);
                var curId = fateTypeCfgList[0].id;
                if (unNull(this.fateTypeCurLevelDic[fateTypeCfgList[0].relationId])) {
                    curId = fateTypeCfgList[this.fateTypeCurLevelDic[fateTypeCfgList[0].relationId]].id;
                }
                fateVo = FateVo.create(curId);
            }
            fateVo.updateStatus(); //更新状态
            this.generalFateVoList[generalId][Number(key)] = fateVo;
        }
    };
    /**更新关联武将状态 */
    FateModel.updateRelationGeneralStatus = function (generlId) {
        var generlIdList = this.generlFateCfgGeneralList[generlId];
        if (unNull(generlIdList) && unNull(generlIdList.length > 0)) {
            var len = generlIdList.length;
            for (var index = 0; index < len; index++) {
                this.updateSingleGeneralFateStatus(generlIdList[index]);
            }
        }
    };
    FateModel.sortByLevel = function (p1, p2) {
        return p1.level - p2.level;
    };
    /**更新缘分状态 */
    FateModel.updateGneralFateActiveList = function (data) {
        this.fateVoActiveList = data.relationList;
        if (unNull(this.fateVoActiveList)) {
            for (var j = 0; j < this.fateVoActiveList.length; j++) {
                this.updateCurFateTypeLevel(this.fateVoActiveList[j]);
            }
        }
    };
    /**激活 */
    FateModel.updateActiveList = function (id) {
        if (this.fateVoActiveList.indexOf(id) == -1) {
            this.fateVoActiveList.push(id);
        }
    };
    /*更新当前武将缘分的最高等级*/
    FateModel.updateCurFateTypeLevel = function (id) {
        var fateCfg = C.RelationConfig[id];
        if (unNull(fateCfg) && unNull(fateCfg.relationId)) {
            this.fateTypeCurLevelDic[fateCfg.relationId] = fateCfg.level;
            //拿到当前这种类型的最大缘分
            var curVo = this.generalFateVoList[fateCfg.generalId][fateCfg.relationId];
            var fateTypeCfgList = this.generlFateCfgList[fateCfg.generalId][fateCfg.relationId];
            fateTypeCfgList.sort(this.sortByLevel);
            //取到当前等级的下一个
            var curFateId = fateCfg.level == fateTypeCfgList.length ? fateCfg.id : fateTypeCfgList[fateCfg.level].id;
            if (isNull(curVo)) {
                curVo = FateVo.create(curFateId);
            }
            else {
                curVo.parseData(curFateId); //替换掉id；
            }
            curVo.updateStatus();
            this.generalFateVoList[fateCfg.generalId][fateCfg.relationId] = curVo;
        }
    };
    /**武将更新 更新缘分状态 */
    FateModel.updateGeneralFate = function (data) {
        var len = data.generalInfo.length;
        if (len == 0)
            return;
        for (var index = 0; index < len; index++) {
            var genVo = GeneralModel.getOwnGeneral(data.generalInfo[index].generalId);
            this.updateSingleGeneralFateStatus(data.generalInfo[index].generalId);
        }
    };
    /**当前已激活的最高等级 */
    FateModel.getFateTypeCurLev = function (relationId) {
        return this.fateTypeCurLevelDic[relationId];
    };
    /**当前已激活的最高等级配置 */
    FateModel.getCurFinshActiveFateCfg = function (id) {
        var fateCfg = C.RelationConfig[id];
        var fateCfgList = this.generlFateCfgList[fateCfg.generalId][fateCfg.relationId];
        //排序
        fateCfgList.sort(this.sortByLevel);
        var curActiveMaxLev = isNull(this.fateTypeCurLevelDic[fateCfg.relationId]) ? 0 : this.fateTypeCurLevelDic[fateCfg.relationId];
        for (var index = 0; index < fateCfgList.length; index++) {
            if (fateCfgList[index].level == curActiveMaxLev)
                return fateCfgList[index];
        }
        return fateCfgList[0]; //还没有记录取第一个
    };
    FateModel.getPrefateCfg = function (id) {
        var fateCfg = C.RelationConfig[id];
        var fateCfgList = this.generlFateCfgList[fateCfg.generalId][fateCfg.relationId];
        //排序
        fateCfgList.sort(function (p1, p2) {
            return p2.level - p1.level;
        });
        for (var index = 0; index < fateCfgList.length; index++) {
            if (fateCfgList[index].level < fateCfg.level)
                return fateCfgList[index];
        }
        return fateCfgList[fateCfgList.length - 1]; //取最小
    };
    /**得到当前缘分的下一个缘分星级 */
    FateModel.getNextFateStar = function (id) {
        var fateCfg = C.RelationConfig[id];
        var param = fateCfg.triggerParameter.split(",")[0].split("_")[1];
        return Number(param);
    };
    FateModel.isFirstEnter = true;
    return FateModel;
}());
