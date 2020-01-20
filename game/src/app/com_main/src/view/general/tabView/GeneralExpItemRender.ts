module com_main {
	export class GeneralExpItemRender extends CComponent {

		private m_nItemId: number;
		private m_generalVo: GeneralVo;

		private m_comItem: ComItemNew;
		private lb_name: eui.Label;      // 物品名字
		private image_add: eui.Image;    // 加号
		private m_rect: eui.Rect; //遮罩

		public m_generalId = 0;

		private m_bookList;
		private m_nbookExp = 0;
		private m_nItemLeft = 0;

		public constructor(param?) {
			super();

			this.m_nItemId = param;
			// if (this.m_nItemId) this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
			this.skinName = Utils.getAppSkin("general/tabView/General_jingyan_item_render.exml");
		}


		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			super.onDestroy();
			EventManager.removeEventListener(this.image_add);
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
			this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
			this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
			EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
			if (this.m_bookList) {
				Utils.TimerManager.remove(this.delayFunc, this);
				this.m_bookList = null;
			}
		}

		protected childrenCreated() {
			super.childrenCreated();

			// this.refresh();
			EventManager.addTouchScaleListener(this.image_add, this, this.onclickAddReturn);
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
			this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
			this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
			EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
		}

		/**物品数量变化 */
		private onPropItemChange(itemId: number) {
			if (itemId == this.m_nItemId) {
				// debug(Utils.getGeneralName(this.m_generalId),this.m_generalVo.config.itemId,itemId)
				this.refresh();
			}
		}

		public onclickAddReturn() {
			Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
		}

		public get generalId() {
			return this.m_generalId;
		}

		public set generalId(id: number) {
			if (this.m_generalId == id) return;
			this.m_generalId = id;
			this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
		}

		public set itemId(id: number) {
			this.m_nItemId = id;
			this.refresh();
		}

		public refresh() {
			if (!this.m_nItemId) return;

			let num = PropModel.getPropNum(this.m_nItemId);
			this.m_comItem.setItemInfo(this.m_nItemId, num);
			this.m_comItem.openTips = false;
			this.m_comItem.openEffect = false;
			if (num == 0) {
				this.setItemViewState(true);
			} else {
				this.setItemViewState(false);
			}

			//底下名字
			if (this.m_nItemId > 0) {
				let propCfg = PropModel.getCfg(this.m_nItemId);
				let expCfg = C.ExpBookConfig[this.m_nItemId];
				if (propCfg && expCfg) {
					this.lb_name.text = GCodeFromat(CLEnum.GEN_EXP_AD, expCfg.exp);
					this.m_nbookExp = expCfg.exp;
				}
			}
		}

		/**额外获取按钮显示 */
		private setItemViewState(isAddShow: boolean) {
			if (isAddShow) {
				this.image_add.visible = true;
				this.m_rect.visible = true;
			} else {
				this.image_add.visible = false;
				this.m_rect.visible = false;

			}
		}

		private onClickBegin(e: egret.TouchEvent) {
			if (!this.m_generalVo) return;
			this.m_nItemLeft = PropModel.getPropNum(this.m_nItemId);
			if (this.m_nItemLeft == 0) {
				return;
			}
			if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_LEVELUP)) {
				if (this.m_generalVo.level >= GeneralModel.getMaxLevel(this.m_generalVo.upgradeLevel)) {
					EffectUtils.showTips(GeneralModel.getMaxLvTips(), 1, true);
					return;
				}
				this.m_bookList = [];
				Utils.TimerManager.doTimer(300, 0, this.delayFunc, this);
				this.delayFunc();
			};

		}

		private onClickEnd(e: egret.TouchEvent) {
			this.sendExpList();
		}

		private delayFunc() {
			if (this.m_nItemLeft > 0) {
				switch (this.m_bookList.length) {
					case 0: {
						Utils.TimerManager.changeTimerDelay(200, this.delayFunc, this);
						break;
					}
					case 10: {
						Utils.TimerManager.changeTimerDelay(100, this.delayFunc, this);
						break;

					}
					case 30: {
						Utils.TimerManager.changeTimerDelay(50, this.delayFunc, this);
						break;
					}
					case 60: {
						Utils.TimerManager.changeTimerDelay(20, this.delayFunc, this);
						break;
					}
				}
				// let bookList = [];
				let result = this.m_generalVo.addExpInClient(this.m_nbookExp);
				if (result) {
					this.m_nItemLeft--;
					this.m_comItem.refreshCount(this.m_nItemLeft);
					let ExpBookDto = { id: this.m_nItemId, count: 1 };
					this.m_bookList.push(ExpBookDto);
				} else {
					this.sendExpList();
				}
			} else {
				this.setItemViewState(true);
				this.sendExpList();
			}
		}

		private sendExpList() {
			if (!this.m_bookList) {
				return;
			}

			if (this.m_bookList.length > 0) {
				let ExpBookDto = { id: this.m_nItemId, count: this.m_bookList.length };
				GeneralProxy.send_GENERAL_USE_EXP_BOOK(this.generalId, [ExpBookDto], true);
			}
			Utils.TimerManager.remove(this.delayFunc, this);
			this.m_bookList = null;
		}

	}
}