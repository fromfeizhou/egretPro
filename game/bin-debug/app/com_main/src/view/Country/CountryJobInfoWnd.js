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
    /**国家官职任命 */
    var CountryJobInfoWnd = /** @class */ (function (_super_1) {
        __extends(CountryJobInfoWnd, _super_1);
        function CountryJobInfoWnd(jobId) {
            var _this = _super_1.call(this) || this;
            _this._btnName = [GCode(CLEnum.NONE), GCode(CLEnum.STATE_GZ_SR), GCode(CLEnum.STATE_GZ_XR),
                GCode(CLEnum.STATE_GZ_RM), GCode(CLEnum.STATE_GZ_GH)];
            _this._btnNameTpips = [GCode(CLEnum.NONE), GCode(CLEnum.STATE_GZ_SR_TIPS), GCode(CLEnum.STATE_GZ_XR_TIPS1),
                GCode(CLEnum.GUILD_APPLY_TIPS), GCode(CLEnum.GUILD_APPLY_TIPS)];
            _this._btnModel = 0; //0-无, 1-禅让, 2-卸任, 3-任命, 4-更换
            _this.name = CountryJobInfoWnd.NAME;
            _this.skinName = Utils.getSkinName("app/Country/CountryJobInfoWndSkin.exml");
            _this.InitView(C.JobConfig[jobId]);
            _this.m_jobId = jobId;
            return _this;
        }
        CountryJobInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_Btn, this, this.OnClickBtn);
        };
        CountryJobInfoWnd.prototype.InitView = function (jobCfg) {
            this._jobConfig = jobCfg;
            this._jobInfo = CountryModel.JobInfos[jobCfg.id];
            this.m_PopUp.getCloseBtn().visible = false;
            this.m_PopUp.setTitleLabelVisible(false);
            this.m_PopUp.setBottomBorder();
            var jobName = C.JobConfig[this._jobConfig.id].name;
            this._jobName = GLan(jobName);
            this.Refresh();
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        CountryJobInfoWnd.prototype.Refresh = function () {
            this.Refresh_UserInfo();
            this.Refresh_JobInfo();
            this.Refresh_BtnInfo();
            this.Refresh_MainTop();
        };
        CountryJobInfoWnd.prototype.Refresh_UserInfo = function () {
            var exist = this._jobInfo != null && this._jobInfo.PlayerInfo != null;
            if (!exist || Utils.isNullOrEmpty(this._jobInfo.PlayerInfo.name)) {
                this.m_PlayerName.text = GCode(CLEnum.STATE_GZ_XWYD);
                this.m_RoleImg.source = 'icon_wj_b_0_png';
            }
            else {
                this.m_PlayerName.text = this._jobInfo.PlayerInfo.name;
                this.m_RoleImg.source = Utils.getPlayerBigHeadSource(1, this._jobInfo.PlayerInfo.roleHead.toString());
            }
            // this.m_PlayerName.text = (!exist || Utils.isNullOrEmpty(this._jobInfo.PlayerInfo.name)) ? GCode(CLEnum.STATE_GZ_XWYD) : this._jobInfo.PlayerInfo.name;
            this.m_LegionName.text = (!exist || Utils.isNullOrEmpty(this._jobInfo.PlayerInfo.legionName)) ? GCode(CLEnum.NONE) : this._jobInfo.PlayerInfo.legionName;
        };
        CountryJobInfoWnd.prototype.Refresh_JobInfo = function () {
            this.m_TitleJobName.text = this._jobName;
            this.m_JobLabel.text = this._jobName + GCode(CLEnum.EFFECT);
            var jobInfoCfg = C.JobInfoConfig[this._jobConfig.effect];
            this.m_JobDes.text = GLan(jobInfoCfg.description);
            this.m_ConditionDes.text = GLan(jobInfoCfg.condition);
        };
        CountryJobInfoWnd.prototype.Refresh_BtnInfo = function () {
            if (this._jobConfig.id == CountryModel.Self_PlayerInfo.jobId) {
                this._btnModel = this._jobConfig.id == 1 ? 1 : 2;
                if (this._jobConfig.id > 3) {
                    this.m_Btn.visible = false;
                }
            }
            else {
                var visibleBtn = false;
                if (CountryModel.Self_PlayerInfo.jobId != 0) {
                    var jobConfig = C.JobConfig[CountryModel.Self_PlayerInfo.jobId];
                    var allocationStr = jobConfig.allocation.split(',');
                    visibleBtn = allocationStr.indexOf(this._jobConfig.id.toString()) >= 0;
                }
                this.m_Btn.visible = visibleBtn;
                // this._btnModel = (this._jobInfo != null && Long.fromValue(this._jobInfo.PlayerInfo.playerId).toNumber() != 0) ? 4 : 3;
                this._btnModel = 3;
            }
            this.m_Btn.setTitleLabel(this._btnName[this._btnModel]);
            CountryModel.curBtnStr = this._btnNameTpips[this._btnModel];
            CountryModel.curBtn = this._btnModel;
        };
        CountryJobInfoWnd.prototype.Refresh_MainTop = function () {
            this.m_MainTop.setTitleName(this._jobName + GCode(CLEnum.MESSAGE));
        };
        CountryJobInfoWnd.prototype.OnClickBtn = function () {
            var _this = this;
            if (this._btnModel == 2) {
                var tip = GCode(CLEnum.STATE_GZ_XR_TIPS);
                Utils.showConfirmPop(tip, function () {
                    CountryProxy.send_COUNTRY_APPLY_JOB(_this._jobConfig.id, 0);
                    com_main.UpManager.history();
                }, this);
            }
            else {
                CountryModel.ApplyListViewParam = {};
                CountryModel.ApplyListViewParam.jobId = this._jobConfig.id;
                CountryModel.ApplyListViewParam.curState = "Job";
                CountryModel.ApplyListViewParam.btnName = this._btnName[this._btnModel];
                CountryModel.ApplyListViewParam.titleName = GCode(CLEnum.STATE_GZ);
                if (this._btnModel == 1) {
                    CountryProxy.send_COUNTRY_APPLY_LIST(2);
                }
                else {
                    CountryProxy.send_COUNTRY_APPLY_LIST(0, this.m_jobId);
                }
            }
        };
        CountryJobInfoWnd.NAME = 'CountryJobInfoWnd';
        return CountryJobInfoWnd;
    }(com_main.CView));
    com_main.CountryJobInfoWnd = CountryJobInfoWnd;
})(com_main || (com_main = {}));
