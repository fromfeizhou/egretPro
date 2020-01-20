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
    var CountryPlayerJob = /** @class */ (function (_super_1) {
        __extends(CountryPlayerJob, _super_1);
        function CountryPlayerJob() {
            var _this = _super_1.call(this) || this;
            _this.name = CountryPlayerJob.NAME;
            _this.skinName = Utils.getSkinName("app/Country/CountryPlayerJobSkin.exml");
            return _this;
        }
        CountryPlayerJob.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CountryPlayerJob.prototype.SetPlayerJob = function (jobId, playerName, headId) {
            this.SetJobName(jobId);
            this.SetPlayerName(playerName);
            this.SetHead(headId);
        };
        CountryPlayerJob.prototype.SetJobName = function (jobId) {
            var jobCfg = C.JobConfig[jobId];
            if (jobCfg) {
                this.m_JobName.text = GLan(jobCfg.name);
                return;
            }
            this.m_JobName.text = GCode(CLEnum.STATE_GZ_EMPTY);
        };
        CountryPlayerJob.prototype.SetPlayerName = function (playerName) {
            this.m_PlayerName.text = Utils.isNullOrEmpty(playerName) ? GCode(CLEnum.STATE_GZ_EMPTY) : playerName;
        };
        CountryPlayerJob.prototype.SetHead = function (headId) {
            if (headId == 0) {
                this.m_Head.info = null;
            }
            else {
                this.m_Head.info = { type: 1, url: headId.toString(), official: 0, vip: 0 };
            }
        };
        CountryPlayerJob.NAME = 'CountryPlayerJob';
        return CountryPlayerJob;
    }(com_main.CComponent));
    com_main.CountryPlayerJob = CountryPlayerJob;
})(com_main || (com_main = {}));
