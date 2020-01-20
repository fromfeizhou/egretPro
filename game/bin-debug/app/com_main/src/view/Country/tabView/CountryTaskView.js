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
    var CountryTaskView = /** @class */ (function (_super_1) {
        __extends(CountryTaskView, _super_1);
        function CountryTaskView() {
            var _this = _super_1.call(this) || this;
            _this.name = CountryTaskView.NAME;
            // this.initApp('Country/tabView/CountryTaskViewSkin.exml');
            _this.dynamicSkinName = Utils.getAppSkin("Country/tabView/CountryTaskViewSkin.exml");
            return _this;
        }
        CountryTaskView.prototype.onShow = function () {
            this.m_BtnFinish.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_ProgressBar.Progress = 0;
            var scaleY = (453 - GameConfig.getSub()) / 453;
            this.m_textGroup.scaleX = scaleY;
            this.m_textGroup.scaleY = scaleY;
            if (RoleData.countryId == CountryType.WEI) {
                this.m_bgRole.source = "icon_wj_b_10_png";
            }
            else if (RoleData.countryId == CountryType.SHU) {
                this.m_bgRole.source = "icon_wj_b_7_png";
            }
            else if (RoleData.countryId == CountryType.WU) {
                this.m_bgRole.source = "icon_wj_b_17_png";
            }
            this.addEvent();
            this.Refresh();
        };
        CountryTaskView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CountryTaskView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        // protected childrenCreated(): void {
        //     super.childrenCreated();
        //     this.m_BtnFinish.setTitleLabel(GCode(CLEnum.TAKE_OUT));
        //     this.m_ProgressBar.Progress = 0;
        //     let scaleY = (453 - GameConfig.getSub()) / 453;
        //     this.m_textGroup.scaleX = scaleY;
        //     this.m_textGroup.scaleY = scaleY;
        //     if (RoleData.countryId == CountryType.WEI) {
        //         this.m_bgRole.source = "icon_wj_b_10_png";
        //     } else if (RoleData.countryId == CountryType.SHU) {
        //         this.m_bgRole.source = "icon_wj_b_7_png";
        //     } else if (RoleData.countryId == CountryType.WU) {
        //         this.m_bgRole.source = "icon_wj_b_17_png";
        //     }
        //     this.addEvent();
        //     this.Refresh();
        // }
        CountryTaskView.prototype.Refresh = function () {
            var condition = MissionModel.getCountryTask();
            if (condition) {
                var conditionCfg = C.TaskConditionConfig[condition.conditionBaseId];
                var taskCfg = C.TaskConfig[conditionCfg.taskId];
                this.m_Title.text = taskCfg.title;
                this.m_Describe.text = conditionCfg.title;
                if (condition.state == TaskStatus.REWARD) {
                    this.m_Describe.text = '凌晨5点重置';
                }
                this.RefreshRewards(conditionCfg.rewardItem);
                this.m_labPro.text = condition.count + "/" + condition.maxCount;
                this.m_ProgressBar.Progress = condition.count / condition.maxCount;
                if (condition.state == TaskStatus.FINISH) {
                    this.m_BtnFinish.setTitleLabel(GCode(CLEnum.TAKE_OUT));
                    this.m_BtnFinish.disabled = false;
                }
                else {
                    this.m_BtnFinish.setTitleLabel(GCode(CLEnum.GO_TO));
                    if (conditionCfg.turnPanel > 0) {
                        this.m_BtnFinish.disabled = false;
                    }
                    else {
                        this.m_BtnFinish.disabled = true;
                    }
                }
            }
        };
        CountryTaskView.prototype.RefreshRewards = function (awards) {
            if (this.m_items && this.m_items.length > 0) {
                for (var i = 0; i < this.m_items.length; i++) {
                    this.m_ItemRoot.removeChild(this.m_items[i]);
                }
            }
            this.m_items = [];
            var reward = awards;
            for (var i = 0; i < reward.length; i++) {
                var item = com_main.ComItemNew.create("name_num");
                item.setItemInfo(reward[i].itemId, reward[i].count);
                this.m_items.push(item);
                this.m_ItemRoot.addChild(item);
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        CountryTaskView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onAddMissionInfo, this);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);
            com_main.EventManager.addTouchScaleListener(this.m_BtnFinish, this, this.onBtnFinish);
        };
        CountryTaskView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**领奖 */
        CountryTaskView.prototype.onBtnFinish = function () {
            var condition = MissionModel.getCountryTask();
            if (condition) {
                var conditionCfg = C.TaskConditionConfig[condition.conditionBaseId];
                if (condition.state == TaskStatus.FINISH) {
                    MissionProxy.send_MISSION_REWARD(conditionCfg.taskId, condition.conditionBaseId);
                }
                else {
                    if (conditionCfg.turnPanel > 0)
                        FunctionModel.funcToPanel(conditionCfg.turnPanel);
                }
            }
        };
        CountryTaskView.prototype.onAddMissionInfo = function (data) {
            if (data.type != TaskType.Country && data.type != TaskType.CountryRepeat)
                return;
            this.Refresh();
        };
        CountryTaskView.prototype.onUpdateMissionInfo = function (data) {
            if (data.type != TaskType.Country && data.type != TaskType.CountryRepeat)
                return;
            this.Refresh();
        };
        CountryTaskView.NAME = 'CountryTaskView';
        return CountryTaskView;
    }(com_main.DynamicComponent));
    com_main.CountryTaskView = CountryTaskView;
})(com_main || (com_main = {}));
