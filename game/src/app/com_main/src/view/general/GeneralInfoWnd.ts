//武将详细信息表
module com_main {
	export class GeneralInfoWnd extends CView {

		public static NAME = "GeneralInfoWnd";

		public m_pViewRoot: eui.Group;
		public m_tabViewStack: eui.ViewStack;
		public m_comTabTopGroup: com_main.ComTabTopGroup;
		public m_imgGeneralCardBg: eui.Image;
		public m_genCard: com_main.GeneralSliderRende;
		public btn_left: eui.Group;
		public btn_right: eui.Group;
		public m_mainTop: com_main.MainTopNew;

		private m_generalId: number;
		private m_generalVo: GeneralVo;


		private m_nTagIndex: number;		//默认切卡
		private m_tabBtnState: number;		//切卡表现状态

		private m_tTagInfo: { [key: string]: { viewId: number, guideId: IGUIDECD } }	//根据名字 记录显示卡顺序
		private m_tabViews: GeneralBaseView[];
		private m_tabAttri: GeneralAttriView;
		private m_tabStreng: GeneralStrengView;
		private m_tabSkill: GeneralSkillView;
		private m_tabTrea: GeneralTreaView;

		private sliderIndex = 0;
		private sliderList = [];

		private m_nTabOldTime: number;	//切卡时间
		private m_gSound: number;  //音效

		public constructor(param?: any) {
			super();
			this.name = GeneralInfoWnd.NAME;
			this.initViewData(param);
			this.initApp("general/GeneralInfoWndSkin.exml");
			this.m_gSound = GeneralModel.getGeneralSoundByGeneralID(this.m_generalId);
			Sound.playGeneralSoundByID(this.m_gSound);
		}

		private initViewData(param?: any) {
			this.m_generalId = param.generalId || GeneralModel.getGeneralDefaut();
			this.m_nTagIndex = param.tag || 1;
			if (this.m_generalId) {
				this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
				if (this.m_generalVo.own) {
					this.sliderList = param.ownList || GeneralModel.getOwnGenIds();

				} else {
					this.sliderList = param.noList || [this.m_generalId];
				}
				for (let i in this.sliderList) {
					if (this.m_generalId == this.sliderList[i]) {
						this.sliderIndex = Number(i);
					}
				}
			}
		}

		protected listenerProtoNotifications(): any[] {
			return [ProtoDef.GENERAL_USE_EXP_BOOK, ProtoDef.GENERAL_UP_STAR, ProtoDef.RECRUITED_GENERAL,
			ProtoDef.OPEN_SKILL, ProtoDef.GENERAL_TREASURE_WEAR, ProtoDef.GENERAL_UPGRADE];
		}

		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.RECRUITED_GENERAL: {
					let data = body as  gameProto.IRecruitedGeneralResp;
					if(data.generalInfo.generalId != this.m_generalId) return;
					this.refreshTabBtns();
					this.refreshInfo();
					break;
				}
				case ProtoDef.GENERAL_USE_EXP_BOOK: {
					this.refreshLevelInfo();
					break;
				}

				case ProtoDef.GENERAL_UP_STAR: {
					this.refreshStarInfo();
					break;
				}
				case ProtoDef.OPEN_SKILL: {
					this.refreshSkillInfo();
					break;
				}
				//宝物装备
				case ProtoDef.GENERAL_TREASURE_WEAR: {
					this.refreshTreasureInfo();
					break;
				}
				//突破
				case ProtoDef.GENERAL_UPGRADE: {
					this.refreshTuPoInfo();
					break;
				}
			}
		}

		public onDestroy(): void {
			this.removeEvent();
			super.onDestroy();
			Sound.stopGeneralSoundByID(this.m_gSound);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_mainTop.setTitleName(GCode(CLEnum.GEN_TITLE_WJXX));
			this.m_mainTop.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

			this.m_tTagInfo = {
				[GCode(CLEnum.GEN_ATTR)]: { viewId: 0, guideId: -1 },
				[GCode(CLEnum.GEN_STRENG)]: { viewId: 1, guideId: IGUIDECD.GEN_TAB_UP },
				[GCode(CLEnum.GEN_SKILL)]: { viewId: 2, guideId: IGUIDECD.GEN_TAB_SKILL },
				[GCode(CLEnum.GEN_TREA)]: { viewId: 3, guideId: IGUIDECD.GEN_TAB_TREA },
			}
			this.refreshTabBtns();
			this.validateNow();
			let width = this.m_tabViewStack.width;
			let height = this.m_tabViewStack.height;

			this.m_tabAttri = new GeneralAttriView(width, height);
			this.m_tabViewStack.addChild(this.m_tabAttri);

			this.m_tabStreng = new GeneralStrengView(width, height);
			this.m_tabViewStack.addChild(this.m_tabStreng);

			this.m_tabSkill = new GeneralSkillView(width, height);
			this.m_tabViewStack.addChild(this.m_tabSkill);

			this.m_tabTrea = new GeneralTreaView(width, height);
			this.m_tabViewStack.addChild(this.m_tabTrea);

			this.m_tabViews = [];
			this.m_tabViews.push(this.m_tabAttri);
			this.m_tabViews.push(this.m_tabStreng);
			this.m_tabViews.push(this.m_tabSkill);
			this.m_tabViews.push(this.m_tabTrea);

			this.refreshInfo();
			this.changeContentTag(this.m_nTagIndex);

			this.addEvent();

			Utils.toStageBestScale(this.m_pViewRoot);

			this.m_nTabOldTime = TimerUtils.getServerTime();
			/**检查新手引导面板条件 */
			this.onGuideCondition();
		}

		/**刷新切卡 */
		private refreshTabBtns() {
			if (this.m_generalVo) {
				let curState = this.m_generalVo.isOwn ? 0 : 1;
				if (curState == this.m_tabBtnState) return;
				this.m_tabBtnState = curState;
				this.m_comTabTopGroup.clearTabBtn();
				let tags = [GCode(CLEnum.GEN_ATTR)];
				if (curState == 0) {
					if (FunctionModel.isFunctionOpen(FunctionType.GENERAL_LEVELUP) || FunctionModel.isFunctionOpen(FunctionType.GENERAL_STAR)) {
						tags.push(GCode(CLEnum.GEN_STRENG));
					}
					if (FunctionModel.isFunctionOpen(FunctionType.GENERAL_SKILL)) {
						tags.push(GCode(CLEnum.GEN_SKILL));
					}
					if (FunctionModel.isFunctionOpen(FunctionType.GENERAL_TREASURE)) {
						tags.push(GCode(CLEnum.GEN_TREA));
					}
				}
				this.m_comTabTopGroup.initNorTabBtns(tags);
			}

		}

		/**只刷新当前页内容( 减少 切卡处理刷新页面 提高性能) */
		private refreshCurTab() {
			let info = this.m_tTagInfo[this.m_comTabTopGroup.selName];
			let view = this.m_tabViews[info.viewId];
			view.generalId = this.m_generalId;
		}

		public refreshInfo() {
			//刷新英雄图片
			this.m_imgGeneralCardBg.source = GeneralModel.getSoldierQualityBigLogoBg(this.m_generalVo.qualityLevel);
			this.m_genCard.generalId = this.m_generalId;

			if (this.m_generalVo.own) {
				this.m_comTabTopGroup.touchEnabled = true;
				this.m_comTabTopGroup.touchChildren = true;
				this.refreshCurTab();
			} else {
				//刷新属性部分
				this.m_comTabTopGroup.touchEnabled = false;
				this.m_comTabTopGroup.touchChildren = false;
				this.refreshCurTab();
			}
			this.initRedPointEvt();
		}

		/**红点 */
		private initRedPointEvt() {
			if (this.m_generalVo && this.m_generalVo.isOwn) {
				RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabTopGroup.getTabBtnByName(GCode(CLEnum.GEN_STRENG)), { x: 118, y: -3 }, [RedEvtType.GEN_STAR, RedEvtType.GEN_LEVEL, RedEvtType.GEN_TUPODAN], 2, { generalId: this.m_generalId });
				RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabTopGroup.getTabBtnByName(GCode(CLEnum.GEN_SKILL)), { x: 118, y: -3 }, [RedEvtType.GEN_SKILL], 2, { generalId: this.m_generalId });
				RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabTopGroup.getTabBtnByName(GCode(CLEnum.GEN_TREA)), { x: 118, y: -3 }, [RedEvtType.GEN_TREA_EQ], 2, { generalId: this.m_generalId });
			}
			RedPointModel.AddInfoListener(this.m_genCard.image_fate, { x: 45, y: 3, scale: 0.78 }, [RedEvtType.GEN_FATE], 2, { generalId: this.m_generalId });
		}

		/**宝物 */
		public refreshTreasureInfo() {
			//刷新属性部分
			this.m_tabAttri.refreshView();
			this.m_tabTrea.refreshView();
			this.m_genCard.refreshTreasureAction();
			this.m_genCard.refreshInfo(true);//刷新战力

		}


		/**刷新升星成功 */
		public refreshStarInfo() {
			//刷新属性部分
			this.m_tabAttri.refreshView();
			//刷新升星模块
			this.m_tabStreng.refreshView();
			this.m_genCard.refreshUpStarAction();
			//刷新战力
			this.m_genCard.refreshInfo(true);
			Utils.open_view(TASK_UI.POP_GENERAL_UPSTAR_VIEWII, this.m_generalId);

		}
		/**刷新技能升级成功 */
		public refreshSkillInfo() {
			//刷新技能模块
			this.m_tabSkill.refreshView();
			this.m_genCard.refreshInfo(true);

		}
		/**刷新升级成功 */
		public refreshLevelInfo() {
			//刷新属性部分
			this.m_tabAttri.refreshView();
			//刷新升星模块
			this.m_tabStreng.refreshView();
			//刷新战力
			this.m_genCard.refreshInfo(true);

			GeneralModel.checkCanAtion(this.m_generalId);
		}
		/**刷新突破成功 */
		public refreshTuPoInfo() {
			//刷新属性部分
			this.m_tabAttri.refreshView();
			//刷新升星模块
			this.m_tabStreng.refreshView();
			this.m_genCard.refreshTuPoAction();
			//刷新战力
			this.m_genCard.refreshInfo(true);
			Utils.open_view(TASK_UI.POP_GENERAL_TUPO_VIEW, this.m_generalId);


		}


		/**=====================================================================================
	   * 事件监听 begin
	   * =====================================================================================
	   */

		/////////////////////////////////////////////////////////////////自定义事件 继承VIEW自带事件监听
		protected listNotificationInterests(): any[] {
			return [TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT];
		}

		protected handleNotification(notification: AGame.INotification) {
			let body = notification.getBody();
			let name = notification.getName();
			switch (name) {
				case TASK_UI.POP_GENERAL_ATTRIBUTE_EFFECT: {
					this.refreshLevelInfoByClient(body.clientUplvMsg);
					break;
				}
			}
		}

		/**刷新客户端升级成功 */
		public refreshLevelInfoByClient(state: number) {
			this.m_tabStreng.refreshLevelView();
			if (state == 1) {
				this.m_genCard.refreshUpLevelAction();
			}
		}

		protected addEvent() {
			this.m_comTabTopGroup.setChangeCallback(this.changeContentTag, this);
			EventManager.addTouchScaleListener(this.btn_left, this, this.onclickButtonLeft);
			EventManager.addTouchScaleListener(this.btn_right, this, this.onclickButtonRight);
		}


		protected removeEvent() {
		}

		/**切卡 */
		public changeContentTag(index: number) {
			if (index >= this.m_comTabTopGroup.dataNum) index = 0;
			this.m_comTabTopGroup.selectedIndex = index;
			let info = this.m_tTagInfo[this.m_comTabTopGroup.selName];
			this.m_tabViewStack.selectedIndex = info.viewId;
			this.refreshCurTab();

			this.onGuideConditionTab(info.guideId);
		}

		/**切换操作限时 */
		private checkTabTime() {
			let time = TimerUtils.getServerTime();
			if (time - this.m_nTabOldTime < 1) {
				EffectUtils.showTips(GCode(CLEnum.ACTION_FAST), 1, true);
				return false;
			}
			this.m_nTabOldTime = time;
			return true;
		}

		public onclickButtonLeft() {
			if (!this.checkTabTime()) return;

			let index = this.sliderIndex - 1;
			if (index < 0) {
				index = this.sliderList.length - 1;
			}
			this.setCurSoliderIndex(index);
		}

		public onclickButtonRight() {
			if (!this.checkTabTime()) return;

			let index = this.sliderIndex + 1;
			if (index > this.sliderList.length - 1) {
				index = 0;
			}
			this.setCurSoliderIndex(index);
		}

		private setCurSoliderIndex(index: number) {
			if (this.sliderIndex == index) return;
			this.sliderIndex = index;
			this.m_generalId = this.sliderList[index];
			this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
			this.refreshInfo();
			this.refreshTabBtns();
		}

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_INFO_WND);
		}

		/**检查新手引导面板条件 */
		public onGuideConditionTab(id: IGUIDECD) {
			if (id <= 0) return;
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
		}

	}


}