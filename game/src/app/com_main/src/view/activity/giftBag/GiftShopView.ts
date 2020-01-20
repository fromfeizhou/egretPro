module com_main {
	/**
	 * 限时商城
	 */
    export class GiftShopView extends CView implements IGiftShopWnd {
        public static NAME = 'GiftShopView';
        public m_shopScroller: eui.Scroller;
        public m_List: eui.List;
        public m_labTime: eui.Label;

        /**礼包 */
        public giftId: number;   //礼包id
        public bInit: boolean;
        public giftTime: number; //礼包倒计时
        private m_pListDataProvider: eui.ArrayCollection;
        private m_curInfo = null; //当前数据
        private m_pWidgets: any = {};
        private giftShopVo: GiftBagVo;
        public constructor(vo: GiftBagVo) {
            super();
            this.name = GiftShopView.NAME;
            this.giftShopVo = vo;
            this.giftTime = vo.getCountDown();
            this.giftId = vo.giftBagId;
            this.initApp("activity/giftBag/GiftShopViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.m_List.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            ShopProxy.send_GET_MERCHANT(ShopStoreIdEnum.GIFTSHOP);
        }
        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //设配
            Utils.toStageBestScaleHeigt(this.m_shopScroller);
        }
        public initView() {
            window["ta"].track('GiftWnd',  {giftId: this.giftId,'trigger_time': new Date()});
            if (this.bInit) return;
            this.bInit = true;
            this.m_labTime.text = '活动倒计时：' + this.getCountDown();
        }
        /**倒计时回调 */
        public timeCall() {
            if (this.giftTime < 0) return;
            this.giftTime--;
            this.giftTime = Math.max(0, this.giftTime);
            this.m_labTime.text = '活动倒计时：' + this.getCountDown();
        }
        public getCountDown() {
            return Utils.DateUtils.getCountDownStrBySecond(this.giftTime);
        }
        public getTitle() {
            return '限时商城';
        }

        public initInfoView(data) {
            this.refreshData(data);
        }

        public refreshView() {

        }

        private refreshData(data) {
             let res: IStoreItemRD[] = [];
            for (let i = 0; i < data.goods.length; i++) {
                res.push({ storeId: ShopStoreIdEnum.GIFTSHOP, info: data.goods[i] });
            }
           
            if (this.m_pListDataProvider) {
                this.m_pListDataProvider.replaceAll(res);
            } else {
                this.m_pListDataProvider = new eui.ArrayCollection(res);
                this.m_List.dataProvider = this.m_pListDataProvider;
                this.m_List.itemRenderer = ShopTreasureCell;
                this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            }
        }
        private onTouchTab(e): void {
            var item = e.item;
            this.m_pWidgets[item.itemId] = e.itemRenderer;
        }
        /**=====================================================================================
       * 协议处理 begin
       * =====================================================================================
       */
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.GET_MERCHANT,//获得商城信息
                ProtoDef.HAND_REFRESH_MERCHANT,//刷新商品
                ProtoDef.MERCHANT_BUY_GOODS,//购买成功
            ];
        }
        /**处理协议号事件 */
        public executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_MERCHANT: {//商店
                    if (body) {
                        this.m_curInfo = body.info;
                        this.initInfoView(body.info);
                    }
                }
                case ProtoDef.HAND_REFRESH_MERCHANT: {// 手动刷新
                    if (body) {
                        this.initInfoView(body.info);
                    }
                    break;
                }
                case ProtoDef.MERCHANT_BUY_GOODS: {// 商城购买物品
                    let data = body as gameProto.IMerchantBuyGoodsResp;
                    if (data) {
                        if (ShopStoreIdEnum.GIFTSHOP == data.storeId) {
                            //刷新商品
                            for (let i = 0; i < this.m_pListDataProvider.source.length; i++) {
                                let item = this.m_pListDataProvider.getItemAt(i) as IStoreItemRD;
                                if (item.info.id == data.goodsInfo.id) {
                                    let tmp: IStoreItemRD = { storeId: ShopStoreIdEnum.GIFTSHOP, info: data.goodsInfo }
                                    this.m_pListDataProvider.replaceItemAt(tmp, i);
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        /**=====================================================================================
        * 协议处理 end
        * =====================================================================================
        */
    }

}