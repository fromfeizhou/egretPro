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
    var MissionNorView = /** @class */ (function (_super_1) {
        __extends(MissionNorView, _super_1);
        function MissionNorView(type, width, height, skinName) {
            if (skinName === void 0) { skinName = ''; }
            var _this = _super_1.call(this) || this;
            _this.name = MissionNorView.NAME;
            _this.m_nType = type;
            _this.width = width;
            _this.height = height;
            _this.skinName = skinName == '' ? Utils.getAppSkin("mission/MissionNorViewSkin.exml") : skinName;
            return _this;
        }
        MissionNorView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        MissionNorView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        MissionNorView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_scroll.scrollPolicyH = "ScrollPolicy.OFF";
            this.initItemList();
            this.addEvent();
            if (this.m_nType == TaskType.Cultivate || this.m_nType == TaskType.MainCity)
                this.m_pBtnAll.setTitleLabel(GCode(CLEnum.TASK_GET_ALL));
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        Object.defineProperty(MissionNorView.prototype, "taskType", {
            /**获得任务类型 */
            get: function () {
                return this.m_nType;
            },
            enumerable: true,
            configurable: true
        });
        MissionNorView.prototype.initItemList = function () {
            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listItem.itemRenderer = com_main.MissionViewCell;
            this.m_listItem.dataProvider = this.m_tCollection;
            var res = [];
            var infos = MissionModel.getMissionInfoList(this.m_nType);
            if (infos) {
                for (var i = 0; i < infos.length; i++) {
                    var info = infos[i].getPriorityTask();
                    if (info) {
                        res.push({ taskId: infos[i].taskId, conditionId: info.conditionBaseId, activityId: infos[i].activityId, type: infos[i].taskType });
                    }
                }
            }
            res.sort(this.sortByState.bind(this));
            this.m_tCollection.replaceAll(res);
            this.isShowAllgetBtn();
        };
        MissionNorView.prototype.isShowAllgetBtn = function () {
            /**保存类型为培养的可领取任务 */
            this.rpyArres = MissionModel.getFinishCidByType(this.m_nType);
            this.currentState = ((this.m_nType == TaskType.Cultivate || this.m_nType == TaskType.MainCity) && this.rpyArres && this.rpyArres.length > 0) ? 'foster' : 'base';
        };
        /**排序 */
        MissionNorView.prototype.sortByState = function (a, b) {
            var stateA = MissionModel.getConditoinInfoById(a.taskId, a.conditionId).state;
            var stateB = MissionModel.getConditoinInfoById(b.taskId, b.conditionId).state;
            if (stateA != stateB) {
                if (stateA != TaskStatus.REWARD) {
                    stateA = stateA ^ 1;
                }
                if (stateB != TaskStatus.REWARD) {
                    stateB = stateB ^ 1;
                }
                return stateA - stateB;
            }
            if (a.taskId != b.taskId)
                return a.taskId - b.taskId;
            return a.conditionId - b.conditionId;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MissionNorView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onAddMissionInfo, this);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_DELETE_INFO, this.onDeleteMissionInfo, this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnAll, this, this.onAllClickTask);
        };
        MissionNorView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_DELETE_INFO, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**一键领取 */
        MissionNorView.prototype.onAllClickTask = function () {
            if (this.rpyArres && this.rpyArres.length > 0) {
                MissionProxy.send_MISSION_REWARD_Multi(this.rpyArres);
                this.currentState = ' base';
            }
        };
        MissionNorView.prototype.onAddMissionInfo = function (data) {
            if (this.m_nType != data.type)
                return;
            this.m_tCollection.addItem(data);
            this.m_tCollection.source.sort(this.sortByState.bind(this));
            this.m_tCollection.refresh();
        };
        MissionNorView.prototype.onDeleteMissionInfo = function (data) {
            if (this.m_nType != data.type)
                return;
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var tmpData = this.m_tCollection.source[i];
                if (tmpData.conditionId == data.conditionId) {
                    this.m_tCollection.removeItemAt(i);
                    this.isShowAllgetBtn();
                    break;
                }
            }
        };
        MissionNorView.prototype.onUpdateMissionInfo = function (data) {
            if (this.m_nType != data.type)
                return;
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var tmpData = this.m_tCollection.source[i];
                if (tmpData.conditionId == data.conditionId) {
                    this.m_tCollection.replaceItemAt(data, i);
                    break;
                }
            }
            this.m_tCollection.source.sort(this.sortByState.bind(this));
            this.m_tCollection.refresh();
        };
        MissionNorView.NAME = 'MissionNorView';
        return MissionNorView;
    }(com_main.CComponent));
    com_main.MissionNorView = MissionNorView;
})(com_main || (com_main = {}));
