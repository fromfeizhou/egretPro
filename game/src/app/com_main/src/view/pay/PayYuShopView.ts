module com_main {

    /**
     * 玉石充值面板
     */
    export class PayYuShopView extends CView {

        public static NAME = "PayYuShopView";
        public m_MainTopNew:com_main.MainTopNew;
        public m_pSroller:eui.Scroller;
        public m_list:eui.Group;

        private m_pViews: any[] = [];
        private m_pCellList: Array<PayShopBuyItem>;
        public constructor(param?: number) {
            super();
            this.name = PayYuShopView.NAME;
            this.initApp("pay/payYuShopSkin.exml");
        }

        public onDestroy(): void {
            for (let key in this.m_pViews) {
                let view = this.m_pViews[key];
                if (view.onDestroy) {
                    view.onDestroy();
                }
            }
            this.m_pCellList = null;
            SceneResGroupCfg.clearModelRes([ModuleEnums.YU_SHOP_VIEW_UI]);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_RE));
            this.m_MainTopNew.setResources([PropEnum.YU]);
            this.refreshView();

            Utils.toStageBestScale(this.m_pSroller);
        }
        /**刷新显示 */
        public refreshView() {
            this.m_pCellList = [];
            let shopCfg = PayModel.rechargeCfgs;
            for (let id in shopCfg) {
                let info = shopCfg[id];
                if (info != null && info != undefined) {
                    if (info.shopType == RechargeType.YU_RECHARGE) {
                        let item = new PayShopBuyItem(info.id);
                        this.m_list.addChild(item);
                        this.m_pCellList.push(item);
                    }
                }
            }
        }

    }

}