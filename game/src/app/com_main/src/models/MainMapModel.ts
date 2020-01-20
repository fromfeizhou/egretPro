/** 建筑效果类型表 */
enum MainBuildEffectType {
    /** 粮食产量 */
    FOOD_YIELD = 1,
    /** 粮食上限 */
    FOOD_MAX = 2,
    /** 银币产量 */
    SILVER_YIELD = 4,
    /** 银币上限 */
    SILVER_MAX = 5,
    /** 庆典分数增加 */
    QD_BUILD_FS = 7,
    /** 庆典暴击率 */
    QD_BUILD_BJ = 8,
    /** 庆典后必定暴击所需次数 */
    QD_BUILD_BJ_N = 10,
    /** 木材产量 */
    WOOD_YIELD = 19,
    /** 木材上限 */
    WOOD_MAX = 20,
    /** 铁矿产量 */
    IRON_YIELD = 21,
    /** 铁矿上限 */
    IRON_MAX = 22,
    /** 元宝产量 */
    GOLD_YIELD = 23,
    /**元宝上限 */
    GOLD_MAX = 24,
    /** 招募令 */
    RECRUITMENT_YIELD = 25,
    /**招募令上限 */
    RECRUITMENT_MAX = 26,
}

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
enum MBuildId {
    /**大殿 */
    HALL_BUILD_ID = 1,
    /**演武场 */
    // YWC = 17,
    /**行营 */
    XY = 18,
    /**材料副本 */
    // CLFB = 19,
    /**军机处 */
    KJ = 21,
    /**聚宝盆 */
    JBP = 23,
    /**步兵营 */
    BBY = 25,
    /**骑兵营 */
    QBY = 26,
    /**弓兵营 */
    GBY = 27,
    /**过关斩将 */
    // GGZJ = 33,
    /**枪兵营 */
    QIBY = 34,
}

enum MBuildTouchType {
    None = 0,
    ICON = 1,//浮动图标
    JZ = 2,//建造图标
    BUILD = 3,//建筑
    RK1 = 4,//入口
    RK2 = 5,//入口
    RK3 = 6,//入口
}

enum MBuildIconStatus {
    None = 0,
    UpLevel = 1,//升级图标
    ZS = 2,//征收图标
    UpAndZS = 3,//升级和征收
    BuildItem = 4,//建筑道具
    // XL_BB = 5,//训练步兵
    // XL_QB = 6,//训练骑兵
    // XL_GB = 7,//训练弓兵
}
enum MBuildEffType {
    unlock = 0,//建筑解锁特效
    UpLevel = 1,//建筑升级特效

}
// enum MSUBBuildIcon {
//     None = 0,
//     YYSR = 157,//云游商人
//     ZBSR = 158,//珍品商人
//     LT = 159,//擂台
// }

enum MainBuildStatus {
    // WAIT = 0,//等待激活状态
    NORMAL = 0,//正常状态状态
    BUILDING = 1, //建造
}

/**建筑升级条件类型 */
enum LevelUpConditionType {
    ROLE_LEVEL = 1, // 君主等级
    BUILDING_LEVEL = 2, // 指定建筑等级
}

class MainMapModel {
    private static m_pBuildInfos: { [key: number]: MainMapBuildVo } = null;
    private static m_pCallObject: any = null;


    private static m_pPropQueue: any = null;  //龙图阁道具队列

    private static m_pPropHash: any = null;
    private static m_pArmyHash: { [k: number]: TrainArmyVo } = null;   //添加兵种队列
    // private static m_pbuildLevyHash: any = {};   //征收量

    private static m_pNowQueueNum: number = 0;//当前建造队列数量
    private static m_pNowBuildIdQueue: number[] = [-1, -1]

    private static m_pMaxQueueNum: number = 0;//建造队列上限值

    private static m_pBuildItemList: any = {};

    private static buildViewIdStack: number[];

    private static m_pBuildingCdConfig: any[] = null;
    // /**分钟计时器 */
    // private static CountTimeMin: number;

    public static init(body: gameProto.IS2C_BUILDING_INFO) {
        this.clear();
        // this.m_pNowBuildIdQueue = [];
        this.m_pBuildInfos = {};
        this.m_pCallObject = {};

        let buildings = body.buildings;

        //龙图阁跟道具 后端删了 前端跟着删
        // if (body.items)
        //     this.addBuildItems(body.items);

        // this.addprops(body.props);



        this.m_pMaxQueueNum = ConstUtil.getValue(IConstEnum.BUILD_QUEUE_NUM);

        for (var key in buildings) {
            var element = buildings[key];
            let cfg = C.BuildingConfig[element.id];
            if(isNull(cfg)) continue;
            let buildVo = MainMapBuildVo.create();
            this.m_pBuildInfos[element.id] = buildVo;
            buildVo.init(element);
        }
        this.refreshUnActivateBuildInfo();

        this.initBuildArmy(body.trainArmys);
        this.initBuildLevy(body.buildingLevy);

        this.startTimer();
        this.addEvent();

    }

    public static clear() {
        this.removeEvent();

        if (this.m_pBuildInfos) {
            delete this.m_pBuildInfos;
            this.m_pBuildInfos = null;
        }
        if (this.buildViewIdStack)
            this.buildViewIdStack = null;
        this.m_pBuildingCdConfig = null;
        this.removeTimer();
    }


    /**获得大殿等级 */
    public static getHallLevel() {
        return this.getLevel(MBuildId.HALL_BUILD_ID)
    }

    /**更新建筑信息 */
    public static updateBuild(element: any) {
        if (this.m_pBuildInfos[element.id]) {
            this.m_pBuildInfos[element.id].init(element);
        } else {
            let buildVo = MainMapBuildVo.create();
            this.m_pBuildInfos[element.id] = buildVo;
            buildVo.init(element);
        }
    }
    /**添加初始状态为0的建筑 可开启建筑数据（农田等） */
    private static refreshUnActivateBuildInfo() {
        //添加未开启 建筑数据
        let cfg = C.BuildingConfig;
        // let hallLv = this.getHallLevel();
        for (var key in cfg) {
            if (cfg.hasOwnProperty(key) && !this.m_pBuildInfos.hasOwnProperty(key)) {
                var item = cfg[key];
                let id = item.id;
                let level = item.openLevel;
                let tempName = item.name;
                // if (status == MainBuildStatus.WAIT && !this.m_pBuildInfos[id] && hallLv >= level) {
                let data = {
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
                }

                this.m_pBuildInfos[id] = MainMapBuildVo.create();
                this.m_pBuildInfos[id].init(data);
                // }
            }
        }
    }

    /**获取当前建造队列数量 */
    public static get nowQueueNum(): number {
        return this.m_pNowQueueNum;
    }

    /**获取最大建造队列数量 */
    public static get maxQueueNum(): number {
        return this.m_pNowQueueNum;
    }

    /**建造队列是否排满 */
    public static get isFullQueue(): boolean {
        return this.m_pNowQueueNum >= this.m_pMaxQueueNum;
    }


    /**添加倒计时回调 */
    public static addCall(method: Function, methodObj: any, id: number) {
        if (this.m_pCallObject) {
            if (!this.m_pCallObject[id])
                this.m_pCallObject[id] = {};

            this.m_pCallObject[id][methodObj.hashCode] = [method, methodObj];
        }
    }

    /**添加倒计时回调 */
    public static removeCall(methodObj: any, id: number) {
        if (this.m_pCallObject) {
            let obj = this.m_pCallObject[id];
            if (obj) {
                delete obj[methodObj.hashCode];
            }
        }
    }

    public static getBuildInfos(): any {
        return this.m_pBuildInfos;
    }

    public static startTimer() {
        this.removeTimer();
        Utils.TimerManager.doTimer(1000, 0, this.call, this);
    }

    public static removeTimer() {
        Utils.TimerManager.remove(this.call, this);
    }

    public static call() {
        if (this.m_pBuildInfos) {
            let isUpIcon = false;
            for (var key in this.m_pBuildInfos) {
                if (this.m_pBuildInfos.hasOwnProperty(key)) {
                    var buildVo: MainMapBuildVo = this.m_pBuildInfos[key];
                    if (buildVo.isActivation()) {
                        //检查建造情况
                        buildVo.buildingProcess();
                        //检查通用产出
                        buildVo.outInfoProcess();
                        //检查练兵进度
                        buildVo.trainProcess();
                        /**回调 */
                        let calls = this.m_pCallObject[buildVo.id];

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
    }

    public static addBuildItems(list: any, isClean: boolean = true) {
        if (isClean)
            this.m_pBuildItemList = {};

        if (list) {
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var element = list[key];
                    let bId = element.bId;
                    let itemId = element.itemId;
                    this.m_pBuildItemList[bId] = itemId;
                }
            }
        }
    }

    public static removeBuildItem(bId: number) {
        delete this.m_pBuildItemList[bId];
    }

    public static getBuildItem(bId: number) {
        return this.m_pBuildItemList[bId];
    }


    /**获取已开放的入口 */
    public static getOpenRK(id: number): any {
        let rkList = [];
        let cfgData = C.BuildingConfig[id];
        if (cfgData) {
            let rkStr: string = cfgData.buildFunction;
            let rkArr = rkStr.split(',');
            for (let i = 0; i < rkArr.length; i++) {
                let rkType = parseInt(rkArr[i]);
                if (rkType < 0)
                    continue;
                if (FunctionModel.isFunctionOpen(rkType)) {
                    rkList.push(rkType);
                }
            }
        }
        return rkList;
    }

    /**获取建筑信息 */
    public static getBuildInfo(id: number): MainMapBuildVo {
        if (this.m_pBuildInfos && this.m_pBuildInfos[id]) {
            return this.m_pBuildInfos[id];
        }
        return null;
    }


    /**根据建筑类型获取id */
    public static getActiveBuildIdByType(type: number, needActive: boolean = true) {
        let lv = 999;
        let tempId = -1;
        for (let i in this.m_pBuildInfos) {

            if (this.m_pBuildInfos[i].type == type) {
                let id = Number(i);
                if (!needActive || needActive && this.isActivation(id)) {
                    if (this.m_pBuildInfos[i].level < lv) {
                        tempId = id,
                            lv = this.m_pBuildInfos[i].level;
                    }
                }
            }
        }
        return tempId;
    }



    /**获取建筑信息 */
    public static getBuildInfobyType(type: number): any {

        for (let i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                return Number(i);
            }
        }
        return null;
    }

    /**获取建筑信息 */
    public static getBuildsbyType(type: number, isActived: boolean = true) {
        let res: MainMapBuildVo[] = [];
        for (let i in this.m_pBuildInfos) {
            let vo = this.m_pBuildInfos[i];
            if (vo.isActivation() && vo.type == type) {
                res.push(vo);
            }
        }
        return res;
    }

    //获取类型建筑中最高等级
    public static getBuildLevelByType(type: number): number {
        let lv = 0;
        for (let i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                if (lv < this.m_pBuildInfos[i].level) {
                    lv = this.m_pBuildInfos[i].level;
                }
            }
        }
        return lv;
    }

    /**获取某个等级某种建筑类型数量 */
    public static getBuildNumByLvAndType(type: number, lv: number): number {
        let num = 0;
        for (let i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                if (lv <= this.m_pBuildInfos[i].level) {
                    num++;
                }
            }
        }
        return num;
    }
    /**获取某种建筑中低于某个等级的最小等级的建筑id */
    public static getMaxLimitLvBuildIdByType(type: number, lv: number = Number.MAX_VALUE) {
        let tempLv = 0;
        let id = -1;
        for (let i in this.m_pBuildInfos) {
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
    }
    //根据类型获取最小id未解锁的建筑
    public static getNotActivaBuildId(type: number) {
        let id = 9999;
        for (let i in this.m_pBuildInfos) {
            if (this.m_pBuildInfos[i].type == type) {
                if (!MainMapModel.isActivation(this.m_pBuildInfos[i].id) && this.m_pBuildInfos[i].id < id) {
                    id = this.m_pBuildInfos[i].id;
                }
            }
        }
        return id;
    }


    /**是否激活 */
    public static isActivation(id: number): boolean {
        let info = this.getBuildInfo(id);
        if (info)
            return info.isActivation();

        return false;
    }
    /**获取所有可激活的建筑数据 */
    public static canActivationBuildInfo() {
        let canActArr = [];
        let lastArr = [];//上一级可解锁建筑
        for (let i in this.m_pBuildInfos) {
            let info = this.m_pBuildInfos[i];
            let build = C.BuildingConfig[info.id];
            // 2019 9 9
            // if (info.status == MainBuildStatus.WAIT && MainMapModel.getHallLevel() >= build.openLevel) {
            //     canActArr.push(build);
            // }
            // if (info.status == MainBuildStatus.WAIT && MainMapModel.getHallLevel() - 1 >= build.openLevel) {
            //     lastArr.push(build);
            // }
        }


        return this.judgeAllArr(this.checkCanAtion(canActArr), this.checkCanAtion(lastArr));
    }
    /**排除相同类型可激活建筑 */
    public static checkCanAtion(canActArr: any[]) {
        let tempArray = canActArr.slice(0);//复制数组到临时数组
        for (let i = 0; i < tempArray.length; i++) {
            for (let j = i + 1; j < tempArray.length;) {
                if (tempArray[j].type == tempArray[i].type) {
                    tempArray.splice(j, 1);
                } else {
                    j++;
                }
            }
        }
        return tempArray;
    }

    //两个数组完全相等 
    public static judgeAllArr(arr1: any[], arr2: any[]) {
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr2[j].type == arr1[i].type) {
                    arr1.splice(i, 1);
                }
            }
        }
        return arr1;
    }

    /**拥有建筑 */
    public static hasBuild(id: number): boolean {
        let info = this.getBuildInfo(id);
        if (info)
            return true;;
        return false;
    }


    /**获取建筑功能 */
    public static getRK(id: number): any {
        let info = this.getBuildInfo(id);
        if (info) {
            let rk: string = info.rk;

            if (rk) {
                let arr = rk.split(',');

                return arr;
            }
        }

        return [];
    }

    /**判断是否是普通资源类建筑
     * 四个基本资源  银 粮食 石头 木材
     */
    public static isNormalSourceBuilding(id: number) {
        if(this.m_pBuildInfos[id]){
            switch(this.m_pBuildInfos[id].type){
                case BuildingType.FARMLAND:
                case BuildingType.DWELLINGS:
                case BuildingType.LOGGING_CAMP:
                case BuildingType.IRON_WORKS:
                case BuildingType.FUDING:{
                    return true;
                }
            }
        }
        return false;
    }

    /**==================================================================================================================================
   * 建筑升级面板返回 begin
   * ==================================================================================================================================
   */

    //建筑升级面板堆栈
    public static pushViewId(id: number) {
        if (!this.buildViewIdStack)
            this.buildViewIdStack = [];
        this.buildViewIdStack.push(id);
    }
    //弹出id
    public static popViewId(): number {
        let tempId = null;
        if (this.buildViewIdStack) {
            tempId = this.buildViewIdStack.pop();
        }
        return tempId;
    }

    public static clearBuildViewIdStack() {
        if (this.buildViewIdStack)
            this.buildViewIdStack = null;
    }

    /**==================================================================================================================================
   * 建筑升级面板返回 end
   * ==================================================================================================================================
   */

    /**==================================================================================================================================
     * 建筑 begin
     * ==================================================================================================================================
     */

    /**是否建造中 */
    public static isInBuilding(id: number): boolean {
        let info: MainMapBuildVo = this.getBuildInfo(id);
        if (info)
            return info.isInBuilding();

        return false;
    }
    /**获取建筑升级加速 消耗 */
    public static getBuildingFinishGlod(bId: number): number {
        let buildVo = MainMapModel.getBuildInfo(bId);
        if (buildVo) {
            if (buildVo.isInBuilding()) {
                let curtime = TimerUtils.getServerTime();
                let time = buildVo.buildEndTime - curtime;
                return Utils.TimeGold(time);
            } else {
                let lvCfg = this.getBuildLevelCfg(buildVo.type, buildVo.level);
                let vipSpeedMillSecond = VipModel.getPlayerPrivillByType(VipPrivillType.BUILDING_TIME_REDUCTION) * 60;  //vip特权减少时间
                let lostTime = Math.floor(lvCfg.upLevelTime - vipSpeedMillSecond);
                if (lvCfg) {
                    return Utils.TimeGold(lostTime);
                }
            }
        }
        return 0;
    }

    /**获取等级 */
    public static getLevel(id: number) {
        let info = this.getBuildInfo(id);
        if (info)
            return info.level;

        return 0;
    }

    /**设置等级 */
    public static setLevel(id: number, level: number) {
        let info = this.getBuildInfo(id);
        if (info)
            info.level = level;
    }


    /**根据类型 获取建筑等级 
     * 获取某种类型建筑的最大级别
    */
    public static getLevelByType(type: number) {
        let maxLevel = 0;
        for (let i in C.BuildingConfig) {
            let cfg = C.BuildingConfig[i];
            if (cfg) {
                if (cfg.type == type) {
                    let info = this.getBuildInfo(cfg.id);
                    if (info && info.level > maxLevel) {
                        maxLevel = info.level;
                    }
                }
            }
        }
        return maxLevel;
    }


    /**开始升级 */
    public static startBuildUpLevel(id: number, buildStartTime: number, buildEndTime: number) {
        let buildVo: MainMapBuildVo = this.getBuildInfo(id);

        if (buildVo) {
            buildVo.startUpLevel(buildStartTime, buildEndTime);
        }
    }



    /**升级加速 */
    public static addBuildUpLvSpeed(id: number, speedTime: number) {
        let buildVo: MainMapBuildVo = this.m_pBuildInfos[id];
        if (buildVo) {
            buildVo.updateUpLevel(speedTime);
        }
    }

    /**
     * 升级队列是否已满
     */
    public static isMaxQueue(): boolean {
        if (!FunctionModel.isFunctionOpen(FunctionType.MAIN_MAP)) return true;

        return this.m_pNowQueueNum >= this.m_pMaxQueueNum;
    }

    /**升级时间到达 清理升级时间 */
    public static finishBuildUpLevel(id: number) {
        let buildVo: MainMapBuildVo = this.m_pBuildInfos[id];
        if (buildVo) {
            buildVo.finishUpLevel();
        }
    }


    /**移除建筑建造队列 */
    public static removeQueueBuildId(id) {
        var index = this.m_pNowBuildIdQueue.indexOf(id)
        if (index != -1) {
            this.m_pNowBuildIdQueue[index] = -1;
            this.m_pNowQueueNum -= 1;
            com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_QUEUE_CHANGE, index);
        }
        com_main.EventMgr.dispatchEvent(BuildEvent.CHECK_BUILD_LV_STATE, null);

    }
    /**添加建筑建造队列 */
    public static addQueueBuildId(id) {
        var index = this.m_pNowBuildIdQueue.indexOf(id)
        if (index == -1) {
            for (let i = 0; i < this.m_pNowBuildIdQueue.length; i++) {
                if (this.m_pNowBuildIdQueue[i] == -1) {
                    this.m_pNowBuildIdQueue[i] = id;
                    this.m_pNowQueueNum += 1;
                    com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_QUEUE_CHANGE, i);
                    break;
                }
            }
        }
    }
    public static getBuildIdQueue(): number[] {
        return this.m_pNowBuildIdQueue;
    }

    /**获取正在建造建筑id */
    public static getBuildIdByIndex(index: number) {
        if (this.m_pNowBuildIdQueue[index])
            return this.m_pNowBuildIdQueue[index];
        else
            return -1;
    }
    /**获得建造倒计时数据结构 */
    public static getCountDownValues(id: number): any[] {

        let buildVo: MainMapBuildVo = this.getBuildInfo(id);
        if (buildVo) {
            let stime = buildVo.buildStartTime;
            let etime = buildVo.buildEndTime;
            let spTime = buildVo.speedTime;
            return Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000);
        }

        return null;
    }

    public static openBuildGradeSpeed(id: number) {
        if (this.isInBuilding(id)) {
            let buildVo: MainMapBuildVo = this.getBuildInfo(id);
            if (buildVo) {
                // 加速大于两秒才显示界面（ps 加速在0秒左右，容易报错）
                if (buildVo.buildEndTime - (TimerUtils.getServerTime() + buildVo.speedTime) >= 2) {
                    Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, { propSpeedType: PropSpeedType.Build, targetId: id, startTime: buildVo.buildStartTime, endTime: buildVo.buildEndTime, speedUpTime: buildVo.speedTime });
                }
                return;
            }
        }
        Utils.open_view(TASK_UI.POP_BUILDING_INFO_VIEW, id);

    }




    /**检测可否升级 */
    public static checkBuildLvUp(id: number, isConsume: boolean = true): boolean {
        let m_data = [];
        let tempCfg = C.BuildingConfig[id];
        let info = this.getBuildInfo(id);
        if (!info || !info.hasLvUpFunction)
            return false;

        if (MainMapModel.isFullQueue) {
            return false;
        }

        if (MainMapModel.getHallLevel() < tempCfg.openLevel) {
            return false;
        }

        let lvCfg = this.getBuildLvCfg(id);
        if (lvCfg) {
            let datas = StringUtils.keyValsToNumberArray(lvCfg.conditions);
            for (let i in datas) {
                let data = datas[i];
                if (data.key == 0) {
                    if (RoleData.level < data.value) return false;
                } else {
                    if (this.getBuildLevelByType(data.key) < data.value) return false
                }
            }
            //材料判断
            if (isConsume) {
                let items = Utils.parseCommonItemJson(lvCfg.consumes);
                if (items) {
                    if (!PropModel.isItemListEnough(items)) return false;
                }
            }
        }
        return true;
    }



    /**==================================================================================================================================
     * 建筑升级 end
     * ==================================================================================================================================
     */

    /**==================================================================================================================================
     * 资源产出 begin
     * ==================================================================================================================================
     */

    /**重置征收时间和资源值 */
    public static resetHarvestTimeById(id: number, time: number = TimerUtils.getServerTime()) {
        for (let i in this.m_pBuildInfos) {

            if (this.m_pBuildInfos[i].id == id) {
                let id = Number(i);
                this.m_pBuildInfos[id].resetOutInfo(time);
            }
        }
    }

    /**重置征收时间和资源值 */
    public static resetHarvestTime(type: number, time: number = TimerUtils.getServerTime()) {
        for (let i in this.m_pBuildInfos) {

            if (this.m_pBuildInfos[i].type == type) {
                let id = Number(i);
                this.m_pBuildInfos[id].resetOutInfo(time);
            }
        }
    }

    /**获取产出资源对应图标 */
    public static getValueIconType(id: number): PropEnum {
        let buildVo: MainMapBuildVo = this.getBuildInfo(id);
        if (buildVo) {
            return buildVo.getOutId();
        }
        return PropEnum.NONE;
    }

    /**==================================================================================================================================
     * 资源产出 end
     * ==================================================================================================================================
     */

    /**==================================================================================================================================
     * 士兵训练 begin
     * ==================================================================================================================================
     */

    /**是否是练兵营 */
    public static isSoldierBuilding(type: BuildingType): boolean {
        if (type == BuildingType.FOOTMAN_TRAINING_CAMP || type == BuildingType.RIDER_TRAINING_CAMP || type == BuildingType.ARCHER_TRAINING_CAMP || type == BuildingType.PIKEMAN_TRAINING_CAMP) return true;
        return false;
    }

    /**初始化兵种队列 */
    public static initBuildArmy(army: gameProto.ITrainArmy[]) {
        if (army) {
            this.m_pArmyHash = {};
            let armys = army;
            for (let key in armys) {
                if (armys.hasOwnProperty(key)) {
                    let ar = armys[key];
                    let ArmyVo = TrainArmyVo.create(ar);
                    this.m_pArmyHash[ArmyVo.bId] = ArmyVo;
                    this.updateBuildArmysById(ArmyVo.bId);
                }
            }
        }
    }
    /**初始化征收量 */
    public static initBuildLevy(levy: gameProto.IBuildingLevy[]) {
        if (levy) {
            let levys = levy;
            for (let key in levys) {
                let ar = levys[key];
                if (this.m_pBuildInfos[ar.bid]) {
                    this.m_pBuildInfos[ar.bid].harvestTime = ar.harvestTime;
                }
            }
        }
    }

    /**设置兵种练兵队列 */
    public static updateArmyInfo(army: gameProto.ITrainArmy) {
        if (this.m_pArmyHash[army.bId]) {
            this.m_pArmyHash[army.bId].init(army);
        } else {
            let ArmyVo = TrainArmyVo.create(army);
            this.m_pArmyHash[army.bId] = ArmyVo;
        }
        com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, army.armyType);
    }

    /**获取练兵信息数据队列 */
    public static getArmys() {
        return this.m_pArmyHash;
    }
    /**获取兵种星星byBuidID */
    public static getTrainArmyVoById(bId) {
        for (let i in this.m_pArmyHash) {
            if (this.m_pArmyHash[i].bId == bId) {
                return this.m_pArmyHash[i];
            }
        }
        return null;
    }

    /**训练加速 */
    public static SpeedUpTrain(bId, speedTime) {
        for (let i in this.m_pArmyHash) {
            let tempVo: TrainArmyVo = this.m_pArmyHash[i];
            if (tempVo.bId == bId) {
                tempVo.speedTime = speedTime;
                if (tempVo.speedTime + TimerUtils.getServerTime() >= tempVo.endTime) {
                    this.resetArmysByBuildid(bId);
                } else
                    this.updateBuildArmysById(bId);
            }
        }

    }

    /**重置训练数据 */
    public static resetArmysByBuildid(bId) {
        for (let i in this.m_pArmyHash) {
            if (this.m_pArmyHash[i].bId == bId) {
                this.m_pArmyHash[i].startTime = 0;
                this.m_pArmyHash[i].endTime = 0;
                this.m_pArmyHash[i].speedTime = 0;
                this.updateBuildArmysById(bId);
            }
        }
        let armType = this.getSoliderTypeByBuildId(bId);
        com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, armType);
        return null;
    }
    /**
     * 刷新建筑 士兵训练数据
     */
    public static updateBuildArmysById(id: number) {
        let buildVo: MainMapBuildVo = this.m_pBuildInfos[id];
        if (buildVo) {
            buildVo.updateArmyData();
        }
    }

    /**是否训练cd */
    public static isInTrain(id: number): boolean {
        let buildVo: MainMapBuildVo = this.getBuildInfo(id);
        if (buildVo)
            return buildVo.isInTrain;

        return false;
    }
    public static isOutput(id: number): boolean {
        let buildVo = MainMapModel.getBuildInfo(id);
        return buildVo.hasOutInfo();
    }

    /**根据产出兵种获得建筑结构 */
    public static getBuildInfoBySolider(type: SoldierMainType): MainMapBuildVo {
        let buildId = MBuildId.BBY;
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
        let buildVo = this.getBuildInfo(buildId);
        return buildVo;
    }

    /**根据产出兵种获得建筑结构 */
    public static getSoliderBuildLvByType(type: SoldierMainType) {
        let buildVo = this.getBuildInfoBySolider(type);
        if (buildVo) {
            return buildVo.level
        }
        return 1;
    }

    /**根据产出兵种获得建筑结构 */
    public static getSoliderTypeByBuildId(id: MBuildId) {
        let type = SoldierMainType.FOOTSOLDIER;
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
    }

    /**根据建筑id打开ui */
    public static openSoliderTrainSpeedUpView(buildId: number) {
        let armyData = MainMapModel.getTrainArmyVoById(buildId);
        if (armyData && armyData.endTime > 0) {
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, { propSpeedType: PropSpeedType.Soldier, targetId: buildId, startTime: armyData.startTime, endTime: armyData.endTime, speedUpTime: armyData.speedTime });
        } else {
            Utils.open_view(TASK_UI.TRAIN_SOLDIER_PANEL, { key: buildId });
        }
    }


    /**获得训练倒计时数据结构 */
    public static getCountDownTrainValues(id: number): any[] {
        let armyData = MainMapModel.getTrainArmyVoById(id);
        if (armyData) {
            let stime = armyData.startTime;
            let etime = armyData.endTime;
            let spTime = armyData.speedTime;
            return Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000);
        }
        return null;
    }
    /**==================================================================================================================================
     * 士兵训练 end
     * ==================================================================================================================================
     */

    /**==================================================================================================================================
    * 道具生产 begin
    * ==================================================================================================================================
    */
    /**获取龙图阁道具队列 */
    public static getPropQueue() {
        return this.m_pPropQueue;
    }

    /**设置龙图阁道具队列 */
    public static setPropQueue(v: any) {
        this.m_pPropQueue = v;
    }

    /**获取龙图阁在建或者没有收取的道具列表 */
    public static getProps() {
        return this.m_pPropHash;
    }

    /**设置龙图阁在建或者没有收取的道具列表 */
    public static setProps(v: any) {
        this.m_pPropHash = v;
    }

    /**改变建造列表数据 */
    public static changeProps(index: number, v: StrategyPropVo) {
        this.m_pPropHash[index] = v;
    }


    /**添加制作队列 */
    public static addprops(prop: any) {
        if (prop) {
            this.m_pPropHash = [];
            let props = prop;
            for (let key in props) {
                if (props.hasOwnProperty(key)) {
                    let prop = props[key];
                    let propvo = StrategyPropVo.create(prop);
                    this.m_pPropHash[propvo.index] = propvo;
                }
            }
        }
    }


    public static deleteprops(id: number) {
        let props = this.m_pPropHash;
        for (let key in props) {
            if (props.hasOwnProperty(key)) {
                let prop = props[key];
                if (prop.id == id) {
                    props[key].reset();
                    delete props[key];
                    return;
                }
            }
        }
        error("delete失败");
    }

    /**==================================================================================================================================
     * 道具生产 end
     * ==================================================================================================================================
     */

    /**打开建筑功能 */
    public static openBuildFunc(buildId: MBuildId) {
        let vo = this.getBuildInfo(buildId);
        //指定id建筑 才做出判断 并且未激活弹出提示 在case指定id下判断
        let isOpen = this.isActivation(buildId);
        let isFuncBuild = false;
        switch (buildId) {
            case MBuildId.XY: {  //行营副本关卡
                isFuncBuild = true;
                isOpen = this.isActivation(buildId);
                if (isOpen) Utils.open_view(TASK_UI.HEADQUARTER_MAIN_PANEL);
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
    }

    /**==================================================================================================================================
    * 事件监听 start
    * ==================================================================================================================================
    */

    public static addEvent() {
        com_main.EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.setBuildLvUpState, this);
        com_main.EventMgr.addEvent(BuildEvent.CHECK_BUILD_LV_STATE, this.setBuildLvUpState, this);
        com_main.EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.onTechnoInfoUpdate, this);
    }

    public static removeEvent() {
        com_main.EventMgr.removeStaticEvent(BuildEvent.BUILD_UP_LEVEL, this.setBuildLvUpState);
        com_main.EventMgr.removeStaticEvent(BuildEvent.CHECK_BUILD_LV_STATE, this.setBuildLvUpState);
        com_main.EventMgr.removeStaticEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.onTechnoInfoUpdate);
    }

    /**设置是否升级状态 */
    public static setBuildLvUpState() {
        for (let i in this.m_pBuildInfos) {
            let buildVo: MainMapBuildVo = this.m_pBuildInfos[i];
            let mBuild: com_main.MBuild = com_main.MainMap.getMBuildById(buildVo.id);
            if (mBuild) {
                let NextLvCfg = this.getBuildingCfg(buildVo.type, MainMapModel.getLevel(buildVo.id) + 1);
                let boo = NextLvCfg ? true : false;
                let state = buildVo && !buildVo.isInBuilding() && this.checkBuildLvUp(buildVo.id) && boo;
                mBuild.setLvTipsState(state);
            }
        }

    }


    /**科技效果更新 */
    public static onTechnoInfoUpdate(id: number) {
        let vo = TechnoModel.getTechVoById(id);
        if (vo.level == 0) return
        if (vo.addMainType == NorEffType.FOOT) {
            let builds = this.getBuildsbyType(BuildingType.FARMLAND);
            for (let i = 0; i < builds.length; i++) {
                builds[i].refreshOutInfo();
            }
        }
    }

    /**==================================================================================================================================
    * 事件监听 end
    * ==================================================================================================================================
    */

    /**==================================================================================================================================
    * 配置读取 begin
    * ==================================================================================================================================
    */
    /**等级配置表 */
    public static getBuildingCfg(bType: number, level: number) {
        for (let key in C.BuildingLevelConfig) {
            let cfg = C.BuildingLevelConfig[key];
            if (cfg.buildingType == bType && cfg.level == level) {
                return cfg;
            }
        }
        return null;
    }
    /**等级配置表 */
    public static getBuildLvCfg(id: number) {
        let bCfg = C.BuildingConfig[id];
        if (bCfg) {
            let lv = this.getLevel(id);
            if (C.BuildingLevelConfigDic[bCfg.type]) {
                return C.BuildingLevelConfigDic[bCfg.type][lv];
            }
        } else
            return null;
    }

    //获取建筑配置表
    public static getBunildCfgByType(type: number) {
        for (let key in C.BuildingConfig) {
            let cfg = C.BuildingConfig[key];
            if (cfg.type == type) {
                return cfg;
            }
        }
    }

    /**获取建筑类型表配置 */
    public static getBuildingTypeCfg(type: number): BuildingTypeConfig {
        return C.BuildingTypeConfig[type];
    }

    /**获取资源产出配置表 类型 +等级*/
    public static getBuildOutCfg(type: BuildingType, level: number): BuildingResourcesLvConfig {
        if (C.BuildingResourcesLvConfigDic[type])
            return C.BuildingResourcesLvConfigDic[type][level];
        return null;
    }

    /**获取建筑等级配置表 类型 +等级*/
    public static getBuildLevelCfg(type: BuildingType, level: number): BuildingLevelConfig {
        if (C.BuildingLevelConfigDic[type])
            return C.BuildingLevelConfigDic[type][level];
        return null;
    }

    /** 获取清除建筑CD消耗配置 */
    public static getBuildingCdConfig(): any[] {
        if (this.m_pBuildingCdConfig == null) {
            let cfgs = C.CoolDownConfig;
            this.m_pBuildingCdConfig = [];
            for (let key in cfgs) {
                if (cfgs.hasOwnProperty(key)) {
                    let cfg = cfgs[key];
                    if (cfg.type == CoolDownType.BuildingSpeed) {
                        let config: any = { min: cfg.min, max: cfg.max, gold: cfg.gold };
                        this.m_pBuildingCdConfig.push(config);
                    }
                }
            }

            // 对配置排序
            this.m_pBuildingCdConfig = this.m_pBuildingCdConfig.sort((a, b) => {
                if (a.max > b.max) {
                    return 1;
                } else {
                    return -1;
                }
            })
        }
        return this.m_pBuildingCdConfig;
    }

    //获得连兵营等级 对应的练兵配置
    public static getBuildingTrainCfgbyBuildId(bId: BuildingType) {
        let cfg = C.BuildingTrainConfig;
        let buildVo: MainMapBuildVo = MainMapModel.getBuildInfo(bId);
        if (buildVo) {
            for (let key in cfg) {
                if (cfg[key]) {
                    let it = cfg[key];
                    if (buildVo.type == it.buildingType && it.level == buildVo.level) {
                        return it;
                    }
                }
            }
        }

        return null;
    }
    //获得单个的练兵配置
    public static getBuildingTrainCfg(type: BuildingType, level: number) {
        let cfg = C.BuildingTrainConfig;
        for (let key in cfg) {
            if (cfg[key]) {
                let it = cfg[key];
                if (it.buildingType == type && it.level == level) {
                    return it;
                }
            }
        }
        return null;
    }

    //根据兵种 获得兵种等级表
    public static getSoldierLvCfg(armyType: SoldierMainType, level?: number): GeneralSoldierLvConfig {
        level = level || MainMapModel.getSoliderBuildLvByType(armyType);
        return C.GeneralSoldierLvConfigDic[armyType][level];
    }
    /**==================================================================================================================================
   * 配置读取 end
   * ==================================================================================================================================
   */

    /**==================================================================================================================================
     * 新手引导 begin
     * ==================================================================================================================================
     */
    /**移动到正在升级建筑 */
    public static MoveToCanGradeUpBuild() {
        let id = this.getRecommedBuildId();
        if (id == -1) return;
        com_main.MainMap.moveToBuild(id, true)
        com_main.MainMap.showMoveSelectEffect(id)
    }
    /**
     * 获取推荐建筑升级id
     */
    public static getRecommedBuildId() {
        let id = -1;
        let buildings: MainMapBuildVo[] = [];
        for (var key in this.m_pBuildInfos) {
            buildings.push(this.m_pBuildInfos[key]);
        }
        buildings.sort((a, b) => {
            if (a.level != b.level) return a.level - b.level;
            return a.id - b.id;
        });
        for (let i = 0; i < buildings.length; i++) {
            let info = buildings[i];
            if (!info.getIsCanLvUp()) {   //不用升级的跳过
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
    }

    /**
     * 获取推荐建筑升级id
     * 不判断材料条件限制
     */

    public static getBuildIdByCondition() {
        let id = MBuildId.HALL_BUILD_ID;
        let buildings: MainMapBuildVo[] = [];
        for (var key in this.m_pBuildInfos) {
            buildings.push(this.m_pBuildInfos[key]);
        }
        buildings.sort((a, b) => {
            if (a.level != b.level) return a.level - b.level;
            return a.id - b.id;
        });
        for (let i = 0; i < buildings.length; i++) {
            let info = buildings[i];
            if (!info.getIsCanLvUp()) {   //不用升级的跳过
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
            let lvCfg = this.getBuildLvCfg(id);
            if (lvCfg) {
                let datas = StringUtils.keyValsToNumberArray(lvCfg.conditions);
                for (let i in datas) {
                    let data = datas[i];
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
    }

    /**获取建筑状态 */ //暂时检测是否升级状态，后续拓展
    public static checkBuildState(id: number, type: number): boolean {
        switch (type) {
            case 1: { //升级状态
                return this.isInBuilding(id)
            }
            case 2: {

            } default: {

            }
        }
        return false;
    }
    /**==================================================================================================================================
    * 新手引导 end
    * ==================================================================================================================================
    */
}