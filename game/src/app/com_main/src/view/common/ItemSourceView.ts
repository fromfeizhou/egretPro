module com_main {
	export class ItemSourceView extends CView {
		public static NAME = "ItemSourceView";

		private m_apopUp: APopUp;
		private m_groupRender: eui.Group;

		public m_itemId = 0;
		private m_itemConfig: ItemConfig;
		private m_labName: eui.Label;
		private m_labNum: eui.Label;
		private m_labDes: eui.Label;
		private m_itemView: ComItemNew;

		public constructor(itemId = 0) {
			super();

			this.name = ItemSourceView.NAME;
			this.initApp("common/item_source_view.exml");
			this.m_itemId = itemId;
			this.m_itemConfig = PropModel.getCfg(itemId);
		}



		public onDestroy(): void {
			if (this.m_groupRender.numChildren) {
				for (let i = 0; i < this.m_groupRender.numChildren; i++) {
					let item = this.m_groupRender.getChildAt(i) as ItemSourceViewRender;
					item.onDestroy();
				}
			}
			EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			if (!this.m_itemConfig) return;
			EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);

			this.m_apopUp.setTitleLabel(GLan(this.m_itemConfig.name) + GCode(CLEnum.SOURCE));
			this.m_apopUp.setBottomBorder();
			this.m_itemView.openTips = false;
			this.refresh();
		}

		/**物品数量变化 */
		private onPropItemChange(itemId: number) {
			if (itemId == this.m_itemId) {
				this.refreshItemNum();
			}
		}

		/**刷新面板 */
		private refresh() {
			this.m_itemView.itemId = this.m_itemId;
			Utils.setPropLabName(this.m_itemId, this.m_labName)
			this.refreshItemNum();
			this.m_labDes.text = this.m_itemConfig.description;

			let sourceids = this.m_itemConfig.sourcePage.split(",");
			for (let i = 0; i < sourceids.length; i++) {
				let sourceId = Number(sourceids[i]);
				if (sourceId > 0) {
					let render = new ItemSourceViewRender();
					render.setItemId(sourceId);
					this.m_groupRender.addChild(render);
				}
			}
		}

		/**刷新数量 */
		private refreshItemNum() {
			let itemCfg = C.ItemConfig[this.m_itemId];
			let isResource = itemCfg.type == PropType.RESOURCE;//是否是资源
			let itemNum = 0;
			if (itemCfg) {
				if (isResource) {
					if (itemCfg.id == PropEnum.EXP) {
						itemNum = RoleData.GetMaterialNumById(this.m_itemId) <= 0 ? 0 : RoleData.GetMaterialNumById(this.m_itemId);
						this.m_labNum.text = itemNum<=0?'已满级':itemNum.toString();
						return;
					} else {
						itemNum = RoleData.GetMaterialNumById(this.m_itemId);
					}

				} else {
					itemNum = PropModel.getPropNum(this.m_itemId);
				}
			}
			this.m_labNum.text = itemNum.toString();
		}


	}
}