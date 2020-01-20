module com_main {

    export class PayShopAwardView extends CComponent implements IRechargeMainWnd {
        public m_pGSroller: eui.Group;

        /**面板类型 */
        public activityType: AcViewType;
        public bInit: boolean;
        public constructor(type: AcViewType) {
            super();
            this.activityType = type;
            this.skinName = Utils.getSkinName("app/pay/PayShopAwardSkin.exml");
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
        }

        /**刷新显示 */
        public refreshView() {
            //   let cfg = C.AccumulatedTopUpConfig
            let cfg = null;
            for (let id in cfg) {
                if (cfg[id] != null && cfg[id] != undefined) {
                    let awardItem = new PayShopAwardItem();
                    this.m_pGSroller.addChild(awardItem);
                }
            }
        }

        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
        }

        public initView() {

        }

    }

}