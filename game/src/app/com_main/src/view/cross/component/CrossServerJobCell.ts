module com_main {
	export class CrossServerJobCell extends CComponent {
		public static NAME = 'CountryJobCell';
		public m_RoleHead: com_main.ComHeadItem;
		public m_JobName: com_main.CLabel;
		public m_PlayerName: com_main.CLabel;
		public m_troopCout: com_main.CLabel;


		private m_commanderDataVo: gameProto.ICommanderDataVo//统帅数据
		private m_jName: string;
		private m_server: number
		public constructor() {
			super();
			this.name = CrossServerJobCell.NAME;
			this.skinName = Utils.getSkinName("app/cross/component/CrosssServerJobCellSkin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public Init(data: gameProto.ICommanderDataVo, jobName: string = "", serverId: number = 0) {
			this.m_commanderDataVo = data;
			this.m_jName = jobName;
			this.m_server = serverId;
			this.Refresh();
		}

		public Refresh(): void {
			this.Refresh_RoleHead();
			this.Refresh_JobName();
			this.Refresh_PlayerName();
			this.Refresh_Troop();
		}

		private Refresh_RoleHead(): void {
			if (this.m_commanderDataVo != null) {
				this.m_RoleHead.info = { type: 1, url: this.m_commanderDataVo.head.toString(), official: 0, vip: this.m_commanderDataVo.vipLevel };
			} else {
				this.m_RoleHead.info = null;
			}
		}

		private Refresh_JobName(): void {
			this.m_JobName.text = this.m_jName;
		}
		private Refresh_Troop(): void {
			if (this.m_commanderDataVo == null || this.m_commanderDataVo.troopNum == 0) {
				this.m_troopCout.text = GCode(CLEnum.CROSS_TIPS1);
				return;
			}
			this.m_troopCout.text = this.m_server == 0 ? GCodeFromat(CLEnum.CROSS_GEN_TROOP, this.m_commanderDataVo.troopNum) : GCodeFromat(CLEnum.CROSS_KING_TROOP, this.m_server, this.m_commanderDataVo.troopNum)
		}
		private Refresh_PlayerName(): void {
			if (this.m_commanderDataVo == null || Utils.isNullOrEmpty(this.m_commanderDataVo.nickName)) {
				this.m_PlayerName.text = GCode(CLEnum.CROSS_TIPS1);
			} else {
				this.m_PlayerName.text = this.m_commanderDataVo.nickName;
			}
		}
	}
}