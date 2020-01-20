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
    /** 章节左右移动时间 */
    var MoveStageTime = 100;
    var HistoryBattles = /** @class */ (function (_super_1) {
        __extends(HistoryBattles, _super_1);
        function HistoryBattles() {
            var _this = _super_1.call(this) || this;
            /** 当前正在移动 */
            _this.m_isMoveing = false;
            _this.name = HistoryBattles.NAME;
            _this.initApp("HistoryBattle/HistoryBattlesSkin.exml");
            return _this;
        }
        HistoryBattles.prototype.onDestroy = function () {
            if (this.m_RewardBar) {
                this.m_RewardBar.onDestroy();
                this.m_RewardBar = null;
            }
            com_main.EventMgr.removeEventByObject(HistoryWarEvent.HISTORY_UPDATE_NUM, this); //更新次數
            com_main.EventMgr.removeEventByObject(NormalEvent.NORMAL_FUN_COUNT, this);
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.HISTORY_BATTLE]);
        };
        HistoryBattles.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection();
            // this.m_Group.anchorOffsetX = AGame.R.app.stageWidth;
            com_main.EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onBtn_Back);
            com_main.EventManager.addTouchScaleListener(this.m_BtnPrev, this, this.onBtn_Prev);
            com_main.EventManager.addTouchScaleListener(this.m_BtnNext, this, this.onBtn_Next);
            com_main.EventMgr.addEvent(HistoryWarEvent.HISTORY_UPDATE_NUM, this.numUpdate, this); //更新次數
            com_main.EventMgr.addEvent(NormalEvent.NORMAL_FUN_COUNT, this.onFunCount, this);
            // this.setCollection();
            this.initData();
            this.Refresh();
            this.toFixChapter();
            Utils.toStageBestScale(this.m_RewardBar);
            this.onGuideCondition();
            HeadQuartersModel.resetFightRecord();
        };
        /**適配關卡 */
        HistoryBattles.prototype.toFixChapter = function () {
            var width = egret.MainContext.instance.stage.stageWidth;
            if (width < CONTENT_WIDTH) {
                Utils.toStageBestScale(this.m_Group);
                return;
            }
            for (var i = 0; i < this.m_Group.numChildren; i++) {
                var view = this.m_Group.getChildAt(i);
                view.width = width;
                view.x = -width + (i * width);
            }
        };
        HistoryBattles.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_GET_HISTORY_WAR_INFO,
                ProtoDef.S2C_HISTORY_WAR_CLEAN_UP,
                ProtoDef.S2C_HISTORY_WAR_GET_BOX,
            ];
        };
        HistoryBattles.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_GET_HISTORY_WAR_INFO: {
                    this.m_RewardBar.Refresh_BoxState();
                    break;
                }
                case ProtoDef.S2C_HISTORY_WAR_CLEAN_UP: {
                    this.m_RewardBar.Refresh_ChallengeCount();
                    break;
                }
                case ProtoDef.S2C_HISTORY_WAR_GET_BOX: {
                    var VO = body;
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
                    this.m_RewardBar.initBoxItem();
                    this.m_RewardBar.Refresh_BoxState();
                    break;
                }
                // case ProtoDef.S2C_SYS_FUNCOUNT: {
                // 	let VO = body as gameProto.S2C_SYS_FUNCOUNT;
                // 	this.m_RewardBar.Refresh_ChallengeCount();
                // 	break;
                // }
            }
        };
        /**初始化默认状态 */
        HistoryBattles.prototype.initData = function () {
            this.m_nId = HistoryBattleModel.getDefCopyId();
            var cfg = C.HistoryWarConfig[this.m_nId];
            this.m_nChapterId = cfg.chapterId;
        };
        /** 按钮 - 返回 */
        HistoryBattles.prototype.onBtn_Back = function () {
            com_main.UpManager.history();
        };
        /** 按钮 - 上一个章节 */
        HistoryBattles.prototype.onBtn_Prev = function () {
            if (!this.m_isMoveing) {
                this.m_nChapterId--;
                // HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
                this.moveTo(false);
            }
        };
        /** 按钮 - 下一个章节 */
        HistoryBattles.prototype.onBtn_Next = function () {
            if (!this.m_isMoveing) {
                this.m_nChapterId++;
                // HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
                this.moveTo();
            }
        };
        /**更新次數 */
        HistoryBattles.prototype.numUpdate = function () {
            this.m_RewardBar.Refresh_ChallengeCount();
        };
        /**功能次数变动 */
        HistoryBattles.prototype.onFunCount = function (id) {
            if (id != IFunCountEnum.HISTORY_WAR_COUNT)
                return;
            this.m_RewardBar.Refresh_ChallengeCount();
        };
        /**移動 */
        HistoryBattles.prototype.moveTo = function (actDir) {
            if (actDir === void 0) { actDir = true; }
            this.m_isMoveing = true;
            for (var i = 0; i < this.m_Group.numChildren; i++) {
                var target = this.m_Group.getChildAt(i);
                var tw = egret.Tween.get(target);
                var tx = target.x;
                if (actDir)
                    tx -= target.width;
                else
                    tx += target.width;
                tw.to({ x: tx }, MoveStageTime);
                if (i == 0)
                    tw.call(this.onMoveStageFinish, this, [actDir]);
            }
            this.refreshViewVisivle(true);
        };
        /** 回调 - 章节移动完成 */
        HistoryBattles.prototype.onMoveStageFinish = function (actDir) {
            if (actDir) {
                var view = this.m_Group.getChildAt(0);
                view.x = view.width;
                view.setChapterInfo(this.m_nChapterId + 1, this.m_nId);
                this.m_Group.addChildAt(view, 2);
            }
            else {
                var view = this.m_Group.getChildAt(2);
                view.x = -view.width;
                view.setChapterInfo(this.m_nChapterId - 1, this.m_nId);
                this.m_Group.addChildAt(view, 0);
            }
            this.Refresh();
            this.refreshViewVisivle();
            this.m_isMoveing = false;
        };
        HistoryBattles.prototype.refreshViewVisivle = function (isShow) {
            if (isShow === void 0) { isShow = false; }
            for (var i = 0; i < this.m_Group.numChildren; i++) {
                var view = this.m_Group.getChildAt(i);
                if (i == 1) {
                    view.visible = true;
                }
                else {
                    view.visible = isShow;
                }
            }
        };
        /** 界面刷新 */
        HistoryBattles.prototype.Refresh = function () {
            if (this.m_nChapterId > 0) {
                this.Refresh_Title();
                this.setCurChpater();
                this.Refresh_BtnVisible();
                this.m_RewardBar.SetChapterId(this.m_nChapterId);
                this.m_RewardBar.Refresh_BoxState();
            }
            this.refreshViewVisivle();
        };
        /** 刷新 - 当前章节标题 */
        HistoryBattles.prototype.Refresh_Title = function () {
            var nameCfg = C.HistoryWarChapterNameConfig[this.m_nChapterId];
            this.m_Title.textFlow = nameCfg ? Utils.htmlParser(GLan(nameCfg.chapterName)) : [];
        };
        /**設置當前章節 */
        HistoryBattles.prototype.setCurChpater = function () {
            for (var i = 0; i < this.m_Group.numChildren; i++) {
                var view = this.m_Group.getChildAt(i);
                if (i == 0)
                    view.setChapterInfo(this.m_nChapterId - 1, this.m_nId);
                else if (i == 1) {
                    view.setChapterInfo(this.m_nChapterId, this.m_nId);
                }
                else
                    view.setChapterInfo(this.m_nChapterId + 1, this.m_nId);
            }
        };
        /** 刷新 - 上下章节按钮状态 */
        HistoryBattles.prototype.Refresh_BtnVisible = function () {
            this.m_BtnPrev.visible = (HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId - 1) && HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId - 1).length > 0) ? true : false;
            this.m_BtnNext.visible = (HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId + 1) && HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId + 1).length > 0) ? true : false;
        };
        /**检查新手引导面板条件 */
        HistoryBattles.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.QUARTER_WND);
        };
        HistoryBattles.NAME = 'HistoryBattles';
        return HistoryBattles;
    }(com_main.CView));
    com_main.HistoryBattles = HistoryBattles;
})(com_main || (com_main = {}));
