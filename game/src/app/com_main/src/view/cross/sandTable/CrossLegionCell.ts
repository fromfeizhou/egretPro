module com_main {
	/**跨服战场军团 */
	export class CrossLegionCell extends CComponent {
		public static NAME = 'CrossLegionCell';

		public m_RankLab: com_main.CLabel;
		public m_pMilitoryValue: com_main.CLabel;
		public m_pPower: com_main.CLabel;
		public m_pTroops: com_main.CLabel;
		public m_PlayerName: com_main.CLabel;
		public m_PlayerHead: com_main.ComHeadItem;
		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("cross/sandTable/CrossLegionCellSkin.exml");
			this.name = CrossLegionCell.NAME;
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.addEvent();
		}

		public onDestroy(): void {
			this.removeEvent();
			super.onDestroy();
		}
		/**添加监听事件 */
		private addEvent() {

		}

		/**移除监听事件 */
		private removeEvent() {
			EventManager.removeEventListeners(this);
		}
	}
}