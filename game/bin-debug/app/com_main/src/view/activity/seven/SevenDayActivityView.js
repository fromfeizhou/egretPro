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
    var SevenDayActivityView = /** @class */ (function (_super_1) {
        __extends(SevenDayActivityView, _super_1);
        function SevenDayActivityView(width, height, subDay) {
            var _this = _super_1.call(this) || this;
            _this.name = SevenDayActivityView.NAME;
            _this.initApp("activity/seven/SevenDayActivityViewSkin.exml");
            _this.width = width;
            _this.height = height;
            _this.subDay = subDay;
            return _this;
        }
        SevenDayActivityView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        SevenDayActivityView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        SevenDayActivityView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_actiList.dataProvider = this.m_tCollections;
            this.m_actiList.itemRenderer = com_main.SevenDayActivityCell;
            Utils.toStageBestScale(this.m_pViewRoot);
            this.addEvent();
        };
        /**设置等级 */
        SevenDayActivityView.prototype.initData = function (taskId) {
            this.m_itemScroll.stopAnimation();
            this.m_itemScroll.viewport.scrollV = 0;
            this.m_nTaskId = taskId;
            this.m_acTaskVo = ActivityModel.getActivityVo(AcViewType.OPEN_SEVEN);
            if (!this.m_acTaskVo)
                return;
            this.refreshActiviCell();
        };
        /**
         * 创建列表数据
         */
        SevenDayActivityView.prototype.refreshActiviCell = function () {
            if (!this.m_acTaskVo)
                return;
            var vo = this.m_acTaskVo.taskInfoDic[this.m_nTaskId];
            var res = [];
            for (var _i = 0, _a = vo.condition; _i < _a.length; _i++) {
                var condition = _a[_i];
                var cId = condition.conditionBaseId;
                var cfg = this.m_acTaskVo.configsII[cId];
                res.push({
                    taskId: vo.taskId, cId: cId, subDay: this.subDay, title: cfg.title,
                    condintion: condition, rewardDay: vo.cfg.rewardDay, rewardItem: cfg.rewardItem
                });
            }
            res.sort(this.sortByState.bind(this));
            this.m_tCollections.replaceAll(res);
        };
        /**排序 */
        SevenDayActivityView.prototype.sortByState = function (a, b) {
            var stateA = this.m_acTaskVo.taskInfoDic[a.taskId].getTaskConditionState(a.cId);
            var stateB = this.m_acTaskVo.taskInfoDic[b.taskId].getTaskConditionState(b.cId);
            if (stateA != stateB) {
                if (stateA != TaskStatus.REWARD) {
                    stateA = stateA ^ 1;
                }
                if (stateB != TaskStatus.REWARD) {
                    stateB = stateB ^ 1;
                }
                return stateA - stateB;
            }
            return a.cId - b.cId;
        };
        /**监听事件 */
        SevenDayActivityView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onMissionUpdate, this);
        };
        /**移除事件 */
        SevenDayActivityView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
        };
        /**任务更新 */
        SevenDayActivityView.prototype.onMissionUpdate = function (data) {
            var vo = ActivityModel.getActivityVoById(data.activityId);
            if (vo && vo.viewType == AcViewType.OPEN_SEVEN) {
                this.refreshActiviCell();
            }
        };
        SevenDayActivityView.NAME = 'SevenDayActivityView';
        return SevenDayActivityView;
    }(com_main.CView));
    com_main.SevenDayActivityView = SevenDayActivityView;
})(com_main || (com_main = {}));
