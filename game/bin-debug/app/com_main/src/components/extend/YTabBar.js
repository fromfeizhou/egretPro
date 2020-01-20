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
    var YTabBarItem = /** @class */ (function (_super_1) {
        __extends(YTabBarItem, _super_1);
        function YTabBarItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getComSkin("PopTabSkin.exml");
            return _this;
        }
        YTabBarItem.prototype.$onRemoveFromStage = function () {
            this.data = null;
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        YTabBarItem.prototype.dataChanged = function () {
            if (!this.data)
                return;
            this.Img_Bg.source = this.data.enabled ? "Common_Tab1_png" : "Common_Tab1_png";
            this.Img_Icon.source = this.data.icon;
        };
        YTabBarItem.prototype.onTouchBegin = function (event) {
            if (this.data.enabled) {
                _super_1.prototype.onTouchBegin.call(this, event);
            }
            else {
                if (this.data.enabledTips) {
                    com_main.MessageTip.AddMessageError(this.data.enabledTips);
                }
                event.stopImmediatePropagation();
            }
        };
        return YTabBarItem;
    }(com_main.ListItemRenderer));
    com_main.YTabBarItem = YTabBarItem;
    var YTabBar = /** @class */ (function (_super_1) {
        __extends(YTabBar, _super_1);
        function YTabBar() {
            var _this = _super_1.call(this) || this;
            _this.m_iOldIndex = 0;
            return _this;
        }
        YTabBar.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.itemRenderer = YTabBarItem;
        };
        return YTabBar;
    }(eui.TabBar));
    com_main.YTabBar = YTabBar;
})(com_main || (com_main = {}));
