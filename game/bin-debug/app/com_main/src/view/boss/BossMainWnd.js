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
     * 血战群雄主界面
     */
    var BossMainWnd = /** @class */ (function (_super_1) {
        __extends(BossMainWnd, _super_1);
        function BossMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_curIndex = 0;
            _this.m_tViews = [];
            _this.name = BossMainWnd.NAME;
            if (param.type == BossEnum.Rank) {
                _this.m_curIndex = 1;
            }
            else if (param.type == BossEnum.World) {
                _this.m_curIndex = 2;
            }
            else {
                _this.m_curIndex = 0;
            }
            _this.initApp("boss/BossMainWndSkin.exml");
            return _this;
        }
        BossMainWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.m_tViews = null;
            BossModel.challType = 0;
            com_main.EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.BOSS_UI]);
        };
        BossMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.BOSS_TITLE));
            this.m_MainTopNew.setResources([PropEnum.GOLD]);
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BOSS_TAB_GR) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BOSS_TAB_PM) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BOSS_TAB_SJ) });
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            var tabView1 = new com_main.BossChallView(BossEnum.Single, width, height);
            this.m_tabViewStack.addChild(tabView1);
            var tabView2 = new com_main.BossChallView(BossEnum.Rank, width, height);
            this.m_tabViewStack.addChild(tabView2);
            var tabView3 = new com_main.BossChallView(BossEnum.World, width, height);
            this.m_tabViewStack.addChild(tabView3);
            this.m_tViews.push(tabView1);
            this.m_tViews.push(tabView2);
            this.m_tViews.push(tabView3);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.BOSS_TAB_GR)), { x: 132, y: -5 }, [RedEvtType.BOSS_SINGLE], 2);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.BOSS_TAB_PM)), { x: 132, y: -5 }, [RedEvtType.BOSS_RANK], 2);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.BOSS_TAB_SJ)), { x: 132, y: -5 }, [RedEvtType.BOSS_WORLD], 2);
            this.validateNow();
            this.initView(this.m_curIndex);
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        BossMainWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
            var ids = [IGUIDECD.BOSS_TAB_PRI, IGUIDECD.BOSS_TAB_RANK, IGUIDECD.BOSS_TAB_WOR];
            this.onGuideConditionTab(ids[selIndex]);
        };
        BossMainWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
        };
        /**检查新手引导面板条件 */
        BossMainWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.BOSS_WND);
        };
        /**检查新手引导面板条件 */
        BossMainWnd.prototype.onGuideConditionTab = function (id) {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        };
        BossMainWnd.NAME = 'BossMainWnd';
        return BossMainWnd;
    }(com_main.CView));
    com_main.BossMainWnd = BossMainWnd;
})(com_main || (com_main = {}));
