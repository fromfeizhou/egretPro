/**城市建设 */
var CityBuildModel = /** @class */ (function () {
    function CityBuildModel() {
    }
    CityBuildModel.init = function () {
        this.m_pPlayerMadeInfo = {};
        this.curCityId = -1;
        this.cityBuildDic = {};
        this.onBuildGens = [];
        this.sumExpDic = {};
    };
    CityBuildModel.clear = function () {
        this.m_pPlayerMadeInfo = null;
        this.curCityId = -1;
        this.cityBuildDic = null;
        this.sumExpDic = null;
        this.bOnTick = false;
        this.onBuildGens = null;
        Utils.TimerManager.remove(this.onFunction, this);
    };
    //=========================城池建设新 开始========================
    /**解析城池建设列表 */
    CityBuildModel.parseCityBuilds = function (list) {
        for (var i = 0; i < list.length; i++) {
            this.addCityBuild(list[i]);
        }
        this.openTick();
    };
    /**领取奖励 */
    CityBuildModel.rewardCity = function (cityId) {
    };
    /**更新城池建设 */
    CityBuildModel.updateCityBuild = function (data) {
        if (this.cityBuildDic[data.cityId]) {
            this.cityBuildDic[data.cityId].update(data);
        }
    };
    /**获得建造数据 */
    CityBuildModel.getCityInfo = function (cityId) {
        return this.cityBuildDic[cityId];
    };
    /**添加城池建设 */
    CityBuildModel.addCityBuild = function (data) {
        if (this.cityBuildDic[data.cityId]) {
            this.updateCityBuild(data);
            return;
        }
        var vo = CityBuildVo.create();
        vo.init(data);
        this.cityBuildDic[vo.cityId] = vo;
    };
    CityBuildModel.openTick = function () {
        if (this.bOnTick)
            return;
        this.bOnTick = true;
        //每分钟检查一遍
        Utils.TimerManager.doTimer(60000, 0, this.onFunction, this);
    };
    /**活动定时器 */
    CityBuildModel.onFunction = function () {
        for (var i in this.cityBuildDic) {
            this.cityBuildDic[i].updateTime();
        }
    };
    CityBuildModel.initPlayerMadeInfo = function (infos) {
        CityBuildModel.parseCityBuilds(infos);
    };
    /**更新武将 */
    CityBuildModel.updateGens = function (id, cityId, isDel) {
        if (isDel === void 0) { isDel = false; }
        var index = -1;
        var data = null;
        for (var i = 0; i < this.onBuildGens.length; i++) {
            data = this.onBuildGens[i];
            if (isNull(data))
                continue;
            if (data.generalId == id) {
                index = i;
                break;
            }
        }
        if (isDel) {
            if (index >= 0) {
                this.onBuildGens.splice(index, 1);
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_BUILD_HERO_DEL, cityId);
            }
        }
        else {
            if (index == -1) {
                data = { generalId: id, cityId: cityId };
                this.onBuildGens.push(data);
            }
        }
    };
    /**是否真正建造武将 */
    CityBuildModel.getBuildGenCityId = function (id) {
        if (isNull(this.onBuildGens) || this.onBuildGens.length == 0)
            return -1;
        for (var _i = 0, _a = this.onBuildGens; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.generalId == id)
                return data.cityId;
        }
        return -1;
    };
    /**建设度 */
    CityBuildModel.initSumExp = function (sumExp) {
        this.sumExp = sumExp;
    };
    Object.defineProperty(CityBuildModel, "initNpcLevel", {
        /**城池NPC驻军等级 */
        set: function (npcLevel) {
            this.npcLevel = npcLevel;
        },
        enumerable: true,
        configurable: true
    });
    /**解析所有城池建设度 */
    CityBuildModel.parseCityBuildsExp = function (list) {
        for (var i = 0; i < list.length; i++) {
            this.addCityBuildExp(list[i]);
        }
    };
    /**更新城池建设度 */
    CityBuildModel.updateCityBuildExp = function (data) {
        if (this.sumExpDic[data.cityId]) {
            this.sumExpDic[data.cityId] = data;
        }
    };
    /**获得城池建设度数据 */
    CityBuildModel.getCityInfoExp = function (cityId) {
        return this.sumExpDic[cityId];
    };
    /**添加城池建设度 */
    CityBuildModel.addCityBuildExp = function (data) {
        if (this.sumExpDic[data.cityId]) {
            this.updateCityBuildExp(data);
            return;
        }
        this.sumExpDic[data.cityId] = data;
    };
    CityBuildModel.initPlayerMadeInfoExp = function (infos) {
        CityBuildModel.parseCityBuildsExp(infos);
    };
    /**是否存在城市建筑信息 */
    CityBuildModel.hasCityBuildInfo = function (cityId) {
        return unNull(this.getCityInfo(cityId));
    };
    CityBuildModel.getCityInfoByGeneralId = function (generalId) {
        var cityId = this.getBuildGenCityId(generalId);
        if (cityId > 0)
            return this.getCityInfo(cityId);
        return null;
    };
    /**获取城池特权 */
    CityBuildModel.getCityPrivilege = function (cityId) {
        // 城池等级个数
        var list = this.getCityMadeConfigById(cityId);
        var _a = this.getCityExpLevel2(cityId, this.sumExp), level = _a[0], config = _a[1];
        var typeList = [];
        var str = "";
        var typeConfig = null;
        for (var i = 0, len = list.length; i < len; i++) {
            if (isNull(list[i]))
                continue;
            var item = list[i];
            typeConfig = C.CityRewardTypeConfig[item.cityRewardType];
            var textColor = 0xabb7d1;
            var isActive = false;
            if (item.level <= level) {
                textColor = 0xabb7d1;
                isActive = true;
            }
            else {
                textColor = 0x5d5f64;
                isActive = false;
            }
            str = "<font color=" + textColor + ">" + GCode(CLEnum.LEVEL2) + item.level + "\uFF1A" + typeConfig.name + "</font>";
            if (item.cityRewardType == CityRewardType.REVENUE || item.cityRewardType == CityRewardType.GATHER) {
                str += "<font color=0x00ff00>+" + item.cityReward / 100 + "%</font>";
            }
            typeList.push({ str: str, tc: typeConfig, isActive: isActive });
        }
        return typeList;
    };
    /**是否存在城池特权 */
    CityBuildModel.hasCityPrivilege = function (cityId, type) {
        // 城池等级个数
        var list = this.getCityMadeConfigById(cityId);
        var cVo = this.getCityInfo(cityId);
        var sumExp = this.sumExp;
        if (cVo) {
            sumExp = cVo.sumExp;
        }
        else if (unNull(this.getCityInfoExp(cityId))) {
            sumExp = this.getCityInfoExp(cityId).progress;
        }
        var _a = this.getCityExpLevel2(cityId, sumExp), level = _a[0], config = _a[1];
        var isHas = false;
        for (var i = 0, len = list.length; i < len; i++) {
            if (isNull(list[i]))
                continue;
            var item = list[i];
            var typeConfig = C.CityRewardTypeConfig[item.cityRewardType];
            if (item.level <= level && item.cityRewardType == type) {
                isHas = true;
                break;
            }
        }
        return isHas;
    };
    /**获取城池特权数值 */
    CityBuildModel.getCityPrivilegeValues = function (cityId, type) {
        // 城池等级个数
        var list = this.getCityMadeConfigById(cityId);
        var cVo = this.getCityInfo(cityId);
        var sumExp = this.sumExp;
        if (cVo) {
            sumExp = cVo.sumExp;
        }
        else if (unNull(this.getCityInfoExp(cityId))) {
            sumExp = this.getCityInfoExp(cityId).progress;
        }
        var _a = this.getCityExpLevel2(cityId, sumExp), level = _a[0], config = _a[1];
        var sumValue = 0;
        for (var i = 0, len = list.length; i < len; i++) {
            if (isNull(list[i]))
                continue;
            var item = list[i];
            var typeConfig = C.CityRewardTypeConfig[item.cityRewardType];
            if (item.level <= level && item.cityRewardType == type) {
                sumValue += item.cityReward;
            }
        }
        return sumValue;
    };
    /**获取已招募的武将 */
    CityBuildModel.getRecruitedGeneral = function () {
        var ownDic = [];
        var dic = GeneralModel.getOwnerGeneralList();
        dic.forEach(function (k, v) {
            if (v.own)
                ownDic.push(v);
        });
        return ownDic;
    };
    /**获取城池建设元宝加速消耗 */
    CityBuildModel.getCityBuildFinishGold = function (id) {
        var buildVo = this.getCityInfo(id);
        if (unNull(buildVo)) {
            if (buildVo.startDate > 0) {
                var curtime = TimerUtils.getServerTime();
                var time = buildVo.endDate - curtime;
                return Utils.TimeGold(time);
            }
            else {
                // let [,lvCfg] = this.getCityExpLevel(buildVo);
                var _a = this.getCityExpLevel2(id, this.sumExp), level = _a[0], lvCfg = _a[1];
                lvCfg = this.getCityMadeConfig(this.curCityId, level);
                // vip特权减少时间  城市建筑升级先不加 后续处理
                // let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;  //vip特权减少时间
                var vipSpeedMillSecond = 0;
                var lostTime = Math.floor(lvCfg.time - vipSpeedMillSecond);
                return Utils.TimeGold(lostTime * 60);
            }
        }
        else {
            var _b = this.getCityExpLevel2(id, this.sumExp), level = _b[0], lvCfg = _b[1];
            lvCfg = this.getCityMadeConfig(this.curCityId, level);
            // vip特权减少时间  城市建筑升级先不加 后续处理
            // let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;  //vip特权减少时间
            var vipSpeedMillSecond = 0;
            var lostTime = Math.floor(lvCfg.time - vipSpeedMillSecond);
            return Utils.TimeGold(lostTime * 60);
        }
    };
    /**获得建造倒计时数据结构 */
    CityBuildModel.getCountDownValues = function (id) {
        var buildVo = this.getCityInfo(id);
        if (buildVo) {
            var stime = buildVo.startDate;
            var etime = buildVo.endDate;
            var spTime = buildVo.speedTime;
            return Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000);
        }
        return null;
    };
    /**获得建筑红点 */
    CityBuildModel.getRedState = function (cityId) {
        if (!FunctionModel.isFunctionOpen(FunctionType.WORLD_MAP))
            return 0;
        if (unNull(cityId)) {
            var vo = this.cityBuildDic[cityId];
            if (vo)
                return vo.canReward() ? 1 : 0;
        }
        else {
            for (var i in this.cityBuildDic) {
                var vo = this.cityBuildDic[i];
                if (vo.canReward())
                    return 1;
            }
        }
        return 0;
    };
    /**是否被占领 */
    CityBuildModel.unOwnerCity = function (cityId) {
        if (!WorldModel.isOwnerCity(cityId)) {
            // com_main.UpManager.history();
            var city = WorldModel.getCityBuildInfo(cityId);
            var cityName = WorldModel.getCityName(city.id);
            var countryName = WorldModel.checkCountry(city.country);
            EffectUtils.showTips(cityName + "\u5DF2\u88AB" + countryName + "\u56FD\u5360\u9886\uFF0C\u5931\u53BB\u5EFA\u8BBE\u6743");
            return true;
        }
        return false;
    };
    //=========================城池建设 结束========================
    /**============================================================================================================================
     * 配置表 相关
     * ============================================================================================================================
     * */
    /**获取城池信息 */
    CityBuildModel.getCityMadeConfig = function (cityId, level) {
        return C.CityMadeConfigDic[cityId] ? C.CityMadeConfigDic[cityId][level] : null;
    };
    /**获取最大经验与配置表 */
    CityBuildModel.getMaxSumExp = function (cityId) {
        // 已排序的列表
        var cfgCity = this.getCityMadeConfigById(cityId);
        var len = cfgCity.length;
        if (len == 0)
            return [0, null];
        return [cfgCity[len - 1].sumExp, cfgCity[len - 1]];
    };
    /**获取城池经验等级2 */
    CityBuildModel.getCityExpLevel2 = function (cityId, sumExp) {
        if (isNull(cityId))
            return null;
        var madeConfiList = this.getCityMadeConfigById(cityId);
        var config = null;
        var cVo = this.getCityInfo(cityId);
        if (cVo) {
            sumExp = cVo.sumExp;
        }
        else if (unNull(this.getCityInfoExp(cityId))) {
            sumExp = this.getCityInfoExp(cityId).progress;
        }
        // 是否达到最大
        var _a = this.getMaxSumExp(cityId), maxSumExp = _a[0], maxConfig = _a[1];
        if (isNull(maxConfig))
            return [1, config];
        if (sumExp >= maxSumExp)
            return [maxConfig.level, maxConfig];
        for (var i = 0; i < madeConfiList.length; i++) {
            var mConfig = madeConfiList[i];
            // 第一个
            if (mConfig.sumExp > sumExp) {
                config = mConfig;
                break;
            }
        }
        return [config.level - 1, config];
    };
    /**根据id获取城池建造配置表 */
    CityBuildModel.getCityMadeConfigById = function (cityId) {
        var cfgList = C.CityMadeConfigDic[cityId];
        var res = [];
        for (var key in cfgList) {
            var cfg = cfgList[key];
            if (cfg)
                res.push(cfg);
        }
        SortTools.sortMap(res, "level", true);
        return res;
    };
    /**建造列表 */
    CityBuildModel.m_pPlayerMadeInfo = {};
    CityBuildModel.curCityId = -1;
    CityBuildModel.sumExp = 0;
    CityBuildModel.npcLevel = 1;
    return CityBuildModel;
}());
