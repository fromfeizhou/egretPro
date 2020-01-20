module com_main {

    /**
     * 功能预览
     * @exportFunctionPreviewCell
     * @class 
     * @extends eui.ItemRenderer
     */
    export class FunctionPreviewCell extends eui.ItemRenderer {
        public m_pLbName: eui.Label;
        public m_pIco: com_main.CImage;
        public m_pLbContent: eui.Label;
        public m_pBtnGo: eui.Group;
        public m_pBtn: com_main.ComButton;
        public m_pOpenLev: eui.Label;

        private m_tData: FunctionConfig
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/function/FunctionPreviewCellSkin.exml");
            EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickTurn);
        }
        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }
        public onDestroy(): void {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }
        /**跳转前往 */
        public onClickTurn() {
            FunctionModel.funcToPanel(this.m_tData.turnPanel);
        }
        public dataChanged() {
            super.dataChanged();
            this.m_tData = this.data;
            let isOpen = FunctionModel.isFunctionOpen(this.m_tData.id);
            this.m_pLbName.text = this.m_tData.name;
            this.m_pIco.source = FunctionModel.getBtnSource(this.m_tData.id);
            this.m_pLbContent.textFlow =(new egret.HtmlTextParser).parser(GLan(this.m_tData.text));
            this.m_pOpenLev.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT,this.m_tData.openLevel);
            this.m_pOpenLev.visible = !isOpen;
            this.m_pBtnGo.visible = this.m_tData.turnPanel != 0;
            if (isOpen) {
                this.m_pBtn.enabled = true;
                this.m_pBtn.setTitleLabel(GCodeFromat(CLEnum.GO_TO));
                Utils.isGray(false, this.m_pBtn)
            } else {
                this.m_pBtn.enabled = false;
                this.m_pBtn.setTitleLabel(GCodeFromat(CLEnum.FUNC_UNOPEN));
                Utils.isGray(true, this.m_pBtn)
            }
        }
    }


}