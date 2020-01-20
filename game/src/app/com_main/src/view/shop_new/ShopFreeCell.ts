module com_main {
    export class ShopFreeCell extends CComponent {
        public m_item: com_main.ComItemNew;//物品
        public m_labName: eui.Label;    //物品名字
        public m_labBuyTime: eui.Label; //剩余购买次数
        public m_btnBuy: eui.Group; //购买按钮
        public m_labCost: eui.BitmapLabel;  //花费
        public m_imgSoldOut: eui.Image; //商品情况标记

        public storeId: ShopStoreIdEnum;      //商店id
        public goodsId: number;       //商品id
        private m_shopInfo: gameProto.IGoodsInfo; //商品信息
        private m_nCost: number; //花费

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("shop/ShopFreeCellSkin.exml");
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.cacheAsBitmap = true;
            EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnBuyHandler);
        }

        /**购买 */
        private onBtnBuyHandler() {
            if (this.m_shopInfo.stock > 0) {
                if (PropModel.isItemEnough(PropEnum.GOLD, this.m_nCost, 1)) {
                    ShopProxy.send_MERCHANT_BUY_GOODS(this.storeId, this.goodsId, 1)
                }
            } else
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX), 1, true);
        }

        /**刷新商品信息 */
        public setShopInfo(store: ShopStoreIdEnum, info: gameProto.IGoodsInfo) {
            this.storeId = store;
            this.refreshInfo(info);
        }
        /**刷新商品信息 */
        public refreshInfo(info: gameProto.IGoodsInfo) {
            this.m_shopInfo = info;
            this.refreshView();
        }

        /**刷新显示 */
        public refreshView() {
            if (!this.m_shopInfo) return;

            if (this.goodsId != this.m_shopInfo.id) {
                this.goodsId = this.m_shopInfo.id;
                Utils.setPropLabName(this.m_shopInfo.itemId, this.m_labName);
                let itemInfo = Utils.parseCommonItemServSingle(this.m_shopInfo.coumses);
                this.m_nCost = itemInfo.count;
                this.m_labCost.text = this.m_nCost + '';
            }
            this.m_item.setItemInfo(this.m_shopInfo.itemId, this.m_shopInfo.stock);
            this.m_labBuyTime.text = GCodeFromat(CLEnum.SHOP_LIMIT1, this.m_shopInfo.stock, this.m_shopInfo.stockMax);
            this.refreshBuyBtn(this.m_shopInfo.stock == 0);
        }

        /**刷新购买标记 */
        public refreshBuyBtn(slodOut: boolean) {
            this.m_imgSoldOut.visible = slodOut;
            this.m_btnBuy.visible = !slodOut;
        }
    }
}