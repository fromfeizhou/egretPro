var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     * pvp板相关
     */
    var PvpArenaView = /** @class */ (function (_super_1) {
        __extends(PvpArenaView, _super_1);
        function PvpArenaView() {
            var _this = _super_1.call(this) || this;
            _this.defaultchallengeMaxCount = 4;
            _this.name = PvpArenaView.NAME;
            _this.initApp("pvp_arena/PvpArenaViewSkin.exml");
            return _this;
        }
        PvpArenaView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.APK_GET_MY_APK,
                ProtoDef.GET_BGB_GENERAL_INFO,
                ProtoDef.APK_BUY_COUNT,
                ProtoDef.APK_GET_CHALLENGE_LIST,
                ProtoDef.APK_CHALLENGE_FAST,
                ProtoDef.APK_CHALLENGE_CHECK,
            ];
        };
        /**处理协议号事件 */
        PvpArenaView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.APK_GET_MY_APK: {
                    this.setPvpArenaInfo();
                    break;
                }
                case ProtoDef.GET_BGB_GENERAL_INFO: {
                    if (body && body.type == 3 /* DEF_APK */) {
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
                    if (body.refresh) { //排名发生变化
                        PvpArenaProxy.send_APK_GET_CHALLENGE_LIST();
                    }
                    break;
                }
            }
        };
        PvpArenaView.prototype.onDestroy = function () {
            // MainMap.moveToBuild(MBuildId.YWC, false);
            _super_1.prototype.onDestroy.call(this);
        };
        //界面弹出调用
        PvpArenaView.prototype.onRefresh = function () {
            _super_1.prototype.onRefresh.call(this);
            //this.initView();
            this.initTeam();
        };
        PvpArenaView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.validateNow();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.ARENA));
            this.m_pBtnRefresh.setTitleLabel(GCode(CLEnum.ARENA_SX));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.PVP_MEDAL]);
            // CampProxy.send_CAMP_HERO_LIST(TeamType.DEF_APK);
            PvpArenaProxy.send_APK_GET_CHALLENGE_LIST();
            PvpArenaProxy.send_APK_GET_MY_APK();
            com_main.EventManager.addTouchScaleListener(this.m_pBtnRank, this, this.showRankPanel);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnRecord, this, this.showNoticePanel);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnShop, this, this.showShopPanel);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnCamp, this, this.showCampPanel);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.onBuyNum);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnRefresh, this, this.onRefreshChaller);
            this.initView();
            this.initTeam();
            //适配
            Utils.toStageBestScaleHeigt(this.m_teamInfo);
            Utils.toStageBestScaleHeigt(this.m_playerList);
            this.onGuideCondition();
            this.m_pBtnBuy.visible = !platform.isHidePayFunc();
        };
        //刷新挑战者
        PvpArenaView.prototype.onRefreshChaller = function () {
            PvpArenaProxy.send_APK_GET_CHALLENGE_LIST();
        };
        //排行榜
        PvpArenaView.prototype.showRankPanel = function () {
            Utils.open_view(TASK_UI.POP_PVPARENA_RANK_PANEL);
        };
        //战报
        PvpArenaView.prototype.showNoticePanel = function () {
            Utils.open_view(TASK_UI.POP_PVPARENA_NOTICE_PANEL);
        };
        //商城
        PvpArenaView.prototype.showShopPanel = function () {
            //Utils.open_view(TASK_UI.POP_PVPARENA_SHOP_PANEL);     
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.ARENA);
        };
        //设置防守
        PvpArenaView.prototype.showCampPanel = function () {
            Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.PK_DEF });
        };
        PvpArenaView.prototype.initView = function () {
            var _this = this;
            this.PvpPlayerList = [];
            for (var i = 0; i < 4; i++) {
                this.PvpPlayerList.push(this["m_pPlayer" + i]);
                this.PvpPlayerList[i].onClickCell = function (id, rank, isSweeping) {
                    _this.onChallenge(id, rank, isSweeping);
                };
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
        };
        //显示防守阵型
        PvpArenaView.prototype.initTeam = function () {
            this.heroIdList = [];
            var teamVo = TeamModel.getTeamVoByType(3 /* DEF_APK */);
            for (var i = 0; i < teamVo.teamGeneralData.length; i++) {
                var data = teamVo.teamGeneralData[i];
                if (data.generalId > 0) {
                    this.heroIdList.push(Number(data.generalId));
                }
            }
            if (!this.heroList)
                this.heroList = [];
            // let campVo =  CampModel.getCamp(BGBType.DEF_APK);
            var power = 0;
            // if(campVo) 
            //     this.heroIdList = <number[]>campVo.getCamp(1);
            for (var i = 0; i < 5; i++) {
                if (this.heroList.length <= i)
                    this.heroList.push(this["m_pGeneral" + i]);
                var heroId = -1;
                if (this.heroIdList[i] && this.heroIdList[i] > 0)
                    heroId = this.heroIdList[i];
                this.heroList[i].setGenId(heroId);
                var generalVo = GeneralModel.getOwnGeneral(heroId);
                if (generalVo) {
                    power += generalVo.fight;
                }
            }
            this.m_pLbPower.text = power + "";
        };
        //设置竞技场数据
        PvpArenaView.prototype.setPvpArenaInfo = function () {
            this.m_pLbRank.text = PvpArenaModel.Rank == Number.MAX_VALUE ? GCode(CLEnum.ARENA_NONE) : PvpArenaModel.Rank + "";
            var tempCount = this.defaultchallengeMaxCount + PvpArenaModel.BuyCount;
            this.m_pLbChallengeNum.text = PvpArenaModel.CanChallengeCount + "/" + PvpArenaModel.AllChallengeCount;
        };
        //设置可挑战队列
        PvpArenaView.prototype.setChallengeList = function (data) {
            var tempChallengeList = [];
            if (data) {
                for (var key in data.apkRankVoList) {
                    var rankVo = ApkRankVo.create(data.apkRankVoList[key]);
                    // rankVo.setReward();
                    tempChallengeList.push(rankVo);
                }
            }
            tempChallengeList.sort(function (a, b) {
                return a.rank - b.rank;
            });
            for (var i = 0; i < this.PvpPlayerList.length; i++) {
                this.PvpPlayerList[i].setRankVo(tempChallengeList[i]);
            }
        };
        //挑战玩家
        PvpArenaView.prototype.onChallenge = function (id, rank, isSweeping) {
            if (PvpArenaModel.CanChallengeCount <= 0) {
                EffectUtils.showTips(GCode(CLEnum.ARENA_NUM_FAL), 1, true);
                return;
            }
            if (isSweeping) { //能扫荡就不用刷新排名（策划需求）
                PvpArenaProxy.send_APK_FAST_CHALLENGE(rank);
                return;
            }
            if (TeamModel.isEmptyTeamPVE()) {
                Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.NONE });
                return;
            }
            PvpArenaProxy.send_APK_CHALLENGE(rank);
        };
        /**购买次数 */
        PvpArenaView.prototype.onBuyNum = function () {
            var nextBuyId = NormalModel.getFunCountById(IFunCountEnum.APK_CHALLENGE_COUNT).buyAmountCount;
            var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_APK];
            var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
            var totalPrice = ConstUtil.getItems(IConstEnum.CONST_CHALLENGE_CONSUMES)[0].count;
            var data = NormalModel.getFunCountById(IFunCountEnum.APK_CHALLENGE_COUNT);
            if (nextBuyId >= buyMax) {
                Utils.showVipUpConfim();
                return;
            }
            // if (data.reBuyAmountCount == 0) {
            //     EffectUtils.showTips(GCode(CLEnum.SHOP_BUY_MAX), 1, true);
            //     return;
            // }
            var content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, totalPrice) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
            ;
            Utils.showConfirmPop(content, this.onConfirmBuy, this);
            // view.setVipCanBuyNum(GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId)))
        };
        /**前往充值界面 */
        PvpArenaView.prototype.onConFirmCharge = function () {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        };
        //确认购买
        PvpArenaView.prototype.onConfirmBuy = function () {
            var totalPrice = ConstUtil.getItems(IConstEnum.CONST_CHALLENGE_CONSUMES)[0].count;
            if (PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 1))
                PvpArenaProxy.send_APK_BUY_COUNT();
        };
        /**检查新手引导面板条件 */
        PvpArenaView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.PVP_WND);
        };
        PvpArenaView.NAME = 'PvpArenaView';
        return PvpArenaView;
    }(com_main.CView));
    com_main.PvpArenaView = PvpArenaView;
})(com_main || (com_main = {}));
