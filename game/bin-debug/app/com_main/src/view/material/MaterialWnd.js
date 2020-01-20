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
    var _a;
    /**
     * 材料副本主界面
     */
    var MaterialWnd = /** @class */ (function (_super_1) {
        __extends(MaterialWnd, _super_1);
        function MaterialWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_curIndex = 0;
            _this.m_tViews = [];
            _this.m_tabInfo = [
                { name: GCode(CLEnum.MAT_TAB_YL) },
                { name: GCode(CLEnum.MAT_TAB_QH) },
                { name: GCode(CLEnum.MAT_TAB_SJ) },
                { name: GCode(CLEnum.MAT_TAB_JL) },
                { name: GCode(CLEnum.MAT_TAB_BD) }
            ];
            _this.name = MaterialWnd.NAME;
            _this.m_curIndex = param.tag ? MaterialWnd.TYPE_TO_ID[param.tag] : 0;
            _this.m_curIndex = _this.m_curIndex || 0;
            _this.initApp("material/MaterialWndSkin.exml");
            return _this;
        }
        MaterialWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.m_tViews = null;
            MaterialModel.copyType = 0;
            com_main.EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.BOSS_UI, ModuleEnums.ARENA_UI]);
        };
        MaterialWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.MAT));
            for (var i = 0; i < this.m_tabInfo.length; i++) {
                this.m_comTabGroup.addTabBtnData(this.m_tabInfo[i]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            this.initTabView();
            this.initView(this.m_curIndex);
            this.onGuideCondition();
        };
        /**界面初始化 */
        MaterialWnd.prototype.initTabView = function () {
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            var list = MaterialModel.materialList;
            for (var i = 0; i < list.length; i++) {
                var view = new com_main.MaterialView(list[i], width, height);
                this.m_tabViewStack.addChild(view);
                this.m_tViews.push(view);
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(this.m_tabInfo[i].name), { x: 132, y: -5 }, [RedEvtType.MATER_WAR], 2, { materialEnum: list[i] });
            }
        };
        MaterialWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        };
        MaterialWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
            this.m_tViews[tag].initView();
            if (tag == 0) { //银两副本
                this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER]);
            }
            else {
                this.m_MainTopNew.setResources([PropEnum.GOLD]);
            }
        };
        /**检查新手引导面板条件 */
        MaterialWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MATERIA_CAMP_WND);
        };
        MaterialWnd.NAME = 'MaterialWnd';
        MaterialWnd.TYPE_TO_ID = (_a = {},
            _a[MaterialEnum.Streng] = 1,
            _a[MaterialEnum.Lorder] = 2,
            _a[MaterialEnum.Refin] = 3,
            // [MaterialEnum.Destiny]: 4,
            _a[MaterialEnum.SoldRefin] = 4,
            _a);
        return MaterialWnd;
    }(com_main.CView));
    com_main.MaterialWnd = MaterialWnd;
})(com_main || (com_main = {}));
