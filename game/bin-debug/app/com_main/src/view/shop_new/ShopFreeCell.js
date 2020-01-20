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
    var ShopFreeCell = /** @class */ (function (_super_1) {
        __extends(ShopFreeCell, _super_1);
        function ShopFreeCell() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("shop/ShopFreeCellSkin.exml");
            return _this;
        }
        ShopFreeCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ShopFreeCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        ShopFreeCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
            com_main.EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnBuyHandler);
        };
        /**购买 */
        ShopFreeCell.prototype.onBtnBuyHandler = function () {
            if (this.m_shopInfo.stock > 0) {
                if (PropModel.isItemEnough(PropEnum.GOLD, this.m_nCost, 1)) {
                    ShopProxy.send_MERCHANT_BUY_GOODS(this.storeId, this.goodsId, 1);
                }
            }
            else
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX), 1, true);
        };
        /**刷新商品信息 */
        ShopFreeCell.prototype.setShopInfo = function (store, info) {
            this.storeId = store;
            this.refreshInfo(info);
        };
        /**刷新商品信息 */
        ShopFreeCell.prototype.refreshInfo = function (info) {
            this.m_shopInfo = info;
            this.refreshView();
        };
        /**刷新显示 */
        ShopFreeCell.prototype.refreshView = function () {
            if (!this.m_shopInfo)
                return;
            if (this.goodsId != this.m_shopInfo.id) {
                this.goodsId = this.m_shopInfo.id;
                Utils.setPropLabName(this.m_shopInfo.itemId, this.m_labName);
                var itemInfo = Utils.parseCommonItemServSingle(this.m_shopInfo.coumses);
                this.m_nCost = itemInfo.count;
                this.m_labCost.text = this.m_nCost + '';
            }
            this.m_item.setItemInfo(this.m_shopInfo.itemId, this.m_shopInfo.stock);
            this.m_labBuyTime.text = GCodeFromat(CLEnum.SHOP_LIMIT1, this.m_shopInfo.stock, this.m_shopInfo.stockMax);
            this.refreshBuyBtn(this.m_shopInfo.stock == 0);
        };
        /**刷新购买标记 */
        ShopFreeCell.prototype.refreshBuyBtn = function (slodOut) {
            this.m_imgSoldOut.visible = slodOut;
            this.m_btnBuy.visible = !slodOut;
        };
        return ShopFreeCell;
    }(com_main.CComponent));
    com_main.ShopFreeCell = ShopFreeCell;
})(com_main || (com_main = {}));
