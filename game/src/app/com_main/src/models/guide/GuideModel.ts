/**引导触发类型 */
enum GuideTGEnum {
    /**无条件 */
    NONE = 0,
    /**当前主任务 */
    TASK = 1,
    /**功能开启 */
    FUNC = 2,
    /**玩家等级 */
    LEVEL = 3,
    /**建筑解锁 */
    BUILD = 4,
    /**副本引导 */
    WAR = 5,
}

/**引导数据 状态枚举 */
enum GDStateEnum {
    /**普通状态*/
    NORMAL = 0,
    /**激活*/
    ACTIVATED = 1,
    /**完成 */
    FINISH = 2,
}

class GuideModel {
    /*未执行引导队列 */
    public static guideDatas: GuideData[];
    /**已激活引导队列 */
    public static activaDatas: GuideData[];
    /**已执行引导id记录 */
    public static records: number[];
    /**引导步骤配置表 */
    public static stepCfgDic: { [key: number]: GuideStepConfig[] };
    /**触发条件缓存 */
    public static conditionIds: IGUIDECD[];

    /**数据初始化后 调用 不使用调用的models管理 */
    public static init() {
        this.clear();
        this.initGuideInfo();
    }

    public static clear() {
        this.guideDatas = null;
        Utils.TimerManager.remove(GuideModel.onLaterCondition, GuideModel);
        this.removeEvent();
    }

    /**获得当前引导跳转场景 */
    public static getGuideScene() {
        let scene = SceneEnums.AUTO_BATTLE_MAP;
        if (this.activaDatas.length > 0 && this.activaDatas[0].sceneId > 0) {
            scene = this.activaDatas[0].sceneId;
        }
        return scene;
    }

    /**解析新手进度 */
    public static parseGuideRecord(list: number[]) {
        this.records = list;
    }

    /**是否存在执行中的引导 */
    public static hasGuideTrigger() {
        if(RoleData.level >= 40) return false;
        for (let i = 0; i < this.activaDatas.length; i++) {
            let data = this.activaDatas[i]
            //引导正在进行
            if (data.isProcess()) return true;
        }
        return false;
    }

    /**重置已激活副本引导 */
    public static resetWarGuide() {
        for (let i = 0; i < this.activaDatas.length; i++) {
            let data = this.activaDatas[i];
            if (data.type == GuideTGEnum.WAR) {
                data.startStepGuide();
            }
        }
    }

    /**当前副本存在进场引导 */
    public static doWarEnterStep() {
        /**战斗已经打了一半 不判断 */
        if (BattleModel.getIsAleardyCurBattle()) {
            return false;
        }
        this.resetWarGuide();
        let vo = BattleModel.getBattleInfo();

        for (let i = 0; i < this.activaDatas.length; i++) {
            let data = this.activaDatas[i]
            let res = false;
            switch (vo.warType) {
                case CheckPointType.PATRO:
                    res = data.checkStepCondition(IGUIDECD.WAR_HANG_INIT);
                    break;
                case CheckPointType.CHECKPOINT:
                    res = data.checkStepCondition(IGUIDECD.WAR_GEN_INIT);
                    break;
            }
            if (res) {
                data.doStepAction();
                return true;
            }
        }
        return false;
    }

    /**副本存在结算引导 */
    public static doWarEndStep() {
        let vo = BattleModel.getBattleInfo();
        //扫荡进入结算 没有战斗数据
        if (!vo) return false;
        for (let i = 0; i < this.activaDatas.length; i++) {
            if (vo.warType == CheckPointType.PATRO || vo.warType == CheckPointType.CHECKPOINT) {
                let data = this.activaDatas[i]
                let res = data.checkStepCondition(IGUIDECD.WAR_END);
                if (res) {
                    data.doStepAction();
                    return true;
                }
            }
        }
        return false;
    }

    //初始化表数据
    private static initGuideInfo() {
        //临时代码 服务器记录
        if (!this.records) this.records = [];
        this.guideDatas = [];
        this.activaDatas = [];
        GuideModel.conditionIds = [];

        //新手引导开启过滤
        if (!GameConfig.bGuideIsOpen) return;

        for (let key in C.GuideConfig) {
            let cfg = C.GuideConfig[key];
            if (unNull(cfg)) {
                //过滤已经执行引导
                if (this.records.indexOf(cfg.id) == -1) {
                    let data = new GuideData(cfg.id);
                    this.guideDatas.push(data);
                }
            }
        }

        //引导结束
        if (this.guideDatas.length == 0) return;
        //整理 步骤配置表方便访问
        this.parseStepCfg();

        //引导排序 主任务优先
        this.guideDatas.sort(this.guideDataSort);

        //激活测试引导
        if (GameConfig.testGuideIds != '') this.initTestGuide();

        this.onCheck();
        this.addEvent();
    }

    /**初始化测试引导 */
    private static initTestGuide() {
        let res = GameConfig.testGuideIds.split(',');
        let ids: number[] = [];
        for(let i= 0 ;i < res.length;i++){
            ids.push(Number(res[i]));
        }
        if(res.length == 0) return;
        
        this.guideDatas = [];
        this.activaDatas = [];
        
        for (let i = 0; i < ids.length; i++) {
            let data = new GuideData(ids[i]);
            data.state = GDStateEnum.ACTIVATED;
            data.startStepGuide();
            this.activaDatas.push(data);
        }
    }

    //引导排序
    private static guideDataSort(a: GuideData, b: GuideData) {
        if (a.type == b.type) {
            return a.id - b.id;
        }
        if (a.type == GuideTGEnum.TASK) return -1;
        if (b.type == GuideTGEnum.TASK) return 1;
        return 0;
    }

    /**获得目标ui(点击类 引导使用) */
    public static getTargetUI(uiRoot: { layer: number, name: string }, uiPath: Array<any>) {
        if (uiPath.length == 0) return null;
        let uiParam = uiPath[0];
        //特殊ui获取
        let specUI = this.getSpecTargetUI(uiParam);
        if (specUI) return specUI;

        //常规ui获取
        if (uiRoot.layer == 0 && uiRoot.name == '') return null;
        let view = SceneManager.getClass(uiRoot.layer, uiRoot.name) as egret.DisplayObject;
        if (!view) {
            debugGui('没有找到对应的面板 stepId', uiRoot);
            return null;
        }
        let tmpView = view;
        for (let i = 0; i < uiPath.length; i++) {
            let uiParam = uiPath[i];
            tmpView = tmpView[uiParam[0]];
            if (uiParam.length == 2) {
                //列表节点 查找下标为i的子节点
                let group = tmpView as egret.DisplayObjectContainer;
                if (uiParam[1] < group.numChildren)
                    tmpView = group.getChildAt(uiParam[1]);
            }
            if (!tmpView) {
                debugGui('没有找到对应的节点 stepId', uiPath);
                return null;
            }
        }
        return tmpView;
    }

    /**
     * 特殊ui获取接口
     * 对应的ui面板添加获取接口
     * */
    public static getSpecTargetUI(uiParam: any[]) {
        switch (uiParam[0]) {
            case 'func_btn': {
                //动态按钮获取
                return com_main.MainTopOther.getWidgetByBtnId(uiParam[1]);
            }
            case 'general_id': {
                //武将卡牌获取
                return com_main.GeneralListWnd.getOwnerCardById(uiParam[1]);
            }
            case 'build_id': {
                //建筑获取
                return com_main.MainMap.getMBuildById(uiParam[1]);
            }
            case 'build_fun_id': {
                //建筑获取
                return com_main.MainMap.getFuncBuildById(uiParam[1]);
            }
            case 'world_res': {
                return com_main.WorldView.getClass().getGuideRes();
            }
            case 'world_menu': {
                return com_main.WorldView.getClass().getWorldMenu()[uiParam[1]];
            }
            case 'world_city': {
                return com_main.WorldView.getClass().getGuideCity(uiParam[1])[uiParam[2]];
            }
            case 'world_lock_city': {
                return com_main.WorldView.getClass().getGuideLockCity();
            }
        }
    }


    /**=====================================================================================
     * 事件监听 being
     * =====================================================================================
     */
    private static addEvent() {
        com_main.EventMgr.addEvent(GuideEvent.GUIDE_ON_CHECK, this.onCheck, this);
        com_main.EventMgr.addEvent(RoleEvent.ROLE_LEVLE, this.onCheck, this);
        com_main.EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.onCheck, this);

        com_main.EventMgr.addEvent(GuideEvent.GUIDE_ON_CONDITION, this.onCondition, this);
        com_main.EventMgr.addEvent(GuideEvent.GUIDE_FINISH, this.onGuideFinish, this);
    }

    private static removeEvent() {
        com_main.EventMgr.removeStaticEvent(GuideEvent.GUIDE_ON_CHECK, this.onCheck);
        com_main.EventMgr.removeStaticEvent(RoleEvent.ROLE_LEVLE, this.onCheck);
        com_main.EventMgr.removeStaticEvent(BuildEvent.BUILD_UP_LEVEL, this.onCheck);

        com_main.EventMgr.removeStaticEvent(GuideEvent.GUIDE_ON_CONDITION, this.onCondition);
        com_main.EventMgr.removeStaticEvent(GuideEvent.GUIDE_FINISH, this.onGuideFinish);
    }

    //检测是否可以执行引导(主线任务接取 完成，功能开放，人物升级 模块初始化) 
    private static onCheck() {
        let oldLen = this.activaDatas.length;
        //非进行中引导 或认为引导 选取优先级高的作为当前引导
        for (let i = this.guideDatas.length - 1; i >= 0; i--) {
            let data = this.guideDatas[i];
            //只判断未激活 引导
            if (data.isNormal()) {
                data.checkCondition();
                //引导激活 不从队列中移除 任务引导的完成遍历 guideDatas 数据不能移除
                if (data.isActivated()) {
                    this.activaDatas.push(data);
                }
            }
        }

        //新增队列
        if (this.activaDatas.length != oldLen) {
            this.activaDatas.sort(this.guideDataSort);
            SceneManager.sendGuideScene();
        }
    }

    /**清理条件触发(切换场景跳动) */
    public static clearCondtion() {
        GuideModel.conditionIds = [];
    }

    /**界面切换 触发引导组 延迟触发避免同一帧多次检测 或下一帧有弹窗影响当前判断的逻辑 */
    private static onCondition(id: IGUIDECD) {
        //延迟期间所有触发条件缓存记录
        if (GuideModel.conditionIds.indexOf(id) == -1) {
            GuideModel.conditionIds.push(id);
        }
        Utils.TimerManager.doTimer(60, 1, GuideModel.onLaterCondition, GuideModel);
       
    }

    /**延迟检测 避免界面逻辑冲突 */
    private static onLaterCondition() {
        //当前引导界面存在 返回
        if (SceneManager.hasChildGuideView()) {
            GuideModel.conditionIds = [];
            return;
        }
        if (GuideModel.conditionIds.length == 0) return;
        let ids = GuideModel.conditionIds;
        GuideModel.conditionIds = [];

        //只判断 激活队列的引导
        for (let i = 0; i < this.activaDatas.length; i++) {
            let data = this.activaDatas[i];
            let k = 0;
            while (k < ids.length) {
                let res = data.checkStepCondition(ids[k]);
                if (res) {
                    //有行为触发 调出条件匹配
                    data.doStepAction();
                    return;
                }
                k++;
            }
        }
    }

    /**引导完成 */
    public static onGuideFinish(id: number) {
        //操作步骤完成 由激活队列里移除 任务引导记录 不发送 由任务状态判断发送
        for (let i = this.activaDatas.length - 1; i >= 0; i--) {
            let data = this.activaDatas[i];
            if (id == data.id) {
                this.activaDatas.splice(i, 1);
                break;
            }
        }
        let cfg = C.GuideConfig[id];
        if (cfg.type == GuideTGEnum.TASK) return;
        GuideProxy.C2S_GUIDE_COMMIT(id);
    }

    /**任务完成 接取 */
    public static sendGuideRecordByTask(cId: number, state: TaskStatus) {
        if (!this.guideDatas) return;
        /**检查主线任务相关引导 */
        this.onCheck();

        for (let i = this.guideDatas.length - 1; i >= 0; i--) {
            let data = this.guideDatas[i];
            if (data.type == GuideTGEnum.TASK && !data.isNormal()) {
                //任务进度超过当前引导 条件
                if (data.params[0] == cId && state > data.params[1]) {
                    GuideProxy.C2S_GUIDE_COMMIT(data.id);

                    //新手引导上报
                    window["ta"].track('novice_guide',  {step:data.id+"",'trigger_time': new Date()});
                }
            }
        }
    }

    /**=====================================================================================
     * 事件监听 end
     * =====================================================================================
     */

    /**=====================================================================================
     * 配置表 begin
     * =====================================================================================
     */
    /**解析步骤配置表 */
    private static parseStepCfg() {
        this.stepCfgDic = {};
        for (let key in C.GuideStepConfig) {
            let cfg = C.GuideStepConfig[key];
            if (unNull(cfg)) {
                let guideId = cfg.guideId;
                if (isNull(this.stepCfgDic[guideId])) {
                    this.stepCfgDic[guideId] = [];
                }
                this.stepCfgDic[guideId].push(cfg);
            }
        }

        //数组排序
        for (let key in this.stepCfgDic) {
            let list = this.stepCfgDic[key];
            if (unNull(list)) {
                list.sort((a: GuideStepConfig, b: GuideStepConfig) => {
                    return a.id - b.id;
                });
            }
        }
    }

    /**根据指引id 获得步骤列表 */
    public static getStepCfgsByGuideId(id: number) {
        return this.stepCfgDic[id];
    }

    /**=====================================================================================
     * 配置表 end
     * =====================================================================================
     */
}