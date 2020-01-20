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
    /**战车属性项 */
    var TankAttributeItem = /** @class */ (function (_super_1) {
        __extends(TankAttributeItem, _super_1);
        function TankAttributeItem() {
            return _super_1.call(this) || this;
        }
        Object.defineProperty(TankAttributeItem.prototype, "value", {
            set: function (v) {
                this.m_lbValue.text = v + "";
            },
            enumerable: true,
            configurable: true
        });
        return TankAttributeItem;
    }(com_main.CComponent));
    com_main.TankAttributeItem = TankAttributeItem;
})(com_main || (com_main = {}));
