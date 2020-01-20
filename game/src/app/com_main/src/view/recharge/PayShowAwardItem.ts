module com_main {
    export class PayShopAwardItem extends CComponent {

        public m_labTip: eui.Label;
        public m_group: eui.List;
        public m_pPlanRoot: eui.Group;
        public m_pLbPercent: eui.Label;
        public m_pBtnGet: com_main.ComButton;
        public m_pAwardState: eui.Group;
        public m_imgBg: eui.Image;
        public m_labState: eui.Label;
        public m_labOpDay: com_main.CLabel;
        public m_labtxt: eui.Label;
        public m_pLbGold: eui.BitmapLabel;


        private m_id: number;     //id   
        private m_reward: IItemInfo[];     //奖励串   
        private m_num: number;       //额度    
        private m_desc: string;       //描述 
        private m_status: number;  //按钮状态
        private vo: ActivityVo;
        private m_percentNum: string;  //进度参数
        private m_tCollection: eui.ArrayCollection;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/pay/PayShopAwardItemSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListener(this.m_pBtnGet);
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }
        //初始化
        public init(data: any) {
            this.m_id = data.id;
            this.m_reward = data.reward;
            this.m_num = data.num;
            this.m_desc = data.desc;
            this.vo = data.vo;
            this.refreshBtnView();
            this.refreshView();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // this.width = this.parent.width;
            EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);

            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = AwardItemRender;
            // this.refreshView();
        }

        /**刷新界面 */
        public refreshView() {
            if (this.m_reward) {
                let res = [];
                for(let i = 0;i < this.m_reward.length;i++){
                    res.push(IItemInfoPool.create(this.m_reward[i].itemId,this.m_reward[i].count));
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_pLbGold.text = this.m_num.toString() ;
            this.m_labtxt.x=this.m_pLbGold.x+this.m_pLbGold.width;
            this.m_labTip.text = this.m_desc;
        }

        /**刷新按钮显示 */
        public refreshBtnView() {
            let planStr: string = `<font color=#abb7d1>${GCode(CLEnum.AC_PROGRESS)}</font>`;
            let currpro: number;
            if (this.vo.viewType == AcViewType.RECHARGE_SINGLE) {
                let vo = this.vo as AcPaySetOneVo;
                this.m_status = vo.getRechargeOneBtnRed(this.m_num, this.m_id);
                currpro = 0;
            } else if (this.vo.viewType == AcViewType.RECHARGE_ADD_UP) {
                let vo = this.vo as AcPaySumVo;
                this.m_status = vo.getAllRechargeBtnRed(this.m_num, this.m_id);
                currpro = vo.paySum;
            } else if (this.vo.viewType == AcViewType.CONSUME_GIFT) {
                let vo = this.vo as AcConsumeVo;
                this.m_status = vo.getConsumptionBtnRed(this.m_num, this.m_id);
                currpro = vo.consumeSum;
            }
            this.m_percentNum = this.m_status == ActivityStatus.FINISH ? planStr + GCode(CLEnum.AC_FINISH) : planStr + currpro + "/" + this.m_num;
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH || this.m_status == ActivityStatus.PROCESSING ? true : false;
            this.m_pAwardState.visible = this.m_status == ActivityStatus.REWARD ? true : false;
            this.m_pPlanRoot.visible = this.m_status == ActivityStatus.REWARD ? false : true;
            this.m_pLbPercent.textFlow = Utils.htmlParser(this.m_percentNum);
            if (this.vo.viewType == AcViewType.CONSUME_GIFT) {
                Utils.isGray(this.m_status == ActivityStatus.PROCESSING, this.m_pBtnGet);
                this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING ? false : true;
                this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            } else {
                this.m_pBtnGet.currentState = this.m_status == ActivityStatus.FINISH ? 'style1' : 'style6';
                let str = this.m_status == ActivityStatus.FINISH ? GCode(CLEnum.TAKE_OUT) : GCode(CLEnum.GO_TO);
                this.m_pBtnGet.setTitleLabel(str);
            }

        }

        /**领取奖励 */
        private onBtnGetHandler(e: egret.Event): void {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }

            if (this.vo.viewType == AcViewType.RECHARGE_SINGLE) {//单笔充值领取
                ActivityProxy.C2S_ACTIVITY_GET_SINGLE_PAY_REWARD(this.vo.id, this.m_id);
            } else if (this.vo.viewType == AcViewType.RECHARGE_ADD_UP) {//累计充值领取
                ActivityProxy.C2S_ACTIVITY_GET_TOTAL_PAY_REWARD(this.vo.id, this.m_id);
            } else if (this.vo.viewType == AcViewType.CONSUME_GIFT) {//消费豪礼领取
                ActivityProxy.C2S_ACTIVITY_GET_CONSUME_GIFT_REWARD(this.vo.id, this.m_id);
            }

        }
    }

}