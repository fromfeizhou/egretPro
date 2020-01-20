
/**城市建设 */
class CityBuildModel {
    /**建造列表 */
    public static m_pPlayerMadeInfo: { [K: number]: gameProto.IPlayerMadeInfo } = {};
    /**建造列表 */
    public static cityBuildDic: { [id: number]: CityBuildVo };
    public static curCityId: number = -1;
    public static sumExp: number = 0;
    public static npcLevel: number = 1;
    public static sumExpDic: { [id: number]: gameProto.ICityProgress };

    private static bOnTick: boolean;   //开启活动计时
    private static onBuildGens: { generalId: number, cityId: number }[];  //建造中武将列表

    public static init() {
        this.m_pPlayerMadeInfo = {};
        this.curCityId = -1;
        this.cityBuildDic = {};
        this.onBuildGens = [];
        this.sumExpDic = {};
    }

    public static clear() {
        this.m_pPlayerMadeInfo = null;
        this.curCityId = -1;
        this.cityBuildDic = null;
        this.sumExpDic = null;
        this.bOnTick = false;
        this.onBuildGens = null;
        Utils.TimerManager.remove(this.onFunction, this)
    }

    //=========================城池建设新 开始========================
    /**解析城池建设列表 */
    public static parseCityBuilds(list: gameProto.IPlayerMadeInfo[]) {
        for (let i = 0; i < list.length; i++) {
            this.addCityBuild(list[i]);
        }
        this.openTick();
    }

    /**领取奖励 */
    public static rewardCity(cityId: number) {
    }

    /**更新城池建设 */
    public static updateCityBuild(data: gameProto.IPlayerMadeInfo) {
        if (this.cityBuildDic[data.cityId]) {
            this.cityBuildDic[data.cityId].update(data);
        }
    }

    /**获得建造数据 */
    public static getCityInfo(cityId: number): CityBuildVo {
        return this.cityBuildDic[cityId];
    }

    /**添加城池建设 */
    public static addCityBuild(data: gameProto.IPlayerMadeInfo) {
        if (this.cityBuildDic[data.cityId]) {
            this.updateCityBuild(data);
            return;
        }
        let vo = CityBuildVo.create();
        vo.init(data);
        this.cityBuildDic[vo.cityId] = vo;
    }


    private static openTick() {
        if (this.bOnTick) return;
        this.bOnTick = true;
        //每分钟检查一遍
        Utils.TimerManager.doTimer(60000, 0, this.onFunction, this);
    }

    /**活动定时器 */
    private static onFunction() {
        for (let i in this.cityBuildDic) {
            this.cityBuildDic[i].updateTime();
        }
    }

    public static initPlayerMadeInfo(infos: gameProto.IPlayerMadeInfo[]) {
        CityBuildModel.parseCityBuilds(infos);
    }

    /**更新武将 */
    public static updateGens(id: number, cityId: number, isDel: boolean = false) {
        let index = -1;
        let data: { generalId: number, cityId: number } = null;
        for (let i = 0; i < this.onBuildGens.length; i++) {
            data = this.onBuildGens[i];
            if (isNull(data)) continue;
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
        } else {
            if (index == -1) {
                data = { generalId: id, cityId: cityId };
                this.onBuildGens.push(data);
            }
        }
    }

    /**是否真正建造武将 */
    public static getBuildGenCityId(id: number) {
        if (isNull(this.onBuildGens) || this.onBuildGens.length == 0) return -1;
        for (let data of this.onBuildGens) {
            if (data.generalId == id) return data.cityId;
        }
        return -1;
    }

    /**建设度 */
    public static initSumExp(sumExp: number) {
        this.sumExp = sumExp;
    }

    /**城池NPC驻军等级 */
    public static set initNpcLevel(npcLevel: number) {
        this.npcLevel = npcLevel;
    }
    

    /**解析所有城池建设度 */
    public static parseCityBuildsExp(list: gameProto.ICityProgress[]) {
        for (let i = 0; i < list.length; i++) {
            this.addCityBuildExp(list[i]);
        }
    }

    /**更新城池建设度 */
    public static updateCityBuildExp(data: gameProto.ICityProgress) {
        if (this.sumExpDic[data.cityId]) {
            this.sumExpDic[data.cityId] = data;
        }
    }

    /**获得城池建设度数据 */
    public static getCityInfoExp(cityId: number): gameProto.ICityProgress {
        return this.sumExpDic[cityId];
    }

    /**添加城池建设度 */
    public static addCityBuildExp(data: gameProto.ICityProgress) {
        if (this.sumExpDic[data.cityId]) {
            this.updateCityBuildExp(data);
            return;
        }
        this.sumExpDic[data.cityId] = data;
    }

    public static initPlayerMadeInfoExp(infos: gameProto.ICityProgress[]) {
        CityBuildModel.parseCityBuildsExp(infos);
    }

    /**是否存在城市建筑信息 */
    public static hasCityBuildInfo(cityId: number): boolean {
        return unNull(this.getCityInfo(cityId));
    }

    public static getCityInfoByGeneralId(generalId: number): CityBuildVo {
        let cityId = this.getBuildGenCityId(generalId);
        if (cityId > 0) return this.getCityInfo(cityId);
        return null;
    }

    /**获取城池特权 */
    public static getCityPrivilege(cityId: number): { str: string, tc: CityRewardTypeConfig, isActive?: boolean }[] {
        // 城池等级个数
        let list = this.getCityMadeConfigById(cityId);
        let [level, config] = this.getCityExpLevel2(cityId, this.sumExp);
        let typeList: { str: string, tc: CityRewardTypeConfig, isActive?: boolean }[] = [];
        let str: string = "";
        let typeConfig: CityRewardTypeConfig = null;
        for (let i = 0, len = list.length; i < len; i++) {
            if (isNull(list[i])) continue;
            let item = list[i];
            typeConfig = C.CityRewardTypeConfig[item.cityRewardType];
            let textColor = 0xabb7d1;
            let isActive: boolean = false;
            if (item.level <= level) {
                textColor = 0xabb7d1;
                isActive = true;
            } else {
                textColor = 0x5d5f64;
                isActive = false;
            }
            str = `<font color=${textColor}>${GCode(CLEnum.LEVEL2)}${item.level}：${typeConfig.name}</font>`;
            if (item.cityRewardType == CityRewardType.REVENUE || item.cityRewardType == CityRewardType.GATHER) {
                str += `<font color=0x00ff00>+${item.cityReward / 100}%</font>`;
            }
            typeList.push({ str: str, tc: typeConfig, isActive: isActive });
        }
        return typeList;
    }

    /**是否存在城池特权 */
    public static hasCityPrivilege(cityId: number, type: CityRewardType): boolean {
        // 城池等级个数
        let list = this.getCityMadeConfigById(cityId);
        let cVo = this.getCityInfo(cityId);
        let sumExp = this.sumExp;
        if (cVo) {
            sumExp = cVo.sumExp;
        } else if (unNull(this.getCityInfoExp(cityId))) {
            sumExp = this.getCityInfoExp(cityId).progress;
        }
        let [level, config] = this.getCityExpLevel2(cityId, sumExp);
        let isHas: boolean = false;
        for (let i = 0, len = list.length; i < len; i++) {
            if (isNull(list[i])) continue;
            let item = list[i];
            let typeConfig = C.CityRewardTypeConfig[item.cityRewardType];
            if (item.level <= level && item.cityRewardType == type) {
                isHas = true;
                break;
            }
        }
        return isHas;
    }

    /**获取城池特权数值 */
    public static getCityPrivilegeValues(cityId: number, type: CityRewardType): number {
        // 城池等级个数
        let list = this.getCityMadeConfigById(cityId);
        let cVo = this.getCityInfo(cityId);
        let sumExp = this.sumExp;
        if (cVo) {
            sumExp = cVo.sumExp;
        } else if (unNull(this.getCityInfoExp(cityId))) {
            sumExp = this.getCityInfoExp(cityId).progress;
        }
        let [level, config] = this.getCityExpLevel2(cityId, sumExp);
        let sumValue: number = 0;
        for (let i = 0, len = list.length; i < len; i++) {
            if (isNull(list[i])) continue;
            let item = list[i];
            let typeConfig = C.CityRewardTypeConfig[item.cityRewardType];
            if (item.level <= level && item.cityRewardType == type) {
                sumValue += item.cityReward;
            }
        }
        return sumValue;
    }

    /**获取已招募的武将 */
    public static getRecruitedGeneral(): GeneralVo[] {
        let ownDic: GeneralVo[] = [];
        let dic = GeneralModel.getOwnerGeneralList();
        dic.forEach((k: any, v: GeneralVo) => {
            if (v.own) ownDic.push(v);
        })
        return ownDic;
    }

    /**获取城池建设元宝加速消耗 */
    public static getCityBuildFinishGold(id: number): number {
        let buildVo = this.getCityInfo(id);
        if (unNull(buildVo)) {
            if (buildVo.startDate > 0) {
                let curtime = TimerUtils.getServerTime();
                let time = buildVo.endDate - curtime;
                return Utils.TimeGold(time);
            } else {
                // let [,lvCfg] = this.getCityExpLevel(buildVo);
                let [level, lvCfg] = this.getCityExpLevel2(id, this.sumExp);
                lvCfg = this.getCityMadeConfig(this.curCityId, level);
                // vip特权减少时间  城市建筑升级先不加 后续处理
                // let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;  //vip特权减少时间
                let vipSpeedMillSecond = 0;
                let lostTime = Math.floor(lvCfg.time - vipSpeedMillSecond);
                return Utils.TimeGold(lostTime * 60);
            }
        } else {
            let [level, lvCfg] = this.getCityExpLevel2(id, this.sumExp);
            lvCfg = this.getCityMadeConfig(this.curCityId, level);
            // vip特权减少时间  城市建筑升级先不加 后续处理
            // let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;  //vip特权减少时间
            let vipSpeedMillSecond = 0;
            let lostTime = Math.floor(lvCfg.time - vipSpeedMillSecond);
            return Utils.TimeGold(lostTime * 60);
        }
    }

    /**获得建造倒计时数据结构 */
    public static getCountDownValues(id: number): any[] {
        let buildVo = this.getCityInfo(id);
        if (buildVo) {
            let stime = buildVo.startDate;
            let etime = buildVo.endDate;
            let spTime = buildVo.speedTime;
            return Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000);
        }
        return null;
    }

    /**获得建筑红点 */
    public static getRedState(cityId: number) {
        if (!FunctionModel.isFunctionOpen(FunctionType.WORLD_MAP)) return 0;
        if (unNull(cityId)) {
            let vo = this.cityBuildDic[cityId];
            if (vo) return vo.canReward() ? 1 : 0;
        } else {
            for (let i in this.cityBuildDic) {
                let vo = this.cityBuildDic[i]
                if (vo.canReward()) return 1;
            }
        }
        return 0;
    }

    /**是否被占领 */
    public static unOwnerCity(cityId: number): boolean {
        if (!WorldModel.isOwnerCity(cityId)) {
            // com_main.UpManager.history();
            let city = WorldModel.getCityBuildInfo(cityId);
            let cityName = WorldModel.getCityName(city.id);
            let countryName = WorldModel.checkCountry(city.country);
            EffectUtils.showTips(`${cityName}已被${countryName}国占领，失去建设权`);
            return true;
        }
        return false;
    }
    //=========================城池建设 结束========================


    /**============================================================================================================================
     * 配置表 相关
     * ============================================================================================================================
     * */

    /**获取城池信息 */
    public static getCityMadeConfig(cityId, level): CityMadeConfig {
        return C.CityMadeConfigDic[cityId] ? C.CityMadeConfigDic[cityId][level] : null;
    }

    /**获取最大经验与配置表 */
    public static getMaxSumExp(cityId: number): [number, CityMadeConfig] {
        // 已排序的列表
        let cfgCity = this.getCityMadeConfigById(cityId);
        let len = cfgCity.length;
        if (len == 0) return [0, null];
        return [cfgCity[len - 1].sumExp, cfgCity[len - 1]];
    }

    /**获取城池经验等级2 */
    public static getCityExpLevel2(cityId: number, sumExp: number): [number, CityMadeConfig] {
        if (isNull(cityId)) return null;
        let madeConfiList = this.getCityMadeConfigById(cityId);
        let config: CityMadeConfig = null;

        let cVo = this.getCityInfo(cityId);
        if (cVo) {
            sumExp = cVo.sumExp;
        } else if (unNull(this.getCityInfoExp(cityId))) {
            sumExp = this.getCityInfoExp(cityId).progress;
        }
        // 是否达到最大
        let [maxSumExp, maxConfig] = this.getMaxSumExp(cityId);
        if (isNull(maxConfig)) return [1, config];
        if (sumExp >= maxSumExp) return [maxConfig.level, maxConfig];

        for (let i = 0; i < madeConfiList.length; i++) {
            let mConfig = madeConfiList[i];
            // 第一个
            if (mConfig.sumExp > sumExp) {
                config = mConfig;
                break;
            }
        }
        return [config.level - 1, config];
    }


    /**根据id获取城池建造配置表 */
    public static getCityMadeConfigById(cityId: number): CityMadeConfig[] {
        let cfgList = C.CityMadeConfigDic[cityId];
        let res: CityMadeConfig[] = [];
        for (let key in cfgList) {
            let cfg = cfgList[key];
            if (cfg) res.push(cfg);
        }
        SortTools.sortMap(res, "level", true);
        return res;
    }
}