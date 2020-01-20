module com_main {


	/**
	 * 招募购买面板
	 */
    export class TavernBuyDlg extends CView {
        public static NAME = 'TavernBuyDlg';
        public m_PopUp: com_main.APopUp;
        public m_btnCost: com_main.ComCostTextButton;
        public m_comItem: com_main.ComItemNew;
        public m_labName: com_main.CLabel;
        public m_labDes: com_main.CLabel;
        public m_labNum: com_main.CLabel;
        public m_labSelNum: com_main.CLabel;

        private m_nBuyNum = 0;      //需要数量
        private m_nType: number = 0;  //招募类型（0为一次，1为10次）

        public constructor(data: any) {
            super();
            this.name = TavernBuyDlg.NAME;
            this.m_nType = data.type;

            this.initApp("tavern/TavernBuyDlgSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.TAVERN_ATTRACT,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.TAVERN_ATTRACT: {
                    this.refreshItemNum();
                    this.refreshBuyNum();
                
                    break;
                }
            }
        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_PopUp.setTitleLabel(GCode(CLEnum.BUY_SURE));
            this.m_btnCost.setTitleLabel(GCode(CLEnum.BUY_AND_USE));

            this.refreshItemView();
            this.refreshItemNum();
            this.refreshBuyNum();
            this.m_btnCost.setCostImg(RoleData.GetMaterialIconPathById(PropEnum.GOLD));

            EventManager.addTouchScaleListener(this.m_btnCost, this, this.onClickBuy);
        }

        /**确认购买 */
        private onClickBuy() {
            let cost = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME) * this.m_nBuyNum;
            if (PropModel.isItemEnough(PropEnum.GOLD, cost, 1)) {
                TavernProxy.send_TAVERN_ATTRACT(this.m_nType);
                UpManager.history();
            }
        }
        /**设置购买数量 */
        private resetBuyNum() {
            if (this.m_nType == 0) {  //单次招募
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
        }
        /**初始化购买次数 */
        private refreshItemNum() {
            this.m_labNum.text = RoleData.recruit.toString();
        }


        /**刷新物品 */
        private refreshItemView() {
            let cfg = PropModel.getCfg(PropEnum.ZML);
            Utils.setPropLabName(PropEnum.ZML, this.m_labName);
            this.m_labDes.text = cfg.description;
            this.m_labNum.text = RoleData.recruit.toString();
            this.m_comItem.setItemInfo(PropEnum.ZML);
        }

        /**刷新购买数量 */
        private refreshBuyNum(): void {
            this.resetBuyNum();
            this.m_labSelNum.text = this.m_nBuyNum + "";
            let cost = ConstUtil.getValue(IConstEnum.TAVERN_RECRUIT_CONSUME) * this.m_nBuyNum;
            this.m_btnCost.setCostLabel("" + cost);
        }
    }
}