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
    var BossChallView = /** @class */ (function (_super_1) {
        __extends(BossChallView, _super_1);
        function BossChallView(type, width, height) {
            var _this = _super_1.call(this) || this;
            _this.m_boxProWidth = 242; //宝箱进度条宽度
            _this.name = BossChallView.NAME;
            _this.m_nType = type;
            _this.width = width;
            _this.height = height;
            switch (type) {
                case BossEnum.Single:
                    _this.m_currState = 'Single';
                    break;
                case BossEnum.Rank:
                    _this.m_currState = 'rank';
                    break;
                case BossEnum.World:
                    _this.m_currState = 'world';
                    break;
            }
            _this.currentState = _this.m_currState;
            _this.initApp("boss/BossChallViewSkin.exml");
            return _this;
        }
        BossChallView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_GET_BOSS,
                ProtoDef.S2C_CLEAR_BOSS,
                ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT,
                ProtoDef.S2C_RECEIVE_BOSS_BOX,
            ];
        };
        /**处理协议号事件 */
        BossChallView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_GET_BOSS: {
                    this.initPanel();
                    break;
                }
                case ProtoDef.S2C_CLEAR_BOSS: { //扫荡返回
                    this.reFlashitem(body);
                    var VO = body;
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
                    break;
                }
                case ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT: { //返回购买boss挑战次数
                    this.setCount();
                    break;
                }
                case ProtoDef.S2C_RECEIVE_BOSS_BOX: { //领取宝箱返回
                    this.setBoxReward();
                    break;
                }
            }
        };
        BossChallView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        BossChallView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        BossChallView.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listCard.dataProvider = this.m_pCollection;
            this.m_listCard.itemRenderer = BossItemRender;
            this.m_listCard.useVirtualLayout = true;
            egret.callLater(function () {
                if (_this.m_listCard) {
                    Utils.tileGroupToCenter(_this.m_listCard, 370);
                }
            }, this);
            this.validateNow();
            this.initPanel();
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        /**初始化boss列表 */
        BossChallView.prototype.initPanel = function () {
            var bossArr = [];
            var list = BossModel.getBossCfgByType(this.m_nType);
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var data = { id: vo.id, type: vo.bossType };
                bossArr.push(data);
            }
            if (this.m_nType == BossEnum.World) {
                bossArr.sort(this.sortWorldBoss);
            }
            else if (this.m_nType == BossEnum.Single) {
                bossArr.sort(this.sortSingleBoss);
            }
            else {
                bossArr.sort(this.sortRankBoss);
            }
            this.m_pCollection.replaceAll(bossArr);
            this.setCount();
        };
        /**个人boss排序 */
        BossChallView.prototype.sortSingleBoss = function (a, b) {
            var fight1 = RoleData.level >= C.PersonalBossConfig[a.id].openLevel;
            var fight2 = RoleData.level >= C.PersonalBossConfig[b.id].openLevel;
            if (fight1 != fight2) {
                return fight1 ? -1 : 1;
            }
            var pass1 = BossModel.getSingleItemInfo(a.id) ? true : false;
            var pass2 = BossModel.getSingleItemInfo(b.id) ? true : false;
            if (pass1 != pass2) {
                return pass1 ? 1 : -1;
            }
            if (pass1) {
                return b.id - a.id;
            }
            return a.id - b.id;
        };
        /**排名boss排序 */
        BossChallView.prototype.sortRankBoss = function (a, b) {
            function setRankSort(RankCfg) {
                var reviveTime = RankCfg.bossReviveTime;
                if (RankCfg) {
                    if (reviveTime <= 0) {
                        return 1;
                    }
                    else if (reviveTime > 0) {
                        return 0;
                    }
                }
                else {
                    return -1;
                }
            }
            var m_rankCfga = C.PersonalBossConfig[a.id];
            var m_rankCfgb = C.PersonalBossConfig[b.id];
            var rankInfo1 = BossModel.getRandItemInfo(a.id);
            var rankInfo2 = BossModel.getRandItemInfo(b.id);
            var rankNum1 = setRankSort(rankInfo1);
            var rankNum2 = setRankSort(rankInfo2);
            var rankOpen1 = RoleData.level >= m_rankCfga.openLevel ? 1 : 0;
            var rankOpen2 = RoleData.level >= m_rankCfgb.openLevel ? 1 : 0;
            if (rankOpen1 != rankOpen2) {
                return rankOpen2 - rankOpen1;
            }
            if (rankNum1 != rankNum2) {
                return rankNum2 - rankNum1;
            }
            if (m_rankCfga.openLevel != m_rankCfgb.openLevel) {
                return m_rankCfga.openLevel - m_rankCfgb.openLevel;
            }
        };
        /**世界boss排序 */
        BossChallView.prototype.sortWorldBoss = function (a, b) {
            function setBossState(bossCfg) {
                var openTime = bossCfg.time;
                openTime = openTime.replace('[', '');
                openTime = openTime.replace(']', '');
                var times = openTime.split(',');
                var startTime = TimerUtils.getTimeByFormatA(times[0]);
                var endTime = TimerUtils.getTimeByFormatA(times[1]);
                var curTime = TimerUtils.getServerTime();
                var curweek = TimerUtils.getTimeWeek();
                var isOpen = (curTime >= startTime && curTime <= endTime);
                var weekOpeen = (curweek == bossCfg.week);
                if (isOpen && weekOpeen) {
                    return 1;
                }
                return 0;
            }
            var m_bossCfga = C.PersonalBossConfig[a.id];
            var m_bossCfgb = C.PersonalBossConfig[b.id];
            var num1 = setBossState(m_bossCfga);
            var num2 = setBossState(m_bossCfgb);
            if (num1 != num2) {
                return num2 - num1;
            }
            if (m_bossCfga.openLevel != m_bossCfgb.openLevel) {
                return m_bossCfga.openLevel - m_bossCfgb.openLevel;
            }
        };
        /**刷新列表数据 */
        BossChallView.prototype.reFlashitem = function (info) {
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.source[i];
                if (data.id == info.personalBossInfo.bossId) {
                    this.m_pCollection.replaceItemAt(data, i);
                }
            }
            this.setCount(); //更新次數
        };
        /**初始化挑战次数 */
        BossChallView.prototype.setCount = function () {
            var info = this.getFuncInfo();
            this.m_labPro.text = info.reCount + "/" + NormalModel.getFuncCfgCount(info);
            switch (this.m_nType) {
                case BossEnum.Single:
                case BossEnum.World: {
                    this.setBoxReward();
                    break;
                }
                case BossEnum.Rank: {
                    var curTime = TimerUtils.getServerTimeMill();
                    this.m_endTime = Math.ceil((BossModel.rankBossPlayerEndReviveTime - curTime));
                    this.m_endTime = this.m_endTime % (ConstUtil.getValue(IConstEnum.RANKING_BOSS_PLAYER_REVIVE_TIME));
                    this.m_endTime = Math.floor(this.m_endTime / 1000);
                    if (this.m_endTime <= 0) {
                        this.m_endTime = 0;
                        this.m_pRankTime.visible = false;
                    }
                    else {
                        Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
                    }
                    this.m_downCount.text = Utils.DateUtils.getFormatBySecond(this.m_endTime, 3);
                    break;
                }
            }
        };
        /**初始宝箱进度条 */
        BossChallView.prototype.setBoxReward = function () {
            var hurtcfg = BossModel.getHurtOneCfg();
            if (hurtcfg) {
                this.m_pHurtLab.visible = true;
                this.m_btnBox.touchEnabled = true;
                this.m_AllOutRoot.visible = false;
                this.m_hurtCount.text = "" + CommonUtils.numOutLenght(hurtcfg.bossHurt);
                var percentum = void 0;
                if (BossModel.worldSumHurt <= 0) {
                    BossModel.worldSumHurt = 0;
                }
                if (BossModel.worldSumHurt / hurtcfg.bossHurt >= 1) {
                    percentum = 1;
                    this.m_boxRoot.visible = true;
                    this.m_btnBox.visible = false;
                    if (!this.m_pEffect) {
                        this.m_pEffect = new com_main.BoxEffect(2, true);
                        this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
                        this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
                        this.m_pEffect.x = 48;
                        this.m_pEffect.y = 50;
                        this.m_boxRoot.addChild(this.m_pEffect);
                    }
                }
                else {
                    percentum = BossModel.worldSumHurt / hurtcfg.bossHurt;
                    this.m_btnBox.source = "bx-lanl_png";
                    this.m_btnBox.visible = true;
                    this.m_boxRoot.visible = false;
                    if (this.m_pEffect) {
                        this.m_pEffect.onDestroy();
                        Utils.removeFromParent(this.m_pEffect);
                        this.m_pEffect = null;
                    }
                }
                this.m_imgPro.width = this.m_boxProWidth * percentum;
            }
            else {
                this.m_pHurtLab.visible = false;
                this.m_btnBox.visible = true;
                this.m_btnBox.source = "bx-open_png";
                this.m_AllOutRoot.visible = true;
                this.m_btnBox.touchEnabled = false;
                this.m_imgPro.width = this.m_boxProWidth * 1;
                if (this.m_pEffect) {
                    this.m_pEffect.onDestroy();
                    Utils.removeFromParent(this.m_pEffect);
                    this.m_pEffect = null;
                }
            }
        };
        /**刷新倒计时 */
        BossChallView.prototype.updateRemainTime = function () {
            if (--this.m_endTime > -1) {
                this.m_downCount.text = Utils.DateUtils.getFormatBySecond(this.m_endTime, 3);
                this.m_pRankTime.visible = true;
            }
            else {
                this.m_downCount.text = Utils.DateUtils.getFormatBySecond(this.m_endTime, 3);
                this.m_pRankTime.visible = false;
                Utils.TimerManager.remove(this.updateRemainTime, this);
                BossProxy.C2S_GET_BOSS();
            }
        };
        /**监听事件 */
        BossChallView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnBox, this, this.onCheckReward);
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onBtnAdd /*onBtnAdd*/);
            com_main.EventManager.addTouchScaleListener(this.m_boxRoot, this, this.onClickBox);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnShop, this, this.showShopPanel);
        };
        /**移除事件 */
        BossChallView.prototype.removeEvent = function () {
            Utils.TimerManager.remove(this.updateRemainTime, this);
        };
        /**领取伤害宝箱奖励 */
        BossChallView.prototype.onClickBox = function () {
            var hurtcfg = BossModel.getHurtOneCfg();
            if (hurtcfg) {
                if (BossModel.worldSumHurt >= hurtcfg.bossHurt) {
                    BossProxy.C2S_RECEIVE_BOSS_BOX(hurtcfg.id);
                }
            }
        };
        //商城
        BossChallView.prototype.showShopPanel = function () {
            //Utils.open_view(TASK_UI.POP_PVPARENA_SHOP_PANEL);     
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.GENERAL);
        };
        /**查看伤害宝箱奖励 */
        BossChallView.prototype.onCheckReward = function () {
            var hurtcfg = BossModel.getHurtOneCfg();
            Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: hurtcfg.bossHurtReward });
        };
        /**增加挑战次数1.0.2 */
        BossChallView.prototype.onBtnAdd = function () {
            var info = this.getFuncInfo();
            var totalPrice = NormalModel.getFunCostByData(info);
            if (info.reBuyAmountCount == 0 && this.m_nType == BossEnum.Rank) {
                Utils.showVipUpConfim();
                return;
            }
            if (info.reCount == NormalModel.getFuncCfgCount(info)) {
                EffectUtils.showTips(GCode(CLEnum.BOSS_FIGHT_FULL));
                return;
            }
            if (PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 1)) {
                var content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, totalPrice) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, info.reBuyAmountCount);
                Utils.showConfirmPop(content, this.onConfirmBuy, this);
            }
        };
        //确认购买
        BossChallView.prototype.onConfirmBuy = function () {
            BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_nType);
        };
        /**获得功能次数 */
        BossChallView.prototype.getFuncInfo = function () {
            switch (this.m_nType) {
                case BossEnum.Single:
                    return NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS);
                case BossEnum.Rank:
                    return NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS);
            }
            return NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS);
        };
        BossChallView.NAME = 'BossChallView';
        return BossChallView;
    }(com_main.CView));
    com_main.BossChallView = BossChallView;
    /**
   * bossItem
   * @class
   * @extends eui.ItemRenderer
   */
    var BossItemRender = /** @class */ (function (_super_1) {
        __extends(BossItemRender, _super_1);
        function BossItemRender() {
            return _super_1.call(this) || this;
        }
        BossItemRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BossItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_bossItem = new com_main.BossChallItem();
            this.addChild(this.m_bossItem);
        };
        BossItemRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (this.m_nType != this.m_tData.type) {
                this.m_nType = this.m_tData.type;
                var state = void 0;
                if (this.m_nType == BossEnum.Single) {
                    state = 'info';
                }
                else if (this.m_nType == BossEnum.Rank) {
                    state = 'rank';
                }
                else {
                    state = 'world';
                }
                this.m_bossItem.currentState = state;
            }
            this.m_bossItem.setItemInfo(this.m_nType, this.m_tData.id);
        };
        return BossItemRender;
    }(eui.ItemRenderer));
    com_main.BossItemRender = BossItemRender;
})(com_main || (com_main = {}));
