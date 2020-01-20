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
    var BossChallItem = /** @class */ (function (_super_1) {
        __extends(BossChallItem, _super_1);
        function BossChallItem() {
            var _this = _super_1.call(this) || this;
            _this.m_nBossId = 0;
            _this.m_singleInfo = null; // 个人boss信息	
            _this.rankBossInfo = null; // 排名boss信息	
            _this.worldBossInfo = null; // 世界boss信息	
            _this.m_nRemainTime = 0; /**倒计时 */
            _this.m_bIsGary = false;
            _this.skinName = Utils.getSkinName("app/boss/BossChallItemSkin.exml");
            return _this;
        }
        BossChallItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        BossChallItem.prototype.onDestroy = function () {
            this.removeEvent();
            Utils.TimerManager.remove(this.updateRemainTime, this);
            _super_1.prototype.onDestroy.call(this);
        };
        BossChallItem.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.m_imgCard.mask = this.m_mask;
            this.initEvent();
            // Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
        };
        /**设置boss信息 */
        BossChallItem.prototype.setItemInfo = function (type, bossId) {
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.m_nType = type;
            this.m_nBossId = bossId;
            this.m_bossCfg = C.PersonalBossConfig[this.m_nBossId];
            switch (this.m_nType) {
                case BossEnum.Single: {
                    this.reFreshSingleView();
                    break;
                }
                case BossEnum.Rank: {
                    this.reFreshRankView();
                    break;
                }
                case BossEnum.World: {
                    this.reFreshWorldView();
                    break;
                }
            }
        };
        /**刷新个人boss */
        BossChallItem.prototype.reFreshSingleView = function () {
            this.reFreshCard();
            var openLv = this.m_bossCfg.openLevel;
            var isOpen = RoleData.level >= openLv;
            this.m_pSingleAward.visible = isOpen;
            this.m_imgLocked.visible = !isOpen;
            this.m_btnFight.visible = true;
            this.m_labTips.text = '';
            if (isOpen) {
                Utils.isGray(false, this.m_imgCard);
                this.m_black.visible = false;
            }
            else {
                this.m_black.visible = true;
            }
            this.m_singleInfo = BossModel.getSingleItemInfo(this.m_nBossId);
            if (this.m_singleInfo) {
                this.m_btnFight.currentState = 'style6';
                this.m_btnState = BtnState.SWEEPING;
                this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
            }
            else {
                this.m_btnFight.currentState = 'style1';
                this.m_btnState = BtnState.CHALLANGE;
                if (!isOpen) {
                    this.m_pRoot.touchChildren = false;
                    this.m_btnFight.visible = false;
                    this.m_labTips.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, openLv);
                }
                else {
                    this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
                    this.m_pRoot.touchChildren = true;
                }
            }
            RedPointModel.AddInfoListener(this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [RedEvtType.BOSS_SINGLE], 2, { bossId: this.m_nBossId });
        };
        /**刷新排行boss */
        BossChallItem.prototype.reFreshRankView = function () {
            this.rankBossInfo = BossModel.getRandItemInfo(this.m_nBossId);
            this.reFreshCard();
            if (this.rankBossInfo) {
                this.reFreshHp(this.rankBossInfo.bossHp);
            }
            this.m_btnState = BtnState.CHALLANGE;
            var openLv = this.m_bossCfg.openLevel;
            var isOpen = RoleData.level >= openLv;
            this.m_pMultiAward.visible = isOpen;
            this.m_pBlood.visible = isOpen;
            this.m_imgLocked.visible = !isOpen;
            this.m_btnFight.visible = true;
            this.m_labTips.visible = false;
            this.m_rankGroup.visible = true;
            if (isOpen) {
                Utils.isGray(false, this.m_imgCard);
                this.m_black.visible = false;
            }
            else {
                this.m_black.visible = true;
            }
            this.m_labTips.visible = false;
            this.m_wsbtxt.visible = true;
            this.m_rankCunt.text = '';
            if (!isOpen) {
                this.m_rankGroup.visible = false;
                this.m_labTips.visible = true;
                this.m_labTips.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, openLv);
                this.m_pRoot.touchChildren = false;
                this.m_btnFight.visible = false;
                return;
            }
            else {
                this.m_pRoot.touchChildren = true;
                this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
            }
            if (this.rankBossInfo) {
                //复活时间
                var reviveTime = this.rankBossInfo.bossReviveTime;
                if (reviveTime > 0) {
                    this.m_btnFight.visible = false;
                    this.m_labTips.visible = true;
                    this.reFreshCardTime(reviveTime);
                }
                var rankLv = BossModel.getPlayerLvInRankBoss(this.m_nBossId);
                if (rankLv > 0) {
                    this.m_wsbtxt.visible = false;
                    this.m_rankCunt.text = rankLv + '';
                }
                else {
                    this.m_rankCunt.text = '';
                    this.m_wsbtxt.visible = true;
                }
            }
            RedPointModel.AddInfoListener(this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [RedEvtType.BOSS_RANK], 2, { bossId: this.m_nBossId });
        };
        /**刷新世界boss */
        BossChallItem.prototype.reFreshWorldView = function () {
            this.worldBossInfo = BossModel.getWorldItemInfo(this.m_nBossId);
            this.reFreshCard();
            this.m_btnState = BtnState.CHALLANGE;
            if (this.worldBossInfo) {
                this.reFreshHp(this.worldBossInfo.bossHp);
            }
            else {
                this.reFreshHp(1);
            }
            var openTime = this.m_bossCfg.time;
            openTime = openTime.replace('[', '');
            openTime = openTime.replace(']', '');
            var times = openTime.split(',');
            var startTime = TimerUtils.getTimeByFormatA(times[0]);
            var endTime = TimerUtils.getTimeByFormatA(times[1]);
            var curTime = TimerUtils.getServerTime();
            var curweek = TimerUtils.getTimeWeek();
            var isOpen = (curTime >= startTime && curTime <= endTime);
            var weekOpeen = (curweek == this.m_bossCfg.week);
            if (isOpen && weekOpeen) {
                this.m_btnFight.visible = true;
                this.m_pBlood.visible = true;
                this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
                this.m_labTips.textFlow = [];
            }
            else {
                this.m_btnFight.visible = false;
                this.m_pBlood.visible = false;
                var dayDes = [GCode(CLEnum.BOSS_DAY7), GCode(CLEnum.BOSS_DAY1), GCode(CLEnum.BOSS_DAY2), GCode(CLEnum.BOSS_DAY3),
                    GCode(CLEnum.BOSS_DAY4), GCode(CLEnum.BOSS_DAY5), GCode(CLEnum.BOSS_DAY6)];
                var dateStr = dayDes[this.m_bossCfg.week] + "： " + "<font color=#e9e9e6>" + times[0].slice(0, 5) + "-" + times[1].slice(0, 5) + "</font>";
                this.m_labTips.textFlow = Utils.htmlParser(dateStr);
            }
            var rankLv = BossModel.getPlayerLvInWorldBoss(this.m_nBossId);
            if (rankLv > 0) {
                this.m_wsbtxt.visible = false;
                this.m_rankCunt.text = rankLv + '';
            }
            else {
                this.m_rankCunt.text = '';
                this.m_wsbtxt.visible = true;
            }
            RedPointModel.AddInfoListener(this.m_btnFight, { x: 116, y: -3, scale: 0.78 }, [RedEvtType.BOSS_WORLD], 2, { bossId: this.m_nBossId });
        };
        /**刷新卡片 */
        BossChallItem.prototype.reFreshCard = function () {
            if (!this.m_bossCfg)
                return;
            this.m_labTile.text = GLan(this.m_bossCfg.bossName);
            this.m_comFightItem.setFight(this.m_bossCfg.power);
            var cfg = GeneralModel.getGeneralConfig(this.m_bossCfg.model);
            this.m_imgCard.source = GeneralModel.getSoldierBigLogo(cfg.role);
            this.m_labLevel.text = GCodeFromat(CLEnum.LEVEL1, this.m_bossCfg.openLevel);
        };
        /**设置boss血量 */
        BossChallItem.prototype.reFreshHp = function (percent) {
            this.m_labPro.text = Math.ceil(percent * 100) + "%";
            this.m_imgPro.width = BossChallItem.PRO_WIDTH * percent;
        };
        /**刷新卡片倒计时显示 */
        BossChallItem.prototype.reFreshCardTime = function (time) {
            Utils.TimerManager.remove(this.updateRemainTime, this);
            this.m_nRemainTime = time;
            Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
            this.m_labTips.text = Utils.DateUtils.getCountdownStrByTimestamp(this.m_nRemainTime);
        };
        /**刷新倒计时 */
        BossChallItem.prototype.updateRemainTime = function () {
            var curtime = TimerUtils.getServerTimeMill();
            var remaiTime = this.m_nRemainTime - curtime;
            if (remaiTime > 0) {
                if (--remaiTime > 0) {
                    this.m_labTips.text = Utils.DateUtils.getCountdownStrByTimestamp(this.m_nRemainTime);
                }
            }
            else {
                Utils.TimerManager.remove(this.updateRemainTime, this);
                BossProxy.C2S_GET_BOSS();
            }
        };
        BossChallItem.prototype.setViewState = function (state) {
            if (this.currentState != state)
                this.currentState = state;
            this.commitProperties();
        };
        /**=====================================================================================
             * 事件监听 begin
             * =====================================================================================
             */
        BossChallItem.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
            com_main.EventManager.addTouchScaleListener(this.m_btnSingle, this, this.onCheckBox);
            com_main.EventManager.addTouchScaleListener(this.m_btnKill, this, this.onCheckBox);
            com_main.EventManager.addTouchScaleListener(this.m_btnRank, this, this.onRankReward);
            com_main.EventManager.addTouchScaleListener(this.m_rankGroup, this, this.onRankGroup);
            com_main.EventManager.addTouchScaleListener(this.m_imgLocked, this, this.onImgLock);
        };
        BossChallItem.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**
       * 挑战事件
       */
        BossChallItem.prototype.onBtnFight = function (e) {
            switch (this.m_btnState) {
                case BtnState.CHALLANGE: {
                    this.onChallange();
                    break;
                }
                case BtnState.SWEEPING: {
                    this.onSweep();
                    break;
                }
            }
        };
        BossChallItem.prototype.onImgLock = function () {
            EffectUtils.showTips(GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.m_bossCfg.openLevel), 1, true);
        };
        /**boss挑战 */
        BossChallItem.prototype.onChallange = function () {
            var info = this.getFuncInfo();
            if (info.reCount <= 0) {
                EffectUtils.showTips(GCode(CLEnum.MAT_NO_NUMBER), 1, true);
                return;
            }
            if (TeamModel.isEmptyTeamPVE()) {
                Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.BOSS, battleId: this.m_nBossId });
                return;
            }
            BossProxy.C2S_CHALLENGE_BOSS(this.m_nBossId);
        };
        /**boss扫荡 */
        BossChallItem.prototype.onSweep = function () {
            var _this = this;
            var info = this.getFuncInfo();
            if (info.reCount > 0) {
                BossProxy.C2S_CLEAR_BOSS(this.m_nBossId, 1);
            }
            else {
                if (info.reBuyAmountCount > 0) {
                    var totalPrice = NormalModel.getFunCostByData(info);
                    var content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, totalPrice) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, info.reBuyAmountCount);
                    Utils.showConfirmPop(content, function () {
                        BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(_this.m_nType);
                    }, this);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.BOSS_BUY_FAL), 1, true);
                }
            }
        };
        /**boss伤害榜单 */
        BossChallItem.prototype.onRankGroup = function () {
            switch (this.m_nType) {
                case BossEnum.Rank:
                    if (this.rankBossInfo) {
                        Utils.open_view(TASK_UI.BOSS_HURT_RANK, { list: this.rankBossInfo });
                    }
                    break;
                case BossEnum.World:
                    if (this.worldBossInfo) {
                        Utils.open_view(TASK_UI.BOSS_HURT_RANK, { list: this.worldBossInfo });
                    }
            }
        };
        /**
        * 查看击杀奖励
        */
        BossChallItem.prototype.onCheckBox = function (e) {
            var awards;
            if (this.m_bossCfg.bossType == BossEnum.Single) {
                awards = Utils.parseCommonItemJsonInDrop(JSON.stringify([this.m_bossCfg.killReward]));
            }
            else if (this.m_bossCfg.bossType) {
                var rawardList = BossModel.getAwardBybossId(this.m_bossCfg.id, this.m_bossCfg.bossType);
                awards = rawardList[0].reward;
            }
            Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: awards });
        };
        /**
      * 查看排名奖励
      */
        BossChallItem.prototype.onRankReward = function (e) {
            var rawardList = BossModel.getAwardBybossId(this.m_bossCfg.id, this.m_bossCfg.bossType);
            var List = [];
            for (var i = 0; i < rawardList.length; i++) {
                var raward = rawardList[i];
                if (raward.rank != 0) {
                    List.push(raward);
                }
            }
            Utils.open_view(TASK_UI.BOSS_BOX_RANKREWARD, { awards: List, bossType: this.m_bossCfg.bossType });
        };
        /**获得功能次数 */
        BossChallItem.prototype.getFuncInfo = function () {
            switch (this.m_nType) {
                case BossEnum.Single:
                    return NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS);
                case BossEnum.Rank:
                    return NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS);
            }
            return NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS);
        };
        /*================================================================================================*/
        BossChallItem.PRO_WIDTH = 312;
        return BossChallItem;
    }(com_main.CComponent));
    com_main.BossChallItem = BossChallItem;
})(com_main || (com_main = {}));
