module com_main {
    export class RankActView extends CView implements IRepeatActivityWnd {
        public static NAME = 'RankActView';
        public m_imgIcon: eui.Image;
        public m_labOpenTime: com_main.CLabel;
        public m_pViewRoot: eui.Group;
        public m_listItem: eui.List;
        public m_labTitle: com_main.CLabel;
        public m_labCurrRank: com_main.CLabel;

        /**面板类型 */
        public activityType: AcViewType;
        public bInit: boolean;
        private m_tCollection: eui.ArrayCollection;
        private rankVo: any;
        private m_nType: number;//榜单类型
        private ApkRankVoList: ApkRankVo[] = [];//竞技场排行数据
        public constructor(activiType: number) {
            super();
            this.activityType = activiType;
            this.name = RankActView.NAME;
            this.initType(activiType);
            this.initApp("activity/ranking/RankActViewSkin.exml");

        }
        private initType(type: RankType) {
            this.m_nType = type;

            switch (this.m_nType) {
                case AcViewType.FIGHT_RANKING_AWARD:
                case AcViewType.FIGHT_RANKING_AWARD:
                case AcViewType.APK_RANKING: {
                    this.currentState = 'power';
                    break;
                }
                case AcViewType.GUILD_FORCE_RANKING: {
                    this.currentState = 'legion';
                    break;
                }
                case AcViewType.COUNTRY_CITYS_RANKING: {
                    this.currentState = 'country';
                    break;
                }
            }
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            this.removeEvent();
            Utils.TimerManager.remove(this.updateDownTime, this);
            RankModel.clear();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listItem.dataProvider = this.m_tCollection;
            this.m_listItem.itemRenderer = RankPowerItem;
        }
        public updateDownTime() {
            let str = Utils.DateUtils.getCountdownStrByCfg(this.rankVo.closeDate - TimerUtils.getServerTimeMill(), 1);
            let timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labOpenTime.textFlow = Utils.htmlParser(`${timeStr}<font color=#00ff00>${str}</font>`);
        }

        /**初始化界面 */
        public initView() {
            if (this.bInit) return;
            this.bInit = true;
            if (this.activityType == AcViewType.FIGHT_RANKING_AWARD) {
                this.rankVo = ActivityModel.getActivityVo<FightRankVo>(this.activityType);
                this.m_nType = RankType.PLAYER;
                this.m_labTitle.text = GCode(CLEnum.FIGHT);
            } else if (this.activityType == AcViewType.LEVEL_RANKING_AWARD) {
                this.rankVo = ActivityModel.getActivityVo<LevelRankVo>(this.activityType);
                this.m_nType = RankType.LV_RANKS;
                this.m_labTitle.text = GCode(CLEnum.LEVEL2);
            } else if (this.activityType == AcViewType.COUNTRY_CITYS_RANKING) {
                this.rankVo = ActivityModel.getActivityVo<CountryRankVo>(this.activityType);
                this.m_nType = RankType.COUNTRY;
            } else if (this.activityType == AcViewType.GUILD_FORCE_RANKING) {
                this.rankVo = ActivityModel.getActivityVo<LegionRankVo>(this.activityType);
                this.m_nType = RankType.LEGION;
            } else {
                this.rankVo = ActivityModel.getActivityVo<ArenaRankVo>(this.activityType);
                this.m_nType = RankType.ARENA_POWER;
                PvpArenaProxy.send_APK_RANK_LIST(14);
            }
            if (this.activityType != AcViewType.APK_RANKING) {
                RankProxy.C2S_RANK_COMM(this.m_nType);
            }
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.rankVo.viewType + '_jpg');

            let curtime = TimerUtils.getServerTimeMill();
            if (curtime > this.rankVo.closeDate)
                return;
            this.updateDownTime();
            Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);

        }
        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pViewRoot);
        }
        /**刷新显示 */
        public refreshView() {

        }
        /**刷新列表数据 */
        private refresh() {
            if (!this.m_nType) return;
            if (this.m_nType == RankType.COUNTRY) {
                let list = RankModel.getCountryRankData();
                this.setCountryInfo(list);
            } else if (this.m_nType == RankType.LEGION) {
                let [list, owner] = RankModel.getLegionRankData();
                this.setLegionInfo(list, owner);
            }
            else {
                let [list, owner] = RankModel.getNormalData(this.m_nType);
                this.setPowerInfo(list, owner);
            }
        }
        /**战力，等级冲榜 */
        private setPowerInfo(list: gameProto.ICommRank[], owner: gameProto.ICommRank) {
            if (list && list.length > 0) {
                let res: RankItemRD[] = [];
                let len = list.length >= 50 ? 50 : list.length;
                for (let i = 0; i < len; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: list[i].rank });
                }
                this.m_tCollection.replaceAll(res);
            }
            let strRank: string;
            if (owner) {
                if (owner.rank <= 50) {
                    strRank = GCode(CLEnum.AC_RANK_TIP) + GCodeFromat(CLEnum.RANK_NUM, owner.rank);
                }
                else {
                    strRank = GCode(CLEnum.AC_RANK_TIP) + GCodeFromat(CLEnum.AC_RANK_OUTSIDE, 50);
                }
            } else {
                strRank = GCode(CLEnum.AC_RANK_TIP) + GCodeFromat(CLEnum.AC_RANK_OUTSIDE, 50);
            }
            this.m_labCurrRank.text = strRank;
        }
        /**国家冲榜 */
        private setCountryInfo(list: gameProto.IRankCountryMessage[]) {
            if (list && list.length > 0) {
                let res: RankItemRD[] = [];
                let len = list.length >= 50 ? 50 : list.length;
                list.sort((a, b) => {
                    let acount = this.getCityCount(a.citySize);
                    let bcount = this.getCityCount(a.citySize);
                    return acount - bcount;
                });
                for (let i = 0; i < len; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: i + 1 });
                }
                this.m_tCollection.replaceAll(res);
            }
        }
        /** 获取城池数量*/
        private getCityCount(citySize: number[]) {
            let allNum = 0;
            for (let i = 0; i < citySize.length; i++) {
                allNum += citySize[i];
            }
            return allNum;
        }
        /**联盟战力冲榜 */
        private setLegionInfo(list: gameProto.IRankLegionMessage[], owner: gameProto.IRankLegionMessage) {
            if (list && list.length > 0) {
                let res: RankItemRD[] = [];
                let len = list.length >= 3 ? 3 : list.length;
                for (let i = 0; i < len; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: list[i].rank });
                }
                this.m_tCollection.replaceAll(res);
            }
        }
        /**竞技场冲榜 */
        private setArenaInfo(list: ApkRankVo[]) {
            if (list && list.length > 0) {
                let res: RankItemRD[] = [];
                for (let i = 0; i < 10; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: list[i].rank });
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_labCurrRank.text = PvpArenaModel.Rank == Number.MAX_VALUE ? GCode(CLEnum.AC_RANK_TIP) + GCode(CLEnum.ARENA_NONE) : GCode(CLEnum.AC_RANK_TIP) + PvpArenaModel.Rank;
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        /**监听事件 */
        private addEvent() {

        }

        /**移除事件 */
        private removeEvent() {

        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_RANK_COMM,
                ProtoDef.APK_GET_RANK_LIST,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_RANK_COMM: {
                    let data = body as gameProto.IS2C_RANK_COMM;
                    if (data.rankId == this.m_nType) this.refresh();
                    break;
                }
                case ProtoDef.APK_GET_RANK_LIST: {//竞技场排名数据
                    if (body) {
                        if (this.m_nType == RankType.ARENA_POWER) {
                            for (let key in body.apkRankVoList) {
                                let vo = ApkRankVo.create(body.apkRankVoList[key]);
                                vo.setReward();
                                this.ApkRankVoList.push(vo);
                            }
                            this.setArenaInfo(this.ApkRankVoList);
                        }
                    }
                    break;
                }
            }
        }

    }
    class RankPowerItem extends eui.ItemRenderer {
        public m_RankLab: com_main.CLabel;
        public m_RankImg: com_main.CImage;
        public m_labPower: com_main.CLabel;
        public m_labName: com_main.CLabel;
        public m_comHead: com_main.ComHeadItem;
        public m_imgLegion: com_main.CImage;
        public m_rItemsRoot: eui.Group;
        public m_comState: com_main.ComState;
        public m_CountryIcon: com_main.ComState;

        private m_status: number;
        private m_tData: com_main.RankItemRD;
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/ranking/RankActItemSkin.exml");
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

        public dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            if (!this.m_tData) return;

            this.refreshRankIcon(this.m_tData.rank);
            switch (this.m_tData.type) {
                case RankType.PLAYER: {
                    this.currentState = 'power';
                    this.commitProperties();
                    let info = this.m_tData.param as gameProto.ICommRank;
                    let powerVo = ActivityModel.getActivityVo<FightRankVo>(AcViewType.FIGHT_RANKING_AWARD);
                    let cfg = powerVo.getPowerRankCfg(info.rank);
                    this.refreshheadInfo(info);
                    if (!cfg) return;
                    this.setitemlist(cfg.reward);
                    break;
                }
                case RankType.LV_RANKS: {
                    this.currentState = 'power';
                    this.commitProperties();
                    let info = this.m_tData.param as gameProto.ICommRank;
                    let levelVo = ActivityModel.getActivityVo<LevelRankVo>(AcViewType.LEVEL_RANKING_AWARD);
                    if (levelVo) {
                        let cfg = levelVo.getLevelRankCfg(info.rank);
                        this.refreshheadInfo(info);
                        if (!cfg) return;
                        this.setitemlist(cfg.reward);
                    }
                    break;
                }
                case RankType.COUNTRY: {
                    this.currentState = 'country';
                    this.commitProperties();
                    let info = this.m_tData.param as gameProto.IRankCountryMessage;
                    let currRank = this.m_tData.rank;
                    let countryVo = ActivityModel.getActivityVo<CountryRankVo>(AcViewType.COUNTRY_CITYS_RANKING);
                    if (countryVo) {
                        let cfg = countryVo.getCountryRankCfg(currRank);
                        if (!cfg) return;
                        this.setitemlist(cfg.reward);
                        this.refreshCityCount(info.citySize);
                        this.m_CountryIcon.stateId = info.countryId;
                    }
                    break;
                }
                case RankType.LEGION: {
                    this.currentState = 'legion';
                    this.commitProperties();
                    let info = this.m_tData.param as gameProto.IRankLegionMessage;
                    let countryVo = ActivityModel.getActivityVo<LegionRankVo>(AcViewType.GUILD_FORCE_RANKING);
                    if (countryVo) {
                        let cfg = countryVo.getLegionRankCfg(info.rank);
                        if (!cfg) return;
                        this.setitemlist(cfg.reward);
                        this.m_labPower.text = info.value.toString();
                        this.m_labName.text = info.legionName;
                        this.m_imgLegion.source = LegionModel.getLegionCountryImage(info.countryId);
                    }
                    EventManager.addTouchTapListener(this.m_imgLegion, this, this.onShowLegionIntroView);
                    break;
                }
                case RankType.ARENA_POWER: {
                    this.currentState = 'power';
                    this.commitProperties();
                    let info = this.m_tData.param as ApkRankVo;
                    let countryVo = ActivityModel.getActivityVo<ArenaRankVo>(AcViewType.APK_RANKING);
                    if (countryVo) {
                        let cfg = countryVo.getArenaRankCfg(info.rank);
                        if (!cfg) return;
                        this.m_comState.stateId = info.countryId;
                        this.m_comHead.info = { type: 1, url: info.head.toString(), official: 0, vip: 0 };
                        this.setitemlist(cfg.reward);
                        this.m_labPower.text = info.force.toString();
                        this.m_labName.text = info.playerName;
                        this.m_imgLegion.source = LegionModel.getLegionCountryImage(info.rank);
                    }
                    break;
                }
            }
        }
        /**查看联盟信息 */
        private onShowLegionIntroView() {
            let data: gameProto.IRankLegionMessage = this.m_tData.param;
            if (data && data.legionId && data.legionId != RoleData.alliance) {
                // LegionModel.getClickGuildInfo(data);
                NormalProxy.C2S_RANK_GUILD(data.legionId);
            }
        }
        /** 刷新城池数量*/
        private refreshCityCount(citySize: number[]): void {
            let allNum = 0;
            for (let i = 0; i < citySize.length; i++) {
                allNum += citySize[i];
            }
            this.m_labPower.text = allNum.toString(10);
        }
        /**刷新冲榜排名头像信息 */
        private refreshheadInfo(info: any): void {
            this.m_comHead.info = info.playerHead;
            this.m_comState.stateId = info.playerHead.countryId;
            this.m_labName.text = info.playerHead.playerName;
            this.m_labPower.text = info.value.toString(10);
        }
        /**刷新排名奖励 */
        public setitemlist(reward: IItemInfo[]) {
            Utils.removeAllChild(this.m_rItemsRoot);
            let tmpList = reward;
            for (let i = 0; i < tmpList.length; i++) {
                let info = tmpList[i];
                let itemView = ComItemNew.create('count');
                itemView.setItemInfo(info.itemId, info.count);
                itemView.scaleX = 0.75;
                itemView.scaleY = 0.75;
                this.m_rItemsRoot.addChild(itemView);
            }
        }

        /**刷新排名图标 */
        private refreshRankIcon(rank: Number): void {
            RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, rank);
        }

    }

}