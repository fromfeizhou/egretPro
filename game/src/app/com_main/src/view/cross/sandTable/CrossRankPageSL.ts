module com_main {
	/**
	 * 个人排名奖 军团荣誉排名
	 */
	export class CrossRankPageSL extends CView {
		public static NAME = 'CrossRankPageSL';

		public m_pGroup: eui.Group;
		public m_itemList: eui.List;

		private m_tCollections: eui.ArrayCollection;
		private m_nType: RankType;	//排行榜类型

		public constructor(type: RankType) {
			super();
			this.name = CrossRankPageSL.NAME;
			this.initType(type);
			this.initApp("cross/sandTable/CrossRankPageSLSkin.exml");
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage(isclear);
		}

		public onDestroy(): void {
			super.onDestroy();
		}

		private initType(type: RankType) {
			this.m_nType = type;
			switch (this.m_nType) {
				case RankType.CROSS_SERVER_PLAYER_RANK: {
					this.currentState = 'single';
					break;
				}
				case RankType.CROSS_SERVER_UNION_RANK: {
					this.currentState = 'legion';
					break;
				}
			}
			this.validateNow();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			Utils.toStageBestScaleHeigt(this);
			this.m_tCollections = new eui.ArrayCollection([]);
			this.m_itemList.itemRenderer = CrossRankCell;
			this.m_itemList.dataProvider = this.m_tCollections;

			this.Refresh();
		}


		/**刷新页面 */
		public Refresh(): void {
			switch (this.m_nType) {
				case RankType.CROSS_SERVER_PLAYER_RANK: {
					this.refreshPlayer();
					break;
				}
				case RankType.CROSS_SERVER_UNION_RANK: {
					this.refreshGuild();
					break;
				}
			}
		}

		/**刷新个人 */
		private refreshPlayer() {
			let [list, owner] = RankModel.getNormalData(RankType.CROSS_SERVER_PLAYER_RANK);
			if (list) {
				let res: RankItemRD[] = [];
				for (let i = 0; i < list.length; i++) {
					res.push({ type: this.m_nType, param: list[i], rank: 0 });
				}
				this.m_tCollections.replaceAll(res);
			}
		}

		/**刷新军团 */
		private refreshGuild() {
			let [list, owner] = RankModel.getCrossLegionRankData();
			if (list) {
				let res: RankItemRD[] = [];
				for (let i = 0; i < list.length; i++) {
					res.push({ type: this.m_nType, param: list[i], rank: 0 });
				}
				this.m_tCollections.replaceAll(res);
			}
		}
	}

    /**
	 * 个人排行奖 军团荣誉排名
	 */
	export class CrossRankCell extends eui.ItemRenderer {
		public m_RankLab: com_main.CLabel;
		public m_RankImg: com_main.CImage;
		public m_pMilitoryValue: com_main.CLabel;
		public m_PlayerName: com_main.CLabel;
		public m_PlayerHead: com_main.ComHeadItem;
		public m_imgLegion: com_main.CImage;
		public m_labName: com_main.CLabel;
		public m_plbNoAward: com_main.CLabel;
		public m_RewardRoot: eui.List;


		private m_tCollections: eui.ArrayCollection;
		private m_tData: RankItemRD;
		private m_bInit: boolean;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/cross/sandTable/CrossRankCellSkin.exml");
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
			if (this.m_PlayerHead) EventManager.addTouchTapListener(this.m_PlayerHead, this, this.onShowPlayerIntroView);
		}

		private onShowPlayerIntroView() {
			let data: gameProto.ICommRank = this.m_tData.param;
			// if (data && data.playerHead && data.playerHead.playerId != RoleData.playerId) {
			if (data && data.playerHead) {
				NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(data.playerHead.playerId);
			}
		}

		public dataChanged() {
			super.dataChanged();

			this.m_tCollections = new eui.ArrayCollection([]);
			this.m_RewardRoot.dataProvider = this.m_tCollections;
			this.m_RewardRoot.itemRenderer = MilitoryAwardRender;
			this.Refresh();
		}

		private Refresh(): void {
			this.m_tData = this.data;
			if (!this.m_tData) return;

			this.refreshView();
			this.Refresh_Rank();
			this.Refresh_Award();
			this.Refresh_Militory();
		}

		private refreshView(): void {
			switch (this.m_tData.type) {
				case RankType.CROSS_SERVER_PLAYER_RANK: {
					if (!this.m_bInit) {
						this.m_bInit = true;
						this.currentState = 'single';
						this.commitProperties();
					}
					this.Refresh_Player();
					break;
				}
				case RankType.CROSS_SERVER_UNION_RANK: {
					if (!this.m_bInit) {
						this.m_bInit = true;
						this.currentState = 'legion';
						this.commitProperties();
					}
					this.Refresh_Legion();
					break;
				}
			}
		}

		/**刷新排行 */
		private Refresh_Rank(): void {
			RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, this.m_tData.param.rank);
		}

		/**刷新玩家信息 */
		private Refresh_Player(): void {
			let data = this.m_tData.param as gameProto.ICommRank;
			let headInfo = data.playerHead;
			this.m_PlayerName.text = headInfo.playerName;
			this.m_PlayerHead.info = headInfo;
		}

		/**刷新联盟排行 */
		private Refresh_Legion() {
			let data: gameProto.IRankLegionMessage = this.m_tData.param;
			this.m_labName.text = data.legionName;
			this.m_imgLegion.source = LegionModel.getLegionCountryImage(data.countryId);
		}

		/**
 		* 刷新战功有关的
 		*/
		private Refresh_Militory(): void {
			if (this.m_pMilitoryValue && this.m_tData.param.value >= 0) {
				this.m_pMilitoryValue.text = this.m_tData.param.value.toString(10);
			}
		}

		/**刷新奖励 */
		private Refresh_Award(): void {
			// this.m_plbNoAward.visible = (this.m_tData.param.playerHead.playerId == RoleData.playerId) && (this.m_tData.param.rank == 0 || this.m_tData.param.rank == -1);
			this.m_plbNoAward.visible = false;
			let realType = CrossRewardType.SINGLE;
			if (this.m_tData.type == RankType.CROSS_SERVER_PLAYER_RANK) {
				realType = CrossRewardType.SINGLE;
			} else if (this.m_tData.type == RankType.CROSS_SERVER_UNION_RANK) {
				realType = CrossRewardType.LEGION;
			}
			let militoryAwardCfg = CrossModel.getCrossServerRewardConfig(realType, this.m_tData.param.rank);
			if (!militoryAwardCfg) return;
			let items = militoryAwardCfg.reward;
			this.m_tCollections.replaceAll(items);
		}
	}
}
