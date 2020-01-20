module com_main {
	/**国家官职任命 */
	export class CountryJobInfoWnd extends CView {
		public static NAME = 'CountryJobInfoWnd';

		public m_pViewRoot: eui.Group;
		public m_RoleImg: com_main.CImage;
		public m_LegionName: com_main.CLabel;
		public m_PlayerName: com_main.CLabel;
		public m_PopUp: com_main.APopUp;
		public m_TitleJobName: com_main.CLabel;
		public m_JobLabel: com_main.CLabel;
		public m_JobDes: com_main.CLabel;
		public m_ConditionDes: com_main.CLabel;
		public m_Btn: com_main.ComButton;
		public m_MainTop: com_main.MainTopNew;

		private _jobConfig: JobConfig;
		private _jobName: string;
		private _jobInfo: JobInfo;
		private m_jobId: number;

		private readonly _btnName: string[] = [GCode(CLEnum.NONE), GCode(CLEnum.STATE_GZ_SR), GCode(CLEnum.STATE_GZ_XR),
		GCode(CLEnum.STATE_GZ_RM), GCode(CLEnum.STATE_GZ_GH)];
		private readonly _btnNameTpips: string[] = [GCode(CLEnum.NONE), GCode(CLEnum.STATE_GZ_SR_TIPS), GCode(CLEnum.STATE_GZ_XR_TIPS1),
		GCode(CLEnum.GUILD_APPLY_TIPS), GCode(CLEnum.GUILD_APPLY_TIPS)];
		private _btnModel: number = 0;//0-无, 1-禅让, 2-卸任, 3-任命, 4-更换

		public constructor(jobId: number) {
			super();
			this.name = CountryJobInfoWnd.NAME;
			this.skinName = Utils.getSkinName("app/Country/CountryJobInfoWndSkin.exml");
			this.InitView(C.JobConfig[jobId]);
			this.m_jobId = jobId;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			EventManager.addTouchScaleListener(this.m_Btn, this, this.OnClickBtn);
		}

		private InitView(jobCfg: JobConfig): void {
			this._jobConfig = jobCfg;
			this._jobInfo = CountryModel.JobInfos[jobCfg.id];

			this.m_PopUp.getCloseBtn().visible = false;
			this.m_PopUp.setTitleLabelVisible(false);
			this.m_PopUp.setBottomBorder();

			let jobName = C.JobConfig[this._jobConfig.id].name;
			this._jobName = GLan(jobName);
			this.Refresh();
			Utils.toStageBestScale(this.m_pViewRoot);
		}

		public Refresh(): void {
			this.Refresh_UserInfo();
			this.Refresh_JobInfo();
			this.Refresh_BtnInfo();
			this.Refresh_MainTop();
		}

		private Refresh_UserInfo(): void {
			let exist: boolean = this._jobInfo != null && this._jobInfo.PlayerInfo != null;
			if(!exist || Utils.isNullOrEmpty(this._jobInfo.PlayerInfo.name)){
				this.m_PlayerName.text = GCode(CLEnum.STATE_GZ_XWYD);
				this.m_RoleImg.source = 'icon_wj_b_0_png';
			}else{
				this.m_PlayerName.text = this._jobInfo.PlayerInfo.name;
				this.m_RoleImg.source = Utils.getPlayerBigHeadSource(1, this._jobInfo.PlayerInfo.roleHead.toString());
			}
			// this.m_PlayerName.text = (!exist || Utils.isNullOrEmpty(this._jobInfo.PlayerInfo.name)) ? GCode(CLEnum.STATE_GZ_XWYD) : this._jobInfo.PlayerInfo.name;
			this.m_LegionName.text = (!exist || Utils.isNullOrEmpty(this._jobInfo.PlayerInfo.legionName)) ? GCode(CLEnum.NONE) : this._jobInfo.PlayerInfo.legionName;
		}

		private Refresh_JobInfo(): void {
			this.m_TitleJobName.text = this._jobName;
			this.m_JobLabel.text = this._jobName + GCode(CLEnum.EFFECT);
			let jobInfoCfg = C.JobInfoConfig[this._jobConfig.effect];
			this.m_JobDes.text = GLan(jobInfoCfg.description);
			this.m_ConditionDes.text = GLan(jobInfoCfg.condition);
		}

		private Refresh_BtnInfo(): void {
			if (this._jobConfig.id == CountryModel.Self_PlayerInfo.jobId) {
				this._btnModel = this._jobConfig.id == 1 ? 1 : 2;
				if(this._jobConfig.id > 3){
					this.m_Btn.visible = false;
				}
			}
			else {
				let visibleBtn: boolean = false;

				if (CountryModel.Self_PlayerInfo.jobId != 0) {
					let jobConfig: JobConfig = C.JobConfig[CountryModel.Self_PlayerInfo.jobId];
					let allocationStr: string[] = jobConfig.allocation.split(',');
					visibleBtn = allocationStr.indexOf(this._jobConfig.id.toString()) >= 0;
				}

				this.m_Btn.visible = visibleBtn;
				// this._btnModel = (this._jobInfo != null && Long.fromValue(this._jobInfo.PlayerInfo.playerId).toNumber() != 0) ? 4 : 3;
				this._btnModel = 3;
			}

			this.m_Btn.setTitleLabel(this._btnName[this._btnModel]);
			CountryModel.curBtnStr = this._btnNameTpips[this._btnModel];
			CountryModel.curBtn = this._btnModel;
		}

		private Refresh_MainTop(): void {
			this.m_MainTop.setTitleName(this._jobName + GCode(CLEnum.MESSAGE));
		}

		private OnClickBtn(): void {
			if (this._btnModel == 2) {
				let tip: string = GCode(CLEnum.STATE_GZ_XR_TIPS);
				Utils.showConfirmPop(tip, () => {
					CountryProxy.send_COUNTRY_APPLY_JOB(this._jobConfig.id, 0);
					UpManager.history();
				}, this);
			}
			else {
				CountryModel.ApplyListViewParam = {};
				CountryModel.ApplyListViewParam.jobId = this._jobConfig.id;
				CountryModel.ApplyListViewParam.curState = "Job";
				CountryModel.ApplyListViewParam.btnName = this._btnName[this._btnModel];
				CountryModel.ApplyListViewParam.titleName = GCode(CLEnum.STATE_GZ);
				if(this._btnModel == 1){
					CountryProxy.send_COUNTRY_APPLY_LIST(2);
				}else{
					CountryProxy.send_COUNTRY_APPLY_LIST(0,this.m_jobId);
				}
			}
		}
	}
}