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
    var SelectRewardItem = /** @class */ (function (_super_1) {
        __extends(SelectRewardItem, _super_1);
        function SelectRewardItem(itemInfo, sel) {
            var _this = _super_1.call(this) || this;
            _this.m_itemInfo = itemInfo;
            _this.m_sel = sel;
            return _this;
        }
        SelectRewardItem.prototype.$onRemoveFromStage = function () {
            this.removeChild(this.m_item);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        SelectRewardItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = 100;
            this.height = 100;
            this.m_item = com_main.ComItemNew.create('count', false);
            this.addChild(this.m_item);
            this.m_imgSelected = new eui.Image('SelectKuang_png');
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;
            this.setSel(this.m_sel);
            this.refreshUI();
        };
        SelectRewardItem.prototype.getRewardItemInfo = function () {
            return this.m_itemInfo;
        };
        SelectRewardItem.prototype.setSel = function (boo) {
            this.m_sel = boo;
            this.m_imgSelected.visible = this.m_sel;
        };
        SelectRewardItem.prototype.refreshUI = function () {
            this.m_item.setItemInfo(this.m_itemInfo.itemId, this.m_itemInfo.count);
        };
        return SelectRewardItem;
    }(eui.Component));
    com_main.SelectRewardItem = SelectRewardItem;
})(com_main || (com_main = {}));
