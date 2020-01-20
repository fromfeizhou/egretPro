module com_main {
    export class ComSpeedyBuyView extends CView {
        public static NAME = "ComSpeedyBuyView";
        public m_APopUp: com_main.APopUp;
        public m_ComItem: com_main.ComItemNew;
        public m_ItemName: com_main.CLabel;
        public m_Description: com_main.CLabel;
        public m_ItemNum: com_main.CLabel;
        public m_labFullTip: com_main.CLabel;
        public m_pComRoot: eui.Group;
        public m_comCostTextButton: com_main.ComCostTextButton;
        public m_labBuyNum: com_main.CLabel;
        public m_btnSub: eui.Image;
        public m_slider: Hslider;
        public m_btnAdd: eui.Image;
        public m_ItemSelectNum: com_main.CLabel;
        public m_pLessTen: eui.Group;
        public m_pLessOne: eui.Group;
        public m_pAddTen: eui.Group;
        public m_labBuyCount: eui.EditableText;
        public m_pAddOne: eui.Group;
        public m_labName: com_main.CLabel;
        public m_groupRender: eui.List;



        private m_pCollection: eui.ArrayCollection;   //数据
        private m_valueCount: number = 0;//当前的1/10 
        private m_unitPrice: number = 0;//单价
        private m_goldId: number = 0;//购买消耗的id
        private m_itemId = 0;   //购买的物品id
        private m_buyTpye = 0;//购买梯度  0为1手
        private m_canBuyNum = 0;//可购买数量
        private m_stockNum = 0;//配置表总的购买数量
        private ifShow = false;//界面显示
        private m_date: IItemInfo[];

        /**便捷购买通用界面 */
        public constructor(parem: gameProto.IS2C_GET_QUCKLY_SHOP_BUY_GOODS) {
            super();
            this.name = ComSpeedyBuyView.NAME;
            this.initApp("common/ComSpeedyBuyViewSkin.exml");
            this.m_itemId = parem.goodsId;
            this.m_buyTpye = parem.priceIndex;
            this.m_canBuyNum = parem.canButCount;
            this.ifShow = true;

        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS,
                ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS,

            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS: {        //购买返回
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS(this.m_itemId);
                    break;
                }
                case ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS: {      //界面信息
                    let data = body as gameProto.IS2C_GET_QUCKLY_SHOP_BUY_GOODS;
                    this.m_canBuyNum = data.canButCount;
                    this.refrech(data);
                    break;
                }
            }
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
            this.ifShow = false;
            this.removeEvent();
        }

        protected childrenCreated() {
            super.childrenCreated();
            if (!PropModel.getCfg(this.m_itemId)) return;
            this.m_APopUp.setTitleLabel(GLan(PropModel.getCfg(this.m_itemId).name) + GCode(CLEnum.SOURCE));
            this.m_APopUp.setBottomBorder();
            this.m_ComItem.openTips = false;

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_groupRender.dataProvider = this.m_pCollection;
            this.m_groupRender.itemRenderer = ComSpeedyBuyRender;

            this.addEvent();
            this.getCfgSourePrice(this.m_itemId, this.m_buyTpye, this.m_canBuyNum);
            this.initPanel();

        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickBuy);

            EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);

            EventManager.addTouchScaleListener(this.m_pLessTen, this, this.onLessHandler);
            EventManager.addTouchScaleListener(this.m_pLessOne, this, this.onLessHandler);
            EventManager.addTouchScaleListener(this.m_pAddTen, this, this.onAddHandler);
            EventManager.addTouchScaleListener(this.m_pAddOne, this, this.onAddHandler);

            EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            this.m_labBuyCount.addEventListener(egret.Event.CHANGE, this.initScroller, this)


        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            this.m_slider.removeEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            this.m_labBuyCount.removeEventListener(egret.Event.CHANGE, this.initScroller, this);
        }
        //----------------------------------------------------------------------------------------------------------------------------------------------------------- 
        private onLessHandler(event: eui.UIEvent) {
            let param = event.currentTarget;
            switch (param) {
                case this.m_pLessTen: {
                    this.onClickLessTen(10);
                    break;
                }
                case this.m_pLessOne: {
                    this.onClickLessTen(1);
                    break;
                }
            }
        }
        private onAddHandler(event: eui.UIEvent) {
            let param = event.currentTarget;
            switch (param) {
                case this.m_pAddTen: {
                    this.onClickAddTen(10);
                    break;
                }
                case this.m_pAddOne: {
                    this.onClickAddTen(1);
                    break;
                }
            }
        }
        /**增加1或10 */
        private onClickLessTen(num: number) {
            this.m_valueCount -= this.m_unitPrice * num;
            if (this.m_valueCount < this.m_unitPrice) {
                this.m_valueCount = this.m_unitPrice;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
        }
        /**减少1或10 */
        private onClickAddTen(num: number) {
            this.m_valueCount += this.m_unitPrice * num;
            if (this.m_valueCount < this.m_unitPrice) {
                this.m_valueCount = this.m_unitPrice;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
        }

        //输入购买数量
        private initScroller() {
            let num: number = Number(this.getBLen(this.m_labBuyCount.text));
            // if(num<=0)num=1;
            this.m_labBuyCount.text = num + '';
            this.m_labBuyCount.restrict = "0-9";
            this.updateValue(num, this.m_canBuyNum);
        }
        private getBLen(str) {
            if (str == null) return 1;
            if (typeof str != "string") {
                str += "";
            }
            return str.slice(0, 5);
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------------------      
        /**确认购买 */
        private onClickBuy() {

            if (this.m_valueCount == 0) {
                EffectUtils.showTips(GCode(CLEnum.BUY_NUM_FAL), 1, true);
            } else {
                let str = this.m_comCostTextButton.getCostLabel();
                str = RoleData.getTipsisbeyond(this.m_goldId, Number(str));
                if (str == "") {
                    QuickBuyProxy.C2S_QUCKLY_SHOP_BUY_GOODS(this.m_itemId, this.m_valueCount);
                } else {
                    EffectUtils.showTips(str, 1, true);
                    if (this.m_goldId == PropEnum.GOLD)PropModel.goldLessToCharge(true);
                }
            }
        }
        private onchangSlider(event: eui.UIEvent): void {
            let values = event.currentTarget.value;
            let curvalue = Math.floor(values);
            if (curvalue == 0) {
                curvalue = 1;
            }
            this.updateValue(curvalue * this.m_unitPrice, this.m_canBuyNum);
        }
        /**
      * --
      */
        private onClickSub() {
            this.m_valueCount -= this.m_unitPrice;
            if (this.m_valueCount < this.m_unitPrice) {
                this.m_valueCount = this.m_unitPrice;
                return;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
            this.m_slider.value = Math.floor(this.m_valueCount / this.m_unitPrice);
        }
		/**
		 * ++
		 */
        private onClickAdd() {
            this.m_valueCount += this.m_unitPrice;
            if (this.m_valueCount > this.m_canBuyNum) {
                this.m_valueCount = this.m_canBuyNum;
                return;
            }
            this.updateValue(this.m_valueCount, this.m_canBuyNum);
            this.m_slider.value = Math.floor(this.m_valueCount / this.m_unitPrice);
        }
        private updateValue(value: number, canBuyNum: number): void {
            this.m_valueCount = value;
            let currGlod = CommonUtils.numOutLenght(value);
            let allGlod = CommonUtils.numOutLenght(canBuyNum);
            this.m_ItemSelectNum.text = currGlod + "";
            this.m_labBuyCount.text = currGlod + "";
            let price = this.setPrice();
            this.m_comCostTextButton.setCostLabel("" + price);//所需要的元宝
            this.m_comCostTextButton.setCostImg(RoleData.GetMaterialIconPathById(this.m_goldId));
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.BUY));

        }

        /**设置按钮金额 */
        private setPrice() {
            let moreThanGold = 0;
            let lessThan = 0;
            let changeNum = this.m_valueCount;
            for (let i = 0; i < this.m_date.length; i++) {
                let residue = this.m_stockNum - this.m_canBuyNum;  //总的量减去可购买的量
                if ((changeNum - residue) >= this.m_date[i][4]) {   //购买的数量大于第1梯度总数量，计算购买第1梯度总数量的金额
                    moreThanGold += this.m_date[i][4] / this.m_date[i][0] * this.m_date[i][3];
                    changeNum = changeNum - this.m_date[i][4];
                } else {
                    if (changeNum > 0) {
                        lessThan = changeNum / this.m_date[i][0] * this.m_date[i][3];
                        changeNum = 0;
                    }
                }
            }
            return moreThanGold + lessThan;
        }

        /**刷新面板 */
        private initPanel() {
            this.m_ComItem.itemId = this.m_itemId;
            // Utils.setPropLabName(this.m_itemId, this.m_labName);
            let itemConfig = PropModel.getCfg(this.m_itemId);
            if (itemConfig.id == PropEnum.FOOD || itemConfig.id == PropEnum.WOOD || itemConfig.id == PropEnum.IRON || itemConfig.id == PropEnum.SILVER) {
                this.currentState = 'resource';
            } else {
                this.currentState = 'ten';
            }
            this.m_labBuyNum.text = CommonUtils.numOutLenght(this.m_unitPrice);
            this.m_labName.text = GCode(CLEnum.SOURCE_PATH);
            this.refreshItemNum();

            this.m_ItemName.text = GLanFormat(itemConfig.name);
            this.m_Description.text = itemConfig.description;
            let sourceList = [];
            let sourceids = itemConfig.sourcePage.split(",");
            for (let i = 0; i < sourceids.length; i++) {
                let sourceId = Number(sourceids[i]);
                if (sourceId > 0) {
                    let data: IComSpeedyBuyItemRD = { id: sourceId };
                    sourceList.push(data);
                }
            }
            this.m_pCollection.replaceAll(sourceList);
            this.updateValue(this.m_unitPrice, this.m_canBuyNum);

        }
        /**物品数量变化 */
        private onPropItemChange(itemId: number) {
            if (itemId == this.m_itemId && this.ifShow) {
                this.refreshItemNum();
            }
        }
        /**刷新数量 */
        private refreshItemNum() {
            let itemCfg = C.ItemConfig[this.m_itemId];
            let isResource = itemCfg.type == PropType.RESOURCE;//是否是资源
            let itemNum = 0;
            if (itemCfg) {
                if (isResource) {
                    itemNum = RoleData.GetMaterialNumById(this.m_itemId);
                } else {
                    itemNum = PropModel.getPropNum(this.m_itemId);
                }
            }
            this.m_ItemNum.text = itemNum.toString();
        }
        /**根据梯度取对应数据 */
        private getCfgSourePrice(goodId: number, buyType: number, canBuyNum: number) {
            this.m_date = NormalModel.setQuickBuyCfg(goodId);
            let allCount = 0;
            for (let i = 0; i < this.m_date.length; i++) {
                allCount += this.m_date[i][4];
            }
            this.m_unitPrice = this.m_date[buyType][0]; //单价
            this.m_goldId = this.m_date[buyType][2]; //消耗的物品Id
            this.m_stockNum = allCount; //总数
            this.m_labFullTip.visible = canBuyNum > 0 ? false : true;
            this.m_pComRoot.visible = canBuyNum > 0 ? true : false;

            this.m_slider.maximum = Math.floor(canBuyNum / this.m_unitPrice);
            this.m_slider.minimum = 1;
        }
        /**购买刷新*/
        private refrech(data: gameProto.IS2C_GET_QUCKLY_SHOP_BUY_GOODS) {

            this.getCfgSourePrice(data.goodsId, data.priceIndex, data.canButCount);
            this.onPropItemChange(data.goodsId);
            this.updateValue(this.m_unitPrice, data.canButCount);
        }

    }
    export interface IComSpeedyBuyItemRD {
        id: number,
    }
    /**
    * @extends eui.ItemRenderer
    */
    export class ComSpeedyBuyRender extends eui.ItemRenderer {
        protected m_sourItem: ItemSourceViewRender;
        protected m_imgSelected: eui.Image;

        protected m_tData: IComSpeedyBuyItemRD;
        private m_nType: number;     //面板类型
        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }
        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_sourItem = new ItemSourceViewRender();
            this.addChild(this.m_sourItem);
        }
        protected dataChanged() {
            this.m_tData = this.data;
            this.m_sourItem.setItemId(this.m_tData.id);
        }
    }
}