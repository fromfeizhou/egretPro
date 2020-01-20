module com_main {
	/**
	 * 新7天特惠商城
	 */
    export class SevenIIShopPanel extends DynamicComponent {
        public m_scroller: com_main.CScroller;
        public m_pItemRoot: eui.List;
        public m_btnRefresh: com_main.ComButton;
        public m_imgTips: eui.Image;

        private m_activiVo: ActivityVo;
        private m_pListData: eui.ArrayCollection;
        private m_pWidgets: any = {};
        private m_curInfo: gameProto.IMerchantInfo = null; //当前数据
        private m_nActivityId: number;
        private m_actType: AcViewType//活动类型

        public constructor(actType: AcViewType) {
            super();
            this.m_actType = actType;
            this.dynamicSkinName = Utils.getAppSkin("activity/sevenII/SevenIIShopPanelSkin.exml");
        }

        protected onShow() {
            this.addEvent();
            this.m_imgTips.source = this.m_actType == AcViewType.AC_SHOP ? 'lb_7t_dchl_png' : 'lb_7t_cjthbkcg_png';
            let vo = ActivityModel.getActivityVo<ActivityVo>(this.m_actType);
            if (vo) {
                this.m_nActivityId = vo.id;
                ShopProxy.C2S_ACTIVITY_PREFERENTAIL_STORE_INFO(this.m_nActivityId);
            }
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();

        }
        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnRefresh, this, this.onClickRefresh);
            this.m_pItemRoot.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);

            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_INFO, this.storeInfo, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_REFRESH, this.storeRefresh, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_BUY, this.storeBuy, this);

        }
        /**移除事件 */
        private removeEvent() {
            EventManager.removeEventListeners(this);
            if (this.m_pItemRoot) {
                this.m_pItemRoot.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            }
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_INFO, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PREFERENTAIL_REFRESH, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_PREFERENTAIL_STORE_BUY, this);
        }

        /**刷新按钮更新 */
        public RefreshBtn() {
            // let cfg = C.StorePropertyConfig[ShopStoreIdEnum.SEVENIISHOP];
            let btnStr = GCode(CLEnum.ARENA_SX) + ':' + this.m_curInfo.refreshNum + '/' + this.m_curInfo.refreshAmount;
            this.m_btnRefresh.setTitleLabel(btnStr);
        }
        /**商品刷新 */
        public onClickRefresh() {
            if (this.m_curInfo.refreshNum > 0) {
                ShopProxy.C2S_ACTIVITY_PREFERENTAIL_REFRESH(this.m_nActivityId);
                return;
            }
            EffectUtils.showTips(GCode(CLEnum.SEVENII_SHOP), 1, false);
        }

        private initView(data: gameProto.IMerchantInfo) {
            this.m_curInfo = data;
            let res: IStoreItemRD[] = [];
            for (let i = 0; i < this.m_curInfo.goods.length; i++) {
                res.push({ activityId: this.m_nActivityId, storeId: this.m_nActivityId, info: this.m_curInfo.goods[i] });
            }
            if (this.m_pListData) {
                this.m_pListData.replaceAll(res);
            } else {
                this.m_pListData = new eui.ArrayCollection(res);
                this.m_pItemRoot.dataProvider = this.m_pListData;
                this.m_pItemRoot.itemRenderer = SevenIIShopItem;
            }
            this.RefreshBtn();
        }
        // private refreshList() {
        //     SevenIIShopPanel.ifOne = true;
        //     if (SevenIIShopPanel.ifOne) UpManager.history();
        //     SevenIIShopPanel.ifOne = false;
        //     this.initListView();
        // }

        private onTouchTab(e) {
            var item = e.item;
            this.m_pWidgets[item.itemId] = e.itemRenderer;
        }

        private storeInfo(data: gameProto.IS2C_ACTIVITY_PREFERENTAIL_STORE_INFO) {
            if (data && data.info.storeId == this.m_nActivityId) {
                this.initView(data.info);
            }
        }

        private storeRefresh(data: gameProto.IS2C_ACTIVITY_PREFERENTAIL_REFRESH) {
            if (data && data.info.storeId == this.m_nActivityId) {
                this.initView(data.info);
            }
        }

        private storeBuy(data: gameProto.IS2C_ACTIVITY_PREFERENTAIL_STORE_BUY) {
            if (data && data.storeId == this.m_nActivityId) {
                //刷新商品
                for (let i = 0; i < this.m_pListData.source.length; i++) {
                    let item = this.m_pListData.getItemAt(i) as IStoreItemRD;
                    if (item.info.id == data.goodsInfo.id) {
                        let tmp: IStoreItemRD = { activityId: this.m_nActivityId, storeId: this.m_nActivityId, info: data.goodsInfo }
                        this.m_pListData.replaceItemAt(tmp, i);
                        break;
                    }
                }
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_SUC), 1);
            }
        }

    }
    class SevenIIShopItem extends eui.ItemRenderer {

        public m_labItemName: eui.Label;
        public m_labLimit: eui.Label;
        public m_btnbuy: com_main.ComCostButton;
        public m_pFoldRoot: eui.Group;
        public m_labFold: eui.Label;
        public m_ComItem: com_main.ComItemNew;
        public m_discountbg: eui.Image;
        public m_imgSoldOut: eui.Image;

        // public propName: eui.Label;
        // public m_stock: eui.Label;
        private m_tData: IStoreItemRD;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIIShopItemSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchTapListener(this.m_btnbuy, this, this.onClickbuy);
        }
        private onClickbuy(e) {
            if (!this.m_tData) return;
            let info = this.m_tData.info;
            let consume = Utils.parseCommonItemServSingle(info.coumses);
            let price = Math.ceil(consume.count * info.discount / 100);
            if (PropModel.isItemEnough(consume.itemId, price, 1)) {
                if (info.stock > 0) {
                    Utils.open_view(TASK_UI.SHOP_BUY_DLG_PANEL, this.m_tData);
                }
            }

        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }

        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            if (!this.m_tData) return;
            let info = this.m_tData.info;

            let name = Utils.getItemName(info.itemId);
            this.m_ComItem.setItemInfo(info.itemId, info.ondGroupCount);
            let data: ITipsNor = { title: '', des: name };
            // CTipsManager.addTips(this.m_ComItem, { type: TipsEnum.Normal, param: data });

            Utils.setPropLabName(info.itemId, this.m_labItemName)
            let str = Utils.htmlParser(GCodeFromat(CLEnum.SHOP_BUY_LIMIT, info.stock, info.stockMax));
            this.m_labLimit.textFlow = str;
            this.m_labFold.text = GCodeFromat(CLEnum.SHOP_DISCOUNT, info.discount / 10);
            this.m_discountbg.source = (info.discount / 10) >= 5 ? "border_1040_png" : "border_1032_png";
            this.m_pFoldRoot.visible = info.discount == 100 ? false : true;
            let consume = Utils.parseCommonItemServSingle(info.coumses);
            if (info.stock > 0) {
                this.m_imgSoldOut.visible = false;
                this.m_btnbuy.visible = true;
                let price = Math.ceil(consume.count * info.discount / 100);
                this.m_btnbuy.setCostLabel(price.toString());

            } else {
                this.m_imgSoldOut.visible = true;
                this.m_btnbuy.visible = false;
            }
        }

    }
}