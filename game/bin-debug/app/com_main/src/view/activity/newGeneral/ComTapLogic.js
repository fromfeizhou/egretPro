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
    var ComTabLogic = /** @class */ (function (_super_1) {
        __extends(ComTabLogic, _super_1);
        function ComTabLogic() {
            var _this = _super_1.call(this) || this;
            _this.m_curSelectIndex = -1;
            return _this;
        }
        ComTabLogic.prototype.init = function (tabList, panelList) {
            if (tabList.length != panelList.length) {
                error("按钮和面板数量不一致");
                return;
            }
            this.m_tabList = tabList;
            this.m_panelList = panelList;
            for (var i = 0; i < this.m_tabList.length; i++) {
                var tab = this.m_tabList[i];
                tab.setTabIndex(i);
            }
            this.showPanelByIndex(0);
            this.initEvent();
        };
        ComTabLogic.prototype.onDestory = function () {
            this.m_tabList = null;
            this.m_panelList = null;
            this.removeEvent();
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        ComTabLogic.prototype.initEvent = function () {
            for (var _i = 0, _a = this.m_tabList; _i < _a.length; _i++) {
                var tab = _a[_i];
                var tab1 = tab;
                com_main.EventManager.addTouchScaleListener(tab1, this, this.onCloseTab);
            }
        };
        ComTabLogic.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        ComTabLogic.prototype.onCloseTab = function (e) {
            var target = e.target;
            var i = 0;
            while (isNull(target.getTabIndex) && i < 10) {
                target = target.parent;
                i++;
            }
            if (target.getTabIndex() >= 0) {
                this.showPanelByIndex(target.getTabIndex());
            }
        };
        ComTabLogic.prototype.showPanelByIndex = function (index) {
            if (this.m_curSelectIndex == index) {
                return;
            }
            this.m_curSelectIndex = index;
            for (var _i = 0, _a = this.m_panelList; _i < _a.length; _i++) {
                var panel = _a[_i];
                panel.visible = false;
            }
            for (var _b = 0, _c = this.m_tabList; _b < _c.length; _b++) {
                var tab = _c[_b];
                tab.setSelectState(false);
            }
            if (this.m_panelList[index]) {
                this.m_panelList[index].visible = true;
            }
            if (this.m_tabList[index]) {
                this.m_tabList[index].setSelectState(true);
            }
        };
        return ComTabLogic;
    }(egret.DisplayObject));
    com_main.ComTabLogic = ComTabLogic;
})(com_main || (com_main = {}));
