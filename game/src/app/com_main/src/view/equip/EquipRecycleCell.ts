module com_main {
    /** */
    export class EquipRecycleCell extends CComponent {
        public static NAME: string = 'EquipRecycleCell';

        public m_labEqLv: eui.Label;
        public m_imgSelect: eui.Image;

         public oneState: boolean;   //单选状态
        public constructor() {
            super();
            this.name = EquipItem.NAME;
            this.skinName = Utils.getAppSkin("equip/EquipRecycleCellSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            super.onDestroy();
        }
        protected childrenCreated() {
            super.childrenCreated();
            this.validateNow();
        }
        /**设置选中信息 */
        public setRecycleInfo(level: number, state: boolean) {
            this.m_labEqLv.text = level+'级';
            this.m_imgSelect.visible = state;
        }
    }
}