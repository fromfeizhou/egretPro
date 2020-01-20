/**建筑产出接口 */
interface IBuildOutInfo {
    /**产出值(单位) */
    rateVal: number;
    /**产出上限 */
    max: number;
    /**产出时间(s) */
    time: number;
    /**产量 */
    outVal: number;
}

class MainMapBuildVo extends BaseClass implements IFObject {
    /**属性值 */
    public static AttriKey: Array<string> = ["id", "level", "type", "status",
        "buildStartTime", "buildEndTime", "speedTime"];
    /**建筑id */
    public id: number;
    /**等级 */
    public level: number;
    /**建筑类型 */
    public type: number;
    /**状态 */
    public status: number;
    /**建造开始时间 默认0 */
    public buildStartTime: number;
    /**建造结束时间 默认0*/
    public buildEndTime: number;
    /**建造加速时间 默认0*/
    public speedTime: number;
    // /**上次收获时间 没有的话取当前时间*/
    public harvestTime: number;
    /**===========================================================================================================
     * @分割线 客户端变量 begin
     * ===========================================================================================================
     */
    /**建筑配置表 */
    public buildCfg: BuildingConfig;
    /**位置   */
    public pos: number;
    /**建筑入口 */
    public rk: string;
    /**建筑入口功能限制，与建筑入口列一一对应，0表示没限制。 */
    public rkFunction: string;
    /**是否满级  */
    public isMax: boolean;

    /**是否训练中 */
    public isInTrain: boolean;
    /**产出兵种 (建筑类型 15 16 17)*/
    public trainArmyType: SoldierMainType;
    /**士兵量(总量) */
    public trainSoldierNum: number;
    /**当前训练产出 */
    public trainOutNum: number;

    /**建筑产出数据结构 */
    public outInfoList: Array<IBuildOutInfo>;
    /**是否有升级入口 */
    public hasLvUpFunction: boolean;
    /**===========================================================================================================
     * @分割线 客户端变量 end
     * ===========================================================================================================
     */


    public static create() {
        let obj: MainMapBuildVo = new MainMapBuildVo();
        return obj;
    }

    public constructor() {
        super();
    }

    public init(body?: any) {
        let keys: Array<string> = MainMapBuildVo.AttriKey;
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
        } else {
            this.buildCfg = C.BuildingConfig[2];
        }
        this.setIsCanLvUpState();
    }

    /**销毁 */
    public onDestroy() {
    }

    /**建筑升级 */
    public setBuildNextLevel() {
        if (this.isMax) return;

        this.level += 1;
        //设置新的产出效果
        this.updateEffectList();
        this.updateMaxState();

        /**建筑升级事件 */
        com_main.EventMgr.dispatchEvent(BuildEvent.BUILD_UP_LEVEL, this.id);
        MainMapProxy.C2S_TOUCH_BUILDING(this.id);
    }

    /**刷新最高等级状态 */
    public updateMaxState() {
        let lvCfg = MainMapModel.getBuildLevelCfg(this.type, this.level + 1);
        this.isMax = lvCfg == null ? true : false;//是否满级
    }

    public setIsCanLvUpState() {
        let cfgData = C.BuildingConfig[this.id];
        if (cfgData && cfgData.upgrad == 1) {
            this.hasLvUpFunction = true;
        } else {
            this.hasLvUpFunction = false;
        }
    }

    public getIsCanLvUp() {
        return this.hasLvUpFunction;
    }


    /**=====================================================================================================================
     * 练兵 begin
     * =====================================================================================================================
     */
    /**是否是练兵营 */
    public isSoldierBuilding() {
        return MainMapModel.isSoldierBuilding(this.type)
    }

    /**设置产出兵种 */
    public setSoliderProduce() {
        let cfg = this.getBuildingTrainCfg();
        if (cfg) {
            this.trainArmyType = cfg.soldiersType;
        }
    }

    /**刷新兵营属性(数据模块更新调用) */
    public updateArmyData() {
        // 不是兵营的不处理
        if (!MainMapModel.isSoldierBuilding(this.type)) return;

        let armyData = MainMapModel.getTrainArmyVoById(this.id);
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
    }

    /**获得产出 */
    public trainSoliderNum() {
        let armyData = MainMapModel.getTrainArmyVoById(this.id);
        if (armyData) {
            if (TimerUtils.getServerTime() + armyData.speedTime > armyData.endTime) {//cd完毕
                return armyData.num;
            }
        }
        return 0;
    }

    /**检查练兵进度 */
    public trainProcess() {
        if (this.isInTrain) {
            //训练完毕 添加总兵数
            let num = this.trainSoliderNum();
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
    }

    /**清理单次士兵产出 (领取后清0)*/
    public clearTrainOutNum() {
        this.trainOutNum = 0;
        //产出更新
        // com_main.MainMap.checkOutSoldierput(this.id);
    }

    /**设置士兵存量（总量） */
    public setTrainSoliderNum(val: number) {
        this.trainSoldierNum = val;
    }

    //获得连兵营等级 对应的练兵配置
    private getBuildingTrainCfg() {
        let cfg = C.BuildingTrainConfig;
        for (let key in cfg) {
            if (cfg[key]) {
                let it = cfg[key];
                if (this.type == it.buildingType && it.level == this.level) {
                    return it;
                }
            }
        }
        return null;
    }

    /**=====================================================================================================================
     * 练兵 end
     * =====================================================================================================================
    */

    /**=====================================================================================================================
     * 建造 begin
     * =====================================================================================================================
     */


    /**是否激活 */
    public isActivation() {
        // return this.status != MainBuildStatus.WAIT;
        return this.status >= MainBuildStatus.NORMAL;
    }

    /**可以激活 */
    public canActivation() {
        // 2019 9 9
        // if (this.status == MainBuildStatus.WAIT) {
        //     return MainMapModel.getHallLevel() >= this.buildCfg.openLevel;
        // }

        // return false;
        return MainMapModel.getHallLevel() >= this.buildCfg.openLevel;
    }

    /**获得激活等级 */
    public getActivationLevel() {
        return this.buildCfg.openLevel;
    }

    /**开始升级 */
    public startUpLevel(buildStartTime: number, buildEndTime: number) {
        if (buildStartTime > 0 && buildEndTime > 0) {
            this.buildStartTime = buildStartTime;
            this.buildEndTime = buildEndTime;
            this.speedTime = 0;
            MainMapModel.addQueueBuildId(this.id);
        }
    }

    /**升级加速 */
    public updateUpLevel(speedTime: number) {
        // let time = TimerUtils.getServerTimeMill()+speedTime;
        // if (time >= this.buildEndTime || this.buildEndTime == 0) {
        //     this.finishUpLevel();
        // } else {
        this.speedTime = speedTime;
        //        }

    }

    /**建造完成 */
    public finishUpLevel() {
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

    }

    /**是否建造中 */
    public isInBuilding(): boolean {
        return this.buildStartTime > 0;
    }

    /**刷新建造情况 */
    public buildingProcess() {
        if (this.isInBuilding()) {
            //建筑结束
            if (TimerUtils.getServerTime() >= this.buildEndTime - this.speedTime) {
                this.finishUpLevel();
            }
        }
    }

    /**建造结束 */
    public isBuildEnd() {
        if (this.isInBuilding()) {
            return TimerUtils.getServerTime() >= this.buildEndTime - this.speedTime;
        }
        return true;
    }

    /**获得建筑剩余时间 */
    public getBuildLeftTime() {
        if (this.isInBuilding()) {
            return this.buildEndTime - this.speedTime - TimerUtils.getServerTime();
        }
        return 0;
    }
    /**=====================================================================================================================
     * 建造 end
     * =====================================================================================================================
    */

    /**=====================================================================================================================
     * 产出 begin
     * =====================================================================================================================
     */
    /**刷新效果列表 */
    public updateEffectList() {
        this.refreshOutInfo();
    }

    /**产出重置 */
    public resetOutInfo(harvestTime: number) {
        this.harvestTime = harvestTime;
        if (this.outInfoList) {
            for (let i = 0; i < this.outInfoList.length; i++) {
                let outInfo = this.outInfoList[i];
                if (outInfo.outVal > 0) {
                    //建筑播放产出特效
                    com_main.MainMap.showOutEffect(this.id, outInfo.outVal);
                }
                outInfo.outVal = 0;
            }
        }
    }

    /**产出进度 */
    public outInfoProcess() {

        if (this.outInfoList) {
            let isRefresh = false;
            for (let i = 0; i < this.outInfoList.length; i++) {
                let outInfo = this.outInfoList[i];
                let oldOutVal = outInfo.outVal;
                let nowTime = TimerUtils.getServerTime();
                let lastTime = this.harvestTime;
                let num = Math.floor((nowTime - lastTime) / outInfo.time);
                let outVal = Math.floor(num * outInfo.rateVal);
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
    }

    /**建筑是否有产出判断 */
    public hasOutInfo(): boolean {
        // if(this.type == MBuildType.PATROL && PatrolModel.nextId !=1){
        //      return PatrolModel.hasOutInfo();
        // }
        if (this.outInfoList && this.outInfoList.length > 0) {
            for (let i = 0; i < this.outInfoList.length; i++) {
                let outInfo = this.outInfoList[i];
                if (outInfo.outVal > 0)
                    return true;
            }
        }
        return false;
    }

    /**获得单一产出结构(只有一种产出的建筑 农田等) */
    public getSingleOutInfo(): IBuildOutInfo {
        return this.outInfoList[0];
    }

    /**梳理产出结构（农田，市场等产出）方便计算 */
    public refreshOutInfo() {
        this.outInfoList = [];

        let buildLvCfg: BuildingResourcesLvConfig = MainMapModel.getBuildOutCfg(this.type, this.level);
        let buildingTypeCfg = MainMapModel.getBuildingTypeCfg(this.type);

        let info: IBuildOutInfo = null;
        if (buildingTypeCfg.type == 1 && buildingTypeCfg && buildingTypeCfg.produce) {
            info = {
                rateVal: buildLvCfg.value,
                max: buildLvCfg.maxRes,
                time: buildLvCfg.time,
                outVal: 0
            };
            let techType: NorEffType = NorEffType.FOOT;
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
    }

    public getOutId() {
        let buildingTypeCfg = MainMapModel.getBuildingTypeCfg(this.type);
        if (buildingTypeCfg.type == 1 && buildingTypeCfg.produce) {
            return buildingTypeCfg.produce;
        } else {
            return 0;
        }
    }

    /**=====================================================================================================================
     * 产出 end
     * =====================================================================================================================
     */

}