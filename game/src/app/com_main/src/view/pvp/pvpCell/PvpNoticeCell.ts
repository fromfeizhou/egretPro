module com_main {
	export class PvpNoticeCell extends eui.ItemRenderer {

		public m_pPlayerName: com_main.CLabel;
		public m_pLbForce: eui.BitmapLabel;
		public m_comState: com_main.ComState;
		public m_pBattleState: com_main.CImage;
		public m_pScoreState: com_main.CImage;
		public m_pRank: com_main.CLabel;
		public m_pTime: com_main.CLabel;
		public m_pHead: com_main.ComHeadItem;

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("pvp_arena/PvpNoticeCellSkin.exml");//Utils.getSkinName("app/pvp/pvpCell/PvpArenaRankCellSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.init();
		}

		private init() {
		}

		public dataChanged(): void {
			super.dataChanged();
			this.updateView(this.data);
		}

		private updateView(data: ApkChallengeHisVo) {

			this.m_comState.stateId = data.countryId;
			this.m_pPlayerName.text = data.playerName;
			this.m_pLbForce.text = data.force + "";
			this.m_pBattleState.source = data.challengeWin ? "lb_cg_png" : "lb_sb_png";
			this.m_pRank.text = Math.abs(data.modifyRank) + "";
			this.m_pScoreState.visible = data.modifyRank != 0;
			this.m_pScoreState.source = data.challengeWin ? "com_state_up_png" : "com_state_down_png";
			let time = TimerUtils.getServerTimeMill() - data.challengeTime;
			var t = Math.floor(time * 0.001 / 3600);
			if (t > 0) {
				if (t > 24) {
					this.m_pTime.text = GCodeFromat(CLEnum.ARENA_TIME, Math.floor(t / 24));
				}
				else {
					this.m_pTime.text = GCodeFromat(CLEnum.ARENA_TIME1, t);
				}
			}
			else {
				this.m_pTime.text = GCodeFromat(CLEnum.ARENA_TIME2, Math.floor(time * 0.001 / 60));
			}
			this.m_pHead.info = { type: 1, url: data.head.toString(), official: 0, vip: 0 };
		}
	}
}