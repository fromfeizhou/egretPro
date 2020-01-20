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
    var GeneralGetInfoWndII = /** @class */ (function (_super_1) {
        __extends(GeneralGetInfoWndII, _super_1);
        function GeneralGetInfoWndII(param) {
            var _this = _super_1.call(this, param) || this;
            _this.name = GeneralGetInfoWndII.NAME;
            return _this;
        }
        GeneralGetInfoWndII.prototype.playCardAction = function () {
            this.showUIAction();
        };
        /**显示ui */
        GeneralGetInfoWndII.prototype.showUIAction = function () {
            this.m_conEffEnter.visible = false;
            this.infoAction1.play(0);
            Sound.playGeneralSoundByID(GeneralModel.getGeneralSoundByGeneralID(this.m_generalId));
        };
        GeneralGetInfoWndII.NAME = "GeneralGetInfoWndII";
        return GeneralGetInfoWndII;
    }(com_main.GeneralGetInfoWnd));
    com_main.GeneralGetInfoWndII = GeneralGetInfoWndII;
})(com_main || (com_main = {}));
