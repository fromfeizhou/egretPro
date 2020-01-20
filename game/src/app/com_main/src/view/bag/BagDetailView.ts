module com_main {
	export class BagDetailView extends CComponent {
		public static NAME = 'BagDetailView';

		public m_pScroll:eui.Scroller;
		public m_listItemView:eui.List;

		private m_tCollection: eui.ArrayCollection;

		private m_nMainType: PropMainType[];
		private m_nCurIndex: number;

		public constructor() {
			super();
			this.name = BagDetailView.NAME;
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy()
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			super.onDestroy();
			EventMgr.removeEventByObject(BagEvent.BAG_ITEM_ADD, this);
			EventMgr.removeEventByObject(BagEvent.BAG_ITEM_DEL, this);
			EventMgr.removeEventByObject(BagEvent.BAG_ITEM_UPDATE, this);
			this.m_listItemView.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickWidget, this);
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();

			this.m_tCollection = new eui.ArrayCollection([]);
			this.m_listItemView.dataProvider = this.m_tCollection;
			this.m_listItemView.itemRenderer = BagItemRender;
			this.m_listItemView.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickWidget, this);

			EventMgr.addEvent(BagEvent.BAG_ITEM_ADD, this.onBagItemAdd, this);
			EventMgr.addEvent(BagEvent.BAG_ITEM_DEL, this.onBagItemDel, this);
			EventMgr.addEvent(BagEvent.BAG_ITEM_UPDATE, this.onBagItemUpdate, this);
		}

		/**重置列表间距 */
		public resetListSize() {
			//调整item列表			
			egret.callLater(() => {
				if (this.m_listItemView) {
					Utils.tileGroupToCenter(this.m_listItemView, 100);
				}
			}, this);
		}

		/**设置当前选中类型 */
		public setItemType(type: PropMainType[]) {
			if (this.m_nMainType == type) return;
			this.m_tCollection.removeAll();
			this.m_pScroll.stopAnimation();
			this.m_pScroll.viewport.scrollV = 0;
			this.m_nMainType = type;

			let list = PropModel.getPropItemListByTypes(this.m_nMainType, true);
			let res: IBagItemRD[] = [];
			for (let i = 0; i < list.length; i++) {
				let vo = list[i];
				res.push({ uuid: vo.uuid, sel: false });
			}
			this.m_tCollection.replaceAll(res);

			this.setSelectedIndex(0, true);
		}

		/**添加物品 */
		private onBagItemAdd(uuid: number) {
			let rdData: IBagItemRD = { uuid: uuid, sel: false };
			this.m_tCollection.addItem(rdData);
		}

		/**移除物品 */
		private onBagItemDel(uuid: number) {
			for (let i = this.m_tCollection.source.length - 1; i >= 0; i--) {
				let data = this.m_tCollection.getItemAt(i) as IBagItemRD;
				if (data.uuid == (uuid)) {
					this.m_tCollection.removeItemAt(i);
					break;
				}
			}
			this.setSelectedIndex(0, true);
		}

		/**物品数量更新 */
		private onBagItemUpdate(uuid: number) {
			for (let i = this.m_tCollection.source.length - 1; i >= 0; i--) {
				let data = this.m_tCollection.getItemAt(i) as IBagItemRD;
				if (data.uuid == (uuid)) {
					this.m_tCollection.replaceItemAt(data, i);
					break;
				}
			}
		}

		private onClickWidget(e) {
			this.setSelectedIndex(e.itemIndex);
		}

		/**设置当前选中 */
		private setSelectedIndex(index: number, isConst: boolean = false) {
			if (!isConst && this.m_nCurIndex == index) return;
			this.refrestSelItem(this.m_nCurIndex, false);
			this.m_nCurIndex = index;
			this.refrestSelItem(this.m_nCurIndex, true);
			let data = this.m_tCollection.getItemAt(index) as IBagItemRD;
			if (data) {
				EventMgr.dispatchEvent(BagEvent.BAG_SELECTED_CHANGE, { tagId: this.m_nMainType[0], uuid: data.uuid });
			} else {
				EventMgr.dispatchEvent(BagEvent.BAG_SELECTED_CHANGE, { tagId: this.m_nMainType[0], uuid: null });
			}
		}



		/**刷新选中装备 */
		private refrestSelItem(index: number, val: boolean) {
			let data = this.m_tCollection.getItemAt(index) as IBagItemRD;
			if (data) {
				data.sel = val;
				this.m_tCollection.replaceItemAt(data, index);
			}
		}

		public Enter() {
			this.setSelectedIndex(this.m_nCurIndex, true);
		}


	}

	/**=======================================================================================================
	 * 背包格子
	 * =======================================================================================================
	 */
	interface IBagItemRD {
		uuid: number,
		sel: boolean;
	}
	class BagItemRender extends eui.ItemRenderer {
		protected m_item: ComItemNew;
		protected m_imgSelected: eui.Image;
		protected m_imgNew: eui.Image;

		private m_tData: IBagItemRD;

		public constructor() {
			super();
		}

		$onRemoveFromStage(): void {
			this.removeChild(this.m_item);
			super.$onRemoveFromStage();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.width = 100;
			this.height = 100;
			this.m_item = ComItemNew.create('count', false);
			this.addChild(this.m_item);

			this.m_imgNew = new eui.Image('common_red_flag2_png')
			this.m_imgNew.x = 62;
			this.m_imgNew.y = -2;
			this.addChild(this.m_imgNew);
			this.m_imgNew.visible = false;

			this.m_imgSelected = new eui.Image('SelectKuang_png')
			this.m_imgSelected.x = -13;
			this.m_imgSelected.y = -13;
			this.addChild(this.m_imgSelected);
			this.m_imgSelected.visible = false;
		}

		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			this.m_imgSelected.visible = this.m_tData.sel;
			let vo = PropModel.getPropByUId(this.m_tData.uuid);
			if (vo) {
				this.m_item.setItemInfo(vo.itemId, vo.count);
				this.m_imgNew.visible = vo.isNew;
			}
		}
	}
}

