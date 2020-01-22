module com_main {
    export interface IRechargeItemRD {
        type: number;        //ui类型 0：LoginDaildItem 1：PayShopAwardItem 2: GrowFundItem
        width: number;      //宽度
        id: number;          //配置表id
        reward: IItemInfo[];      //奖励
        num: number;         //当前进度
        desc: string;        //描述
        vo: ActivityVo;      //活动数据结构
    }

    export class RechargeItemRender extends eui.ItemRenderer {
        private m_item: LoginDaildItem | PayShopAwardItem | PurchageGiftBagItem | GrowFundItem;
        private m_tData: IRechargeItemRD;
        private m_bInit: boolean;

        protected childrenCreated(): void {
            super.childrenCreated();

        }

        protected dataChanged() {
            let list = this.parent as eui.List;
            this.m_tData = this.data;
            if (!this.m_tData) return;
            if (!this.m_bInit) {
                if (this.m_tData.type == 0) {
                    this.m_item = new LoginDaildItem();
                } else if (this.m_tData.type == 1) {
                    this.m_item = new PayShopAwardItem();
                } else if (this.m_tData.type == 2) {
                    this.m_item = new PurchageGiftBagItem();
                } else if (this.m_tData.type == 3) {
                    this.m_item = new GrowFundItem();
                }
                this.addChild(this.m_item);
                this.m_item.width = this.m_tData.width;
                this.m_bInit = true;
            }

            this.m_item.init({ id: this.m_tData.id, reward: this.m_tData.reward, num: this.m_tData.num, desc: this.m_tData.desc, vo: this.m_tData.vo });
        }
    }

    export class LoginDaildItem extends CComponent {

        private m_pLbGold: eui.Label;
        private m_pLbPercent: eui.Label;     //进度
        private m_pPlanRoot: eui.Group;
        private m_pAwardState: eui.Group;
        private m_group: eui.List;  //奖励
        private m_pBtnGet: ComButton;
        public m_imgBg: eui.Image;
        public m_labState: eui.Label;
        public m_labOpDay: com_main.CLabel;//第几天开启
        public m_labtxt: eui.Label;

        private m_id: number;     //id   
        private m_reward: IItemInfo[];     //奖励串   
        private m_num: number;       //额度    
        private m_desc: string;       //描述 
        public m_labTip: eui.Label;   //消费类型描述
        private m_status: number;  //按钮状态
        private vo: AcLoginDayVo;
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
            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = AwardItemRender;

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
            this.m_labtxt.visible = false;
            this.m_labTip.text = GCodeFromat(CLEnum.AC_GET_DAY, Global.getChineseNum(this.m_num));
            this.m_pLbGold.text = '';
            this.m_labOpDay.text = GCodeFromat(CLEnum.AC_GET_DAY_AFTER, this.vo.getCurday(this.m_num));
        }

        /**刷新按钮显示 */
        public refreshBtnView() {

            let planStr: string = GCode(CLEnum.AC_CO_PROGRESS);
            let currpro: number;
            this.m_status = this.vo.getLoginDailyBtnRed(this.m_num, this.m_id);
            this.m_pBtnGet.visible = this.m_status == ActivityStatus.FINISH ? true : false;
            this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING ? false : true;
            this.m_pBtnGet.y = 64;
            Utils.isGray(this.m_status == ActivityStatus.PROCESSING, this.m_pBtnGet);
            this.m_pAwardState.visible = this.m_status == ActivityStatus.REWARD || this.m_status == ActivityStatus.FAILURE ? true : false;
            Utils.isGray(this.m_status == ActivityStatus.FAILURE, this.m_imgBg);

            this.m_labOpDay.visible = this.m_status == ActivityStatus.PROCESSING ? true : false;
            this.m_labState.text = this.m_status == ActivityStatus.FAILURE ? GCode(CLEnum.AC_GET_SX) : GCode(CLEnum.TAKE_OUT_END);
            this.m_pPlanRoot.visible = false;
            this.m_pBtnGet.setTitleLabel(GCode(CLEnum.TAKE_OUT));

        }

        /**领取奖励 */
        private onBtnGetHandler(e: egret.Event): void {
            if (this.m_status !== ActivityStatus.FINISH) {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                return;
            }
            ActivityProxy.C2S_ACTIVITY_GET_LOGIN_DAYS_REWARD(this.vo.id, this.m_id);
        }
    }

    export class PurchageGiftBagItem extends CComponent {

        public m_labDesc: eui.Label;
        public m_group: eui.List;
        public m_pPlanRoot: eui.Group;
        public m_pLbPercent: eui.Label;
        public m_pBtnGet: com_main.ComPayButton;
        public m_vipRoot: eui.Group;
        public m_pLabTip: eui.Label;
        public m_pBtnGet1: com_main.ComPayButton;

        private m_id: number;     //id   
        private m_reward: IItemInfo[];     //奖励串   
        private m_num: number;       //额度    
        private m_desc: string;       //描述 
        private m_status: number;  //按钮状态
        private vo: AcPuGigtBagVo;
        private m_tCollection: eui.ArrayCollection;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/pay/PurchargeGiftBagItemSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListener(this.m_pBtnGet);
            EventManager.removeEventListener(this.m_pBtnGet1);
            EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
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
            this.refreshVipBtnInfo();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_tCollection = new eui.ArrayCollection();
            this.m_group.dataProvider = this.m_tCollection;
            this.m_group.itemRenderer = AwardItemRender;

            EventManager.addTouchScaleListener(this.m_pBtnGet, this, this.onBtnGetHandler);
            EventManager.addTouchScaleListener(this.m_pBtnGet1, this, this.onBtnbyVip);
            EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.refreshVipBtnInfo, this);
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
            this.m_labDesc.text = `${L.getInstance().getLanguage(this.m_desc)}`
            this.m_pLbPercent.textFlow = Utils.htmlParser((GCodeFromat(CLEnum.AC_SHOP_LIMIT, this.vo.getbuyCount(this.m_id), this.vo.getbuyLimitCout(this.m_id))));

        }

        /**刷新按钮显示 */
        public refreshBtnView() {
            this.m_status = this.vo.getPurchageGiftBagBtnRed(this.m_id);
            this.m_status = this.vo.getPurchageGiftBagBtnRed(this.m_id);
            this.m_pBtnGet.enabled = this.m_status == ActivityStatus.PROCESSING;
            // let sources = this.m_status != ActivityStatus.FINISH?PropModel.getPropIcon(this.m_num[0].key):'';
            // let price = this.m_status != ActivityStatus.FINISH ? this.m_num : GCode(CLEnum.TAKE_OUT);
            if (this.m_status != ActivityStatus.FINISH) {
                this.m_pBtnGet.cost = this.m_num;

            } else {
                this.m_pBtnGet.otherLabel = GCode(CLEnum.TAKE_OUT);
            }

            Utils.isGray(this.m_status !== ActivityStatus.PROCESSING, this.m_pBtnGet);
        }
        /**刷新vip购买按钮显示 */
        public refreshVipBtnInfo() {
            let price = VipModel.getHVipGoldBuyPrice(this.m_num);
            this.m_pBtnGet1.setCostLabel(price.toString());
            this.m_pLabTip.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HEIGHT_VIP_BUY, VipModel.getHVipGoldLv()));
            this.m_vipRoot.visible = VipModel.isHVipGoldDis();
            this.m_pBtnGet1.enabled = this.m_status == ActivityStatus.PROCESSING;
            Utils.isGray(this.m_status !== ActivityStatus.PROCESSING, this.m_pBtnGet1);
        }
        /**领取奖励 */
        private onBtnGetHandler(e: egret.Event): void {
            if (this.m_status == ActivityStatus.PROCESSING) {
                // if (PropModel.isItemEnough(PropEnum.YU, this.m_num[0].value, 1)) {
                //     PayProxy.C2S_JADE_BUY(this.m_id);
                //     // UpManager.history();
                //     return;
                // }
                PayProxy.C2S_RECHARGE(this.m_id, this.m_num);
            }
        }
        /**vip10购买 */
        private onBtnbyVip(e: egret.Event) {
            let price = VipModel.getHVipGoldBuyPrice(this.m_num);
            if (VipModel.canHVipBuy(price)) {
                PayProxy.C2S_GOLD_BUY(this.m_id);
            }
        }
    }

    export class AwardItemRender extends eui.ItemRenderer {
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