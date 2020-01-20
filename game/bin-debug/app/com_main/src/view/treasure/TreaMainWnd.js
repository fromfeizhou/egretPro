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
     * 藏宝阁
     */
    var TreaMainWnd = /** @class */ (function (_super_1) {
        __extends(TreaMainWnd, _super_1);
        function TreaMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = TreaMainWnd.NAME;
            _this.initApp("treasure/TreaMainWndSkin.exml");
            return _this;
        }
        TreaMainWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            if (this.m_tabList) {
                this.m_tabList.onDestroy();
                this.m_tabList = null;
            }
            if (this.m_tabCompo) {
                this.m_tabCompo.onDestroy();
                this.m_tabCompo = null;
            }
            SceneResGroupCfg.clearModelRes([ModuleEnums.TREA_VIEW]);
        };
        TreaMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TREA_TITLE));
            this.m_comTabGroup.initNorTabBtns([
                GCode(CLEnum.TREA_TAB_ALL), GCode(CLEnum.TREA_TAB_BQ), GCode(CLEnum.TREA_TAB_MP),
                GCode(CLEnum.TREA_TAB_ZB), GCode(CLEnum.TREA_TAG_HC)
            ]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            this.m_tabList = new com_main.TreaTabList(this.m_tabViewStack.width, this.m_tabViewStack.height);
            this.m_tabViewStack.addChild(this.m_tabList);
            this.m_tabCompo = new com_main.TreaTabCompo(this.m_tabViewStack.width, this.m_tabViewStack.height);
            this.m_tabViewStack.addChild(this.m_tabCompo);
            this.changeTag(0);
        };
        TreaMainWnd.prototype.changeTag = function (selIndex) {
            this.initView(selIndex);
        };
        TreaMainWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            if (tag > 3) {
                this.m_tabCompo.initView();
                this.m_tabViewStack.selectedIndex = 1;
            }
            else {
                this.m_tabViewStack.selectedIndex = 0;
                this.m_tabList.initView();
                this.m_tabList.changeTag(tag);
            }
        };
        TreaMainWnd.NAME = 'TreaMainWnd';
        return TreaMainWnd;
    }(com_main.CView));
    com_main.TreaMainWnd = TreaMainWnd;
})(com_main || (com_main = {}));
