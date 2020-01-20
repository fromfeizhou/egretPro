module com_main {
    export class SevenIILeiChargePanel extends CComponent {

        public m_labBtnName: eui.Label;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIILeiChargePanelSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy();
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }
        //初始化
        public init(data: any) {
            // this.refreshItem();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }
        /**选中状态 */
        public select(select: boolean) {
            
        }

        /**设置物品信息 */
        public refreshItem(itemId: number, num: number) {
        }

    }
}