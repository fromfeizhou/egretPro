module com_main {
    /**
     * 襄阳战（帝位争夺）
     * 4.皇帝登基弹出公告UI Coronation
     */
    export class EmperorBattleCoronationView extends CView {
        public static NAME = 'EmperorBattleCoronationView';

        private m_pTitle: eui.Image;
        private m_pName: com_main.CLabel;

        private m_notice: gameProto.IS2C_EMPEROR_CHANE_NOTICE;
        public constructor(notice: gameProto.IS2C_EMPEROR_CHANE_NOTICE) {
            super();

            this.initApp("activity/emperorBattle/EmperorBattleCoronationSkin.exml");
            this.m_notice = notice;
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.CORONA_VIEW]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.initEvent();
            // let coutryStr: string = WorldModel.checkCountry(this.m_notice.countryId);
            let desctr = GCodeFromat(CLEnum.XIANGYANG_EMPEROR_TIPS, this.m_notice.playerName);
            this.m_pName.textFlow = Utils.htmlParser(desctr);
            this.m_pTitle.source = `lb_jmdw_png`;
        }


		/**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        private initEvent() {
            EventManager.addTouchScaleListener(this, this, this.onClick);
        }

        /**跳转前往 */
        public onClick() {
            UpManager.history();
        }
    }
}