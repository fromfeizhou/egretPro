module com_main {


	/**
	 * 武将缘分弹出框
	 */
    export class TeamFateView extends CView {
        public static NAME = 'TeamFateView';
        public m_apopUp: com_main.APopUp;
        public m_fateScroller: eui.Scroller;
        public m_List: eui.List;

        private m_nIndex: number;    //部队id
        private m_type:number
        private m_tCollections: eui.ArrayCollection;
        public constructor(data: any) {
            super();
            this.name = TeamFateView.NAME;
            this.m_nIndex = data.order;
            this.m_type = data.type;
            this.initApp("fate/TeamFateViewSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.FATE_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_apopUp.setTitleLabel(GCode(CLEnum.FATE_GEN_TITLE))
            let teamVo = TeamModel.getTeamVoByType(this.m_type, this.m_nIndex);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_tCollections;
            this.m_List.itemRenderer = TeamFateCell;
            this.refreshFateView();
        }

        public refreshFateView() {
            let teamVo = TeamModel.getTeamVoByType(this.m_type, this.m_nIndex);
            let m_pTmpTeamList: gameProto.ITeamGeneralData[] = teamVo.cloneTeamGeneralData();
            let generalList: number[] = [];
            for (let index = 0; index < m_pTmpTeamList.length; index++) {
                if (m_pTmpTeamList[index].generalId > 0 && FateModel.checkGeneralFate(m_pTmpTeamList[index].generalId)) {
                    generalList.push(m_pTmpTeamList[index].generalId)
                }
            }
            this.m_tCollections.replaceAll(generalList);
        }

    }

}