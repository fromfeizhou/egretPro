module com_main {
	/**
	 * 个人战功排行奖励
	 */
    export class KillRankAwardView extends CView {
        public static NAME = 'KillRankAwardView';
        public m_pRScroller: eui.Scroller;
        public m_pRankList: eui.List;
        public m_SelfItemGroup: eui.Group;
        public m_SelfItem: com_main.KillRankAwardCell;
        public m_plbNoAward: com_main.CLabel;

        private m_tCollections: eui.ArrayCollection;
        public constructor(width: number, height: number) {
            super();
            this.name = KillRankAwardView.NAME;
            // this.width = width;
            // this.height = height;
            this.initApp("activity/emperorBattle/rankReward/KillRankAwardRankViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            Utils.toStageBestScaleHeigt(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_pRankList.itemRenderer = KillRankAwardCell;
            this.m_pRankList.dataProvider = this.m_tCollections;

            this.Refresh();
        }


        /**刷新页面 */
        public Refresh(): void {
            this.Refresh_SelfItem();
            this.Refresh_ItemDatas();
        }

        /**刷新自己的排名数据 */
        private Refresh_SelfItem(): void {
            let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
            let ownerPlayer = vo.getPlayerRankData();
            this.m_SelfItem.visible = ownerPlayer != null;
            // this.m_pRScroller.bottom = 132;
            if (this.m_SelfItem.visible) {
                this.m_SelfItem.data = ownerPlayer;
            }
        }

        /**刷新排行榜列表数据 */
        private Refresh_ItemDatas(): void {
            let vo = ActivityModel.getActivityVo<AcEmperorBattleVO>(AcViewType.XIANGYANG);
            let list = vo.getRankData();
			if (isNull(list)) return;
            let awardRankList = [];
            for (let i = 0; i < list.length; i++) {
                awardRankList.push(list[i]);
            }
            this.m_tCollections.replaceAll(awardRankList);
        }

        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
            }
        }
    }

    /**
	 * 个人排行奖励
	 */
	export class KillRankAwardCell extends eui.ItemRenderer {
		public m_RankLab: com_main.CLabel;
		public m_RankImg: com_main.CImage;
		public m_pMilitoryValue: com_main.CLabel;
		public m_comState: com_main.ComState;
		public m_PlayerName: com_main.CLabel;
		public m_PlayerLegion: com_main.CLabel;
		public m_PlayerHead: com_main.ComHeadItem;
		public m_plbNoAward: com_main.CLabel;
		public m_RewardRoot: eui.List;

		private m_tCollections: eui.ArrayCollection;

		private m_tData: gameProto.ICommRank;
		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/activity/emperorBattle/rankReward/KillRankAwardCellSkin.exml");
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

		}
		public dataChanged() {
			super.dataChanged();
			this.Refresh();
		}

		private Refresh(): void {
			this.m_tData = this.data;
			if (!this.m_tData) return;
			this.Refresh_Rank()
			this.Refresh_Player();
			this.Refresh_Country();
			this.Refresh_Award();
			this.Refresh_Militory();
			// this.refreshLegion();
		}
		/**刷新排行 */
		private Refresh_Rank(): void {
			RankModel.refreshRankIcon(this.m_RankImg,this.m_RankLab,this.m_tData.rank);
		}
		/**刷新玩家信息 */
		private Refresh_Player(): void {
			let headInfo = this.m_tData.playerHead;
			this.m_PlayerName.text = headInfo.playerName;
			this.m_PlayerHead.info = headInfo;
		}
		/**刷新国家信息 */
		private Refresh_Country(): void {
			this.m_comState.stateId = this.m_tData.playerHead.countryId;

		}
		/**
 		* 刷新战功有关的
 		*/
		private Refresh_Militory(): void {
			if (this.m_pMilitoryValue && this.m_tData.value>=0) {
				this.m_pMilitoryValue.text = this.m_tData.value.toString(10);
			}

		}
		/**刷新奖励 */
		private Refresh_Award(): void {
			this.m_plbNoAward.visible = (this.m_tData.playerHead.playerId == RoleData.playerId) && (this.m_tData.rank == 0 || this.m_tData.rank == -1)
			let militoryAwardCfg: XiangyangPlayerRankRewardConfig = C.XiangyangPlayerRankRewardConfig[this.m_tData.rank];
			this.m_tCollections = new eui.ArrayCollection([]);
			this.m_RewardRoot.dataProvider = this.m_tCollections;
			this.m_RewardRoot.itemRenderer = MilitoryAwardRender;
			if (!militoryAwardCfg)
				return;
			let items = Utils.parseCommonItemJson(militoryAwardCfg.reward);
			this.m_tCollections.replaceAll(items);

		}
	}
}