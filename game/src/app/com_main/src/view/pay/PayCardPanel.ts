module com_main {
    enum CardShopIdType {
        /** 周卡*/
        WEEK_SHOPID = 21,
        /** 月卡*/
        MONTH_SHOPID = 22,
    }
    /**
     * 周卡月卡
     */
    export class PayCardPanel extends CView implements IRechargeMainWnd {
        public m_pCardRoot: eui.Group;
        public m_imgIcon: eui.Image;
        public m_labWeekDay: eui.Label;
        public m_pBtnWeek: com_main.ComPayButton;
        public m_pLbWeek: eui.Label;
        public m_pBtnMonth: com_main.ComPayButton;
        public m_labMonthDay: eui.Label;
        public m_pLbMonth: eui.Label;
        public m_labDesc: com_main.CLabel;

        /**面板类型 */
        public activityType: AcViewType;
        public bInit: boolean;
        public cardInfoCfgDic: { [key: number]: ActivityWeekMonthCardConfig }; //周卡月卡配置
        private activiVo: PayCardVo;
        private monthInfoVo: gameProto.IWeekMonthCardInfo;
        private weekInfoVo: gameProto.IWeekMonthCardInfo;
        private weekState: number;//周卡领奖状态
        private monthState: number;//月卡领奖状态
        private weekCfg: ActivityWeekMonthCardConfig;
        private monthCfg: ActivityWeekMonthCardConfig;

        public constructor(type: AcViewType) {
            super();
            this.activityType = type;
            this.skinName = Utils.getSkinName("app/pay/pay_card_panel.exml");
        }
        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // if (Utils.objectLenght(C.RechargeArwardConfig)) {
            //     error("PayCardPanel:RechargeArwardConfig is empty ======>");
            //     return;
            // }
            this.m_pBtnWeek["sound_queren"] = SoundData.getSureSound();
            this.m_pBtnMonth["sound_queren"] = SoundData.getSureSound();

            this.addEvent();
            this.initView();
        }
        /**初始化界面 */
        public initView() {
            this.activiVo = ActivityModel.getActivityVo<PayCardVo>(AcViewType.CARD_MONTH_WEEK);
            if (!this.activiVo) return;
            this.weekCfg = this.activiVo.getWeekMonthCfg(0);
            this.monthCfg = this.activiVo.getWeekMonthCfg(1);

            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activiVo.viewType + '_jpg');
            this.cardInfoCfgDic = {};
            let shopCfg = C.ActivityWeekMonthCardConfig;
            for (let id in shopCfg) {
                let info = shopCfg[id];
                if (info != null && info != undefined) {
                    this.cardInfoCfgDic[info.cardType] = info;
                }
            }
            this.refreshWeek();
            this.refreshMonth();
        }

        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            //适配
            Utils.toStageBestScaleHeigt(this.m_pCardRoot);
        }
        /** */
        public refreshView() {
            this.refreshWeek();
            this.refreshMonth();
        }

        /**刷新周卡显示 */
        private refreshWeek() {
            this.weekState = this.activiVo.getGrowFundBtnRed(CardShopIdType.WEEK_SHOPID);
            this.weekInfoVo = this.activiVo.weekMonthCardInfoDic[CardShopIdType.WEEK_SHOPID];
            let reward = Utils.parseCommonItemJson(this.weekCfg.reward)[0];
            if (this.weekState == ActivityStatus.FINISH) {
                this.m_pBtnWeek.otherLabel = GCode(CLEnum.TAKE_OUT);
                this.m_labWeekDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.weekInfoVo.rewardCount)
            } else if (this.weekState == ActivityStatus.REWARD) {
                this.m_labWeekDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.weekInfoVo.rewardCount)
                this.m_pBtnWeek.otherLabel = GCode(CLEnum.AC_RENEW);
            } else {
                this.m_pBtnWeek.cost = this.activiVo.rechargeCfgs[0].price;
                this.m_labWeekDay.text = '';
            }
            this.m_pLbWeek.text = reward.count + '';
        }

        /**刷新月卡显示 */
        private refreshMonth() {
            let MonthPrice = this.activiVo.rechargeCfgs[1].price;

            this.monthState = this.activiVo.getGrowFundBtnRed(CardShopIdType.MONTH_SHOPID);
            this.monthInfoVo = this.activiVo.weekMonthCardInfoDic[CardShopIdType.MONTH_SHOPID];
            let reward = Utils.parseCommonItemJson(this.monthCfg.reward)[0];
            if (this.monthState == ActivityStatus.FINISH) {
                this.m_pBtnMonth.otherLabel = GCode(CLEnum.TAKE_OUT);
                this.m_labMonthDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.monthInfoVo.rewardCount);
            } else if (this.monthState == ActivityStatus.REWARD) {
                this.m_pBtnMonth.otherLabel = GCode(CLEnum.AC_RENEW);
                this.m_labMonthDay.text = GCodeFromat(CLEnum.AC_SUR_DAY, this.monthInfoVo.rewardCount);
            } else {
                this.m_labMonthDay.text = '';
                this.m_pBtnMonth.cost = this.activiVo.rechargeCfgs[1].price;
            }

            this.m_pLbMonth.text = reward.count + '';
        }
        /**购买周卡*/
        private weekClick(e: egret.Event): void {
            if (this.weekState == ActivityStatus.FINISH) {
                ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD(this.activiVo.id, this.weekInfoVo.cardType);
            } else {
                 let cfg = this.activiVo.getWeekRechargeCfg();
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            }
        }
        //周卡二次确认购买
        // private onConfirmYuBuyWeekCard() {
        //     let cfg = this.activiVo.getWeekRechargeCfg();
        //     PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            // if (PropModel.isItemEnough(PropEnum.YU, this.weekInfo.price, 1)) {
            //     PayProxy.C2S_JADE_BUY(this.cardInfoCfgDic[CardShopIdType.WEEK_SHOPID].cardType);
            //     // UpManager.history();
            // }
        // }

        private monthClick(e: egret.Event): void {
            if (this.monthState == ActivityStatus.FINISH) {
                ActivityProxy.C2S_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD(this.activiVo.id, this.monthInfoVo.cardType);
            } else {
                let cfg = this.activiVo.getMonthRechargeCfg();
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            }
        }
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
        private addEvent() {
            EventMgr.addEvent(ActivityEvent.ACTIVITY_MOON_CARD, this.onActivityMoonCard, this);
            EventManager.addTouchScaleListener(this.m_pBtnWeek, this, this.weekClick)
            EventManager.addTouchScaleListener(this.m_pBtnMonth, this, this.monthClick)
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_MOON_CARD, this);
        }

        /**周卡月卡刷新 */
        private onActivityMoonCard() {
            this.refreshView();
        }

    }

}