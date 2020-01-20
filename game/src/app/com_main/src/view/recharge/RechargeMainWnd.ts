module com_main {
	export interface IRechargeMainWnd {
		activityType: AcViewType;
		bInit: boolean;
		setViewSize(width: number, height: number): void;
		initView(): void;
		refreshView(): void;
	}
	/**
	 * 精彩活动相关
	 */
	export class RechargeMainWnd extends CView {
		public static NAME = 'RechargeMainWnd';

		public m_comTabGroup: com_main.ComTabGroup;
		public m_MainTopNew: com_main.MainTopNew;

		private m_tabViewStack: eui.ViewStack;   //主切卡
		private m_nWidth: number;    //切卡宽度
		private m_nHeight: number;   //切卡高度
		private m_pViews: Array<IRechargeMainWnd> = [];
		public m_nCurWelfareType: AcViewType;

		public constructor(pageType: AcViewType) {
			super();
			this.name = RechargeMainWnd.NAME;
			this.m_nCurWelfareType = pageType || AcViewType.SIGN_CONTIN_DAY;
			this.initApp("pay/recharge/RechargeWndSkin.exml");
		}
		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.S2C_ACTIVITY_GET_TOTAL_PAY_REWARD,
				ProtoDef.S2C_ACTIVITY_GET_SINGLE_PAY_REWARD,
				ProtoDef.S2C_ACTIVITY_GET_CONSUME_GIFT_REWARD,
				ProtoDef.S2C_ACTIVITY_GET_LOGIN_DAYS_REWARD,
				ProtoDef.S2C_ACTIVITY_GET_GROWTH_FUND_REWARD,
				ProtoDef.S2C_ACTIVITY_GET_WEEK_MONTH_CARD_REWARD,
				ProtoDef.S2C_RECHARGE,
			];
		}
		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
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
		}
		public onDestroy(): void {
			this.m_pViews = null;
			super.onDestroy();
			EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this);
			// EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_YU_BUY_SUCC, this);
		}
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
		private refreshRechargeView() {
			for (let i = 0; i < this.m_pViews.length; i++) {
				let view = this.m_pViews[i];
				if (view.activityType == AcViewType.RECHARGE_ADD_UP) {
					view.refreshView();
				}
				if (view.activityType == AcViewType.RECHARGE_SINGLE) {
					view.refreshView();
				}
			}
		}
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
		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_MainTopNew.setResources([PropEnum.YU,PropEnum.GOLD]);
			this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_TITLE));
			EventMgr.addEvent(ActivityEvent.ACTIVITY_RECHARGE_SUCC, this.refreshRechargeView, this);
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
			let width = this.m_tabViewStack.width;
			let height = this.m_tabViewStack.height;
			for (let i = 0; i < this.m_pViews.length; i++) {
				this.m_pViews[i].setViewSize(width, height);
			}

			let index = 0;
			for (let i = 0; i < this.m_pViews.length; i++) {
				let view = this.m_pViews[i];
				if (view.activityType == this.m_nCurWelfareType) {
					index = i;
					break;
				}
			}
			this.m_comTabGroup.setChangeCallback(this.changeTag, this);
			this.m_comTabGroup.validateNow();
			this.m_comTabGroup.selectedIndex = -1;
			this.changeTag(index);
		}

		/**切换当前卡 */
		private changeTag(index: number) {
			this.m_nCurWelfareType = this.m_pViews[index].activityType;
			this.m_tabViewStack.selectedIndex = index;
			this.m_comTabGroup.selectedIndex = index;
			this.m_pViews[index].initView();
		}
		/**添加月卡周卡 */
		private addCardView() {
			let type = AcViewType.CARD_MONTH_WEEK;
			if (!ActivityModel.isOpen(type)) return;
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_CARD) });
			let cardView = new PayCardPanel(type);
			this.m_tabViewStack.addChild(cardView);
			this.m_pViews.push(cardView);

			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_CARD)),
				{ x: 132, y: -5 }, [RedEvtType.CARD_MONTH], 2);
		}
		/**添加单充豪礼 */
		private addRechargeOneView() {
			let type = AcViewType.RECHARGE_SINGLE;
			if (!ActivityModel.isOpen(type)) return;
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_DANBI) });
			let rechargeOne = new PayRechargePanel(type);
			this.m_tabViewStack.addChild(rechargeOne);
			this.m_pViews.push(rechargeOne);

			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_DANBI)),
				{ x: 132, y: -5 }, [RedEvtType.RECHARD_SINGLE], 2);
		}
		/**添加累计充值奖励 */
		private addRechargeAddView() {
			let type = AcViewType.RECHARGE_ADD_UP;
			if (!ActivityModel.isOpen(type)) return;
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_RECHARGE_ALL) });
			let payAwardView = new PayRechargePanel(type);
			this.m_tabViewStack.addChild(payAwardView);
			this.m_pViews.push(payAwardView);

			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_RECHARGE_ALL)),
				{ x: 132, y: -5 }, [RedEvtType.RECHARD_ADD], 2);
		}
		/**添加累计消费奖励 */
		private addRechargeCostView() {
			let type = AcViewType.CONSUME_GIFT;
			if (!ActivityModel.isOpen(type)) return;
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_PAY_ALL) });
			let payCostView = new PayRechargePanel(type);
			this.m_tabViewStack.addChild(payCostView);
			this.m_pViews.push(payCostView);

			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_PAY_ALL)),
				{ x: 132, y: -5 }, [RedEvtType.CONSUME_GIFT], 2);
		}

		/**添加每日登陆活动*/
		private addLoginDayView() {
			let type = AcViewType.SIGN_CONTIN_DAY;
			if (!ActivityModel.isOpen(type)) return;
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_LOGIN_DAIDY) });
			let loginDailyView = new LoginDailyPanel(type);
			this.m_tabViewStack.addChild(loginDailyView);
			this.m_pViews.push(loginDailyView);

			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_LOGIN_DAIDY)),
				{ x: 132, y: -5 }, [RedEvtType.LOGIN_DAY], 2);
		}
		/**添加成长基金 */
		private addGrowFundView() {
			let type = AcViewType.FUND_GROWTH;
			if (!ActivityModel.isOpen(type)) return;
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_GROW) });
			let growView = new GrowFundPanl(type);
			this.m_tabViewStack.addChild(growView);
			this.m_pViews.push(growView);

			RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.AC_GROW)),
				{ x: 132, y: -5 }, [RedEvtType.GROWTH_FUN], 2);
		}

		/**添加直购礼包 */
		private addPurchageGiftBag() {
			let type = AcViewType.PURCHAGE_BAG;
			if (!ActivityModel.isOpen(type)) return;
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.AC_PURCHGE_BAG) });
			let purchageGiftBag = new PurchageGiftBagPanel(type);
			this.m_tabViewStack.addChild(purchageGiftBag);
			this.m_pViews.push(purchageGiftBag);
		}
	}
}