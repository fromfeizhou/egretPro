module com_main {
	export class CountryCoronationPanel extends CView {
		public static NAME = 'CountryCoronationPanel';

		public m_pTitle: eui.Image;
		public m_pName: com_main.CLabel;


		private m_notice: gameProto.IKingChangeNotice;
		public constructor(notice: gameProto.IKingChangeNotice) {
			super();

			this.initApp("Country/CountryCoronationPanelSkin.exml");
			this.m_notice = notice;
		}

		public onDestroy() {
			EventManager.removeEventListeners(this);
			super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.CORONA_VIEW]);
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.initEvent();
			// let kingInfo: gameProto.CountryPlayerInfo = CountryModel.King_PlayerInfo;
			let coutryStr: string = WorldModel.checkCountry(this.m_notice.countryId)
			let desctr = GCodeFromat(CLEnum.STATE_KING_TIPS, this.m_notice.playerName, coutryStr);
			this.m_pName.textFlow = Utils.htmlParser(desctr);
			this.m_pTitle.source = `lb_jmww${this.m_notice.countryId}_png`
		}

		/**=====================================================================================
	   * 事件监听 begin
	   * =====================================================================================
	   */

		private initEvent() {
			EventManager.addTouchScaleListener(this, this, this.onClick);
		}
		/**跳转前往 */
		public onClick() {
			UpManager.history();
		}

	}
}