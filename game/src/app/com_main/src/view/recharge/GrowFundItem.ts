module com_main {
    export class GrowFundItem extends CComponent {

        public m_labTip: eui.Label;
        public m_labtxt: eui.Label;
        public m_pLbGold: eui.BitmapLabel;
        public m_group: eui.List;
        public m_labOpDay: com_main.CLabel;
        public m_pAwardState: eui.Group;
        public m_imgBg: eui.Image;
        public m_labState: eui.Label;
        public m_pPlanRoot: eui.Group;
        public m_pLbPercent: eui.Label;
        public m_pBtnGet: com_main.ComButton;


        private m_percentNum: string;  //进度参数
        private m_id: number;     //id   
        private m_reward: IItemInfo[];     //奖励串   
        private m_num: number;       //额度    
        private m_desc: string;       //描述 
        private m_status: number;  //按钮状态
        private vo: GrowthFundVo;
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

            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = GrowFundItemRender;

            EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
            // this.refreshView();
        }

        /**刷新界面 */
        public refreshView() {
            if (this.m_reward) {
                let res = [];
                for (let i = 0; i < this.m_reward.length; i++) {
                    res.push(IItemInfoPool.create(this.m_reward[i].itemId, this.m_reward[i].count));
                }
                this.m_tCollection.replaceAll(res);
            }

            this.m_labTip.text = GCode(CLEnum.GEN_ROLE_LEVEL);
            this.m_pLbGold.x = this.m_labTip.x + this.m_labTip.width;
            this.m_pLbGold.text = this.m_num.toString();
            this.m_labtxt.text = GCode(CLEnum.GEN_LEVEL1);
            this.m_labtxt.x = this.m_pLbGold.x + this.m_pLbGold.width;
        }

        /**刷新按钮显示 */
        public refreshBtnView() {
            let planStr: string = `<font color=#abb7d1>${GCode(CLEnum.AC_PROGRESS)}</font>`;
            let vo = this.vo as GrowthFundVo;
            this.m_status = vo.getGrowFundBtnRed(this.m_num, this.m_id);

            this.m_percentNum = this.m_status == ActivityStatus.FINISH ? planStr + GCode(CLEnum.AC_FINISH) : planStr + RoleData.level + "/" + this.m_num;
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH ? true : false;
            this.m_pAwardState.visible = this.m_status == ActivityStatus.REWARD ? true : false;
            this.m_pPlanRoot.visible = this.m_status == ActivityStatus.REWARD ? false : true;
            this.m_pLbPercent.text = '';
            this.m_pBtnGet.y = 64;
            Utils.isGray(this.m_status == ActivityStatus.PROCESSING, this.m_pBtnGet);
            this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING ? false : true;
            this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));


        }

        /**领取奖励 */
        private onBtnGetHandler(e: egret.Event): void {
            if (!this.vo.buyGrowthFund) {
                let cfg = this.vo.getRechargeCfg();
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
                return;
            }
            ActivityProxy.C2S_ACTIVITY_GET_GROWTH_FUND_REWARD(this.vo.id, this.m_id);
        }
     
    }

    export class GrowFundItemRender extends eui.ItemRenderer {
        protected m_item: ComItemNew;
        private m_tData: IItemInfo;

        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_item = ComItemNew.create('name_num');
            this.addChild(this.m_item);
        }

        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            }
        }
    }

}