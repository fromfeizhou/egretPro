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
     * 联盟面板相关
     */
    var LegionMainWnd = /** @class */ (function (_super_1) {
        __extends(LegionMainWnd, _super_1);
        function LegionMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_nCurIndex = 0;
            _this.m_nCurIndex = param && param.tag ? param.tag : 0;
            _this.name = LegionMainWnd.NAME;
            _this.initApp("legion/LegionMainWndSkin.exml");
            return _this;
        }
        LegionMainWnd.prototype.onDestroy = function () {
            this.m_tViews = null;
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.LEGION_UI]);
        };
        LegionMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.GUILD));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_comTabGroup.initNorTabBtns([GCode(CLEnum.GUILD), GCode(CLEnum.GUILD_TAB_TECHNO), GCode(CLEnum.GUILD_TAB_SHOP)]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            for (var i = 0; i < 4; i++) {
                this.m_tabViewStack.addChild(new egret.DisplayObjectContainer());
            }
            this.validateNow();
            this.m_tabSize = { width: this.m_tabViewStack.width, height: this.m_tabViewStack.height };
            this.m_tViews = {};
            this.changeTag(this.m_nCurIndex);
        };
        /**创建子面板 */
        LegionMainWnd.prototype.createTabView = function (index) {
            if (this.m_tViews[index])
                return;
            var tabView = null;
            switch (this.m_comTabGroup.selName) {
                case GCode(CLEnum.GUILD): {
                    tabView = new com_main.LegionInfoView(this.m_tabSize);
                    break;
                }
                case GCode(CLEnum.GUILD_TAB_TECHNO): {
                    tabView = new com_main.LegionDonationView(this.m_tabSize);
                    break;
                }
                case GCode(CLEnum.GUILD_TAB_SHOP): {
                    tabView = new com_main.LegionShopView(this.m_tabSize);
                    break;
                }
                // case '排行': {
                //     tabView = new LegionRankView(this.m_tabSize);
                //     break;
                // }
            }
            if (tabView) {
                this.m_tViews[index] = tabView;
                var container = this.m_tabViewStack.getChildAt(index);
                container.addChild(tabView);
            }
        };
        LegionMainWnd.prototype.changeTag = function (index) {
            this.initView(index);
        };
        LegionMainWnd.prototype.initView = function (index) {
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
            this.createTabView(index);
            if (index == 2) {
                this.m_MainTopNew.setResources([PropEnum.GUILD_POINT]);
            }
            else {
                this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            }
        };
        LegionMainWnd.NAME = 'LegionMainWnd';
        return LegionMainWnd;
    }(com_main.CView));
    com_main.LegionMainWnd = LegionMainWnd;
})(com_main || (com_main = {}));
