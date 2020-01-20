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
    var SevenIILeiChargePanel = /** @class */ (function (_super_1) {
        __extends(SevenIILeiChargePanel, _super_1);
        function SevenIILeiChargePanel() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIILeiChargePanelSkin.exml");
            return _this;
        }
        SevenIILeiChargePanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        SevenIILeiChargePanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        //初始化
        SevenIILeiChargePanel.prototype.init = function (data) {
            // this.refreshItem();
        };
        SevenIILeiChargePanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**选中状态 */
        SevenIILeiChargePanel.prototype.select = function (select) {
        };
        /**设置物品信息 */
        SevenIILeiChargePanel.prototype.refreshItem = function (itemId, num) {
        };
        return SevenIILeiChargePanel;
    }(com_main.CComponent));
    com_main.SevenIILeiChargePanel = SevenIILeiChargePanel;
})(com_main || (com_main = {}));
