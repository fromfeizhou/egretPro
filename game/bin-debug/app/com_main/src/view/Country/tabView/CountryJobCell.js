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
    var CountryJobCell = /** @class */ (function (_super_1) {
        __extends(CountryJobCell, _super_1);
        function CountryJobCell() {
            var _this = _super_1.call(this) || this;
            _this.name = CountryJobCell.NAME;
            _this.skinName = Utils.getSkinName("app/Country/CountryJobCellSkin.exml");
            return _this;
        }
        CountryJobCell.prototype.GetJobId = function () {
            return this._jobConfig.id;
        };
        CountryJobCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CountryJobCell.prototype.Init = function (jobId) {
            this.m_tJob = jobId;
            this.refreshData();
            this.Refresh();
        };
        CountryJobCell.prototype.Refresh = function () {
            this.refreshData();
            this.Refresh_RoleHead();
            this.Refresh_JobName();
            this.Refresh_PlayerName();
        };
        CountryJobCell.prototype.refreshData = function () {
            this._jobInfo = CountryModel.JobInfos[this.m_tJob];
            this._jobConfig = C.JobConfig[this.m_tJob];
        };
        CountryJobCell.prototype.Refresh_RoleHead = function () {
            var headId = 0;
            if (this._jobInfo != null && this._jobInfo.PlayerInfo != null) {
                this.m_RoleHead.info = { type: 1, url: this._jobInfo.PlayerInfo.roleHead.toString(), official: 0, vip: 0 };
                this.m_exploitLb.text = GCodeFromat(CLEnum.STATE_GZ_ZG, this._jobInfo.PlayerInfo.warMerits);
            }
            else {
                this.m_RoleHead.info = null;
                if (this._jobConfig.autoAllocation) {
                    this.m_exploitLb.text = GCodeFromat(CLEnum.STATE_GZ_ZG, CommonUtils.numOutLenght(this._jobConfig.condition));
                }
            }
        };
        CountryJobCell.prototype.Refresh_JobName = function () {
            this.m_JobName.text = GLan(this._jobConfig.name);
        };
        CountryJobCell.prototype.Refresh_PlayerName = function () {
            if (this._jobInfo == null || this._jobInfo.PlayerInfo.playerId == 0) {
                this.m_PlayerName.text = GCode(CLEnum.STATE_GZ_EMPTY);
            }
            else {
                this.m_PlayerName.text = this._jobInfo.PlayerInfo.name;
            }
        };
        CountryJobCell.NAME = 'CountryJobCell';
        return CountryJobCell;
    }(com_main.CComponent));
    com_main.CountryJobCell = CountryJobCell;
})(com_main || (com_main = {}));
