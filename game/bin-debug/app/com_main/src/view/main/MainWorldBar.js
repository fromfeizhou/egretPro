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
var com_main;
(function (com_main) {
    var MainWorldBar = /** @class */ (function (_super_1) {
        __extends(MainWorldBar, _super_1);
        function MainWorldBar() {
            var _this = _super_1.call(this) || this;
            _this.m_nTouchDt = 0; //点击计时
            _this.name = MainWorldBar.NAME;
            _this.initApp("top_new/MainWorldBarSkin.exml");
            return _this;
        }
        MainWorldBar.prototype.onDestroy = function () {
            this.removeEvent();
            this.clearBtnBossEffect();
            this.clearTimeOut();
            _super_1.prototype.onDestroy.call(this);
        };
        MainWorldBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.width = AGame.R.app.stageWidth;
            // this.height = AGame.R.app.stageHeight;
            Utils.toStageBestScaleHeigt(this);
            this.touchEnabled = false;
            this.initEvent();
            /**添加情报红点 */
            RedPointModel.AddInfoListener(this.m_pWarmBtn, { x: 31, y: 3, scale: 0.5 }, [RedEvtType.WARN], 2);
            RedPointModel.AddInfoListener(this.m_pArmyBtn, { x: 31, y: 3, scale: 0.5 }, [RedEvtType.EXPLOIT], 2);
            RedPointModel.AddInfoListener(this.m_pMiniBtn, { x: 31, y: 3, scale: 0.5 }, [RedEvtType.WORLD_CITY_BUILD], 2);
            RedPointModel.AddInfoListener(this.btn_rank, { x: 60, y: 0, scale: 0.78 }, [RedEvtType.PLAYER_BATTLE_REWARD], 2);
            this.m_teamView.initData(1 /* WORLD */);
            if (GameConfig.getIsNotchScreen()) {
                this.m_teamView.left += GameConfig.notchPixel;
                this.m_menuGroup.right += GameConfig.notchPixel;
                this.m_worldMinMap.right += GameConfig.notchPixel;
            }
            /**检查新手引导面板条件 */
            this.onGuideCondition();
            this.refrehTask();
            this.initCity();
            this.createBtnBossEffect();
            this.refreshSceneView();
        };
        MainWorldBar.prototype.startTick = function () {
            var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            this.m_nTimeOut = vo.openDate - TimerUtils.getServerTimeMill();
            this.m_nStopOut = vo.closeDate - TimerUtils.getServerTimeMill();
            this.refreshTileLab();
            if (!this.m_bOnTick) {
                this.m_bOnTick = true;
                Utils.TimerManager.doTimer(1000, 0, this.onTickHandler, this);
            }
        };
        MainWorldBar.prototype.refreshTileLab = function () {
            if (this.m_nTimeOut > 0) {
                this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_BATTLE_LEFT, Utils.DateUtils.getFormatTime(this.m_nTimeOut)));
            }
            else if (this.m_nStopOut > 0) {
                this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_CAPTURE_LEFT, Utils.DateUtils.getFormatTime(this.m_nStopOut)));
            }
            else {
                this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_CAPTURE_LEFT, Utils.DateUtils.getFormatTime(0)));
            }
        };
        MainWorldBar.prototype.onTickHandler = function () {
            // let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
            this.m_nTimeOut -= 1000;
            this.m_nStopOut -= 1000;
            if (this.m_nStopOut <= 0) {
                this.clearTimeOut();
                SceneManager.runSceneBefore();
                return;
            }
            this.refreshTileLab();
        };
        MainWorldBar.prototype.clearTimeOut = function () {
            this.m_bOnTick = false;
            Utils.TimerManager.remove(this.onTickHandler, this);
        };
        /**刷新任务进度 */
        MainWorldBar.prototype.refrehTask = function () {
            var condition = MissionModel.getCountryTask();
            if (condition) {
                var cfg = C.TaskConditionConfig[condition.conditionBaseId];
                if (cfg) {
                    this.m_labTaskName.text = cfg.title;
                    if (condition.state == TaskStatus.REWARD) {
                        this.m_labTaskPro.text = '凌晨5点重置';
                    }
                    else if (condition.state == TaskStatus.FINISH) {
                        // this.m_labTaskPro.visible = false;
                        this.m_labTaskPro.text = "点击领奖"; //读语言包==
                    }
                    else {
                        // this.m_labTaskPro.visible = true;
                        this.m_labTaskPro.text = condition.count + "/" + condition.maxCount;
                    }
                    return;
                }
            }
            this.m_pTaskRoot.visible = false;
        };
        /**初始化城池数 */
        MainWorldBar.prototype.initCity = function () {
            this.m_comStateWei.stateId = CountryType.WEI;
            this.m_comStateShu.stateId = CountryType.SHU;
            this.m_comStateWu.stateId = CountryType.WU;
            this.refreshCity();
        };
        /**刷新城池数 */
        MainWorldBar.prototype.refreshCity = function () {
            this.m_labNumWei.text = WorldModel.getCountryCount(CountryType.WEI) + '';
            this.m_labNumShu.text = WorldModel.getCountryCount(CountryType.SHU) + '';
            this.m_labNumWu.text = WorldModel.getCountryCount(CountryType.WU) + '';
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MainWorldBar.prototype.initEvent = function () {
            //搜索
            com_main.EventManager.addTouchScaleListener(this.m_pSearchBtn, this, function (e) {
                Utils.open_view(TASK_UI.POP_WORLD_SEARCH_VIEW);
            });
            //小地图
            com_main.EventManager.addTouchScaleListener(this.m_pMiniBtn, this, function (e) {
                // FunctionModel.openFunctionByType(FunctionType.MINIMAP);
                Utils.open_view(TASK_UI.POP_WORLD_CITY_BUILD_INFO);
            });
            //调兵
            com_main.EventManager.addTouchScaleListener(this.m_pArmyBtn, this, function (e) {
                Utils.open_view(TASK_UI.POP_WORLD_MAIN_EXPLOIT_WND);
            });
            /**情报 */
            com_main.EventManager.addTouchScaleListener(this.m_pWarmBtn, this, this.onWarnBtnClick);
            com_main.EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onBack);
            /**任务点击 */
            com_main.EventManager.addTouchTapListener(this.m_pTaskRoot, this, this.awardCountryTask);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onUpdateMissionInfo, this);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);
            com_main.EventManager.addTouchScaleListener(this.btn_battleInfo, this, this.onClickBattleInfo);
            com_main.EventManager.addTouchScaleListener(this.btn_rank, this, this.onClickRankBtn);
            /**城池刷新 */
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_UPDATE, this.refreshCity, this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnHelp, this, this.onclickInfo);
            /**点击计时 */
            com_main.EventMgr.addEvent(TASK_EVT.GLOBAL_TOUCH_END, this.onGlobalTouchEnd, this);
            Utils.TimerManager.doTimer(10000, 0, this.onTimeTick, this);
            com_main.EventMgr.addEvent(SceneEvent.CHANGE_COMPLETE, this.onChangeScene, this);
        };
        //点击规则说明
        MainWorldBar.prototype.onclickInfo = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.XIANGYANG_DES), title: GCode(CLEnum.XIANGYANG_TITLE) });
        };
        MainWorldBar.prototype.onClickRankBtn = function () {
            AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW(2);
            // Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_RANK);
        };
        MainWorldBar.prototype.onClickBattleInfo = function () {
            Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_DETAILS);
        };
        MainWorldBar.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.GLOBAL_TOUCH_END, this);
            com_main.EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
            Utils.TimerManager.remove(this.onTimeTick, this);
        };
        /**场景状态改变 */
        MainWorldBar.prototype.onChangeScene = function () {
            this.refreshSceneView();
        };
        /**场景状态改变 */
        MainWorldBar.prototype.refreshSceneView = function () {
            this.visible = true;
            switch (SceneManager.getCurrScene()) {
                case SceneEnums.WORLD_XIANGYANG_CITY: {
                    this.currentState = 'xiangyang';
                    this.clearTimeOut();
                    this.startTick();
                    break;
                }
                case SceneEnums.WORLD_CITY: {
                    this.currentState = 'normal';
                    this.clearTimeOut();
                    break;
                }
                default: {
                    this.visible = false;
                    this.clearTimeOut();
                    break;
                }
            }
        };
        /**任务领奖 */
        MainWorldBar.prototype.awardCountryTask = function () {
            var condition = MissionModel.getCountryTask();
            if (!condition)
                return;
            var cfg = C.TaskConditionConfig[condition.conditionBaseId];
            if (!cfg)
                return;
            if (condition.state == TaskStatus.FINISH) {
                MissionProxy.send_MISSION_REWARD(cfg.taskId, condition.conditionBaseId);
            }
            else {
                if (cfg.turnPanel > 0)
                    FunctionModel.funcToPanel(cfg.turnPanel);
            }
        };
        /**任务更新 */
        MainWorldBar.prototype.onUpdateMissionInfo = function (data) {
            if (data.type != TaskType.Country && data.type != TaskType.CountryRepeat)
                return;
            this.refrehTask();
        };
        /**定时器 */
        MainWorldBar.prototype.onTimeTick = function () {
            if (!FunctionModel.isFunctionOpen(FunctionType.PATROL_TURN))
                return;
            this.m_nTouchDt += 10;
            if (this.m_nTouchDt >= NormalModel.HANG_SCENE_TIME)
                SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
        };
        /**点击回调 */
        MainWorldBar.prototype.onGlobalTouchEnd = function () {
            this.m_nTouchDt = 0;
        };
        MainWorldBar.prototype.onBack = function (pvt) {
            com_main.UpManager.history();
            SceneManager.runSceneBefore();
        };
        /**点击情报按钮*/
        MainWorldBar.prototype.onWarnBtnClick = function (pvt) {
            Utils.open_view(TASK_UI.POP_WORLD_BATTLE_VIEW);
            WorldProxy.C2S_WORLDMAP_INFORMATION(RoleData.countryId);
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**设置boss按钮特效 */
        MainWorldBar.prototype.createBtnBossEffect = function () {
            if (this.m_taskEff)
                return;
            this.m_taskEff = new MCDragonBones();
            this.m_taskEff.initAsync(IETypes.EUI_TASK_EFF);
            this.m_taskEff.play(IETypes.EUI_TASK_EFF);
            this.m_pEffRoot.addChild(this.m_taskEff);
        };
        MainWorldBar.prototype.clearBtnBossEffect = function () {
            if (this.m_taskEff) {
                this.m_taskEff.destroy();
                this.m_taskEff = null;
            }
        };
        /**检查新手引导面板条件 */
        MainWorldBar.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_WORD);
        };
        MainWorldBar.NAME = 'MainWorldBar';
        return MainWorldBar;
    }(com_main.CView));
    com_main.MainWorldBar = MainWorldBar;
})(com_main || (com_main = {}));
