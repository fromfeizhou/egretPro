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
     *
     * @author
     *
     */
    var ComPayButton = /** @class */ (function (_super_1) {
        __extends(ComPayButton, _super_1);
        function ComPayButton() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        Object.defineProperty(ComPayButton.prototype, "cost", {
            set: function (cost) {
                if (PlatConst.isRmbPay()) {
                    this.setCostImg('');
                    this.setCostLabel('￥ ' + cost);
                }
                else {
                    this.setCostLabel(cost.toString());
                    this.setImagePropId(PropEnum.YU);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComPayButton.prototype, "otherLabel", {
            /**设置按钮文本（移除价格显示） */
            set: function (str) {
                this.setCostImg('');
                this.setCostLabel(str);
            },
            enumerable: true,
            configurable: true
        });
        return ComPayButton;
    }(com_main.ComCostButton));
    com_main.ComPayButton = ComPayButton;
})(com_main || (com_main = {}));
