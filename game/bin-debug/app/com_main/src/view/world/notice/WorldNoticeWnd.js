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
    /**
     * 国战预告主界面
     */
    var WorldNoticeWnd = /** @class */ (function (_super_1) {
        __extends(WorldNoticeWnd, _super_1);
        function WorldNoticeWnd() {
            var _this = _super_1.call(this) || this;
            _this.m_curIndex = 0;
            _this.m_tViews = [];
            _this.name = WorldNoticeWnd.NAME;
            _this.initApp("world/notice/WorldNoticeWndSkin.exml");
            return _this;
        }
        WorldNoticeWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.m_tViews = null;
            com_main.EventManager.removeEventListeners(this);
        };
        WorldNoticeWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.WORLD_NOTICE_TITLE));
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.WORLD_NOTICE_DESC) });
            // this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.WORLD_NOTICE_FIGHT) });
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            var tabView1 = new com_main.WorldWarExplainView(width, height);
            this.m_tabViewStack.addChild(tabView1);
            // let tabView2 = new WorldWarExplainView(width, height);
            // this.m_tabViewStack.addChild(tabView2);
            this.validateNow();
            this.initView(this.m_curIndex);
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        WorldNoticeWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        };
        WorldNoticeWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
        };
        WorldNoticeWnd.NAME = 'WorldNoticeWnd';
        return WorldNoticeWnd;
    }(com_main.CView));
    com_main.WorldNoticeWnd = WorldNoticeWnd;
})(com_main || (com_main = {}));
