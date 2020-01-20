module com_main {
	/**
	 * 购买面板
	 */
    export class ComBuyWnd extends CView {
        public static NAME = 'ComBuyWnd';
        public m_PopUp: com_main.APopUp;
        public m_btnCost: com_main.ComCostTextButton;
        public m_comItem: com_main.ComItemNew;
        public m_labName: com_main.CLabel;
        public m_labDes: com_main.CLabel;
        public m_labNum: com_main.CLabel;
        public m_labSelNum: com_main.CLabel;

        private m_actitivtyId: number;  //活动id
        private m_nBuyNum = 0;      //需要数量
        private m_itemId: number;   //消耗的物品id
        private m_buyType: number;   //购买类型

        public constructor(data: any) {
            super();
            this.name = ComBuyWnd.NAME;
            this.m_buyType = data.buyType;
            this.m_itemId = data.itemId;
            this.m_nBuyNum = data.count ? data.count : 0;
            this.m_actitivtyId = data.turnTableVoId ? data.turnTableVoId : 0;

            this.initApp("tavern/TavernBuyDlgSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                // ProtoDef.TAVERN_ATTRACT,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.TAVERN_ATTRACT: {
                //     this.refreshItemNum();
                //     this.refreshBuyNum();
                //     break;
                // }
            }
        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            

            this.refreshItemView();
            this.refreshItemNum();
            this.refreshBuyNum();

            if(this.m_itemId == PropEnum.XW){
                this.m_btnCost.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.YU));
                this.m_btnCost.setTitleLabel('购买');
            }else{
                this.m_btnCost.setTitleLabel(GCode(CLEnum.BUY_AND_USE));
                this.m_btnCost.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.GOLD));
            }
            EventManager.addTouchScaleListener(this.m_btnCost, this, this.onClickBuy);
        }

        /**确认购买 */
        private onClickBuy() {
            switch (this.m_itemId) {
                case PropEnum.ZML: {
                    let cost = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME) * this.m_nBuyNum;
                    if (PropModel.isItemEnough(PropEnum.GOLD, cost, 1)) {
                        TavernProxy.send_TAVERN_ATTRACT(this.m_buyType);
                        UpManager.history();
                    }
                    break;
                }
                case PropEnum.TURNTABLE: {
                    var itemInfo = ConstUtil.getItems(IConstEnum.PRIZE_RECRUIT_CONSUME)[0];
                    let cost = itemInfo.count * this.m_nBuyNum;
                    if (PropModel.isItemEnough(PropEnum.GOLD, cost, 1)) {
                        TurnTableProxy.C2S_ACTIVITY_PRIZE_PLAY(this.m_actitivtyId, this.m_buyType);
                        UpManager.history();
                    }
                    break;
                }
                case PropEnum.XW: {
                    let yuNum = PropModel.getPropNum(PropEnum.YU);//玉石
                    let date = NormalModel.setQuickBuyCfg(PropEnum.XW);
                    let oneXwCost = date[0][3];
                    if(yuNum >= oneXwCost * this.m_nBuyNum){
                        QuickBuyProxy.C2S_QUCKLY_SHOP_BUY_GOODS(PropEnum.XW,this.m_nBuyNum);
                        UpManager.history();
                    }else{
                        Utils.open_view(TASK_UI.POP_PAY_SHOP_YU_VIEW);
                    }
                }
            }
        }
        /**设置购买数量 */
        private resetBuyNum() {

            switch (this.m_itemId) {
                case PropEnum.ZML: {//招募令
                    if (this.m_buyType == 0) {
                        this.m_nBuyNum = 1;
                    } else {
                        //多次招募
                        let num = RoleData.recruit;
                        //数量为0 打折9张
                        if (num == 0) {
                            this.m_nBuyNum = 9;
                        } else {
                            this.m_nBuyNum = 9 - num;
                        }
                    }
                    break;
                }
            }
        }
        /**初始化购买次数 */
        private refreshItemNum() {
            let countStr: string;
            if (this.m_itemId == PropEnum.ZML) {
                countStr = RoleData.recruit.toString();
            } else {
                let prizeNum = PropModel.getPropNum(this.m_itemId);//幸运转盘数量
                countStr = prizeNum.toString();
            }
            this.m_labNum.text = countStr;
        }


        /**刷新物品 */
        private refreshItemView() {
            let cfg = PropModel.getCfg(this.m_itemId);
            Utils.setPropLabName(cfg.id, this.m_labName);
            this.m_labDes.text = cfg.description;
            // this.m_labNum.text = RoleData.recruit.toString();
            this.m_comItem.setItemInfo(this.m_itemId);
        }

        /**刷新购买数量 */
        private refreshBuyNum(): void {
            this.resetBuyNum();
            this.m_labSelNum.text = this.m_nBuyNum + "";
            let Count = 0;
            if (this.m_itemId == PropEnum.TURNTABLE) {
                var itemInfo = ConstUtil.getItems(IConstEnum.PRIZE_RECRUIT_CONSUME)[0];
                Count = itemInfo.count;
            }else if (this.m_itemId == PropEnum.XW) {
                let date = NormalModel.setQuickBuyCfg(PropEnum.XW);
                Count = date[0][3];
            }else {
                Count = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME);
            }
            let cost = Count * this.m_nBuyNum;
            this.m_btnCost.setCostLabel("" + cost);
        }
    }
}