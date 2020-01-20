module com_main {

    /**
     * 出征部队选择
     */
    export class CrossHeroPanel extends CView {

        public static readonly NAME = "CrossHeroPanel";

        public m_aPopUp: com_main.APopUp;
        public m_pGSatus: eui.Group;
        public m_pLbTime: eui.Label;
        public m_pIcoFood: com_main.CImage;
        public m_pLbFood: eui.Label;
        public m_pSroller: eui.Scroller;
        public m_pList: eui.List;

        private m_pCollection: eui.ArrayCollection;
        private m_nCId: number;

        public constructor(cId: number) {
            super();
            this.name = WorldHeroPanel.NAME;
            this.m_nCId = cId;
            this.initApp("world/world_hero_panel.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.currentState = 'cross';
            this.commitProperties();

            this.m_aPopUp.setTitleLabel('出征部队选择')
            this.m_pCollection = new eui.ArrayCollection();
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = CrossHeroItem;
            this.m_pList.useVirtualLayout = true;

            let list: ICrossHeroItemRD[] = [];
            for (let i = 0; i < TeamModel.getTeamMax(TeamType.CROSS_SERVER); i++) {
                let teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, i);
                list.push({ order: i })
            }
            //排序
            list.sort(this.sortFunc);
            this.m_pCollection.replaceAll(list);

            this.initEvent();
        }

        private sortFunc(p1: ICrossHeroItemRD, p2: ICrossHeroItemRD) {
            let teamVo1 = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, p1.order);
            let state1 = teamVo1.state;
            if (teamVo1.isEmptyTeam()) state1 = 200;
            let teamVo2 = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, p2.order);
            let state2 = teamVo2.state;
            if (teamVo2.isEmptyTeam()) state2 = 200;
            if (state1 != state2) {
                return state1 - state2;
            } else {
                return p1.order - p2.order;
            }
        }

        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        private initEvent() {
            EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.refreshItem, this);
            this.m_pList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            this.m_pList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        }

        /**刷新组件 */
        private refreshItem(vo?: TeamVo) {
            //只刷新世界地图队伍
            if (vo && vo.teamType == TeamType.CROSS_SERVER) {
                for (let i = 0; i < this.m_pCollection.source.length; i++) {
                    let data = this.m_pCollection.getItemAt(i) as ICrossHeroItemRD;
                    if (data.order == vo.order) {
                        this.m_pCollection.itemUpdated(data);
                        return;
                    }
                }
            }

        }

        /**选中队伍 */
        private onListHandler(e: eui.ItemTapEvent): void {
            let data = e.item as ICrossHeroItemRD;
            if (data) {
                let order = data.order;
                //队伍未解锁
                if (order > TeamModel.getTeamMax(TeamType.CROSS_SERVER)) {
                    return;
                }
                let teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, order);
                if (!teamVo) return;
                //空队伍
                if (teamVo.isEmptyTeam()) {
                    UpManager.history();
                    Utils.open_view(TASK_UI.CROSS_SERVER_TEAM_PANEL, { id: order });
                    return;

                }
                if (teamVo.state != TeamState.IDLE) {
                    let tips = TeamModel.getStateDes(teamVo.state);
                    EffectUtils.showTips(tips, 1, true);
                    return;
                }

                if (!isNull(this.m_nCId)) {
                    CrossProxy.send_C2S_CROSS_SERVER_TEAM_MOVE(1, teamVo.id, this.m_nCId);
                } else {
                    CrossProxy.C2S_CROSS_SERVER_ATTACK_GATE(teamVo.id);
                }

                UpManager.history();
            }
        }

    }
}