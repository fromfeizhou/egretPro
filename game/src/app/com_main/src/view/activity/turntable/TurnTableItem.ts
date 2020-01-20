module com_main {
    export class TurnTableItem extends CComponent {

        public m_imgBg: eui.Image;
        public m_pComItem: com_main.ComItemNew;
        public m_labName: eui.Label;
        public m_RareRoot: eui.Group;
        public m_CountRoot: eui.Group;
        public m_labFight: eui.BitmapLabel;
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/turntable/TurnTableItemSkin.exml");
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
            if (select) {
               this.m_imgBg.source='zyt_36_png';
            }else{
                this.m_imgBg.source='zyt_35_png';
            }
        }

        /**设置物品信息 */
        public refreshItem(itemId: number, num: number,reset:number) {
            this.m_pComItem.setItemInfo(itemId, num);
            this.setItemName(itemId);
            this.ShowLogo(reset);
        }
        /**设置物品名字 */
        public setItemName(itemId: number) {
            if (this.m_labName) {
                Utils.setPropLabName(itemId, this.m_labName)
            }
        }
         /**设置稀有物品标识 */
        public ShowLogo(reset:number) {
            this.m_RareRoot.visible=reset==1;
        }
    }
}