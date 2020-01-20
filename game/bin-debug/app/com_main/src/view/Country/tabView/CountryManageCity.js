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
    var CountryManageCity = /** @class */ (function (_super_1) {
        __extends(CountryManageCity, _super_1);
        function CountryManageCity() {
            var _this = _super_1.call(this) || this;
            _this._num = 0;
            _this.name = com_main.ArenaView.NAME;
            _this.skinName = Utils.getSkinName("app/Country/CountryManageCitySkin.exml");
            return _this;
        }
        CountryManageCity.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CountryManageCity.prototype.InitCity = function (type) {
            this.m_nType = type;
            if (type == 3) {
                this.m_CityImg.source = format("map_build_{1}_png", 4);
            }
            else {
                this.m_CityImg.source = format("map_build_{1}_png", this.m_nType);
            }
            this.Refresh_Title();
        };
        CountryManageCity.prototype.AddNum = function (num) {
            this._num += num;
            this.Refresh_Title();
        };
        CountryManageCity.prototype.ResetNum = function () {
            this._num = 0;
            this.Refresh_Title();
        };
        CountryManageCity.prototype.Refresh_Title = function () {
            this.m_Label.text = format("{1}x{2}", WorldModel.getCityTypeName(this.m_nType), this._num);
        };
        CountryManageCity.NAME = 'CountryManage';
        return CountryManageCity;
    }(com_main.CComponent));
    com_main.CountryManageCity = CountryManageCity;
})(com_main || (com_main = {}));
