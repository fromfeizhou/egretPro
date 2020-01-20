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
     * 宝物选中列表
     */
    var GeneralTreaListWnd = /** @class */ (function (_super_1) {
        __extends(GeneralTreaListWnd, _super_1);
        function GeneralTreaListWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = GeneralTreaListWnd.NAME;
            _this.m_nGeneralId = param.generalId;
            _this.m_nGeneralType = param.generalType;
            _this.initApp("general/GeneralTreaListWndSkin.exml");
            return _this;
        }
        GeneralTreaListWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralTreaListWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.GEN_TITLE_BWZB));
            this.m_btnEquip.setTitleLabel(GCode(CLEnum.GEN_TREA_ZB));
            this.refreshTreaList();
            com_main.EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquipHandler);
        };
        /**装备回调 */
        GeneralTreaListWnd.prototype.onBtnEquipHandler = function () {
            var data = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (data) {
                GeneralProxy.send_GENERAL_TREASURE_WEAR(this.m_nGeneralId, data.itemId);
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.GEN_TREA_NO), 1, true);
            }
            com_main.UpManager.history();
        };
        /**刷新列表显示 */
        GeneralTreaListWnd.prototype.refreshTreaList = function () {
            var generalVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!generalVo) {
                return;
            }
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemList.dataProvider = this.m_tCollection;
            this.m_pItemList.itemRenderer = TreaRender;
            this.m_pItemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTreaHandler, this);
            var list = TreasureModel.getTreasByGeneralType(this.m_nGeneralType);
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var treaVo = list[i];
                res.push({ itemId: treaVo.itemId, sel: false });
            }
            this.m_tCollection.replaceAll(res);
            this.setCurSelected(0);
        };
        /**设置当前选中 */
        GeneralTreaListWnd.prototype.setCurSelected = function (index) {
            if (this.m_nCurIndex == index)
                return;
            var item = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (item) {
                item.sel = false;
                this.m_tCollection.replaceItemAt(item, this.m_nCurIndex);
            }
            this.m_nCurIndex = index;
            item = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (item) {
                item.sel = true;
                this.m_tCollection.replaceItemAt(item, this.m_nCurIndex);
            }
        };
        /**选中宝石回调 */
        GeneralTreaListWnd.prototype.onTreaHandler = function (e) {
            this.setCurSelected(e.itemIndex);
        };
        GeneralTreaListWnd.NAME = 'GeneralTreaListWnd';
        return GeneralTreaListWnd;
    }(com_main.CView));
    com_main.GeneralTreaListWnd = GeneralTreaListWnd;
    var TreaRender = /** @class */ (function (_super_1) {
        __extends(TreaRender, _super_1);
        function TreaRender() {
            return _super_1.call(this) || this;
        }
        TreaRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TreaRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = new com_main.ComTreaItem();
            this.addChild(this.m_item);
        };
        TreaRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setInfo(this.m_tData.itemId);
                this.m_item.setSecected(this.m_tData.sel);
            }
        };
        return TreaRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
