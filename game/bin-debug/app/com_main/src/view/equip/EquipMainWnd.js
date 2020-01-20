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
     * 装备主界面
     */
    var EquipMainWnd = /** @class */ (function (_super_1) {
        __extends(EquipMainWnd, _super_1);
        function EquipMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_tViews = [];
            _this.m_curIndex = 0;
            _this.name = EquipMainWnd.NAME;
            _this.m_curIndex = (param && param.tag) ? param.tag : 0;
            _this.m_nGeneralId = (param && param.generalId) ? param.generalId : 0;
            _this.initApp("equip/EquipMainWndSkin.exml");
            return _this;
        }
        EquipMainWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.m_tViews = null;
            com_main.EventManager.removeEventListeners(this);
        };
        EquipMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.EQUIP));
            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_ZB)] = { tag: 0, id: 0 };
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_QH)] = { tag: 0, id: 1 };
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_SJ)] = { tag: 0, id: 2 };
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_JL)] = { tag: 0, id: 3 };
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_HC)] = { tag: 1, id: 0 };
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_HS)] = { tag: 2, id: 0 };
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.refreshTabBtns();
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            var strengView = new com_main.EquipStrengView(width, height, this.m_nGeneralId);
            this.m_tabViewStack.addChild(strengView);
            var compareView = new com_main.EquipComposeView(width, height);
            this.m_tabViewStack.addChild(compareView);
            var deCompareView = new com_main.EquipDeComposeView(width, height);
            this.m_tabViewStack.addChild(deCompareView);
            this.m_tViews.push(strengView);
            this.m_tViews.push(compareView);
            this.m_tViews.push(deCompareView);
            this.validateNow();
            this.initView(this.m_curIndex);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_ZB)), { x: 132, y: -5 }, [RedEvtType.GEN_EQUIP], 2);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_QH)), { x: 132, y: -5 }, [RedEvtType.GEN_EQ_LV], 2);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_SJ)), { x: 132, y: -5 }, [RedEvtType.GEN_EQ_GRADE], 2);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_JL)), { x: 132, y: -5 }, [RedEvtType.GEN_EQ_WROUGHT], 2);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_HC)), { x: 132, y: -5 }, [RedEvtType.EQUIP_COMPOSE], 2);
            this.onGuideCondition();
        };
        EquipMainWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        };
        /**刷新切卡 */
        EquipMainWnd.prototype.refreshTabBtns = function () {
            this.m_comTabGroup.clearTabBtn();
            var tags = [GCode(CLEnum.EQUIP_TAB_ZB)];
            if (FunctionModel.isFunctionOpen(FunctionType.EQUIPMENT_STENG))
                tags.push(GCode(CLEnum.EQUIP_TAB_QH));
            if (FunctionModel.isFunctionOpen(FunctionType.EQUIPMENT_GRADE))
                tags.push(GCode(CLEnum.EQUIP_TAB_SJ));
            if (FunctionModel.isFunctionOpen(FunctionType.EQUIPMENT_WROUGH))
                tags.push(GCode(CLEnum.EQUIP_TAB_JL));
            tags = tags.concat([GCode(CLEnum.EQUIP_TAB_HC), GCode(CLEnum.EQUIP_TAB_HS)]);
            this.m_comTabGroup.initNorTabBtns(tags);
        };
        EquipMainWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            var name = this.m_comTabGroup.selName;
            var data = this.m_tabData[name];
            if (data) {
                this.m_tabViewStack.selectedIndex = data.tag;
                if (data.tag == 0) {
                    this.m_tViews[0].changeTag(data.id);
                    this.changeSourceTile(data.id);
                }
                else {
                    this.changeSourceTile(0);
                }
            }
        };
        /**改变资源标题 */
        EquipMainWnd.prototype.changeSourceTile = function (id) {
            switch (id) {
                case 1:
                    this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.EQUIP_QH, PropEnum.SILVER]);
                    break;
                case 2:
                    this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.EQUIP_SJ, PropEnum.SILVER]);
                    break;
                case 3:
                    this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.EQUIP_JL]);
                    break;
                default:
                    this.m_MainTopNew.setResources([]);
                    break;
            }
        };
        /**检查新手引导面板条件 */
        EquipMainWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.EQUIP_WND);
        };
        EquipMainWnd.NAME = 'EquipMainWnd';
        return EquipMainWnd;
    }(com_main.CView));
    com_main.EquipMainWnd = EquipMainWnd;
})(com_main || (com_main = {}));
