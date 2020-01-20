
module com_main {
    /**属性 */
    export class TipsEquipAttri extends eui.ItemRenderer {
        public m_labCurLv: com_main.CLabel;
        public m_labCurLv0: com_main.CLabel;
        public m_labCurLv1: com_main.CLabel;
        public m_labCurLv2: com_main.CLabel;
        protected m_tData: ItipsEquipAttriRender;

        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.refresh();
        }

        protected refresh() {
            this.m_labCurLv.text = this.m_tData.currName;
            this.m_labCurLv0.text = this.m_tData.currValue;
            this.m_labCurLv1.text = this.m_tData.nextName;
            this.m_labCurLv2.text = '+' + this.m_tData.nextValue;

        }
    }
}

