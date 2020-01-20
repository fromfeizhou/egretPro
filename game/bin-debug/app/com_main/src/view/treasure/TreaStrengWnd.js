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
    /**宝物强化界面 */
    var TreaStrengWnd = /** @class */ (function (_super_1) {
        __extends(TreaStrengWnd, _super_1);
        // private m_tabCompo: TreaTabCompo;
        function TreaStrengWnd(id) {
            var _this = _super_1.call(this) || this;
            _this.m_nItemId = id;
            _this.name = TreaStrengWnd.NAME;
            _this.initApp("treasure/TreaStrengWndSkin.exml");
            return _this;
        }
        TreaStrengWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            if (this.m_tabStreng) {
                this.m_tabStreng.onDestroy();
                this.m_tabStreng = null;
            }
            // if (this.m_tabCompo) {
            //     this.m_tabCompo.onDestroy();
            //     this.m_tabCompo = null;
            // }
            com_main.EventManager.removeEventListeners(this);
        };
        TreaStrengWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TREA));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            if (TreasureModel.isOwner(this.m_nItemId)) {
                this.m_comTabGroup.initNorTabBtns([
                    GCode(CLEnum.TREA_TAG_SX), GCode(CLEnum.TREA_TAG_QH), GCode(CLEnum.TREA_TAG_SXI),
                    GCode(CLEnum.TREA_TAG_XQ)
                ]);
            }
            else {
                this.m_comTabGroup.initNorTabBtns([
                    GCode(CLEnum.TREA_TAG_SX)
                ]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            this.m_tabStreng = new com_main.TreaTabStreng(width, height, this.m_nItemId);
            this.m_tabViewStack.addChild(this.m_tabStreng);
            // this.m_tabCompo = new TreaTabCompo(width, height);
            // this.m_tabViewStack.addChild(this.m_tabCompo);
            //刷新子节点宽高适配
            this.validateNow();
            if (TreasureModel.isOwner(this.m_nItemId)) {
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TREA_TAG_QH)), { x: 132, y: -5 }, [RedEvtType.TREA_STRENG], 2, { treaId: this.m_nItemId });
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TREA_TAG_SXI)), { x: 132, y: -5 }, [RedEvtType.TREA_STAR], 2, { treaId: this.m_nItemId });
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TREA_TAG_XQ)), { x: 132, y: -5 }, [RedEvtType.TREA_INLAY], 2, { treaId: this.m_nItemId });
            }
            this.changeTag(0);
        };
        TreaStrengWnd.prototype.changeTag = function (selIndex) {
            this.initView(selIndex);
        };
        TreaStrengWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            // if (tag <= 3) {
            this.m_tabStreng.changeTag(tag);
            // this.m_tabViewStack.selectedIndex = 0;
            // return;
            // }
            // this.m_tabViewStack.selectedIndex = tag - 3;
        };
        TreaStrengWnd.NAME = 'TreaStrengWnd';
        return TreaStrengWnd;
    }(com_main.CView));
    com_main.TreaStrengWnd = TreaStrengWnd;
})(com_main || (com_main = {}));
