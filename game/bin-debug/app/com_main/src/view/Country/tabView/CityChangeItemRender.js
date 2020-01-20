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
    var CityChangeItemRender = /** @class */ (function (_super_1) {
        __extends(CityChangeItemRender, _super_1);
        function CityChangeItemRender() {
            return _super_1.call(this) || this;
        }
        CityChangeItemRender.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        CityChangeItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        CityChangeItemRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (!this.data)
                return;
            var countryName = Utils.getCountryName(this.data.countryId, GCode(CLEnum.STATE_ZL));
            var color = Utils.getCountryColor1(this.data.countryId);
            var cityName = WorldModel.getCityName(this.data.cityId);
            var timeStr = Utils.DateUtils.getDateStr(this.data.time);
            if (this.data.type == 1) {
                this.m_flagImg.source = 'zyt_qz01_png';
                this.m_info.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_CHANGE_SUC, timeStr, color, countryName, cityName));
            }
            else {
                this.m_flagImg.source = 'zyt_qz02_png';
                this.m_info.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_CHANGE_FALL, cityName, timeStr, color, countryName));
            }
        };
        return CityChangeItemRender;
    }(eui.ItemRenderer));
    com_main.CityChangeItemRender = CityChangeItemRender;
})(com_main || (com_main = {}));
