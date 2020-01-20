module com_main {


    /**
     * 
     */
    export class PayShopBuyItem extends CComponent {

        private m_pItemQuqlity: com_main.CImage;
        private m_pItem: com_main.CImage;

        private m_pLbName: eui.Label;
        private m_pBtnBuy: eui.Group;
        private m_pLbPrice: eui.Label;  //充值价格按钮文本

        private m_pGDouble: eui.Group;  //首次标记
        private m_pGGoldMore: eui.Group; //额外奖励组
        private m_pLbGoldMore: eui.Label;
        private m_pLbGoldMoreTile: eui.Label;
        private m_imgItemBg: eui.Image;

        private m_ext: eui.Group;
        private m_typeImg: eui.Image;





        private m_pShopCfg: gameProto.IRechargeConfig; //充值配置
        private m_nShopId;  //商品id

        public constructor(param?: number) {
            super();
            this.m_nShopId = param || 1;
            this.skinName = Utils.getSkinName("app/pay/pay_shop_buy_item.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListener(this.m_pBtnBuy);
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.buyClick);

            this.m_pShopCfg = PayModel.rechargeCfgs[this.m_nShopId];
            this.refreshView();
        }

        /**刷新显示 */
        public refreshView() {
            if (this.m_pShopCfg) {
                this.m_pLbPrice.text = this.m_pShopCfg.price + '';
                // let items = Utils.parseCommonItemJson(this.m_pShopCfg.gain);
                this.m_pLbName.text = GLan(this.m_pShopCfg.description);
            } else {
                return;
            }

            if (this.m_pShopCfg.shopType == RechargeType.RECHARGE) {
                this.m_pItem.source = 'yb_0' + this.m_pShopCfg.id + '_png';
                this.m_imgItemBg.source = 'yj_zyd_png';
                this.refreshFirstFlag();
            } else {
                this.m_ext.visible = false;
                this.m_pItem.source = 'yb2_0' + (this.m_pShopCfg.id - 6) + '_png';
                this.m_pGDouble.visible = false;
                this.m_imgItemBg.source = 'zyt_41_png';
                this.m_typeImg.source = 'icon_source_jade_png';
            }

        }

        /**刷新首次奖励显示 */
        public refreshFirstFlag() {
            this.m_pGDouble.visible = true;
            let tips = GCode(CLEnum.VIP_FIRST_PAY_TIP);

            if (PayModel.rechargeRecords.indexOf(this.m_pShopCfg.id) >= 0) {
                this.m_pGDouble.visible = false;
                tips = GCode(CLEnum.VIP_PAY_TIP);
            }
            let itemInfo = IItemInfoPool.create(this.m_pShopCfg.reward[0].key, (this.m_pShopCfg.reward[0].value));
            this.m_pLbGoldMoreTile.text = tips;
            this.m_pLbGoldMore.text = itemInfo.count + '';
        }

        private buyClick(e: egret.Event): void {
            PayProxy.C2S_RECHARGE(this.m_pShopCfg.id,this.m_pShopCfg.price);
            Loading.show();
        }
    }

}