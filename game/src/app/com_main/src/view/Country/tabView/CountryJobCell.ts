module com_main {
	export class CountryJobCell extends CComponent {
		public static NAME = 'CountryJobCell';

		public m_RoleHead:com_main.ComHeadItem;
		public m_JobName:com_main.CLabel;
		public m_PlayerName:com_main.CLabel;
		public m_exploitBg:eui.Image;
		public m_exploitLb:eui.Label;

		private _jobConfig: JobConfig;
		private _jobInfo: JobInfo;
		private m_tJob: number;
		public GetJobId(): number {
			return this._jobConfig.id;
		}

		public constructor() {
			super();
			this.name = CountryJobCell.NAME;
			this.skinName = Utils.getSkinName("app/Country/CountryJobCellSkin.exml");
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		public Init(jobId: number) {
			this.m_tJob = jobId;
			this.refreshData();
			this.Refresh();
		}

		public Refresh(): void {
			this.refreshData();
			this.Refresh_RoleHead();
			this.Refresh_JobName();
			this.Refresh_PlayerName();
		}
		public refreshData() {
			this._jobInfo = CountryModel.JobInfos[this.m_tJob];
			this._jobConfig = C.JobConfig[this.m_tJob];
		}
		private Refresh_RoleHead(): void {
			let headId: number = 0;
			if (this._jobInfo != null && this._jobInfo.PlayerInfo != null){
				this.m_RoleHead.info = { type: 1, url:this._jobInfo.PlayerInfo.roleHead.toString(), official: 0, vip: 0 };

				this.m_exploitLb.text = GCodeFromat(CLEnum.STATE_GZ_ZG,this._jobInfo.PlayerInfo.warMerits);
			}else{
				this.m_RoleHead.info = null;
				if(this._jobConfig.autoAllocation){
					this.m_exploitLb.text = GCodeFromat(CLEnum.STATE_GZ_ZG,CommonUtils.numOutLenght(this._jobConfig.condition));
				}
			}
		}

		private Refresh_JobName(): void {
			this.m_JobName.text = GLan(this._jobConfig.name);
		}

		private Refresh_PlayerName(): void {
			if (this._jobInfo == null || this._jobInfo.PlayerInfo.playerId == 0) {
				this.m_PlayerName.text = GCode(CLEnum.STATE_GZ_EMPTY);
			}
			else {
				this.m_PlayerName.text = this._jobInfo.PlayerInfo.name;
			}
		}
	}
}