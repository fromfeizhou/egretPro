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
    var TurnTableItem = /** @class */ (function (_super_1) {
        __extends(TurnTableItem, _super_1);
        function TurnTableItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/turntable/TurnTableItemSkin.exml");
            return _this;
        }
        TurnTableItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TurnTableItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        //初始化
        TurnTableItem.prototype.init = function (data) {
            // this.refreshItem();
        };
        TurnTableItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**选中状态 */
        TurnTableItem.prototype.select = function (select) {
            if (select) {
                this.m_imgBg.source = 'zyt_36_png';
            }
            else {
                this.m_imgBg.source = 'zyt_35_png';
            }
        };
        /**设置物品信息 */
        TurnTableItem.prototype.refreshItem = function (itemId, num, reset) {
            this.m_pComItem.setItemInfo(itemId, num);
            this.setItemName(itemId);
            this.ShowLogo(reset);
        };
        /**设置物品名字 */
        TurnTableItem.prototype.setItemName = function (itemId) {
            if (this.m_labName) {
                Utils.setPropLabName(itemId, this.m_labName);
            }
        };
        /**设置稀有物品标识 */
        TurnTableItem.prototype.ShowLogo = function (reset) {
            this.m_RareRoot.visible = reset == 1;
        };
        return TurnTableItem;
    }(com_main.CComponent));
    com_main.TurnTableItem = TurnTableItem;
})(com_main || (com_main = {}));
