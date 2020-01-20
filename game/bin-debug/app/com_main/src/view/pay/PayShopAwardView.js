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
    var PayShopAwardView = /** @class */ (function (_super_1) {
        __extends(PayShopAwardView, _super_1);
        function PayShopAwardView(type) {
            var _this = _super_1.call(this) || this;
            _this.activityType = type;
            _this.skinName = Utils.getSkinName("app/pay/PayShopAwardSkin.exml");
            return _this;
        }
        PayShopAwardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PayShopAwardView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PayShopAwardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.refreshView();
        };
        /**刷新显示 */
        PayShopAwardView.prototype.refreshView = function () {
            //   let cfg = C.AccumulatedTopUpConfig
            var cfg = null;
            for (var id in cfg) {
                if (cfg[id] != null && cfg[id] != undefined) {
                    var awardItem = new com_main.PayShopAwardItem();
                    this.m_pGSroller.addChild(awardItem);
                }
            }
        };
        /**设置宽高 */
        PayShopAwardView.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
        };
        PayShopAwardView.prototype.initView = function () {
        };
        return PayShopAwardView;
    }(com_main.CComponent));
    com_main.PayShopAwardView = PayShopAwardView;
})(com_main || (com_main = {}));
