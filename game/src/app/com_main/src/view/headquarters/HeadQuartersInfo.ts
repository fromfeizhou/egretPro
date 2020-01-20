module com_main {
	export class HeadQuartersInfo extends CView {

		public static NAME = 'HeadQuartersInfo';

		public m_PopUp: com_main.APopUp;
		public m_Generals: eui.Group;
		public m_starIcon1: com_main.CImage;
		public m_starDesc1: com_main.CLabel;
		public m_starIcon2: com_main.CImage;
		public m_starDesc2: com_main.CLabel;
		public m_starIcon3: com_main.CImage;
		public m_starDesc3: com_main.CLabel;
		public m_RecomPower: com_main.CLabel;
		public m_labFirst: com_main.CLabel;
		public m_Items: eui.Group;
		public m_pBtnRoot: eui.Group;
		public m_BtnEdit: com_main.ComButton;
		public m_BtnMoppingUp: com_main.ComButton;
		public m_BtnBattle: com_main.ComButton;
		public m_pSaoRoot: eui.Group;
		public m_BtnBuy: com_main.CImage;
		public m_labSaodNum: com_main.CLabel;
		public m_labLockTip: com_main.CLabel;

		/** 章节配置信息 */
		private _chapterCfg: ChapterConfig;
		/** 关卡配置信息 */
		// private _checkPointCfg:CheckPointConfig;
		private m_nChapterId: number;
		/** 章节星星 */
		private _starConfig: StarConfig;

		public m_maxSaodNum: number;
		public constructor(param: any) {
			super();
			this.name = HeadQuartersInfo.NAME;
			this.m_nChapterId = param;
			this.initApp("headquarters/HeadQuartersInfoSkin.exml");
			this.initViewData();
		}

		public onDestroy(): void {
			super.onDestroy();
			while (this.m_Generals.numChildren > 0) {
				let item = this.m_Generals.getChildAt(0) as GeneralHeadRender;
				if (item.onDestroy) {
					item.onDestroy();
				} else {
					Utils.removeFromParent(item);
				}
			}
			EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_NUM, this);
		}
		protected childrenCreated(): void {
			super.childrenCreated();

			EventManager.addTouchScaleListener(this.m_BtnEdit, this, this.onBtnEdit);
			EventManager.addTouchScaleListener(this.m_BtnMoppingUp, this, this.onBtnMoppingUp);
			EventManager.addTouchScaleListener(this.m_BtnBattle, this, this.onBtnBattle);
			EventMgr.addEvent(QuarterEvent.QUARTER_INFO_NUM, this.onInfoMaxNum, this);
			this.Refresh_BtnLabel();
			this.Refresh();

			this.onGuideCondition();
		}


		/** 初始化界面数据 */
		private initViewData(): void {
			this._chapterCfg = C.ChapterConfig[this.m_nChapterId];
			// this._checkPointCfg = C.CheckPointConfig[checkPointId];
			this._starConfig = C.StarConfig[this.m_nChapterId];
			this.updateViewModel();
		}

		/** showModel:设置显示模式:0-默认，1-无扫荡，2-预览*/
		private updateViewModel() {

			this.m_BtnMoppingUp.visible = this._chapterCfg.stageType != 0 && HeadQuartersModel.isPassWar(this.m_nChapterId) ? true : false;
			if (this._chapterCfg.difficultyType == IQuarLevel.NORMAL) {
				this.m_labFirst.text = HeadQuartersModel.isPassWar(this.m_nChapterId) ? GCode(CLEnum.QUA_FALL) : GCode(CLEnum.QUA_FALL_FIRST);
			} else {
				this.m_labFirst.text = HeadQuartersModel.isPassWar(this.m_nChapterId) ? GCode(CLEnum.BOSS_DROP) : GCode(CLEnum.QUA_FALL_FIRST);
			}
			let tempId = HeadQuartersModel.fightRecordId;
			let lockid = this.getPerNum(this._chapterCfg.prevPointId) ? this.getPerNum(this._chapterCfg.prevPointId) : 0;
			let lastChapterCfg = C.ChapterConfig[lockid];
			this.m_labLockTip.text = '';
			if (lastChapterCfg) {
				let str = lastChapterCfg.difficultyType == IQuarLevel.HARD ? GCode(CLEnum.HARD) : GCode(CLEnum.NORMAL);
				this.m_labLockTip.text = (HeadQuartersModel.isPassWar(lockid)) ? '' : GCodeFromat(CLEnum.QUA_PASS_LIMIT, str + lastChapterCfg.title);
			}
			this.m_pBtnRoot.visible = HeadQuartersModel.getDefCopyId(this._chapterCfg.chapterId) >= this.m_nChapterId && HeadQuartersModel.isPassWar(lockid);
			let showModel: number = 0;
			switch (showModel) {
				case 1:
					{
						this.m_BtnMoppingUp.visible = false;
						break;
					}
				case 2:
					{
						this.m_BtnEdit.visible = false;
						this.m_BtnMoppingUp.visible = false;
						this.m_BtnBattle.visible = false;
						break;
					}
			}
		}
		/**当前前置关卡权重值 */
		private getPerNum(vo: any) {
			vo = vo.replace('[', '');
			vo = vo.replace(']', '');
			let allper = vo.split(',');
			let num = Number(allper[0]);
			return num;
		}

		/** 按钮事件 - 布阵 */
		private onBtnEdit(): void {
			Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.CHECKPOINT, battleId: this.m_nChapterId });
		}

		/** 按钮事件 - 扫荡 */
		private onBtnMoppingUp(): void {
			let maxCount = this._chapterCfg.maxChallengeCount;//某关卡最大挑战次数
			if (this.m_maxSaodNum >= maxCount) {
				EffectUtils.showTips(GCode(CLEnum.QUA_SWEEP_FAL), 1, true);
				return;
			}
			let type: IFunCountEnum;
			if (this._chapterCfg.difficultyType == IQuarLevel.HARD) {
				type = IFunCountEnum.HQ_HARD_FREE_COUNT;
			} else {
				type = IFunCountEnum.COPY_FREE_COUNT;
			}
			if (NormalModel.getFunCountById(type).reCount) {
				HeadQuartersProxy.send_HQ_CLEAN_UP(this.m_nChapterId);
			} else {
				if (platform.isHidePayFunc()) {
					EffectUtils.showTips("扫荡次数不足");
					return;
				}
				HeadQuartersModel.BuyChallengedTimes(type);
			}
		}

		/** 按钮事件 - 挑战 */
		private onBtnBattle(): void {
			let maxCount = this._chapterCfg.maxChallengeCount;//某关卡最大挑战次数
			if (this.m_maxSaodNum >= maxCount) {
				EffectUtils.showTips(GCode(CLEnum.QUA_SWEEP_FAL), 1, true);
				return;
			}

			if (HeadQuartersModel.canChallenges(this.m_nChapterId)) {
				HeadQuartersProxy.send_HQ_CHALLENGES(this.m_nChapterId, 1);
			}
		}

		/** 刷新界面 */
		private Refresh(): void {
			this.Refresh_Title();
			this.Refresh_Heros();
			this.Refresh_Items();
			this.Refresh_StarInfo();
			this.Refresh_RecomPower();
			this.onInfoMaxNum(null);
		}

		private Refresh_Title(): void {
			this.m_PopUp.setTitleLabel(this._chapterCfg.title);
		}

		/** 刷新 - 按钮文字*/
		private Refresh_BtnLabel(): void {
			this.m_BtnEdit.setTitleLabel(GCode(CLEnum.CAMP));
			this.m_BtnMoppingUp.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
			this.m_BtnBattle.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
		}

		/** 刷新 - 过关星星信息 */
		private Refresh_StarInfo(): void {
			this["m_starDesc1"].text = GLan(this._starConfig.oneStarConfig);
			this["m_starDesc2"].text = GLan(this._starConfig.twoStarConfig);
			this["m_starDesc3"].text = GLan(this._starConfig.threeStarConfig);

			let starInfo = HeadQuartersModel.getStarInfo(this._chapterCfg.chapterId, this._chapterCfg.id);
			if (starInfo) {
				for (let index = 0; index <= starInfo.condition.length; index++) {
					let iconKey = "m_starIcon" + starInfo.condition[index];
					if (this[iconKey])
						this[iconKey].source = "common_star_png";
					let textKey = "m_starDesc" + starInfo.condition[index];
					if (this[textKey])
						this[textKey].textColor = GameConfig.TextColors.white;
				}

			}
		}
		/** 刷新 - 最大扫荡次数 */
		private onInfoMaxNum(count: number): void {
			let starInfo = HeadQuartersModel.getStarInfo(this._chapterCfg.chapterId, this._chapterCfg.id);
			let maxCount = this._chapterCfg.maxChallengeCount;//某关卡最大挑战次数
			if (starInfo) {
				this.m_pSaoRoot.visible = true;
				starInfo.count = count ? count : starInfo.count;
				this.m_maxSaodNum = starInfo.count;
				if (count && count > 0 && count < maxCount) {
					this.m_labSaodNum.text = (maxCount - count) + '/' + maxCount;
				} else {
					this.m_labSaodNum.text = starInfo.count < maxCount ? (maxCount - starInfo.count) + '/' + maxCount : '0/' + maxCount;
				}
			} else {
				this.m_pSaoRoot.visible = false;
			}
		}
		/** 刷新 - 推荐战力 */
		private Refresh_RecomPower(): void {
			if (this._starConfig)
				this.m_RecomPower.text = this._starConfig.power.toString();
		}

		/** 刷新 - 战斗头像 */
		private Refresh_Heros(): void {
			if (this._chapterCfg) {
				let heroInfos = JSON.parse(this._chapterCfg.generalInfos);
				for (let i = 0; i < heroInfos.length; i++) {
					let item: GeneralHeadRender = GeneralHeadRender.create("arena");
					let info = heroInfos[i];
					let id: number = parseInt(info[0]);
					let starNum: number = info[1];
					let level: number = info[2];
					item.setGenViewInfo(id, level, starNum);
					this.m_Generals.addChild(item);
				}
			}
		}

		/** 刷新 - 物品信息 */
		private Refresh_Items(): void {
			if (this._chapterCfg) {
				let reward: any[];
				if (HeadQuartersModel.isPassWar(this.m_nChapterId)) {
					if (this._chapterCfg.difficultyType == IQuarLevel.NORMAL) {
							reward = Utils.parseCommonItemJsonInDrop(this._chapterCfg.winReward);
					} else {
						reward = Utils.parseCommonItemJsonInDrop(this._chapterCfg.winReward, true);
					}
				} else {
					reward = Utils.parseCommonItemJsonInDrop(this._chapterCfg.firstReward);
				}
				for (let i = 0; i < reward.length; i++) {
					let item: ComItemNew = ComItemNew.create("count");
					item.setItemInfo(reward[i].itemId, reward[i].count);
					this["m_Items"].addChild(item);
				}

			}
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.QUARTER_INFO_WND);
		}
	}
}