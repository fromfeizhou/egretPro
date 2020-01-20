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
     * 玉石充值面板
     */
    var PayYuShopView = /** @class */ (function (_super_1) {
        __extends(PayYuShopView, _super_1);
        function PayYuShopView(param) {
            var _this = _super_1.call(this) || this;
            _this.m_pViews = [];
            _this.name = PayYuShopView.NAME;
            _this.initApp("pay/payYuShopSkin.exml");
            return _this;
        }
        PayYuShopView.prototype.onDestroy = function () {
            for (var key in this.m_pViews) {
                var view = this.m_pViews[key];
                if (view.onDestroy) {
                    view.onDestroy();
                }
            }
            this.m_pCellList = null;
            SceneResGroupCfg.clearModelRes([ModuleEnums.YU_SHOP_VIEW_UI]);
            _super_1.prototype.onDestroy.call(this);
        };
        PayYuShopView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_RE));
            this.m_MainTopNew.setResources([PropEnum.YU]);
            this.refreshView();
            Utils.toStageBestScale(this.m_pSroller);
        };
        /**刷新显示 */
        PayYuShopView.prototype.refreshView = function () {
            this.m_pCellList = [];
            var shopCfg = PayModel.rechargeCfgs;
            for (var id in shopCfg) {
                var info = shopCfg[id];
                if (info != null && info != undefined) {
                    if (info.shopType == RechargeType.YU_RECHARGE) {
                        var item = new com_main.PayShopBuyItem(info.id);
                        this.m_list.addChild(item);
                        this.m_pCellList.push(item);
                    }
                }
            }
        };
        PayYuShopView.NAME = "PayYuShopView";
        return PayYuShopView;
    }(com_main.CView));
    com_main.PayYuShopView = PayYuShopView;
})(com_main || (com_main = {}));
