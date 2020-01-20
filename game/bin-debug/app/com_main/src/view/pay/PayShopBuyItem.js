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
     */
    var PayShopBuyItem = /** @class */ (function (_super_1) {
        __extends(PayShopBuyItem, _super_1);
        function PayShopBuyItem(param) {
            var _this = _super_1.call(this) || this;
            _this.m_nShopId = param || 1;
            _this.skinName = Utils.getSkinName("app/pay/pay_shop_buy_item.exml");
            return _this;
        }
        PayShopBuyItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_pBtnBuy);
        };
        PayShopBuyItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PayShopBuyItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.buyClick);
            this.m_pShopCfg = PayModel.rechargeCfgs[this.m_nShopId];
            this.refreshView();
        };
        /**刷新显示 */
        PayShopBuyItem.prototype.refreshView = function () {
            if (this.m_pShopCfg) {
                this.m_pLbPrice.text = this.m_pShopCfg.price + '';
                // let items = Utils.parseCommonItemJson(this.m_pShopCfg.gain);
                this.m_pLbName.text = GLan(this.m_pShopCfg.description);
            }
            else {
                return;
            }
            if (this.m_pShopCfg.shopType == RechargeType.RECHARGE) {
                this.m_pItem.source = 'yb_0' + this.m_pShopCfg.id + '_png';
                this.m_imgItemBg.source = 'yj_zyd_png';
                this.refreshFirstFlag();
            }
            else {
                this.m_ext.visible = false;
                this.m_pItem.source = 'yb2_0' + (this.m_pShopCfg.id - 6) + '_png';
                this.m_pGDouble.visible = false;
                this.m_imgItemBg.source = 'zyt_41_png';
                this.m_typeImg.source = 'icon_source_jade_png';
            }
        };
        /**刷新首次奖励显示 */
        PayShopBuyItem.prototype.refreshFirstFlag = function () {
            this.m_pGDouble.visible = true;
            var tips = GCode(CLEnum.VIP_FIRST_PAY_TIP);
            if (PayModel.rechargeRecords.indexOf(this.m_pShopCfg.id) >= 0) {
                this.m_pGDouble.visible = false;
                tips = GCode(CLEnum.VIP_PAY_TIP);
            }
            var itemInfo = IItemInfoPool.create(this.m_pShopCfg.reward[0].key, (this.m_pShopCfg.reward[0].value));
            this.m_pLbGoldMoreTile.text = tips;
            this.m_pLbGoldMore.text = itemInfo.count + '';
        };
        PayShopBuyItem.prototype.buyClick = function (e) {
            PayProxy.C2S_RECHARGE(this.m_pShopCfg.id, this.m_pShopCfg.price);
            Loading.show();
        };
        return PayShopBuyItem;
    }(com_main.CComponent));
    com_main.PayShopBuyItem = PayShopBuyItem;
})(com_main || (com_main = {}));
