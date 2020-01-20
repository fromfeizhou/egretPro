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
     * 宝石镶嵌列表
     */
    var TreaInLayWnd = /** @class */ (function (_super_1) {
        __extends(TreaInLayWnd, _super_1);
        function TreaInLayWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_nItemId = param.itemId;
            _this.m_nPos = param.pos;
            _this.m_nOldStoneId = param.oldStoneId;
            _this.initApp("treasure/TreaInLayWndSkin.exml");
            return _this;
        }
        TreaInLayWnd.prototype.onDestroy = function () {
            this.m_pItemList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onStoneItemHandler, this);
            _super_1.prototype.onDestroy.call(this);
        };
        TreaInLayWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.TREA_BS_CHOSE));
            this.m_btnEquip.setTitleLabel(GCode(CLEnum.TREA_BS_XQ));
            this.m_btnUnEquip.setTitleLabel(GCode(CLEnum.TREA_STONE_XX));
            this.m_tCollection = new eui.ArrayCollection();
            this.m_pItemList.dataProvider = this.m_tCollection;
            this.m_pItemList.itemRenderer = StoneRender;
            var list = PropModel.getGemList(PropStoneType.ALL);
            var res = [];
            for (var i = 0; i < list.length; i++) {
                if (this.m_nOldStoneId != list[i].itemId) {
                    var data = { itemId: list[i].itemId, pos: this.m_nPos, sel: false, equip: false };
                    res.push(data);
                }
            }
            var targetType = 0;
            if (this.m_nOldStoneId > 0) {
                targetType = C.GemstoneConfig[this.m_nOldStoneId].type;
            }
            res.sort(function (a, b) {
                var typeA = C.GemstoneConfig[a.itemId].type;
                var typeB = C.GemstoneConfig[b.itemId].type;
                if (typeA == typeB) {
                    return b.itemId - a.itemId;
                }
                if (targetType > 0) {
                    if (typeA == targetType)
                        return -1;
                    if (typeB == targetType)
                        return 1;
                }
                return typeA - typeB;
            });
            if (this.m_nOldStoneId > 0) {
                res.unshift({ itemId: this.m_nOldStoneId, pos: this.m_nPos, sel: false, equip: true });
            }
            this.m_tCollection.replaceAll(res);
            this.setCurSelected(0);
            com_main.EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquipHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnUnEquip, this, this.onBtnUnEquipHandler);
            this.m_pItemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onStoneItemHandler, this);
        };
        /**设置当前选中 */
        TreaInLayWnd.prototype.setCurSelected = function (index) {
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
                this.m_btnEquip.visible = !item.equip;
                this.m_btnUnEquip.visible = item.equip;
                item.sel = true;
                this.m_tCollection.replaceItemAt(item, this.m_nCurIndex);
            }
        };
        /**选中宝石回调 */
        TreaInLayWnd.prototype.onStoneItemHandler = function (e) {
            this.setCurSelected(e.itemIndex);
        };
        /**镶嵌按钮回调 */
        TreaInLayWnd.prototype.onBtnEquipHandler = function () {
            var data = this.m_tCollection.getItemAt(this.m_nCurIndex);
            if (data) {
                TreasureProxy.send_TREASURE_ASSEMBLING_GEMSTONE(this.m_nItemId, this.m_nPos, data.itemId);
            }
            com_main.UpManager.history();
        };
        /**卸下 */
        TreaInLayWnd.prototype.onBtnUnEquipHandler = function () {
            TreasureProxy.send_TREASURE_ASSEMBLING_GEMSTONE(this.m_nItemId, this.m_nPos, 0);
            com_main.UpManager.history();
        };
        return TreaInLayWnd;
    }(com_main.CView));
    com_main.TreaInLayWnd = TreaInLayWnd;
    var StoneRender = /** @class */ (function (_super_1) {
        __extends(StoneRender, _super_1);
        function StoneRender() {
            return _super_1.call(this) || this;
        }
        StoneRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            if (this.m_imgSelect) {
                Utils.removeFromParent(this.m_imgSelect);
                this.m_imgSelect = null;
            }
        };
        StoneRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = new com_main.TreaInLayListItem();
            this.addChild(this.m_item);
            this.m_imgSelect = new com_main.CImage("border_015_png");
            this.m_imgSelect.scale9Grid = new egret.Rectangle(28, 19, 26, 42);
            this.m_imgSelect.x = -4;
            this.m_imgSelect.y = -4;
            this.m_imgSelect.width = 331;
            this.m_imgSelect.height = 142;
            this.addChild(this.m_imgSelect);
        };
        StoneRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.pos);
                this.m_item.setEquipState(this.m_tData.equip);
                this.m_imgSelect.visible = this.m_tData.sel;
            }
        };
        return StoneRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
