
module com_main {
    export class SelectRewardItem extends eui.Component {
		protected m_item: ComItemNew;
		protected m_imgSelected: eui.Image;
		
		private m_sel: boolean;
        private m_itemInfo: IItemInfo;

		public constructor(itemInfo: IItemInfo, sel: boolean) {
			super();
            this.m_itemInfo = itemInfo;
            this.m_sel = sel;
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

			this.m_imgSelected = new eui.Image('SelectKuang_png')
			this.m_imgSelected.x = -13;
			this.m_imgSelected.y = -13;
			this.addChild(this.m_imgSelected);
			this.m_imgSelected.visible = false;

            this.setSel(this.m_sel);
            this.refreshUI();
		}

        public getRewardItemInfo(){
            return this.m_itemInfo;
        }

        public setSel(boo: boolean){
            this.m_sel = boo;
            this.m_imgSelected.visible = this.m_sel;
        }

		protected refreshUI(): void {
            this.m_item.setItemInfo(this.m_itemInfo.itemId, this.m_itemInfo.count);
		}
    }
}