module com_main {
    export class SevenIIChargeItem extends eui.ItemRenderer {
        public m_labBuyNum: eui.Label;
        public m_pState: eui.Group;
        public m_imgBg: eui.Image;
        public m_labState: eui.Label;
        public m_pBtnGet: com_main.ComButton;
        public m_group: eui.Group;
        public m_pLbGold: eui.BitmapLabel;
        public m_imgTitle: eui.Image;

        private m_status: number;  //按钮状态
        private m_tData: IRechargeItemRD;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIIChargeItemSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }
        protected dataChanged() {
            let list = this.parent as eui.List;
            this.m_tData = this.data;
            if (!this.m_tData) return;
            this.creatItem();
            let currpro: number;
            if (this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_2||this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_3) {
                let vo = this.m_tData.vo as AcPaySetOneVo;
                this.m_status = vo.getRechargeOneBtnRed(this.m_tData.num, this.m_tData.id);
                currpro = 0;
                this.m_imgTitle.source = 'lb_dbczyb_png';

            } else if (this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_3||this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_5) {
                let vo = this.m_tData.vo as AcPaySumVo;
                this.m_status = vo.getAllRechargeBtnRed(this.m_tData.num, this.m_tData.id);
                currpro = vo.paySum;
                this.m_imgTitle.source = 'lb_ljczyb_png';
            }
            let planStr: string = `<font color=#abb7d1>${GCode(CLEnum.AC_PROGRESS)}</font>`;
            let currProTxt = this.m_status == ActivityStatus.FINISH ? planStr + GCode(CLEnum.AC_FINISH) : planStr + currpro + "/" + this.m_tData.num;
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH || this.m_status == ActivityStatus.PROCESSING ? true : false;
            this.m_pState.visible = this.m_status == ActivityStatus.REWARD ? true : false;
            this.m_labBuyNum.textFlow = Utils.htmlParser(currProTxt);
            this.m_labBuyNum.visible = this.m_status == ActivityStatus.REWARD ? false : true;
            this.m_pLbGold.text = this.m_tData.num.toString();
            this.m_pBtnGet.currentState = this.m_status == ActivityStatus.FINISH ? 'style1' : 'style6';
            let str = this.m_status == ActivityStatus.FINISH ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.GO_TO);
            this.m_pBtnGet.setTitleLabel(str);
        }
        /**奖励显示*/
        private creatItem() {
            this.m_group.removeChildren();
            for (let i = 0; i < this.m_tData.reward.length; i++) {
                let itemInfo = this.m_tData.reward[i];
                let item = ComItemNew.create("count");
                item.setItemInfo(itemInfo.itemId, itemInfo.count);
                this.m_group.addChild(item);
            }
        }
        /**领取奖励 */
        private onBtnGetHandler(e: egret.Event): void {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }
            if (this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_2||this.m_tData.vo.viewType == AcViewType.RECHARGE_SINGLE_3) {//单笔充值领取
                ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD(this.m_tData.vo.id, this.m_tData.id);
            } else if (this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_3||this.m_tData.vo.viewType == AcViewType.RECHARGE_ADD_UP_5) {//累计充值领取
                ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD(this.m_tData.vo.id, this.m_tData.id);
            }
        }
    }

}