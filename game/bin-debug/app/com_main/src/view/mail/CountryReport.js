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
     * 邮件国家战报主面板
     */
    var CountryReport = /** @class */ (function (_super_1) {
        __extends(CountryReport, _super_1);
        function CountryReport(type) {
            var _this = _super_1.call(this) || this;
            _this.name = CountryReport.NAME;
            _this.m_nType = type;
            _this.skinName = Utils.getAppSkin('mail/CountryReportSkin.exml');
            return _this;
        }
        CountryReport.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CountryReport.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        CountryReport.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tTeamCollect = new eui.ArrayCollection();
            this.m_listTeam.itemRenderer = MailCnWarItem;
            this.m_listTeam.dataProvider = this.m_tTeamCollect;
            this.m_tPerCollect = new eui.ArrayCollection();
            this.m_listPersonal.itemRenderer = MailCnWarItem;
            this.m_listPersonal.dataProvider = this.m_tPerCollect;
        };
        CountryReport.prototype.refresh = function (info) {
            var data = JSON.parse(info.text);
            this.m_imgRes0.source = data.victory == 1 ? "lb_ty1_s_png" : "lb_ty4_b_png";
            this.m_imgRes1.source = data.victory == 1 ? "lb_ty4_b_png" : "lb_ty1_s_png";
            this.m_comState0.stateId = data.atkTeamData.countryId;
            this.m_comState1.stateId = data.defTeamData.countryId;
            this.m_labMaxNum0.text = data.atkTeamData.teamCount.toString();
            this.m_labMaxNum1.text = data.defTeamData.teamCount.toString();
            this.m_labLose0.text = data.atkTeamData.fallBattleTeamCount.toString();
            this.m_labLose1.text = data.defTeamData.fallBattleTeamCount.toString();
            this.m_labLeft0.text = data.atkTeamData.surplusTeamCount.toString();
            this.m_labLeft1.text = data.defTeamData.surplusTeamCount.toString();
            var res = [];
            for (var i = 0; i < data.labourUnionList.length; i++) {
                res.push(data.labourUnionList[i]);
            }
            res.sort(function (a, b) {
                return b.value - a.value;
            });
            this.m_tTeamCollect.removeAll();
            this.m_tTeamCollect.replaceAll(res);
            var perRes = [];
            for (var i = 0; i < data.playerList.length; i++) {
                perRes.push(data.playerList[i]);
            }
            perRes.sort(function (a, b) {
                return b.value - a.value;
            });
            this.m_tPerCollect.removeAll();
            this.m_tPerCollect.replaceAll(perRes);
        };
        CountryReport.NAME = 'CountryReport';
        return CountryReport;
    }(com_main.CComponent));
    com_main.CountryReport = CountryReport;
    /**
     * 国战排行
     */
    var MailCnWarItem = /** @class */ (function (_super_1) {
        __extends(MailCnWarItem, _super_1);
        function MailCnWarItem() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = false;
            return _this;
        }
        MailCnWarItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        MailCnWarItem.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            com_main.EventManager.removeEventListeners(this);
        };
        MailCnWarItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        MailCnWarItem.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.m_comState.stateId = this.m_tData.countryId;
            this.m_lbRank.text = "" + (this.itemIndex + 1);
            this.m_lbName.text = this.m_tData.name;
            this.m_lbNum.text = "" + CommonUtils.numOutLenght(this.m_tData.value);
        };
        return MailCnWarItem;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
