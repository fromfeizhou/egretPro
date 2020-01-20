module com_main {
	/**
	 * 购买次数相关
	 */
    export interface IMaterBuyInfo {
        //类型
        type: number;
        //可以购买的次数
        maxNum: number;
        //单个次数价格
        price: number;
        //消耗的物品ID
        itemId: number;
    }
    export class MaterialBuyDlg extends CView {
        public static NAME = 'MaterialBuyDlg';
        public m_PopUp: com_main.APopUp;
        public m_comCostTextButton: com_main.ComCostTextButton;
        public m_description: com_main.CLabel;
        public m_itemNum: com_main.CLabel;
        public m_itemSelectNum: com_main.CLabel;
        public m_btnSub: eui.Image;
        public m_btnAdd: eui.Image;
        public m_slider: Hslider;

        private m_tData: IMaterBuyInfo;
        private m_valueCount: number = 0;

        public constructor(data: IMaterBuyInfo) {
            super();
            this.name = MaterialBuyDlg.NAME;
            this.m_tData = data;
            this.initApp("material/MaterialBuyDlgSkin.exml");
        }
     
      
        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_comCostTextButton, this, this.onClickBuy);
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onChangSlider, this);
            EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            this.m_comCostTextButton.setTitleLabel(GCode(CLEnum.BUY));
            this.m_comCostTextButton.setCostImg(RoleData.GetMaterialIconPathById(this.m_tData.itemId));
            this.m_tData.itemId == 18 ? this.m_comCostTextButton.setCostImgScale(0.8) : this.m_comCostTextButton.setCostImgScale(1.0);
            this.initCount();
            this.upDateValue(1);
        }
        /**初始化购买次数 */
        private initCount() {
            this.m_slider.maximum = this.m_tData.maxNum;
            this.m_itemNum.text = this.m_tData.maxNum.toString();
            this.m_slider.minimum = 1;
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
                if (PropModel.isItemEnough(this.m_tData.itemId, this.m_tData.price * this.m_valueCount, 2)) {
                    MaterialProxy.C2S_MATERIAL_BUY(this.m_tData.type, this.m_valueCount);
                    UpManager.history();
                }
            }
        }
        private onChangSlider(event: eui.UIEvent): void {
            let values = event.currentTarget.value;
            let curvalue = Math.floor(values);
            if (curvalue == 0) {
                curvalue = 1;
            }
            if (curvalue > this.m_tData.maxNum) {
                curvalue = this.m_tData.maxNum;
            }
            this.upDateValue(curvalue);
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
            this.upDateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        }
		/**
		 * ++
		 */
        private onClickAdd() {
            this.m_valueCount++;
            if (this.m_valueCount > this.m_tData.maxNum) {
                this.m_valueCount = this.m_tData.maxNum;
                return;
            }
            this.upDateValue(this.m_valueCount);
            this.m_slider.value = this.m_valueCount;
        }
        private upDateValue(value): void {
            this.m_valueCount = value;
            this.m_itemSelectNum.text = value + '/' + this.m_tData.maxNum;
            this.m_comCostTextButton.setCostLabel("" + value * this.m_tData.price);
        }
    }
}