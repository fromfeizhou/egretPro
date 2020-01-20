module com_main {
	/**
	 * 排行榜主界面
	 */
	export class RankListPage extends CComponent {
		public static NAME = "RankListPage";
		public m_pGroup: eui.Group;
		public m_ItemList: eui.List;
		public m_ownerItem: com_main.RankItemRender;

		private m_tCollection: eui.ArrayCollection;
		private m_ownerItemGroup: eui.Group;

		private m_nType: RankType;	//排行榜类型；
		public constructor(type: RankType) {
			super();
			this.name = RankListPage.NAME;

			this.initType(type);
			this.skinName = Utils.getSkinName("app/rank/rank_list_page.exml");
		}

		private initType(type: RankType) {
			this.m_nType = type;

			switch (this.m_nType) {
				case RankType.PLAYER: {
					this.currentState = 'power';
					break;
				}
				case RankType.GENREAL:
				case RankType.ONEHERO: {
					this.currentState = 'general';
					break;
				}
				case RankType.LEGION: {
					this.currentState = 'legion';
					break;
				}
				case RankType.MILLTORY: {
					this.currentState = 'militory';
					break;
				}
				case RankType.COUNTRY: {
					this.currentState = 'country';
					break;
				}
			}
			this.validateNow();
		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}


		public onDestroy(): void {
			super.onDestroy();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			Utils.toStageBestScaleHeigt(this);
			this.m_tCollection = new eui.ArrayCollection();
			this.m_ItemList.itemRenderer = RankItemRender;
			this.m_ItemList.dataProvider = this.m_tCollection;
		}

		public Refresh(): void {
			switch (this.m_nType) {
				case RankType.PLAYER: {
					this.refreshPower();
					break;
				}
				case RankType.GENREAL:{
					this.refreshGeneral();
					break;
				}
				case RankType.ONEHERO: {
					this.refreshGeneralSingle();
					break;
				}
				case RankType.LEGION: {
					this.refreshLegion();
					break;
				}
				case RankType.COUNTRY: {
					this.refreshCountry();
					break;
				}
			}
		}

		/**刷新战力 */
		private refreshPower() {
			let [list, owner] = RankModel.getNormalData(RankType.PLAYER);
			if (list) {
				let res: RankItemRD[] = [];
				for (let i = 0; i < list.length; i++) {
					res.push({ type: this.m_nType, param: list[i], rank: 0 });
				}
				this.m_tCollection.replaceAll(res);
				if (owner) {
					this.m_ownerItem.visible = true;
					this.m_ownerItem.data = { type: this.m_nType, param: owner };
					this.m_ownerItem.refreshMobi(false);
					return;
				}

			}
			this.m_ownerItem.visible = true;

			let fight = GeneralModel.getGeneralTotalFight()
			this.m_ownerItem.data = { type: this.m_nType, param: { rank: -1, value: fight, playerHead: { type: RoleData.headType, url: RoleData.headId.toString(), playerName: RoleData.nickName, countryId: RoleData.countryId,vip:RoleData.vipLevel } } }
			this.m_ownerItem.refreshMobi(false);
		}

		/**刷新武将 */
		private refreshGeneral() {
			let list = RankModel.getGenRankData();
			if (list) {
				let res: RankItemRD[] = [];
				for (let i = 0; i < list.length; i++) {
					res.push({ type: this.m_nType, param: list[i], rank: 0 });
				}
				this.m_tCollection.replaceAll(res);
			}
		}

		/**刷新武将单个 */
		private refreshGeneralSingle() {
			let list = RankModel.getGenSingleRankData();
			if (list) {
				let res: RankItemRD[] = [];
				for (let i = 0; i < list.length; i++) {
					res.push({ type: this.m_nType, param: list[i], rank: 0 });
				}
				this.m_tCollection.replaceAll(res);
			}
		}

		/**刷新联盟 */
		private refreshLegion() {
			let [list, owner] = RankModel.getLegionRankData();
			if (list) {
				let res: RankItemRD[] = [];
				for (let i = 0; i < list.length; i++) {
					res.push({ type: this.m_nType, param: list[i], rank: 0 });
				}
				this.m_tCollection.replaceAll(res);
				if (owner) {
					this.m_ownerItem.visible = true;
					this.validateNow();
					this.m_ownerItem.data = { type: this.m_nType, param: owner };
					return;
				}
			}
			this.m_ownerItem.visible = false;
		}

		/**刷新国家 */
		private refreshCountry() {
			let list = RankModel.getCountryRankData();
			if (list) {
				let res: RankItemRD[] = [];
				for (let i = 0; i < list.length; i++) {
					res.push({ type: this.m_nType, param: list[i], rank: i + 1 });
				}
				this.m_tCollection.replaceAll(res);
			}
			this.m_ownerItem.visible = false;
		}

	}
}