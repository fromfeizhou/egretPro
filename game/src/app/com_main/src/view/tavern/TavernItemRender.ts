//招募 itemRender
module com_main {
	export class TavernItemRender extends CComponent {

		private m_E_OutFrame: eui.Image;
		private m_E_Top: eui.Image;
		private m_labPercent: eui.Label;
		private m_ComItemNew: ComItemNew;

		private m_tItemInfo: IItemInfo;

		public constructor(param: IItemInfo) {
			super();
			this.m_tItemInfo = param;
			this.skinName = Utils.getAppSkin("tavern/tavern_item_render.exml");
		}


		public onDestroy(): void {
			egret.Tween.removeTweens(this);
			EventManager.removeEventListener(this);
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_labPercent.visible = false;
			this.refresh();
		}

		// private ActiveEffect() {
		// 	if (TavernView.m_Anim_OutFrame)
		// 		TavernView.m_Anim_OutFrame.addBitmap(this.m_E_OutFrame);
		// 	if (TavernView.m_Anim_Top)
		// 		TavernView.m_Anim_Top.addBitmap(this.m_E_Top);
		// }

		public refresh() {
			let	cfg = C.ItemConfig[this.m_tItemInfo.itemId];
			if (cfg.mainType == PropMainType.SOUL||cfg.mainType == PropMainType.GENERAL) //道具
			{
				this.m_ComItemNew.setItemInfo(this.m_tItemInfo.itemId, this.m_tItemInfo.count);
				// if (cfg.quality >= QuaEnum.QUA_4) {
				// 	this.ActiveEffect();
				// }
			}
		}


	}
}