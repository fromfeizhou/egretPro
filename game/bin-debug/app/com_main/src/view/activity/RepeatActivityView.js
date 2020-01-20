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
    var RepeatActivityView = /** @class */ (function (_super_1) {
        __extends(RepeatActivityView, _super_1);
        function RepeatActivityView(activiType, taskId) {
            if (taskId === void 0) { taskId = 0; }
            var _this = _super_1.call(this) || this;
            _this.m_nTaskId = 0;
            _this.activityType = activiType;
            _this.m_nTaskId = taskId;
            _this.name = RepeatActivityView.NAME;
            _this.initApp("activity/RepeatActivityViewSkin.exml");
            return _this;
        }
        RepeatActivityView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        RepeatActivityView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        RepeatActivityView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listItem.dataProvider = this.m_tCollection;
            this.m_listItem.itemRenderer = RepeatActivityCell;
        };
        /**初始化界面 */
        RepeatActivityView.prototype.initView = function () {
            if (this.bInit)
                return;
            this.bInit = true;
            var activiVo = ActivityModel.getActivityVo(AcViewType.NOR_SEVEN);
            this.m_imgIcon.source = Utils.GetResName('hd_' + activiVo.viewType + '_jpg');
            if (!activiVo)
                return;
            this.m_acTaskVo = activiVo;
            var vo = activiVo.taskInfoDic[this.m_nTaskId];
            var list = vo.getTaskConditionList();
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var condition = list[i];
                var conditionId = condition.conditionBaseId;
                var cfg = this.m_acTaskVo.configsII[conditionId];
                var param = {
                    taskId: vo.taskId, conditionId: conditionId, title: cfg.title,
                    condition: condition, rewardItem: cfg.rewardItem
                };
                res.push(param);
            }
            this.refreshActiviData(res);
            this.refresh();
            this.addEvent();
        };
        /**设置宽高 */
        RepeatActivityView.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pViewRoot);
        };
        /**刷新显示 */
        RepeatActivityView.prototype.refreshView = function () {
            this.refresh();
        };
        /**
         * 创建列表数据
         */
        RepeatActivityView.prototype.refreshActiviData = function (res) {
            res.sort(this.sortBystate.bind(this));
            this.m_tCollection.replaceAll(res);
        };
        /**排序 */
        RepeatActivityView.prototype.sortBystate = function (a, b) {
            var astate = this.m_acTaskVo.taskInfoDic[a.taskId].getTaskConditionState(a.conditionId);
            var bstate = this.m_acTaskVo.taskInfoDic[b.taskId].getTaskConditionState(b.conditionId);
            if (astate != bstate) {
                if (astate != TaskStatus.REWARD) {
                    astate = astate ^ 1;
                }
                if (bstate != TaskStatus.REWARD) {
                    bstate = bstate ^ 1;
                }
                return astate - bstate;
            }
            if (a.conditionId > b.conditionId) {
                return 1;
            }
            else if (a.conditionId < b.conditionId) {
                return -1;
            }
            else {
                return 0;
            }
        };
        /**刷新列表数据 */
        RepeatActivityView.prototype.refresh = function () {
            this.m_tCollection.source.sort(this.sortBystate.bind(this));
            this.m_tCollection.refresh();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        RepeatActivityView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onMissionUpdate, this);
        };
        /**移除事件 */
        RepeatActivityView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
        };
        /**任务更新 */
        RepeatActivityView.prototype.onMissionUpdate = function (data) {
            var vo = ActivityModel.getActivityVoById(data.activityId);
            if (vo && vo.viewType == AcViewType.NOR_SEVEN) {
                this.refreshView();
            }
        };
        RepeatActivityView.NAME = 'RepeatActivityView';
        return RepeatActivityView;
    }(com_main.CView));
    com_main.RepeatActivityView = RepeatActivityView;
    var RepeatActivityCell = /** @class */ (function (_super_1) {
        __extends(RepeatActivityCell, _super_1);
        function RepeatActivityCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/RepeatActivityCellSkin.exml");
            return _this;
        }
        RepeatActivityCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickAward);
        };
        RepeatActivityCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RepeatActivityCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pBtn);
        };
        RepeatActivityCell.prototype.onClickAward = function (e) {
            if (this.m_status !== TaskStatus.FINISH)
                return;
            MissionProxy.send_MISSION_REWARD(this.m_tData.taskId, this.m_tData.conditionId);
        };
        RepeatActivityCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            var arwardList = this.m_tData.rewardItem;
            var cdInfo = this.m_tData.condition;
            this.m_status = cdInfo.state;
            var mProgressValue = cdInfo.count > cdInfo.maxCount ? cdInfo.maxCount : cdInfo.count;
            this.m_labCount.text = mProgressValue + "/" + cdInfo.maxCount;
            Utils.isGray(cdInfo.state == TaskStatus.PROCESSING, this.m_pBtn);
            this.m_pBtn.visible = cdInfo.state != TaskStatus.REWARD;
            this.m_pBtn.enabled = cdInfo.state !== TaskStatus.PROCESSING;
            this.m_pBtn.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_pAwardState.visible = cdInfo.state == TaskStatus.REWARD;
            this.m_labName.textFlow = Utils.htmlParser(this.m_tData.title);
            var i = 0;
            for (i = 0; i < arwardList.length; i++) {
                if (this.m_RewardRoot.numChildren > i) {
                    this.m_RewardRoot.getChildAt(i).setItemInfo(arwardList[i].itemId, arwardList[i].count);
                }
                else {
                    var itemView = com_main.ComItemNew.create("count");
                    itemView.scaleX = 0.8;
                    itemView.scaleY = 0.8;
                    itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                    this.m_RewardRoot.addChild(itemView);
                }
            }
            for (; i < this.m_RewardRoot.numChildren; i++) {
                this.m_RewardRoot.removeChildAt(i);
            }
        };
        return RepeatActivityCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
