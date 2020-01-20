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
    var BagDetailView = /** @class */ (function (_super_1) {
        __extends(BagDetailView, _super_1);
        function BagDetailView() {
            var _this = _super_1.call(this) || this;
            _this.name = BagDetailView.NAME;
            return _this;
        }
        BagDetailView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        BagDetailView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_ITEM_ADD, this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_ITEM_DEL, this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_ITEM_UPDATE, this);
            this.m_listItemView.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickWidget, this);
            com_main.EventManager.removeEventListeners(this);
        };
        BagDetailView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listItemView.dataProvider = this.m_tCollection;
            this.m_listItemView.itemRenderer = BagItemRender;
            this.m_listItemView.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickWidget, this);
            com_main.EventMgr.addEvent(BagEvent.BAG_ITEM_ADD, this.onBagItemAdd, this);
            com_main.EventMgr.addEvent(BagEvent.BAG_ITEM_DEL, this.onBagItemDel, this);
            com_main.EventMgr.addEvent(BagEvent.BAG_ITEM_UPDATE, this.onBagItemUpdate, this);
        };
        /**重置列表间距 */
        BagDetailView.prototype.resetListSize = function () {
            var _this = this;
            //调整item列表			
            egret.callLater(function () {
                if (_this.m_listItemView) {
                    Utils.tileGroupToCenter(_this.m_listItemView, 100);
                }
            }, this);
        };
        /**设置当前选中类型 */
        BagDetailView.prototype.setItemType = function (type) {
            if (this.m_nMainType == type)
                return;
            this.m_tCollection.removeAll();
            this.m_pScroll.stopAnimation();
            this.m_pScroll.viewport.scrollV = 0;
            this.m_nMainType = type;
            var list = PropModel.getPropItemListByTypes(this.m_nMainType, true);
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                res.push({ uuid: vo.uuid, sel: false });
            }
            this.m_tCollection.replaceAll(res);
            this.setSelectedIndex(0, true);
        };
        /**添加物品 */
        BagDetailView.prototype.onBagItemAdd = function (uuid) {
            var rdData = { uuid: uuid, sel: false };
            this.m_tCollection.addItem(rdData);
        };
        /**移除物品 */
        BagDetailView.prototype.onBagItemDel = function (uuid) {
            for (var i = this.m_tCollection.source.length - 1; i >= 0; i--) {
                var data = this.m_tCollection.getItemAt(i);
                if (data.uuid == (uuid)) {
                    this.m_tCollection.removeItemAt(i);
                    break;
                }
            }
            this.setSelectedIndex(0, true);
        };
        /**物品数量更新 */
        BagDetailView.prototype.onBagItemUpdate = function (uuid) {
            for (var i = this.m_tCollection.source.length - 1; i >= 0; i--) {
                var data = this.m_tCollection.getItemAt(i);
                if (data.uuid == (uuid)) {
                    this.m_tCollection.replaceItemAt(data, i);
                    break;
                }
            }
        };
        BagDetailView.prototype.onClickWidget = function (e) {
            this.setSelectedIndex(e.itemIndex);
        };
        /**设置当前选中 */
        BagDetailView.prototype.setSelectedIndex = function (index, isConst) {
            if (isConst === void 0) { isConst = false; }
            if (!isConst && this.m_nCurIndex == index)
                return;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
            var data = this.m_tCollection.getItemAt(index);
            if (data) {
                com_main.EventMgr.dispatchEvent(BagEvent.BAG_SELECTED_CHANGE, { tagId: this.m_nMainType[0], uuid: data.uuid });
            }
            else {
                com_main.EventMgr.dispatchEvent(BagEvent.BAG_SELECTED_CHANGE, { tagId: this.m_nMainType[0], uuid: null });
            }
        };
        /**刷新选中装备 */
        BagDetailView.prototype.refrestSelItem = function (index, val) {
            var data = this.m_tCollection.getItemAt(index);
            if (data) {
                data.sel = val;
                this.m_tCollection.replaceItemAt(data, index);
            }
        };
        BagDetailView.prototype.Enter = function () {
            this.setSelectedIndex(this.m_nCurIndex, true);
        };
        BagDetailView.NAME = 'BagDetailView';
        return BagDetailView;
    }(com_main.CComponent));
    com_main.BagDetailView = BagDetailView;
    var BagItemRender = /** @class */ (function (_super_1) {
        __extends(BagItemRender, _super_1);
        function BagItemRender() {
            return _super_1.call(this) || this;
        }
        BagItemRender.prototype.$onRemoveFromStage = function () {
            this.removeChild(this.m_item);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BagItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = 100;
            this.height = 100;
            this.m_item = com_main.ComItemNew.create('count', false);
            this.addChild(this.m_item);
            this.m_imgNew = new eui.Image('common_red_flag2_png');
            this.m_imgNew.x = 62;
            this.m_imgNew.y = -2;
            this.addChild(this.m_imgNew);
            this.m_imgNew.visible = false;
            this.m_imgSelected = new eui.Image('SelectKuang_png');
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;
        };
        BagItemRender.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel;
            var vo = PropModel.getPropByUId(this.m_tData.uuid);
            if (vo) {
                this.m_item.setItemInfo(vo.itemId, vo.count);
                this.m_imgNew.visible = vo.isNew;
            }
        };
        return BagItemRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
