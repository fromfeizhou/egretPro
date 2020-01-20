module com_main {
	export class ItemSourceViewRender extends CComponent {

		private m_btnGoto: ComButton;
		private m_labName: eui.Label;
		private m_imgIcon: eui.Image;
		private m_nCfgId: number;	//物品来源配置表id

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("common/item_source_view_render.exml");
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
			super.onDestroy();
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.m_btnGoto.setTitleLabel(GCode(CLEnum.GO_TO));
			EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onBtnGoClick);
		}
		public setItemId(id: number) {
			this.m_nCfgId = id;
			this.reSoureInfo();
		}
		/**设置来源显示信息 */
		private reSoureInfo() {
				let cfg = C.TurnPanelConfig[this.m_nCfgId];
			if (!cfg || cfg.image == '') return;
			this.m_imgIcon.source = cfg.image + "_png";
			this.m_labName.text = cfg.description;
		}
		/**点击前往回调 */
		private onBtnGoClick() {
			UpManager.history();
			FunctionModel.funcToPanel(this.m_nCfgId);

			//let cfg = C.TurnPanelConfig[this.m_nCfgId];
			//if(!cfg) return;
			//Utils.open_view(cfg.page);
		}


	}
}