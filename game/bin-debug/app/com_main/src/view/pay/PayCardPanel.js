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
    var CardShopIdType;
    (function (CardShopIdType) {
        /** 周卡*/
        CardShopIdType[CardShopIdType["WEEK_SHOPID"] = 21] = "WEEK_SHOPID";
        /** 月卡*/
        CardShopIdType[CardShopIdType["MONTH_SHOPID"] = 22] = "MONTH_SHOPID";
    })(CardShopIdType || (CardShopIdType = {}));
    /**
     * 周卡月卡
     */
    var PayCardPanel = /** @class */ (function (_super_1) {
        __extends(PayCardPanel, _super_1);
        function PayCardPanel(type) {
            var _this = _super_1.call(this) || this;
            _this.activityType = type;
            _this.skinName = Utils.getSkinName("app/pay/pay_card_panel.exml");
            return _this;
        }
        PayCardPanel.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        PayCardPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        PayCardPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // if (Utils.objectLenght(C.RechargeArwardConfig)) {
            //     error("PayCardPanel:RechargeArwardConfig is empty ======>");
            //     return;
            // }
            this.m_pBtnWeek["sound_queren"] = SoundData.getSureSound();
            this.m_pBtnMonth["sound_queren"] = SoundData.getSureSound();
            this.addEvent();
            this.initView();
        };
        /**初始化界面 */
        PayCardPanel.prototype.initView = function () {
            this.activiVo = ActivityModel.getActivityVo(AcViewType.CARD_MONTH_WEEK);
            if (!this.activiVo)
                return;
            this.weekCfg = this.activiVo.getWeekMonthCfg(0);
            this.monthCfg = this.activiVo.getWeekMonthCfg(1);
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activiVo.viewType + '_jpg');
            this.cardInfoCfgDic = {};
            var shopCfg = C.ActivityWeekMonthCardConfig;
            for (var id in shopCfg) {
                var info = shopCfg[id];
                if (info != null && info != undefined) {
                    this.cardInfoCfgDic[info.cardType] = info;
                }
            }
            this.refreshWeek();
            this.refreshMonth();
        };
        /**设置宽高 */
        PayCardPanel.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //适配
            Utils.toStageBestScaleHeigt(this.m_pCardRoot);
        };
        /** */
        PayCardPanel.prototype.refreshView = function () {
            this.refreshWeek();
            this.refreshMonth();
        };
        /**刷新周卡显示 */
        PayCardPanel.prototype.refreshWeek = function () {
            this.weekState = this.activiVo.getGrowFundBtnRed(CardShopIdType.WEEK_SHOPID);
            this.weekInfoVo = this.activiVo.weekMonthCardInfoDic[CardShopIdType.WEEK_SHOPID];
            var reward = Utils.parseCommonItemJson(this.weekCfg.reward)[0];
            if (this.weekState == ActivityStatus.FINISH) {
                this.m_pBtnWeek.otherLabel = GCode(CLEnum.TAKE_OUT);
                this.m_labWeekDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.weekInfoVo.rewardCount);
            }
            else if (this.weekState == ActivityStatus.REWARD) {
                this.m_labWeekDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.weekInfoVo.rewardCount);
                this.m_pBtnWeek.otherLabel = GCode(CLEnum.AC_RENEW);
            }
            else {
                this.m_pBtnWeek.cost = this.activiVo.rechargeCfgs[0].price;
                this.m_labWeekDay.text = '';
            }
            this.m_pLbWeek.text = reward.count + '';
        };
        /**刷新月卡显示 */
        PayCardPanel.prototype.refreshMonth = function () {
            var MonthPrice = this.activiVo.rechargeCfgs[1].price;
            this.monthState = this.activiVo.getGrowFundBtnRed(CardShopIdType.MONTH_SHOPID);
            this.monthInfoVo = this.activiVo.weekMonthCardInfoDic[CardShopIdType.MONTH_SHOPID];
            var reward = Utils.parseCommonItemJson(this.monthCfg.reward)[0];
            if (this.monthState == ActivityStatus.FINISH) {
                this.m_pBtnMonth.otherLabel = GCode(CLEnum.TAKE_OUT);
                this.m_labMonthDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.monthInfoVo.rewardCount);
            }
            else if (this.monthState == ActivityStatus.REWARD) {
                this.m_pBtnMonth.otherLabel = GCode(CLEnum.AC_RENEW);
                this.m_labMonthDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.monthInfoVo.rewardCount);
            }
            else {
                this.m_labMonthDay.text = '';
                this.m_pBtnMonth.cost = this.activiVo.rechargeCfgs[1].price;
            }
            this.m_pLbMonth.text = reward.count + '';
        };
        /**购买周卡*/
        PayCardPanel.prototype.weekClick = function (e) {
            if (this.weekState == ActivityStatus.FINISH) {
                ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD(this.activiVo.id, this.weekInfoVo.cardType);
            }
            else {
                var cfg = this.activiVo.getWeekRechargeCfg();
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            }
        };
        //周卡二次确认购买
        // private onConfirmYuBuyWeekCard() {
        //     let cfg = this.activiVo.getWeekRechargeCfg();
        //     PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
        // if (PropModel.isItemEnough(PropEnum.YU, this.weekInfo.price, 1)) {
        //     PayProxy.C2S_JADE_BUY(this.cardInfoCfgDic[CardShopIdType.WEEK_SHOPID].cardType);
        //     // UpManager.history();
        // }
        // }
        PayCardPanel.prototype.monthClick = function (e) {
            if (this.monthState == ActivityStatus.FINISH) {
                ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD(this.activiVo.id, this.monthInfoVo.cardType);
            }
            else {
                var cfg = this.activiVo.getMonthRechargeCfg();
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            }
        };
        //周卡二次确认购买
        // private onConfirmYuBuyMonthCard() {
        // let cfg = this.activiVo.getMonthRechargeCfg();
        // PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
        // if (PropModel.isItemEnough(PropEnum.YU, this.monthInfo.price, 1)) {
        //     PayProxy.C2S_JADE_BUY(this.cardInfoCfgDic[CardShopIdType.MONTH_SHOPID].cardType);
        //     // UpManager.history();
        // }
        // }
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        PayCardPanel.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_MOON_CARD, this.onActivityMoonCard, this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnWeek, this, this.weekClick);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnMonth, this, this.monthClick);
        };
        /**移除事件 */
        PayCardPanel.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_MOON_CARD, this);
        };
        /**周卡月卡刷新 */
        PayCardPanel.prototype.onActivityMoonCard = function () {
            this.refreshView();
        };
        return PayCardPanel;
    }(com_main.CView));
    com_main.PayCardPanel = PayCardPanel;
})(com_main || (com_main = {}));
