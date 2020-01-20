module com_main {
	export class HeadQuartersReward extends CComponent {

		public static NAME = 'HeadQuartersReward';

		/** 当前章节星星数信息 */
		private m_imgProBg: eui.Image;	//进度条背景
		private m_imgPro: eui.Image;	//进度条
		public m_labCur: com_main.CLabel;
		public m_labAllS: com_main.CLabel;
		public m_imgEquip: eui.Image;
		public m_imgGen: eui.Image;
		public m_labTime: com_main.CLabel;



		/** 当前奖励宝箱组件 */
		private m_BoxItems: HeadQuartersRewardBox[];

		/** 当前章节ID */
		private _chapterId: number;
		/** 当前章节難度 */
		private m_level: number;

		private m_BtnBuyTimes: CImage;
		private m_ResetTime: CLabel;
		private alltime: number;  //时间

		/** 访问器 - 最多星星数 */
		private get _totalStarCnt(): number {
			let chapterCfgs: ChapterConfig[] = HeadQuartersModel.getChapterCfgs(this._chapterId);
			let starCnt: number = 0;
			if (chapterCfgs) {
				chapterCfgs.forEach(element => {
					if (element.stageType != 0)
						starCnt += 3;
				});
			}
			return starCnt;
		}

		/** 访问器 - 当前已获取的星星数 */
		private get _curStarCnt(): number {
			let chapterInfo: gameProto.IChapterInfo = HeadQuartersModel.getChapterInfo(this._chapterId);
			let starCnt: number = 0;
			if (chapterInfo && chapterInfo.checkPointInfos) {
				chapterInfo.checkPointInfos.forEach(element => starCnt += element.condition.length);
			}
			return starCnt;
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			for (let index = 0; index < this.m_BoxItems.length; index++) {
				this.m_BoxItems[index].onDestroy();
			}
			this.m_BoxItems = null;
			Utils.TimerManager.remove(this.updateRemainTime, this);
			EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_UPDATE, this);
			super.onDestroy();
		}

		public constructor(param: any) {
			super();
			this.name = HeadQuartersReward.NAME;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_BtnBuyTimes, this, this.OnBtnBuyMoppingUpReset);
			EventManager.addTouchScaleListener(this.m_imgEquip, this, this.OnBtnEquip);
			EventManager.addTouchScaleListener(this.m_imgGen, this, this.OnBtnGen);
			EventMgr.addEvent(QuarterEvent.QUARTER_INFO_UPDATE, this.onFunCount, this);
			this.m_BtnBuyTimes.visible = !platform.isHidePayFunc();
		}

		/** 初始化宝箱组件 */
		public initBoxItem(): void {
			this.m_BoxItems = [];
			for (let i = 0; i < 3; i++) {
				let boxItem: HeadQuartersRewardBox = this["m_Box" + i];
				boxItem.InitBox(i);
				this.m_BoxItems.push(boxItem);
				EventManager.addTouchScaleListener(boxItem, this, () => this.onBtnBox(boxItem));
			}
		}

		/** 设置章节ID */
		public SetChapterId(chapterId: number, level: number): void {
			this._chapterId = chapterId;
			this.m_level = level;
			this.Refresh();
		}

		/** 刷新界面 */
		public Refresh(): void {
			this.Refresh_StarInfo();
			this.initBoxItem();
			this.Refresh_Config();
			this.Refresh_BoxState();
			this.Refresh_ChallengeCount();
		}

		/** 刷新 - 星星信息 */
		public Refresh_StarInfo(): void {
			this.m_labCur.text = this._curStarCnt.toString();
			this.m_labAllS.text = '/' + this._totalStarCnt;
			this.m_labAllS.x = this.m_labCur.width + this.m_labCur.x;
			this.m_imgPro.width = (this._curStarCnt / this._totalStarCnt) * this.m_imgProBg.width;
		}

		/** 刷新 - 配置信息 */
		public Refresh_Config(): void {
			let starRewardCfgGroup: StarRewardConfig[] = HeadQuartersModel.getChapterStarCfg(this._chapterId);
			if (starRewardCfgGroup && starRewardCfgGroup.length > 0) {
				for (let i = 0; i < this.m_BoxItems.length; i++) {
					this.m_BoxItems[i].x = (starRewardCfgGroup[i].star / this._totalStarCnt) * this.m_imgProBg.width - this.m_BoxItems[i].width / 2;
					this.m_BoxItems[i].SetBoxConfig(starRewardCfgGroup[i]);
				}
			}
		}

		/** 刷新 -  挑战次数 */
		public Refresh_ChallengeCount(): void {
			// this.m_ResetTime.text = HeadQuartersModel.MoppingUpResetCnt.toString();
			// IFunCountEnum.COPY_FREE_COUNT
			this.m_ResetTime.text = NormalModel.getFunCountById(this.m_level).reCount.toString();
			HeadQuartersProxy.send_HQ_GET_LAST_INFO();

		}
		/** 刷新 - 时间*/
		public onFunCount(): void {
			this.m_ResetTime.text = NormalModel.getFunCountById(this.m_level).reCount.toString();
			let time = HeadQuartersModel.getLastTime(this.m_level);
			if (time > 0) {
				this.reFreshCardTime(time);
			} else {
				this.m_labTime.text = '';
				Utils.TimerManager.remove(this.updateRemainTime, this);
			}
		}

		public num: number;
		/**刷新倒计时显示 */
		private reFreshCardTime(time: number) {
			this.num = 0;
			Utils.TimerManager.remove(this.updateRemainTime, this);
			if (time > 0) {
				let curtime = TimerUtils.getServerTimeMill();
				this.alltime = (curtime - time * 1000) * 0.001;
				if (this.alltime >= 30 * 60) {
					this.alltime = 30 * 60 - (this.alltime - 30 * 60);
					this.num += 1;
				}
				else {
					this.alltime = 30 * 60 - this.alltime;
				}
				Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
				this.m_labTime.text = GCodeFromat(CLEnum.QUA_RESUME_TIPS,Utils.DateUtils.getFormatBySecond(this.alltime, 4));
			} else {
				this.m_labTime.text = '';
			}


		}

		/**刷新倒计时 */
		private updateRemainTime() {
			if (this.alltime > 0) {
				if (--this.alltime > 0) {
					this.m_labTime.text =  GCodeFromat(CLEnum.QUA_RESUME_TIPS,Utils.DateUtils.getFormatBySecond(this.alltime, 4));
				}
			} else {
				HeadQuartersProxy.send_HQ_GET_LAST_INFO();
			}
		}

		/** 刷新 - 宝箱状态 */
		public Refresh_BoxState(): void {
			let chapterInfo: gameProto.IChapterInfo = HeadQuartersModel.getChapterInfo(this._chapterId);
			if (isNull(chapterInfo)) return;
			for (let i = 0; i < this.m_BoxItems.length; i++) {
				let item: HeadQuartersRewardBox = this.m_BoxItems[i];
				let isReceived: boolean = false;
				for (let j = 0; j < chapterInfo.receivedBoxs.length; j++) {
					let receivedId: number = chapterInfo.receivedBoxs[j];
					if (item.BoxId == receivedId) {
						isReceived = true;
						break;
					}
				}
				/**
				 * 如果宝箱ID，存在于后端返回的信息中，说明：宝箱已领取
				 * gameProto.ChapterInfo.receivedBoxs
				 * 
				 * 没有领取，则需要判断是否达到领取条件：
				 * 如果：领取宝箱的星星数 >= 当前获取的星星数 ----> 可领取状态
				 * 否则：不可领取状态
				 */
				if (isReceived)
					item.SetBoxState(0);
				else {
					item.SetBoxState(this._curStarCnt >= item.NeedStarOpen ? 1 : 2);
				}
			};
		}

		/** 按钮事件 - 宝箱状态 */
		private onBtnBox(item: HeadQuartersRewardBox): void {
			let state = item.GetBoxState();
			switch (state) {
				case 0: {
					EffectUtils.showTips(GCode(CLEnum.QUA_BOX_TIPS));
					break;
				}
				case 1: {
					HeadQuartersProxy.send_HQ_RECEIVE_BOX(item.BoxId);
					break;
				}
				case 2: {
					EffectUtils.showTips(GCodeFromat(CLEnum.QUA_BOX_LIMIT, item.NeedStarOpen), 1, true);
					Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: item.GetAwards() });
					break;
				}
			}
		}

		/** 按钮事件 - 购买挑战次数 */
		private OnBtnBuyMoppingUpReset(): void {
			HeadQuartersModel.BuyChallengedTimes(this.m_level);
		}
		/** 按钮事件 -跳转到锻造 */
		private OnBtnEquip(): void {
			Utils.open_view(TASK_UI.POP_EQUIP_MAIN_WND);
		}
		/** 按钮事件 - 跳转到武将 */
		private OnBtnGen(): void {
			Utils.open_view(TASK_UI.POP_GENERAL_OPEN_INFO_VIEW);
		}
	}
}