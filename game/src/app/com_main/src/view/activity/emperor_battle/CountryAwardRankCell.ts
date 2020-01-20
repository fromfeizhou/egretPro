module com_main {
	/**
	 * 国家战功排行奖励
	 */
	export class CountryAwardRankCell extends eui.ItemRenderer {
		public m_RankLab: com_main.CLabel;
		public m_RankImg: com_main.CImage;
		public m_pMilitoryValue: com_main.CLabel;
		public m_comState: com_main.ComState;
		public m_plbNoAward: com_main.CLabel;
		public m_RewardRoot: eui.List;

		private m_tCollections: eui.ArrayCollection;

		private m_tData: { countryId: number, value?: number, rank?: number };
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/activity/emperorBattle/rankReward/CountryAwardRankCellSkin.exml");
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy(): void {
			EventManager.removeEventListeners(this);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.m_plbNoAward.visible = false;
		}

		public dataChanged() {
			super.dataChanged();
			this.Refresh();
		}

		private Refresh(): void {
			this.m_tData = this.data;
			if (!this.m_tData) return;
			this.Refresh_Rank();
			this.Refresh_Country();
			this.Refresh_Award();
			this.Refresh_Militory();
		}

		/**刷新排行 */
		private Refresh_Rank(): void {
			RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, this.m_tData.rank);
		}

		/**刷新国家信息 */
		private Refresh_Country(): void {
			this.m_comState.stateId = this.m_tData.countryId;
		}

		/**
 		* 刷新战功有关的
 		*/
		private Refresh_Militory(): void {
			if (this.m_pMilitoryValue && this.m_tData.value >= 0) {
				this.m_pMilitoryValue.text = this.m_tData.value.toString(10);
			}
		}

		/**刷新奖励 */
		private Refresh_Award(): void {
			let militoryAwardCfg: XiangyangCountryRankRewardConfig = C.XiangyangCountryRankRewardConfig[this.m_tData.rank];
			this.m_tCollections = new eui.ArrayCollection([]);
			this.m_RewardRoot.dataProvider = this.m_tCollections;
			this.m_RewardRoot.itemRenderer = MilitoryAwardRender;
			if (!militoryAwardCfg) return;
			let items = Utils.parseCommonItemJson(militoryAwardCfg.reward);
			this.m_tCollections.replaceAll(items);

		}
	}
}