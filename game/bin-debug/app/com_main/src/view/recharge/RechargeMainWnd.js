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
     * 精彩活动相关
     */
    var RechargeMainWnd = /** @class */ (function (_super_1) {
        __extends(RechargeMainWnd, _super_1);
        function RechargeMainWnd(pageType) {
            var _this = _super_1.call(this) || this;
            _this.m_pViews = [];
            _this.name = RechargeMainWnd.NAME;
            _this.m_nCurWelfareType = pageType || AcViewType.SIGN_CONTIN_DAY;
            _this.initApp("pay/recharge/RechargeWndSkin.exml");
            return _this;
        }
        RechargeMainWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD,
                ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD,
                ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD,
                ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD,
                ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD,
                ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD,
                ProtoDef.S2C_RECHARGE,
            ];
        };
        /**处理协议号事件 */
        RechargeMainWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                // case ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD: {//累计充值领取奖励
                // 	let data = body as gameProto.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD;
                // 	if (data.activityAward.resultCode == 0)
                // 		this.refreshView(data.activityAward.avtivityId);
                // 	break;
                // }
                // case ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD: {//单笔充值领取奖励
                // 	let data = body as gameProto.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD;
                // 	if (data.activityAward.resultCode == 0)
                // 		this.refreshView(data.activityAward.avtivityId);
                // 	break;
                // }
                // case ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD: {//消费好礼领取奖励
                // 	let data = body as gameProto.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD;
                // 	if (data.activityAward.resultCode == 0) this.refreshView(data.activityAward.avtivityId);
                // 	break;
                // }
                // case ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD: {//每日登录领取奖励
                // 	let data = body as gameProto.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD;
                // 	if (data.activityAward.resultCode == 0) this.refreshView(data.activityAward.avtivityId);
                // 	break;
                // }
                // case ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD: {//基金领取奖励
                // 	let data = body as gameProto.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD;
                // 	if (data.activityAward.resultCode == 0) this.refreshView(data.activityAward.avtivityId);
                // 	break;
                // }
                // case ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD: {//周卡月卡领取奖励
                // 	let data = body as gameProto.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD;
                // 	if (data.activityAward.resultCode == 0) this.refreshView(data.activityAward.avtivityId);
                // 	break;
                // }
                // case ProtoDef.S2C_RECHARGE: {//直购礼包
                // 	let data = body as gameProto.S2C_RECHARGE;
                // 	this.refreshPurchageGiftView();
                // 	this.showAward(data.id)
                // 	break;
                // }
            }
        };
        RechargeMainWnd.prototype.onDestroy = function () {
            this.m_pViews = null;
            _super_1.prototype.onDestroy.call(this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this);
            // EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_YU_BUY_SUCC, this);
        };
        // private refreshView(activityid: number) {
        // 	let actCfg = C.ActivityConfig[activityid];
        // 	for (let i = 0; i < this.m_pViews.length; i++) {
        // 		let view = this.m_pViews[i];
        // 		if (view.activityType == actCfg.activityType) {
        // 			view.refreshView();
        // 			break;
        // 		}
        // 	}
        // }
        /**充值完成刷新单笔和累计充值 */
        RechargeMainWnd.prototype.refreshRechargeView = function () {
            for (var i = 0; i < this.m_pViews.length; i++) {
                var view = this.m_pViews[i];
                if (view.activityType == AcViewType.RECHARGE_ADD_UP) {
                    view.refreshView();
                }
                if (view.activityType == AcViewType.RECHARGE_SINGLE) {
                    view.refreshView();
                }
            }
        };
        /**勾玉购买刷新 */
        // private refreshGoYuView(shopType:number) {
        // 	for (let i = 0; i < this.m_pViews.length; i++) {
        // 		let view = this.m_pViews[i];
        // 		if (view.activityType == shopType) {
        // 			view.refreshView();
        // 		}
        // 	}
        // }
        // /**刷新直购礼包 */
        // private refreshPurchageGiftView() {
        // 	for (let i = 0; i < this.m_pViews.length; i++) {
        // 		let view = this.m_pViews[i];
        // 		if (view.activityType == AcViewType.PURCHAGE_BAG) {
        // 			view.refreshView();
        // 		}
        // 	}
        // }
        RechargeMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setResources([PropEnum.YU, PropEnum.GOLD]);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_TITLE));
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this.refreshRechargeView, this);
            // EventMgr.addEvent(ActivityEvent.ACTIVITY_YU_BUY_SUCC, this.refreshGoYuView, this);
            this.validateNow();
            this.addLoginDayView();
            this.addCardView();
            this.addRechargeOneView();
            this.addRechargeAddView();
            this.addGrowFundView();
            this.addPurchageGiftBag();
            this.addRechargeCostView();
            //强制渲染一次 获取宽高
            // this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            for (var i = 0; i < this.m_pViews.length; i++) {
                this.m_pViews[i].setViewSize(width, height);
            }
            var index = 0;
            for (var i = 0; i < this.m_pViews.length; i++) {
                var view = this.m_pViews[i];
                if (view.activityType == this.m_nCurWelfareType) {
                    index = i;
                    break;
                }
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(index);
        };
        /**切换当前卡 */
        RechargeMainWnd.prototype.changeTag = function (index) {
            this.m_nCurWelfareType = this.m_pViews[index].activityType;
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_pViews[index].initView();
        };
        /**添加月卡周卡 */
        RechargeMainWnd.prototype.addCardView = function () {
            var type = AcViewType.CARD_MONTH_WEEK;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_CARD) });
            var cardView = new com_main.PayCardPanel(type);
            this.m_tabViewStack.addChild(cardView);
            this.m_pViews.push(cardView);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_CARD)), { x: 132, y: -5 }, [RedEvtType.CARD_MONTH], 2);
        };
        /**添加单充豪礼 */
        RechargeMainWnd.prototype.addRechargeOneView = function () {
            var type = AcViewType.RECHARGE_SINGLE;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_DANBI) });
            var rechargeOne = new com_main.PayRechargePanel(type);
            this.m_tabViewStack.addChild(rechargeOne);
            this.m_pViews.push(rechargeOne);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_DANBI)), { x: 132, y: -5 }, [RedEvtType.RECHARD_SINGLE], 2);
        };
        /**添加累计充值奖励 */
        RechargeMainWnd.prototype.addRechargeAddView = function () {
            var type = AcViewType.RECHARGE_ADD_UP;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_RECHARGE_ALL) });
            var payAwardView = new com_main.PayRechargePanel(type);
            this.m_tabViewStack.addChild(payAwardView);
            this.m_pViews.push(payAwardView);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_RECHARGE_ALL)), { x: 132, y: -5 }, [RedEvtType.RECHARD_ADD], 2);
        };
        /**添加累计消费奖励 */
        RechargeMainWnd.prototype.addRechargeCostView = function () {
            var type = AcViewType.CONSUME_GIFT;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_PAY_ALL) });
            var payCostView = new com_main.PayRechargePanel(type);
            this.m_tabViewStack.addChild(payCostView);
            this.m_pViews.push(payCostView);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_PAY_ALL)), { x: 132, y: -5 }, [RedEvtType.CONSUME_GIFT], 2);
        };
        /**添加每日登陆活动*/
        RechargeMainWnd.prototype.addLoginDayView = function () {
            var type = AcViewType.SIGN_CONTIN_DAY;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_LOGIN_DAIDY) });
            var loginDailyView = new com_main.LoginDailyPanel(type);
            this.m_tabViewStack.addChild(loginDailyView);
            this.m_pViews.push(loginDailyView);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_LOGIN_DAIDY)), { x: 132, y: -5 }, [RedEvtType.LOGIN_DAY], 2);
        };
        /**添加成长基金 */
        RechargeMainWnd.prototype.addGrowFundView = function () {
            var type = AcViewType.FUND_GROWTH;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_GROW) });
            var growView = new com_main.GrowFundPanl(type);
            this.m_tabViewStack.addChild(growView);
            this.m_pViews.push(growView);
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_GROW)), { x: 132, y: -5 }, [RedEvtType.GROWTH_FUN], 2);
        };
        /**添加直购礼包 */
        RechargeMainWnd.prototype.addPurchageGiftBag = function () {
            var type = AcViewType.PURCHAGE_BAG;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_PURCHGE_BAG) });
            var purchageGiftBag = new com_main.PurchageGiftBagPanel(type);
            this.m_tabViewStack.addChild(purchageGiftBag);
            this.m_pViews.push(purchageGiftBag);
        };
        RechargeMainWnd.NAME = 'RechargeMainWnd';
        return RechargeMainWnd;
    }(com_main.CView));
    com_main.RechargeMainWnd = RechargeMainWnd;
})(com_main || (com_main = {}));
