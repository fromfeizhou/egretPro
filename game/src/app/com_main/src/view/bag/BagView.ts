module com_main {
	class BagViewEventType {
		public HIDE_DETAILS = 1;
		public SHOW_DETAILS = 2;
	}

	export class BagView extends CView {
		public static NAME = 'BagView';

		public m_itemsView: com_main.BagDetailView;
		public m_Detaile: eui.Group;
		public m_ItemName: com_main.CLabel;
		public m_ItemNum: com_main.CLabel;
		public m_Description: com_main.CLabel;
		public m_ComItem: com_main.ComItemNew;
		public m_groupMultiUse: eui.Group;
		public m_sliderNum: com_main.CLabel;
		public m_btnSub: eui.Image;
		public m_btnAdd: eui.Image;
		public m_slider: Hslider;
		public m_BtnUse: com_main.ComButton;
		public m_BtnSource: com_main.ComButton;
		public m_comTabGroup: com_main.ComTabGroup;
		public m_MainTopNew: com_main.MainTopNew;

		private mSelectedIndex = 0;
		private m_ItemUsable: number;
		//滑动条
		private m_nCurUId: number;		//当前显示物品uid
		private m_nCurItemMax: number;
		private m_nCurType: PropMainType[];	//当前道具切卡
		private m_tTypes: PropMainType[][];

		public constructor(id: number = null) {
			super();
			this.name = BagView.NAME;
			if (id) {
				this.mSelectedIndex = id;
			}
			this.initApp("bag/bag_view.exml");
		}

		public onDestroy(): void {
			super.onDestroy();
			EventMgr.removeEventByObject(BagEvent.BAG_SELECTED_CHANGE, this);
			EventMgr.removeEventByObject(BagEvent.BAG_ITEM_UPDATE, this);
			PropModel.ClearNewPorpState();
		}

		private ShowDetails(data: { tagId: PropMainType, uuid: number }) {
			if (this.m_nCurType.indexOf(data.tagId) == -1) return;
			this.m_nCurUId = data.uuid;
			if (unNull(data.uuid)) {
				this.m_Detaile.visible = true;
				let vo = PropModel.getPropByUId(data.uuid);
				Utils.setPropLabName(vo.itemId, this.m_ItemName);
				this.m_Description.text = vo.config.description;
				this.m_nCurItemMax = vo.count;
				this.m_ItemNum.text = this.m_nCurItemMax + '';
				this.m_ComItem.setItemInfo(vo.itemId);

				this.m_BtnUse.visible = vo.config.usable != 0
				this.m_ItemUsable = vo.config.usable;

				if (vo.type == PropMainType.SOUL) {
					this.m_BtnSource.visible = true;
				} else {
					this.m_BtnSource.visible = false;
				}
				this.refreshSlider();
			} else {
				this.m_Detaile.visible = false;
			}
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			// this.height = this.stage.stageHeight;
			this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.FOOD, PropEnum.WOOD, PropEnum.IRON]);
			this.m_MainTopNew.setTitleName(GCode(CLEnum.BAG));
			this.m_BtnUse.setTitleLabel(GCode(CLEnum.BAG_USE));
			this.m_BtnSource.setTitleLabel(GCode(CLEnum.BAG_SOURCE));

			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_ALL) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_BS) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_WJSP) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_JNSP) });
			this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_BWSP) });

			// this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_JS) });
			this.m_comTabGroup.setChangeCallback(this.changeTag, this);
			this.validateNow();

			this.m_itemsView.resetListSize();
			this.m_tTypes = [
				[PropMainType.All],
				[PropMainType.STONE],
				[PropMainType.SOUL],
				[PropMainType.SKILL_SOUL],
				[PropMainType.TREA_SOUL]];


			this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
			EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
			EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);

			EventManager.addTouchScaleListener(this.m_BtnUse, this, this.onBtnUseHandler);
			EventManager.addTouchScaleListener(this.m_BtnSource, this, this.onBtnSourceHandler);

			EventMgr.addEvent(BagEvent.BAG_SELECTED_CHANGE, this.ShowDetails, this);
			EventMgr.addEvent(BagEvent.BAG_ITEM_UPDATE, this.onBagItemUpdate, this);

			this.changeTag(0);

			// this.validateNow();
		}
		private changeTag(selIndex: number) {
			this.m_nCurType = this.m_tTypes[selIndex];
			this.m_itemsView.setItemType(this.m_nCurType);
		}

		/**物品数量更新 */
		private onBagItemUpdate(uuid: number) {
			if (this.m_nCurUId == (uuid)) {
				let vo = PropModel.getPropByUId(this.m_nCurUId);
				if (vo) {
					let num = vo.count;
					this.m_ItemNum.text = num + "";
					this.m_nCurItemMax = num;
					this.refreshSlider(this.m_slider.value);
				}
			}
		}

		/**刷新使用显示 */
		private refreshSlider(val?: number) {
			//可以使用 而且数量大于1时候显示
			this.m_groupMultiUse.visible = (this.m_ItemUsable != 0 && this.m_nCurItemMax > 1);

			this.m_slider.maximum = this.m_nCurItemMax;
			this.m_slider.minimum = 1;
			if (val) {
				this.m_slider.value = Math.min(val, this.m_nCurItemMax);
			} else {
				this.m_slider.value = this.m_nCurItemMax;
			}


			this.updateValue();
		}
		//滑动滑块
		private onchangSlider(event: eui.UIEvent): void {
			this.updateValue();
		}
		/**文本刷新 */
		private updateValue(): void {
			this.m_sliderNum.text = this.m_slider.value + '/' + this.m_nCurItemMax;
		}
		/**
		* --
		*/
		private onClickSub() {
			if (this.m_slider.value <= this.m_slider.minimum) return;
			this.m_slider.value--;
			this.updateValue();
		}
		/**
		 * ++
		 */
		private onClickAdd() {
			if (this.m_slider.value >= this.m_slider.maximum) return;
			this.m_slider.value++;
			this.updateValue();
		}


		/**道具使用 */
		private onBtnUseHandler() {
			if (this.m_ComItem.itemId > 0) {
				let num = PropModel.getPropNum(this.m_ComItem.itemId);
				let useValue = this.m_slider.value;
				if (num > 0 && useValue > 0) {
					useValue = useValue <= num ? useValue : num;
					PropProxy.send_BACKPACK_USE_ITEM(this.m_ComItem.itemId, useValue);
				} else {
					EffectUtils.showTips(GCode(CLEnum.BAG_USE_FAL), 1, true);
				}
			}
		}

		/**物品来源 */
		private onBtnSourceHandler() {
			if (this.m_ComItem.itemId > 0) {
				Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_ComItem.itemId);
			}
		}

		public static getClass(): BagView {
			let obj = SceneManager.getClass(LayerEnums.POPUP, BagView.NAME);
			return obj;
		}
	}
}