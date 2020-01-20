module com_main {

    /**
     * 充值面板
     */
    export class PayShopView extends CView {

        public static NAME = "PayShopView";
        public m_pViewRoot: eui.Group;
        public m_labPlayerVip: eui.BitmapLabel;
        public m_labTaget: eui.Label;
        public m_lbExp: eui.Label;
        public m_imgVipPro: com_main.CImage;
        public m_btnRecharge: com_main.ComButton;
        public m_imgVip: eui.Image;
        public m_pRoot:eui.Group;

        public m_MainTopNew: MainTopNew;
        public m_pGSroller: eui.Group;
        private m_pViews: any[] = [];
        private m_pCellList: Array<PayShopBuyItem>;
        public m_nCurSelect: number;

        public constructor(param?: number) {
            super();
            this.name = PayShopView.NAME;
            this.m_nCurSelect = param || 0;
            this.initApp("pay/pay_shop_view.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }

        protected executes(notification: AGame.INotification) {

        }

        public onDestroy(): void {
            for (let key in this.m_pViews) {
                let view = this.m_pViews[key];
                if (view.onDestroy) {
                    view.onDestroy();
                }
            }
            this.m_pCellList = null;
            SceneResGroupCfg.clearModelRes([ModuleEnums.PAY_SHOP_VIEW_UI]);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this);

            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_RE));
            this.m_btnRecharge.setTitleLabel(GCode(CLEnum.AC_SEE_VIP));
            this.refreshView();

            this.refreshVipLv();
            this.refreshVipExp();

            Utils.toStageBestScale(this.m_pRoot);

            EventManager.addTouchScaleListener(this.m_btnRecharge, this, this.onBtnVipShopHandler);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this.refreshRechargeView, this);
        }
        /**刷新显示 */
        public refreshView() {
            this.m_pCellList = [];
            let shopCfg = PayModel.rechargeCfgs;
            for (let id in shopCfg) {
                let info = shopCfg[id];
                if (info != null && info != undefined) {
                    if (info.shopType == RechargeType.RECHARGE) {
                        let item = new PayShopBuyItem(info.id);
                        this.m_pGSroller.addChild(item);
                        this.m_pCellList.push(item);
                    }
                }
            }
        }
        private reshreshBuyItem() {

            for (let i = 0; i < this.m_pCellList.length; i++) {
                this.m_pCellList[i].refreshFirstFlag();
            }
        }
        /**充值完刷新*/
        public refreshRechargeView() {
            this.refreshVipLv();
            this.refreshVipExp();
            this.reshreshBuyItem();
        }
        /**vip*/
        public onBtnVipShopHandler(pvt: egret.TouchEvent) {
            Utils.open_view(TASK_UI.VIP_MAIN_PANEL);
        }
        /**刷新vip等级 */
        private refreshVipLv() {
            this.m_labPlayerVip.text = GCodeFromat(CLEnum.VIP_LEVEL, RoleData.vipLevel);
        }
        /**刷新vip经验 */
        private refreshVipExp() {
            let cfg = VipModel.getVipCfgByLv(RoleData.vipLevel);
            let pro: number = 0;

            let preCfg = VipModel.getVipCfgByLv(RoleData.vipLevel - 1);
            this.m_lbExp.visible = RoleData.vipLevel !== VipModel.MAX_VIP
            if (RoleData.vipLevel > 0) {
                this.m_lbExp.text = cfg.exp - preCfg.exp >= 0 ? `${RoleData.vipIntegral - preCfg.exp}/${cfg.exp - preCfg.exp}` : `${RoleData.vipIntegral - preCfg.exp}`;
                pro = Math.min((RoleData.vipIntegral - preCfg.exp) / (cfg.exp - preCfg.exp), 1);
                // if ( RoleData.vipLevel == VipModel.MAX_VIP) {
                //     this.m_lbExp.text = `${ RoleData.vipIntegral}`
                // }
            } else {
                this.m_lbExp.text = `${RoleData.vipIntegral}/${cfg.exp}`;
                pro = Math.min(RoleData.vipIntegral / cfg.exp, 1);
            }
            this.m_imgVipPro.width = VipWnd.PRO_MAX * pro;

            if (RoleData.vipLevel < VipModel.MAX_VIP) {
                let cfg = VipModel.getVipCfgByLv(RoleData.vipLevel);
                let exp = cfg.exp - RoleData.vipIntegral;
                exp = Math.max(0, exp);
                this.m_labTaget.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.VIP_NEXT_TIPS, exp, RoleData.vipLevel + 1));
            } else {
                this.m_labTaget.text = '';
            }
        }


    }

}