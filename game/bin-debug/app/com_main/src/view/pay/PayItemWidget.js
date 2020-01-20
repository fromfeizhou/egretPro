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
    var PayItemWidgetType;
    (function (PayItemWidgetType) {
        PayItemWidgetType[PayItemWidgetType["NONE"] = 0] = "NONE";
        PayItemWidgetType[PayItemWidgetType["NUM_LEFT"] = 1] = "NUM_LEFT";
        PayItemWidgetType[PayItemWidgetType["NUM_MIDDLE"] = 2] = "NUM_MIDDLE";
        PayItemWidgetType[PayItemWidgetType["NUM_RIGHT"] = 3] = "NUM_RIGHT";
        PayItemWidgetType[PayItemWidgetType["NAME_TOP_LEFT"] = 4] = "NAME_TOP_LEFT";
        PayItemWidgetType[PayItemWidgetType["NAME_TOP_MIDDLE"] = 5] = "NAME_TOP_MIDDLE";
        PayItemWidgetType[PayItemWidgetType["NAME_TOP_RIGHT"] = 6] = "NAME_TOP_RIGHT";
        PayItemWidgetType[PayItemWidgetType["NAME_BOTTOM_LEFT"] = 7] = "NAME_BOTTOM_LEFT";
        PayItemWidgetType[PayItemWidgetType["NAME_BOTTOM_MIDDLE"] = 8] = "NAME_BOTTOM_MIDDLE";
        PayItemWidgetType[PayItemWidgetType["NAME_BOTTOM_RIGHT"] = 9] = "NAME_BOTTOM_RIGHT";
    })(PayItemWidgetType = com_main.PayItemWidgetType || (com_main.PayItemWidgetType = {}));
    /**
     *
     */
    var PayItemWidget = /** @class */ (function (_super_1) {
        __extends(PayItemWidget, _super_1);
        function PayItemWidget() {
            var _this = _super_1.call(this) || this;
            _this.m_nType = 0;
            _this.skinName = Utils.getSkinName("app/pay/pay_item_widget.exml");
            return _this;
        }
        PayItemWidget.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PayItemWidget.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        PayItemWidget.prototype.initType = function (ty) {
            this.m_nType = ty;
            switch (this.m_nType) {
                case PayItemWidgetType.NONE:
                    this.m_pLbName.visible = false;
                    this.m_pLbNum.visible = true;
                    this.height = 122;
                    break;
                case PayItemWidgetType.NUM_RIGHT:
                    this.setView();
                    break;
                case PayItemWidgetType.NUM_MIDDLE:
                    this.setView(32, 122, false, egret.HorizontalAlign.CENTER);
                    break;
                case PayItemWidgetType.NUM_LEFT:
                    this.setView(5, 122, false, egret.HorizontalAlign.LEFT);
                    break;
                case PayItemWidgetType.NAME_BOTTOM_RIGHT:
                    this.setView(60.5, 150, true, egret.HorizontalAlign.RIGHT, true);
                    break;
                case PayItemWidgetType.NAME_BOTTOM_MIDDLE:
                    this.setView(32, 150, true, egret.HorizontalAlign.CENTER, true);
                    break;
                case PayItemWidgetType.NAME_BOTTOM_LEFT:
                    this.setView(5, 150, true, egret.HorizontalAlign.LEFT, true);
                    break;
                case PayItemWidgetType.NAME_TOP_RIGHT:
                    this.setView(60.5, 150, true, egret.HorizontalAlign.RIGHT, false);
                    break;
                case PayItemWidgetType.NAME_TOP_MIDDLE:
                    this.setView(32, 150, true, egret.HorizontalAlign.CENTER, false);
                    break;
                case PayItemWidgetType.NAME_TOP_LEFT:
                    this.setView(5, 150, true, egret.HorizontalAlign.LEFT, false);
                    break;
                default:
                    this.setView();
                    break;
            }
        };
        PayItemWidget.prototype.setView = function (x, h, b, t, d) {
            this.m_pLbNum.textAlign = t || egret.HorizontalAlign.RIGHT;
            this.m_pLbNum.x = x || 60.5;
            this.m_pLbName.visible = b || false;
            this.height = h || 122;
            this.m_pLbName.y = d ? 124 : 2;
            this.m_pGMain.y = d ? 0 : 28;
        };
        return PayItemWidget;
    }(com_main.CComponent));
    com_main.PayItemWidget = PayItemWidget;
})(com_main || (com_main = {}));
