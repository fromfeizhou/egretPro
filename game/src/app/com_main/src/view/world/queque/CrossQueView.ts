module com_main {

    /**
     * 行军列队
     */
    export class CrossQueView extends WorldQueView {
        public static NAME = "CrossQueView";

        public constructor() {
            super();
            this.name = CrossQueView.NAME;
            // this.skinName = Utils.getAppSkin("world/queque/WorldQueViewSkin.exml");
        }

        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        protected addEvent() {

        }

        protected removeEvent() {
            EventManager.removeEventListeners(this);
        }

        /**改变选中 */
        protected onChangeSel(index: number) {
            Utils.open_view(TASK_UI.CROSS_SERVER_TEAM_PANEL, { id: index });
        }

        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 
    }

}