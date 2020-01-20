module com_main {
    /**
     * 每日惊喜商城
     */
    export class DailySurpriseView extends CView {
        public static NAME = "DailySurpriseView";

        public m_MainTopNew: com_main.MainTopNew;
        public m_pRoot: eui.Group;
        public m_pViewRoot: eui.Group;
        public m_labVip: com_main.CLabel;
        public m_pCDTtime: com_main.CLabel;
        public m_listItem: eui.List;

        private m_resetTime: number = 0;
        private m_tCollections: eui.ArrayCollection;

        public constructor() {
            super();
            this.name = DailySurpriseView.NAME;
            this.initApp("dailySurprise/DailySurpriseSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_SURPRISE_MARKET,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_SURPRISE_MARKET: {
                    this.calcuResetTime();
                    this.refreshView();
                    break;
                }
            }
        }

        public onDestroy(): void {
            super.onDestroy();
            RankModel.clear();
            EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.updateCDTime, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.initView();

            Utils.toStageBestScale(this.m_pRoot);

            this.calcuResetTime();
            this.updateCDTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateCDTime, this);
        }

        /**重置结束倒计时 */
        public calcuResetTime() {
            let date: Date = TimerUtils.getServerDate();
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0);
            this.m_resetTime = date.getTime() + 3600 * 24 * 1000;
        }

        /**更新倒计时时间 */
        public updateCDTime() {
            let curtime = TimerUtils.getServerTimeMill();
            // let str = Utils.DateUtils.getFormatBySecond((this.m_resetTime - curtime) / 1000, 4);
            // this.m_pCDTtime.text = str;
            let str = Utils.DateUtils.getActiveDownStr(this.m_resetTime - curtime, 2);
            this.m_pCDTtime.textFlow = Utils.htmlParser(str);
        }

        private initView() {
            this.m_MainTopNew.setTitleName(GCode(CLEnum.SHOP_DAILY_SURPRISE));

            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_listItem.dataProvider = this.m_tCollections;
            this.m_listItem.itemRenderer = DailySurpriseCell;

            this.refreshView();
        }

        private refreshView() {
            let shopDataDic = DailySurpriseModel.shopDataDic;
            if (shopDataDic) {
                let listData: gameProto.IShopData[] = [];
                for (let i in shopDataDic) {
                    listData.push(shopDataDic[i]);
                }
                this.m_tCollections.replaceAll(listData);
            }

            this.m_labVip.visible = VipModel.isHVipGoldDis();
            this.m_labVip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HEIGHT_VIP_BUY_D, VipModel.getHVipGoldLv()));
        }
    }


    /**每日惊喜商城 购买项 */
    export class DailySurpriseCell extends eui.ItemRenderer {
        public m_comItem0: com_main.ComItemNew;
        public m_comItem1: com_main.ComItemNew;
        public m_comItem2: com_main.ComItemNew;
        public m_comItem3: com_main.ComItemNew;
        public m_btnbuy: com_main.ComButton;
        public m_btnbuy1: com_main.ComCostButton;
        public m_imgSoldOut: com_main.CImage;
        public m_labStock: com_main.CLabel;
        public m_labText: com_main.CLabel;
        public m_labName: com_main.CLabel;


        private m_tData: gameProto.IShopData;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/dailySurprise/DailySurpriseCellSkin.exml");
            this.currentState = VipModel.isHVipGoldDis() ? "high" : "low";
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            EventManager.addTouchScaleListener(this.m_btnbuy, this, this.onClickbuy);
            EventManager.addTouchScaleListener(this.m_btnbuy1, this, this.onClickbuy1);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this.m_tData = this.data;
            if (!this.m_tData) return;

            this.initView();
        }

        private onClickbuy(e) {
            let cfg = this.m_tData.rechargeConfigs;
            if (isNull(cfg)) {
                EffectUtils.showTips("商品出错...");
                return;
            }

            if (this.m_tData.buyCount >= cfg.count) {
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX));
                return;
            }
            let id = cfg.id;
            let cost = cfg.price;
            PayProxy.C2S_RECHARGE(id, cost);
        }

        private onClickbuy1(e) {
            let cfg = this.m_tData.rechargeConfigs;
            if (isNull(cfg)) {
                EffectUtils.showTips("商品出错...");
                return;
            }

            if (this.m_tData.buyCount >= cfg.count) {
                EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX));
                return;
            }
            let id = cfg.id;
            let cost = cfg.price;
            cost = VipModel.getHVipGoldBuyPrice(cost);
            if (VipModel.canHVipBuy(cost)) PayProxy.C2S_GOLD_BUY(id);
        }

        private initView() {
            let cfg = this.m_tData.rechargeConfigs;
            let buyCount = this.m_tData.buyCount;
            this.m_labName.text = cfg.name;
            this.m_labStock.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.AC_SHOP_LIMIT, buyCount, cfg.count));

            this.m_imgSoldOut.visible = buyCount >= cfg.count;
            this.m_labText.visible = buyCount < cfg.count;
            this.m_btnbuy.visible = buyCount >= cfg.count ? false : true;
            this.m_btnbuy.setTitleLabel(GCodeFromat(CLEnum.AC_Y, cfg.price));

            this.m_btnbuy1.visible = buyCount >= cfg.count ? false : true;
            this.m_btnbuy1.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.GOLD));
            this.m_btnbuy1.setCostLabel(VipModel.getHVipGoldBuyPrice(cfg.price) + "");


            // 奖励道具
            if (isNull(cfg.reward)) return;
            let itemInfo = Utils.parseCommonItemServ(cfg.reward);
            for (let i = 0; i < 4; i++) {
                let data = itemInfo[i];
                let item: ComItemNew = this[`m_comItem${i}`];
                if (data) {
                    item.visible = true;
                    item.setItemInfo(data.itemId, data.count);
                } else {
                    item.visible = false;
                }
            }
        }

    }
}