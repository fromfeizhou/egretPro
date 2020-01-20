module com_main {
	export class HistoryBattlesReward extends CComponent {

		public static NAME = 'HistoryBattlesReward';

		/** 当前章节星星数信息 */
		public m_imgProBg: com_main.CImage;
		public m_imgPro: com_main.CImage;
		public m_Box0: com_main.HistoryBattlesRewardBox;
		public m_Box1: com_main.HistoryBattlesRewardBox;
		public m_Box2: com_main.HistoryBattlesRewardBox;
		public m_labCur: com_main.CLabel;
		public m_labAllS: com_main.CLabel;
		public m_ResetTime: com_main.CLabel;
		public m_BtnBuyTimes: com_main.CImage;




		/** 当前奖励宝箱组件 */
		private m_BoxItems: HistoryBattlesRewardBox[];

		/** 当前章节ID */
		private _chapterId: number;


	
		private alltime: number;  //时间

		/** 访问器 - 最多星星数 */
		private get _totalStarCnt(): number {
			let chapterCfgs: HistoryWarConfig[] = HistoryBattleModel.getHistoryWarCfgs(this._chapterId);
			let starCnt: number = 0;
			if (chapterCfgs) {
				chapterCfgs.forEach(element => {
					starCnt += 3;
				});
			}
			return starCnt;
		}

		/** 访问器 - 当前已获取的星星数 */
		private get _curStarCnt(): number {
			let chapterInfo: gameProto.IHisChapterInfo = HistoryBattleModel.getHisoryWarInfo(this._chapterId);
			let starCnt: number = 0;
			if (chapterInfo && chapterInfo.LevelInfos) {
				chapterInfo.LevelInfos.forEach(element => starCnt += element.star);
			}
			return starCnt;
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			for (let index = 0; index < this.m_BoxItems.length; index++) {
				this.m_BoxItems[index].onDestroy();
			}
			this.m_BoxItems = null;
	
			// EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_UPDATE, this);
			super.onDestroy();
		}

		public constructor(param: any) {
			super();
			this.name = HeadQuartersReward.NAME;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_BtnBuyTimes, this, this.OnBtnBuyMoppingUpReset);
		
			// EventMgr.addEvent(QuarterEvent.QUARTER_INFO_UPDATE, this.onFunCount, this);
			this.m_BtnBuyTimes.visible = !platform.isHidePayFunc();
		}

		/** 初始化宝箱组件 */
		public initBoxItem(): void {
			this.m_BoxItems = [];
			for (let i = 0; i < 3; i++) {
				let boxItem: HistoryBattlesRewardBox = this["m_Box" + i];
				boxItem.InitBox(i);
				this.m_BoxItems.push(boxItem);
				EventManager.addTouchScaleListener(boxItem, this, () => this.onBtnBox(boxItem));
			}
		}

		/** 设置章节ID */
		public SetChapterId(chapterId: number): void {
			this._chapterId = chapterId;
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
			let starRewardCfgGroup: HistoryWarStarRewardConfig[] = HistoryBattleModel.getHistoryWarStarCfg(this._chapterId);
			if (starRewardCfgGroup && starRewardCfgGroup.length > 0) {
				for (let i = 0; i < this.m_BoxItems.length; i++) {
					this.m_BoxItems[i].x = (starRewardCfgGroup[i].star / this._totalStarCnt) * this.m_imgProBg.width - this.m_BoxItems[i].width / 2;
					this.m_BoxItems[i].SetBoxConfig(starRewardCfgGroup[i]);
				}
			}
		}

		/** 刷新 -  挑战次数 */
		public Refresh_ChallengeCount(): void {
		
			this.m_ResetTime.text = NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT).reCount.toString();
			

		}
	

		public num: number;
	

		/** 刷新 - 宝箱状态 */
		public Refresh_BoxState(): void {
			let chapterInfo: gameProto.IChapterInfo = HistoryBattleModel.getHisoryWarInfo(this._chapterId);
			if (isNull(chapterInfo)) return;
			for (let i = 0; i < this.m_BoxItems.length; i++) {
				let item: HistoryBattlesRewardBox = this.m_BoxItems[i];
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
		private onBtnBox(item: HistoryBattlesRewardBox): void {
			let state = item.GetBoxState();
			switch (state) {
				case 0: {
					EffectUtils.showTips(GCode(CLEnum.QUA_BOX_TIPS));
					break;
				}
				case 1: {
					// HeadQuartersProxy.send_HQ_RECEIVE_BOX(item.BoxId);
					HistoryBattleProxy.C2S_HISTORY_WAR_GET_BOX(this._chapterId,item.BoxId)
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
			HistoryBattleModel.BuyChallengedTimes();
		}
	
	
	}
}