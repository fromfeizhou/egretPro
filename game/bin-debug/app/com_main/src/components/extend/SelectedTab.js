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
    var SelectedTab = /** @class */ (function (_super_1) {
        __extends(SelectedTab, _super_1);
        function SelectedTab(isAddSkin) {
            var _this = _super_1.call(this) || this;
            if (isAddSkin) {
                // this.skinName = Utils.getComExml("pop","PopTabSkin.exml");
                _this.skinName = Utils.getComSkin("PopTabSkin.exml");
            }
            return _this;
        }
        SelectedTab.prototype.createChildren = function () {
            this.currentState = "left";
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.createChildren.call(this);
        };
        Object.defineProperty(SelectedTab.prototype, "tabBar", {
            set: function (tabBar) {
                this.y_TabBar = tabBar;
            },
            enumerable: true,
            configurable: true
        });
        SelectedTab.prototype.selectTab = function () {
            this.data = this.y_TabBar.selectedItem;
            this.setSelectTabPosition();
        };
        SelectedTab.prototype.setSelectTabPosition = function () {
            this.currentState = this.y_TabBar.selectedIndex == 0 ? "left" : this.y_TabBar.selectedIndex == (this.y_TabBar.numElements - 1) ? "right" : "down";
            if (this.y_TabBar.numElements < 4 && this.currentState == 'right')
                this.currentState = 'down';
            // debug("this.m_pSelectTab.currentState",this.currentState);
            this.x = 15 + this.y_TabBar.selectedIndex * this.width;
        };
        return SelectedTab;
    }(com_main.ListItemRenderer));
    com_main.SelectedTab = SelectedTab;
})(com_main || (com_main = {}));
