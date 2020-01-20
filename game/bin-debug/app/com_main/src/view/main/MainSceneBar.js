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
    var MainSceneBar = /** @class */ (function (_super_1) {
        __extends(MainSceneBar, _super_1);
        function MainSceneBar() {
            var _this = _super_1.call(this) || this;
            _this.m_nTouchDt = 0; //点击计时
            _this.name = MainSceneBar.NAME;
            _this.initApp("top_new/MainSceneBarSkin.exml");
            return _this;
        }
        MainSceneBar.prototype.onDestroy = function () {
            this.destroyBuildQueue();
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        MainSceneBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.width = AGame.R.app.stageWidth;
            // this.height = AGame.R.app.stageHeight;
            Utils.toStageBestScaleHeigt(this);
            this.touchEnabled = false;
            this.initBulidQueueCell();
            this.m_btnBuildAll.setTitleLabel(GCode(CLEnum.CITY_BD_ALL));
            this.m_btnLevyAll.setTitleLabel(GCode(CLEnum.CITY_BD_REC_ALL));
            this.initEvent();
            if (GameConfig.getIsNotchScreen()) {
                this.m_group.left += GameConfig.notchPixel;
            }
            /**检查新手引导面板条件 */
            this.onGuideCondition();
            this.m_btnBuildAll.visible = !platform.isHidePayFunc();
        };
        /**初始化建造队列 */
        MainSceneBar.prototype.initBulidQueueCell = function () {
            for (var i = 0; i < 2; i++) {
                this["m_buildQueue_" + i].index = i;
            }
        };
        MainSceneBar.prototype.destroyBuildQueue = function () {
            for (var i = 0; i < 2; i++) {
                this["m_buildQueue_" + i].onDestroy();
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MainSceneBar.prototype.speedToBuild = function (id) {
            var buildVo = MainMapModel.getBuildInfo(id);
            var time = buildVo.getBuildLeftTime();
            if (time > 0) {
                if (PropModel.isItemEnough(PropEnum.GOLD, Utils.TimeGold(time), 1)) {
                    MainMapProxy.send_BUILDING_SPEED(id, 0, 0);
                }
            }
        };
        MainSceneBar.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnLevyAll, this, function () {
                com_main.MainMap.autoLevy();
            });
            com_main.EventManager.addTouchScaleListener(this.m_btnBuildAll, this, this.onClickBuildAll);
            com_main.EventMgr.addEvent(TASK_EVT.GLOBAL_TOUCH_END, this.onGlobalTouchEnd, this);
            Utils.TimerManager.doTimer(10000, 0, this.onTimeTick, this);
        };
        MainSceneBar.prototype.onClickBuildAll = function () {
            var _this = this;
            if (!VipModel.hasPrivillege(VipPrivillType.BUILDING_FAST)) {
                EffectUtils.showTips(GCode(CLEnum.CITY_BD_ALL_FAL));
                return;
            }
            if (MainMapModel.isMaxQueue()) {
                var speedBuildid_1 = 0;
                this.m_buildQueue_0.getBuildLevel() < this.m_buildQueue_1.getBuildLevel() ? speedBuildid_1 = this.m_buildQueue_0.getBuildId() : speedBuildid_1 = this.m_buildQueue_1.getBuildId();
                if (MainMapModel.getBuildingFinishGlod(speedBuildid_1) == 0) {
                    return;
                }
                var content = GCodeFromat(CLEnum.CITY_BD_SPEED, MainMapModel.getBuildingFinishGlod(speedBuildid_1));
                Utils.showConfirmPop(content, function () {
                    _this.speedToBuild(speedBuildid_1);
                }, this, "style4", LocalModel.DAY_NOTICE_AUTO_BUILD);
                return;
            }
            var id = 0;
            var cellIndex = 0;
            for (var i = 0; i < 2; i++) {
                var cell = this["m_buildQueue_" + i];
                if (cell.getBuildId() == -1) {
                    id = cell.autoLevelUp();
                    cellIndex = i;
                    break;
                }
            }
            //主城升级中，其他不能升级，加速主城升级
            if (!id) {
                var index = Number(!cellIndex);
                var cell_1 = this["m_buildQueue_" + index];
                if (cell_1.getBuildId() > 0) {
                    var content = GCodeFromat(CLEnum.CITY_BD_SPEED, MainMapModel.getBuildingFinishGlod(cell_1.getBuildId()));
                    Utils.showConfirmPop(content, function () {
                        _this.speedToBuild(cell_1.getBuildId());
                    }, this, "style4", LocalModel.DAY_NOTICE_AUTO_BUILD);
                    // this.speedToBuild(cell.getBuildId());
                }
                else { //没有满足升级条件的
                    var bid = MainMapModel.getBuildIdByCondition();
                    com_main.MainMap.moveToBuildAndOpen(bid);
                }
            }
        };
        MainSceneBar.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TASK_EVT.GLOBAL_TOUCH_END, this);
            Utils.TimerManager.remove(this.onTimeTick, this);
        };
        /**定时器 */
        MainSceneBar.prototype.onTimeTick = function () {
            if (!FunctionModel.isFunctionOpen(FunctionType.PATROL_TURN))
                return;
            this.m_nTouchDt += 10;
            if (this.m_nTouchDt >= NormalModel.HANG_SCENE_TIME)
                SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
        };
        /**点击回调 */
        MainSceneBar.prototype.onGlobalTouchEnd = function () {
            this.m_nTouchDt = 0;
            // this.onClickBuildAll();
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**检查新手引导面板条件 */
        MainSceneBar.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_CITY);
        };
        MainSceneBar.NAME = 'MainSceneBar';
        return MainSceneBar;
    }(com_main.CView));
    com_main.MainSceneBar = MainSceneBar;
})(com_main || (com_main = {}));
