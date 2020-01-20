module com_main {


	/**
	 * 武将缘分弹出框
	 */
    export class GeneralFateView extends CView {
        public static NAME = 'GeneralFateView';
        public m_apopUp: com_main.APopUp;
        public m_fateScroller: eui.Scroller;
        public m_List: eui.List;

        private m_generalId: number;
        private m_tCollections: eui.ArrayCollection;
        public constructor(generalId: number) {
            super();
            this.m_generalId = generalId;
            this.name = GeneralFateView.NAME;
            this.initApp("fate/GeneralFateViewSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
            this.removeEvent();
            SceneResGroupCfg.clearModelRes([ModuleEnums.FATE_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_apopUp.setTitleLabel(GCode(CLEnum.FATE_GEN_TITLE))
            this.m_tCollections = new eui.ArrayCollection([]);

            this.m_List.dataProvider = this.m_tCollections;
            this.m_List.itemRenderer = GeneralFateCell;
            this.refreshList();
            this.initEvent();
        }
        /**更新数据 */
        public refreshList() {
            let fateList: FateVo[] = FateModel.getGeneralFateViewDataByGenId(this.m_generalId);
            fateList.sort(this.sortByStatus)
            this.m_tCollections.replaceAll(fateList);
        }
        public sortByStatus(p1: FateVo, p2: FateVo) {
            return p2.status - p1.status;
        }
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            EventMgr.addEvent(FateEvent.FATE_DATA_CHANGE, this.updateData, this);
        }
        /**update data */
        public updateData(id: number) {
            this.refreshList();
            /**弹出激活页面 */
            Utils.open_view(TASK_UI.FATE_GENERAL_ACTIVE_VIEW, id);
        }
        private removeEvent() {
            EventMgr.removeEventByObject(FateEvent.FATE_DATA_CHANGE, this);
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }

}