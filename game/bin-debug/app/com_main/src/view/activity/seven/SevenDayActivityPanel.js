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
    /**
     * 七日活动主界面
     */
    var SevenDayActivityPanel = /** @class */ (function (_super_1) {
        __extends(SevenDayActivityPanel, _super_1);
        function SevenDayActivityPanel() {
            var _this = _super_1.call(this) || this;
            _this.m_tViews = [];
            _this.m_curIndex = 0;
            _this.m_dayActiviListMap = {};
            _this.oldIndex = 0;
            _this.name = SevenDayActivityPanel.NAME;
            _this.initApp("activity/seven/SevenDayActivityPanelSkin.exml");
            return _this;
        }
        SevenDayActivityPanel.prototype.onDestroy = function () {
            this.m_tViews = null;
            Utils.TimerManager.remove(this.updateDownTime, this);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.SEV_DAY_UI]);
        };
        SevenDayActivityPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_comTabTopGroup.cacheAsBitmap = true;
            this.m_comTabTopGroup.cacheAsBitmap = true;
            this.activiVo = ActivityModel.getActivityVo(AcViewType.OPEN_SEVEN);
            if (!this.activiVo)
                return;
            this.refreshData();
            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY1)] = { tag: 0 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY2)] = { tag: 1 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY3)] = { tag: 2 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY4)] = { tag: 3 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY5)] = { tag: 4 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY6)] = { tag: 5 };
            this.m_tabData[GCode(CLEnum.AC_SEVEN_DAY7)] = { tag: 6 };
            var curtime = TimerUtils.getServerTimeMill();
            this.subDay = Math.ceil((curtime - this.activiVo.openDate) / 86400000);
            this.subDay = this.subDay > 7 ? 1 : this.subDay;
            this.refreshTabBtns();
            this.updateTopData(this.subDay);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabTopGroup.setChangeCallback(this.changeTopTag, this);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            var activityView = new com_main.SevenDayActivityView(width, height, this.subDay);
            this.m_tabViewStack.addChild(activityView);
            this.m_tViews.push(activityView);
            this.validateNow();
            this.m_curIndex = this.subDay - 1;
            this.initView(this.m_curIndex);
            this.initTopView(0);
            this.initEvent();
            // this.changeTag(th)
            /**一分鐘執行一次 */
            this.updateDownTime();
            Utils.TimerManager.doTimer(10000, 0, this.updateDownTime, this);
        };
        SevenDayActivityPanel.prototype.updateDownTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.activiVo.closeDate)
                return;
            var str = Utils.DateUtils.getCountdownStrByCfg(this.activiVo.closeDate - curtime, 1);
            this.m_downTime.text = str;
        };
        /**构建七日目标的基础数据 */
        SevenDayActivityPanel.prototype.refreshData = function () {
            var taskDatas = this.activiVo.taskInfoDic;
            var infos = [];
            for (var key in taskDatas) {
                if (taskDatas[key])
                    infos.push(taskDatas[key]);
            }
            infos.sort(this.sortByState);
            this.m_dayActiviListMap = {};
            this.m_dayActiveNameMap = {};
            if (infos) {
                for (var i = 0; i < infos.length; i++) {
                    var infoVo = infos[i];
                    var activityArr = this.m_dayActiviListMap[infoVo.cfg.rewardDay];
                    if (!activityArr) {
                        this.m_dayActiviListMap[infoVo.cfg.rewardDay] = [];
                        this.m_dayActiveNameMap[infoVo.cfg.rewardDay] = [];
                    }
                    this.m_dayActiviListMap[infoVo.cfg.rewardDay].push(infoVo);
                    this.m_dayActiveNameMap[infoVo.cfg.rewardDay].push(infoVo.cfg.title);
                }
            }
        };
        /**排序 */
        SevenDayActivityPanel.prototype.sortByState = function (a, b) {
            return a.taskId - b.taskId;
        };
        /**
         * 构建顶部导航栏
         */
        SevenDayActivityPanel.prototype.updateTopData = function (day) {
            if (this.m_dayActiveNameMap == {})
                return;
            var activiNameList = this.m_dayActiveNameMap[day];
            if (isNull(activiNameList)) {
                EffectUtils.showTips(GCode(CLEnum.FUNC_UNOPEN), 1, true);
                return;
            }
            this.m_topData = {};
            var activityList = this.m_dayActiviListMap[day];
            if (!activityList)
                return;
            for (var index = 0; index < activityList.length; index++) {
                var activiItem = activityList[index];
                this.m_topData["" + activiItem.cfg.title] = { tag: index, id: activiItem.taskId };
            }
            this.m_comTabTopGroup.clearTabBtn();
            var tagTops = activiNameList.slice(0, activiNameList.length);
            this.m_comTabTopGroup.initNorTabBtns(tagTops);
            this.changeTopTag(0);
            for (var i = 0; i < tagTops.length; i++) {
                RedPointModel.AddInfoListener(this.m_comTabTopGroup.getTabBtnByName(tagTops[i]), { x: 95, y: -3, scale: 0.9 }, [RedEvtType.OPEN_SEVEN], 2, { dayTaskId: activityList[i].taskId });
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        SevenDayActivityPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_btn_close, this, function () {
                com_main.UpManager.history();
            });
        };
        SevenDayActivityPanel.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        SevenDayActivityPanel.prototype.changeTag = function (selIndex) {
            // let activiNameList: string[] = this.m_dayActiveNameMap[selIndex + 1];
            // if (isNull(activiNameList)) {
            //     EffectUtils.showTips(GCode(CLEnum.FUNC_UNOPEN), 1, true);
            //     return;
            // }
            // if (selIndex > this.subDay) {
            //     EffectUtils.showTips(GCode(CLEnum.FUNC_UNOPEN), 1, true);
            //     return;
            // }
            this.initView(selIndex);
            this.updateTopData(selIndex + 1);
        };
        SevenDayActivityPanel.prototype.changeTopTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initTopView(selIndex);
        };
        /**刷新切卡 */
        SevenDayActivityPanel.prototype.refreshTabBtns = function () {
            this.m_comTabGroup.clearTabBtn();
            var tags = [
                GCode(CLEnum.AC_SEVEN_DAY1),
                GCode(CLEnum.AC_SEVEN_DAY2),
                GCode(CLEnum.AC_SEVEN_DAY3),
                GCode(CLEnum.AC_SEVEN_DAY4),
                GCode(CLEnum.AC_SEVEN_DAY5),
                GCode(CLEnum.AC_SEVEN_DAY6),
                GCode(CLEnum.AC_SEVEN_DAY7)
            ];
            this.m_comTabGroup.initNorTabBtns(tags);
            for (var i = 1; i <= 7; i++) {
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(tags[i - 1]), { x: 78, y: -5, scale: 0.9 }, [RedEvtType.OPEN_SEVEN], 2, { dayAc: i });
            }
        };
        SevenDayActivityPanel.prototype.initTopView = function (tag) {
            this.m_comTabTopGroup.selectedIndex = tag;
            var name = this.m_comTabTopGroup.selName;
            var data = this.m_topData[name];
            if (data) {
                if (this.m_tViews[0])
                    this.m_tViews[0].initData(data.id);
            }
        };
        SevenDayActivityPanel.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            var name = this.m_comTabGroup.selName;
            var data = this.m_tabData[name];
        };
        SevenDayActivityPanel.NAME = 'SevenDayActivityPanel';
        return SevenDayActivityPanel;
    }(com_main.CView));
    com_main.SevenDayActivityPanel = SevenDayActivityPanel;
})(com_main || (com_main = {}));
