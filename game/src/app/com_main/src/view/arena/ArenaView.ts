module com_main {
	export class ArenaView extends CView {
		public static NAME = 'ArenaView';

		public BackGround: com_main.CImage;
		public m_MainTopNew: com_main.MainTopNew;
		public bottom_background: com_main.CImage;
		public Bottom: eui.Group;
		public txt_label: com_main.CLabel;
		public m_BtnMoppingUp: com_main.ComButton;
		public m_BtnEmbattle: com_main.ComButton;
		public m_BtnBattle: com_main.ComButton;
		public m_imgShop: eui.Image;
		public m_Scroller: eui.Scroller;
		public m_ItemList: eui.List;


		/** 当前擂台列表数据 */
		private m_DataArray: eui.ArrayCollection;

		public constructor() {
			super();
			this.name = ArenaView.NAME;
			this.initApp("arena/arena_team_setting_view.exml");
		}

		public onDestroy() {
			super.onDestroy();
			// MainMap.moveToArenaUI();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_MainTopNew.setTitleName(GCode(CLEnum.CHALL))
			this.m_BtnEmbattle.setTitleLabel(GCode(CLEnum.CAMP));
			this.m_BtnBattle.setTitleLabel(GCode(CLEnum.CHALL_FIGHT));
			this.m_BtnMoppingUp.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
			// this.m_BtnReset.setTitleLabel(GCode(CLEnum.CAMP_RESET));
			this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.CONQUER]);
			EventManager.addTouchScaleListener(this.m_BtnBattle, this, this.onBtnBattle);
			EventManager.addTouchScaleListener(this.m_BtnEmbattle, this, this.onBtnEmbattle);
			EventManager.addTouchScaleListener(this.m_BtnMoppingUp, this, this.onBtnMoppingUp);
			// EventManager.addTouchScaleListener(this.m_BtnReset, this, this.onBtnReset);
			EventManager.addTouchScaleListener(this.m_imgShop, this, this.onImgShop);
			this.RefreshFreeResetTimes();
			this.InitScroller();


			ArenaProxy.send_ArenaId();
			ArenaProxy.send_ARENA_REWARD_LIST();
		}


		private InitScroller() {
			this.m_DataArray = new eui.ArrayCollection;
			for (let key in C.ArenaConfig) {
				let cfg = C.ArenaConfig[key];
				this.m_DataArray.addItem({ cfg: cfg });
			}

			this.m_ItemList.dataProvider = this.m_DataArray;
			this.m_ItemList.itemRenderer = ArenaContentRender;

			this.validateNow();
			this.updateScrollItemPos();
		}

		/**刷新位置 */
		private updateScrollItemPos() {
			let itemMax = this.m_ItemList.contentWidth - this.m_ItemList.scrollRect.width;
			let itemIndex = ArenaModel.arenaId - 1;
			//item长度 320  间隙 30
			let scrollH = itemIndex * (320 + 30);
			scrollH = scrollH - this.m_ItemList.scrollRect.width / 2 + 160;
			scrollH = scrollH > 0 ? scrollH : 0;
			scrollH = scrollH < itemMax ? scrollH : itemMax;
			this.m_ItemList.scrollH = scrollH;
		}
		/** 按钮 -跳转商城 */
		private onImgShop() {
			UpManager.history()
			ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.CONQUER);
		}

		/** 按钮 - 布阵 */
		private onBtnEmbattle() {
			Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.ARENA });
		}

		/** 按钮 - 闯关 */
		private onBtnBattle() {

			if (TeamModel.isEmptyTeamPVE()) {
				Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.ARENA });
				return;
			}
			ArenaProxy.send_ENTER_ARENA_BATTLE(1);
		}

		// /** 按钮 - 重置 */
		// private onBtnReset() {
		// 	if (ArenaModel.arenaId == 1) {
		// 		let tip: string = GCode(CLEnum.CHALL_RESET_FAL);
		// 		PromtTipsView.getInstance().showTip(tip, PromtTipsView.getInstance().clearPrompt, this);
		// 		return;
		// 	}

		// 	if (ArenaModel.freeResetTimes > 0) {
		// 		ArenaProxy.send_ARENA_RESET();
		// 	}
		// 	else {
		// 		let coinNum: number = ConstUtil.getValue(IConstEnum.RESET_CONSUME);
		// 		if (RoleData.gold >= coinNum) {
		// 			let tip: string = GCodeFromat(CLEnum.CHALL_RESET_SURE, coinNum);
		// 			PromtTipsView.getInstance().showPrompt(tip, () => ArenaProxy.send_ARENA_RESET(), this, () => PromtTipsView.getInstance().clearPrompt(), true, GCode(CLEnum.CHALL_RESET));
		// 		}
		// 		else {
		// 			let tip: string = GCodeFromat(CLEnum.CHALL_RESET_FAL1, coinNum, coinNum);
		// 			PromtTipsView.getInstance().showTip(tip, null, this);
		// 		}
		// 		/** 扣金币 */
		// 	}
		// }

		/** 按钮 - 扫荡 */
		private onBtnMoppingUp() {
			if (ArenaModel.canMoppingUp) {
				if (ArenaModel.getMaxId() >= 6) {
					ArenaProxy.send_CLEAN_UP_ARENA_BATTLE();
				} else {
					EffectUtils.showTips(GCode(CLEnum.CHALL_FIGHT_FAL3));
				}
			}
			else {
				let tip: string = GCode(CLEnum.CHALL_RESET_FAL2);
				PromtTipsView.getInstance().showTip(tip, PromtTipsView.getInstance().clearPrompt, this);
			}
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.ENTER_ARENA_BATTLE,
				ProtoDef.ARENA_ID,
				ProtoDef.CLEAN_UP_ARENA_BATTLE,
				ProtoDef.ARENA_RESET,
				ProtoDef.ARENA_REWARD_LIST,
				ProtoDef.ARENA_GET_REWARD,
			];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {

				case ProtoDef.ARENA_ID: {
					this.RefreshView();
					break;
				}

				case ProtoDef.CLEAN_UP_ARENA_BATTLE:
				case ProtoDef.ARENA_RESET: {
					this.RefreshView();
					break;
				}
				//奖励领取
				case ProtoDef.ARENA_REWARD_LIST:
				case ProtoDef.ARENA_GET_REWARD: {
					this.RefreshView();
					break;
				}

			}
		}

		private RefreshView() {
			this.RefreshScroller();
			this.RefreshFreeResetTimes();
		}

		private RefreshScroller() {
			for (let item of this.m_ItemList.$children) {
				let itemEx: ArenaContentRender = item as ArenaContentRender;
				itemEx.Refresh();
			}
			this.updateScrollItemPos();
		}

		private RefreshFreeResetTimes() {
			this.m_BtnBattle.gray = !ArenaModel.arenaId ? true : false;
			this.m_BtnBattle.touchEnabled = !ArenaModel.arenaId ? false : true;
			// this.m_TxtFreeTimes.text = ArenaModel.freeResetTimes.toString();
			// // debug(ArenaModel.freeResetTimes + " " + ArenaModel.freeResetTimes.toString() + " " + this.m_TxtFreeTimes.text)
		}

	}
}