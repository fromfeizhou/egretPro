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
var MainMapBuildVo = /** @class */ (function (_super_1) {
    __extends(MainMapBuildVo, _super_1);
    function MainMapBuildVo() {
        return _super_1.call(this) || this;
    }
    /**===========================================================================================================
     * @分割线 客户端变量 end
     * ===========================================================================================================
     */
    MainMapBuildVo.create = function () {
        var obj = new MainMapBuildVo();
        return obj;
    };
    MainMapBuildVo.prototype.init = function (body) {
        var keys = MainMapBuildVo.AttriKey;
        Utils.voParsePbData(this, body, MainMapBuildVo.AttriKey);
        //建造中 添加到建造队列
        if (this.buildStartTime > 0) {
            // this.startUpLevel(this.buildStartTime, this.buildEndTime)
            MainMapModel.addQueueBuildId(this.id);
        }
        /**客户端配置读取 */
        this.buildCfg = C.BuildingConfig[this.id];
        if (this.buildCfg) {
            this.pos = this.buildCfg.pos;
            this.rk = this.buildCfg.rk;
            this.rkFunction = this.buildCfg.rkFunction;
            this.updateMaxState();
            //兵营属性
            if (this.isSoldierBuilding()) {
                this.setSoliderProduce();
                this.updateArmyData();
            }
            //建筑产出
            this.updateEffectList();
        }
        else {
            this.buildCfg = C.BuildingConfig[2];
        }
        this.setIsCanLvUpState();
    };
    /**销毁 */
    MainMapBuildVo.prototype.onDestroy = function () {
    };
    /**建筑升级 */
    MainMapBuildVo.prototype.setBuildNextLevel = function () {
        if (this.isMax)
            return;
        this.level += 1;
        //设置新的产出效果
        this.updateEffectList();
        this.updateMaxState();
        /**建筑升级事件 */
        com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_UP_LEVEL, this.id);
        MainMapProxy.C2S_TOUCH_BUILDING(this.id);
    };
    /**刷新最高等级状态 */
    MainMapBuildVo.prototype.updateMaxState = function () {
        var lvCfg = MainMapModel.getBuildLevelCfg(this.type, this.level + 1);
        this.isMax = lvCfg == null ? true : false; //是否满级
    };
    MainMapBuildVo.prototype.setIsCanLvUpState = function () {
        var cfgData = C.BuildingConfig[this.id];
        if (cfgData && cfgData.upgrad == 1) {
            this.hasLvUpFunction = true;
        }
        else {
            this.hasLvUpFunction = false;
        }
    };
    MainMapBuildVo.prototype.getIsCanLvUp = function () {
        return this.hasLvUpFunction;
    };
    /**=====================================================================================================================
     * 练兵 begin
     * =====================================================================================================================
     */
    /**是否是练兵营 */
    MainMapBuildVo.prototype.isSoldierBuilding = function () {
        return MainMapModel.isSoldierBuilding(this.type);
    };
    /**设置产出兵种 */
    MainMapBuildVo.prototype.setSoliderProduce = function () {
        var cfg = this.getBuildingTrainCfg();
        if (cfg) {
            this.trainArmyType = cfg.soldiersType;
        }
    };
    /**刷新兵营属性(数据模块更新调用) */
    MainMapBuildVo.prototype.updateArmyData = function () {
        // 不是兵营的不处理
        if (!MainMapModel.isSoldierBuilding(this.type))
            return;
        var armyData = MainMapModel.getTrainArmyVoById(this.id);
        if (armyData) {
            this.trainArmyType = armyData.armyType;
            if (armyData.startTime > 0) {
                this.isInTrain = true;
                com_main.MainMap.checkTrainCD(this.id);
                return;
            }
        }
        //训练重置
        this.isInTrain = false;
        com_main.MainMap.checkTrainCD(this.id);
    };
    /**获得产出 */
    MainMapBuildVo.prototype.trainSoliderNum = function () {
        var armyData = MainMapModel.getTrainArmyVoById(this.id);
        if (armyData) {
            if (TimerUtils.getServerTime() + armyData.speedTime > armyData.endTime) { //cd完毕
                return armyData.num;
            }
        }
        return 0;
    };
    /**检查练兵进度 */
    MainMapBuildVo.prototype.trainProcess = function () {
        if (this.isInTrain) {
            //训练完毕 添加总兵数
            var num = this.trainSoliderNum();
            if (num > 0) {
                //当前产出
                this.trainOutNum = num;
                //清理练兵进度信息
                MainMapModel.resetArmysByBuildid(this.id);
                // 请求征收士兵 练兵结束不会主动征收（打开界面 或点击建筑泡泡） 
                //2019.6.6.8 恢复自动结算逻辑
                SoldierProxy.send_C2S_TRAINING_GET(this.id);
                //清理训练结构
                MainMapModel.resetArmysByBuildid(this.id);
                // //产出更新
                // com_main.MainMap.checkOutSoldierput(this.id);
            }
        }
    };
    /**清理单次士兵产出 (领取后清0)*/
    MainMapBuildVo.prototype.clearTrainOutNum = function () {
        this.trainOutNum = 0;
        //产出更新
        // com_main.MainMap.checkOutSoldierput(this.id);
    };
    /**设置士兵存量（总量） */
    MainMapBuildVo.prototype.setTrainSoliderNum = function (val) {
        this.trainSoldierNum = val;
    };
    //获得连兵营等级 对应的练兵配置
    MainMapBuildVo.prototype.getBuildingTrainCfg = function () {
        var cfg = C.BuildingTrainConfig;
        for (var key in cfg) {
            if (cfg[key]) {
                var it = cfg[key];
                if (this.type == it.buildingType && it.level == this.level) {
                    return it;
                }
            }
        }
        return null;
    };
    /**=====================================================================================================================
     * 练兵 end
     * =====================================================================================================================
    */
    /**=====================================================================================================================
     * 建造 begin
     * =====================================================================================================================
     */
    /**是否激活 */
    MainMapBuildVo.prototype.isActivation = function () {
        // return this.status != MainBuildStatus.WAIT;
        return this.status >= MainBuildStatus.NORMAL;
    };
    /**可以激活 */
    MainMapBuildVo.prototype.canActivation = function () {
        // 2019 9 9
        // if (this.status == MainBuildStatus.WAIT) {
        //     return MainMapModel.getHallLevel() >= this.buildCfg.openLevel;
        // }
        // return false;
        return MainMapModel.getHallLevel() >= this.buildCfg.openLevel;
    };
    /**获得激活等级 */
    MainMapBuildVo.prototype.getActivationLevel = function () {
        return this.buildCfg.openLevel;
    };
    /**开始升级 */
    MainMapBuildVo.prototype.startUpLevel = function (buildStartTime, buildEndTime) {
        if (buildStartTime > 0 && buildEndTime > 0) {
            this.buildStartTime = buildStartTime;
            this.buildEndTime = buildEndTime;
            this.speedTime = 0;
            MainMapModel.addQueueBuildId(this.id);
        }
    };
    /**升级加速 */
    MainMapBuildVo.prototype.updateUpLevel = function (speedTime) {
        // let time = TimerUtils.getServerTimeMill()+speedTime;
        // if (time >= this.buildEndTime || this.buildEndTime == 0) {
        //     this.finishUpLevel();
        // } else {
        this.speedTime = speedTime;
        //        }
    };
    /**建造完成 */
    MainMapBuildVo.prototype.finishUpLevel = function () {
        if (this.buildEndTime >= 0) {
            this.setBuildNextLevel();
            MainMapModel.removeQueueBuildId(this.id);
            if (this.buildEndTime == 0) { //立刻完成
                com_main.MainMap.onBulidFastLevelUp(this.id);
            }
            this.buildStartTime = 0;
            this.buildEndTime = 0;
            this.speedTime = 0;
        }
    };
    /**是否建造中 */
    MainMapBuildVo.prototype.isInBuilding = function () {
        return this.buildStartTime > 0;
    };
    /**刷新建造情况 */
    MainMapBuildVo.prototype.buildingProcess = function () {
        if (this.isInBuilding()) {
            //建筑结束
            if (TimerUtils.getServerTime() >= this.buildEndTime - this.speedTime) {
                this.finishUpLevel();
            }
        }
    };
    /**建造结束 */
    MainMapBuildVo.prototype.isBuildEnd = function () {
        if (this.isInBuilding()) {
            return TimerUtils.getServerTime() >= this.buildEndTime - this.speedTime;
        }
        return true;
    };
    /**获得建筑剩余时间 */
    MainMapBuildVo.prototype.getBuildLeftTime = function () {
        if (this.isInBuilding()) {
            return this.buildEndTime - this.speedTime - TimerUtils.getServerTime();
        }
        return 0;
    };
    /**=====================================================================================================================
     * 建造 end
     * =====================================================================================================================
    */
    /**=====================================================================================================================
     * 产出 begin
     * =====================================================================================================================
     */
    /**刷新效果列表 */
    MainMapBuildVo.prototype.updateEffectList = function () {
        this.refreshOutInfo();
    };
    /**产出重置 */
    MainMapBuildVo.prototype.resetOutInfo = function (harvestTime) {
        this.harvestTime = harvestTime;
        if (this.outInfoList) {
            for (var i = 0; i < this.outInfoList.length; i++) {
                var outInfo = this.outInfoList[i];
                if (outInfo.outVal > 0) {
                    //建筑播放产出特效
                    com_main.MainMap.showOutEffect(this.id, outInfo.outVal);
                }
                outInfo.outVal = 0;
            }
        }
    };
    /**产出进度 */
    MainMapBuildVo.prototype.outInfoProcess = function () {
        if (this.outInfoList) {
            var isRefresh = false;
            for (var i = 0; i < this.outInfoList.length; i++) {
                var outInfo = this.outInfoList[i];
                var oldOutVal = outInfo.outVal;
                var nowTime = TimerUtils.getServerTime();
                var lastTime = this.harvestTime;
                var num = Math.floor((nowTime - lastTime) / outInfo.time);
                var outVal = Math.floor(num * outInfo.rateVal);
                //上限限制
                if (outInfo.max > 0) {
                    outVal = outVal > outInfo.max ? outInfo.max : outVal;
                }
                outInfo.outVal = outVal;
                //判断产量是否变动
                if (outInfo.outVal != oldOutVal) {
                    isRefresh = true;
                }
            }
            //刷新建筑产出 ui
            if (isRefresh) {
                com_main.MainMap.checkOutput(this.id);
            }
        }
    };
    /**建筑是否有产出判断 */
    MainMapBuildVo.prototype.hasOutInfo = function () {
        // if(this.type == MBuildType.PATROL && PatrolModel.nextId !=1){
        //      return PatrolModel.hasOutInfo();
        // }
        if (this.outInfoList && this.outInfoList.length > 0) {
            for (var i = 0; i < this.outInfoList.length; i++) {
                var outInfo = this.outInfoList[i];
                if (outInfo.outVal > 0)
                    return true;
            }
        }
        return false;
    };
    /**获得单一产出结构(只有一种产出的建筑 农田等) */
    MainMapBuildVo.prototype.getSingleOutInfo = function () {
        return this.outInfoList[0];
    };
    /**梳理产出结构（农田，市场等产出）方便计算 */
    MainMapBuildVo.prototype.refreshOutInfo = function () {
        this.outInfoList = [];
        var buildLvCfg = MainMapModel.getBuildOutCfg(this.type, this.level);
        var buildingTypeCfg = MainMapModel.getBuildingTypeCfg(this.type);
        var info = null;
        if (buildingTypeCfg.type == 1 && buildingTypeCfg && buildingTypeCfg.produce) {
            info = {
                rateVal: buildLvCfg.value,
                max: buildLvCfg.maxRes,
                time: buildLvCfg.time,
                outVal: 0
            };
            var techType = NorEffType.FOOT;
            switch (buildingTypeCfg.produce) {
                case PropEnum.FOOD:
                    techType = NorEffType.FOOT;
                    break;
                case PropEnum.IRON:
                    techType = NorEffType.IRON;
                    break;
                case PropEnum.WOOD:
                    techType = NorEffType.WOOD;
                    break;
            }
            info.rateVal = TechnoModel.getTechnoNorEffVal(info.rateVal, techType, NEProduceEnum.ADDITION);
            info.max = TechnoModel.getTechnoNorEffVal(info.max, techType, NEProduceEnum.VOLUME);
            info.time = TechnoModel.getTechnoNorEffVal(info.time, techType, NEProduceEnum.TIME);
        }
        //添加产出结构
        if (info != null) {
            this.outInfoList.push(info);
        }
        this.outInfoProcess();
    };
    MainMapBuildVo.prototype.getOutId = function () {
        var buildingTypeCfg = MainMapModel.getBuildingTypeCfg(this.type);
        if (buildingTypeCfg.type == 1 && buildingTypeCfg.produce) {
            return buildingTypeCfg.produce;
        }
        else {
            return 0;
        }
    };
    /**属性值 */
    MainMapBuildVo.AttriKey = ["id", "level", "type", "status",
        "buildStartTime", "buildEndTime", "speedTime"];
    return MainMapBuildVo;
}(BaseClass));
