module com_main {
	/**
	 * 首占奖励面板
	 */
    export class WorldCityTroopPanel extends CView {
        public static NAME = 'WorldCityTroopPanel';
        public m_pBtnClose: eui.Group;
        public m_pBtnInfo: eui.Group;
        public m_pScroller: eui.Scroller;
        public m_List: eui.List;


        private m_tCollections: eui.ArrayCollection;
        private m_tDataArr: com_main.ITroopData[];
        public constructor(data: any) {
            super();
            this.name = WorldFirstOccupyPanel.NAME;
            this.m_tDataArr = data;
            this.initApp("world/WorldCityTroopPanelSkin.exml");

        }
        public onDestroy(): void {

            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.initEvent();
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_tCollections;
            this.m_List.itemRenderer = WorldCityTroopCell;
            this.refreshViewData();
        }

        public refreshViewData() {
            this.m_tCollections.replaceAll(this.m_tDataArr);
        }
        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPanel, this);

        }

        /**点击界面的时候关闭 */
        public onTouchPanel(pvt: egret.TouchEvent) {
            UpManager.history();
        }
        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
    export interface ITroopData {
        name: string,
        count: number,
        troop: number
    };

}