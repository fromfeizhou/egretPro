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
    var ItemSourceView = /** @class */ (function (_super_1) {
        __extends(ItemSourceView, _super_1);
        function ItemSourceView(itemId) {
            if (itemId === void 0) { itemId = 0; }
            var _this = _super_1.call(this) || this;
            _this.m_itemId = 0;
            _this.name = ItemSourceView.NAME;
            _this.initApp("common/item_source_view.exml");
            _this.m_itemId = itemId;
            _this.m_itemConfig = PropModel.getCfg(itemId);
            return _this;
        }
        ItemSourceView.prototype.onDestroy = function () {
            if (this.m_groupRender.numChildren) {
                for (var i = 0; i < this.m_groupRender.numChildren; i++) {
                    var item = this.m_groupRender.getChildAt(i);
                    item.onDestroy();
                }
            }
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            _super_1.prototype.onDestroy.call(this);
        };
        ItemSourceView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (!this.m_itemConfig)
                return;
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
            this.m_apopUp.setTitleLabel(GLan(this.m_itemConfig.name) + GCode(CLEnum.SOURCE));
            this.m_apopUp.setBottomBorder();
            this.m_itemView.openTips = false;
            this.refresh();
        };
        /**物品数量变化 */
        ItemSourceView.prototype.onPropItemChange = function (itemId) {
            if (itemId == this.m_itemId) {
                this.refreshItemNum();
            }
        };
        /**刷新面板 */
        ItemSourceView.prototype.refresh = function () {
            this.m_itemView.itemId = this.m_itemId;
            Utils.setPropLabName(this.m_itemId, this.m_labName);
            this.refreshItemNum();
            this.m_labDes.text = this.m_itemConfig.description;
            var sourceids = this.m_itemConfig.sourcePage.split(",");
            for (var i = 0; i < sourceids.length; i++) {
                var sourceId = Number(sourceids[i]);
                if (sourceId > 0) {
                    var render = new com_main.ItemSourceViewRender();
                    render.setItemId(sourceId);
                    this.m_groupRender.addChild(render);
                }
            }
        };
        /**刷新数量 */
        ItemSourceView.prototype.refreshItemNum = function () {
            var itemCfg = C.ItemConfig[this.m_itemId];
            var isResource = itemCfg.type == PropType.RESOURCE; //是否是资源
            var itemNum = 0;
            if (itemCfg) {
                if (isResource) {
                    if (itemCfg.id == PropEnum.EXP) {
                        itemNum = RoleData.GetMaterialNumById(this.m_itemId) <= 0 ? 0 : RoleData.GetMaterialNumById(this.m_itemId);
                        this.m_labNum.text = itemNum <= 0 ? '已满级' : itemNum.toString();
                        return;
                    }
                    else {
                        itemNum = RoleData.GetMaterialNumById(this.m_itemId);
                    }
                }
                else {
                    itemNum = PropModel.getPropNum(this.m_itemId);
                }
            }
            this.m_labNum.text = itemNum.toString();
        };
        ItemSourceView.NAME = "ItemSourceView";
        return ItemSourceView;
    }(com_main.CView));
    com_main.ItemSourceView = ItemSourceView;
})(com_main || (com_main = {}));
