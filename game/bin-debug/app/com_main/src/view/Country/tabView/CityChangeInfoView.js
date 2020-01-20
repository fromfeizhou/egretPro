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
    var CityChangeInfoView = /** @class */ (function (_super_1) {
        __extends(CityChangeInfoView, _super_1);
        function CityChangeInfoView() {
            var _this = _super_1.call(this) || this;
            _this.name = CityChangeInfoView.NAME;
            return _this;
            // this.skinName = this.skinName = Utils.getAppSkin("Country/tabView/CityChangeInfoSkin.exml");
        }
        CityChangeInfoView.prototype.refreshAll = function () {
            // super.childrenCreated();
            this.m_scroll.scrollPolicyH = "ScrollPolicy.OFF";
            this.m_tCollection = new eui.ArrayCollection();
            this.m_infoList.itemRenderer = com_main.CityChangeItemRender;
            this.m_infoList.dataProvider = this.m_tCollection;
            this.refreshView();
        };
        Object.defineProperty(CityChangeInfoView.prototype, "visible", {
            set: function (boo) {
                if (boo && (this.skinName == '' || isNull(this.skinName))) {
                    this.skinName = this.skinName = Utils.getAppSkin("Country/tabView/CityChangeInfoSkin.exml");
                    this.refreshAll();
                }
                if (boo != this.visible) {
                    this.$setVisible(boo);
                }
            },
            enumerable: true,
            configurable: true
        });
        CityChangeInfoView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        CityChangeInfoView.prototype.refreshView = function () {
            var res = CountryModel.getCityChangeInfo();
            this.m_tCollection.replaceAll(res);
            this.refreshScrollV();
        };
        /**滚动到最大位置 */
        CityChangeInfoView.prototype.refreshScrollV = function () {
            var _this = this;
            egret.callLater(function () {
                if (_this.m_scroll) {
                    var scrollV = _this.m_scroll.viewport.contentHeight - _this.m_scroll.viewport.height;
                    scrollV = Math.max(scrollV, 0);
                    _this.m_scroll.viewport.scrollV = scrollV;
                }
            }, this);
        };
        CityChangeInfoView.NAME = 'CityChangeInfoView';
        return CityChangeInfoView;
    }(com_main.CView));
    com_main.CityChangeInfoView = CityChangeInfoView;
})(com_main || (com_main = {}));
