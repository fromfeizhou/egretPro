/** 建筑效果类型表 */
var MainBuildEffectType;
(function (MainBuildEffectType) {
    /** 粮食产量 */
    MainBuildEffectType[MainBuildEffectType["FOOD_YIELD"] = 1] = "FOOD_YIELD";
    /** 粮食上限 */
    MainBuildEffectType[MainBuildEffectType["FOOD_MAX"] = 2] = "FOOD_MAX";
    /** 银币产量 */
    MainBuildEffectType[MainBuildEffectType["SILVER_YIELD"] = 4] = "SILVER_YIELD";
    /** 银币上限 */
    MainBuildEffectType[MainBuildEffectType["SILVER_MAX"] = 5] = "SILVER_MAX";
    /** 庆典分数增加 */
    MainBuildEffectType[MainBuildEffectType["QD_BUILD_FS"] = 7] = "QD_BUILD_FS";
    /** 庆典暴击率 */
    MainBuildEffectType[MainBuildEffectType["QD_BUILD_BJ"] = 8] = "QD_BUILD_BJ";
    /** 庆典后必定暴击所需次数 */
    MainBuildEffectType[MainBuildEffectType["QD_BUILD_BJ_N"] = 10] = "QD_BUILD_BJ_N";
    /** 木材产量 */
    MainBuildEffectType[MainBuildEffectType["WOOD_YIELD"] = 19] = "WOOD_YIELD";
    /** 木材上限 */
    MainBuildEffectType[MainBuildEffectType["WOOD_MAX"] = 20] = "WOOD_MAX";
    /** 铁矿产量 */
    MainBuildEffectType[MainBuildEffectType["IRON_YIELD"] = 21] = "IRON_YIELD";
    /** 铁矿上限 */
    MainBuildEffectType[MainBuildEffectType["IRON_MAX"] = 22] = "IRON_MAX";
    /** 元宝产量 */
    MainBuildEffectType[MainBuildEffectType["GOLD_YIELD"] = 23] = "GOLD_YIELD";
    /**元宝上限 */
    MainBuildEffectType[MainBuildEffectType["GOLD_MAX"] = 24] = "GOLD_MAX";
    /** 招募令 */
    MainBuildEffectType[MainBuildEffectType["RECRUITMENT_YIELD"] = 25] = "RECRUITMENT_YIELD";
    /**招募令上限 */
    MainBuildEffectType[MainBuildEffectType["RECRUITMENT_MAX"] = 26] = "RECRUITMENT_MAX";
})(MainBuildEffectType || (MainBuildEffectType = {}));
// enum MBuildType {
//     NONE = -1,
//     HALL = 0,//大殿
//     FARMLAND = 1,//农田
//     MARKET = 2,//市场
//     // GRANARY = 3,//粮仓 废弃
//     // WAREHOUSE = 4,//仓库 废弃
//     TAVERN = 5,//酒馆
//     YWC = 6,//演武场
//     XY = 7, //副本
//     CLFB = 8,//材料副本
//     DCY = 9,//督察院
//     JJC = 10,//军机处
//     LTG = 12,//龙图阁
//     JBP = 13,//聚宝盆
//     CBG = 14,//藏宝阁
//     BBY = 15,//步兵营
//     QBY = 16,//骑兵营
//     GBY = 17,//弓兵营
//     WOOD = 18,//伐木场
//     IRON = 19,//炼铁厂
//     // WALL = 21,//城墙
//     GGZJ = 22,//过关斩将
// }
//建筑配置表id枚举（部分用到）
var MBuildId;
(function (MBuildId) {
    /**大殿 */
    MBuildId[MBuildId["HALL_BUILD_ID"] = 1] = "HALL_BUILD_ID";
    /**演武场 */
    // YWC = 17,
    /**行营 */
    MBuildId[MBuildId["XY"] = 18] = "XY";
    /**材料副本 */
    // CLFB = 19,
    /**军机处 */
    MBuildId[MBuildId["KJ"] = 21] = "KJ";
    /**聚宝盆 */
    MBuildId[MBuildId["JBP"] = 23] = "JBP";
    /**步兵营 */
    MBuildId[MBuildId["BBY"] = 25] = "BBY";
    /**骑兵营 */
    MBuildId[MBuildId["QBY"] = 26] = "QBY";
    /**弓兵营 */
    MBuildId[MBuildId["GBY"] = 27] = "GBY";
    /**过关斩将 */
    // GGZJ = 33,
    /**枪兵营 */
    MBuildId[MBuildId["QIBY"] = 34] = "QIBY";
})(MBuildId || (MBuildId = {}));
var MBuildTouchType;
(function (MBuildTouchType) {
    MBuildTouchType[MBuildTouchType["None"] = 0] = "None";
    MBuildTouchType[MBuildTouchType["ICON"] = 1] = "ICON";
    MBuildTouchType[MBuildTouchType["JZ"] = 2] = "JZ";
    MBuildTouchType[MBuildTouchType["BUILD"] = 3] = "BUILD";
    MBuildTouchType[MBuildTouchType["RK1"] = 4] = "RK1";
    MBuildTouchType[MBuildTouchType["RK2"] = 5] = "RK2";
    MBuildTouchType[MBuildTouchType["RK3"] = 6] = "RK3";
})(MBuildTouchType || (MBuildTouchType = {}));
var MBuildIconStatus;
(function (MBuildIconStatus) {
    MBuildIconStatus[MBuildIconStatus["None"] = 0] = "None";
    MBuildIconStatus[MBuildIconStatus["UpLevel"] = 1] = "UpLevel";
    MBuildIconStatus[MBuildIconStatus["ZS"] = 2] = "ZS";
    MBuildIconStatus[MBuildIconStatus["UpAndZS"] = 3] = "UpAndZS";
    MBuildIconStatus[MBuildIconStatus["BuildItem"] = 4] = "BuildItem";
    // XL_BB = 5,//训练步兵
    // XL_QB = 6,//训练骑兵
    // XL_GB = 7,//训练弓兵
})(MBuildIconStatus || (MBuildIconStatus = {}));
var MBuildEffType;
(function (MBuildEffType) {
    MBuildEffType[MBuildEffType["unlock"] = 0] = "unlock";
    MBuildEffType[MBuildEffType["UpLevel"] = 1] = "UpLevel";
})(MBuildEffType || (MBuildEffType = {}));
// enum MSUBBuildIcon {
//     None = 0,
//     YYSR = 157,//云游商人
//     ZBSR = 158,//珍品商人
//     LT = 159,//擂台
// }
var MainBuildStatus;
(function (MainBuildStatus) {
    // WAIT = 0,//等待激活状态
    MainBuildStatus[MainBuildStatus["NORMAL"] = 0] = "NORMAL";
    MainBuildStatus[MainBuildStatus["BUILDING"] = 1] = "BUILDING";
})(MainBuildStatus || (MainBuildStatus = {}));
/**建筑升级条件类型 */
var LevelUpConditionType;
(function (LevelUpConditionType) {
    LevelUpConditionType[LevelUpConditionType["ROLE_LEVEL"] = 1] = "ROLE_LEVEL";
    LevelUpConditionType[LevelUpConditionType["BUILDING_LEVEL"] = 2] = "BUILDING_LEVEL";
})(LevelUpConditionType || (LevelUpConditionType = {}));
var MainMapModel = /** @class */ (function () {
    function MainMapModel() {
    }
    // /**分钟计时器 */
    // private static CountTimeMin: number;
    MainMapModel.init = function (body) {
        this.clear();
        // this.m_pNowBuildIdQueue = [];
        this.m_pBuildInfos = {};
        this.m_pCallObject = {};
        var buildings = body.buildings;
        //龙图阁跟道具 后端删了 前端跟着删
        // if (body.items)
        //     this.addBuildItems(body.items);
        // this.addprops(body.props);
        this.m_pMaxQueueNum = ConstUtil.getValue(IConstEnum.BUILD_QUEUE_NUM);
        for (var key in buildings) {
            var element = buildings[key];
            var cfg = C.BuildingConfig[element.id];
            if (isNull(cfg))
                continue;
            var buildVo = MainMapBuildVo.create();
            this.m_pBuildInfos[element.id] = buildVo;
            buildVo.init(element);
        }
        this.refreshUnActivateBuildInfo();
        this.initBuildArmy(body.trainArmys);
        this.initBuildLevy(body.buildingLevy);
        this.startTimer();
        this.addEvent();
    };
    MainMapModel.clear = function () {
        this.removeEvent();
        if (this.m_pBuildInfos) {
            delete this.m_pBuildInfos;
            this.m_pBuildInfos = null;
        }
        if (this.buildViewIdStack)
            this.buildViewIdStack = null;
        this.m_pBuildingCdConfig = null;
        this.removeTimer();
    };
    /**获得大殿等级 */
    MainMapModel.getHallLevel = function () {
        return this.getLevel(MBuildId.HALL_BUILD_ID);
    };
    /**更新建筑信息 */
    MainMapModel.updateBuild = function (element) {
        if (this.m_pBuildInfos[element.id]) {
            this.m_pBuildInfos[element.id].init(element);
        }
        else {
            var buildVo = MainMapBuildVo.create();
            this.m_pBuildInfos[element.id] = buildVo;
            buildVo.init(element);
        }
    };
    /**添加初始状态为0的建筑 可开启建筑数据（农田等） */
    MainMapModel.refreshUnActivateBuildInfo = function () {
        //添加未开启 建筑数据
        var cfg = C.BuildingConfig;
        // let hallLv = this.getHallLevel();
        for (var key in cfg) {
            if (cfg.hasOwnProperty(key) && !this.m_pBuildInfos.hasOwnProperty(key)) {
                var item = cfg[key];
                var id = item.id;
                var level = item.openLevel;
                var tempName = item.name;
                // if (status == MainBuildStatus.WAIT && !this.m_pBuildInfos[id] && hallLv >= level) {
                var data = {
                    'id': id,
                    'type': item.type,
                    'level': 0,
                    'value': 0,
                    // 'status': MainBuildStatus.WAIT,
                    'status': -1,
                    'buildStartTime': 0,
                    'buildEndTime': 0,
                    'harvestTime': 0,
                    'speedTime': 0,
                };
                this.m_pBuildInfos[id] = MainMapBuildVo.create();
                this.m_pBuildInfos[id].init(data);
                // }
            }
        }
    };
    Object.defineProperty(MainMapModel, "nowQueueNum", {
        /**获取当前建造队列数量 */
        get: function () {
            return this.m_pNowQueueNum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainMapModel, "maxQueueNum", {
        /**获取最大建造队列数量 */
        get: function () {
            return this.m_pNowQueueNum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainMapModel, "isFullQueue", {
        /**建造队列是否排满 */
        get: function () {
            return this.m_pNowQueueNum >= this.m_pMaxQueueNum;
        },
        enumerable: true,
        configurable: true
    });
    /**添加倒计时回调 */
    MainMapModel.addCall = function (method, methodObj, id) {
        if (this.m_pCallObject) {
            if (!this.m_pCallObject[id])
                this.m_pCallObject[id] = {};
            this.m_pCallObject[id][methodObj.hashCode] = [method, methodObj];
        }
    };
    /**添加倒计时回调 */
    MainMapModel.removeCall = function (methodObj, id) {
        if (this.m_pCallObject) {
            var obj = this.m_pCallObject[id];
            if (obj) {
                delete obj[methodObj.hashCode];
            }
        }
    };
    MainMapModel.getBuildInfos = function () {
        return this.m_pBuildInfos;
    };
    MainMapModel.startTimer = function () {
        this.removeTimer();
        Utils.TimerManager.doTimer(1000, 0, this.call, this);
    };
    MainMapModel.removeTimer = function () {
        Utils.TimerManager.remove(this.call, this);
    };
    MainMapModel.call = function () {
        if (this.m_pBuildInfos) {
            var isUpIcon = false;
            for (var key in this.m_pBuildInfos) {
                if (this.m_pBuildInfos.hasOwnProperty(key)) {
                    var buildVo = this.m_pBuildInfos[key];
                    if (buildVo.isActivation()) {
                        //检查建造情况
                        buildVo.buildingProcess();
                        //检查通用产出
                        buildVo.outInfoProcess();
                        //检查练兵进度
                        buildVo.trainProcess();
                        /**回调 */
                        var calls = this.m_pCallObject[buildVo.id];
                        if (calls) {
                            for (var _key in calls) {
                                if (calls.hasOwnProperty(_key)) {
                                    var _element = calls[_key];
                                    _element[0].apply(_element[1]);
                                }
                            }
                        }
                    }
                }
            }
            com_main.MainMap.checkIsShowShopCloudBuild();
        }
        // /**分钟计时器 */
        // this.CountTimeMin++;
        // if (this.CountTimeMin > 60) {
        //     this.CountTimeMin = 0;
        //     /**巡查信息更新 */
        //     PatrolProxy.send_GET_PATROL();
        // }
    };
    MainMapModel.addBuildItems = function (list, isClean) {
        if (isClean === void 0) { isClean = true; }
        if (isClean)
            this.m_pBuildItemList = {};
        if (list) {
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var element = list[key];
                    var bId = element.bId;
                    var itemId = element.itemId;
                    this.m_pBuildItemList[bId] = itemId;
                }
            }
        }
    };
    MainMapModel.removeBuildItem = function (bId) {
        delete this.m_pBuildItemList[bId];
    };
    MainMapModel.getBuildItem = function (bId) {
        return this.m_pBuildItemList[bId];
    };
    /**获取已开放的入口 */
    MainMapModel.getOpenRK = function (id) {
        var rkList = [];
        var cfgData = C.BuildingConfig[id];
        if (cfgData) {
            var rkStr = cfgData.buildFunction;
            var rkArr = rkStr.split(',');
            for (var i = 0; i < rkArr.length; i++) {
                var rkType = parseInt(rkArr[i]);
                if (rkType < 0)
                    continue;
                if (FunctionModel.isFunctionOpen(rkType)) {
                    rkList.push(rkType);
                }
            }
        }
        return rkList;
    };
    /**获取建筑信息 */
    MainMapModel.getBuildInfo = function (id) {
        if (this.m_pBuildInfos && this.m_pBuildInfos[id]) {
            return this.m_pBuildInfos[id];
        }
        return null;
    };
    /**根据建筑类型获取id */
    MainMapModel.getActiveBuildIdByType = function (type, needActive) {
        if (needActive === void 0) { needActive = true; }
        var lv = 999;
        var tempId = -1;
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                var id = Number(i);
                if (!needActive || needActive && this.isActivation(id)) {
                    if (this.m_pBuildInfos[i].level < lv) {
                        tempId = id,
                            lv = this.m_pBuildInfos[i].level;
                    }
                }
            }
        }
        return tempId;
    };
    /**获取建筑信息 */
    MainMapModel.getBuildInfobyType = function (type) {
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                return Number(i);
            }
        }
        return null;
    };
    /**获取建筑信息 */
    MainMapModel.getBuildsbyType = function (type, isActived) {
        if (isActived === void 0) { isActived = true; }
        var res = [];
        for (var i in this.m_pBuildInfos) {
            var vo = this.m_pBuildInfos[i];
            if (vo.isActivation() && vo.type == type) {
                res.push(vo);
            }
        }
        return res;
    };
    //获取类型建筑中最高等级
    MainMapModel.getBuildLevelByType = function (type) {
        var lv = 0;
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                if (lv < this.m_pBuildInfos[i].level) {
                    lv = this.m_pBuildInfos[i].level;
                }
            }
        }
        return lv;
    };
    /**获取某个等级某种建筑类型数量 */
    MainMapModel.getBuildNumByLvAndType = function (type, lv) {
        var num = 0;
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                if (lv <= this.m_pBuildInfos[i].level) {
                    num++;
                }
            }
        }
        return num;
    };
    /**获取某种建筑中低于某个等级的最小等级的建筑id */
    MainMapModel.getMaxLimitLvBuildIdByType = function (type, lv) {
        if (lv === void 0) { lv = Number.MAX_VALUE; }
        var tempLv = 0;
        var id = -1;
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                if (this.m_pBuildInfos[i].level < lv
                    && tempLv < this.m_pBuildInfos[i].level
                    && MainMapModel.isActivation(this.m_pBuildInfos[i].id)) {
                    tempLv = this.m_pBuildInfos[i].level;
                    id = this.m_pBuildInfos[i].id;
                }
            }
        }
        return id;
    };
    //根据类型获取最小id未解锁的建筑
    MainMapModel.getNotActivaBuildId = function (type) {
        var id = 9999;
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                if (!MainMapModel.isActivation(this.m_pBuildInfos[i].id) && this.m_pBuildInfos[i].id < id) {
                    id = this.m_pBuildInfos[i].id;
                }
            }
        }
        return id;
    };
    /**是否激活 */
    MainMapModel.isActivation = function (id) {
        var info = this.getBuildInfo(id);
        if (info)
            return info.isActivation();
        return false;
    };
    /**获取所有可激活的建筑数据 */
    MainMapModel.canActivationBuildInfo = function () {
        var canActArr = [];
        var lastArr = []; //上一级可解锁建筑
        for (var i in this.m_pBuildInfos) {
            var info = this.m_pBuildInfos[i];
            var build = C.BuildingConfig[info.id];
            // 2019 9 9
            // if (info.status == MainBuildStatus.WAIT && MainMapModel.getHallLevel() >= build.openLevel) {
            //     canActArr.push(build);
            // }
            // if (info.status == MainBuildStatus.WAIT && MainMapModel.getHallLevel() - 1 >= build.openLevel) {
            //     lastArr.push(build);
            // }
        }
        return this.judgeAllArr(this.checkCanAtion(canActArr), this.checkCanAtion(lastArr));
    };
    /**排除相同类型可激活建筑 */
    MainMapModel.checkCanAtion = function (canActArr) {
        var tempArray = canActArr.slice(0); //复制数组到临时数组
        for (var i = 0; i < tempArray.length; i++) {
            for (var j = i + 1; j < tempArray.length;) {
                if (tempArray[j].type == tempArray[i].type) {
                    tempArray.splice(j, 1);
                }
                else {
                    j++;
                }
            }
        }
        return tempArray;
    };
    //两个数组完全相等 
    MainMapModel.judgeAllArr = function (arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (arr2[j].type == arr1[i].type) {
                    arr1.splice(i, 1);
                }
            }
        }
        return arr1;
    };
    /**拥有建筑 */
    MainMapModel.hasBuild = function (id) {
        var info = this.getBuildInfo(id);
        if (info)
            return true;
        ;
        return false;
    };
    /**获取建筑功能 */
    MainMapModel.getRK = function (id) {
        var info = this.getBuildInfo(id);
        if (info) {
            var rk = info.rk;
            if (rk) {
                var arr = rk.split(',');
                return arr;
            }
        }
        return [];
    };
    /**判断是否是普通资源类建筑
     * 四个基本资源  银 粮食 石头 木材
     */
    MainMapModel.isNormalSourceBuilding = function (id) {
        if (this.m_pBuildInfos[id]) {
            switch (this.m_pBuildInfos[id].type) {
                case BuildingType.FARMLAND:
                case BuildingType.DWELLINGS:
                case BuildingType.LOGGING_CAMP:
                case BuildingType.IRON_WORKS:
                case BuildingType.FUDING: {
                    return true;
                }
            }
        }
        return false;
    };
    /**==================================================================================================================================
   * 建筑升级面板返回 begin
   * ==================================================================================================================================
   */
    //建筑升级面板堆栈
    MainMapModel.pushViewId = function (id) {
        if (!this.buildViewIdStack)
            this.buildViewIdStack = [];
        this.buildViewIdStack.push(id);
    };
    //弹出id
    MainMapModel.popViewId = function () {
        var tempId = null;
        if (this.buildViewIdStack) {
            tempId = this.buildViewIdStack.pop();
        }
        return tempId;
    };
    MainMapModel.clearBuildViewIdStack = function () {
        if (this.buildViewIdStack)
            this.buildViewIdStack = null;
    };
    /**==================================================================================================================================
   * 建筑升级面板返回 end
   * ==================================================================================================================================
   */
    /**==================================================================================================================================
     * 建筑 begin
     * ==================================================================================================================================
     */
    /**是否建造中 */
    MainMapModel.isInBuilding = function (id) {
        var info = this.getBuildInfo(id);
        if (info)
            return info.isInBuilding();
        return false;
    };
    /**获取建筑升级加速 消耗 */
    MainMapModel.getBuildingFinishGlod = function (bId) {
        var buildVo = MainMapModel.getBuildInfo(bId);
        if (buildVo) {
            if (buildVo.isInBuilding()) {
                var curtime = TimerUtils.getServerTime();
                var time = buildVo.buildEndTime - curtime;
                return Utils.TimeGold(time);
            }
            else {
                var lvCfg = this.getBuildLevelCfg(buildVo.type, buildVo.level);
                var vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60; //vip特权减少时间
                var lostTime = Math.floor(lvCfg.upLevelTime - vipSpeedMillSecond);
                if (lvCfg) {
                    return Utils.TimeGold(lostTime);
                }
            }
        }
        return 0;
    };
    /**获取等级 */
    MainMapModel.getLevel = function (id) {
        var info = this.getBuildInfo(id);
        if (info)
            return info.level;
        return 0;
    };
    /**设置等级 */
    MainMapModel.setLevel = function (id, level) {
        var info = this.getBuildInfo(id);
        if (info)
            info.level = level;
    };
    /**根据类型 获取建筑等级
     * 获取某种类型建筑的最大级别
    */
    MainMapModel.getLevelByType = function (type) {
        var maxLevel = 0;
        for (var i in C.BuildingConfig) {
            var cfg = C.BuildingConfig[i];
            if (cfg) {
                if (cfg.type == type) {
                    var info = this.getBuildInfo(cfg.id);
                    if (info && info.level > maxLevel) {
                        maxLevel = info.level;
                    }
                }
            }
        }
        return maxLevel;
    };
    /**开始升级 */
    MainMapModel.startBuildUpLevel = function (id, buildStartTime, buildEndTime) {
        var buildVo = this.getBuildInfo(id);
        if (buildVo) {
            buildVo.startUpLevel(buildStartTime, buildEndTime);
        }
    };
    /**升级加速 */
    MainMapModel.addBuildUpLvSpeed = function (id, speedTime) {
        var buildVo = this.m_pBuildInfos[id];
        if (buildVo) {
            buildVo.updateUpLevel(speedTime);
        }
    };
    /**
     * 升级队列是否已满
     */
    MainMapModel.isMaxQueue = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.MAIN_MAP))
            return true;
        return this.m_pNowQueueNum >= this.m_pMaxQueueNum;
    };
    /**升级时间到达 清理升级时间 */
    MainMapModel.finishBuildUpLevel = function (id) {
        var buildVo = this.m_pBuildInfos[id];
        if (buildVo) {
            buildVo.finishUpLevel();
        }
    };
    /**移除建筑建造队列 */
    MainMapModel.removeQueueBuildId = function (id) {
        var index = this.m_pNowBuildIdQueue.indexOf(id);
        if (index != -1) {
            this.m_pNowBuildIdQueue[index] = -1;
            this.m_pNowQueueNum -= 1;
            com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_QUEUE_CHANGE, index);
        }
        com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);
    };
    /**添加建筑建造队列 */
    MainMapModel.addQueueBuildId = function (id) {
        var index = this.m_pNowBuildIdQueue.indexOf(id);
        if (index == -1) {
            for (var i = 0; i < this.m_pNowBuildIdQueue.length; i++) {
                if (this.m_pNowBuildIdQueue[i] == -1) {
                    this.m_pNowBuildIdQueue[i] = id;
                    this.m_pNowQueueNum += 1;
                    com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_QUEUE_CHANGE, i);
                    break;
                }
            }
        }
    };
    MainMapModel.getBuildIdQueue = function () {
        return this.m_pNowBuildIdQueue;
    };
    /**获取正在建造建筑id */
    MainMapModel.getBuildIdByIndex = function (index) {
        if (this.m_pNowBuildIdQueue[index])
            return this.m_pNowBuildIdQueue[index];
        else
            return -1;
    };
    /**获得建造倒计时数据结构 */
    MainMapModel.getCountDownValues = function (id) {
        var buildVo = this.getBuildInfo(id);
        if (buildVo) {
            var stime = buildVo.buildStartTime;
            var etime = buildVo.buildEndTime;
            var spTime = buildVo.speedTime;
            return Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000);
        }
        return null;
    };
    MainMapModel.openBuildGradeSpeed = function (id) {
        if (this.isInBuilding(id)) {
            var buildVo = this.getBuildInfo(id);
            if (buildVo) {
                // 加速大于两秒才显示界面（ps 加速在0秒左右，容易报错）
                if (buildVo.buildEndTime - (TimerUtils.getServerTime() + buildVo.speedTime) >= 2) {
                    Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, { propSpeedType: PropSpeedType.Build, targetId: id, startTime: buildVo.buildStartTime, endTime: buildVo.buildEndTime, speedUpTime: buildVo.speedTime });
                }
                return;
            }
        }
        Utils.open_view(TASK_UI.POP_BUILDING_INFO_VIEW, id);
    };
    /**检测可否升级 */
    MainMapModel.checkBuildLvUp = function (id, isConsume) {
        if (isConsume === void 0) { isConsume = true; }
        var m_data = [];
        var tempCfg = C.BuildingConfig[id];
        var info = this.getBuildInfo(id);
        if (!info || !info.hasLvUpFunction)
            return false;
        if (MainMapModel.isFullQueue) {
            return false;
        }
        if (MainMapModel.getHallLevel() < tempCfg.openLevel) {
            return false;
        }
        var lvCfg = this.getBuildLvCfg(id);
        if (lvCfg) {
            var datas = StringUtils.keyValsToNumberArray(lvCfg.conditions);
            for (var i in datas) {
                var data = datas[i];
                if (data.key == 0) {
                    if (RoleData.level < data.value)
                        return false;
                }
                else {
                    if (this.getBuildLevelByType(data.key) < data.value)
                        return false;
                }
            }
            //材料判断
            if (isConsume) {
                var items = Utils.parseCommonItemJson(lvCfg.consumes);
                if (items) {
                    if (!PropModel.isItemListEnough(items))
                        return false;
                }
            }
        }
        return true;
    };
    /**==================================================================================================================================
     * 建筑升级 end
     * ==================================================================================================================================
     */
    /**==================================================================================================================================
     * 资源产出 begin
     * ==================================================================================================================================
     */
    /**重置征收时间和资源值 */
    MainMapModel.resetHarvestTimeById = function (id, time) {
        if (time === void 0) { time = TimerUtils.getServerTime(); }
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].id == id) {
                var id_1 = Number(i);
                this.m_pBuildInfos[id_1].resetOutInfo(time);
            }
        }
    };
    /**重置征收时间和资源值 */
    MainMapModel.resetHarvestTime = function (type, time) {
        if (time === void 0) { time = TimerUtils.getServerTime(); }
        for (var i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                var id = Number(i);
                this.m_pBuildInfos[id].resetOutInfo(time);
            }
        }
    };
    /**获取产出资源对应图标 */
    MainMapModel.getValueIconType = function (id) {
        var buildVo = this.getBuildInfo(id);
        if (buildVo) {
            return buildVo.getOutId();
        }
        return PropEnum.NONE;
    };
    /**==================================================================================================================================
     * 资源产出 end
     * ==================================================================================================================================
     */
    /**==================================================================================================================================
     * 士兵训练 begin
     * ==================================================================================================================================
     */
    /**是否是练兵营 */
    MainMapModel.isSoldierBuilding = function (type) {
        if (type == BuildingType.FOOTMAN_TRAINING_CAMP || type == BuildingType.RIDER_TRAINING_CAMP || type == BuildingType.ARCHER_TRAINING_CAMP || type == BuildingType.PIKEMAN_TRAINING_CAMP)
            return true;
        return false;
    };
    /**初始化兵种队列 */
    MainMapModel.initBuildArmy = function (army) {
        if (army) {
            this.m_pArmyHash = {};
            var armys = army;
            for (var key in armys) {
                if (armys.hasOwnProperty(key)) {
                    var ar = armys[key];
                    var ArmyVo = TrainArmyVo.create(ar);
                    this.m_pArmyHash[ArmyVo.bId] = ArmyVo;
                    this.updateBuildArmysById(ArmyVo.bId);
                }
            }
        }
    };
    /**初始化征收量 */
    MainMapModel.initBuildLevy = function (levy) {
        if (levy) {
            var levys = levy;
            for (var key in levys) {
                var ar = levys[key];
                if (this.m_pBuildInfos[ar.bid]) {
                    this.m_pBuildInfos[ar.bid].harvestTime = ar.harvestTime;
                }
            }
        }
    };
    /**设置兵种练兵队列 */
    MainMapModel.updateArmyInfo = function (army) {
        if (this.m_pArmyHash[army.bId]) {
            this.m_pArmyHash[army.bId].init(army);
        }
        else {
            var ArmyVo = TrainArmyVo.create(army);
            this.m_pArmyHash[army.bId] = ArmyVo;
        }
        com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, army.armyType);
    };
    /**获取练兵信息数据队列 */
    MainMapModel.getArmys = function () {
        return this.m_pArmyHash;
    };
    /**获取兵种星星byBuidID */
    MainMapModel.getTrainArmyVoById = function (bId) {
        for (var i in this.m_pArmyHash) {
            if (this.m_pArmyHash[i].bId == bId) {
                return this.m_pArmyHash[i];
            }
        }
        return null;
    };
    /**训练加速 */
    MainMapModel.SpeedUpTrain = function (bId, speedTime) {
        for (var i in this.m_pArmyHash) {
            var tempVo = this.m_pArmyHash[i];
            if (tempVo.bId == bId) {
                tempVo.speedTime = speedTime;
                if (tempVo.speedTime + TimerUtils.getServerTime() >= tempVo.endTime) {
                    this.resetArmysByBuildid(bId);
                }
                else
                    this.updateBuildArmysById(bId);
            }
        }
    };
    /**重置训练数据 */
    MainMapModel.resetArmysByBuildid = function (bId) {
        for (var i in this.m_pArmyHash) {
            if (this.m_pArmyHash[i].bId == bId) {
                this.m_pArmyHash[i].startTime = 0;
                this.m_pArmyHash[i].endTime = 0;
                this.m_pArmyHash[i].speedTime = 0;
                this.updateBuildArmysById(bId);
            }
        }
        var armType = this.getSoliderTypeByBuildId(bId);
        com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, armType);
        return null;
    };
    /**
     * 刷新建筑 士兵训练数据
     */
    MainMapModel.updateBuildArmysById = function (id) {
        var buildVo = this.m_pBuildInfos[id];
        if (buildVo) {
            buildVo.updateArmyData();
        }
    };
    /**是否训练cd */
    MainMapModel.isInTrain = function (id) {
        var buildVo = this.getBuildInfo(id);
        if (buildVo)
            return buildVo.isInTrain;
        return false;
    };
    MainMapModel.isOutput = function (id) {
        var buildVo = MainMapModel.getBuildInfo(id);
        return buildVo.hasOutInfo();
    };
    /**根据产出兵种获得建筑结构 */
    MainMapModel.getBuildInfoBySolider = function (type) {
        var buildId = MBuildId.BBY;
        switch (type) {
            case SoldierMainType.FOOTSOLDIER: {
                buildId = MBuildId.BBY;
                break;
            }
            case SoldierMainType.RIDESOLDIER: {
                buildId = MBuildId.QBY;
                break;
            }
            case SoldierMainType.ARROWSOLDIER: {
                buildId = MBuildId.GBY;
                break;
            }
            case SoldierMainType.PIKEMAN: {
                buildId = MBuildId.QIBY;
                break;
            }
        }
        var buildVo = this.getBuildInfo(buildId);
        return buildVo;
    };
    /**根据产出兵种获得建筑结构 */
    MainMapModel.getSoliderBuildLvByType = function (type) {
        var buildVo = this.getBuildInfoBySolider(type);
        if (buildVo) {
            return buildVo.level;
        }
        return 1;
    };
    /**根据产出兵种获得建筑结构 */
    MainMapModel.getSoliderTypeByBuildId = function (id) {
        var type = SoldierMainType.FOOTSOLDIER;
        switch (id) {
            case MBuildId.QBY: {
                type = SoldierMainType.RIDESOLDIER;
                break;
            }
            case MBuildId.GBY: {
                type = SoldierMainType.ARROWSOLDIER;
                break;
            }
            case MBuildId.QIBY: {
                type = SoldierMainType.PIKEMAN;
                break;
            }
        }
        return type;
    };
    /**根据建筑id打开ui */
    MainMapModel.openSoliderTrainSpeedUpView = function (buildId) {
        var armyData = MainMapModel.getTrainArmyVoById(buildId);
        if (armyData && armyData.endTime > 0) {
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, { propSpeedType: PropSpeedType.Soldier, targetId: buildId, startTime: armyData.startTime, endTime: armyData.endTime, speedUpTime: armyData.speedTime });
        }
        else {
            Utils.open_view(TASK_UI.TRAIN_SOLDIER_PANEL, { key: buildId });
        }
    };
    /**获得训练倒计时数据结构 */
    MainMapModel.getCountDownTrainValues = function (id) {
        var armyData = MainMapModel.getTrainArmyVoById(id);
        if (armyData) {
            var stime = armyData.startTime;
            var etime = armyData.endTime;
            var spTime = armyData.speedTime;
            return Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000);
        }
        return null;
    };
    /**==================================================================================================================================
     * 士兵训练 end
     * ==================================================================================================================================
     */
    /**==================================================================================================================================
    * 道具生产 begin
    * ==================================================================================================================================
    */
    /**获取龙图阁道具队列 */
    MainMapModel.getPropQueue = function () {
        return this.m_pPropQueue;
    };
    /**设置龙图阁道具队列 */
    MainMapModel.setPropQueue = function (v) {
        this.m_pPropQueue = v;
    };
    /**获取龙图阁在建或者没有收取的道具列表 */
    MainMapModel.getProps = function () {
        return this.m_pPropHash;
    };
    /**设置龙图阁在建或者没有收取的道具列表 */
    MainMapModel.setProps = function (v) {
        this.m_pPropHash = v;
    };
    /**改变建造列表数据 */
    MainMapModel.changeProps = function (index, v) {
        this.m_pPropHash[index] = v;
    };
    /**添加制作队列 */
    MainMapModel.addprops = function (prop) {
        if (prop) {
            this.m_pPropHash = [];
            var props = prop;
            for (var key in props) {
                if (props.hasOwnProperty(key)) {
                    var prop_1 = props[key];
                    var propvo = StrategyPropVo.create(prop_1);
                    this.m_pPropHash[propvo.index] = propvo;
                }
            }
        }
    };
    MainMapModel.deleteprops = function (id) {
        var props = this.m_pPropHash;
        for (var key in props) {
            if (props.hasOwnProperty(key)) {
                var prop = props[key];
                if (prop.id == id) {
                    props[key].reset();
                    delete props[key];
                    return;
                }
            }
        }
        error("delete失败");
    };
    /**==================================================================================================================================
     * 道具生产 end
     * ==================================================================================================================================
     */
    /**打开建筑功能 */
    MainMapModel.openBuildFunc = function (buildId) {
        var vo = this.getBuildInfo(buildId);
        //指定id建筑 才做出判断 并且未激活弹出提示 在case指定id下判断
        var isOpen = this.isActivation(buildId);
        var isFuncBuild = false;
        switch (buildId) {
            case MBuildId.XY: { //行营副本关卡
                isFuncBuild = true;
                isOpen = this.isActivation(buildId);
                if (isOpen)
                    Utils.open_view(TASK_UI.HEADQUARTER_MAIN_PANEL);
                break;
            }
            // case MBuildId.HW: {  //历史战役
            //     isFuncBuild = true;
            //     // isOpen = this.isActivation(buildId);
            //     isOpen = FunctionModel.isFunctionOpenWithWarn(FunctionType.HISTORY_WAR);
            //     // if (isOpen) Utils.open_view(TASK_UI.HISTORYWAR_MAIN_PANEL);
            //     isOpen = false;
            //     break;
            // }
        }
        if (!isOpen) {
            EffectUtils.showTips(GCode(CLEnum.CITY_BD_LOCK1), 1, true);
            return isFuncBuild;
        }
        return isFuncBuild;
    };
    /**==================================================================================================================================
    * 事件监听 start
    * ==================================================================================================================================
    */
    MainMapModel.addEvent = function () {
        com_main.EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.setBuildLvUpState, this);
        com_main.EventMgr.addEvent(BuildEvent.CHECK_BUILD_LV_STATE, this.setBuildLvUpState, this);
        com_main.EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.onTechnoInfoUpdate, this);
    };
    MainMapModel.removeEvent = function () {
        com_main.EventMgr.removeStaticEvent(BuildEvent.BUILD_UP_LEVEL, this.setBuildLvUpState);
        com_main.EventMgr.removeStaticEvent(BuildEvent.CHECK_BUILD_LV_STATE, this.setBuildLvUpState);
        com_main.EventMgr.removeStaticEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.onTechnoInfoUpdate);
    };
    /**设置是否升级状态 */
    MainMapModel.setBuildLvUpState = function () {
        for (var i in this.m_pBuildInfos) {
            var buildVo = this.m_pBuildInfos[i];
            var mBuild = com_main.MainMap.getMBuildById(buildVo.id);
            if (mBuild) {
                var NextLvCfg = this.getBuildingCfg(buildVo.type, MainMapModel.getLevel(buildVo.id) + 1);
                var boo = NextLvCfg ? true : false;
                var state = buildVo && !buildVo.isInBuilding() && this.checkBuildLvUp(buildVo.id) && boo;
                mBuild.setLvTipsState(state);
            }
        }
    };
    /**科技效果更新 */
    MainMapModel.onTechnoInfoUpdate = function (id) {
        var vo = TechnoModel.getTechVoById(id);
        if (vo.level == 0)
            return;
        if (vo.addMainType == NorEffType.FOOT) {
            var builds = this.getBuildsbyType(BuildingType.FARMLAND);
            for (var i = 0; i < builds.length; i++) {
                builds[i].refreshOutInfo();
            }
        }
    };
    /**==================================================================================================================================
    * 事件监听 end
    * ==================================================================================================================================
    */
    /**==================================================================================================================================
    * 配置读取 begin
    * ==================================================================================================================================
    */
    /**等级配置表 */
    MainMapModel.getBuildingCfg = function (bType, level) {
        for (var key in C.BuildingLevelConfig) {
            var cfg = C.BuildingLevelConfig[key];
            if (cfg.buildingType == bType && cfg.level == level) {
                return cfg;
            }
        }
        return null;
    };
    /**等级配置表 */
    MainMapModel.getBuildLvCfg = function (id) {
        var bCfg = C.BuildingConfig[id];
        if (bCfg) {
            var lv = this.getLevel(id);
            if (C.BuildingLevelConfigDic[bCfg.type]) {
                return C.BuildingLevelConfigDic[bCfg.type][lv];
            }
        }
        else
            return null;
    };
    //获取建筑配置表
    MainMapModel.getBunildCfgByType = function (type) {
        for (var key in C.BuildingConfig) {
            var cfg = C.BuildingConfig[key];
            if (cfg.type == type) {
                return cfg;
            }
        }
    };
    /**获取建筑类型表配置 */
    MainMapModel.getBuildingTypeCfg = function (type) {
        return C.BuildingTypeConfig[type];
    };
    /**获取资源产出配置表 类型 +等级*/
    MainMapModel.getBuildOutCfg = function (type, level) {
        if (C.BuildingResourcesLvConfigDic[type])
            return C.BuildingResourcesLvConfigDic[type][level];
        return null;
    };
    /**获取建筑等级配置表 类型 +等级*/
    MainMapModel.getBuildLevelCfg = function (type, level) {
        if (C.BuildingLevelConfigDic[type])
            return C.BuildingLevelConfigDic[type][level];
        return null;
    };
    /** 获取清除建筑CD消耗配置 */
    MainMapModel.getBuildingCdConfig = function () {
        if (this.m_pBuildingCdConfig == null) {
            var cfgs = C.CoolDownConfig;
            this.m_pBuildingCdConfig = [];
            for (var key in cfgs) {
                if (cfgs.hasOwnProperty(key)) {
                    var cfg = cfgs[key];
                    if (cfg.type == CoolDownType.BuildingSpeed) {
                        var config = { min: cfg.min, max: cfg.max, gold: cfg.gold };
                        this.m_pBuildingCdConfig.push(config);
                    }
                }
            }
            // 对配置排序
            this.m_pBuildingCdConfig = this.m_pBuildingCdConfig.sort(function (a, b) {
                if (a.max > b.max) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
        }
        return this.m_pBuildingCdConfig;
    };
    //获得连兵营等级 对应的练兵配置
    MainMapModel.getBuildingTrainCfgbyBuildId = function (bId) {
        var cfg = C.BuildingTrainConfig;
        var buildVo = MainMapModel.getBuildInfo(bId);
        if (buildVo) {
            for (var key in cfg) {
                if (cfg[key]) {
                    var it = cfg[key];
                    if (buildVo.type == it.buildingType && it.level == buildVo.level) {
                        return it;
                    }
                }
            }
        }
        return null;
    };
    //获得单个的练兵配置
    MainMapModel.getBuildingTrainCfg = function (type, level) {
        var cfg = C.BuildingTrainConfig;
        for (var key in cfg) {
            if (cfg[key]) {
                var it = cfg[key];
                if (it.buildingType == type && it.level == level) {
                    return it;
                }
            }
        }
        return null;
    };
    //根据兵种 获得兵种等级表
    MainMapModel.getSoldierLvCfg = function (armyType, level) {
        level = level || MainMapModel.getSoliderBuildLvByType(armyType);
        return C.GeneralSoldierLvConfigDic[armyType][level];
    };
    /**==================================================================================================================================
   * 配置读取 end
   * ==================================================================================================================================
   */
    /**==================================================================================================================================
     * 新手引导 begin
     * ==================================================================================================================================
     */
    /**移动到正在升级建筑 */
    MainMapModel.MoveToCanGradeUpBuild = function () {
        var id = this.getRecommedBuildId();
        if (id == -1)
            return;
        com_main.MainMap.moveToBuild(id, true);
        com_main.MainMap.showMoveSelectEffect(id);
    };
    /**
     * 获取推荐建筑升级id
     */
    MainMapModel.getRecommedBuildId = function () {
        var id = -1;
        var buildings = [];
        for (var key in this.m_pBuildInfos) {
            buildings.push(this.m_pBuildInfos[key]);
        }
        buildings.sort(function (a, b) {
            if (a.level != b.level)
                return a.level - b.level;
            return a.id - b.id;
        });
        for (var i = 0; i < buildings.length; i++) {
            var info = buildings[i];
            if (!info.getIsCanLvUp()) { //不用升级的跳过
                continue;
            }
            if (this.isInBuilding(info.id) || !this.isActivation(info.id)) {
                continue;
            }
            if (this.checkBuildLvUp(info.id)) {
                id = info.id;
                break;
            }
        }
        return id;
    };
    /**
     * 获取推荐建筑升级id
     * 不判断材料条件限制
     */
    MainMapModel.getBuildIdByCondition = function () {
        var id = MBuildId.HALL_BUILD_ID;
        var buildings = [];
        for (var key in this.m_pBuildInfos) {
            buildings.push(this.m_pBuildInfos[key]);
        }
        buildings.sort(function (a, b) {
            if (a.level != b.level)
                return a.level - b.level;
            return a.id - b.id;
        });
        for (var i = 0; i < buildings.length; i++) {
            var info = buildings[i];
            if (!info.getIsCanLvUp()) { //不用升级的跳过
                continue;
            }
            if (this.isInBuilding(info.id) || !this.isActivation(info.id)) {
                continue;
            }
            if (this.checkBuildLvUp(info.id, false)) {
                id = info.id;
                break;
            }
        }
        if (id == MBuildId.HALL_BUILD_ID) {
            var lvCfg = this.getBuildLvCfg(id);
            if (lvCfg) {
                var datas = StringUtils.keyValsToNumberArray(lvCfg.conditions);
                for (var i in datas) {
                    var data = datas[i];
                    if (data.key != 0) {
                        if (this.getBuildLevelByType(data.key) < data.value) {
                            id = this.getMaxLimitLvBuildIdByType(data.key);
                            break;
                        }
                    }
                }
            }
        }
        return id;
    };
    /**获取建筑状态 */ //暂时检测是否升级状态，后续拓展
    MainMapModel.checkBuildState = function (id, type) {
        switch (type) {
            case 1: { //升级状态
                return this.isInBuilding(id);
            }
            case 2: {
            }
            default: {
            }
        }
        return false;
    };
    MainMapModel.m_pBuildInfos = null;
    MainMapModel.m_pCallObject = null;
    MainMapModel.m_pPropQueue = null; //龙图阁道具队列
    MainMapModel.m_pPropHash = null;
    MainMapModel.m_pArmyHash = null; //添加兵种队列
    // private static m_pbuildLevyHash: any = {};   //征收量
    MainMapModel.m_pNowQueueNum = 0; //当前建造队列数量
    MainMapModel.m_pNowBuildIdQueue = [-1, -1];
    MainMapModel.m_pMaxQueueNum = 0; //建造队列上限值
    MainMapModel.m_pBuildItemList = {};
    MainMapModel.m_pBuildingCdConfig = null;
    return MainMapModel;
}());
