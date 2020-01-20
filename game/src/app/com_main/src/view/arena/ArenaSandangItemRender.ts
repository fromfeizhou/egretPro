module com_main {
	export class ArenaSandangItemRender extends CComponent{

		public lb_gaunka:eui.Label;
		public group_itemList:eui.Group;

		public constructor(param?) {
			super();
			// this.id = param;
			this.skinName = Utils.getAppSkin("arena/arena_saodan_render.exml");
		}

		public onDestroy(): void {
			EventManager.removeEventListener(this);
			super.onDestroy();
		}


		protected childrenCreated() {
			super.childrenCreated();

			// this.refresh();
		}

		public refresh(ArenaInfo){
			this.lb_gaunka.text = GCodeFromat(CLEnum.CHALL_NUM,ArenaInfo.arenaId);

			for(let itemInfo of ArenaInfo.values)
			{
				// let item = new com_main.ArenaItemRender();
				// item.refresh(itemInfo);
				// this.group_itemList.addChild(item);

				let item = ComItemNew.create();
				item.setItemInfo(itemInfo.itemId,itemInfo.count);
				this.group_itemList.addChild(item);
			}
		}
	}
}