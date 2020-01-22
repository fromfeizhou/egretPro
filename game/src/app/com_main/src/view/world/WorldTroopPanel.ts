module com_main {

    export class WorldTroopPanel extends CView {

        public static readonly NAME = "WorldTroopPanel";
        public m_pBtnClose: eui.Group;
        public m_btnTrian: com_main.ComButton;
        public m_btnTroop: com_main.CImage;
        public m_pQuickAddBtn: com_main.ComCostTextButton;

        public m_nOrder: number = 0;
        public m_gold: number = 0;
        private m_teamVo: TeamVo;
        public constructor(data: any) {
            super();
            this.m_nOrder = data.order;
            this.name = WorldTroopPanel.NAME;
            this.initApp("world/WorldTroopPanelSkin.exml");
        }


        public onDestroy(): void {
            super.onDestroy();

            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();


            this.initEvent();
            this.m_pQuickAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP_ALL))
            this.m_btnTrian.setTitleLabel(GCode(CLEnum.GO_TO))
            this.m_teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nOrder);
            this.calcuGold();
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, this.closeView);
            EventManager.addTouchScaleListener(this.m_btnTrian, this, this.onTrainBtn);
            EventManager.addTouchScaleListener(this.m_pQuickAddBtn, this, this.onQuickTroop);
        }
        public onTrainBtn() {
            UpManager.history();
            if (!this.m_teamVo.isSoldierFull() && this.m_teamVo.isSoliderCanFill()) {
                Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_nOrder });
            } else {
                Utils.open_view(TASK_UI.ARMS_PANEL);
            }

        }
        public onQuickTroop() {
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nOrder);
            if (TeamModel.isWar(teamVo.state)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL1), 1, true);
                return;
            }
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold, 1)) {
                TeamModel.isNeedTroopTips = true;
                UpManager.history();
                TeamProxy.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS(this.m_nOrder);
            }
        }
        public calcuGold() {
            let gold = Math.ceil(this.m_teamVo.getFillHpCostGold());
            this.m_pQuickAddBtn.setCostLabel(`${gold}`)
            this.m_gold = gold;
        }
        public closeView() {
            UpManager.history();
        }
        private removeEvent() {
            EventManager.removeEventListener(this.m_pBtnClose);
        }





    }


}