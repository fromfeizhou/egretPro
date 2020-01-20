module com_main {
	export class DropItem extends com_main.ListItemRenderer {

		private lbContent: eui.Label;

		public constructor() {
			super();
			this.skinName = "resource/skins/components/DropItem.exml";
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			debug("BattleItemRender:childrenCreated------>>");
		}

		protected dataChanged(): void {
			this.lbContent.text = this.data.type;
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
		}

	}
}