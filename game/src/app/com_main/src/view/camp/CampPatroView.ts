module com_main {

    /**
     * 活动类军营系统
     * @export
     * @class CampView
     * @extends CView
     */
    export class CampPatroView extends CView {

        public static readonly NAME = "CampPatroView";

        public m_teamPanel: com_main.TeamPanel;
        public m_pBtnBack: eui.Group;

        public constructor() {
            super();
            this.name = CampPatroView.NAME;
            this.initApp("team/CampPatroViewSkin.exml");
        }

        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_teamPanel.setTeamData(TeamType.PVE);
            this.m_teamPanel.setTeamTileName(GCode(CLEnum.CAMP_ARMY1));
            this.m_teamPanel.setfightBtnName(GCode(CLEnum.CAMP_FIGHT));

            this.addEvent();
        }

        private addEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnBack, this, () => {
                UpManager.history();
            });

            EventMgr.addEvent(TeamUIEvent.TEAM_BTN_FIGHT, this.onBtnFight, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(TeamUIEvent.TEAM_BTN_FIGHT, this);
        }


        /**挑战按钮点击 */
        private onBtnFight() {
            let teamVo = TeamModel.getTeamVoByType(TeamType.PVE);
            if (teamVo.isEmptyTeam()) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_TIPS), 1, true);
                return;
            }
            PatrolProxy.send_C2S_PATROL_CHALLENGE();
        }


    }
}