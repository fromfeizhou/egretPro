module com_main {


	/**
	 * 联盟面板相关
	 */
    export class ShopBuyDlg extends CView {
        public static NAME = 'ShopBuyDlg';
        private m_PopUp: com_main.APopUp;
        private m_ComItem: com_main.ComItemNew;
        private m_ItemName: CLabel;
        private m_ItemNum: CLabel;
        private m_Description: CLabel;
        private m_ItemSelectNum: com_main.CLabel;
        private m_comCostTextButton: com_main.ComCostTextButton;
        private m_slider: eui.HSlider;
        private m_btnSub: eui.Image;
        private m_btnAdd: eui.Image;
        private m_stockNum = 0;//库存
        private m_valueCount: number = 0;//当前的1/10  之1
        private m_data: IStoreItemRD = null;
        private m_consume: IItemInfo;
        public constructor(data?) {
            super();
            this.name = ShopBuyDlg.NAME;
            this.m_data = data;
            this.initApp("shop/ShopBuyDlgSkin.exml");

        }
        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.TAVERN_ATTRACT: {
                    break;
                }
            }
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickBuy);
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.BUY));
            this.m_stockNum = this.m_data.info.stock;
            this.m_slider.maximum = this.m_data.info.stock;
            this.m_slider.minimum = 1;
            this.m_consume = Utils.parseCommonItemServSingle(this.m_data.info.coumses);
            this.ShowDetails(this.m_data.info.itemId);
        }
        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }
        /**确认购买 */
        private onClickBuy() {
            if (this.m_valueCount == 0) {
                EffectUtils.showTips(GCode(CLEnum.BUY_NUM_FAL), 1, true);
            } else {
                let str = this.m_comCostTextButton.getCostLabel();
                str = RoleData.getTipsisbeyond(this.m_consume.itemId, Number(str));
                if (str == "") {
                    if (this.m_data.activityId > 0) {
                        ShopProxy.C2S_ACTIVITY_PREFERENTAIL_STORE_BUY(this.m_data.activityId, this.m_data.info.id, this.m_valueCount)
                    } else {
                        ShopProxy.send_MERCHANT_BUY_GOODS(this.m_data.storeId, this.m_data.info.id, this.m_valueCount)
                    }
                } else {
                    EffectUtils.showTips(str, 1, true);
                }
                UpManager.history();
            }
        }
        private ShowDetails(id: number) {
            let cfg = PropModel.getCfg(id);
            Utils.setPropLabName(id, this.m_ItemName);
            this.m_Description.text = cfg.description;
            // this.m_ItemNum.text = this.m_data.stock;
            this.m_ItemNum.text = PropModel.getPropNum(id).toString();
            // this.m_ComItem.itemId = id;
            this.m_ComItem.setItemInfo(id);
            // Utils.TimerManager.doTimer(100,1,()=>{
            this.updateValue(1);
            // },this);


        }
        private onchangSlider(event: eui.UIEvent): void {
            let values = event.currentTarget.value;
            let curvalue = Math.floor(values);
            if (curvalue == 0) {
                curvalue = 1;
            }
            this.updateValue(curvalue);
        }
        /**
		 * --
		 */
        private onClickSub() {
            this.m_valueCount--;
            if (this.m_valueCount < 1) {
                this.m_valueCount = 1;
                return;
            }
            this.updateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        }
		/**
		 * ++
		 */
        private onClickAdd() {
            this.m_valueCount++;
            if (this.m_valueCount > this.m_stockNum) {
                this.m_valueCount = this.m_stockNum;
                return;
            }
            this.updateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        }
        private updateValue(value): void {
            this.m_valueCount = value;
            this.m_ItemSelectNum.text = value + '/' + this.m_stockNum;

            this.m_comCostTextButton.setCostLabel(Math.ceil((value * this.m_consume.count * this.m_data.info.discount / 100)).toString());
            this.m_comCostTextButton.setCostImg(RoleData.GetMaterialIconPathById(this.m_consume.itemId));
            this.m_consume.itemId == 18 ? this.m_comCostTextButton.setCostImgScale(0.8) : this.m_comCostTextButton.setCostImgScale(1.0);

        }
    }
}