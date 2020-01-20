module com_main {

    export class PayShopRechargeView extends CView {
        public m_pGSroller: eui.Group;

        public constructor(width: number, height: number) {
            super();
            this.skinName = Utils.getSkinName("app/pay/PayShopRechargeSkin.exml");
            this.width = width;
            this.height = height;
        }

        public onDestroy(): void {
            super.onDestroy();

        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.refreshView();
            egret.callLater(() => {
                if (this.m_pGSroller) {
                    Utils.tileGroupToCenter(this.m_pGSroller, 512);
                }
            }, this);
        }

        /**刷新显示 */
        public refreshView() {
            // let shopCfg = C.ShopConfig;
            // for (let id in shopCfg) {
            //     let info = shopCfg[id];
            //     if (info != null && info != undefined) {
            //         if (info.storeType == StoreType.TopUp) {
            //             let item = new PayShopBuyItem(info.id);
            //             this.m_pGSroller.addChild(item);
            //         }
            //     }
            // }
        }



    }

}