module com_main {


	/**
	 * 免单商城
	 */
    export class ShopFree extends CView {
        public static NAME = 'ShopFree';
        public m_labLeftTime: eui.Label;    //剩余时间
        public m_labFreeGold: eui.Label;    //免费数量
        public m_labLeftBuy: eui.Label;     //剩余总购买次数
        public m_btnRecord: com_main.ComButton;     //免单记录按钮
        public m_groupItems: eui.Group;     //商品
        public m_MainTopNew: com_main.MainTopNew;

        private m_curInfo: gameProto.MerchantInfo = null; //当前数据

        public constructor(data?) {
            super();
            this.name = ShopFree.NAME;
            this.m_curInfo = data.info;
            this.initApp("shop/ShopFreeSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.GET_MERCHANT,//获得商城信息
                ProtoDef.MERCHANT_BUY_GOODS,//商城购买物品
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_MERCHANT: {// 获得商城信息
                    if (body) {
                        this.m_curInfo = body.info;
                        this.refreshItemView();
                    }
                    break;
                }
                case ProtoDef.MERCHANT_BUY_GOODS: {  //购买商品
                    let data = body as gameProto.IMerchantBuyGoodsResp;
                    if (data) {
                        this.refreshItemByList(data.goodsInfo);
                        Utils.open_view(TASK_UI.SHOP_FREE_SUC_PANEL, { itemId: data.goodsInfo.itemId, count: 10 })
                    }

                }
            }
        }

        public onDestroy(): void {
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.FREE_SHOP_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.SHOP_FREE));

            this.m_btnRecord.setTitleLabel(GCode(CLEnum.SHOP_FREE_REC));
            EventManager.addTouchScaleListener(this.m_btnRecord, this, this.onBtnRecordHandler);
            this.validateNow();

            egret.callLater(() => {
                if(this.m_groupItems)Utils.tileGroupToCenter(this.m_groupItems, 192);
            }, this);
            // 刷新商品
            this.refreshItemView();
        }

        /**免单记录按钮 */
        private onBtnRecordHandler() {
            let arr = []
            for (let i = 1; i < 15; i++) {
                arr.push({ time: TimerUtils.getServerTime(), itemId: i, count: i + 1 })
            }
            Utils.open_view(TASK_UI.SHOP_FREE_RECORD_PANEL, { datas: arr })
        }

        // 刷新商品
        private refreshItemView() {
            if (!this.m_curInfo) return;
            for (let i = 0; i < this.m_curInfo.goods.length; i++) {
                let goodInfo = this.m_curInfo.goods[i];
                if (i >= this.m_groupItems.numChildren) {
                    let item = new ShopFreeCell();
                    this.m_groupItems.addChild(item);
                }
                let shopCell = this.m_groupItems.getChildAt(i) as ShopFreeCell;
                shopCell.setShopInfo(this.m_curInfo.storeId, goodInfo)
            }
        }

        //根据列表刷新物品
        private refreshItemByList(data?: gameProto.IGoodsInfo) {
            for (let i = 0; i < this.m_groupItems.numChildren; i++) {
                let shopCell = this.m_groupItems.getChildAt(i) as ShopFreeCell;
                if (data.id == shopCell.goodsId) {
                    shopCell.refreshInfo(data);
                }
            }
        }

    }
}