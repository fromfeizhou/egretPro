// TypeScript file
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
    var NewGenTab = /** @class */ (function (_super_1) {
        __extends(NewGenTab, _super_1);
        function NewGenTab() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("activity/newGeneral/componet/NewGenTapSkin.exml");
            return _this;
        }
        NewGenTab.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        NewGenTab.prototype.setTabIndex = function (index) {
            this.m_tabIndex = index;
        };
        NewGenTab.prototype.getTabIndex = function () {
            return this.m_tabIndex;
        };
        NewGenTab.prototype.setTitleLabel = function (str) {
            this.m_lb.text = str;
        };
        NewGenTab.prototype.setSelectState = function (boo) {
            if (boo) {
                this.m_img.source = 'btn_144_png';
            }
            else {
                this.m_img.source = 'btn_143_png';
            }
        };
        return NewGenTab;
    }(com_main.CComponent));
    com_main.NewGenTab = NewGenTab;
})(com_main || (com_main = {}));
