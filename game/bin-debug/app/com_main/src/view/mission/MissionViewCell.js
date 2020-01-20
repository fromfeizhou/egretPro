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
    var MissionViewCell = /** @class */ (function (_super_1) {
        __extends(MissionViewCell, _super_1);
        function MissionViewCell() {
            var _this = _super_1.call(this) || this;
            _this.m_state = -1; //0已领取 ，1可补签 2可领奖，-1其他不可点击
            _this.skinName = Utils.getSkinName("app/mission/MissionViewCellSkin.exml");
            return _this;
        }
        MissionViewCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickTask);
        };
        MissionViewCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        MissionViewCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pBtn);
            this.clearBtnMissionEffect();
        };
        //btn
        MissionViewCell.prototype.onClickTask = function (e) {
            var data = this.data;
            if (data) {
                var cdInfo = MissionModel.getConditoinInfoById(data.taskId, data.conditionId);
                if (cdInfo.state == TaskStatus.FINISH)
                    MissionProxy.send_MISSION_REWARD(data.taskId, data.conditionId);
                else if (cdInfo.state <= TaskStatus.PROCESSING) {
                    com_main.UpManager.history();
                    MissionModel.onClickMissionCell(data.taskId, data.conditionId);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.TAKE_OUT_END), 1, true);
                }
            }
            else {
                error("MissionView: data is null!");
            }
        };
        /**设置任务领取按钮特效 */
        MissionViewCell.prototype.createBtnMissionEffect = function () {
            if (this.m_btnMissionEff)
                return;
            this.m_btnMissionEff = new MCDragonBones();
            this.m_btnMissionEff.initAsync(IETypes.EUI_MissionEff);
            this.m_btnMissionEff.play(IETypes.EUI_MissionEff);
            this.m_btnMissionEff.x = 72.5;
            this.m_btnMissionEff.y = 30;
            this.m_pBtn.addChild(this.m_btnMissionEff);
        };
        MissionViewCell.prototype.clearBtnMissionEffect = function () {
            if (this.m_btnMissionEff) {
                this.m_btnMissionEff.destroy();
                this.m_btnMissionEff = null;
            }
        };
        //MissionInfoVo
        MissionViewCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            var tempData = this.data;
            var conditionCfg = C.TaskConditionConfig[tempData.conditionId];
            var taskCfg = C.TaskConfig[tempData.taskId];
            var cdInfo = MissionModel.getConditoinInfoById(tempData.taskId, tempData.conditionId);
            this.m_pTitleText.text = taskCfg.title;
            this.m_pLbActiveNum.text = GCodeFromat(CLEnum.TASK_ACTIVITY_NUM1, conditionCfg.rewardActivity);
            this.m_pLbDesc.textFlow = Utils.htmlParser(conditionCfg.title);
            if (Number(conditionCfg.rewardActivity) == 0)
                this.m_pLbActiveNum.text = "";
            var mProgressValue = cdInfo.count > cdInfo.maxCount ? cdInfo.maxCount : cdInfo.count;
            this.m_progressText.text = mProgressValue + "/" + cdInfo.maxCount;
            var pro = Math.min(cdInfo.count / cdInfo.maxCount, 1);
            this.m_pImageProgress.width = (this.m_pProgressBg.width - 2) * pro;
            this.m_pIsGet.visible = cdInfo.state == TaskStatus.REWARD;
            this.m_pBtn.visible = cdInfo.state != TaskStatus.REWARD;
            var title = cdInfo.state == 0 ? GCode(CLEnum.GO_TO) : GCode(CLEnum.TAKE_OUT);
            this.m_pBtn.setTitleLabel(title);
            if (cdInfo.state == TaskStatus.FINISH) {
                this.m_pBtn.currentState = "style1";
                this.createBtnMissionEffect();
            }
            else {
                this.m_pBtn.currentState = "style6";
                this.clearBtnMissionEffect();
            }
            var arwardList = conditionCfg.rewardItem;
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
        return MissionViewCell;
    }(eui.ItemRenderer));
    com_main.MissionViewCell = MissionViewCell;
})(com_main || (com_main = {}));
