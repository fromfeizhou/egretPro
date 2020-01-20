module com_main {
	/**
	 * 联盟商城
	 */
    export class LegionShopView extends CView {
        public static NAME = 'LegionShopView';

        public m_shopScroller: eui.Scroller;
        public m_List: eui.List;
        public m_rightGroup: eui.Group;
        public m_surplus: eui.Label;
        public m_refreshTime: eui.Label;
        public m_comCostTextButton: com_main.ComCostTextButton;

        private m_coinId = 0;    //消耗的货币Id
        private m_numMax = 0;//消耗的货币数量
        private m_pListDataProvider: eui.ArrayCollection;
        private m_curInfo:gameProto.IMerchantInfo = null; //当前数据
        private m_curTime = 0;
        private m_pWidgets: any = {};
        public constructor(size: ISize) {
            super();
            NodeUtils.setSize(this, size);
            this.name = LegionShopView.NAME;
            this.initApp('legion/tabView/LegionShopViewSkin.exml');
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.m_List.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            Utils.TimerManager.remove(this.updateRemainTime, this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            ShopProxy.send_GET_MERCHANT(ShopStoreIdEnum.LEGION);
            EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickRefresh);

            //设配
            Utils.toStageBestScaleHeigt(this.m_shopScroller);
            this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            
        }

        private initView(data) {
            this.refreshTime();
            this.refreshData(data);
        }
		/**
		 * 普通酒馆状态
		 */
        private initNormalState() {
            this.validateNow();
        }
        /**商品刷新 */
        public onClickRefresh() {
            if (PropModel.isItemEnough(this.m_coinId, this.m_numMax, 1)) {
                ShopProxy.send_HAND_REFRESH_MERCHANT(ShopStoreIdEnum.LEGION);
            }
        }
        private refreshTime() {

            // let cfg = C.StorePropertyConfig[4];
            let coienm = Utils.parseCommonItemServSingle(this.m_curInfo.coumses);
            this.m_coinId = coienm.itemId;//消耗的货币ID
            this.m_numMax = coienm.count;//消耗的货币数量

            let Refresh = this.m_curInfo.autoRefresh;
            let timeArr = [];
            for (let i in Refresh) {
                let h = Refresh[i].key, m = Refresh[i].value;
                var date = new Date(TimerUtils.getServerTimeMill());
                date.setHours(h, m, 0, 0);
                timeArr.push(date.getTime());
            }
            let nowTime = TimerUtils.getServerTimeMill();

            for (let i = 1; i < timeArr.length; i++) {
                let curIndex = i;
                let preValue = timeArr[i - 1];
                let curValue = timeArr[i];
                if (nowTime > preValue && nowTime < curValue) {
                    console.log('nowTime0=', curValue);
                    this.m_curTime = curValue;
                    break;
                } else if (nowTime > curValue && curIndex == timeArr.length - 1) {
                    console.log('nowTime1=', timeArr[0]);
                    this.m_curTime = timeArr[0];
                    break;
                } else if (nowTime < preValue) {
                    this.m_curTime = preValue;
                    break;
                }
            }

            let str = <Array<egret.ITextElement>>[
                { text: GCode(CLEnum.SHOP_NEXT_TIME), style: { "size": 22, "textColor": 0xABB7D1 } },
                { text: TimerUtils.dateFormat("hh:mm:ss", this.m_curTime / 1000), style: { "size": 22, "textColor": 0xE9E9E6 } },
            ];

            let btnPicStr = RoleData.GetMaterialIconPathById(this.m_coinId);  //按钮显示资源图片路径

            this.m_comCostTextButton.setCostImg(btnPicStr);
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.SHOP_RUSH_NOW));
            this.m_comCostTextButton.setCostLabel(this.m_numMax + "");

            this.m_refreshTime.textFlow = str;
            Utils.TimerManager.remove(this.updateRemainTime, this);
            Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
        }

        private refreshData(data) {
            // this.m_consumeType = [];
            data.refreshNum > 0 ? data.refreshNum = data.refreshNum : data.refreshNum = 0;
            let str = <Array<egret.ITextElement>>[
                { text: GCode(CLEnum.SHOP_RUSH_LEFT), style: { "size": 22, "textColor": 0x8A8A9E } },
                { text: data.refreshNum + " ", style: { "size": 22, "textColor": 0xE9E9E6 } },
            ];
            this.m_surplus.textFlow = str;
        
            let res: IStoreItemRD[] = [];
            for (let i = 0; i < data.goods.length; i++) {
                res.push({ storeId: ShopStoreIdEnum.LEGION, info: data.goods[i] });
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
        private updateRemainTime() {
            var time = Math.floor((TimerUtils.getServerTimeMill() - this.m_curTime) / 1000);
            if (time == 0 || time == 1) {
                Utils.TimerManager.remove(this.updateRemainTime, this);
                ShopProxy.send_GET_MERCHANT(ShopStoreIdEnum.LEGION);
            }
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
                        this.initView(body.info);
                    }
                }
                case ProtoDef.HAND_REFRESH_MERCHANT: {// 手动刷新
                    if (body) {
                        this.initView(body.info);
                    }
                    break;
                }
                case ProtoDef.MERCHANT_BUY_GOODS: {// 商城购买物品
                   let data = body as gameProto.IMerchantBuyGoodsResp;
                    if (data) {
                        if (ShopStoreIdEnum.LEGION == data.storeId) {
                            //刷新商品
                            for (let i = 0; i < this.m_pListDataProvider.source.length; i++) {
                                let item = this.m_pListDataProvider.getItemAt(i) as IStoreItemRD;
                                if (item.info.id == data.goodsInfo.id) {
                                    let tmp: IStoreItemRD = { storeId: ShopStoreIdEnum.LEGION, info: data.goodsInfo }
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