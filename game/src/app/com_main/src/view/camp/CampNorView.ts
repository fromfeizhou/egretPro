module com_main {

    /**
     * 活动类军营系统
     * @export
     * @class CampNorView
     * @extends CView
     */
    export class CampNorView extends CView {

        public static readonly NAME = "CampNorView";
        public m_teamPanel: com_main.TeamPanel;
        public m_pBtnBack: eui.Group;
        public m_ptips: eui.Group;
        public m_plb: eui.Group;
        public m_lbNation: com_main.CLabel;
        public m_lbtype: com_main.CLabel;





        private m_nWarType: CheckPointType;   //战斗类型
        private m_nTeamType: TeamType;
        private m_nBattleId: number; //通用挑战id bossId(boss挑战 使用)

        private m_nIndex: number;    //部队id
        private copyType: number;//材料副本类型

        private nationLimit: number[] = []
        private typeLimit: number[] = []

        public constructor(data: any) {
            super();
            this.name = CampNorView.NAME;
            this.m_nWarType = data.type;
            this.m_nBattleId = data.battleId;
            this.copyType = data.copyType ? data.copyType : 0;
            this.setTeamType();
            this.currentState = this.m_nTeamType == TeamType.HISTORY_WAR ? "history" : "normal"
            this.initApp("team/CampNorViewSKin.exml");
        }

        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.updateLimitTips();
            this.m_teamPanel.setTeamData(this.m_nTeamType, 0, false, this.m_nBattleId);
            this.m_nIndex = TeamModel.defTeamOrder;
            // this.m_comIndexBar.initBar(this.m_nIndex, 1,this.changeTeamHandler,this);
            this.refreshNorView();
            this.addEvent();

            /**检查新手引导面板条件 */
            this.onGuideCondition();
        }
        public setTeamType() {
            switch (this.m_nWarType) {
                case CheckPointType.PK_DEF: {
                    this.m_nTeamType = TeamType.DEF_APK;

                    break;
                }
                case CheckPointType.HISTORY_WAR: {
                    this.m_nTeamType = TeamType.HISTORY_WAR;
                    break;
                }
                default:
                    this.m_nTeamType = TeamType.PVE;
                    break;
            }
        }
        public updateLimitTips() {
            if (this.m_nWarType == CheckPointType.HISTORY_WAR) {
                let hiswarCfg: HistoryWarConfig = C.HistoryWarConfig[this.m_nBattleId];
                if (isNull(hiswarCfg)) return;
                this.nationLimit = StringUtils.stringToNumberArray2(hiswarCfg.nationTypeLimit);
                this.typeLimit = StringUtils.stringToNumberArray2(hiswarCfg.generalOccupationLimit);
                let nationTips: string = "禁止势力：<font color=0xff0000>"
                let typeTips: string = "禁止兵种：<font color=0xff0000>"
                for (let nation of this.nationLimit) {
                    nationTips += Utils.getCountryName(nation);
                }
                nationTips += "</font>"
                if (this.nationLimit.length == 0) nationTips = "";
                this.m_lbNation.textFlow = Utils.htmlParser(nationTips);
                this.m_lbNation.visible = this.nationLimit.length > 0;
                for (let typeStr of this.typeLimit) {
                    typeTips += Utils.getSoilderTypeName(typeStr);
                }
                typeTips += "</font>"
                if (this.typeLimit.length == 0) typeTips = "";
                this.m_lbtype.textFlow = Utils.htmlParser(typeTips);
                this.m_lbtype.visible = this.typeLimit.length > 0;
                this.m_lbtype.includeInLayout = this.typeLimit.length > 0;
                this.m_lbNation.includeInLayout = this.nationLimit.length > 0;
            }
        }
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnBack, this, () => {
                if (this.m_teamPanel.m_bInDragGuide) return;
                UpManager.history();
            });

            EventMgr.addEvent(TeamUIEvent.TEAM_BTN_FIGHT, this.onBtnFight, this);
            EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onWorldUpdateList, this);
        }
        public onWorldUpdateList(vo: TeamVo) {
            if (vo.teamType == this.m_nTeamType) {
                this.m_ptips.visible = this.m_nTeamType != TeamType.DEF_APK && TeamModel.hasPVEEmptyPos();

            }
        }
        private removeEvent() {
            EventMgr.removeEventByObject(TeamUIEvent.TEAM_BTN_FIGHT, this);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
        }

        /**挑战按钮点击 */
        private onBtnFight() {
            let teamVo = TeamModel.getTeamVoByType(this.m_nTeamType, this.m_nIndex);
            if (teamVo.isEmptyTeam()) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_TIPS), 1, true);
                return;
            }
            switch (this.m_nWarType) {
                case CheckPointType.CHECKPOINT: {
                    HeadQuartersProxy.send_HQ_CHALLENGES(this.m_nBattleId, 1);
                    break;
                }
                case CheckPointType.ARENA: {
                    ArenaProxy.send_ENTER_ARENA_BATTLE(1);
                    break;
                }
                case CheckPointType.PK: {
                    PvpArenaProxy.send_APK_CHALLENGE(this.m_nBattleId);
                    break;
                }

                case CheckPointType.BOSS: {
                    BossProxy.C2S_CHALLENGE_BOSS(this.m_nBattleId);
                    break;
                }
                case CheckPointType.MATERIAL: {
                    let currCount = MaterialModel.getCurrCount(this.copyType);
                    if (currCount <= 0) {
                        EffectUtils.showTips(GCode(CLEnum.MAT_NO_NUMBER), 1, true);
                        return;
                    }
                    MaterialProxy.C2S_MATERIAL_CHALLENGE(this.m_nBattleId, false);//挑战
                    break;
                }
                case CheckPointType.HISTORY_WAR: {
                    HistoryBattleProxy.C2S_HISTORY_WAR_FIGHT(this.m_nBattleId)
                    break;
                }
            }
        }


        /**刷新通用显示 */
        private refreshNorView() {
            let btnName = GCode(CLEnum.CAMP_FIGHT);
            let tileName = GCode(CLEnum.CAMP_ARMY);
            this.refreshTitleName();
            if (this.m_nWarType == CheckPointType.NONE) {
                this.m_teamPanel.currentState = 'embattle';
            } else if (this.m_nWarType == CheckPointType.PK_DEF) {
                this.m_teamPanel.currentState = 'pvpDef';
            } else {
                this.m_teamPanel.currentState = 'normal';
                this.m_teamPanel.setfightBtnName(btnName);
            }
            this.m_ptips.visible = this.m_nTeamType != TeamType.DEF_APK && TeamModel.hasPVEEmptyPos();
        }

        /**切换下标 */
        private changeTeamHandler() {
            // this.m_nIndex = this.m_comIndexBar.index;
            this.refreshTitleName();
            this.m_teamPanel.setTeamData(this.m_nTeamType, this.m_nIndex);
        }

        /**部队名字 */
        private refreshTitleName() {
            let name = GCode(CLEnum.CAMP_ARMY1);
            if (this.m_nTeamType == TeamType.HISTORY_WAR) {
                name = GCode(CLEnum.CAMP_HISTORY)
            }

            this.m_teamPanel.setTeamTileName(name);
        }

        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.CAMP_WND);
        }


        /**全局访问 */
        public static getClass(): CampNorView {
            return SceneManager.getClass(LayerEnums.POPUP, CampNorView.NAME);
        }
        /**拖动指引 */
        public static doDragGuide() {
            let obj = this.getClass();
            if (obj) obj.m_teamPanel.doDragGuide();
        }

    }
}