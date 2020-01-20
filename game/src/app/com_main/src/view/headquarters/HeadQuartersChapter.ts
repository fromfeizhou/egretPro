module com_main {
	export class HeadQuartersChapter extends CComponent {

		public static NAME = 'HeadQuartersChapter';

		public m_BackGround: com_main.CImage;
		public m_bgMask: eui.Image;
		public m_pItemRoot: eui.Group;
		public Item0: com_main.HeadQuartersItem;
		public Item1: com_main.HeadQuartersItem;
		public Item2: com_main.HeadQuartersItem;
		public Item3: com_main.HeadQuartersItem;
		public Item4: com_main.HeadQuartersItem;
		public Item5: com_main.HeadQuartersItem;
		public Item6: com_main.HeadQuartersItem;
		public Item7: com_main.HeadQuartersItem;
		public Item8: com_main.HeadQuartersItem;
		public Item9: com_main.HeadQuartersItem;
		public Item10: com_main.HeadQuartersItem;
		public Item11: com_main.HeadQuartersItem;
		public m_ArrowRoot: eui.Group;
		public m_Arrow: com_main.CImage;

		/** 关卡信息 */
		private _chpaterCfgs: ChapterConfig[];

		/** 关卡组件 */
		private _Items: HeadQuartersItem[];

		private m_nChapterId: number;	//當前章節id
		private m_nCopyId:number;
		public constructor() {
			super();
			this.name = HeadQuartersChapter.NAME;
			//this.skinName = Utils.getSkinName("app/headquarters/HeadQuartersChapterSkin.exml");	
			// this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			this.removeEvent();
			egret.Tween.removeTweens(this.m_Arrow);
			super.onDestroy();
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			this.InitItem();
			this.InitArrowTween();

			this.mask = this.m_bgMask;
			this.initEvent();
		}

		/** 初始化关卡组件 */
		private InitItem(): void {
			this._Items = [];
			for (let i = 0; i < 12; i++) {
				let Item: HeadQuartersItem = this["Item" + i];
				this._Items.push(Item);
			}
		}

		private InitArrowTween(): void {
			egret.Tween.removeTweens(this.m_Arrow);
			Tween.get(this.m_Arrow, { loop: true })
				.to({ y: -30 }, 800, egret.Ease.sineIn)
				.to({ y: 0 }, 800, egret.Ease.sineOut);
		}

		/**設置章節id */
		public setChapterInfo(val: number,copyId:number) {
			if (this.m_nChapterId == val) return;
			this.m_nChapterId = val;
			this.m_nCopyId = copyId;
			this.setChapterCfg();
		}
		// public get chapterId(): number {
		// 	return this.m_nChapterId;
		// }

		/** 设置章节信息 */
		private setChapterCfg(): void {
			if (!this.m_nChapterId) return;
			this._chpaterCfgs = HeadQuartersModel.getChapterCfgs(this.m_nChapterId)
			this.Refresh();
		}

		/** 刷新界面 */
		public Refresh(): void {
			if (this._chpaterCfgs) {
				this.Refresh_BackGround();
				this.Refresh_CheckPoints();
				this.Refresh_Arrow();
			}
		}

		/** 刷新 - 箭头 */
		private Refresh_Arrow(): void {
			this.m_ArrowRoot.visible = false;
			let index = this.m_nCopyId;
			for (let i = 0; i < this._Items.length; i++) {
				let element: HeadQuartersItem = this._Items[i];
				if (index == element.CheckPointId) {
					this.m_ArrowRoot.visible = true;
					this.m_ArrowRoot.x = element.x;
					if (element.IsBoss) {
						this.m_ArrowRoot.y = element.y - element.height - 10;
					} else {
						this.m_ArrowRoot.y = element.y - element.height / 2;
					}

					break;
				}
			}
		}
		/** 刷新 - 背景图 */
		private Refresh_BackGround(): void {
			this.m_BackGround.source = this._chpaterCfgs[0].resMapName;
		}

		/** 刷新 - 关卡 */
		private Refresh_CheckPoints(): void {
			let cfgCnt = this._chpaterCfgs.length;
			for (let i = 0; i < cfgCnt; i++) {
				this._Items[i].SetCheckPoint(this._chpaterCfgs[i]);
			}
		}

		private ShowChapterInfoView(item: HeadQuartersItem): void {
			// let tempCfg = C.ChapterConfig[item.CheckPointId];
			// if(!tempCfg.sweepAway && item.CheckPointId<HeadQuartersModel.CurCheckPointId) {
			// 	EffectUtils.showTips("敌军已被击溃！",1,true);
			// 	return ;
			// }
			Utils.open_view(TASK_UI.HEADQUARTER_INFO_PANEL, item.CheckPointId);
		}
		// //指引的时候把当前关卡提到最高层
		// public setCurItemTopLayer() {
		// 	let curCheckPointId: number = HeadQuartersModel.fightRecordId;
		// 	for (let i = 0; i < this._Items.length; i++) {
		// 		let element: HeadQuartersItem = this._Items[i];
		// 		if (curCheckPointId == element.CheckPointId) {
		// 			this.m_pItemRoot.swapChildrenAt(this.m_pItemRoot.getChildIndex(element), this.m_pItemRoot.numChildren - 1);
		// 			break;
		// 		}
		// 	}
		// }


		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private initEvent() {
			for (let i = 0; i < this._Items.length; i++) {
				let Item: HeadQuartersItem = this._Items[i];
				EventManager.addTouchTapListener(Item, this, () => this.OnClickItem(Item));
			}
			EventMgr.addEvent(QuarterEvent.QUARTER_INFO_UPDATE, this.onInfoUpdate, this);
		}

		private removeEvent() {
			for (let i = 0; i < 12; i++) {
				// EventManager.addTouchTapListener(this._Items[i], this, this.OnClickItem);
				EventManager.removeEventListener(this._Items[i]);
			}
			EventManager.removeEventListeners(this);
			EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_UPDATE, this);
		}

		/**章節信息刷新 */
		private onInfoUpdate(chapterId: number) {
			if (this.m_nChapterId == chapterId) {
				this.Refresh();
			}
		}

		/** 按钮事件 - 点击关卡 */
		private OnClickItem(item: HeadQuartersItem): void {
			// if (HeadQuartersModel.isPassWar(item.CheckPointId) && !item.IsBoss) return;
				if (this.m_nCopyId != item.CheckPointId&& !item.IsBoss) return;
			// if (item.CheckPointId != HeadQuartersModel.fightRecordId && NormalModel.getFunCountById(IFunCountEnum.COPY_FREE_COUNT).reCount == 0) {
			// 	HeadQuartersModel.BuyChallengedTimes();
			// }
			// else {
				this.ShowChapterInfoView(item);
			// }
		}

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
	}
}