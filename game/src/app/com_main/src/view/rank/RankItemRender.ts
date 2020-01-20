module com_main {
	export interface RankItemRD {
		type: RankType;
		param: any;
		rank: number;
	}
	/**
	 * 排行榜单项
	 */
	export class RankItemRender extends eui.ItemRenderer {

		public m_RankLab: com_main.CLabel;
		public m_RankImg: com_main.CImage;
		public m_labPower: com_main.CLabel;
		public m_labExploit: com_main.CLabel;
		public m_labKillNum: com_main.CLabel;
		public m_imgLegion: com_main.CImage;
		public m_labName: com_main.CLabel;
		public m_labCapi: com_main.CLabel;
		public m_labtown: com_main.CLabel;
		public m_labCoun: com_main.CLabel;
		public m_comState: com_main.ComState;
		public m_labPlayerName: com_main.CLabel;
		public m_genHead: com_main.GeneralHeadRender;
		public m_comHead: com_main.ComHeadItem;
		public m_pBtnMb: com_main.ComButton;
		public m_labMobai: com_main.CLabel;

		private m_tData: RankItemRD;
		private m_bInit: boolean;

		public constructor() {
			super();
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
			this.m_pBtnMb.setTitleLabel('膜拜');
			if (this.m_comHead)
				EventManager.addTouchTapListener(this.m_comHead, this, this.onShowPlayerIntroView);
			if (this.m_genHead)
				EventManager.addTouchTapListener(this.m_genHead, this, this.onShowPlayerIntroView2);
			if (this.m_imgLegion)
				EventManager.addTouchTapListener(this.m_imgLegion, this, this.onShowLegionIntroView);
			if (this.m_pBtnMb)//膜拜
				EventManager.addTouchTapListener(this.m_pBtnMb, this, this.onMoBaiHander);


		}

		private onShowPlayerIntroView() {
			let data: gameProto.ICommRank = this.m_tData.param;
			if (data && data.playerHead && data.playerHead.playerId != RoleData.playerId) {
				NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(data.playerHead.playerId);
			}
		}

		private onShowPlayerIntroView2() {
			let data: gameProto.IHeroRank = this.m_tData.param;
			if (data && data.playerId && data.playerId != RoleData.playerId) {
				GeneralModel.getClickGenInfo(data);
				GeneralProxy.send_GENERAL_DETAIL(data.playerId, data.heroId);
			}
		}
		private onShowLegionIntroView() {
			let data: gameProto.IRankLegionMessage = this.m_tData.param;
			if (data && data.legionId && data.legionId != RoleData.alliance) {
				LegionModel.getClickGuildInfo(data);
				NormalProxy.C2S_RANK_GUILD(data.legionId);
			}
		}
		private onMoBaiHander() {
			let player = this.m_tData.param.playerHead;
			if (player && player.playerId && player.playerId != RoleData.playerId) {
				WorshipProxy.send_C2S_WORSHIP(WorshipType.FIGHT_RANK, this.m_tData.param.rank);
			} else {
				EffectUtils.showTips('不能膜拜自己', 1, true);
			}

		}

		public dataChanged() {
			super.dataChanged();
			if (!this.data) return;
			this.m_tData = this.data;
			this.refreshView();
		}


		private refreshView(): void {
			switch (this.m_tData.type) {
				case RankType.PLAYER: {
					if (!this.m_bInit) {
						this.m_bInit = true;
						this.currentState = 'power';
						this.commitProperties();
					}
					this.refrehPower();
					break;
				}
				case RankType.GENREAL:
				case RankType.ONEHERO: {
					if (!this.m_bInit) {
						this.m_bInit = true;
						this.currentState = 'general';
						this.commitProperties();
					}
					this.refrehGeneral();
					break;
				}
				case RankType.LEGION: {
					if (!this.m_bInit) {
						this.m_bInit = true;
						this.currentState = 'legion';
						this.commitProperties();
					}
					this.refrehLegion();
					break;
				}
				case RankType.COUNTRY: {
					if (!this.m_bInit) {
						this.m_bInit = true;
						this.currentState = 'country';
						this.commitProperties();
					}
					this.refreshCountry();
					break;
				}
			}
		}

		/**刷新战力排行 */
		private refrehPower() {
			let data: gameProto.ICommRank = this.m_tData.param;
			this.refreshRankIcon(data.rank);
			this.m_comHead.info = data.playerHead;
			this.m_labName.text = data.playerHead.playerName;
			this.m_comState.stateId = data.playerHead.countryId;
			this.m_labPower.text = data.value.toString(10);
			if (data.rank <= 3 && data.rank > -1) {
				let mobaiVo = WorshipModel.getStateByType(WorshipType.FIGHT_RANK);//排行榜id获取是否可以膜拜
				if (mobaiVo) {
					RedPointModel.AddInfoListener(this.m_pBtnMb, { x: this.m_pBtnMb.width - 22, y: -3 }, [RedEvtType.FIGHT_RANK_WORSHIP], 3);
					this.m_pBtnMb.visible = true;
					this.m_labMobai.visible = false;
				} else {
					this.m_pBtnMb.visible = false;
					this.m_labMobai.visible = true;
					let info = WorshipModel.getWorshipData(WorshipType.FIGHT_RANK, data.rank);
					if (info) {
						this.m_labMobai.text = info.beWorshipCount <= 0 ? '膜拜人数：1' : '膜拜人数：' + info.beWorshipCount;
					} else {
						this.m_labMobai.text = '膜拜人数：1'
					}
				}
			} else {
				this.m_pBtnMb.visible = false;
				this.m_labMobai.visible = false
			}
		}
		public refreshMobi(visible: boolean = true) {
			this.m_pBtnMb.visible = visible;
			this.m_labMobai.visible = visible
		}
		/**刷新武将排行 */
		private refrehGeneral() {
			let data: gameProto.IHeroRank = this.m_tData.param;
			this.refreshRankIcon(data.rank);
			this.m_genHead.setGenViewInfo(data.heroId);
			GeneralModel.setLabGaneralName(data.heroId, this.m_labName);
			this.m_labPower.text = data.value.toString(10);

			this.m_comState.stateId = data.countryId;
			this.m_labPlayerName.text = data.nickName;
		}

		/**刷新工会排行 */
		private refrehLegion() {
			let data: gameProto.IRankLegionMessage = this.m_tData.param;
			this.refreshRankIcon(data.rank);

			this.m_labName.text = data.legionName;
			this.m_labPower.text = data.value.toString(10);
			this.m_comState.stateId = data.countryId;
			this.m_imgLegion.source = LegionModel.getLegionCountryImage(data.countryId);
		}

		/**国家排行 */
		private refreshCountry() {
			let data: gameProto.IRankCountryMessage = this.m_tData.param;
			this.refreshRankIcon(this.m_tData.rank);
			this.m_labCapi.text = `${data.citySize[CityLevel.CAPITAL - 1]}`
			this.m_labtown.text = `${data.citySize[CityLevel.TOWN - 1]}`
			this.m_labCoun.text = `${data.citySize[CityLevel.COUNTY - 1]}`
			this.m_labPlayerName.visible = data.kingHead != null;
			this.m_labPlayerName.text = data.kingHead ? `${data.kingHead.playerName}` : ''
			this.m_comState.stateId = data.countryId;
			this.m_comHead.info = data.kingHead;
		}

		/**刷新排名图标 */
		private refreshRankIcon(rank: Number): void {
			RankModel.refreshRankIcon(this.m_RankImg, this.m_RankLab, rank);
		}

	}
}