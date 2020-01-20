module com_main {

    /**
     * 军营系统
     * @export
     * @class CampNorView
     * @extends CView
     */
    export class WorldRankView extends CView {

        public static readonly NAME = "WorldRankView";

        public m_teamPanel: com_main.TeamPanel;
        public m_pBtnBack: eui.Group;
        public m_pCheckBox: eui.Group;
        public m_checkBox: eui.CheckBox;
        public m_pQuickAddBtn: com_main.ComCostTextButton;
        public m_pAddBtn: com_main.ComButton;
        public m_pArmyStatus: eui.Group;
        public m_pLbArmyStatus: eui.Label;
        public m_pback: com_main.CImage;
        public m_pGTroops: eui.Group;
        public m_pArmy: eui.Group;
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
        // private m_nCurIndex: number;     //当前选中下标
        private m_gold: number;
        private m_bIsFull: boolean; //兵力是否已满
        private isSave: boolean = false;
        private soldiderTypeArray: number[] = [SoldierMainType.FOOTSOLDIER, SoldierMainType.RIDESOLDIER, SoldierMainType.ARROWSOLDIER, SoldierMainType.PIKEMAN]
        public constructor(data: any) {
            super();
            this.name = WorldRankView.NAME;
            this.m_nIndex = data.id;
            this.initApp("team/WorldRankViewSkin.exml");
        }

        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_comIndexBar.index = this.m_nIndex

            this.m_pQuickAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP_ALL));
            this.m_pAddBtn.setTitleLabel(GCode(CLEnum.WOR_SUPP));
            this.m_teamPanel.currentState = 'embattle';
            this.addEvent();

            for (let i = 0; i < 5; i++) {
                let item = this[`queItem${i}`] as WorldQueTroopItem;
                item.setInfo(TeamType.WORLD, i);
                item.open = (i < TeamModel.getTeamMax(TeamType.WORLD));
                if (i == this.m_nIndex) item.selected = true;
            }
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            this.m_checkBox.selected = teamVo.autoFill;
            this.changeTeamHandler(this.m_nIndex);
            this.onGuideCondition();
            this.setBtnShow(!this.isTeamFull())
        }

        /**补兵按钮刷新 */
        public setBtnShow(visible: boolean) {
            this.m_pAddBtn.visible = visible;
            this.m_pQuickAddBtn.visible = visible;
        }

        /**===========================================================================================================
         * event begin
         * ===========================================================================================================
         */

        private addEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnBack, this, () => {
                UpManager.history();
            });

            this.m_comIndexBar.initBar(this.m_nIndex, TeamModel.getTeamMax(TeamType.WORLD), this.changeTeamHandler, this);

            EventManager.addTouchScaleListener(this.m_pQuickAddBtn, this, () => {
                let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
                if (TeamModel.isWar(teamVo.state)) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL1), 1, true);
                    return;
                }
                if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold, 1)) {
                    TeamModel.isNeedTroopTips = true;
                    TeamProxy.C2S_TEAM_GOLD_SUPPLEMENTARY_TROOPS(this.m_nIndex);
                }
            });
            EventManager.addTouchScaleListener(this.m_pAddBtn, this, this.onAddBtn);
            EventManager.addTouchScaleListener(this.m_pback, this, this.onBackBirthCity);
            EventManager.addTouchTapListener(this.m_pArmy, this, this.onGoArmy)


            for (let i = 0; i < 5; i++) {
                let item = this[`queItem${i}`] as WorldQueTroopItem;
                EventManager.addTouchTapListener(item, this, this.onChangeSel);
            }

            EventMgr.addEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this.onAutoUpdateTroop, this);
            EventMgr.addEvent(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this.onUpdateBtn, this);
            EventMgr.addEvent(BuildEvent.SOLDIER_TRAIN, this.refreshTeamArmy, this);

            this.m_checkBox.addEventListener(eui.UIEvent.CHANGE, this.onCheck, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, this);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, this);
            EventMgr.removeEventByObject(BuildEvent.SOLDIER_TRAIN, this);
            this.m_checkBox.removeEventListener(eui.UIEvent.CHANGE, this.onCheck, this);
        }

        /**改变选中 */
        private onChangeSel(evt: egret.TouchEvent) {
            let item = evt.currentTarget as WorldQueTroopItem;
            if (this.m_nIndex == item.order) {
                return;
            }
            if (!item.open) {
                EffectUtils.showTips(TeamModel.getTeamOpenTips(), 1, true);
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

        /**武将拖动 */
        public onUpdateBtn(visible: boolean) {
            this.m_pCheckBox.visible = visible;
            this.m_pAddBtn.visible = visible && !this.isTeamFull();
            this.m_pQuickAddBtn.visible = visible && !this.isTeamFull();
        }
        /**保存补兵 */
        public onAutoUpdateTroop() {
            this.isSave = true;
        }
        /**单选框操作 */
        public onCheck(evt: eui.UIEvent) {
            //自动补满
            TeamModel.isNeedTroopTips = true;
            TeamProxy.C2S_TEAM_SET_AUTOFILL(this.m_nIndex, this.m_checkBox.selected);
        }
        /**补兵按钮 */
        public onAddBtn(pvt: egret.TouchEvent) {
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            if (TeamModel.isWar(teamVo.state)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_SUPP_FAL1), 1, true);
                return;
            }
            if (this.isTeamFull())
                return;
            let isOpen: boolean = true;
            for (let key of this.soldiderTypeArray) {
                let type = Number(key);
                if (teamVo.isSoliderNeedFillByType(type)) {
                    if(TeamModel.getTroopsInfo(type).num > 0){
                        isOpen = false;
                    }
                }
            }
            
            if(isOpen){
                Utils.open_view(TASK_UI.POP_WORLD_TROOP_PANEL, { order: this.m_nIndex });
            }else{
                this.addHandler(true);
            }
        }
        /**自动补兵 */
        public addHandler(isTip: boolean = false) {
            //根据哪种类型缺补哪种
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            let canFillCity = CityBuildModel.hasCityPrivilege(teamVo.cityId, CityRewardType.REPAIR);
            if (canFillCity) {
                for (let type of this.soldiderTypeArray) {
                    if(TeamModel.getTroopsInfo(type).num > 0 && teamVo.isSoliderNeedFillByType(type)){
                        TeamProxy.C2S_TEAM_SUPPLEMENTARY_TROOPS(this.m_nIndex, Number(type));
                    }
                }
            } else {
                if(isTip)EffectUtils.showTips(GCode(CLEnum.CITY_BUILD_TIPS1), 1, true);
            }
        }

        /**
         * 切换部队
         * @protected
         * @return void
         */
        protected changeTeamHandler(order: number = 0) {
            this.m_nIndex = order;
            this.m_teamPanel.setTeamData(TeamType.WORLD, this.m_nIndex, true);
            this.refreshTileView();
            this.refreshTeamArmy();
            this.refreshTeamState();
        }

        /**刷新通用显示 */
        private refreshTileView() {
            this.m_teamPanel.setTeamTileName(`${GCode(CLEnum.WOR_TEAM_GZBD)}${this.m_nIndex + 1}`);
        }

        /**
         * 军队的行军状态
         * @protected
         * @return 
         */
        protected refreshTeamState() {
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            this.m_pback.visible = false;
            if (teamVo.state !== TeamState.IDLE) {
                this.m_pArmyStatus.visible = true;
                this.m_pLbArmyStatus.text = TeamModel.getStateDes(teamVo.state);
                return;
            }
            this.m_pArmyStatus.visible = false;
            if (teamVo.cityId != WorldModel.birthCity) {
                this.m_pArmyStatus.visible = true;
                this.m_pback.visible = true;
                let city: WorldMapConfig = WorldModel.getCityConfig(teamVo.cityId);
                this.m_pLbArmyStatus.text = GLan(city.name);
            }
        }

        public onGoArmy(pvt: egret.TouchEvent) {
            Utils.open_view(TASK_UI.ARMS_PANEL);
        }
        private onBackBirthCity(pvt: egret.TouchEvent) {
            let tip: string = GCode(CLEnum.CAMP_BIRTH_TIPS);
            Utils.showConfirmPop(tip, () => {
                UpManager.history();
                this.backToBirthCity();
            }, this);

        }
        public backToBirthCity() {
            let pack: gameProto.ITeamMoveData[] = [];
            let through: number[] = null;

            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            //获得城市顶点
            if (!through) {
                DjikstraGraph.Instance.execute(teamVo.cityId);
                let vert = DjikstraGraph.Instance.walkIds(WorldModel.birthCity);
                if (vert.length <= 1) {
                    error("=========>寻找的路线为空");
                    return;
                }
                through = vert;
            }
            pack.push({ teamId: teamVo.id, cityPath: through });

            WorldProxy.C2S_TEAMMOVE_TO(pack, teamVo.cityId);

        }
        /**===========================================================================================================
         * event end
         * ===========================================================================================================
         */


        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.GET_ARMY,
                ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS,
                ProtoDef.C2S_TEAMMOVE_LIST,
                ProtoDef.S2C_TEAM_LIST,
                ProtoDef.S2C_TEAM_SET_AUTOFILL,
                ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_TEAM_GOLD_SUPPLEMENTARY_TROOPS:
                case ProtoDef.S2C_TEAM_SUPPLEMENTARY_TROOPS: {
                    if (TeamModel.isNeedTroopTips) {
                        TeamModel.isNeedTroopTips = false;


                    }
                    this.refreshTeamArmy();
                    break;
                }
                case ProtoDef.C2S_TEAMMOVE_LIST:
                case ProtoDef.GET_ARMY: {
                    break;
                }
                case ProtoDef.S2C_TEAM_LIST: {
                    this.refreshTeamArmy();
                    let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
                    if (this.isSave && teamVo.autoFill) {
                        this.addHandler();
                        this.isSave = false;
                    }
                    break;
                }
                case ProtoDef.S2C_TEAM_SET_AUTOFILL: {
                    let data = body as gameProto.S2C_TEAM_SET_AUTOFILL;
                    if (data.order == this.m_nIndex) {
                        this.m_checkBox.selected = data.flag;
                        this.updateAddBtn();
                        if (data.flag) this.addHandler();
                    }
                    break;
                }
            }
        }


        /**
         * 更新兵种兵力信息
         * @private
         * @return void
         */
        private refreshTeamArmy() {
            this.refreshsoliderNum();

            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            // this.soliderNum = teamVo.getSoliderTypeMap();
            for (let i = 1, j = 0; i <= 4; i++ , j++) {
                let item = this.m_pGTroops.getChildByName(`WorldRankTroops_${i}`) as WorldRankTroops;
                if (!item) {
                    item = new WorldRankTroops(this.m_nIndex, i);
                    this.m_pGTroops.addChild(item)
                }
                // item.refresh(this.soliderNum[i][0], this.soliderNum[i][1]);
                item.refresh(TeamModel.getTroopsInfo(i).num, this.calcuMaxStorge(i))
            }
            this.m_checkBox.selected = teamVo.autoFill;
            this.calcuOneKeyGold();
            this.updateAddBtn();

            this.m_pQuickAddBtn.visible = !this.isTeamFull();
            this.m_pAddBtn.visible = !this.isTeamFull();

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
        /**判断兵力是否已经满 */
        public isTeamFull(): boolean {
            return this.m_bIsFull;
        }
        public updateAddBtn() {
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            this.m_pAddBtn.visible = !teamVo.autoFill && !this.isTeamFull();
        }
        public calcuOneKeyGold() {
            let teamVo = TeamModel.getTeamVoByType(TeamType.WORLD, this.m_nIndex);
            this.m_gold = Math.ceil(teamVo.getFillHpCostGold());
            this.m_pQuickAddBtn.setCostLabel(`${this.m_gold}`)
            this.m_bIsFull = teamVo.isSoldierFull();
        }
        /**刷新兵力显示 */
        private refreshsoliderNum() {
            this.m_pLbBBNum.text = TeamModel.getTroopsInfo(SoldierMainType.FOOTSOLDIER).num + '';
            this.m_pLbQBNum.text = TeamModel.getTroopsInfo(SoldierMainType.RIDESOLDIER).num + '';
            this.m_pLbGBNum.text = TeamModel.getTroopsInfo(SoldierMainType.ARROWSOLDIER).num + '';
        }

        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_CAMP_WND);
        }
    }

    /**
     * 兵种兵力显示
     * @class WorldRankTroops
     * @extends CComponent
     */
    export class WorldRankTroops extends CComponent {
        protected m_nIndex: number;
        protected m_nType: SoldierMainType;  //兵种类型
        protected m_pLbPower: eui.Label;
        protected m_pTroops: eui.Image;
        // public m_pImgEffect: eui.Image;
        // public m_pArmyAddBtn: eui.Group;


        public constructor(index: number, ty: number) {
            super();
            this.m_nIndex = index;
            this.m_nType = ty;
            this.name = `WorldRankTroops_${ty}`

            this.currentState = `solider${ty}`;
            this.skinName = Utils.getSkinName("app/world/world_rank_army.exml");
        }

        $onRemoveFromStage(isclear = true): void {

            super.$onRemoveFromStage(isclear);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // let tw = egret.Tween.get(this.m_pImgEffect, { loop: true });
            // tw.to({ rotation: 360 }, 1000);

            // EventManager.addTouchScaleListener(this.m_pArmyAddBtn, this, () => {
            //     if (TeamModel.getTroopsInfo(this.m_nType).num == 0) {
            //         let cfg = MainMapModel.getSoldierLvCfg(this.m_nType);
            //         EffectUtils.showTips(GCodeFromat(CLEnum.WOR_SUPP_FAL2, cfg.name), 1, true);
            //         return;
            //     }
            //     TeamProxy.C2S_TEAM_SUPPLEMENTARY_TROOPS(this.m_nIndex, this.m_nType);
            // });
        }

        /**刷新显示 */
        public refresh(curNum: number, maxNum: number, preDesc: string = "") {
            if (maxNum == 0) {
                this.m_pLbPower.text = "";
                this.m_pTroops.scaleX = 1;
                // this.m_pArmyAddBtn.visible = false;
            } else {
                this.m_pLbPower.text = preDesc + `${curNum}`;
                let per = curNum / maxNum;
                this.m_pTroops.scaleX = per > 1 ? 1 : per;

                // this.m_pArmyAddBtn.visible = curNum < maxNum;
            }
        }
    }
}
