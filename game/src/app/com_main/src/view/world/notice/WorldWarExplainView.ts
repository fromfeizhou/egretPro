module com_main {

    export class WorldWarExplainView extends CComponent {
        public m_pViewRoot: eui.Group;
        public m_imgIcon: eui.Image;
        public m_labOpen: com_main.CLabel;
        public m_descImg: eui.Image;
        public m_labdesc: com_main.CLabel;
        public m_comTabTopGroup: com_main.ComTabTopGroup;



        private m_curIndex: number = 0;
        public constructor(width: number, height: number) {
            super();
            this.width = width;
            this.height = height;
            this.skinName = Utils.getSkinName("app/world/notice/WorldWarExplainViewSkin.exml");
        }
        public onDestroy(): void {
            super.onDestroy()

        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            this.removeEvent();
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            Utils.toStageBestScaleHeigt(this.m_pViewRoot);
            this.initView();
        }

        /**初始化界面 */
        public initView() {

            this.m_labOpen.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_OPEN_LEV, FunctionModel.getFunctionOpenLevel(FunctionType.WORLD_MAP)))
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_BRIEF) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_OCC) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_TROOP) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_AGG) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_YELLOW) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_OFFICE) });
            this.m_comTabTopGroup.setChangeCallback(this.changeTab, this);
            this.addEvent();
            this.updateUI();
        }
        public changeTab(selIndex: number) {
            if (this.m_curIndex == selIndex) return;
            this.m_curIndex = selIndex;
            this.updateUI();
        }
        public updateUI() {
            this.m_descImg.visible = true;
            this.m_labdesc.visible = true;
            switch (this.m_curIndex) {
                case 0: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_01_png"
                    break;
                }
                case 1: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_02_png"
                    break;
                }
                case 2: {
                    this.m_descImg.visible = false;
                    this.m_labdesc.textFlow = Utils.htmlParser(GCode(CLEnum.WOR_DESC1))
                    break;
                }
                case 3: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_03_png"
                    break;
                }
                case 4: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_04_png"
                    break;
                }
                case 5: {
                    this.m_descImg.visible = false;
                    this.m_labdesc.textFlow = Utils.htmlParser(GCode(CLEnum.WOR_DESC2))
                    break;
                }
            }
        }
        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */
        /**监听事件 */
        private addEvent() {

        }
        /**移除事件 */
        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */


    }

}