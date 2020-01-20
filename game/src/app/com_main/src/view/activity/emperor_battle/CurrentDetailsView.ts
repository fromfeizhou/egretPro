module com_main {
    /**
     * 襄阳战（帝位争夺）
     * 当前战局
     */
    export class CurrentDetailsView extends CView implements IEmperorBattleDetailsWnd {
        public nType: number;
        public bInit: boolean;

        // 控件
        private m_labTime: com_main.CLabel;
        private m_gFighting: eui.Group;
        private m_labFighting: com_main.CLabel;
        private m_labSeeDetails: com_main.CLabel;
        private m_xyCity: eui.Group;
        private m_imgXy: eui.Image;
        private m_imgCountry: eui.Image;
        private m_pBtnAll: eui.Group;
        private m_listDoor: eui.List;
        private m_gRankC: eui.Group;
        private m_listRank: eui.List;
        private m_gWei1: eui.Group;
        private m_gWei2: eui.Group;
        private m_gWei3: eui.Group;

        // 数据
        private m_pListDoorDP: eui.ArrayCollection;
        private m_pListRankDP: eui.ArrayCollection;

        private m_acEmpVo: AcEmperorBattleVO;
        private m_tAcVo: ActivityVo;


        public constructor(nType: number) {
            super();
            this.nType = nType;
            this.initApp("activity/emperorBattle/CurrentDetailsSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_XIANGYANG_INFO,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_XIANGYANG_INFO: {
                    this.refreshDataRank([]);
                    break;
                }
            }
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            super.onDestroy();
            Utils.TimerManager.remove(this.updateTime, this);
            this.removeEvent();
            // SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            // 暂时隐藏的空间
            this.m_gWei1.visible = false;
            this.m_gWei2.visible = false;
            this.m_gWei3.visible = false;

            // 城池发光
            Utils.isGlow(true, this.m_xyCity, 0XEECE79, 0.8);

            this.m_pListDoorDP = new eui.ArrayCollection([
                { cityID: 104, countryId: 1 },
                { cityID: 105, countryId: 2 },
                { cityID: 106, countryId: 3 },
                { cityID: 107, countryId: 0 }
            ]);
            this.m_listDoor.dataProvider = this.m_pListDoorDP;
            this.m_listDoor.itemRenderer = EmperorCountryCell;
            this.m_listDoor.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);

            this.m_pListRankDP = new eui.ArrayCollection([]);
            this.m_listRank.dataProvider = this.m_pListRankDP;
            this.m_listRank.itemRenderer = EmperorRankCell;

            this.m_labFighting.text = GCode(CLEnum.XIANGYANG_FIGHTING);
            this.m_labSeeDetails.text = GCode(CLEnum.XIANGYANG_SEE_DETAILS);

            this.m_acEmpVo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);

            this.refreshTime();
        }

        private refreshTime() {
            this.m_tAcVo = ActivityModel.getActivityVo<ActivityVo>(AcViewType.XIANGYANG);
            if (!this.m_tAcVo || TimerUtils.getServerTimeMill() > this.m_tAcVo.closeDate) {
                // 襄阳城已经被占领
                this.m_labTime.text = "襄阳城已经被占领";
                return;
            }
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            this.updateTime();
        }

        /**刷新倒计时 */
        private updateTime() {
            if (TimerUtils.getServerTimeMill() > this.m_tAcVo.closeDate) {
                Utils.TimerManager.remove(this.updateTime, this);
                this.m_labTime.text = "襄阳城已经被占领";
                return;
            }
            this.m_gFighting.visible = !this.m_acEmpVo.isInAttReady();
            let time = Math.floor((this.m_tAcVo.openDate - TimerUtils.getServerTimeMill()) / 1000);
            if (time <= 0) {
                let stopTime = Math.floor((this.m_tAcVo.closeDate - TimerUtils.getServerTimeMill()) / 1000);
                this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_CAPTURE_LEFT, Utils.DateUtils.getFormatBySecond(stopTime, 1)));
                return;
            }
            this.m_labTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_BATTLE_LEFT, Utils.DateUtils.getFormatBySecond(time, 1)));
        }

        /**初始化界面 */
        public initView() {
            if (this.bInit) return;

            this.bInit = true;
            this.addEvent();

            this.refreshView();
        }

        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
        }

        /**刷新显示 */
        public refreshView() {
            this.refreshData([]);
            this.refreshDataRank([]);
        }

        private addEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnAll, this, this.onclickAll);
            EventManager.addTouchScaleListener(this.m_xyCity, this, this.onclickCity);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
        }

        private onclickAll(e: egret.Event) {
            AcBattleProxy.C2S_XIANGYANG_INFO_OPEN_VIEW(2);
            // Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_RANK);
        }

        private onclickCity(e: egret.Event) {
            com_main.UpManager.history();
            // SceneManager.enterScene(SceneEnums.WORLD_XIANGYANG_CITY);
            let item = { cityID: 108 };
            WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, item.cityID);
        }

        /**城门归属刷新 */
        private refreshData(data) {
            // this.m_pListDoorDP.replaceAll([
            //     { cityID: 104, countryId: 1 },
            //     { cityID: 105, countryId: 2 },
            //     { cityID: 106, countryId: 3 },
            //     { cityID: 107, countryId: 0 }
            // ]);
            let dp = this.m_pListDoorDP;
            for (let i = 0; i < dp.length; i++) {
                if (!dp.getItemAt(i)) continue;
                let item = dp.getItemAt(i);
                item.countryId = WorldModel.getCityBuildInfo(item.cityID).country;
            }
            dp.refresh();

            let countryId = WorldModel.getCityBuildInfo(108).country;
            this.m_imgCountry.source = `common_country5_${countryId}_png`;
        }

        /**国家杀敌榜刷新 */
        private refreshDataRank(data) {
            let list = this.m_acEmpVo.getSingleRankData(RoleData.countryId);
            if (!list) return;
            let awardList = [];
            for (let i = 0; i < list.length; i++) {
                if (i > 2) break;
                awardList.push(list[i]);
            }
            this.m_pListRankDP.replaceAll(awardList);
        }

        private onTouchTab(e: eui.ItemTapEvent): void {
            let item = e.item;
            com_main.UpManager.history();
            WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, item.cityID);
        }
    }

    /**城门占领 */
    export class EmperorCountryCell extends eui.ItemRenderer {

        private m_imgBgF: com_main.CImage;
        private m_imgBg: com_main.CImage;
        private m_imgDoor: com_main.CImage;
        private m_imgCountry: com_main.CImage;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/emperorBattle/EmperorCountryCellSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_imgBgF.touchEnabled = false;
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy() {
            // EventManager.removeEventListener(this.m_pBtn);
        }

        protected dataChanged(): void {
            super.dataChanged();

            if (!this.data) return;
            let countryId = this.data.countryId;
            countryId = countryId == 4 ? 0 : countryId;
            let cityID = this.data.cityID;
            this.m_imgBgF.source = this.getBgSource(countryId);
            Utils.isGlow(true, this.m_imgBg, this.getBgGlowColor(countryId));
            this.m_imgCountry.source = `common_country1_${countryId}_png`;
            this.m_imgDoor.source = this.getDoorSource(cityID) + "_png";
        }

        private getBgSource(countryId: number) {
            switch (countryId) {
                case CountryType.SHU:
                    return 'zyt_gj_sg_png';
                case CountryType.WU:
                    return 'zyt_gj_wug_png';
                case CountryType.NONE:
                    return 'zyt_gj_zl_png';
            }
            return 'zyt_gj_wg_png';
        }

        private getDoorSource(cityID: number) {
            switch (cityID) {
                case 104:
                    return 'lb_dong';
                case 105:
                    return 'lb_xi';
                case 106:
                    return 'lb_nan';
            }
            return 'lb_bei';
        }

        private getBgGlowColor(countryId: number) {
            switch (countryId) {
                case CountryType.WEI:
                    return 0x2a7d9f;
                case CountryType.SHU:
                    return 0x2a9f35;
                case CountryType.WU:
                    return 0x9f2a2a;
            }
            return 0x7c695f;
        }
    }

    /**国家杀敌榜 */
    export class EmperorRankCell extends eui.ItemRenderer {

        private m_labRank: com_main.CLabel;
        private m_imgRank: com_main.CImage;
        private m_labame: com_main.CLabel;
        private m_labKill: com_main.CLabel;

        private m_tData: gameProto.ICommRank;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/emperorBattle/EmperorRankCellSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy() {

        }

        protected dataChanged(): void {
            super.dataChanged();

            this.refresh();
        }

        private refresh(): void {
            this.m_tData = this.data;
            if (!this.m_tData) return;

            RankModel.refreshRankIcon(this.m_imgRank, this.m_labRank, this.m_tData.rank);
            this.m_labame.text = this.m_tData.playerHead.playerName;
            this.m_labKill.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.XIANGYANG_KILL, this.m_tData.value));
        }
    }
}