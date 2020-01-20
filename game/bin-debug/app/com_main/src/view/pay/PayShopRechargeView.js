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
    var PayShopRechargeView = /** @class */ (function (_super_1) {
        __extends(PayShopRechargeView, _super_1);
        function PayShopRechargeView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/pay/PayShopRechargeSkin.exml");
            _this.width = width;
            _this.height = height;
            return _this;
        }
        PayShopRechargeView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PayShopRechargeView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PayShopRechargeView.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.refreshView();
            egret.callLater(function () {
                if (_this.m_pGSroller) {
                    Utils.tileGroupToCenter(_this.m_pGSroller, 512);
                }
            }, this);
        };
        /**刷新显示 */
        PayShopRechargeView.prototype.refreshView = function () {
            // let shopCfg = C.ShopConfig;
            // for (let id in shopCfg) {
            //     let info = shopCfg[id];
            //     if (info != null && info != undefined) {
            //         if (info.storeType == StoreType.TopUp) {
            //             let item = new PayShopBuyItem(info.id);
            //             this.m_pGSroller.addChild(item);
            //         }
            //     }
            // }
        };
        return PayShopRechargeView;
    }(com_main.CView));
    com_main.PayShopRechargeView = PayShopRechargeView;
})(com_main || (com_main = {}));
