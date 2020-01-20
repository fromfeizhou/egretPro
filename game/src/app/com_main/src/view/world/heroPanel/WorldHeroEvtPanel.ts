module com_main {
    /**
     * 部队事件选中面板
     */
    export class WorldHeroEvtPanel extends CView {

        public static readonly NAME = "WorldHeroEvtPanel";

        public m_aPopUp: com_main.APopUp;
        public m_pSroller: eui.Scroller;
        public m_pList: eui.List;

        private m_pCollection: eui.ArrayCollection;
        private m_evtPosId: number;  //事件位置id
        private m_cityId: number;
        public constructor(data: any) {
            super();
            this.name = WorldHeroEvtPanel.NAME;
            this.m_evtPosId = data.evtPosId;
            this.m_cityId = data.cityId;
            this.initApp("world/WorldHeroEvtPanelSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_aPopUp.setTitleLabel('出征部队选择')

            this.m_pCollection = new eui.ArrayCollection();
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = WorldHeroEvtItem;
            this.m_pList.useVirtualLayout = true;

            let list: IWorldHeroEvtItemRD[] = [];
            for (let i = 0; i < TeamModel.getTeamMax(TeamType.WORLD); i++) {
                let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, i);
                // if (!teamVo.isEmptyTeam()) {
                list.push({ order: i, cityId: this.m_cityId, evtId: this.m_evtPosId })
                // }
            }
            list.sort(this.sortyByState);
            this.m_pCollection.replaceAll(list);

            this.onGuideCondition();
          
        }

        /**根据状态排序 */
        public sortyByState(p1: IWorldHeroEvtItemRD, p2: IWorldHeroEvtItemRD) {
            let teamVo1 = TeamModel.getTeamVoByType(TeamType.WORLD, p1.order);
            let state1 = WorldModel.getTeamEvtTypeById(teamVo1.id);
            if (teamVo1.isEmptyTeam()) state1 = 200;
            let teamVo2 = TeamModel.getTeamVoByType(TeamType.WORLD, p2.order);
            let state2 = WorldModel.getTeamEvtTypeById(teamVo2.id);
            if (teamVo2.isEmptyTeam()) state2 = 200;
            if (state1 != state2) {
                return state1 - state2;
            } else {
                return p1.order - p2.order;
            }
        }
      
        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_EVT_SEL_WND);
        }

    }

}