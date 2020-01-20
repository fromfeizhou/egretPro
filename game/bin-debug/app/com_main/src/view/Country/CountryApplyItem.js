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
    var CountryApplyItem = /** @class */ (function (_super_1) {
        __extends(CountryApplyItem, _super_1);
        function CountryApplyItem(viewParam) {
            var _this = _super_1.call(this) || this;
            _this.name = CountryApplyItem.NAME;
            _this.skinName = Utils.getSkinName("app/Country/CountryApplyItemSkin.exml");
            _this._viewParam = viewParam;
            return _this;
        }
        CountryApplyItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_Btn, this, this.OnClickBtn);
        };
        CountryApplyItem.prototype.dataChanged = function () {
            this.currentState = this.data.state;
            this.Refresh();
        };
        CountryApplyItem.prototype.Refresh = function () {
            this.m_Btn.setTitleLabel(this.data.btnName);
            this.m_tData = this.data.playerInfo;
            this.m_playerName.text = this.data.playerInfo.name;
            this.m_pAggressivity.text = "" + this.m_tData.fight;
            this.m_pMilitary.text = "" + this.m_tData.warMerits;
            var jobCfg = C.JobConfig[this.m_tData.jobId];
            this.m_pLegion.text = jobCfg ? GLan(jobCfg.name) : GCode(CLEnum.NONE);
            this.m_pCityNum.text = this.m_tData.cities ? "" + this.m_tData.cities.length : "0";
            this.Refresh_RoleHead();
        };
        CountryApplyItem.prototype.Refresh_RoleHead = function () {
            // let headStr = Utils.getPlayerHeadImg(this.m_tData.roleHead);
            this.m_RoleHead.info = { type: 1, url: this.m_tData.roleHead.toString(), official: 0, vip: 0 };
        };
        CountryApplyItem.prototype.OnClickBtn = function () {
            var playerId = this.data.playerInfo.playerId;
            if (CountryModel.ApplyListViewParam.curState == "Job") {
                var jobId_1 = CountryModel.ApplyListViewParam.jobId;
                var tip = "";
                if (jobId_1 == 1) {
                    tip = GCodeFromat(CLEnum.STATE_RW_TIPS, this.data.playerInfo.name);
                }
                else {
                    var jobName = GLan(C.JobConfig[jobId_1].name);
                    tip = GCodeFromat(CLEnum.STATE_RM_TIPS, this.data.playerInfo.name, jobName);
                }
                Utils.showConfirmPop(tip, function () {
                    com_main.UpManager.history();
                    CountryProxy.send_COUNTRY_APPLY_JOB(jobId_1, playerId);
                }, this);
            }
            else if (CountryModel.ApplyListViewParam.curState == "Manage") {
                var cityId = CountryModel.ApplyListViewParam.cityId;
                var playerId_1 = this.data.playerInfo.playerId;
                CountryProxy.send_COUNTRY_APPLY_CITY(cityId, playerId_1);
                com_main.UpManager.history();
            }
        };
        CountryApplyItem.NAME = 'CountryApplyItem';
        return CountryApplyItem;
    }(eui.ItemRenderer));
    com_main.CountryApplyItem = CountryApplyItem;
})(com_main || (com_main = {}));
