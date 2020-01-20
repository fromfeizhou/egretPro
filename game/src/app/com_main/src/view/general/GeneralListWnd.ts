module com_main {
	export class GeneralListWnd extends CView {

		public static NAME = "GeneralListWnd";

		private m_mainTop: MainTopNew;	//标题
		private group_hava_general: eui.Group;   //已招募英雄列表
		private group_no_general: eui.Group;     //未招募英雄列表

		private m_cacheCards: Dictionary;
		private m_ownIdList = [];
		private m_noneIdList = [];
		private m_tickIdList: Array<number>;

		private m_selectGeneralId: number = null;
		private m_comTabGroup: ComTabGroup;
		private m_itemScroll: eui.Scroller;

		private m_tabGenType = [null, SoldierMainType.RIDESOLDIER, SoldierMainType.FOOTSOLDIER, SoldierMainType.ARROWSOLDIER, SoldierMainType.PIKEMAN]

		public constructor() {
			super();
			this.name = GeneralListWnd.NAME;
			this.initApp("general/GeneralListWndSkin.exml");
			this.m_cacheCards = new Dictionary();
			this.m_tickIdList = [];
		}

		protected listenerProtoNotifications(): any[] {
			return [ProtoDef.RECRUITED_GENERAL, ProtoDef.GENERAL_USE_EXP_BOOK, ProtoDef.GENERAL_UP_STAR, ProtoDef.OPEN_SKILL, ProtoDef.GENERAL_TREASURE_WEAR];
		}


		protected executes(notification: AGame.INotification) {
			let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
				case ProtoDef.RECRUITED_GENERAL: {
					this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
					//武将碎片合成
					if (body.generalInfo) {
						let generalId = body.generalInfo.generalId;
						let param = { generalId: generalId };
						Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEW, param);
						if (generalId) {
							let card: GeneralHeadItem = this.m_cacheCards.get(generalId);
							if (card) {
								card.refresh();
							}
						}
					}

					break;
				}
				//经验更新
				case ProtoDef.GENERAL_USE_EXP_BOOK: {
					let generalId = body.generalInfo.generalId;
					if (generalId) {
						let card: GeneralHeadItem = this.m_cacheCards.get(generalId);
						if (card) {
							card.refreshLevelNum();
						}
					}
					this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
					break;
				}
				//升星
				case ProtoDef.GENERAL_UP_STAR: {
					let generalId = body.generalInfo.generalId;
					let card: GeneralHeadItem = this.m_cacheCards.get(generalId);
					if (card) {
						card.refreshStar();
					}
					this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
					break;
				}
				//技能升级,宝物穿戴刷新武将顺序
				case ProtoDef.GENERAL_TREASURE_WEAR:
				case ProtoDef.GENERAL_UP_STAR: {
					this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
					break;
				}

			}
		}

		public onDestroy(): void {
			super.onDestroy();

			if (this.m_cacheCards) {
				this.m_cacheCards.forEach((key: any, data: GeneralHeadItem) => { data.onDestroy(); });
				this.m_cacheCards.clear();
				this.m_cacheCards = null;
			}
			Utils.TimerManager.remove(this.createItemTick, this);
			EventManager.removeEventListeners(this);

			//清理模块资源 最后调用 避免龙骨动画没有执行destroy
			DragonBonesManager.cleanDragonBones([IETypes.EUI_GeneralGetCard]);
			SceneResGroupCfg.clearModelRes([ModuleEnums.GENERAL]);
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_mainTop.setTitleName(GCode(CLEnum.GEN_TITLE_WJLB));
			this.m_mainTop.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_ALL) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_QB) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_BB) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_GB) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_QB1) });
			this.m_comTabGroup.setChangeCallback(this.onTabBtnClick, this);

			this.validateNow();
			let width = this.m_itemScroll.width;
			this.group_hava_general.width = width;
			this.group_no_general.width = width;
			egret.callLater(() => {
				if (this.group_no_general && this.group_no_general) {
					Utils.tileGroupToCenter(this.group_no_general, 142);
					Utils.tileGroupToCenter(this.group_hava_general, 142);
				}
			}, this);

			this.refreshList(this.m_tabGenType[0]);

			/**检查新手引导面板条件 */
			this.onGuideCondition();
		}


		public onclickButtonReturn() {
			UpManager.history();
		}


		////////////////////////////////////////////////////////////////////////////////////////////////////////////

		private refreshList(armyType?: number) {
			this.m_itemScroll.stopAnimation();
			this.m_itemScroll.viewport.scrollV = 0;
			let list = GeneralModel.getOwnGeneralWithSort(armyType); //GeneralModel.getAllGeneralConfig(RoleData.level);

			this.clearGeneralItemNode();

			this.createNoGeneral(armyType, true);
			this.createOwnGeneral(list);
			this.createNoGeneral(armyType);
			if (this.m_tickIdList.length > 0) {
				Utils.TimerManager.doTimer(30, 0, this.createItemTick, this);
			}

		}

		/**创建元素 */
		private createItemTick() {
			if (!this.m_tickIdList || this.m_tickIdList.length == 0) {
				Utils.TimerManager.remove(this.createItemTick, this);

				/**已拥有武将创建完毕 开始添加未拥有武将时*/
				this.onGuideConditionCreate();
				return;
			}
			let generalId = this.m_tickIdList.shift();
			let generalVo = GeneralModel.getOwnGeneral(generalId);
			let generalCard: GeneralHeadItem;
			if (this.m_cacheCards.has(generalId)) {
				generalCard = this.m_cacheCards.get(generalId);
			} else {
				generalCard = new com_main.GeneralHeadItem(generalId);
				generalCard.touchChildren = false;
				generalCard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGeneralCardBegin, this);
				generalCard.cacheAsBitmap = true;
				this.m_cacheCards.add(generalId, generalCard);
			}

			if (generalVo.own) {

				this.group_hava_general.addChild(generalCard);
				this.group_hava_general.validateNow();
			} else {

				if (generalCard.suipianNum >= generalCard.needSuipian) {
					this.group_hava_general.addChild(generalCard);
					this.group_hava_general.validateNow();
				} else {
					this.group_no_general.addChild(generalCard);
					this.group_no_general.validateNow();

					/**已拥有武将创建完毕 开始添加未拥有武将时*/
					this.onGuideConditionCreate();
				}
			}
			//重绘
			// this.validateNow();
		}

		/**清理显示节点 */
		private clearGeneralItemNode() {
			//停止自动创建队列
			this.m_tickIdList = []
			Utils.TimerManager.remove(this.createItemTick, this);

			this.m_ownIdList = [];
			this.group_hava_general.removeChildren();

			this.m_noneIdList = [];
			this.group_no_general.removeChildren();
		}


		private createOwnGeneral(list) {
			list.sort(GeneralModel.compareOfOnBattle);
			for (let key in list) {
				let vo = list[key];
				let generalCard: GeneralHeadItem;
				if (this.m_cacheCards.has(vo.generalId)) {
					generalCard = this.m_cacheCards.get(vo.generalId);
					this.group_hava_general.addChild(generalCard);
				} else {
					this.m_tickIdList.push(vo.generalId);
				}
				this.m_ownIdList.push(vo.generalId);

			}
		}

		//尚未招募
		private createNoGeneral(armyType?: number, isEnough: boolean = false) {
			let list = GeneralModel.getAllGeneralConfig(null, armyType);
			list.none.sort(GeneralModel.compareNoGeneral);
			for (let key in list.none) {
				let vo = list.none[key];
				let suipianNum = PropModel.getPropNum(vo.itemId);
				if (!isEnough && suipianNum >= vo.soul) continue;
				if (isEnough && suipianNum < vo.soul) continue;

				let generalCard: GeneralHeadItem;
				if (this.m_cacheCards.has(vo.id)) {

					generalCard = this.m_cacheCards.get(vo.id);
					if (generalCard.suipianNum >= generalCard.needSuipian) {
						this.group_hava_general.addChild(generalCard);
					} else {
						this.group_no_general.addChild(generalCard);
					}
				} else {
					this.m_tickIdList.push(vo.id);
				}


				this.m_noneIdList.push(vo.id);
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////


		private onGeneralCardBegin(e: egret.TouchEvent) {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);

			let card = <com_main.GeneralHeadItem>e.target;
			this.m_selectGeneralId = card.generalId;
			let vo = GeneralModel.getOwnGeneral(this.m_selectGeneralId);
			if (vo) {
				// let param = { generalId: this.m_selectGeneralId };
				// SceneManager.openView("com_main.GeneralGetInfoView", param, null, UpManager.STYLE_FULL,true, false);

				if (!vo.own && card.suipianNum >= card.needSuipian) {
					GeneralProxy.send_RECRUITED_GENERAL(card.generalId);
					return;
				}

				let param = { generalId: this.m_selectGeneralId, ownList: this.m_ownIdList, noList: this.m_noneIdList };
				Utils.open_view(TASK_UI.POP_GENERAL_OPEN_DETAIL_VIEW, param)
			}

			//SceneManager.openView("com_main.GeneralDetailedInfoView", param, null, UpManager.STYLE_MAIN_FULL, false, true);
		}

		/**切卡按钮点击 */
		public onTabBtnClick(selectedIndex: number) {
			this.refreshList(this.m_tabGenType[selectedIndex])
		}

		//获取招募武将
		public getEquipGeneralByIndex(index: number): any {
			return this.group_hava_general.getChildAt(index);
		}

		/**获得卡牌 */
		public getOwnerCardById(id: number) {
			for (let i = 0; i < this.group_hava_general.numChildren; i++) {
				let item = this.group_hava_general.getChildAt(i) as GeneralHeadItem;

				if (item.generalId == id) {
					this.group_hava_general.setChildIndex(item, 0);
					this.group_hava_general.validateNow();
					return item;
				}
			}
		}

		/**检查新手引导面板条件 */
		public onGuideCondition() {
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_LIST_WND);
		}

		/**检查新手引导面板条件 */
		private m_bGuideCreate: boolean;
		public onGuideConditionCreate() {
			if (this.m_bGuideCreate) return;
			this.m_bGuideCreate = true;
			EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_LIST_CR);
		}

		/**=====================================================================================
		 * 静态对象 begin
		 * =====================================================================================
		 */

		/**全局获取静态对象 */
		public static getClass(): GeneralListWnd {
			let obj = SceneManager.getClass(LayerEnums.POPUP, GeneralListWnd.NAME);
			return obj;
		}

		/**获得第一排卡牌 */
		public static getOwnerCardById(id: number) {
			let obj = this.getClass();
			if (obj) {
				return obj.getOwnerCardById(id);
			}
		}

		/**=====================================================================================
		 * 静态对象 end
		 * =====================================================================================
		 */
	}
}