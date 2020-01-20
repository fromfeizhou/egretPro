module com_main {
    export class MainCrossBar extends CView {
        public static NAME = 'MainCrossBar';
        public m_btnBack: eui.Image;
        public m_teamView: com_main.CrossQueView;
        public m_btnTeam: eui.Group;
        public m_btnFigthRecord: eui.Group;
        public m_btnRank: eui.Group;
        public m_btnBuff: eui.Group;


        public constructor() {
            super();
            this.name = MainCrossBar.NAME;
            this.initApp("top_new/MainCrossBarSkin.exml");
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.currentState = CrossModel.crossStatus == CrossServerState.WALL_WAR || CrossModel.crossStatus == CrossServerState.MATCH_SUC ? 'wall' : 'base';
            Utils.toStageBestScaleHeigt(this);
            this.touchEnabled = false;

            if (GameConfig.getIsNotchScreen()) {
                this.m_teamView.left += GameConfig.notchPixel;
            }
            this.m_teamView.initData(TeamType.CROSS_SERVER);
            this.initEvent();

        }


		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private initEvent() {
            EventManager.addTouchScaleListener(this.m_btnBack, this, this.onBtnBack);
            EventManager.addTouchScaleListener(this.m_btnTeam, this, this.onBtnTeam);
            EventManager.addTouchScaleListener(this.m_btnFigthRecord, this, this.onBtnFightRecord);
            EventManager.addTouchScaleListener(this.m_btnRank, this, this.onBtnRank);
            EventManager.addTouchScaleListener(this.m_btnBuff, this, this.onBtnBuff);
            
            RedPointModel.AddInfoListener(this.m_btnRank, { x: 50, y: -5 }, [RedEvtType.CROSS_RANK_RY], 2);
        }
        private removeEvent() {
            EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
        }

        /**返回按钮 */
        private onBtnBack() {
            SceneManager.runSceneBefore();
        }

        /**军团按钮 */
        private onBtnTeam() {
            CrossModel.openArmyWnd()
        }

        /**战况按钮 */
        private onBtnFightRecord() {
            debug('战况按钮点击');
            Utils.open_view(TASK_UI.CRSOS_SERVER_WAR_SITUTION)
        }

        /**排名按钮 */
        private onBtnRank() {
            Utils.open_view(TASK_UI.CROSS_SERVER_RANK);
        }

        /**buff按钮 */
        private onBtnBuff() {
            Utils.open_view(TASK_UI.CROSS_SERVER_BUFF);
        }



		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
    }
}