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
    var HeadQuarters = /** @class */ (function (_super_1) {
        __extends(HeadQuarters, _super_1);
        function HeadQuarters(param) {
            var _this = _super_1.call(this) || this;
            /** 当前正在移动 */
            _this.m_isMoveing = false;
            _this.name = HeadQuarters.NAME;
            _this.m_tParam = param;
            _this.initApp("headquarters/HeadQuartersSkin.exml");
            return _this;
        }
        HeadQuarters.prototype.onDestroy = function () {
            if (this.m_RewardBar) {
                this.m_RewardBar.onDestroy();
                this.m_RewardBar = null;
            }
            com_main.EventMgr.removeEventByObject(QuarterEvent.QUARTER_UPDATE_NUM, this); //更新次數
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.QUARTERS_UI]);
        };
        HeadQuarters.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_tabBtn.dataProvider = this.m_tCollection;
            this.m_tabBtn.itemRenderer = TabBtnRender;
            this.m_tabBtn.addEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);
            com_main.EventMgr.addEvent(QuarterEvent.QUARTER_UPDATE_NUM, this.numUpdate, this); //更新次數
            //复用 显示对象关闭 使数据位置与ui位置一致 外部访问ui使用
            this.m_tabBtn.useVirtualLayout = false;
            // this.m_Group.anchorOffsetX = AGame.R.app.stageWidth;
            com_main.EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onBtn_Back);
            com_main.EventManager.addTouchScaleListener(this.m_BtnPrev, this, this.onBtn_Prev);
            com_main.EventManager.addTouchScaleListener(this.m_BtnNext, this, this.onBtn_Next);
            this.setCollection();
            this.initData();
            this.Refresh();
            this.toFixChapter();
            Utils.toStageBestScale(this.m_RewardBar);
            this.onGuideCondition();
            HeadQuartersModel.resetFightRecord();
        };
        /**適配關卡 */
        HeadQuarters.prototype.toFixChapter = function () {
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
        /**初始化按钮 */
        HeadQuarters.prototype.setCollection = function () {
            var heroArr = [];
            if (this.m_tParam) {
                HeadQuartersModel.LastLevel = this.m_tParam.copyType ? this.m_tParam.copyType : null;
            }
            for (var i = 0; i < 2; i++) {
                var sel = void 0;
                var name_1 = void 0;
                if (i == 0) {
                    name_1 = GCode(CLEnum.NORMAL);
                    sel = isNull(HeadQuartersModel.LastLevel) || HeadQuartersModel.LastLevel == IQuarLevel.NORMAL ? true : false;
                }
                else if (i == 1) {
                    name_1 = GCode(CLEnum.HARD);
                    sel = HeadQuartersModel.LastLevel == IQuarLevel.HARD ? true : false;
                }
                var data = { sel: sel, type: i, name: name_1 };
                heroArr.push(data);
            }
            this.m_tCollection.replaceAll(heroArr);
        };
        HeadQuarters.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.HQ_GET_INFO,
                ProtoDef.HQ_CLEAN_UP,
                ProtoDef.HQ_CHALLENGES,
                ProtoDef.HQ_RECEIVE_BOX,
                ProtoDef.HQ_BUY_RESET_COUNT,
            ];
        };
        HeadQuarters.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.HQ_GET_INFO: {
                    this.m_RewardBar.Refresh_BoxState();
                    break;
                }
                case ProtoDef.HQ_CLEAN_UP: {
                    this.m_RewardBar.Refresh_ChallengeCount();
                    break;
                }
                case ProtoDef.HQ_CHALLENGES: {
                    this.m_RewardBar.Refresh_ChallengeCount();
                    break;
                }
                case ProtoDef.HQ_RECEIVE_BOX: {
                    var VO = body;
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
                    this.m_RewardBar.initBoxItem();
                    this.m_RewardBar.Refresh_BoxState();
                    break;
                }
                case ProtoDef.HQ_BUY_RESET_COUNT: {
                    this.m_RewardBar.Refresh_ChallengeCount();
                    break;
                }
                case ProtoDef.HQ_CHAPTER_INFO: { //切換章節返回
                    this.m_RewardBar.Refresh_BoxState();
                    break;
                }
            }
        };
        /**设置切卡回调 */
        HeadQuarters.prototype.onTabBtnClick = function (e) {
            Sound.playTap();
            var selectedIndex = e.currentTarget.selectedIndex;
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var info = this.m_tCollection.getItemAt(i);
                info.sel = i == selectedIndex;
                this.m_tCollection.replaceItemAt(info, i);
            }
            this.m_nLevel = selectedIndex > 0 ? IQuarLevel.HARD : IQuarLevel.NORMAL;
            HeadQuartersModel.LastLevel = this.m_nLevel;
            this.initData();
            this.Refresh();
        };
        /**初始化默认状态 */
        HeadQuarters.prototype.initData = function () {
            if (this.m_tParam) {
                if (this.m_tParam.copyId != 0) {
                    this.m_nId = this.m_tParam.copyId;
                    this.m_tParam = null;
                }
                else { //跳转表copyId为0，跳转到指定难度副本copyType为副本难度
                    this.m_nId = HeadQuartersModel.getCheckpointId(HeadQuartersModel.LastLevel);
                }
            }
            else {
                this.m_nId = HeadQuartersModel.getCheckpointId(HeadQuartersModel.LastLevel);
            }
            var cfg = C.ChapterConfig[this.m_nId];
            this.m_nChapterId = cfg.chapterId;
            this.m_nLevel = C.ChapterConfig[this.m_nId].difficultyType;
        };
        /** 按钮 - 返回 */
        HeadQuarters.prototype.onBtn_Back = function () {
            com_main.UpManager.history();
        };
        /** 按钮 - 上一个章节 */
        HeadQuarters.prototype.onBtn_Prev = function () {
            if (!this.m_isMoveing) {
                this.m_nChapterId--;
                HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
                this.moveTo(false);
            }
        };
        /** 按钮 - 下一个章节 */
        HeadQuarters.prototype.onBtn_Next = function () {
            if (!this.m_isMoveing) {
                this.m_nChapterId++;
                HeadQuartersProxy.HQ_CHAPTER_INFO(this.m_nChapterId);
                this.moveTo();
            }
        };
        /**更新次數 */
        HeadQuarters.prototype.numUpdate = function () {
            this.m_RewardBar.Refresh_ChallengeCount();
        };
        /**移動 */
        HeadQuarters.prototype.moveTo = function (actDir) {
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
        HeadQuarters.prototype.onMoveStageFinish = function (actDir) {
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
        HeadQuarters.prototype.refreshViewVisivle = function (isShow) {
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
        HeadQuarters.prototype.Refresh = function () {
            if (this.m_nChapterId > 0) {
                this.Refresh_Title(this.m_nLevel);
                this.setCurChpater();
                this.Refresh_BtnVisible();
                this.m_RewardBar.SetChapterId(this.m_nChapterId, this.m_nLevel);
                this.m_RewardBar.Refresh_BoxState();
            }
            this.refreshViewVisivle();
        };
        /** 刷新 - 当前章节标题 */
        HeadQuarters.prototype.Refresh_Title = function (level) {
            var nor = "<font color = #abb7d1>\u3010" + GCode(CLEnum.NORMAL) + "\u3011</font>" + GLan(C.ChapterIdConfig[this.m_nChapterId].chapterName);
            var hd = "<font color = #ff0000>\u3010" + GCode(CLEnum.HARD) + "\u3011</font>" + GLan(C.ChapterIdConfig[this.m_nChapterId].chapterName);
            var nameTitle = level == IQuarLevel.NORMAL && C.ChapterIdConfig[this.m_nChapterId] ? nor : hd;
            this.m_Title.textFlow = C.ChapterIdConfig[this.m_nChapterId] ? Utils.htmlParser(nameTitle) : []; //HeadQuartersModel.ChapterCfgGroup[this.m_nChapterId][0].title;
        };
        /**設置當前章節 */
        HeadQuarters.prototype.setCurChpater = function () {
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
        HeadQuarters.prototype.Refresh_BtnVisible = function () {
            this.m_BtnPrev.visible = (HeadQuartersModel.getChapterCfgs(this.m_nChapterId - 1) && HeadQuartersModel.getChapterCfgs(this.m_nChapterId - 1).length > 0) ? true : false;
            this.m_BtnNext.visible = (HeadQuartersModel.getChapterCfgs(this.m_nChapterId + 1) && HeadQuartersModel.getChapterCfgs(this.m_nChapterId + 1).length > 0) ? true : false;
        };
        /**检查新手引导面板条件 */
        HeadQuarters.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.QUARTER_WND);
        };
        HeadQuarters.NAME = 'HeadQuarters';
        return HeadQuarters;
    }(com_main.CView));
    com_main.HeadQuarters = HeadQuarters;
    var TabBtnRender = /** @class */ (function (_super_1) {
        __extends(TabBtnRender, _super_1);
        function TabBtnRender() {
            return _super_1.call(this) || this;
        }
        TabBtnRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TabBtnRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (this.m_tData.sel) {
                this.m_imgBg.source = this.m_tData.type == 0 ? 'btn_118_png' : 'btn_117_png';
            }
            else {
                this.m_imgBg.source = 'btn_106_png';
            }
            this.m_labTitle.text = this.m_tData.name;
        };
        return TabBtnRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
