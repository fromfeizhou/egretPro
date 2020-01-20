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
    var CountryManageItem = /** @class */ (function (_super_1) {
        __extends(CountryManageItem, _super_1);
        function CountryManageItem() {
            var _this = _super_1.call(this) || this;
            _this._btnName = [GCode(CLEnum.STATE_GZ_EMPTY), GCode(CLEnum.STATE_GZ_XR), GCode(CLEnum.STATE_GZ_RM)];
            _this._btnModel = 0;
            _this.name = com_main.ArenaView.NAME;
            _this.skinName = Utils.getSkinName("app/Country/CountryManageItemSkin.exml");
            return _this;
        }
        CountryManageItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtn, this, this.OnClickBtn);
        };
        CountryManageItem.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        CountryManageItem.prototype.dataChanged = function () {
            var selfJobId = CountryModel.Self_PlayerInfo.jobId;
            this.m_tData = this.data;
            if (this.data.isSelf) {
                this._btnModel = 1;
                this.m_pBtn.setImage("btn_006_up_png");
            }
            else if (selfJobId == 1) {
                //君王有任命权
                this._btnModel = 2;
                this.m_pBtn.setImage("btn_001_up_png");
            }
            else {
                this._btnModel = 0;
            }
            this.m_pCityName.text = this.m_tData.cityName == "" ? GCode(CLEnum.STATE_GZ_EMPTY) : this.m_tData.cityName;
            this.m_pCityType.text = "" + WorldModel.getCityTypeName(this.m_tData.cityType);
            this.m_pLegion.text = this.m_tData.legion == "" ? GCode(CLEnum.STATE_GZ_EMPTY) : this.m_tData.legion;
            this.m_pName.text = this.m_tData.playerName == "" ? GCode(CLEnum.STATE_GZ_EMPTY) : this.m_tData.playerName;
            this.m_pBtn.visible = this._btnModel != 0;
            this.m_pBtn.setTitleLabel(this._btnName[this._btnModel]);
        };
        CountryManageItem.prototype.OnClickBtn = function () {
            var _this = this;
            CountryModel.LeaveCity = this._btnModel == 1;
            if (CountryModel.LeaveCity == true) {
                var tip = GCodeFromat(CLEnum.STATE_CITY_XR_TIPS, this.m_tData.cityName);
                Utils.showConfirmPop(tip, function () { return CountryProxy.send_COUNTRY_APPLY_CITY(_this.m_tData.cityId, 0); }, this);
            }
            else {
                CountryModel.ApplyListViewParam = {};
                CountryModel.ApplyListViewParam.cityId = this.m_tData.cityId;
                CountryModel.ApplyListViewParam.curState = "Manage";
                CountryModel.ApplyListViewParam.btnName = this._btnName[this._btnModel];
                CountryModel.ApplyListViewParam.titleName = GCode(CLEnum.STATE_TAB_GL);
                CountryProxy.send_COUNTRY_APPLY_LIST(1);
            }
        };
        CountryManageItem.NAME = 'CountryManageItem';
        return CountryManageItem;
    }(eui.ItemRenderer));
    com_main.CountryManageItem = CountryManageItem;
})(com_main || (com_main = {}));
