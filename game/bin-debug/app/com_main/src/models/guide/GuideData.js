/**新手引导 */
var GuideData = /** @class */ (function () {
    function GuideData(id) {
        this.id = id;
        this.init();
    }
    GuideData.prototype.onDestroy = function () {
    };
    GuideData.prototype.init = function () {
        this.state = GDStateEnum.NORMAL;
        var cfg = C.GuideConfig[this.id];
        this.sceneId = cfg.sceneId;
        this.type = cfg.type;
        this.params = cfg.params == '' ? [] : JSON.parse(cfg.params);
        this.stepIndex = -1;
    };
    /**是否进行中 */
    GuideData.prototype.isProcess = function () {
        return this.stepIndex >= 0;
    };
    /**是否激活中 */
    GuideData.prototype.isActivated = function () {
        return this.state == GDStateEnum.ACTIVATED;
    };
    /**是否普通状态 */
    GuideData.prototype.isNormal = function () {
        return this.state == GDStateEnum.NORMAL;
    };
    /**检查条件 */
    GuideData.prototype.checkCondition = function () {
        if (this.state != GDStateEnum.NORMAL)
            return;
        var res = false;
        switch (this.type) {
            case GuideTGEnum.LEVEL: {
                res = this.checkLevel();
                break;
            }
            case GuideTGEnum.TASK: {
                res = this.checkTask();
                break;
            }
            case GuideTGEnum.FUNC: {
                res = this.checkFunc();
                break;
            }
            case GuideTGEnum.BUILD: {
                res = this.checkBuild();
                break;
            }
            case GuideTGEnum.NONE:
            case GuideTGEnum.WAR: {
                res = true;
                break;
            }
        }
        this.state = res ? GDStateEnum.ACTIVATED : GDStateEnum.NORMAL;
        if (this.state == GDStateEnum.ACTIVATED)
            this.startStepGuide();
    };
    /**检查当前步骤条件 */
    GuideData.prototype.checkStepCondition = function (id) {
        var step = this.getCurStepData();
        if (step)
            return step.checkConditoin(id);
        return false;
    };
    /**执行步骤 */
    GuideData.prototype.doStepAction = function () {
        var step = this.getCurStepData();
        if (step) {
            step.doAction();
            this.nextStep();
        }
    };
    /**玩家等级 */
    GuideData.prototype.checkLevel = function () {
        return RoleData.level >= this.params[0];
    };
    /**当前任务检测 */
    GuideData.prototype.checkTask = function () {
        var data = MissionModel.getMainMissionData();
        if (!data)
            return false;
        var vo = MissionModel.getConditoinInfoById(data.taskId, data.conditionId);
        if (vo.conditionBaseId == this.params[0] && vo.state == this.params[1])
            return true;
        return false;
    };
    /**功能开放 */
    GuideData.prototype.checkFunc = function () {
        return FunctionModel.isFunctionOpen(this.params[0]);
    };
    /**建筑等级判断 */
    GuideData.prototype.checkBuild = function () {
        var info = MainMapModel.getBuildInfo(this.params[0]);
        if (info && info.level >= this.params[1])
            return true;
        return false;
    };
    /**引导开启 */
    GuideData.prototype.startStepGuide = function (index) {
        if (index === void 0) { index = 0; }
        //不等于默认值 引导已经启动
        if (this.stepDatas) {
            for (var i = 0; i < this.stepDatas.length; i++) {
                this.stepDatas[i].state = GDStateEnum.NORMAL;
            }
            return;
        }
        this.stepDatas = [];
        var list = GuideModel.getStepCfgsByGuideId(this.id);
        for (var i = 0; i < list.length; i++) {
            var data = new GuideStepData(list[i].id);
            this.stepDatas.push(data);
        }
        this.stepIndex = index;
    };
    /**设置下一步引导(guideView 关闭 由model设置) */
    GuideData.prototype.nextStep = function () {
        var index = this.stepIndex + 1;
        if (index >= this.stepDatas.length) {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_FINISH, this.id);
            return;
        }
        this.stepIndex = index;
    };
    /**获得当前引导配置 */
    GuideData.prototype.getCurStepData = function () {
        return this.stepDatas[this.stepIndex];
    };
    return GuideData;
}());
var GuideStepData = /** @class */ (function () {
    function GuideStepData(id) {
        this.id = id;
        this.init();
    }
    GuideStepData.prototype.onDestroy = function () {
    };
    GuideStepData.prototype.init = function () {
        var cfg = C.GuideStepConfig[this.id];
        this.state = GDStateEnum.NORMAL;
        this.stepCfg = cfg;
        this.condition = IGUIDECD[cfg.condition];
        this.param = cfg.param;
        var param = this.stepCfg.uiRoot == '' ? [] : JSON.parse(this.stepCfg.uiRoot);
        this.uiRoot = param.length == 0 ? { layer: 0, name: '' } : { layer: param[0], name: param[1] };
        this.uiPath = this.stepCfg.uiPath == '' ? [] : JSON.parse(this.stepCfg.uiPath);
    };
    /**条件判断 */
    GuideStepData.prototype.checkConditoin = function (id) {
        if (id != this.condition)
            return false;
        //因条件延迟判断 场景条件触发后 有弹窗面板 再次判断
        if (this.condition == IGUIDECD.SCENE || this.condition == IGUIDECD.MENU_OTHER || this.condition == IGUIDECD.MENU_HANG ||
            this.condition == IGUIDECD.MENU_CITY || this.condition == IGUIDECD.MENU_WORD || this.condition == IGUIDECD.MENU_BATTLE) {
            if (com_main.UpManager.hasPopView())
                return false;
        }
        //场景额外参数判断
        if (this.condition == IGUIDECD.SCENE) {
            var scene = SceneManager.getCurrScene();
            if (this.param == 0) {
                if (scene != SceneEnums.MAIN_CITY && scene != SceneEnums.WORLD_CITY && scene != SceneEnums.AUTO_BATTLE_MAP)
                    return false;
            }
            else {
                if (this.param != scene)
                    return false;
            }
        }
        if (this.condition == IGUIDECD.WAR_HANG_INIT || this.condition == IGUIDECD.WAR_GEN_INIT) {
            if (this.param == 0 || BattleModel.getBattleInfo().guideId == this.param) {
                return true;
            }
            return false;
        }
        return true;
    };
    /**行为执行 */
    GuideStepData.prototype.doAction = function () {
        if (this.state != GDStateEnum.NORMAL)
            return;
        this.state = GDStateEnum.FINISH;
        switch (this.stepCfg.actType) {
            case 1: {
                com_main.GuideMaskView.hide();
                Utils.open_view(TASK_UI.GUIDE_DIALOG_VIEW, this.stepCfg.actParam);
                break;
            }
            case 2: {
                com_main.GuideMaskView.hide();
                Utils.open_view(TASK_UI.GUIDE_TOUCH_VIEW, this);
                break;
            }
            case 3: {
                com_main.GuideMaskView.hide();
                this.doWarAction();
                break;
            }
            case 4: {
                com_main.GuideMaskView.hide();
                Utils.open_view(TASK_UI.GUIDE_DES_VIEW, this);
                break;
            }
            case 5: {
                //面板跳转
                FunctionModel.funcToPanel(this.stepCfg.actParam);
                Utils.open_view(TASK_UI.GUIDE_DELAY_MASK_VIEW, 500);
                break;
            }
            case 6: {
                //等待时间
                Utils.open_view(TASK_UI.GUIDE_DELAY_MASK_VIEW, this.stepCfg.actParam);
                break;
            }
            case 101: {
                //移动到新手资源点
                com_main.WorldView.getClass().moveGuideRes();
                SceneManager.sendGuideScene();
                break;
            }
            case 102: {
                //移动到主城池
                com_main.WorldView.getClass().moveGuideCity();
                SceneManager.sendGuideScene();
                break;
            }
            case 103: {
                //移动到未解锁城池
                com_main.WorldView.getClass().moveGuideLockedCity();
                SceneManager.sendGuideScene();
                break;
            }
            case 201: {
                //战斗录像继续
                FightResponseUtil.play(true);
                if (this.id == 9) {
                    window["ta"].track('novice_guide', { step: 10002 + "", 'trigger_time': new Date() });
                }
                else if (this.id == 11) {
                    window["ta"].track('novice_guide', { step: 10003 + "", 'trigger_time': new Date() });
                }
                else if (this.id == 13) {
                    window["ta"].track('novice_guide', { step: 10004 + "", 'trigger_time': new Date() });
                }
                break;
            }
            case 301: {
                //ui 阻止滚动
                com_main.GuideMaskView.show();
                break;
            }
            case 1001: {
                com_main.GuideMaskView.hide();
                com_main.CampNorView.doDragGuide();
                break;
            }
        }
    };
    /**战斗行为 */
    GuideStepData.prototype.doWarAction = function () {
        switch (this.stepCfg.actParam) {
            case 0: {
                SceneManager.sendGuideScene();
                break;
            }
            case 1: {
                com_main.EventMgr.dispatchEvent(BattleEvent.BATTLE_ENTER, 0);
                break;
            }
            case 2: {
                FightResponseUtil.showResultView();
                break;
            }
        }
    };
    return GuideStepData;
}());
