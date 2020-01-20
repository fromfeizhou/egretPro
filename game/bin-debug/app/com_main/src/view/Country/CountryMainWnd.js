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
    var CountryMainWnd = /** @class */ (function (_super_1) {
        __extends(CountryMainWnd, _super_1);
        function CountryMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = CountryMainWnd.NAME;
            _this.initApp("Country/CountryMainWndSkin.exml");
            _this.m_curTagIndex = param == null ? 0 : param.defTag;
            return _this;
        }
        CountryMainWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.COUNTRY_UI]);
        };
        CountryMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.STATE));
            this.m_MainTopNew.setResources([PropEnum.MILITARY_MERITS_CONSUMED]);
            this.InitTagGroup();
            this.changeTag(this.m_curTagIndex);
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        CountryMainWnd.prototype.InitTagGroup = function () {
            this.m_TagGroup.initNorTabBtns([
                GCode(CLEnum.STATE_TAB_INFO),
                GCode(CLEnum.STATE_TAB_GZ),
                GCode(CLEnum.STATE_TAB_GL),
                GCode(CLEnum.STATE_TAB_DS),
                GCode(CLEnum.STATE_TAB_GZQB)
            ]);
            this.m_TagGroup.setChangeCallback(this.changeTag, this);
            var tabView1 = new com_main.CountryInfoView();
            this.m_ViewStack.addChild(tabView1);
            var tabView2 = new com_main.CountryJobView();
            this.m_ViewStack.addChild(tabView2);
            var tabView3 = new com_main.CountryManageView();
            this.m_ViewStack.addChild(tabView3);
            var tabView4 = new com_main.CountryTaskView();
            this.m_ViewStack.addChild(tabView4);
            var tabView5 = new com_main.CityChangeInfoView();
            this.m_ViewStack.addChild(tabView5);
            //官职管理界面红点
            RedPointModel.AddInfoListener(this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_GZ)), { x: 132, y: -5 }, [RedEvtType.JOB_COUNTRY], 1);
            //城市变更信息红点
            RedPointModel.AddInfoListener(this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_GZQB)), { x: 132, y: -5 }, [RedEvtType.CITY_CHANGE_COUNTRY], 1);
            RedPointModel.AddInfoListener(this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_DS)), { x: 132, y: -5 }, [RedEvtType.TASK_COUNTRY], 1);
            RedPointModel.AddInfoListener(this.m_TagGroup.getTabBtnByName(GCode(CLEnum.STATE_TAB_GL)), { x: 132, y: -5 }, [RedEvtType.TAX_COUNTRY], 1);
        };
        CountryMainWnd.prototype.changeTag = function (index) {
            this.m_TagGroup.selectedIndex = index;
            this.m_ViewStack.selectedIndex = index;
            //国家情报
            if (index == 4) {
                CountryModel.setCityChangeRed(false);
            }
        };
        CountryMainWnd.NAME = 'CountryMainWnd';
        return CountryMainWnd;
    }(com_main.CView));
    com_main.CountryMainWnd = CountryMainWnd;
})(com_main || (com_main = {}));
