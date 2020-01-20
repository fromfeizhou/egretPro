module com_main {
	export class ActivityCtrl extends AGame.Controller {
		public constructor() {
			super();
		}

		public listenerRouterNotifications() {
			return [
				[TASK_UI.POP_ACTIVITY_REPEAT, ActivityCtrl],		//循环活动
				[TASK_UI.POP_ACTIVITY_ONLINE_REWARD, ActivityCtrl],		//在线时长奖励
				[TASK_UI.POP_ACTIVITY_SEVEN_DAY, ActivityCtrl],		//在线时长奖励
				[TASK_UI.POP_ACTIVITY_ADD_RECHARGE, ActivityCtrl],   //精彩活动
				[TASK_UI.POP_PAY_First_VIEW, ActivityCtrl],   //首充
				[TASK_UI.POP_KING_VIEW, ActivityCtrl],   //封王战
				[TASK_UI.POP_ACTIVITY_BAR_ATK, ActivityCtrl],   //n南蛮入侵
				[TASK_UI.POP_ACTIVITY_ONE_GIFT_BAG, ActivityCtrl],   //n一元礼包
				[TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE, ActivityCtrl],   //襄阳战预告
				[TASK_UI.POP_ACTIVITY_EMPEROR_DETAILS, ActivityCtrl],   //襄阳战战况
				[TASK_UI.POP_ACTIVITY_EMPEROR_RANK, ActivityCtrl],   	//襄阳战杀敌排行榜
				[TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION, ActivityCtrl],   //襄阳战皇帝登基
				[TASK_UI.POP_ACTIVITY_TURNTABLE, ActivityCtrl],   //幸运转盘
				[TASK_UI.POP_ACTIVITY_NEW_GENERAL, ActivityCtrl],   //新武将拜访
				[TASK_UI.POP_ACTIVITY_SELECT_REWARD, ActivityCtrl],   //选择物品奖励
				[TASK_UI.POP_ACTIVITY_SEVENII, ActivityCtrl],   //新7天活动
				[TASK_UI.POP_ACTIVITY_NEWYAER, ActivityCtrl],   //新春活动


			];
		}

		public execute(notification: AGame.INotification) {
			let name = notification.getName();
			let body = notification.getBody();
			switch (name) {
				case TASK_UI.POP_ACTIVITY_REPEAT: {//循环活动
					SceneManager.openView("com_main.RepeatActivityWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_ONLINE_REWARD: {//在线时长奖励
					SceneManager.openView("com_main.OnlineWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_SEVEN_DAY: {//七日
					SceneManager.openView("com_main.SevenDayActivityPanel", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_ADD_RECHARGE: {//精彩活动
					SceneManager.openView("com_main.RechargeMainWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					break;
				}
				case TASK_UI.POP_PAY_First_VIEW: {//首充
					SceneManager.openView("com_main.PayFirstView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}

				case TASK_UI.POP_KING_VIEW: {//封王战
					SceneManager.openView("com_main.KingBattleView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_BAR_ATK: {//n南蛮入侵
					SceneManager.openView("com_main.BarAttackWnd", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_ONE_GIFT_BAG: {//n一元礼包
					SceneManager.openView("com_main.OneGiftBagView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_EMPEROR_ADVANCE: {//襄阳战预告
					SceneManager.openView("com_main.EmperorBattleAdvanceView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_EMPEROR_DETAILS: {//襄阳战战况
					SceneManager.openView("com_main.EmperorBattleDetailsWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_EMPEROR_RANK: {//襄阳战杀敌排行榜
					SceneManager.openView("com_main.KillRankWnd", body, null, UpManager.STYLE_MAIN_FULL, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION: {//襄阳战皇帝登基
					SceneManager.openView("com_main.EmperorBattleCoronationView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_TURNTABLE: {//幸运转盘
					SceneManager.openView("com_main.TurnTableWnd", body, null, UpManager.STYLE_MAIN_FULL, false, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_NEW_GENERAL: {   //新武将拜访界面
					SceneManager.openView("com_main.NewGeneralView", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_SELECT_REWARD: { //选取物品
					SceneManager.openView("com_main.SelectRewardView", body, null, UpManager.STYLE_UP, true, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_SEVENII: { //新7天活动
					SceneManager.openView("com_main.SevenIIWnd", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
				case TASK_UI.POP_ACTIVITY_NEWYAER: { //新春活动
					SceneManager.openView("com_main.NewYearWnd", body, null, UpManager.STYLE_UP, false, false);
					break;
				}
			}
		}
	}
}