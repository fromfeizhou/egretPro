module com_main {
	/**
	 * pvp板相关
	 */
    export class PvpArenaView extends CView {
        public static NAME = 'PvpArenaView';
        public m_teamInfo: eui.Group;
        public m_pLbRank: com_main.CLabel;
        public m_pLbPower: com_main.CLabel;
        public m_pGeneralRoot: eui.Group;
        public m_pGeneral0: com_main.GeneralPvpHeadItem;
        public m_pGeneral1: com_main.GeneralPvpHeadItem;
        public m_pGeneral2: com_main.GeneralPvpHeadItem;
        public m_pGeneral3: com_main.GeneralPvpHeadItem;
        public m_pGeneral4: com_main.GeneralPvpHeadItem;
        public m_pBtnCamp: com_main.CImage;
        public m_pBtnRank: com_main.CImage;
        public m_pBtnRecord: com_main.CImage;
        public m_pBtnShop: com_main.CImage;
        public m_playerList: eui.Group;
        public m_pPlayer0: com_main.PvpPlayerCell;
        public m_pPlayer1: com_main.PvpPlayerCell;
        public m_pPlayer2: com_main.PvpPlayerCell;
        public m_pPlayer3: com_main.PvpPlayerCell;
        public m_pLbChallengeNum: com_main.CLabel;
        public m_pBtnBuy: com_main.CImage;
        public m_pBtnRefresh: com_main.ComButton;
        public m_MainTopNew: com_main.MainTopNew;

        private heroIdList: number[];
        private heroList: GeneralPvpHeadItem[];

        private PvpPlayerList: PvpPlayerCell[];

        private defaultchallengeMaxCount: number = 4;
        public constructor() {
            super();
            this.name = PvpArenaView.NAME;
            this.initApp("pvp_arena/PvpArenaViewSkin.exml");


        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.APK_GET_MY_APK,
                ProtoDef.GET_BGB_GENERAL_INFO,
                ProtoDef.APK_BUY_COUNT,
                ProtoDef.APK_GET_CHALLENGE_LIST,
                ProtoDef.APK_CHALLENGE_FAST,
                ProtoDef.APK_CHALLENGE_CHECK,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.APK_GET_MY_APK: {
                    this.setPvpArenaInfo();
                    break;
                }
                case ProtoDef.GET_BGB_GENERAL_INFO: {
                    if (body && body.type == TeamType.DEF_APK) {
                        this.initTeam();
                    }
                    break;
                }
                case ProtoDef.APK_GET_CHALLENGE_LIST: {
                    this.setChallengeList(body);
                    break;
                }
                case ProtoDef.APK_BUY_COUNT: {
                    this.setPvpArenaInfo();
                    break;
                }
                case ProtoDef.APK_CHALLENGE_FAST: {
                    PvpArenaProxy.send_APK_GET_CHALLENGE_LIST();
                    this.setPvpArenaInfo();
                    break;
                }
                case ProtoDef.APK_CHALLENGE_CHECK: {
                    if (body.refresh) {//排名发生变化
                        PvpArenaProxy.send_APK_GET_CHALLENGE_LIST();
                    }
                    break;
                }
            }
        }

        public onDestroy(): void {
            // MainMap.moveToBuild(MBuildId.YWC, false);
            super.onDestroy();
        }
        //界面弹出调用
        public onRefresh() {
            super.onRefresh();
            //this.initView();
            this.initTeam();

        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.validateNow();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.ARENA));
            this.m_pBtnRefresh.setTitleLabel(GCode(CLEnum.ARENA_SX));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.PVP_MEDAL]);


            // CampProxy.send_CAMP_HERO_LIST(TeamType.DEF_APK);
            PvpArenaProxy.send_APK_GET_CHALLENGE_LIST();
            PvpArenaProxy.send_APK_GET_MY_APK();

            EventManager.addTouchScaleListener(this.m_pBtnRank, this, this.showRankPanel);
            EventManager.addTouchScaleListener(this.m_pBtnRecord, this, this.showNoticePanel);
            EventManager.addTouchScaleListener(this.m_pBtnShop, this, this.showShopPanel);
            EventManager.addTouchScaleListener(this.m_pBtnCamp, this, this.showCampPanel);
            EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.onBuyNum);
            EventManager.addTouchScaleListener(this.m_pBtnRefresh, this, this.onRefreshChaller);
            this.initView();
            this.initTeam();

            //适配
            Utils.toStageBestScaleHeigt(this.m_teamInfo);
            Utils.toStageBestScaleHeigt(this.m_playerList);

            this.onGuideCondition();
            this.m_pBtnBuy.visible = !platform.isHidePayFunc();
        }
        //刷新挑战者
        private onRefreshChaller() {
            PvpArenaProxy.send_APK_GET_CHALLENGE_LIST();
        }

        //排行榜
        private showRankPanel() {
            Utils.open_view(TASK_UI.POP_PVPARENA_RANK_PANEL);
        }
        //战报
        private showNoticePanel() {
            Utils.open_view(TASK_UI.POP_PVPARENA_NOTICE_PANEL);
        }
        //商城
        private showShopPanel() {
            //Utils.open_view(TASK_UI.POP_PVPARENA_SHOP_PANEL);     
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.ARENA);
        }

        //设置防守
        private showCampPanel() {
            Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.PK_DEF });
        }

        private initView() {

            this.PvpPlayerList = [];
            for (let i = 0; i < 4; i++) {
                this.PvpPlayerList.push(this["m_pPlayer" + i]);
                this.PvpPlayerList[i].onClickCell = (id, rank, isSweeping) => {
                    this.onChallenge(id, rank, isSweeping);
                }
            }

            this.setPvpArenaInfo();
            this.setChallengeList(null);

            // this.heroList = [];
            // let equipHeroList = [-1,1005,1001,-1,-1];
            // for(let i=0;i<5;i++){
            //     this.heroList.push(this["m_pGeneral"+i]);
            //     let heroId = equipHeroList[i]?equipHeroList[i]:-1;
            //     this.heroList[i].setId(heroId);
            // }
        }
        //显示防守阵型
        private initTeam() {
            this.heroIdList = [];
            let teamVo = TeamModel.getTeamVoByType(TeamType.DEF_APK);
            for (let i = 0; i < teamVo.teamGeneralData.length; i++) {
                let data = teamVo.teamGeneralData[i];
                if (data.generalId > 0) {
                    this.heroIdList.push(Number(data.generalId));
                }
            }

            if (!this.heroList)
                this.heroList = [];


            // let campVo =  CampModel.getCamp(BGBType.DEF_APK);
            let power = 0;
            // if(campVo) 
            //     this.heroIdList = <number[]>campVo.getCamp(1);
            for (let i = 0; i < 5; i++) {
                if (this.heroList.length <= i)
                    this.heroList.push(this["m_pGeneral" + i]);
                let heroId = -1;
                if (this.heroIdList[i] && this.heroIdList[i] > 0)
                    heroId = this.heroIdList[i];
                this.heroList[i].setGenId(heroId);
                let generalVo = GeneralModel.getOwnGeneral(heroId);
                if (generalVo) {
                    power += generalVo.fight;
                }
            }
            this.m_pLbPower.text = power + "";
        }
        //设置竞技场数据
        private setPvpArenaInfo() {
            this.m_pLbRank.text = PvpArenaModel.Rank == Number.MAX_VALUE ? GCode(CLEnum.ARENA_NONE) : PvpArenaModel.Rank + "";
            let tempCount = this.defaultchallengeMaxCount + PvpArenaModel.BuyCount;
            this.m_pLbChallengeNum.text = PvpArenaModel.CanChallengeCount + "/" + PvpArenaModel.AllChallengeCount;
        }

        //设置可挑战队列
        private setChallengeList(data: any) {
            let tempChallengeList = [];
            if (data) {
                for (let key in data.apkRankVoList) {
                    let rankVo = ApkRankVo.create(data.apkRankVoList[key]);
                    // rankVo.setReward();
                    tempChallengeList.push(rankVo);
                }
            }
            tempChallengeList.sort(
                (a, b) => {
                    return a.rank - b.rank;
                }
            );
            for (let i = 0; i < this.PvpPlayerList.length; i++) {
                this.PvpPlayerList[i].setRankVo(tempChallengeList[i]);
            }
        }

        //挑战玩家
        private onChallenge(id: number, rank: number, isSweeping: boolean) {
            if (PvpArenaModel.CanChallengeCount <= 0) {
                EffectUtils.showTips(GCode(CLEnum.ARENA_NUM_FAL), 1, true);
                return;
            }
            if (isSweeping) {//能扫荡就不用刷新排名（策划需求）
                PvpArenaProxy.send_APK_FAST_CHALLENGE(rank);
                return;
            }

            if (TeamModel.isEmptyTeamPVE()) {
                Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.NONE });
                return;
            }
            PvpArenaProxy.send_APK_CHALLENGE(rank);
        }

        /**购买次数 */
        private onBuyNum() {
            let nextBuyId = NormalModel.getFunCountById(IFunCountEnum.APK_CHALLENGE_COUNT).buyAmountCount;
            let vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_APK];
            let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
            let totalPrice = ConstUtil.getItems(IConstEnum.CONST_CHALLENGE_CONSUMES)[0].count;
            let data: gameProto.IFunCount = NormalModel.getFunCountById(IFunCountEnum.APK_CHALLENGE_COUNT);
            if (nextBuyId >= buyMax) {
                Utils.showVipUpConfim();
                return;
            }
            // if (data.reBuyAmountCount == 0) {
            //     EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX), 1, true);
            //     return;
            // }
            let content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, totalPrice)+ '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));;
            Utils.showConfirmPop(content, this.onConfirmBuy, this);
            // view.setVipCanBuyNum(GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId)))
        }
        /**前往充值界面 */
        public onConFirmCharge() {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        }
        //确认购买
        private onConfirmBuy() {
            let totalPrice = ConstUtil.getItems(IConstEnum.CONST_CHALLENGE_CONSUMES)[0].count;
            if (PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 1)) PvpArenaProxy.send_APK_BUY_COUNT();
        }


        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.PVP_WND);
        }
    }


}