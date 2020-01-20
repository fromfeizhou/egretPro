module com_main {
    export class SevenIITabBtn extends CComponent implements TabCompont {

        public m_labBtnName: eui.Label;
        public m_imgSelect: eui.Image;
        public m_tabIndex: number;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/sevenII/SevenIITabBtnSkin.exml");
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
        }
        setTabIndex(index: number) {
            this.m_tabIndex = index;
        }

        getTabIndex() {
            return this.m_tabIndex;
        }
        /**设置按钮文本 */
        public setTitleLabel(btnStr: string) {
            this.m_labBtnName.text = btnStr;
        }
        setSelectState(boo: boolean) {
            if (boo) {
                this.m_imgSelect.source = 'btn_141_png'
            } else {
                this.m_imgSelect.source = 'btn_140_png'
            }
        }
    }
}