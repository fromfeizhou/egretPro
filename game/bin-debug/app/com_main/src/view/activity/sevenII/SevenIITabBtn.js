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
    var SevenIITabBtn = /** @class */ (function (_super_1) {
        __extends(SevenIITabBtn, _super_1);
        function SevenIITabBtn() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIITabBtnSkin.exml");
            return _this;
        }
        SevenIITabBtn.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        SevenIITabBtn.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        SevenIITabBtn.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        SevenIITabBtn.prototype.setTabIndex = function (index) {
            this.m_tabIndex = index;
        };
        SevenIITabBtn.prototype.getTabIndex = function () {
            return this.m_tabIndex;
        };
        /**设置按钮文本 */
        SevenIITabBtn.prototype.setTitleLabel = function (btnStr) {
            this.m_labBtnName.text = btnStr;
        };
        SevenIITabBtn.prototype.setSelectState = function (boo) {
            if (boo) {
                this.m_imgSelect.source = 'btn_141_png';
            }
            else {
                this.m_imgSelect.source = 'btn_140_png';
            }
        };
        return SevenIITabBtn;
    }(com_main.CComponent));
    com_main.SevenIITabBtn = SevenIITabBtn;
})(com_main || (com_main = {}));
