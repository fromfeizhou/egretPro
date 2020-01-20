module com_main {

    /**
     * 出征部队选择
     */
    export class WorldHeroPanel extends CView {

        public static readonly NAME = "WorldHeroPanel";

        public m_aPopUp: com_main.APopUp;
        public m_pGSatus: eui.Group;
        public m_pLbTime: eui.Label;
        public m_pIcoFood: com_main.CImage;
        public m_pLbFood: eui.Label;
        public m_pSroller: eui.Scroller;
        public m_pList: eui.List;
        public m_pBtnGo: eui.Group;

        private m_pCollection: eui.ArrayCollection;
        private m_nCityId: number = 0;
        private m_nCurOrder: number = -1;    //当前选中部队下标
        private m_nMoveDt: number = 0;


        public constructor(cityId: number) {
            super();
            this.name = WorldHeroPanel.NAME;
            this.m_nCityId = cityId;
            this.initApp("world/world_hero_panel.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_aPopUp.setTitleLabel('出征部队选择')
            this.m_pCollection = new eui.ArrayCollection();
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = WorldHeroItem;
            this.m_pList.useVirtualLayout = true;

            let list: IWorldHeroItemRD[] = [];
            for (let i = 0; i < TeamModel.getTeamMax(TeamType.WORLD); i++) {
                let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, i);
                if(this.checkTeamCity(teamVo.cityId)){
                    list.push({ order: i, cityId: this.m_nCityId, selected: false })
                }
            }
            //排序
            list.sort(this.sortFunc);
            this.m_pCollection.replaceAll(list);

            this.changeTeamSelected(this.m_nCurOrder);
            this.initEvent();
        }

        private sortFunc(p1: IWorldHeroItemRD, p2: IWorldHeroItemRD) {
            let teamVo1 = TeamModel.getTeamVoByType(TeamType.WORLD, p1.order);
            let state1 = teamVo1.state;
            if (teamVo1.isEmptyTeam()) state1 = 200;
            let teamVo2 = TeamModel.getTeamVoByType(TeamType.WORLD, p2.order);
            let state2 = teamVo2.state;
            if (teamVo2.isEmptyTeam()) state2 = 200;
            if (state1 != state2) {
                return state1 - state2;
            } else {
                return p1.order - p2.order;
            }
        }
        /**校验队伍是否符合当前城池列表 */
        private checkTeamCity(cityId: number) {
            if (cityId == this.m_nCityId) return false;
            //队伍在出生城
            let teamCfg: WorldMapConfig = C.WorldMapConfig[cityId];
            if (teamCfg && teamCfg.type == CityType.XIANG_BIRTH && teamCfg.mapCity == this.m_nCityId) return false;
            return true;
        }
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        private initEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.onBtnGoHandler);
            EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.refreshItem, this);
            this.m_pList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        }

        private removeEvent() {
            EventManager.removeEventListener(this.m_pBtnGo);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            this.m_pList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onListHandler, this);
        }

        /**刷新组件 */
        private refreshItem(vo?: TeamVo) {
            //只刷新世界地图队伍
            if (vo && vo.teamType == TeamType.WORLD) {
                for (let i = 0; i < this.m_pCollection.source.length; i++) {
                    let data = this.m_pCollection.getItemAt(i) as IWorldHeroItemRD;
                    if (data.order == vo.order) {
                        //到达同一个城池 移除
                        if (vo.cityId == this.m_nCityId) {
                            this.m_pCollection.removeItemAt(i);
                            return;
                        }
                        this.m_pCollection.itemUpdated(data);
                        return;
                    }
                }
                 if(this.checkTeamCity(vo.cityId)){
                    this.m_pCollection.addItem({ order: vo.order, cityId: this.m_nCityId, selected: false })
                }
            }

        }

        /**选中队伍 */
        private onListHandler(e: eui.ItemTapEvent): void {
            let data = e.item as IWorldHeroItemRD;
            if (data) {
                let order = data.order;
                //队伍未解锁
                if (order > TeamModel.getTeamMax(TeamType.WORLD)) {
                    return;
                }
                let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, order);
                if (!teamVo) return;
                //空队伍
                if (teamVo.isEmptyTeam()) {
                    UpManager.history();
                    Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: order });
                    return;

                }
                this.changeTeamSelected(order);
            }
        }

        /**选中队伍切换 */
        private changeTeamSelected(order: number) {
            if (this.m_nCurOrder == order) {
                this.m_nCurOrder = -1;
                this.resetItemSelView(order);
                this.__set_time(0);
                return;
            }

            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, order);
            if (!teamVo) return;
            if (teamVo.state != TeamState.IDLE) {
                let tips = TeamModel.getStateDes(teamVo.state);
                EffectUtils.showTips(tips, 1, true);
                return;
            }

            if (teamVo.cityId == this.m_nCityId) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL2), 1, true);
                return;
            }

            let [dt, speed, _] = DjikstraGraph.Instance.GetWayTime(teamVo.cityId, this.m_nCityId);
            if (dt == 0 && speed == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL4))
                return;
            }
            let mapCfg: WorldMapConfig = C.WorldMapConfig[this.m_nCityId]
            if (mapCfg.type == CityType.BIRTH && !WorldModel.isOwnerCity(this.m_nCityId)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL5))
                return;
            }
            this.resetItemSelView(this.m_nCurOrder);
            this.resetItemSelView(order);
            this.m_nCurOrder = order;
            this.__set_time(dt);
            this.__set_move_cost();
        }

        /**前往按钮点击 */
        private onBtnGoHandler(e: egret.Event): void {
            if (this.m_nCurOrder == -1) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL), 1, true);
                return;
            }

            let pack: gameProto.ITeamMoveData[] = [];
            let through: number[] = null;

            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nCurOrder);
            /**判断血量是否低于30% */
            let teamUIInfo: { headId: number, fight: number, hp: number, maxHp: number } = teamVo.getTeamUiInfo();
            if (teamUIInfo.hp < Math.floor(teamUIInfo.maxHp * 0.3) && !WorldModel.isOwnerCity(this.m_nCityId)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL1));
                return;
            }

            //同一个城市间不能移动
            if (this.m_nCityId == teamVo.cityId) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL2), 1, true);
                return;
            }
            if (teamVo.state != TeamState.IDLE) {
                let tips = TeamModel.getStateDes(teamVo.state);
                EffectUtils.showTips(tips, 1, true);
                return;
            }
            //获得城市顶点
            if (!through) {
                DjikstraGraph.Instance.execute(teamVo.cityId);
                let vert = DjikstraGraph.Instance.walkIds(this.m_nCityId);
                if (vert.length <= 1) {
                    error("=========>寻找的路线为空");
                    return;
                }
                through = vert;
            }
            //把襄阳战出生点转成世界地图出生点
            if (through.indexOf(WorldModel.xBirthCity) != -1)
                through[through.indexOf(WorldModel.xBirthCity)] = C.WorldMapConfig[WorldModel.xBirthCity].mapCity
            pack.push({ teamId: teamVo.id, cityPath: through });

            if (pack.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL3), 1, true);
                return;
            }
            let cost = Number(this.m_pLbFood.text);
            if (PropModel.isItemEnough(PropEnum.FOOD, cost, 1)) {
                WorldProxy.C2S_TEAMMOVE_TO(pack, teamVo.cityId);
            }
            UpManager.history();
        }




        /**
        * 设置最大的出征时间
        * @private
        * @return void
        * @memberof WorldHeroPanel
        */
        private __set_time(dt: number) {
            if (dt == 0) {
                this.m_pGSatus.visible = false;
                this.m_pLbTime.visible = false;
            } else {
                this.m_pGSatus.visible = true;
                this.m_pLbTime.visible = true;
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(dt, 1)
                this.m_nMoveDt = dt;
            }
        }

        /**刷新移动消耗 */
        private __set_move_cost() {
            if (this.m_nCurOrder == -1) return;
            let cost = 0;
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nCurOrder);
            cost += teamVo.getMoveCost();
            this.m_pLbFood.text = Math.floor(this.m_nMoveDt / 30 * cost) + '';
        }

        /**重置显示 */
        private resetItemSelView(order: number) {
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data = this.m_pCollection.getItemAt(i) as IWorldHeroItemRD;
                if (data.order == order) {
                    data.selected = !data.selected;
                    this.m_pCollection.replaceItemAt(data, i);
                }
            }
        }
    }
}