module com_main {

    /**
     * 军营系统
     * @export
     * @class CampNorView
     * @extends CView
     */
    export class CrossServerCampView extends CView {

        public static readonly NAME = "CrossServerCampView";
        public m_teamPanel: com_main.TeamPanel;
        public m_pBtnBack: eui.Group;
        public m_pAddBtn: com_main.ComButton;
        public m_pArmyStatus: eui.Group;
        public m_pLbArmyStatus: eui.Label;
        public m_pback: com_main.CImage;
        public m_troop: com_main.WorldRankTroops;
        public m_pItemRoot: eui.Group;
        public queItem0: com_main.WorldQueTroopItem;
        public queItem1: com_main.WorldQueTroopItem;
        public queItem2: com_main.WorldQueTroopItem;
        public queItem3: com_main.WorldQueTroopItem;
        public queItem4: com_main.WorldQueTroopItem;
        public m_pLbBBNum: eui.Label;
        public m_pLbQBNum: eui.Label;
        public m_pLbGBNum: eui.Label;
        public m_comIndexBar: com_main.ComIndexBar;



        // private soliderNum: { [k: number]: number[] } = {};
        private m_nIndex: number;    //部队id
        private isSave: boolean = false;
        private m_maxHp: number = 0;
        private m_teamVo: TeamVo;
        public constructor(data: any) {
            super();
            this.name = CrossServerCampView.NAME;
            this.m_nIndex = data.id;
            this.initApp("cross/CrossServerCampViewSkin.exml");
        }

        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_comIndexBar.index = this.m_nIndex


            this.m_pAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP));
            this.m_teamPanel.currentState = 'embattle';
            this.addEvent();

            let max = TeamModel.getTeamMax(TeamType.CROSS_SERVER);
            for (let i = 0; i < 5; i++) {
                let item = this[`queItem${i}`] as WorldQueTroopItem;
                item.setInfo(TeamType.CROSS_SERVER, i);
                item.open = (i < max);
                if (i == this.m_nIndex) item.selected = true;
            }
            this.m_teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, this.m_nIndex);
            // let crossServerConst: CrossServerConstConfig = C.CrossServerConstConfig[CrossServerConstType.MAX_TROOPS];
            // this.m_maxHp = unNull(crossServerConst) ? Number(crossServerConst.value) : 0;
            this.changeTeamHandler(this.m_nIndex);
            this.onGuideCondition();
            this.setBtnShow(!this.m_teamVo.isSoldierFull())
            this.updateTroopHp();
        }

        /**===========================================================================================================
         * event begin
         * ===========================================================================================================
         */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnBack, this, () => {
                UpManager.history();
            });

            this.m_comIndexBar.initBar(this.m_nIndex, TeamModel.getTeamMax(TeamType.CROSS_SERVER), this.changeTeamHandler, this);
            EventManager.addTouchScaleListener(this.m_pAddBtn, this, this.onAddBtn);

            for (let i = 0; i < 5; i++) {
                let item = this[`queItem${i}`] as WorldQueTroopItem;
                EventManager.addTouchTapListener(item, this, this.onChangeSel);
            }

            EventMgr.addEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this.onAutoUpdateTroop, this);
            EventMgr.addEvent(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this.onUpdateBtn, this);
            EventMgr.addEvent(BuildEvent.SOLDIER_TRAIN, this.refreshTeamArmy, this);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this);
            EventMgr.removeEventByObject(BuildEvent.SOLDIER_TRAIN, this);
        }

        /**改变选中 */
        /**改变选中 */
        private onChangeSel(evt: egret.TouchEvent) {
            let item = evt.currentTarget as WorldQueTroopItem;
            if (item.order >= TeamModel.getTeamMax(TeamType.CROSS_SERVER)) {
                EffectUtils.showTips(GCode(CLEnum.CROSS_TEAM_LOCK), 1, true);
                return;
            }
            if (this.m_nIndex == item.order) {
                return;
            }
            if (!item.open) {
                EffectUtils.showTips(GCode(CLEnum.CROSS_TEAM_LOCK), 1, true);
                return;
            }
            if (this.m_nIndex >= 0) {
                this.setQueItemSel(this.m_nIndex, false);
            }
            this.m_nIndex = item.order;
            this.setQueItemSel(this.m_nIndex, true);
        }
        /**队列选中刷新 */
        private setQueItemSel(index: number, val: boolean) {
            let item = this[`queItem${index}`] as WorldQueTroopItem;
            if (item) item.selected = val;
            if (val) this.changeTeamHandler(index);
        }


        public onUpdateBtn(visible: boolean) {
            this.m_pAddBtn.visible = visible && !this.m_teamVo.isSoldierFull();
        }
        public setBtnShow(visible: boolean) {
            this.m_pAddBtn.visible = visible;
        }
        public onAutoUpdateTroop() {
            this.isSave = true;
        }

        /**补兵按钮 */
        public onAddBtn(pvt: egret.TouchEvent) {
            if (CrossModel.checkCanTroop(this.m_nIndex)) {
                CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS(this.m_nIndex)
            } else {
                EffectUtils.showTips("兵库兵力不够")
            }

        }

        /**===========================================================================================================
         * event end
         * ===========================================================================================================
         */

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS,
                ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO,
                ProtoDef.S2C_TEAM_LIST
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_TEAM_LIST: {
                    this.refreshTeamState();
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_TEAM_SUPPLEMENTARY_TROOPS: {
                    this.refreshTeamArmy();
                    break;
                }
                case ProtoDef.S2C_CROSS_SERVER_WAR_TROOPS_INFO: {
                    this.updateTroopHp();
                    break;
                }
            }
        }

        /**
         * 切换部队
         * @protected
         * @return void
         */
        protected changeTeamHandler(order: number = 0) {
            this.m_nIndex = order;
            this.m_teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, this.m_nIndex);
            this.m_teamPanel.setTeamData(TeamType.CROSS_SERVER, this.m_nIndex, false);
            this.refreshTileView();
            this.refreshTeamArmy();
            this.refreshTeamState();
        }
        public onGoArmy(pvt: egret.TouchEvent) {
            Utils.open_view(TASK_UI.ARMS_PANEL);
        }

        /**刷新通用显示 */
        private refreshTileView() {
            this.m_teamPanel.setTeamTileName(`${GCode(CLEnum.CROSS_TEAM_KFBD)}${this.m_nIndex + 1}`);
        }
        /**更新血量显示 */
        public updateTroopHp() {
            this.m_troop.refresh(CrossModel.curTroop, CrossModel.maxTroop, GCode(CLEnum.CROSS_TEAM_TIPS1))
        }
        /**
         * 更新兵种兵力信息
         * @private
         * @return void
         */
        private refreshTeamArmy() {
            this.refreshsoliderNum();

            this.updateAddBtn();
            this.m_pAddBtn.visible = !this.m_teamVo.isSoldierFull();

        }
        /**计算最大库存 */
        public calcuMaxStorge(type: number): number {
            let id = MainMapModel.getBuildInfoBySolider(type).id;
            let cfg = MainMapModel.getBuildingTrainCfgbyBuildId(id);
            if (isNull(cfg))
                return 0;
            return cfg.storagelimit;
        }
        public calcuTotalStorge(): number {
            let sum: number = 0;
            for (let i = 1; i <= 4; i++) {
                sum += TeamModel.getTroopsInfo(i).num
            }
            return sum;
        }
        public calcuStorageByType(type: SoldierMainType): number {
            return TeamModel.getTroopsInfo(type).num
        }

        public updateAddBtn() {
            let teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, this.m_nIndex);
            this.m_pAddBtn.visible = !teamVo.isSoldierFull();
        }

        /**刷新兵力显示 */
        private refreshsoliderNum() {
            this.m_pLbBBNum.text = TeamModel.getTroopsInfo(SoldierMainType.FOOTSOLDIER).num + '';
            this.m_pLbQBNum.text = TeamModel.getTroopsInfo(SoldierMainType.RIDESOLDIER).num + '';
            this.m_pLbGBNum.text = TeamModel.getTroopsInfo(SoldierMainType.ARROWSOLDIER).num + '';
        }

        /**
         * 军队的行军状态
         * @protected
         * @return 
         */
        protected refreshTeamState() {
            let teamVo = TeamModel.getTeamVoByType(TeamType.CROSS_SERVER, this.m_nIndex);
            this.m_pback.visible = false;
            if (teamVo.state !== TeamState.IDLE) {
                this.m_pArmyStatus.visible = true;
                this.m_pLbArmyStatus.text = TeamModel.getStateDes(teamVo.state);
                return;
            }
            this.m_pArmyStatus.visible = false;
            if (CrossModel.crossStatus == CrossServerState.CITY_WAR) {
                this.m_pArmyStatus.visible = true;
                this.m_pLbArmyStatus.text = CrossModel.getTeamCityName(teamVo);
            }
         
        }

    }

}
