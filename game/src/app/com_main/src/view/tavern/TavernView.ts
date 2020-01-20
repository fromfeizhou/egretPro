module com_main {
	export class TavernView extends CView {

		public static NAME = 'TavernView';
		/** 按钮 - 顶部导航栏 */
		public m_pViewRoot: eui.Group;
		public m_BuyOneTimes: eui.Group;
		public m_labFree: com_main.CLabel;
		public m_pCostOne: eui.Group;
		public m_BuyTenTimes: eui.Group;
		public m_extral: eui.Label;
		public m_labRare: com_main.CLabel;
		public m_pcheckRoot: eui.Group;
		public m_pBtnInfo: eui.Group;
		public m_pBtnSafety: eui.Group;
		public m_pEffRoot: eui.Group;
		public m_proRoot: eui.Group;
		public m_proHB: com_main.ComProRdBar;
		public m_pScore: eui.Label;
		public m_pBtnCall: com_main.ComButton;
		public m_MainTopNew: com_main.MainTopNew;


		private m_effect: MCDragonBones;  //红品质特效
		private m_currSorce: number;//当前积分
		private m_freeNum: number = 0;    //免费招募次数
		private m_MaxSorce: number;//积分上限

		public constructor() {
			super();
			this.name = TavernView.NAME;
			this.initApp("tavern/tavern_view.exml");
		}

		protected listenerProtoNotifications(): any[] {
			return [
				ProtoDef.TAVERN_INFO,
				ProtoDef.TAVERN_ATTRACT,
			];
		}

		/**处理协议号事件 */
		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.TAVERN_INFO: {
					let data = body as gameProto.ITavernInfoResp;
					this.refresh_CurTicketNum();
					this.refreshAwardNum(data.attractNum);
					this.refresh_CurFreeNum(data.freeAttract);
					this.refreshSafetyNum(data.score);
					this.m_currSorce = data.score;
					break;
				}
				case ProtoDef.TAVERN_ATTRACT: {
					let data = body as gameProto.TavernAttractResp;
					Utils.open_view(TASK_UI.TAVERN_INFO_PANEL, data);
					break;
				}
			}
		}

		public static m_Anim_OutFrame: SpriteAnimation
		public static m_Anim_Top: SpriteAnimation

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_labFree.visible = false;
			this.m_MainTopNew.setTitleName(GCode(CLEnum.TAVEN));
			this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.ZML]);
			this.m_pBtnCall.setTitleLabel(GCode(CLEnum.TAVEN_SAFETY_BTN));
			this.m_MaxSorce = ConstUtil.getValue(IConstEnum.TAVERN_EXCHANGE_SCORE);

			EventManager.addTouchScaleListener(this.m_BuyOneTimes, this, this.onclickTavernOne);
			EventManager.addTouchScaleListener(this.m_BuyTenTimes, this, this.onclickTavernTen);
			EventManager.addTouchScaleListener(this.m_pcheckRoot, this, this.onclickCheck);
			EventManager.addTouchScaleListener(this.m_pBtnInfo, this, this.onclickInfo);
			EventManager.addTouchScaleListener(this.m_pBtnSafety, this, this.openSafety);
			EventManager.addTouchScaleListener(this.m_pBtnCall, this, this.onclickCall);

			this.createGeneralEffect();
			this.refreshAwardNum(10);
			this.refreshRare();
			if (TavernView.m_Anim_OutFrame == null)
				TavernView.m_Anim_OutFrame = ImageEffect.load_2(IETypes.EUI_Tavern_OutFrame);

			if (TavernView.m_Anim_Top == null)
				TavernView.m_Anim_Top = ImageEffect.load_2(IETypes.EUI_Tavern_Top);

			this.refresh_CurTicketNum();
			//弄一下分辨率

			TavernProxy.send_TAVERN_INFO();
			/**红点监听 */
			RedPointModel.AddInfoListener(this.m_BuyOneTimes, { x: 232, y: -2 }, [RedEvtType.TANVERN], 2, { tavenType: 0 });
			RedPointModel.AddInfoListener(this.m_BuyTenTimes, { x: 232, y: -2 }, [RedEvtType.TANVERN], 2, { tavenType: 1 });

			Utils.toStageBestScale(this.m_pViewRoot);

			/**检查新手引导面板条件 */
			this.onGuideCondition();
		}

		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListener(this.m_BuyOneTimes);
			EventManager.removeEventListener(this.m_BuyTenTimes);
			EventManager.removeEventListener(this.m_pcheckRoot);
			EventManager.removeEventListener(this.m_pBtnInfo);
			EventManager.removeEventListener(this.m_pBtnSafety);
			EventManager.removeEventListener(this.m_pBtnCall);

			if (TavernView.m_Anim_OutFrame != null) {
				TavernView.m_Anim_OutFrame.removeAction();
				TavernView.m_Anim_OutFrame = null;
			}
			if (TavernView.m_Anim_Top != null) {
				TavernView.m_Anim_Top.removeAction();
				TavernView.m_Anim_Top = null;
			}
			this.clearGeneralEffect();

			//清理模块资源 最后调用 避免龙骨动画没有执行destroy
			DragonBonesManager.cleanDragonBones([IETypes.EUI_GeneralGetCard]);
			SceneResGroupCfg.clearModelRes([ModuleEnums.TAVERN]);
		}
		/**预览 */
		private onclickCheck() {
			Utils.open_view(TASK_UI.TAVERN_CHECK_PANEL);
		}
		/**规则 */
		private onclickInfo() {
			Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.TAVEN_TIPS), title: GCode(CLEnum.TAVEN) });
		}
		/**召唤按钮 */
		private onclickCall() {
			if (this.m_currSorce < this.m_MaxSorce) return;
			TavernProxy.C2S_SCORE_EXCHANGE();
		}
		/**保底召唤*/
		private openSafety() {
			Utils.open_view(TASK_UI.TAVERN_SAFETY_PANEL, this.m_currSorce);
		}
		/**招募一次 */
		public onclickTavernOne() {
			if (this.m_freeNum > 0) {
				TavernProxy.send_TAVERN_ATTRACT(0);
				return;
			}
			if (RoleData.recruit >= 1) {
				TavernProxy.send_TAVERN_ATTRACT(0);
			}
			else {
				Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { itemId: PropEnum.ZML, buyType: 0 });

			}
		}
		/**招募十次 */
		public onclickTavernTen() {
			if (RoleData.recruit >= 9) {
				TavernProxy.send_TAVERN_ATTRACT(1);
			}
			else {
				//let buyTicketNum = 10 - this._ticketNum;
				// if (RoleData.gold >= coinNum * buyTicketNum) {
				// let tip: string = format(this._noticeStrFormat, coinNum * buyTicketNum, buyTicketNum);
				// let view = new com_main.ConfirmPop(tip, null, null, () => TavernProxy.send_TAVERN_ATTRACT(1), null, this);
				// UpManager.popSmallView(view, null, false);
				Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { itemId: PropEnum.ZML, buyType: 1 });
			}
		}
		public refresh_CurTicketNum() {
			// this.m_TicketNum.text = this._ticketNum.toString();
		}
		public refresh_CurFreeNum(free: number) {
			this.m_freeNum = free;
			this.m_labFree.visible = free <= 0 ? false : true;
			this.m_pCostOne.visible = free <= 0 ? true : false;
		}
		/**刷新次数 */
		public refreshAwardNum(num: number) {
			num = 10 - num;
			this.m_extral.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TAVEN_TIPS_EW, num));
		}
		/**刷新保底积分 */
		public refreshSafetyNum(num: number) {
			this.m_pScore.text = num + '/' + this.m_MaxSorce;
			this.m_proHB.progress = num / this.m_MaxSorce;

			this.m_proRoot.visible = num < this.m_MaxSorce ? true : false;
			this.m_pBtnCall.visible = !this.m_proRoot.visible;

		}
		/**刷新稀有武将 */
		public refreshRare() {
			this.m_labRare.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TAVEN_TIPS_EW2, "VIP4"));
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.TAV_WND);
		}


		//=============================================================================================================================================
		//特效 begin
		//============================================================================================================================================= 
		/**设置红品质特效 */
		private createGeneralEffect() {
			if (this.m_effect) return;
			this.m_effect = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
			this.m_pEffRoot.addChild(this.m_effect);
		}
		private clearGeneralEffect() {
			if (this.m_effect) {
				NormalMcMgr.removeMc(this.m_effect);
				this.m_effect = null;
			}
		}
		//=============================================================================================================================================
		//特效 end
		//============================================================================================================================================= 
	}

}