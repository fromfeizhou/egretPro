module com_main {
	export class CountryPlayerJob extends CComponent {
		public static NAME = 'CountryPlayerJob';

		private m_Head: ComHeadItem;
		private m_PlayerName: CLabel;
		private m_JobName: CLabel;

		public constructor() {
			super();
			this.name = CountryPlayerJob.NAME;
			this.skinName = Utils.getSkinName("app/Country/CountryPlayerJobSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();
		}
		public SetPlayerJob(jobId: number, playerName: string, headId: number): void {
			this.SetJobName(jobId);
			this.SetPlayerName(playerName);
			this.SetHead(headId);
		}
		public SetJobName(jobId: number) {
			let jobCfg: JobConfig = C.JobConfig[jobId];
			if (jobCfg) {
				this.m_JobName.text = GLan(jobCfg.name);
				return;
			}
			this.m_JobName.text = GCode(CLEnum.STATE_GZ_EMPTY);
		}
		public SetPlayerName(playerName: string) {
			this.m_PlayerName.text = Utils.isNullOrEmpty(playerName) ? GCode(CLEnum.STATE_GZ_EMPTY) : playerName;
		}
		public SetHead(headId: number) {
			if(headId ==0){
				this.m_Head.info = null;
			}else{
				this.m_Head.info = { type: 1, url: headId.toString(), official: 0, vip: 0 };
			}
		}
	}
}