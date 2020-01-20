module com_main {
	export class PvpArenaRankCell extends eui.ItemRenderer {

		public m_pLbPlayerName: com_main.CLabel;
		public m_pGeneral0: com_main.GeneralPvpHeadItem;
		public m_pGeneral1: com_main.GeneralPvpHeadItem;
		public m_pGeneral2: com_main.GeneralPvpHeadItem;
		public m_pGeneral3: com_main.GeneralPvpHeadItem;
		public m_pGeneral4: com_main.GeneralPvpHeadItem;
		public m_pLPower: com_main.CLabel;
		public m_pReward_0: com_main.ComItemNew;
		public m_pReward_1: com_main.ComItemNew;
		public m_pRankItem: com_main.ComRankNumItem;
		public m_comState: com_main.ComState;


		private generalList: GeneralPvpHeadItem[];

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("pvp_arena/PvpArenaRankCellSkin.exml");//Utils.getSkinName("app/pvp/pvpCell/PvpArenaRankCellSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.init();
			this.cacheAsBitmap = true;
		}

		private init() {
			this.generalList = [];
			for (let i = 0; i < 5; i++) {
				this.generalList.push(this["m_pGeneral" + i]);
			}
		}

		public dataChanged(): void {
			super.dataChanged();
			this.updateView(this.data);
		}

		public updateView(data: any) {
			if (!data) return;
			let rankVo = data as ApkRankVo;
			let generalDatas = rankVo.generalWinInfo;

			for (let i = 0; i < this.generalList.length; i++) {
				if (generalDatas[i]) {
					this.generalList[i].setGeneralArena(generalDatas[i]);
					this.generalList[i].visible = true;
				} else
					this.generalList[i].setGeneralArena(null);
				//this.generalList[i].visible = false;
			}
			this.m_pLbPlayerName.text = rankVo.playerName;
			this.m_pRankItem.setRankNum(rankVo.rank);
			this.m_comState.stateId = rankVo.countryId;
			this.m_pLPower.text = CommonUtils.numOutLenght(data.force);
			for (let index = 0; index < 2; index++) {
				let itemView: ComItemNew = this["m_pReward_" + index];
				let rewardList = rankVo.rewardList;
				if (rewardList && rewardList[index]) {
					itemView.setItemInfo(rewardList[index].itemId, rewardList[index].count);
					if (!itemView.visible)
						itemView.visible = true;
				} else {
					itemView.visible = false;
				}
			}
		}
	}
}